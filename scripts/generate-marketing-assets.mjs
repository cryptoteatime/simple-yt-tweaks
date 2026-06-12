import { spawnSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const promoDir = resolve(root, 'store-assets', 'promo');
const repoDir = resolve(root, 'store-assets', 'repo');
const popupDir = resolve(root, 'store-assets', 'popup');
const screenshotsDir = resolve(root, 'store-assets', 'screenshots');
const iconPath = resolve(root, 'public', 'icons', 'icon128.png');

const sourcePaths = {
  general: resolve(popupDir, 'general-tab-source.png'),
  sidebar: resolve(popupDir, 'sidebar-tab-source.png'),
  modes: resolve(popupDir, 'modes-tab-source.png'),
};

for (const directory of [promoDir, repoDir, screenshotsDir]) {
  mkdirSync(directory, { recursive: true });
}

function pngDataUri(path) {
  const buffer = readFileSync(path);
  return `data:image/png;base64,${buffer.toString('base64')}`;
}

function writeSvgAndPng(svgPath, pngPath, svg) {
  const cleanSvg = svg
    .trim()
    .split('\n')
    .map((line) => line.trimEnd())
    .join('\n');

  writeFileSync(svgPath, `${cleanSvg}\n`);

  const result = spawnSync('sips', ['-s', 'format', 'png', svgPath, '--out', pngPath], {
    stdio: 'pipe',
  });

  if (result.status !== 0) {
    throw new Error(`Failed to render ${pngPath}: ${result.stderr.toString()}`);
  }
}

const iconUri = pngDataUri(iconPath);
const popupUri = {
  general: pngDataUri(sourcePaths.general),
  sidebar: pngDataUri(sourcePaths.sidebar),
  modes: pngDataUri(sourcePaths.modes),
};

let clipIndex = 0;

function clipId(prefix) {
  clipIndex += 1;
  return `${prefix}-${clipIndex}`;
}

function defs() {
  return `
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#191D24"/>
      <stop offset="0.58" stop-color="#0F131A"/>
      <stop offset="1" stop-color="#080B10"/>
    </linearGradient>
    <linearGradient id="redGlow" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#FF2B2B"/>
      <stop offset="1" stop-color="#B8121F"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="150%" color-interpolation-filters="sRGB">
      <feDropShadow dx="0" dy="24" stdDeviation="24" flood-color="#000000" flood-opacity="0.34"/>
    </filter>
    <filter id="softShadow" x="-20%" y="-20%" width="140%" height="150%" color-interpolation-filters="sRGB">
      <feDropShadow dx="0" dy="12" stdDeviation="14" flood-color="#000000" flood-opacity="0.28"/>
    </filter>
  </defs>`;
}

function background(width, height, radius = 0) {
  return `
  <rect width="${width}" height="${height}" rx="${radius}" fill="url(#bg)"/>
  <rect x="1" y="1" width="${width - 2}" height="${height - 2}" rx="${Math.max(0, radius - 1)}" stroke="#242B36"/>`;
}

function brandLockup(x, y, iconSize, textSize = 22, label = 'Simple YT Tweaks') {
  return `
  <g transform="translate(${x} ${y})">
    <image href="${iconUri}" x="0" y="0" width="${iconSize}" height="${iconSize}"/>
    <text x="${iconSize + 14}" y="${iconSize * 0.43}" fill="#F6F9FC" font-family="Inter, Arial, sans-serif" font-size="${textSize}" font-weight="800">${label}</text>
    <text x="${iconSize + 14}" y="${iconSize * 0.72}" fill="#AEB7C4" font-family="Inter, Arial, sans-serif" font-size="${Math.round(textSize * 0.48)}" font-weight="700" letter-spacing="1.6">YOUTUBE CONTROLS</text>
  </g>`;
}

function imageFrame({ x, y, width, height, radius = 22, href, rotate = 0, fit = 'meet' }) {
  const id = clipId('frame');
  const transform = rotate ? ` transform="rotate(${rotate} ${x + width / 2} ${y + height / 2})"` : '';

  return `
  <g${transform} filter="url(#shadow)">
    <rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${radius}" fill="#11151D" stroke="#2D3745"/>
    <clipPath id="${id}">
      <rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${radius}"/>
    </clipPath>
    <image href="${href}" x="${x}" y="${y}" width="${width}" height="${height}" preserveAspectRatio="xMidYMid ${fit}" clip-path="url(#${id})"/>
  </g>`;
}

function pill(x, y, width, text, color = '#45D6B5') {
  return `
  <g transform="translate(${x} ${y})">
    <rect width="${width}" height="40" rx="20" fill="#151B24" stroke="#303947"/>
    <circle cx="25" cy="20" r="7" fill="${color}"/>
    <text x="44" y="26" fill="#F5F7FA" font-family="Inter, Arial, sans-serif" font-size="17" font-weight="750">${text}</text>
  </g>`;
}

function youtubeShell(x, y, width, height, variant = 'home') {
  const cards = variant === 'home'
    ? [
        [146, 108, 240, 138, '#31495E'],
        [414, 108, 240, 138, '#335044'],
        [682, 108, 240, 138, '#4D3D54'],
        [146, 318, 240, 138, '#4E342E'],
        [414, 318, 240, 138, '#2E4251'],
        [682, 318, 240, 138, '#344A36'],
      ]
    : [
        [146, 120, 270, 154, '#31495E'],
        [446, 120, 270, 154, '#4D3D54'],
        [746, 120, 270, 154, '#335044'],
        [146, 350, 270, 154, '#2E4251'],
        [446, 350, 270, 154, '#4E342E'],
        [746, 350, 270, 154, '#344A36'],
      ];

  const chips = ['All', 'Music', 'Podcasts', 'Gaming', 'Live', 'History', 'News'];
  const cardMarkup = cards
    .map(
      ([cx, cy, cw, ch, color], index) => `
    <g transform="translate(${x + cx} ${y + cy})">
      <rect width="${cw}" height="${ch}" rx="14" fill="${color}"/>
      <rect x="0" y="${ch + 14}" width="${cw * 0.82}" height="16" rx="8" fill="#F1F3F6"/>
      <rect x="0" y="${ch + 40}" width="${cw * 0.54}" height="11" rx="5.5" fill="#9CA6B5"/>
      <circle cx="18" cy="${ch + 72}" r="14" fill="#45D6B5"/>
      <rect x="44" y="${ch + 62}" width="${cw * 0.42}" height="11" rx="5.5" fill="#AEB7C4"/>
      ${variant === 'home' && index === 2 ? '<rect x="12" y="12" width="72" height="24" rx="12" fill="#0C1118" opacity="0.82"/><text x="26" y="29" fill="#F6F9FC" font-family="Inter, Arial, sans-serif" font-size="13" font-weight="800">LIVE</text>' : ''}
    </g>`,
    )
    .join('');

  const chipMarkup = chips
    .map((chip, index) => {
      const chipWidth = index === 0 ? 52 : chip.length * 11 + 30;
      const chipX = x + 146 + index * 104;
      return `<rect x="${chipX}" y="${y + 36}" width="${chipWidth}" height="36" rx="12" fill="${index === 0 ? '#F6F9FC' : '#242932'}"/><text x="${chipX + 18}" y="${y + 60}" fill="${index === 0 ? '#0F1117' : '#F6F9FC'}" font-family="Inter, Arial, sans-serif" font-size="15" font-weight="750">${chip}</text>`;
    })
    .join('');

  return `
  <g filter="url(#shadow)">
    <rect x="${x}" y="${y}" width="${width}" height="${height}" rx="24" fill="#0E1014" stroke="#28313D"/>
    <rect x="${x}" y="${y}" width="${width}" height="86" rx="24" fill="#15191F"/>
    <rect x="${x + 38}" y="${y + 28}" width="36" height="26" rx="7" fill="url(#redGlow)"/>
    <polygon points="${x + 52},${y + 34} ${x + 52},${y + 48} ${x + 65},${y + 41}" fill="#FFFFFF"/>
    <rect x="${x + 240}" y="${y + 23}" width="${width - 430}" height="40" rx="20" fill="#0F1117" stroke="#303844"/>
    <rect x="${x + width - 130}" y="${y + 24}" width="72" height="38" rx="19" fill="#232831"/>
    ${chipMarkup}
    ${cardMarkup}
  </g>`;
}

function watchShell(x, y, width, height) {
  const secondaryX = x + width - 286;
  const rows = [0, 1, 2, 3, 4]
    .map(
      (index) => `
    <g transform="translate(${secondaryX} ${y + 112 + index * 86})">
      <rect width="102" height="58" rx="8" fill="${['#31495E', '#4D3D54', '#335044', '#4E342E', '#2E4251'][index]}"/>
      <rect x="116" y="6" width="132" height="11" rx="5.5" fill="#F1F3F6"/>
      <rect x="116" y="28" width="90" height="9" rx="4.5" fill="#9CA6B5"/>
    </g>`,
    )
    .join('');

  return `
  <g filter="url(#shadow)">
    <rect x="${x}" y="${y}" width="${width}" height="${height}" rx="24" fill="#0E1014" stroke="#28313D"/>
    <rect x="${x}" y="${y}" width="${width}" height="72" rx="24" fill="#15191F"/>
    <rect x="${x + 40}" y="${y + 24}" width="32" height="24" rx="6" fill="url(#redGlow)"/>
    <polygon points="${x + 52},${y + 30} ${x + 52},${y + 43} ${x + 64},${y + 36}" fill="#FFFFFF"/>
    <rect x="${x + 70}" y="${y + 112}" width="${width - 420}" height="324" rx="20" fill="#1E3446"/>
    <rect x="${x + 70}" y="${y + 458}" width="520" height="22" rx="11" fill="#F1F3F6"/>
    <rect x="${x + 70}" y="${y + 494}" width="300" height="14" rx="7" fill="#AEB7C4"/>
    <rect x="${x + 70}" y="${y + 538}" width="640" height="48" rx="24" fill="#1B2029"/>
    ${rows}
  </g>`;
}

function baseSvg(width, height, body, radius = 0) {
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none">
  ${defs()}
  ${background(width, height, radius)}
  ${body}
</svg>`;
}

function promoTile() {
  return baseSvg(
    440,
    280,
    `
    ${brandLockup(26, 24, 46, 16)}
    <text x="30" y="112" fill="#F6F9FC" font-family="Inter, Arial, sans-serif" font-size="30" font-weight="850">Cleaner controls</text>
    <text x="30" y="145" fill="#F6F9FC" font-family="Inter, Arial, sans-serif" font-size="30" font-weight="850">for YouTube.</text>
    <text x="30" y="184" fill="#B6C0CE" font-family="Inter, Arial, sans-serif" font-size="14" font-weight="600">Sidebar, modes, PiP, Shorts cleanup.</text>
    ${imageFrame({ x: 298, y: 70, width: 104, height: 134, radius: 14, href: popupUri.general })}
  `,
  );
}

function marqueePromo() {
  return baseSvg(
    1400,
    560,
    `
    ${brandLockup(78, 72, 82, 31)}
    <text x="82" y="232" fill="#F6F9FC" font-family="Inter, Arial, sans-serif" font-size="70" font-weight="850">Clean up YouTube</text>
    <text x="82" y="310" fill="#F6F9FC" font-family="Inter, Arial, sans-serif" font-size="70" font-weight="850">without extra noise.</text>
    <text x="86" y="372" fill="#B6C0CE" font-family="Inter, Arial, sans-serif" font-size="26" font-weight="600">Focused controls for sidebar cleanup, watch modes, Sticky Player, and browser PiP.</text>
    ${pill(86, 424, 164, 'Manifest V3', '#FF3131')}
    ${pill(270, 424, 160, 'Local settings')}
    ${pill(450, 424, 142, 'No tracking')}
    ${imageFrame({ x: 930, y: 72, width: 294, height: 378, radius: 26, href: popupUri.modes })}
    ${imageFrame({ x: 766, y: 156, width: 230, height: 296, radius: 24, href: popupUri.general, rotate: -5 })}
  `,
  );
}

function readmeBanner() {
  return baseSvg(
    1280,
    640,
    `
    ${brandLockup(68, 62, 70, 28)}
    <text x="72" y="224" fill="#F6F9FC" font-family="Inter, Arial, sans-serif" font-size="66" font-weight="850">Simple controls for</text>
    <text x="72" y="300" fill="#F6F9FC" font-family="Inter, Arial, sans-serif" font-size="66" font-weight="850">a calmer YouTube.</text>
    <text x="76" y="364" fill="#B6C0CE" font-family="Inter, Arial, sans-serif" font-size="24" font-weight="600">Tune home, sidebar, watch pages, Theater, Fullscreen, Sticky Player, and PiP.</text>
    ${pill(76, 424, 152, 'No tracking', '#FF3131')}
    ${pill(246, 424, 156, 'MV3 extension')}
    ${pill(420, 424, 178, 'Chrome + Brave')}
    ${imageFrame({ x: 800, y: 118, width: 300, height: 386, radius: 26, href: popupUri.general })}
    ${imageFrame({ x: 1010, y: 88, width: 190, height: 246, radius: 22, href: popupUri.sidebar, rotate: 4 })}
  `,
    32,
  );
}

function featureCard({ title, lineA, lineB, chips, href }) {
  return baseSvg(
    1280,
    640,
    `
    ${brandLockup(70, 70, 54, 22, 'Actual extension controls')}
    <text x="72" y="220" fill="#F6F9FC" font-family="Inter, Arial, sans-serif" font-size="64" font-weight="850">${title}</text>
    <text x="76" y="288" fill="#B6C0CE" font-family="Inter, Arial, sans-serif" font-size="25" font-weight="600">${lineA}</text>
    <text x="76" y="324" fill="#B6C0CE" font-family="Inter, Arial, sans-serif" font-size="25" font-weight="600">${lineB}</text>
    ${chips.map((chip, index) => pill(76 + index * 186, 398, 166, chip, index === 0 ? '#FF3131' : '#45D6B5')).join('')}
    ${imageFrame({ x: 792, y: 90, width: 390, height: 430, radius: 28, href })}
  `,
    32,
  );
}

function screenshotPopup({ title, lineA, lineB, href }) {
  return baseSvg(
    1280,
    800,
    `
    ${brandLockup(70, 62, 58, 23, 'Simple YT Tweaks')}
    <text x="74" y="214" fill="#F6F9FC" font-family="Inter, Arial, sans-serif" font-size="64" font-weight="850">${title}</text>
    <text x="78" y="284" fill="#B6C0CE" font-family="Inter, Arial, sans-serif" font-size="25" font-weight="600">${lineA}</text>
    <text x="78" y="320" fill="#B6C0CE" font-family="Inter, Arial, sans-serif" font-size="25" font-weight="600">${lineB}</text>
    ${imageFrame({ x: 766, y: 74, width: 390, height: 508, radius: 28, href })}
  `,
  );
}

function screenshotHome() {
  return baseSvg(
    1280,
    800,
    `
    ${youtubeShell(72, 80, 1136, 580, 'home')}
    <rect x="86" y="610" width="460" height="92" rx="22" fill="#111722" stroke="#2D3745" filter="url(#softShadow)"/>
    <text x="120" y="648" fill="#F6F9FC" font-family="Inter, Arial, sans-serif" font-size="27" font-weight="850">Home and Search cleanup</text>
    <text x="120" y="681" fill="#B6C0CE" font-family="Inter, Arial, sans-serif" font-size="18" font-weight="600">Feed columns, Shorts hiding, and sponsored cleanup stay focused.</text>
  `,
  );
}

function screenshotWatch() {
  return baseSvg(
    1280,
    800,
    `
    ${watchShell(72, 80, 1136, 580)}
    <rect x="86" y="610" width="496" height="92" rx="22" fill="#111722" stroke="#2D3745" filter="url(#softShadow)"/>
    <text x="120" y="648" fill="#F6F9FC" font-family="Inter, Arial, sans-serif" font-size="27" font-weight="850">Watch-page modes</text>
    <text x="120" y="681" fill="#B6C0CE" font-family="Inter, Arial, sans-serif" font-size="18" font-weight="600">Separate Default, Theater, Fullscreen, live chat, and Sticky Player controls.</text>
  `,
  );
}

const assets = [
  [resolve(promoDir, 'small-promo-tile-440x280.svg'), resolve(promoDir, 'small-promo-tile-440x280.png'), promoTile()],
  [resolve(promoDir, 'marquee-promo-1400x560.svg'), resolve(promoDir, 'marquee-promo-1400x560.png'), marqueePromo()],
  [resolve(repoDir, 'readme-banner-1280x640.svg'), resolve(repoDir, 'readme-banner-1280x640.png'), readmeBanner()],
  [
    resolve(repoDir, 'feature-general-1280x640.svg'),
    resolve(repoDir, 'feature-general-1280x640.png'),
    featureCard({
      title: 'General controls',
      lineA: 'Set feed columns, hide Shorts and sponsored posts,',
      lineB: 'and keep browser Picture-in-Picture close by.',
      chips: ['Feed columns', 'Shorts', 'PiP'],
      href: popupUri.general,
    }),
  ],
  [
    resolve(repoDir, 'feature-sidebar-1280x640.svg'),
    resolve(repoDir, 'feature-sidebar-1280x640.png'),
    featureCard({
      title: 'Sidebar cleanup',
      lineA: 'Keep the guide focused with section-level controls',
      lineB: 'that leave YouTube navigation intact.',
      chips: ['Guide', 'Sections', 'Shorts'],
      href: popupUri.sidebar,
    }),
  ],
  [
    resolve(repoDir, 'feature-modes-1280x640.svg'),
    resolve(repoDir, 'feature-modes-1280x640.png'),
    featureCard({
      title: 'Modes by context',
      lineA: 'Tune Default, Theater, and Fullscreen separately',
      lineB: 'for the way you actually watch.',
      chips: ['Theater', 'Default', 'Fullscreen'],
      href: popupUri.modes,
    }),
  ],
  [
    resolve(screenshotsDir, 'general-settings-1280x800.svg'),
    resolve(screenshotsDir, 'general-settings-1280x800.png'),
    screenshotPopup({
      title: 'General settings',
      lineA: 'Home feed columns, Shorts cleanup, sponsored hiding,',
      lineB: 'end-screen cleanup, and browser Picture-in-Picture.',
      href: popupUri.general,
    }),
  ],
  [
    resolve(screenshotsDir, 'sidebar-cleanup-1280x800.svg'),
    resolve(screenshotsDir, 'sidebar-cleanup-1280x800.png'),
    screenshotPopup({
      title: 'Sidebar cleanup',
      lineA: 'Trim the left navigation without rewriting YouTube.',
      lineB: 'Keep the sections you use and hide the rest.',
      href: popupUri.sidebar,
    }),
  ],
  [
    resolve(screenshotsDir, 'modes-settings-1280x800.svg'),
    resolve(screenshotsDir, 'modes-settings-1280x800.png'),
    screenshotPopup({
      title: 'Mode-specific controls',
      lineA: 'Separate Default, Theater, and Fullscreen behavior',
      lineB: 'including metadata, live chat, comments, and recommendations.',
      href: popupUri.modes,
    }),
  ],
  [
    resolve(screenshotsDir, 'homepage-cleanup-1280x800.svg'),
    resolve(screenshotsDir, 'homepage-cleanup-1280x800.png'),
    screenshotHome(),
  ],
  [
    resolve(screenshotsDir, 'watch-page-result-1280x800.svg'),
    resolve(screenshotsDir, 'watch-page-result-1280x800.png'),
    screenshotWatch(),
  ],
];

for (const [svgPath, pngPath, svg] of assets) {
  writeSvgAndPng(svgPath, pngPath, svg);
}

console.log('Generated Web Store and repo marketing assets.');
