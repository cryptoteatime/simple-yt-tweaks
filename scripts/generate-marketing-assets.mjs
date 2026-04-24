import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const promoDir = resolve(root, 'store-assets', 'promo');
const repoDir = resolve(root, 'store-assets', 'repo');
const popupDir = resolve(root, 'store-assets', 'popup');

const generalPopup = resolve(popupDir, 'general-tab-source.png');
const sidebarPopup = resolve(popupDir, 'sidebar-tab-source.png');
const modesPopup = resolve(popupDir, 'modes-tab-source.png');

mkdirSync(promoDir, { recursive: true });
mkdirSync(repoDir, { recursive: true });

function pngDataUri(path) {
  const buffer = readFileSync(path);
  return `data:image/png;base64,${buffer.toString('base64')}`;
}

function writeSvgAndPng(svgPath, pngPath, svg) {
  writeFileSync(svgPath, `${svg.trim()}\n`);

  const result = spawnSync('sips', ['-s', 'format', 'png', svgPath, '--out', pngPath], {
    stdio: 'pipe',
  });

  if (result.status !== 0) {
    throw new Error(`Failed to render ${pngPath}: ${result.stderr.toString()}`);
  }
}

const generalUri = pngDataUri(generalPopup);
const sidebarUri = pngDataUri(sidebarPopup);
const modesUri = pngDataUri(modesPopup);

function frame(x, y, width, height, radius, imageHref, rotate = 0) {
  const clipId = `clip-${x}-${y}-${width}-${height}`.replace(/[^\w-]/g, '');
  const transform = rotate
    ? ` transform="rotate(${rotate} ${x + width / 2} ${y + height / 2})"`
    : '';

  return `
    <defs>
      <clipPath id="${clipId}">
        <rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${radius}" />
      </clipPath>
    </defs>
    <g${transform}>
      <rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${radius}" fill="#0F141C" stroke="#2A3341" />
      <image href="${imageHref}" x="${x}" y="${y}" width="${width}" height="${height}" preserveAspectRatio="xMidYMid meet" clip-path="url(#${clipId})" />
    </g>
  `;
}

const promoSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="440" height="280" viewBox="0 0 440 280" fill="none">
  <defs>
    <linearGradient id="promoBg" x1="26" y1="24" x2="404" y2="260" gradientUnits="userSpaceOnUse">
      <stop stop-color="#131821"/>
      <stop offset="1" stop-color="#090D13"/>
    </linearGradient>
    <filter id="promoShadow" x="-20" y="-20" width="480" height="320" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feDropShadow dx="0" dy="14" stdDeviation="18" flood-color="#000000" flood-opacity="0.28"/>
    </filter>
  </defs>

  <rect width="440" height="280" rx="28" fill="url(#promoBg)"/>
  <rect x="1" y="1" width="438" height="278" rx="27" stroke="#202734"/>

  <g transform="translate(30 30)">
    <rect width="138" height="30" rx="15" fill="#121823" stroke="#273040"/>
    <circle cx="21" cy="15" r="7" fill="#42DCC0"/>
    <text x="37" y="20" fill="#F4F7FB" font-family="Inter, Arial, sans-serif" font-size="15" font-weight="800">Simple YT Tweaks</text>

    <text x="0" y="72" fill="#F4F7FB" font-family="Inter, Arial, sans-serif" font-size="28" font-weight="800">Cleaner YouTube</text>
    <text x="0" y="104" fill="#F4F7FB" font-family="Inter, Arial, sans-serif" font-size="28" font-weight="800">controls.</text>

    <text x="0" y="140" fill="#AAB5C4" font-family="Inter, Arial, sans-serif" font-size="13" font-weight="500">Modes, sidebar cleanup, Shorts hiding,</text>
    <text x="0" y="159" fill="#AAB5C4" font-family="Inter, Arial, sans-serif" font-size="13" font-weight="500">sponsored cleanup, and browser PiP.</text>

    <g transform="translate(0 188)">
      <rect width="74" height="24" rx="12" fill="#141B24" stroke="#2B3441"/>
      <text x="18" y="16" fill="#F4F7FB" font-family="Inter, Arial, sans-serif" font-size="10.5" font-weight="700">General</text>
      <rect x="82" width="72" height="24" rx="12" fill="#141B24" stroke="#2B3441"/>
      <text x="102" y="16" fill="#F4F7FB" font-family="Inter, Arial, sans-serif" font-size="10.5" font-weight="700">Sidebar</text>
      <rect x="162" width="62" height="24" rx="12" fill="#141B24" stroke="#2B3441"/>
      <text x="184" y="16" fill="#F4F7FB" font-family="Inter, Arial, sans-serif" font-size="10.5" font-weight="700">Modes</text>
    </g>
  </g>

  <g filter="url(#promoShadow)">
    ${frame(246, 34, 166, 154, 18, generalUri)}
  </g>

  <g transform="translate(262 197)">
    <rect width="134" height="28" rx="14" fill="#121823" stroke="#273040"/>
    <text x="29" y="18.5" fill="#F4F7FB" font-family="Inter, Arial, sans-serif" font-size="11.5" font-weight="700">Actual popup UI</text>
  </g>
</svg>
`;

const mainBannerSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="640" viewBox="0 0 1280 640" fill="none">
  <defs>
    <linearGradient id="mainBg" x1="64" y1="44" x2="1188" y2="604" gradientUnits="userSpaceOnUse">
      <stop stop-color="#131820"/>
      <stop offset="1" stop-color="#090C12"/>
    </linearGradient>
    <filter id="mainShadow" x="0" y="0" width="1280" height="640" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feDropShadow dx="0" dy="24" stdDeviation="32" flood-color="#000000" flood-opacity="0.3"/>
    </filter>
  </defs>

  <rect width="1280" height="640" rx="32" fill="url(#mainBg)"/>
  <rect x="1" y="1" width="1278" height="638" rx="31" stroke="#1F2632"/>

  <g transform="translate(68 62)">
    <rect width="164" height="34" rx="17" fill="#121823" stroke="#273040"/>
    <circle cx="27" cy="17" r="8" fill="#42DCC0"/>
    <text x="44" y="22" fill="#F4F7FB" font-family="Inter, Arial, sans-serif" font-size="16" font-weight="800">Simple YT Tweaks</text>
  </g>

  <text x="68" y="182" fill="#F6F9FC" font-family="Inter, Arial, sans-serif" font-size="62" font-weight="800">A cleaner YouTube</text>
  <text x="68" y="252" fill="#F6F9FC" font-family="Inter, Arial, sans-serif" font-size="62" font-weight="800">watching experience.</text>

  <text x="68" y="318" fill="#A8B3C2" font-family="Inter, Arial, sans-serif" font-size="22" font-weight="500">Built around focused popup controls for General, Sidebar, and Modes.</text>
  <text x="68" y="350" fill="#A8B3C2" font-family="Inter, Arial, sans-serif" font-size="22" font-weight="500">No guesswork here: the visuals below are the actual extension UI.</text>

  <g transform="translate(68 402)">
    <rect width="154" height="36" rx="18" fill="#141B24" stroke="#2B3441"/>
    <text x="36" y="24" fill="#F4F7FB" font-family="Inter, Arial, sans-serif" font-size="16" font-weight="700">General tab</text>
    <rect x="168" width="156" height="36" rx="18" fill="#141B24" stroke="#2B3441"/>
    <text x="206" y="24" fill="#F4F7FB" font-family="Inter, Arial, sans-serif" font-size="16" font-weight="700">Sidebar tab</text>
    <rect x="338" width="146" height="36" rx="18" fill="#141B24" stroke="#2B3441"/>
    <text x="374" y="24" fill="#F4F7FB" font-family="Inter, Arial, sans-serif" font-size="16" font-weight="700">Modes tab</text>
  </g>

  <g filter="url(#mainShadow)">
    ${frame(760, 134, 308, 286, 22, generalUri)}
    ${frame(972, 92, 198, 261, 22, sidebarUri, 2.5)}
    ${frame(918, 390, 210, 195, 22, modesUri, -2.5)}
  </g>
</svg>
`;

function featureBanner({ title, summaryA, summaryB, chipA, chipB, chipC, imageHref, svgPath, pngPath }) {
  return {
    svgPath,
    pngPath,
    svg: `
<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="640" viewBox="0 0 1280 640" fill="none">
  <defs>
    <linearGradient id="featureBg" x1="64" y1="48" x2="1188" y2="604" gradientUnits="userSpaceOnUse">
      <stop stop-color="#131821"/>
      <stop offset="1" stop-color="#090D13"/>
    </linearGradient>
    <filter id="featureShadow" x="0" y="0" width="1280" height="640" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feDropShadow dx="0" dy="24" stdDeviation="30" flood-color="#000000" flood-opacity="0.3"/>
    </filter>
  </defs>

  <rect width="1280" height="640" rx="32" fill="url(#featureBg)"/>
  <rect x="1" y="1" width="1278" height="638" rx="31" stroke="#202733"/>

  <g transform="translate(70 68)">
    <rect width="148" height="34" rx="17" fill="#121823" stroke="#273040"/>
    <circle cx="27" cy="17" r="8" fill="#42DCC0"/>
    <text x="44" y="22" fill="#F4F7FB" font-family="Inter, Arial, sans-serif" font-size="16" font-weight="800">Actual popup UI</text>
  </g>

  <text x="70" y="204" fill="#F6F9FC" font-family="Inter, Arial, sans-serif" font-size="64" font-weight="800">${title}</text>
  <text x="70" y="278" fill="#A8B3C2" font-family="Inter, Arial, sans-serif" font-size="24" font-weight="500">${summaryA}</text>
  <text x="70" y="312" fill="#A8B3C2" font-family="Inter, Arial, sans-serif" font-size="24" font-weight="500">${summaryB}</text>

  <g transform="translate(70 380)">
    <rect width="168" height="38" rx="19" fill="#141B24" stroke="#2B3441"/>
    <text x="28" y="25" fill="#F4F7FB" font-family="Inter, Arial, sans-serif" font-size="16" font-weight="700">${chipA}</text>
    <rect x="184" width="172" height="38" rx="19" fill="#141B24" stroke="#2B3441"/>
    <text x="211" y="25" fill="#F4F7FB" font-family="Inter, Arial, sans-serif" font-size="16" font-weight="700">${chipB}</text>
    <rect x="372" width="160" height="38" rx="19" fill="#141B24" stroke="#2B3441"/>
    <text x="410" y="25" fill="#F4F7FB" font-family="Inter, Arial, sans-serif" font-size="16" font-weight="700">${chipC}</text>
  </g>

  <g filter="url(#featureShadow)">
    ${frame(786, 88, 420, 392, 26, imageHref)}
  </g>
</svg>
`,
  };
}

const featureGeneral = featureBanner({
  title: 'General controls',
  summaryA: 'Tune the home feed layout, hide Shorts and sponsored posts,',
  summaryB: 'and keep the real browser PiP button one click away.',
  chipA: 'Feed columns',
  chipB: 'Shorts hiding',
  chipC: 'Browser PiP',
  imageHref: generalUri,
  svgPath: resolve(repoDir, 'feature-general-1280x640.svg'),
  pngPath: resolve(repoDir, 'feature-general-1280x640.png'),
});

const featureSidebar = featureBanner({
  title: 'Sidebar cleanup',
  summaryA: 'Clean up the guide with focused section-level toggles',
  summaryB: 'without changing the rest of your YouTube layout.',
  chipA: 'Hide sections',
  chipB: 'Cleaner guide',
  chipC: 'Less noise',
  imageHref: sidebarUri,
  svgPath: resolve(repoDir, 'feature-sidebar-1280x640.svg'),
  pngPath: resolve(repoDir, 'feature-sidebar-1280x640.png'),
});

const featureModes = featureBanner({
  title: 'Modes by context',
  summaryA: 'Separate Theater, Default, and Fullscreen behavior so',
  summaryB: 'watch pages can feel different depending on how you use them.',
  chipA: 'Theater mode',
  chipB: 'Default mode',
  chipC: 'Fullscreen',
  imageHref: modesUri,
  svgPath: resolve(repoDir, 'feature-modes-1280x640.svg'),
  pngPath: resolve(repoDir, 'feature-modes-1280x640.png'),
});

writeSvgAndPng(
  resolve(promoDir, 'small-promo-tile-440x280.svg'),
  resolve(promoDir, 'small-promo-tile-440x280.png'),
  promoSvg,
);

writeSvgAndPng(
  resolve(repoDir, 'readme-banner-1280x640.svg'),
  resolve(repoDir, 'readme-banner-1280x640.png'),
  mainBannerSvg,
);

for (const asset of [featureGeneral, featureSidebar, featureModes]) {
  writeSvgAndPng(asset.svgPath, asset.pngPath, asset.svg);
}

console.log('Generated marketing assets from real popup screenshots.');
