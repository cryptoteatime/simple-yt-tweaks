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

function fillPolygon(pixels, size, points, color) {
  const minX = Math.floor(Math.min(...points.map(([x]) => x)));
  const maxX = Math.ceil(Math.max(...points.map(([x]) => x)));
  const minY = Math.floor(Math.min(...points.map(([, y]) => y)));
  const maxY = Math.ceil(Math.max(...points.map(([, y]) => y)));

  for (let py = minY; py <= maxY; py += 1) {
    for (let px = minX; px <= maxX; px += 1) {
      let inside = false;

      for (let index = 0, previous = points.length - 1; index < points.length; previous = index, index += 1) {
        const [ix, iy] = points[index];
        const [jx, jy] = points[previous];
        const intersects = iy > py !== jy > py && px < ((jx - ix) * (py - iy)) / (jy - iy) + ix;
        if (intersects) inside = !inside;
      }

      if (inside) {
        blendPixel(pixels, size, px, py, color);
      }
    }
  }
}

function downsample(pixels, sourceSize, outputSize, scale) {
  const output = Buffer.alloc(outputSize * outputSize * 4);

  for (let y = 0; y < outputSize; y += 1) {
    for (let x = 0; x < outputSize; x += 1) {
      const totals = [0, 0, 0, 0];

      for (let sy = 0; sy < scale; sy += 1) {
        for (let sx = 0; sx < scale; sx += 1) {
          const sourceOffset = ((y * scale + sy) * sourceSize + x * scale + sx) * 4;
          totals[0] += pixels[sourceOffset];
          totals[1] += pixels[sourceOffset + 1];
          totals[2] += pixels[sourceOffset + 2];
          totals[3] += pixels[sourceOffset + 3];
        }
      }

      const outputOffset = (y * outputSize + x) * 4;
      const divisor = scale * scale;
      output[outputOffset] = Math.round(totals[0] / divisor);
      output[outputOffset + 1] = Math.round(totals[1] / divisor);
      output[outputOffset + 2] = Math.round(totals[2] / divisor);
      output[outputOffset + 3] = Math.round(totals[3] / divisor);
    }
  }

  return output;
}

function drawIcon(size) {
  const scale = 4;
  const canvasSize = size * scale;
  const pixels = Buffer.alloc(canvasSize * canvasSize * 4);
  const unit = canvasSize / 128;

  const shadowOffset = 4 * unit;
  fillRoundedRect(pixels, canvasSize, 9 * unit + shadowOffset, 22 * unit + shadowOffset, 110 * unit, 78 * unit, 20 * unit, [0, 0, 0, 46]);
  fillRoundedRect(pixels, canvasSize, 9 * unit, 22 * unit, 110 * unit, 78 * unit, 20 * unit, [255, 0, 0, 255]);
  fillRoundedRect(pixels, canvasSize, 12 * unit, 25 * unit, 104 * unit, 72 * unit, 17 * unit, [255, 24, 24, 255]);

  fillPolygon(
    pixels,
    canvasSize,
    [
      [51 * unit, 43 * unit],
      [51 * unit, 79 * unit],
      [82 * unit, 61 * unit],
    ],
    [255, 255, 255, 255],
  );

  const badgeX = 60 * unit;
  const badgeY = 67 * unit;
  const badgeWidth = 57 * unit;
  const badgeHeight = 45 * unit;
  fillRoundedRect(pixels, canvasSize, badgeX + 3 * unit, badgeY + 3 * unit, badgeWidth, badgeHeight, 13 * unit, [0, 0, 0, 60]);
  fillRoundedRect(pixels, canvasSize, badgeX, badgeY, badgeWidth, badgeHeight, 13 * unit, [18, 20, 24, 242]);

  const trackHeight = Math.max(2 * unit, 3 * unit);
  const trackRadius = trackHeight / 2;
  const trackX = badgeX + 11 * unit;
  const trackWidth = badgeWidth - 22 * unit;
  const topTrackY = badgeY + 14 * unit;
  const bottomTrackY = badgeY + 29 * unit;
  fillRoundedRect(pixels, canvasSize, trackX, topTrackY, trackWidth, trackHeight, trackRadius, [255, 255, 255, 235]);
  fillRoundedRect(pixels, canvasSize, trackX, bottomTrackY, trackWidth, trackHeight, trackRadius, [255, 255, 255, 235]);
  fillCircle(pixels, canvasSize, trackX + trackWidth * 0.72, topTrackY + trackHeight / 2, 5.5 * unit, [255, 255, 255, 255]);
  fillCircle(pixels, canvasSize, trackX + trackWidth * 0.35, bottomTrackY + trackHeight / 2, 5.5 * unit, [255, 255, 255, 255]);

  return downsample(pixels, canvasSize, size, scale);
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
