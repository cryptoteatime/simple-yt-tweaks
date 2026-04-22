import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const distDir = resolve(root, 'dist');
const packageJson = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'));
const manifestPath = resolve(distDir, 'manifest.json');

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

assertExists(manifestPath, 'Built manifest');

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

    const builtIconPath = resolve(distDir, `icons/icon${size}.png`);
    assertExists(builtIconPath, `${size}px icon`);

    if (existsSync(builtIconPath)) {
      const dimensions = readPngSize(builtIconPath);
      if (dimensions && (dimensions.width !== size || dimensions.height !== size)) {
        fail(`icons/icon${size}.png must be ${size}x${size}`);
      }
    }
  }
}

if (failures.length > 0) {
  console.error('Extension validation failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('Extension validation passed.');
