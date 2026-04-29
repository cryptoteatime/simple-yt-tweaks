import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const distDir = resolve(root, 'dist');
const releaseDir = resolve(root, 'release');
const packageJsonPath = resolve(root, 'package.json');
const packageLockPath = resolve(root, 'package-lock.json');
const manifestPath = resolve(distDir, 'manifest.json');
const sharedSettingsPath = resolve(root, 'src', 'shared', 'settings.ts');
const contentSettingsPath = resolve(root, 'src', 'content', 'settings.ts');
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

function extractTypeBlock(source, typeName) {
  const match = source.match(new RegExp(`type\\s+${typeName}\\s*=\\s*([\\s\\S]*?);`));
  return match?.[1] ?? null;
}

function extractQuotedLiterals(block) {
  return [...block.matchAll(/'([^']+)'/g)].map((match) => match[1]).sort();
}

function extractFeedColumns(source) {
  const block = extractTypeBlock(source, 'FeedColumnCount');
  if (!block) return null;

  return block
    .split('|')
    .map((part) => Number.parseInt(part.trim(), 10))
    .filter((value) => Number.isFinite(value))
    .sort((a, b) => a - b);
}

function extractExportedConstBlock(source, constName, opener, closer) {
  const marker = `export const ${constName}`;
  const markerIndex = source.indexOf(marker);
  if (markerIndex === -1) return null;

  const assignmentIndex = source.indexOf('=', markerIndex);
  if (assignmentIndex === -1) return null;

  const startIndex = source.indexOf(opener, assignmentIndex);
  if (startIndex === -1) return null;

  let depth = 0;
  for (let index = startIndex; index < source.length; index += 1) {
    const character = source[index];
    if (character === opener) {
      depth += 1;
    } else if (character === closer) {
      depth -= 1;
      if (depth === 0) {
        return source.slice(startIndex + 1, index);
      }
    }
  }

  return null;
}

function extractDefaultSettings(source) {
  const block = extractExportedConstBlock(source, 'DEFAULT_SETTINGS', '{', '}');
  if (!block) return null;

  const entries = block
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => line.includes(':'))
    .map((line) => line.replace(/,$/, ''));

  const settings = {};
  for (const entry of entries) {
    const separatorIndex = entry.indexOf(':');
    const key = entry.slice(0, separatorIndex).trim();
    const rawValue = entry.slice(separatorIndex + 1).trim();
    if (rawValue === 'true' || rawValue === 'false') {
      settings[key] = rawValue === 'true';
      continue;
    }

    const numericValue = Number.parseInt(rawValue, 10);
    if (Number.isFinite(numericValue)) {
      settings[key] = numericValue;
    }
  }

  return settings;
}

function assertUniqueValues(values, label) {
  const duplicates = values.filter((value, index) => values.indexOf(value) !== index);
  if (duplicates.length > 0) {
    fail(`${label} contains duplicate values: ${[...new Set(duplicates)].join(', ')}`);
  }
}

function assertSameValues(actual, expected, label) {
  const sortedActual = [...actual].sort();
  const sortedExpected = [...expected].sort();
  if (JSON.stringify(sortedActual) !== JSON.stringify(sortedExpected)) {
    fail(`${label} must be ${sortedExpected.join(', ')}`);
  }
}

function extractSharedSettingsReexports(source) {
  const reexportMatch = source.match(/export\s*{([\s\S]*?)}\s*from\s*['"]\.\.\/shared\/settings['"]/);
  if (!reexportMatch) return [];

  return reexportMatch[1]
    .split(',')
    .map((entry) => entry.trim().replace(/^type\s+/, ''))
    .filter(Boolean);
}

function assertSharedSettingsDefinitions(sharedSource, sharedBooleanKeys, sharedFeedColumns, sharedDefaults) {
  const definitionsBlock = extractExportedConstBlock(sharedSource, 'SETTING_DEFINITIONS', '[', ']');
  if (!definitionsBlock) {
    fail('Shared SETTING_DEFINITIONS must be an exported array');
    return;
  }

  const definitionKeys = [...definitionsBlock.matchAll(/key:\s*'([^']+)'/g)].map((match) => match[1]);
  const parentKeys = [...definitionsBlock.matchAll(/parentKey:\s*'([^']+)'/g)].map((match) => match[1]);
  const optionValues = [...definitionsBlock.matchAll(/value:\s*(\d+)/g)]
    .map((match) => Number.parseInt(match[1], 10))
    .sort((a, b) => a - b);
  const defaultKeys = Object.keys(sharedDefaults);
  const userFacingKeys = defaultKeys.filter((key) => key !== 'floatingMiniPlayer');

  assertUniqueValues(definitionKeys, 'Shared SETTING_DEFINITIONS keys');
  assertSameValues(definitionKeys, userFacingKeys, 'Shared SETTING_DEFINITIONS keys');

  for (const parentKey of parentKeys) {
    if (!defaultKeys.includes(parentKey)) {
      fail(`Shared SETTING_DEFINITIONS parentKey is not a setting key: ${parentKey}`);
    }
  }

  if (JSON.stringify(optionValues) !== JSON.stringify(sharedFeedColumns)) {
    fail('Shared generalFeedColumns options must match FeedColumnCount values');
  }

  if (!sharedBooleanKeys.includes('floatingMiniPlayer') || sharedDefaults.floatingMiniPlayer !== true) {
    fail('Shared settings must keep floatingMiniPlayer as a boolean legacy alias defaulting to true');
  }

  if (!/settings\.floatingMiniPlayer\s*=\s*settings\.pipButton/.test(sharedSource)) {
    fail('Shared normalizeSettings must keep floatingMiniPlayer synchronized to pipButton');
  }

  if (!/export\s+const\s+SETTING_KEYS\s*=\s*Object\.keys\(DEFAULT_SETTINGS\)\s+as\s+SettingKey\[\];/.test(sharedSource)) {
    fail('Shared SETTING_KEYS must be derived from DEFAULT_SETTINGS');
  }
}

function assertSettingsParity() {
  assertExists(sharedSettingsPath, 'Shared settings module');
  assertExists(contentSettingsPath, 'Content settings module');
  if (!existsSync(sharedSettingsPath) || !existsSync(contentSettingsPath)) return;

  const sharedSource = readFileSync(sharedSettingsPath, 'utf8');
  const contentSource = readFileSync(contentSettingsPath, 'utf8');

  const sharedBooleanKeys = extractQuotedLiterals(extractTypeBlock(sharedSource, 'BooleanSettingKey') ?? '');
  const sharedFeedColumns = extractFeedColumns(sharedSource);
  const sharedDefaults = extractDefaultSettings(sharedSource);
  if (!sharedFeedColumns || !sharedDefaults) {
    fail('Could not parse FeedColumnCount or DEFAULT_SETTINGS from shared settings module');
    return;
  }

  assertSharedSettingsDefinitions(sharedSource, sharedBooleanKeys, sharedFeedColumns, sharedDefaults);

  const requiredContentTypeReexports = [
    'BooleanSettingKey',
    'FeedColumnCount',
    'SettingKey',
    'Settings',
  ];
  const contentReexports = extractSharedSettingsReexports(contentSource);

  if (contentReexports.length > 0) {
    for (const requiredExport of requiredContentTypeReexports) {
      if (!contentReexports.includes(requiredExport)) {
        fail(`Content settings must re-export ${requiredExport} from shared settings`);
      }
    }

    for (const localDefinition of ['BooleanSettingKey', 'FeedColumnCount', 'SettingKey', 'Settings']) {
      if (new RegExp(`export\\s+type\\s+${localDefinition}\\b`).test(contentSource)) {
        fail(`Content settings must not duplicate shared ${localDefinition}`);
      }
    }
  }

  const contentBooleanKeys = contentReexports.includes('BooleanSettingKey')
    ? sharedBooleanKeys
    : extractQuotedLiterals(extractTypeBlock(contentSource, 'BooleanSettingKey') ?? '');
  if (JSON.stringify(sharedBooleanKeys) !== JSON.stringify(contentBooleanKeys)) {
    fail('Content and shared BooleanSettingKey definitions must match');
  }

  const contentFeedColumns = contentReexports.includes('FeedColumnCount')
    ? sharedFeedColumns
    : extractFeedColumns(contentSource);
  if (JSON.stringify(sharedFeedColumns) !== JSON.stringify(contentFeedColumns)) {
    fail('Content and shared FeedColumnCount values must match');
  }

  const contentDefaults = extractDefaultSettings(contentSource);
  if (!contentDefaults) {
    fail('Could not parse DEFAULT_SETTINGS from content settings module');
    return;
  }

  if (JSON.stringify(sharedDefaults) !== JSON.stringify(contentDefaults)) {
    fail('Content and shared DEFAULT_SETTINGS must match');
  }

  if (!/export\s+const\s+SETTING_KEYS\s*=\s*Object\.keys\(DEFAULT_SETTINGS\)\s+as\s+SettingKey\[\];/.test(contentSource)) {
    fail('Content SETTING_KEYS must be derived from DEFAULT_SETTINGS');
  }
}

assertExists(resolve(root, 'README.md'), 'README');
assertExists(resolve(root, 'CHANGELOG.md'), 'CHANGELOG');
assertExists(resolve(root, 'PRIVACY.md'), 'PRIVACY');
assertExists(resolve(root, 'LICENSE'), 'LICENSE');
assertExists(resolve(root, 'DEVELOPMENT.md'), 'DEVELOPMENT');
assertSettingsParity();
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
