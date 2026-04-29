import type { BrowserContext, Page } from '@playwright/test';
import { collectPageErrors, expect, extensionErrors, test, waitForExtensionReady } from './extension-fixture';
import { routeYouTubeFixture } from './youtube-fixtures';

declare global {
  interface Window {
    __simpleYtTweaksPlaybackEvents?: string[];
  }
}

async function openFixture(page: Page, fixtureName: 'home' | 'search' | 'watch', url: string): Promise<string[]> {
  const errors = collectPageErrors(page);
  await routeYouTubeFixture(page, fixtureName);
  await page.goto(url);
  await waitForExtensionReady(page);
  return errors;
}

async function writeExtensionSettings(
  context: BrowserContext,
  extensionId: string,
  settings: Record<string, unknown>,
): Promise<void> {
  const page = await context.newPage();
  await page.goto(`chrome-extension://${extensionId}/popup/popup.html`);
  await page.evaluate(
    (nextSettings) =>
      new Promise<void>((resolve, reject) => {
        chrome.storage.sync.set(nextSettings, () => {
          const error = chrome.runtime.lastError;
          if (error) {
            reject(new Error(error.message));
            return;
          }

          resolve();
        });
      }),
    settings,
  );
  await page.close();
}

async function setupPlaybackProbe(page: Page): Promise<void> {
  await page.locator('video.html5-main-video').evaluate(async (video) => {
    window.__simpleYtTweaksPlaybackEvents = [];

    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const context = canvas.getContext('2d');
    context!.fillStyle = '#0f0f0f';
    context!.fillRect(0, 0, 16, 16);

    video.muted = true;
    video.playsInline = true;
    video.addEventListener('play', () => {
      window.__simpleYtTweaksPlaybackEvents?.push('play');
    });
    video.addEventListener('pause', () => {
      window.__simpleYtTweaksPlaybackEvents?.push('pause');
    });
    video.srcObject = canvas.captureStream(1);

    if (video.readyState < HTMLMediaElement.HAVE_METADATA) {
      await new Promise<void>((resolve) => {
        video.addEventListener('loadedmetadata', () => resolve(), { once: true });
        window.setTimeout(resolve, 250);
      });
    }
  });
}

async function playbackEvents(page: Page): Promise<string[]> {
  return page.evaluate(() => window.__simpleYtTweaksPlaybackEvents ?? []);
}

test('home fixture uses native feed layout while cleanup stays active', async ({ context }) => {
  const page = await context.newPage();
  const errors = await openFixture(page, 'home', 'https://www.youtube.com/');

  const grid = page.locator('ytd-browse[page-subtype="home"] ytd-rich-grid-renderer');
  await expect(grid).toHaveCSS('--ytd-rich-grid-items-per-row', '3');
  await expect(page.locator('[data-testid="sponsored"]')).toHaveCount(0);
  await expect(page.locator('[data-testid="shorts-card"]')).toBeHidden();
  await expect(page.locator('[data-testid="shorts-shelf"]')).toBeHidden();
  await expect(page.locator('ytd-rich-item-renderer')).toHaveCount(4);

  const injectedCss = await page.locator('#simple-yt-tweaks-style').textContent();
  expect(injectedCss).not.toContain('ytd-video-preview');
  expect(injectedCss).not.toContain('ytd-rich-item-renderer.simple-yt-tweaks-grid-hover-ready');
  await page.locator('[data-testid="video-with-preview"] yt-thumbnail-view-model').hover();
  await expect(page.locator('[data-testid="video-with-preview"]')).not.toHaveClass(
    /simple-yt-tweaks-grid-hover-ready/,
  );
  expect(extensionErrors(errors)).toEqual([]);
});

test('search fixture applies compact grid cleanup and badge movement', async ({ context }) => {
  const page = await context.newPage();
  const errors = await openFixture(page, 'search', 'https://www.youtube.com/results?search_query=fixture');

  const results = page.locator(
    'ytd-search ytd-two-column-search-results-renderer #primary ytd-section-list-renderer > #contents.ytd-section-list-renderer',
  );
  await expect(results).toHaveCSS('display', 'grid');
  await expect(results).toHaveCSS('grid-template-columns', /.+/);
  await expect(page.locator('[data-testid="shorts-grid"]')).toBeHidden();
  await expect(page.locator('[data-testid="playlist-result"]')).toBeHidden();
  await expect(page.locator('[data-testid="search-shorts-video"]')).toBeHidden();
  await expect(page.locator('[data-testid="search-radio-video"]')).toBeHidden();
  await expect(page.locator('[data-testid="radio-result"]')).toBeHidden();
  await expect(page.locator('[data-testid="generic-shelf"]')).toBeHidden();
  await expect(page.locator('[data-testid="channel-card"] #channel-title #text')).toHaveCSS('text-align', 'center');
  await expect(page.locator('[data-testid="search-1"] #channel-info .simple-yt-tweaks-search-badges')).toContainText('New');
  await expect(page.locator('[data-testid="search-1"] #channel-info .simple-yt-tweaks-search-badges')).toContainText('CC');
  await expect(page.locator('ytd-continuation-item-renderer[data-testid="continuation"]')).toHaveCSS('opacity', '0');
  const injectedCss = await page.locator('#simple-yt-tweaks-style').textContent();
  expect(injectedCss).not.toContain('ytd-video-preview');
  expect(injectedCss).not.toContain('ytd-rich-item-renderer.simple-yt-tweaks-grid-hover-ready');
  expect(extensionErrors(errors)).toEqual([]);
});

test('search fixture can disable compact grid through stored settings', async ({ context, extensionId }) => {
  await writeExtensionSettings(context, extensionId, { generalApplyFeedColumnsToSearch: false });

  const page = await context.newPage();
  const errors = await openFixture(page, 'search', 'https://www.youtube.com/results?search_query=fixture');

  const results = page.locator(
    'ytd-search ytd-two-column-search-results-renderer #primary ytd-section-list-renderer > #contents.ytd-section-list-renderer',
  );
  await expect(results).not.toHaveCSS('display', 'grid');
  await expect(page.locator('[data-testid="playlist-result"]')).toBeVisible();
  await expect(page.locator('[data-testid="search-1"] .simple-yt-tweaks-search-badges')).toHaveCount(0);
  expect(extensionErrors(errors)).toEqual([]);
});

test('watch fixture validates mode classes, visible comments, hover grow, and video-surface click fallback', async ({ context }) => {
  const page = await context.newPage();
  const errors = await openFixture(page, 'watch', 'https://www.youtube.com/watch?v=fixture');

  const videoSurface = page.locator('video.html5-main-video');
  await setupPlaybackProbe(page);
  await expect(page.locator('body')).toHaveClass(/simple-yt-tweaks-default-view/);
  await expect(page.locator('#comments')).toBeVisible();
  await expect(page.locator('body')).not.toHaveClass(/simple-yt-tweaks-theater/);

  await page.locator('[data-testid="recommended-card"] ytd-thumbnail').hover();
  await expect(page.locator('[data-testid="recommended-card"]')).not.toHaveClass(
    /simple-yt-tweaks-grid-hover-ready/,
    { timeout: 250 },
  );
  await expect(page.locator('[data-testid="recommended-card"]')).toHaveClass(/simple-yt-tweaks-grid-hover-ready/, {
    timeout: 1_500,
  });

  await videoSurface.click({ position: { x: 120, y: 120 } });
  await expect.poll(() => page.evaluate(() => window.__simpleYtTweaksPlaybackEvents ?? [])).toContainEqual('play');
  await videoSurface.click({ position: { x: 120, y: 120 } });
  await expect.poll(() => page.evaluate(() => window.__simpleYtTweaksPlaybackEvents ?? [])).toContainEqual('pause');

  await page.locator('ytd-watch-flexy').evaluate((watchFlexy) => {
    watchFlexy.setAttribute('theater', '');
  });
  await expect(page.locator('body')).toHaveClass(/simple-yt-tweaks-theater/);
  await expect(page.locator('#comments')).toBeVisible();

  const playerPointerEvents = await page.locator('video.html5-main-video').evaluate((video) => getComputedStyle(video).pointerEvents);
  expect(playerPointerEvents).toBe('auto');
  expect(extensionErrors(errors)).toEqual([]);
});

test('watch fixture respects disabled hover grow and hidden comments settings', async ({ context, extensionId }) => {
  await writeExtensionSettings(context, extensionId, {
    defaultHideComments: true,
    defaultRecommendedHoverGrow: false,
    theaterHideComments: true,
    theaterRecommendedHoverGrow: false,
  });

  const page = await context.newPage();
  const errors = await openFixture(page, 'watch', 'https://www.youtube.com/watch?v=fixture');

  await expect(page.locator('body')).toHaveClass(/simple-yt-tweaks-default-view/);
  await expect(page.locator('#comments')).toBeHidden();
  await page.locator('[data-testid="recommended-card"] ytd-thumbnail').hover();
  await expect(page.locator('[data-testid="recommended-card"]')).not.toHaveClass(
    /simple-yt-tweaks-grid-hover-ready/,
    { timeout: 750 },
  );

  await page.locator('ytd-watch-flexy').evaluate((watchFlexy) => {
    watchFlexy.setAttribute('theater', '');
  });
  await expect(page.locator('body')).toHaveClass(/simple-yt-tweaks-theater/);
  await expect(page.locator('#comments')).toBeHidden();
  expect(extensionErrors(errors)).toEqual([]);
});

test('player click fallback ignores controls and modified video clicks', async ({ context }) => {
  const page = await context.newPage();
  const errors = await openFixture(page, 'watch', 'https://www.youtube.com/watch?v=fixture');

  await setupPlaybackProbe(page);
  await page.locator('[data-testid="player-control"]').click();
  await page.waitForTimeout(260);
  expect(await playbackEvents(page)).toEqual([]);

  await page.locator('video.html5-main-video').click({ modifiers: ['Shift'], position: { x: 120, y: 120 } });
  await page.waitForTimeout(260);
  expect(await playbackEvents(page)).toEqual([]);
  expect(extensionErrors(errors)).toEqual([]);
});

test('popup fixture renders settings, nested controls, version, and storage persistence', async ({ context, extensionId }) => {
  const page = await context.newPage();
  const errors = collectPageErrors(page);
  await page.goto(`chrome-extension://${extensionId}/popup/popup.html`);

  await expect(page.locator('#versionLabel')).toHaveText('v0.3.0');
  await expect(page.locator('#settingsTabs button', { hasText: 'General' })).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('#generalStickyPlayer')).toBeChecked();
  await expect(page.locator('#generalApplyFeedColumnsToSearch')).toBeChecked();

  await page.locator('#pipButton').uncheck();
  await page.reload();
  await expect(page.locator('#pipButton')).not.toBeChecked();
  await page.locator('#resetBtn').click();
  await expect(page.locator('#pipButton')).toBeChecked();

  await page.locator('#settingsTabs button', { hasText: 'Modes' }).click();
  await page.locator('#viewModes button', { hasText: 'Default' }).click();
  await expect(page.locator('#defaultRecommendedHoverGrow')).toBeChecked();
  await expect(page.locator('#defaultRecommendedHoverGrow')).toBeEnabled();

  await page.locator('#viewModes button', { hasText: 'Theater' }).click();
  await expect(page.locator('#theaterHideRecommendations')).toBeChecked();
  await expect(page.locator('#theaterRecommendedHoverGrow')).toBeChecked();
  await expect(page.locator('#theaterRecommendedHoverGrow')).toBeEnabled();
  expect(extensionErrors(errors)).toEqual([]);
});

test('popup fixture normalizes invalid stored settings to defaults', async ({ context, extensionId }) => {
  await writeExtensionSettings(context, extensionId, {
    generalFeedColumns: 9,
    generalStickyPlayer: 'no',
    generalApplyFeedColumnsToSearch: 'yes',
    pipButton: false,
    floatingMiniPlayer: true,
  });

  const page = await context.newPage();
  const errors = collectPageErrors(page);
  await page.goto(`chrome-extension://${extensionId}/popup/popup.html`);

  await expect(page.locator('#generalFeedColumns')).toHaveValue('3');
  await expect(page.locator('#generalStickyPlayer')).toBeChecked();
  await expect(page.locator('#generalApplyFeedColumnsToSearch')).toBeChecked();
  await expect(page.locator('#pipButton')).not.toBeChecked();
  expect(extensionErrors(errors)).toEqual([]);
});
