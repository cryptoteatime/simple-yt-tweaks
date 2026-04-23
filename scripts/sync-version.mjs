import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const nextVersion = process.argv[2];

const packagePath = resolve(root, 'package.json');
const lockPath = resolve(root, 'package-lock.json');
const manifestPath = resolve(root, 'public/manifest.json');

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function writeJson(path, value) {
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
}

function assertChromeVersion(version) {
  if (!/^\d+(?:\.\d+){0,3}$/.test(version)) {
    throw new Error(
      `Chrome extension versions must be one to four dot-separated integers. Received: ${version}`,
    );
  }
}

const packageJson = readJson(packagePath);
const packageLock = readJson(lockPath);
const manifest = readJson(manifestPath);
const version = nextVersion ?? packageJson.version;

assertChromeVersion(version);

let changed = false;

if (packageJson.version !== version) {
  packageJson.version = version;
  changed = true;
}

if (packageLock.version !== version) {
  packageLock.version = version;
  changed = true;
}

if (packageLock.packages?.['']?.version !== version) {
  packageLock.packages[''].version = version;
  changed = true;
}

if (manifest.version !== version) {
  manifest.version = version;
  changed = true;
}

if (manifest.description !== packageJson.description) {
  manifest.description = packageJson.description;
  changed = true;
}

if (changed) {
  writeJson(packagePath, packageJson);
  writeJson(lockPath, packageLock);
  writeJson(manifestPath, manifest);
  console.log(`Synced extension version to ${version}`);
} else {
  console.log(`Extension version already synced at ${version}`);
}
