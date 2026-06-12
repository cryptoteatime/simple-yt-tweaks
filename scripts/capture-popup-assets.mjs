import { chromium } from '@playwright/test';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const root = process.cwd();
const distDir = resolve(root, 'dist');
const outputDir = resolve(root, 'store-assets', 'popup');

if (!existsSync(distDir)) {
  throw new Error('Built extension is missing. Run npm run build before capturing popup assets.');
}

mkdirSync(outputDir, { recursive: true });

function prepareExtensionCopy(rootDir) {
  const extensionDir = join(rootDir, 'extension');
  cpSync(distDir, extensionDir, { recursive: true });

  const manifestPath = join(extensionDir, 'manifest.json');
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  manifest.background = { service_worker: 'test-background.js', type: 'module' };
  writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  writeFileSync(join(extensionDir, 'test-background.js'), 'chrome.runtime.onInstalled.addListener(() => {});\n');

  return extensionDir;
}

async function forceMarketingStatus(page) {
  await page.evaluate(() => {
    const dot = document.getElementById('pageStatusDot');
    dot?.setAttribute('data-status', 'active');
    dot?.setAttribute('aria-label', 'Simple YT Tweaks is active on this page');
  });
}

async function captureTab(page, tabName, outputName) {
  await page.getByRole('button', { name: tabName }).click();
  await forceMarketingStatus(page);
  await page.locator('body').screenshot({
    path: resolve(outputDir, outputName),
    animations: 'disabled',
  });
}

const rootDir = mkdtempSync(join(tmpdir(), 'simple-yt-tweaks-popup-assets-'));
const userDataDir = join(rootDir, 'profile');
mkdirSync(userDataDir);
const extensionDir = prepareExtensionCopy(rootDir);

const context = await chromium.launchPersistentContext(userDataDir, {
  channel: 'chromium',
  headless: true,
  viewport: { width: 430, height: 540 },
  args: [`--disable-extensions-except=${extensionDir}`, `--load-extension=${extensionDir}`],
});

try {
  let [worker] = context.serviceWorkers();
  worker ??= await context.waitForEvent('serviceworker', { timeout: 10_000 });
  const extensionId = new URL(worker.url()).host;
  const page = await context.newPage();

  await page.goto(`chrome-extension://${extensionId}/popup/popup.html`);
  await page.locator('#versionLabel').waitFor({ state: 'visible', timeout: 10_000 });
  await page.evaluate(() => document.fonts?.ready);
  await forceMarketingStatus(page);

  await captureTab(page, 'General', 'general-tab-source.png');
  await captureTab(page, 'Sidebar', 'sidebar-tab-source.png');
  await captureTab(page, 'Modes', 'modes-tab-source.png');
  await page.close();
} finally {
  await context.close();
  rmSync(rootDir, { recursive: true, force: true });
}

console.log('Captured current popup assets.');
