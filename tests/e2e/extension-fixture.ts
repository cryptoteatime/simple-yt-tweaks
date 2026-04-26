import { test as base, chromium, type BrowserContext, type Page } from '@playwright/test';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

type ExtensionFixtures = {
  context: BrowserContext;
  extensionId: string;
};

const testDir = dirname(fileURLToPath(import.meta.url));
export const repoRoot = resolve(testDir, '..', '..');
const distDir = resolve(repoRoot, 'dist');

function prepareExtensionCopy(rootDir: string): string {
  if (!existsSync(distDir)) {
    throw new Error('Built extension is missing. Run npm run build before Playwright tests.');
  }

  const extensionDir = join(rootDir, 'extension');
  cpSync(distDir, extensionDir, { recursive: true });

  const manifestPath = join(extensionDir, 'manifest.json');
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as Record<string, unknown>;
  manifest.background = { service_worker: 'test-background.js', type: 'module' };
  writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  writeFileSync(join(extensionDir, 'test-background.js'), 'chrome.runtime.onInstalled.addListener(() => {});\n');

  return extensionDir;
}

export const test = base.extend<ExtensionFixtures>({
  context: async ({ browserName }, use) => {
    if (browserName !== 'chromium') {
      throw new Error('Simple YT Tweaks extension tests require Chromium.');
    }

    const rootDir = mkdtempSync(join(tmpdir(), 'simple-yt-tweaks-e2e-'));
    const userDataDir = join(rootDir, 'profile');
    mkdirSync(userDataDir);
    const extensionDir = prepareExtensionCopy(rootDir);

    const context = await chromium.launchPersistentContext(userDataDir, {
      channel: 'chromium',
      headless: true,
      ignoreHTTPSErrors: true,
      viewport: { width: 1280, height: 800 },
      args: [
        `--disable-extensions-except=${extensionDir}`,
        `--load-extension=${extensionDir}`,
      ],
    });

    try {
      await use(context);
    } finally {
      await context.close();
      rmSync(rootDir, { recursive: true, force: true });
    }
  },

  extensionId: async ({ context }, use) => {
    let [worker] = context.serviceWorkers();
    worker ??= await context.waitForEvent('serviceworker', { timeout: 10_000 });

    const extensionId = new URL(worker.url()).host;
    await use(extensionId);
  },
});

export { expect } from '@playwright/test';

export function collectPageErrors(page: Page): string[] {
  const errors: string[] = [];

  page.on('console', (message) => {
    if (message.type() === 'error') {
      errors.push(message.text());
    }
  });

  page.on('pageerror', (error) => {
    errors.push(error.message);
  });

  return errors;
}

export function extensionErrors(errors: string[]): string[] {
  return errors.filter((error) => error.includes('Simple YT Tweaks'));
}

export async function waitForExtensionReady(page: Page): Promise<void> {
  await page.locator('body.simple-yt-tweaks-active').waitFor({ state: 'attached', timeout: 10_000 });
  await page.locator('#simple-yt-tweaks-style').waitFor({ state: 'attached', timeout: 10_000 });
}
