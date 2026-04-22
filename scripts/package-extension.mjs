import { mkdirSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import packageJson from '../package.json' with { type: 'json' };

const root = process.cwd();
const distDir = resolve(root, 'dist');
const releaseDir = resolve(root, 'release');
const zipPath = resolve(releaseDir, `simple-yt-tweaks-v${packageJson.version}.zip`);

mkdirSync(releaseDir, { recursive: true });
rmSync(zipPath, { force: true });

const result = spawnSync('zip', ['-r', zipPath, '.'], {
  cwd: distDir,
  stdio: 'inherit',
});

if (result.error) {
  console.error(`Unable to create release zip: ${result.error.message}`);
  process.exit(1);
}

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}

console.log(`Created ${zipPath}`);
