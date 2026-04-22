import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { deflateSync } from 'node:zlib';

const sizes = [16, 32, 48, 128];
const outputDir = resolve('public/icons');

const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n += 1) {
  let c = n;
  for (let k = 0; k < 8; k += 1) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[n] = c >>> 0;
}

function crc32(buffer) {
  let c = 0xffffffff;
  for (const byte of buffer) {
    c = crcTable[(c ^ byte) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBuffer = Buffer.from(type);
  const length = Buffer.alloc(4);
  const crc = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])), 0);
  return Buffer.concat([length, typeBuffer, data, crc]);
}

function blendPixel(pixels, size, x, y, color) {
  if (x < 0 || y < 0 || x >= size || y >= size) return;

  const offset = (y * size + x) * 4;
  const alpha = color[3] / 255;
  const inverse = 1 - alpha;

  pixels[offset] = Math.round(color[0] * alpha + pixels[offset] * inverse);
  pixels[offset + 1] = Math.round(color[1] * alpha + pixels[offset + 1] * inverse);
  pixels[offset + 2] = Math.round(color[2] * alpha + pixels[offset + 2] * inverse);
  pixels[offset + 3] = Math.min(255, Math.round(color[3] + pixels[offset + 3] * inverse));
}

function fillRoundedRect(pixels, size, x, y, width, height, radius, color) {
  for (let py = Math.floor(y); py < Math.ceil(y + height); py += 1) {
    for (let px = Math.floor(x); px < Math.ceil(x + width); px += 1) {
      const nearestX = Math.max(x + radius, Math.min(px, x + width - radius));
      const nearestY = Math.max(y + radius, Math.min(py, y + height - radius));
      const distance = Math.hypot(px - nearestX, py - nearestY);
      if (distance <= radius) {
        blendPixel(pixels, size, px, py, color);
      }
    }
  }
}

function fillCircle(pixels, size, cx, cy, radius, color) {
  for (let py = Math.floor(cy - radius); py <= Math.ceil(cy + radius); py += 1) {
    for (let px = Math.floor(cx - radius); px <= Math.ceil(cx + radius); px += 1) {
      if (Math.hypot(px - cx, py - cy) <= radius) {
        blendPixel(pixels, size, px, py, color);
      }
    }
  }
}

function drawIcon(size) {
  const pixels = Buffer.alloc(size * size * 4);
  const pad = Math.max(1, Math.round(size * 0.12));
  const radius = Math.max(3, Math.round(size * 0.18));

  fillRoundedRect(pixels, size, pad, pad, size - pad * 2, size - pad * 2, radius, [17, 18, 22, 255]);
  fillRoundedRect(
    pixels,
    size,
    pad + 1,
    pad + 1,
    size - pad * 2 - 2,
    size - pad * 2 - 2,
    Math.max(2, radius - 1),
    [29, 32, 40, 255],
  );

  const lineHeight = Math.max(1, Math.round(size * 0.08));
  const lineLength = size - pad * 4;
  const startX = pad * 2;
  const rows = [0.34, 0.5, 0.66].map((value) => Math.round(size * value));
  const colors = [
    [69, 214, 181, 255],
    [255, 107, 107, 255],
    [242, 244, 248, 230],
  ];

  rows.forEach((rowY, index) => {
    fillRoundedRect(pixels, size, startX, rowY, lineLength, lineHeight, lineHeight, colors[index]);
  });

  fillCircle(pixels, size, Math.round(size * 0.66), rows[0] + lineHeight / 2, Math.max(2, size * 0.09), [242, 244, 248, 255]);
  fillCircle(pixels, size, Math.round(size * 0.42), rows[1] + lineHeight / 2, Math.max(2, size * 0.09), [242, 244, 248, 255]);
  fillCircle(pixels, size, Math.round(size * 0.76), rows[2] + lineHeight / 2, Math.max(2, size * 0.09), [69, 214, 181, 255]);

  return pixels;
}

function encodePng(size, pixels) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const raw = Buffer.alloc((size * 4 + 1) * size);
  for (let y = 0; y < size; y += 1) {
    const rowStart = y * (size * 4 + 1);
    raw[rowStart] = 0;
    pixels.copy(raw, rowStart + 1, y * size * 4, (y + 1) * size * 4);
  }

  return Buffer.concat([
    signature,
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

mkdirSync(outputDir, { recursive: true });

for (const size of sizes) {
  const outputPath = resolve(outputDir, `icon${size}.png`);
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, encodePng(size, drawIcon(size)));
  console.log(`Wrote ${outputPath}`);
}
