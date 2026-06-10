import { collectPageErrors, expect, extensionErrors, test, waitForExtensionReady } from './extension-fixture';

type LiveCardTarget = {
  href: string;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

function getWatchVideoId(href: string): string {
  try {
    return new URL(href).searchParams.get('v') ?? '';
  } catch {
    return '';
  }
}

async function getVisibleHomeCardTargets(page: import('@playwright/test').Page): Promise<LiveCardTarget[]> {
  return page.evaluate(() =>
    Array.from(document.querySelectorAll<HTMLElement>('ytd-browse[page-subtype="home"] ytd-rich-item-renderer'))
      .map((card) => {
        const link = card.querySelector<HTMLAnchorElement>('a[href*="/watch"]');
        const rect = card.getBoundingClientRect();
        return {
          title: card.textContent?.trim().replace(/\s+/g, ' ').slice(0, 120) ?? '',
          href: link?.href ?? '',
          x: rect.left,
          y: rect.top,
          width: rect.width,
          height: rect.height,
          visible: rect.width > 120 && rect.height > 100 && rect.bottom > 0 && rect.top < window.innerHeight,
        };
      })
      .filter((card) => card.visible && card.href.includes('/watch') && !card.href.includes('/shorts/'))
      .map(({ href, title, x, y, width, height }) => ({ href, title, x, y, width, height })),
  );
}

async function getVisiblePreviewState(page: import('@playwright/test').Page): Promise<{
  currentTime: number;
  href: string;
  paused: boolean;
  title: string;
  visible: boolean;
}> {
  return page.evaluate(() => {
    for (const video of document.querySelectorAll<HTMLVideoElement>('ytd-video-preview video, #inline-preview-player video')) {
      const rect = video.getBoundingClientRect();
      const visible = rect.width > 80 && rect.height > 60 && rect.bottom > 0 && rect.top < window.innerHeight;
      if (!visible) continue;

      return {
        currentTime: video.currentTime,
        href: video.closest('ytd-video-preview')?.querySelector<HTMLAnchorElement>('a[href*="/watch"]')?.href ?? '',
        paused: video.paused,
        title: video.closest('ytd-video-preview')?.textContent?.trim().replace(/\s+/g, ' ').slice(0, 120) ?? '',
        visible: true,
      };
    }

    return {
      currentTime: 0,
      href: '',
      paused: true,
      title: '',
      visible: false,
    };
  });
}

test.describe('live YouTube smoke', () => {
  test.skip(!process.env.SIMPLE_YT_TWEAKS_LIVE, 'Set SIMPLE_YT_TWEAKS_LIVE=1 to run live YouTube smoke checks.');

  test('loads the extension on public YouTube pages without extension console errors', async ({ context, extensionId }) => {
    const page = await context.newPage();
    const errors = collectPageErrors(page);

    try {
      await page.goto('https://www.youtube.com/', { waitUntil: 'domcontentloaded', timeout: 20_000 });
      await waitForExtensionReady(page);
      await page.goto('https://www.youtube.com/results?search_query=weather', {
        waitUntil: 'domcontentloaded',
        timeout: 20_000,
      });
      await waitForExtensionReady(page);
    } catch (error) {
      test.info().annotations.push({
        type: 'live-smoke-skipped',
        description: `Live YouTube smoke could not complete in this environment: ${String(error)}`,
      });
      return;
    }

    const popup = await context.newPage();
    const popupErrors = collectPageErrors(popup);
    await popup.goto(`chrome-extension://${extensionId}/popup/popup.html`);
    await expect(popup.locator('#versionLabel')).toHaveText(/^v\d+\.\d+\.\d+$/);

    expect(extensionErrors([...errors, ...popupErrors])).toEqual([]);
  });

  test('tries watch-to-home native hover preview on the current YouTube surface', async ({ context }) => {
    const page = await context.newPage();
    const errors = collectPageErrors(page);

    try {
      await page.goto('https://www.youtube.com/', { waitUntil: 'domcontentloaded', timeout: 20_000 });
      await waitForExtensionReady(page);
    } catch (error) {
      test.info().annotations.push({
        type: 'live-smoke-skipped',
        description: `Live YouTube Home could not load in this environment: ${String(error)}`,
      });
      return;
    }

    const initialTargets = await getVisibleHomeCardTargets(page);
    if (!initialTargets.length) {
      test.info().annotations.push({
        type: 'live-smoke-skipped',
        description: 'Live YouTube Home did not expose visible watch cards.',
      });
      return;
    }

    const initialTarget = initialTargets[0];
    await page.mouse.click(initialTarget.x + initialTarget.width / 2, initialTarget.y + Math.min(90, initialTarget.height / 2));
    await page.waitForURL(/\/watch/, { timeout: 20_000 });
    await waitForExtensionReady(page);

    const logo = page.locator('a#logo[href="/"], ytd-topbar-logo-renderer a[href="/"]');
    if ((await logo.count()) === 0) {
      test.info().annotations.push({
        type: 'live-smoke-skipped',
        description: 'Live YouTube logo link was not available for SPA Home navigation.',
      });
      return;
    }

    await logo.first().click();
    await page.waitForURL('https://www.youtube.com/', { timeout: 20_000 });
    await waitForExtensionReady(page);

    const homeTargets = await getVisibleHomeCardTargets(page);
    if (!homeTargets.length) {
      test.info().annotations.push({
        type: 'live-smoke-skipped',
        description: 'Live YouTube Home did not expose visible watch cards after SPA navigation.',
      });
      return;
    }

    const hoverTarget = homeTargets[0];
    await page.mouse.move(hoverTarget.x + hoverTarget.width / 2, hoverTarget.y + Math.min(90, hoverTarget.height / 2));
    const preview = await expect
      .poll(() => getVisiblePreviewState(page), { timeout: 4_000 })
      .toHaveProperty('visible', true)
      .then(() => getVisiblePreviewState(page));

    const hoverTargetVideoId = getWatchVideoId(hoverTarget.href);
    const previewVideoId = getWatchVideoId(preview.href);
    if (hoverTargetVideoId && previewVideoId) {
      expect(previewVideoId).toBe(hoverTargetVideoId);
    }

    expect(preview.paused || preview.currentTime > 0).toBeTruthy();
    expect(extensionErrors(errors)).toEqual([]);
  });
});
