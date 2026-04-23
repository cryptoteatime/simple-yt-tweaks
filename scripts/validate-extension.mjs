import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const distDir = resolve(root, 'dist');
const releaseDir = resolve(root, 'release');
const packageJsonPath = resolve(root, 'package.json');
const packageLockPath = resolve(root, 'package-lock.json');
const manifestPath = resolve(distDir, 'manifest.json');
const screenshotsDir = resolve(root, 'store-assets', 'screenshots');
const promoTilePath = resolve(root, 'store-assets', 'promo', 'small-promo-tile-440x280.png');
const packagedMode = process.argv.includes('--packaged');

const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
const packageLock = JSON.parse(readFileSync(packageLockPath, 'utf8'));
const failures = [];

function fail(message) {
  failures.push(message);
}

function assertExists(path, label) {
  if (!existsSync(path)) {
    fail(`${label} is missing: ${path}`);
  }
}

function readPngSize(path) {
  const buffer = readFileSync(path);
  const signature = '89504e470d0a1a0a';
  if (buffer.subarray(0, 8).toString('hex') !== signature) {
    fail(`${path} is not a PNG file`);
    return null;
  }

  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  };
}

function assertPngSize(path, width, height, label) {
  assertExists(path, label);
  if (!existsSync(path)) return;

  const dimensions = readPngSize(path);
  if (!dimensions) return;

  if (dimensions.width !== width || dimensions.height !== height) {
    fail(`${label} must be ${width}x${height}`);
  }
}

function assertScreenshotDirectory() {
  assertExists(screenshotsDir, 'Store screenshots directory');
  if (!existsSync(screenshotsDir)) return;

  const screenshots = readdirSync(screenshotsDir)
    .filter((file) => file.toLowerCase().endsWith('.png'))
    .sort();

  if (screenshots.length === 0) {
    fail('At least one store screenshot is required in store-assets/screenshots');
    return;
  }

  for (const screenshot of screenshots) {
    const screenshotPath = resolve(screenshotsDir, screenshot);
    const dimensions = readPngSize(screenshotPath);
    if (!dimensions) continue;

    const validSize =
      (dimensions.width === 1280 && dimensions.height === 800) ||
      (dimensions.width === 640 && dimensions.height === 400);

    if (!validSize) {
      fail(`Store screenshot ${screenshot} must be 1280x800 or 640x400`);
    }
  }
}

assertExists(resolve(root, 'README.md'), 'README');
assertExists(resolve(root, 'CHANGELOG.md'), 'CHANGELOG');
assertExists(resolve(root, 'PRIVACY.md'), 'PRIVACY');
assertExists(resolve(root, 'LICENSE'), 'LICENSE');
assertExists(resolve(root, 'WEBSTORE.md'), 'WEBSTORE');
assertPngSize(promoTilePath, 440, 280, 'Small promo tile');
assertScreenshotDirectory();
assertExists(manifestPath, 'Built manifest');

if (packageLock.version !== packageJson.version) {
  fail('package-lock.json version must match package.json');
}

if (packageLock.packages?.['']?.version !== packageJson.version) {
  fail('package-lock.json packages[""] version must match package.json');
}

if (failures.length === 0) {
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));

  if (manifest.manifest_version !== 3) fail('manifest_version must be 3');
  if (manifest.name !== 'Simple YT Tweaks') fail('manifest name must be Simple YT Tweaks');
  if (manifest.version !== packageJson.version) fail('manifest version must match package.json');
  if (manifest.description !== packageJson.description) fail('manifest description must match package.json');

  const permissions = manifest.permissions ?? [];
  if (JSON.stringify(permissions) !== JSON.stringify(['storage'])) {
    fail('permissions must be exactly ["storage"]');
  }

  const hostPermissions = manifest.host_permissions ?? [];
  if (JSON.stringify(hostPermissions) !== JSON.stringify(['https://www.youtube.com/*'])) {
    fail('host_permissions must be exactly ["https://www.youtube.com/*"]');
  }

  const popupPath = manifest.action?.default_popup;
  if (!popupPath) {
    fail('action.default_popup is required');
  } else {
    assertExists(resolve(distDir, popupPath), 'Popup HTML');
  }

  const contentScript = manifest.content_scripts?.[0]?.js?.[0];
  if (contentScript !== 'content/content.js') {
    fail('content script must be content/content.js');
  } else {
    const contentPath = resolve(distDir, contentScript);
    assertExists(contentPath, 'Content script');
    if (existsSync(contentPath)) {
      const content = readFileSync(contentPath, 'utf8');
      if (/^\s*(import|export)\s/m.test(content)) {
        fail('content/content.js must be self-contained and must not contain module import/export statements');
      }
    }
  }

  for (const size of [16, 32, 48, 128]) {
    const iconPath = manifest.icons?.[size];
    const actionIconPath = manifest.action?.default_icon?.[size];
    if (iconPath !== `icons/icon${size}.png`) fail(`icons.${size} must be icons/icon${size}.png`);
    if (actionIconPath !== `icons/icon${size}.png`) fail(`action.default_icon.${size} must be icons/icon${size}.png`);

    assertPngSize(resolve(distDir, `icons/icon${size}.png`), size, size, `${size}px icon`);
  }
}

if (packagedMode) {
  const expectedZipPath = resolve(releaseDir, `simple-yt-tweaks-v${packageJson.version}.zip`);
  assertExists(expectedZipPath, 'Packaged release zip');
}

if (failures.length > 0) {
  console.error('Extension validation failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`Extension validation passed${packagedMode ? ' (packaged)' : ''}.`);
