import type { BrowserContext, Page } from '@playwright/test';
import { collectPageErrors, expect, extensionErrors, test, waitForExtensionReady } from './extension-fixture';
import { routeYouTubeFixture } from './youtube-fixtures';

declare global {
  interface Window {
    __simpleYtTweaksDelayedPreviewEvents?: string[];
    __simpleYtTweaksNativeHoverLifecycleEvents?: string[];
    __simpleYtTweaksNativePreviewEvents?: string[];
    __simpleYtTweaksPlaybackEvents?: string[];
    __simpleYtTweaksSimulateTransientClick?: boolean;
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

async function readExtensionSettings(page: Page): Promise<Record<string, unknown>> {
  return page.evaluate(
    () =>
      new Promise<Record<string, unknown>>((resolve, reject) => {
        chrome.storage.sync.get(null, (items) => {
          const error = chrome.runtime.lastError;
          if (error) {
            reject(new Error(error.message));
            return;
          }

          resolve(items);
        });
      }),
  );
}

async function setupPlaybackProbe(page: Page): Promise<void> {
  await page.locator('#movie_player video.html5-main-video').evaluate(async (video) => {
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
  await expect(page.locator('[data-testid="home-spa-placeholder"]')).toHaveCount(1);
  await expect(page.locator('[data-testid="home-spa-placeholder"]')).toBeHidden();
  await expect(page.locator('[data-testid="shorts-card"]')).toBeHidden();
  await expect(page.locator('[data-testid="shorts-shelf"]')).toBeHidden();
  await expect(page.locator('ytd-rich-item-renderer')).toHaveCount(5);

  const injectedCss = await page.locator('#simple-yt-tweaks-style').textContent();
  expect(injectedCss).not.toContain('ytd-video-preview');
  expect(injectedCss).not.toContain('ytd-rich-item-renderer.simple-yt-tweaks-grid-hover-ready');
  await page.locator('[data-testid="video-with-preview"] yt-thumbnail-view-model').hover();
  await expect(page.locator('[data-testid="video-with-preview"]')).not.toHaveClass(
    /simple-yt-tweaks-grid-hover-ready/,
  );
  expect(extensionErrors(errors)).toEqual([]);
});

test('home fixture repairs stale YouTube grid metadata after watch-to-home navigation', async ({ context }) => {
  const page = await context.newPage();
  const errors = await openFixture(page, 'home', 'https://www.youtube.com/');

  await page.evaluate(() => {
    history.pushState({}, '', '/watch?v=fixture');
    window.dispatchEvent(new PopStateEvent('popstate'));
  });
  await page.waitForTimeout(220);
  await page.evaluate(() => {
    const grid = document.querySelector('ytd-browse[page-subtype="home"] ytd-rich-grid-renderer');
    const items = Array.from(
      document.querySelectorAll('ytd-browse[page-subtype="home"] ytd-rich-grid-renderer #contents > ytd-rich-item-renderer'),
    );

    grid?.setAttribute('elements-per-row', '2');
    items.forEach((item, index) => {
      item.setAttribute('items-per-row', '2');
      item.removeAttribute('is-in-first-column');
      item.removeAttribute('is-in-last-column');
      if (index === 1) item.setAttribute('is-in-first-column', '');
    });

    history.pushState({}, '', '/');
    window.dispatchEvent(new PopStateEvent('popstate'));
  });

  await expect
    .poll(
      () =>
        page.evaluate(() => {
          const grid = document.querySelector('ytd-browse[page-subtype="home"] ytd-rich-grid-renderer');
          return {
            gridColumns: grid?.getAttribute('elements-per-row'),
            items: Array.from(
              document.querySelectorAll<HTMLElement>(
                'ytd-browse[page-subtype="home"] ytd-rich-grid-renderer #contents > ytd-rich-item-renderer',
              ),
            )
              .filter((item) => !item.hidden && getComputedStyle(item).display !== 'none')
              .map((item) => ({
                id: item.getAttribute('data-testid'),
                columns: item.getAttribute('items-per-row'),
                first: item.hasAttribute('is-in-first-column'),
                last: item.hasAttribute('is-in-last-column'),
              })),
          };
        }),
      { timeout: 3_000 },
    )
    .toEqual({
      gridColumns: '3',
      items: [
        { id: 'video-1', columns: '3', first: true, last: false },
        { id: 'video-2', columns: '3', first: false, last: false },
        { id: 'video-3', columns: '3', first: false, last: true },
        { id: 'video-with-preview', columns: '3', first: true, last: false },
      ],
    });
  expect(extensionErrors(errors)).toEqual([]);
});

test('home fixture clears hidden watch player cache after watch-to-home navigation', async ({ context }) => {
  const page = await context.newPage();
  const errors = await openFixture(page, 'home', 'https://www.youtube.com/');

  await page.evaluate(() => {
    history.pushState({}, '', '/watch?v=fixture');
    window.dispatchEvent(new PopStateEvent('popstate'));
  });
  await page.waitForTimeout(220);
  await page.evaluate(() => {
    const watchPage = document.createElement('ytd-watch-flexy');
    watchPage.hidden = true;
    watchPage.setAttribute('data-testid', 'hidden-watch-cache');
    watchPage.innerHTML = '<ytd-player id="ytd-player"><div id="movie_player"><video src="blob:fixture"></video></div></ytd-player>';
    document.querySelector('ytd-app')?.append(watchPage);

    history.pushState({}, '', '/');
    window.dispatchEvent(new PopStateEvent('popstate'));
  });

  await expect(page.locator('[data-testid="hidden-watch-cache"]')).toHaveCount(0, { timeout: 3_000 });
  expect(extensionErrors(errors)).toEqual([]);
});

test('home fixture defers destructive cleanup briefly after watch-to-home navigation', async ({ context }) => {
  const page = await context.newPage();
  const errors = await openFixture(page, 'home', 'https://www.youtube.com/');

  await page.evaluate(() => {
    history.pushState({}, '', '/watch?v=fixture');
    window.dispatchEvent(new PopStateEvent('popstate'));
  });
  await page.waitForTimeout(220);
  await page.evaluate(() => {
    const sponsored = document.createElement('ytd-rich-item-renderer');
    sponsored.setAttribute('data-testid', 'deferred-sponsored');
    sponsored.innerHTML = '<ad-badge-view-model>Sponsored</ad-badge-view-model><a href="https://googleadservices.com/pagead/aclk">Deferred sponsored card</a>';
    document.querySelector('ytd-browse[page-subtype="home"] ytd-rich-grid-renderer #contents')?.prepend(sponsored);
    history.pushState({}, '', '/');
    window.dispatchEvent(new PopStateEvent('popstate'));
  });

  await expect(page.locator('[data-testid="deferred-sponsored"]')).toHaveCount(1);
  await expect(page.locator('[data-testid="deferred-sponsored"]')).toHaveCount(0, { timeout: 3_000 });
  expect(extensionErrors(errors)).toEqual([]);
});

test('home fixture does not synthesize native feed hover after watch-to-home navigation', async ({ context }) => {
  const page = await context.newPage();
  const errors = await openFixture(page, 'home', 'https://www.youtube.com/');

  await page.mouse.move(80, 80);
  await page.evaluate(() => {
    history.pushState({}, '', '/watch?v=fixture');
    window.dispatchEvent(new PopStateEvent('popstate'));
  });
  await page.waitForTimeout(220);
  const hoverPoint = await page.evaluate(() => {
    window.__simpleYtTweaksNativeHoverLifecycleEvents = [];

    const card = document.createElement('ytd-rich-item-renderer');
    card.setAttribute('data-testid', 'native-only-hover-card');
    card.setAttribute('data-native-preview-card', 'native-only-hover-card');
    card.setAttribute('items-per-row', '3');
    card.setAttribute(
      'style',
      'display: block; width: 280px; height: 180px; margin: 0; padding: 0; position: fixed; left: 40px; top: 96px; z-index: 1;',
    );
    card.innerHTML = `
      <a class="ytLockupViewModelContentImage" href="/watch?v=native-only-hover-card" style="display: block; width: 100%; height: 128px;">
        <yt-thumbnail-view-model style="display: block; width: 100%; height: 128px;"></yt-thumbnail-view-model>
      </a>
      <h3>Native-only hover fixture</h3>
    `;

    card.addEventListener('pointerover', (event) =>
      window.__simpleYtTweaksNativeHoverLifecycleEvents?.push(event.isTrusted ? 'pointerover:trusted' : 'pointerover:synthetic'),
    );
    card.addEventListener('mouseover', (event) =>
      window.__simpleYtTweaksNativeHoverLifecycleEvents?.push(event.isTrusted ? 'mouseover:trusted' : 'mouseover:synthetic'),
    );
    card.addEventListener('mousemove', (event) =>
      window.__simpleYtTweaksNativeHoverLifecycleEvents?.push(event.isTrusted ? 'mousemove:trusted' : 'mousemove:synthetic'),
    );

    document.querySelector('ytd-browse[page-subtype="home"] ytd-rich-grid-renderer #contents')?.prepend(card);
    history.pushState({}, '', '/');
    window.dispatchEvent(new PopStateEvent('popstate'));

    const rect = card.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + Math.min(72, rect.height / 2),
    };
  });

  await page.mouse.move(hoverPoint.x, hoverPoint.y);
  await page.waitForTimeout(1_000);
  await expect
    .poll(() =>
      page.evaluate(() =>
        (window.__simpleYtTweaksNativeHoverLifecycleEvents ?? []).filter((event) => event.includes('synthetic')),
      ),
    )
    .toEqual([]);
  await expect(page.locator('[data-testid="native-only-hover-card"]')).not.toHaveClass(
    /simple-yt-tweaks-grid-hover-ready/,
  );
  expect(extensionErrors(errors)).toEqual([]);
});

test('home fixture clears off-card detached preview without forcing playback', async ({ context }) => {
  const page = await context.newPage();
  const errors = await openFixture(page, 'home', 'https://www.youtube.com/');

  await page.mouse.move(80, 80);
  await page.evaluate(() => {
    history.pushState({}, '', '/watch?v=fixture');
    window.dispatchEvent(new PopStateEvent('popstate'));
  });
  await page.waitForTimeout(220);
  const hoverPoint = await page.evaluate(() => {
    window.__simpleYtTweaksOffCardPreviewEvents = [];

    const card = document.createElement('ytd-rich-item-renderer');
    card.setAttribute('data-testid', 'off-card-same-video-card');
    card.setAttribute('data-native-preview-card', 'off-card-same-video-card');
    card.setAttribute('items-per-row', '3');
    card.setAttribute(
      'style',
      'display: block; width: 280px; height: 190px; margin: 0; padding: 0; position: fixed; left: 420px; top: 220px; z-index: 1;',
    );
    card.innerHTML = `
      <a class="ytLockupViewModelContentImage" href="/watch?v=off-card-same-video-card" style="display: block; width: 100%; height: 128px;">
        <yt-thumbnail-view-model style="display: block; width: 100%; height: 128px;"></yt-thumbnail-view-model>
      </a>
      <h3 style="margin: 12px 0 0;">Off-card same video fixture</h3>
    `;

    card.addEventListener('mousemove', () => {
      window.__simpleYtTweaksOffCardPreviewEvents?.push('mousemove');
    });

    document.querySelector('ytd-browse[page-subtype="home"] ytd-rich-grid-renderer #contents')?.prepend(card);

    const staleLoader = document.createElement('ytd-video-preview-loader');
    staleLoader.setAttribute('data-testid', 'off-card-stale-loader');
    staleLoader.setAttribute(
      'style',
      'position: fixed; left: -5000px; top: 0; width: 280px; height: 128px; z-index: 10000; pointer-events: auto;',
    );
    staleLoader.innerHTML = `
      <ytd-video-preview style="display: block; width: 280px; height: 128px;">
        <a id="media-container-link" href="/watch?v=off-card-same-video-card">
          <ytd-player id="inline-player">
            <div id="inline-preview-player">
              <video data-testid="off-card-stale-video" src="fixture-stale.mp4" style="display: block; width: 280px; height: 128px;"></video>
            </div>
          </ytd-player>
        </a>
      </ytd-video-preview>
    `;
    document.querySelector('#video-preview')?.append(staleLoader);

    history.pushState({}, '', '/');
    window.dispatchEvent(new PopStateEvent('popstate'));

    const rect = card.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + 154,
    };
  });

  await page.mouse.move(hoverPoint.x, hoverPoint.y);
  await expect(page.locator('[data-testid="off-card-stale-loader"]')).toHaveCount(0, { timeout: 2_500 });
  await expect.poll(() => page.evaluate(() => window.__simpleYtTweaksOffCardPreviewEvents ?? [])).toEqual([
    'mousemove',
  ]);
  await expect(page.locator('[data-testid="off-card-same-video-card"]')).not.toHaveClass(
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

  const videoSurface = page.locator('#movie_player video.html5-main-video');
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

  const modernRecommendedCard = page.locator('[data-testid="modern-recommended-card"]');
  await modernRecommendedCard.locator('yt-thumbnail-view-model').hover();
  await expect(modernRecommendedCard).not.toHaveClass(/simple-yt-tweaks-grid-hover-ready/, { timeout: 250 });
  await expect(modernRecommendedCard).toHaveClass(/simple-yt-tweaks-grid-hover-ready/, { timeout: 1_500 });

  await videoSurface.click({ position: { x: 120, y: 120 } });
  await expect.poll(() => page.evaluate(() => window.__simpleYtTweaksPlaybackEvents ?? [])).toContainEqual('play');
  await videoSurface.click({ position: { x: 120, y: 120 } });
  await expect.poll(() => page.evaluate(() => window.__simpleYtTweaksPlaybackEvents ?? [])).toContainEqual('pause');

  await page.locator('ytd-watch-flexy').evaluate((watchFlexy) => {
    watchFlexy.setAttribute('theater', '');
  });
  await expect(page.locator('body')).toHaveClass(/simple-yt-tweaks-theater/);
  await expect(page.locator('#comments')).toBeVisible();
  await page.locator('#comments').scrollIntoViewIfNeeded();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(100);
  await page.locator('#comments').evaluate((comments) => comments.append(document.createElement('span')));
  await page.waitForTimeout(300);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(100);

  const playerPointerEvents = await page.locator('#movie_player video.html5-main-video').evaluate((video) => getComputedStyle(video).pointerEvents);
  expect(playerPointerEvents).toBe('auto');
  expect(extensionErrors(errors)).toEqual([]);
});

test('watch fixture keeps live chat overlay from squeezing the theater player', async ({ context, extensionId }) => {
  await writeExtensionSettings(context, extensionId, {
    theaterHideLiveChat: true,
    theaterShowLiveChatOverlay: true,
  });

  const page = await context.newPage();
  await page.addInitScript(() => {
    const originalMatchMedia = window.matchMedia.bind(window);
    window.matchMedia = (query: string): MediaQueryList => {
      const result = originalMatchMedia(query);
      if (query.includes('display-mode: minimal-ui')) {
        return {
          ...result,
          matches: true,
          media: query,
          addEventListener: result.addEventListener.bind(result),
          removeEventListener: result.removeEventListener.bind(result),
          addListener: result.addListener.bind(result),
          removeListener: result.removeListener.bind(result),
          dispatchEvent: result.dispatchEvent.bind(result),
        };
      }

      return result;
    };
  });
  const errors = await openFixture(page, 'watch', 'https://www.youtube.com/watch?v=live-fixture');

  await page.locator('ytd-watch-flexy').evaluate((watchFlexy) => {
    watchFlexy.setAttribute('theater', '');
    watchFlexy.setAttribute('full-bleed-player', '');
    watchFlexy.setAttribute('live-chat-present-and-expanded', '');
    watchFlexy.setAttribute('should-stamp-chat', '');
    watchFlexy.setAttribute('squeezeback', '');
    watchFlexy.setAttribute('watch-while-panels-active', '');

    const playerContainer = document.querySelector('#player-container');
    const columns = document.querySelector('#columns');
    const secondary = document.querySelector('#secondary');
    if (!playerContainer || !columns || !secondary || document.querySelector('#full-bleed-container')) return;

    const fullBleedContainer = document.createElement('div');
    fullBleedContainer.id = 'full-bleed-container';
    fullBleedContainer.style.cssText = 'display: flex; width: 100vw; height: 540px; overflow: hidden;';

    const playerFullBleedContainer = document.createElement('div');
    playerFullBleedContainer.id = 'player-full-bleed-container';
    playerFullBleedContainer.style.cssText = 'display: block; flex: 1 1 0%; width: 558px; height: 540px; overflow: hidden; position: relative;';

    const panelsFullBleedContainer = document.createElement('div');
    panelsFullBleedContainer.id = 'panels-full-bleed-container';
    panelsFullBleedContainer.style.cssText = 'display: block; flex: 0 1 auto; width: 402px; height: 540px;';

    const chatContainer = document.createElement('div');
    chatContainer.id = 'chat-container';
    const liveChatFrame = document.createElement('ytd-live-chat-frame');
    liveChatFrame.id = 'chat';
    const chatFrame = document.createElement('iframe');
    chatFrame.id = 'chatframe';
    liveChatFrame.append(chatFrame);
    chatContainer.append(liveChatFrame);
    secondary.append(chatContainer);

    playerContainer.parentElement?.insertBefore(fullBleedContainer, playerContainer);
    playerFullBleedContainer.append(playerContainer);
    panelsFullBleedContainer.append(secondary);
    fullBleedContainer.append(playerFullBleedContainer, panelsFullBleedContainer);
    columns.prepend(fullBleedContainer);

    document.querySelector('#movie_player')?.classList.add('ytp-livebadge-color');
  });

  await expect(page.locator('body')).toHaveClass(/simple-yt-tweaks-theater/);
  await expect(page.locator('body')).toHaveClass(/simple-yt-tweaks-has-live-chat/);
  const viewportWidth = await page.evaluate(() => window.innerWidth);
  await expect
    .poll(() =>
      page.locator('#player-full-bleed-container').evaluate((element) => ({
        elementWidth: element.getBoundingClientRect().width,
        viewportWidth: window.innerWidth,
      })),
    )
    .toEqual({ elementWidth: viewportWidth, viewportWidth });
  await expect(page.locator('#panels-full-bleed-container')).toHaveCSS('width', '0px');
  await expect(page.locator('ytd-live-chat-frame#chat')).toHaveCSS('width', '380px');
  await expect(page.locator('iframe#chatframe')).toHaveCSS('width', '380px');
  await expect(page.locator('#simple-yt-tweaks-live-chat-close')).toHaveCount(0);
  await expect(page.locator('#simple-yt-tweaks-live-chat-restore')).toBeHidden();
  await page.evaluate(() => {
    const legacyClose = document.createElement('button');
    legacyClose.id = 'simple-yt-tweaks-live-chat-close';
    legacyClose.textContent = '×';
    legacyClose.title = 'Minimize live chat';
    document.body.append(legacyClose);
    document.querySelector('#comments')?.append(document.createElement('span'));
  });
  await expect(page.locator('#simple-yt-tweaks-live-chat-close')).toHaveCount(0);

  await page.locator('iframe#chatframe').evaluate((iframe) => {
    iframe.setAttribute('src', '/live_chat?v=live-fixture&dark_theme=1&continuation=original-chat');
  });
  await page.locator('ytd-live-chat-frame#chat').evaluate((chat) => {
    chat.append(document.createElement('span'));
  });
  await expect(page.locator('ytd-live-chat-frame#chat')).toHaveAttribute(
    'data-simple-yt-tweaks-chat-src',
    '/live_chat?v=live-fixture&dark_theme=1&continuation=original-chat',
  );
  await page.locator('ytd-live-chat-frame#chat').evaluate((chat) => {
    const nativeClose = document.createElement('button');
    nativeClose.id = 'close-button';
    nativeClose.setAttribute('aria-label', 'Close');
    nativeClose.addEventListener('click', () => {
      chat.setAttribute('collapsed', '');
      chat.querySelector('iframe#chatframe')?.removeAttribute('src');
    });
    chat.append(nativeClose);
  });
  await page.locator('ytd-live-chat-frame#chat #close-button').click();
  await expect(page.locator('body')).toHaveClass(/simple-yt-tweaks-live-chat-minimized/);
  await expect(page.locator('ytd-live-chat-frame#chat')).not.toHaveAttribute('collapsed', '');
  await expect(page.locator('iframe#chatframe')).toHaveAttribute(
    'src',
    '/live_chat?v=live-fixture&dark_theme=1&continuation=original-chat',
  );
  await page.locator('#simple-yt-tweaks-live-chat-restore').click();
  await expect(page.locator('body')).not.toHaveClass(/simple-yt-tweaks-live-chat-minimized/);

  await page.locator('ytd-live-chat-frame#chat').evaluate((chat) => {
    chat.setAttribute('collapsed', '');
    chat.setAttribute('hide-chat-frame', '');
    chat.querySelector('iframe#chatframe')?.removeAttribute('src');

    const showHide = document.createElement('div');
    showHide.id = 'show-hide-button';
    const showButton = document.createElement('button');
    showButton.setAttribute('aria-label', 'Show chat');
    showButton.addEventListener('click', () => {
      showHide.setAttribute('hidden', '');
      chat.setAttribute('theater-watch-while', '');
    });
    showHide.append(showButton);
    chat.append(showHide);
  });
  await expect(page.locator('body')).toHaveClass(/simple-yt-tweaks-live-chat-minimized/);
  await expect(page.locator('ytd-live-chat-frame#chat')).toHaveCSS('opacity', '0');
  await expect(page.locator('#simple-yt-tweaks-live-chat-restore')).toBeVisible();
  await expect
    .poll(() =>
      page.evaluate(() => {
        const restore = document.querySelector('#simple-yt-tweaks-live-chat-restore')?.getBoundingClientRect();
        return Boolean(restore && restore.width > 0 && restore.left < window.innerWidth && restore.right > window.innerWidth - 48);
      }),
    )
    .toBe(true);

  await page.locator('#simple-yt-tweaks-live-chat-restore').click();
  await expect(page.locator('body')).not.toHaveClass(/simple-yt-tweaks-live-chat-minimized/);
  await expect(page.locator('ytd-live-chat-frame#chat')).not.toHaveAttribute('collapsed', '');
  await expect(page.locator('ytd-live-chat-frame#chat')).not.toHaveAttribute('hide-chat-frame', '');
  await expect(page.locator('ytd-live-chat-frame#chat #show-hide-button')).toHaveAttribute('hidden', '');
  await expect(page.locator('ytd-live-chat-frame#chat')).toHaveAttribute('theater-watch-while', '');
  await expect(page.locator('iframe#chatframe')).toHaveAttribute(
    'src',
    '/live_chat?v=live-fixture&dark_theme=1&continuation=original-chat',
  );
  await expect(page.locator('#simple-yt-tweaks-live-chat-close')).toHaveCount(0);
  expect(extensionErrors(errors)).toEqual([]);
});

test('watch fixture hides non-overlay live chat without leaving a black theater panel', async ({ context, extensionId }) => {
  await writeExtensionSettings(context, extensionId, {
    theaterHideLiveChat: true,
    theaterShowLiveChatOverlay: false,
  });

  const page = await context.newPage();
  const errors = await openFixture(page, 'watch', 'https://www.youtube.com/watch?v=live-fixture');

  await page.locator('ytd-watch-flexy').evaluate((watchFlexy) => {
    watchFlexy.setAttribute('theater', '');
    watchFlexy.setAttribute('full-bleed-player', '');
    watchFlexy.setAttribute('live-chat-present-and-expanded', '');
    watchFlexy.setAttribute('should-stamp-chat', '');
    watchFlexy.setAttribute('squeezeback', '');
    watchFlexy.setAttribute('watch-while-panels-active', '');

    const playerContainer = document.querySelector('#player-container');
    const columns = document.querySelector('#columns');
    const secondary = document.querySelector('#secondary');
    if (!playerContainer || !columns || !secondary || document.querySelector('#full-bleed-container')) return;

    const fullBleedContainer = document.createElement('div');
    fullBleedContainer.id = 'full-bleed-container';
    fullBleedContainer.style.cssText = 'display: flex; width: 100vw; height: 540px; overflow: hidden;';

    const playerFullBleedContainer = document.createElement('div');
    playerFullBleedContainer.id = 'player-full-bleed-container';
    playerFullBleedContainer.style.cssText = 'display: block; flex: 1 1 0%; width: 558px; height: 540px; overflow: hidden; position: relative;';

    const panelsFullBleedContainer = document.createElement('div');
    panelsFullBleedContainer.id = 'panels-full-bleed-container';
    panelsFullBleedContainer.style.cssText = 'display: block; flex: 0 1 auto; width: 402px; height: 540px; background: #000;';

    const chatContainer = document.createElement('div');
    chatContainer.id = 'chat-container';
    const liveChatFrame = document.createElement('ytd-live-chat-frame');
    liveChatFrame.id = 'chat';
    const chatFrame = document.createElement('iframe');
    chatFrame.id = 'chatframe';
    liveChatFrame.append(chatFrame);
    chatContainer.append(liveChatFrame);
    secondary.append(chatContainer);

    playerContainer.parentElement?.insertBefore(fullBleedContainer, playerContainer);
    playerFullBleedContainer.append(playerContainer);
    panelsFullBleedContainer.append(secondary);
    fullBleedContainer.append(playerFullBleedContainer, panelsFullBleedContainer);
    columns.prepend(fullBleedContainer);

    document.querySelector('#movie_player')?.classList.add('ytp-livebadge-color');
  });

  await expect(page.locator('body')).toHaveClass(/simple-yt-tweaks-theater/);
  await expect(page.locator('body')).toHaveClass(/simple-yt-tweaks-has-live-chat/);
  const viewportWidth = await page.evaluate(() => window.innerWidth);
  await expect
    .poll(() =>
      page.locator('#player-full-bleed-container').evaluate((element) => ({
        elementWidth: element.getBoundingClientRect().width,
        viewportWidth: window.innerWidth,
      })),
    )
    .toEqual({ elementWidth: viewportWidth, viewportWidth });
  await expect(page.locator('#panels-full-bleed-container')).toHaveCSS('width', '0px');
  await expect(page.locator('#secondary')).toHaveCSS('width', '0px');
  await expect(page.locator('ytd-live-chat-frame#chat')).toBeHidden();
  await expect(page.locator('#simple-yt-tweaks-live-chat-restore')).toHaveCount(0);
  expect(extensionErrors(errors)).toEqual([]);
});

test('watch fixture docks and restores sticky player when player scrolls away', async ({ context }) => {
  const page = await context.newPage();
  const errors = await openFixture(page, 'watch', 'https://www.youtube.com/watch?v=fixture');

  await expect(page.locator('body')).toHaveClass(/simple-yt-tweaks-default-view/);
  await expect(page.locator('body')).not.toHaveClass(/simple-yt-tweaks-sticky-player-active/);
  await expect(page.locator('#simple-yt-tweaks-sticky-player-shell')).toHaveCount(0);
  await expect(page.locator('#simple-yt-tweaks-sticky-player-placeholder')).toHaveCount(0);
  await expect(page.locator('#player > #movie_player')).toHaveCount(1);

  await page.evaluate(() => window.scrollTo(0, 650));
  await expect(page.locator('body')).toHaveClass(/simple-yt-tweaks-sticky-player-active/);
  await expect(page.locator('#simple-yt-tweaks-sticky-player-shell #movie_player')).toHaveCount(1);
  await expect(page.locator('#player > #simple-yt-tweaks-sticky-player-placeholder')).toHaveCount(1);
  await expect(page.locator('#player > #movie_player')).toHaveCount(0);

  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(page.locator('body')).not.toHaveClass(/simple-yt-tweaks-sticky-player-active/);
  await expect(page.locator('#simple-yt-tweaks-sticky-player-shell')).toHaveCount(0);
  await expect(page.locator('#simple-yt-tweaks-sticky-player-placeholder')).toHaveCount(0);
  await expect(page.locator('#player > #movie_player')).toHaveCount(1);
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

  await page.locator('#movie_player video.html5-main-video').click({ modifiers: ['Shift'], position: { x: 120, y: 120 } });
  await page.waitForTimeout(260);
  expect(await playbackEvents(page)).toEqual([]);
  expect(extensionErrors(errors)).toEqual([]);
});

test('player click fallback corrects transient native no-op clicks', async ({ context }) => {
  const page = await context.newPage();
  const errors = await openFixture(page, 'watch', 'https://www.youtube.com/watch?v=fixture');

  const videoSurface = page.locator('#movie_player video.html5-main-video');
  await setupPlaybackProbe(page);
  await videoSurface.click({ position: { x: 120, y: 120 } });
  await expect.poll(() => playbackEvents(page)).toContainEqual('play');

  await videoSurface.evaluate((video) => {
    window.__simpleYtTweaksPlaybackEvents = [];
    window.__simpleYtTweaksSimulateTransientClick = true;
    document.querySelector('#movie_player')?.addEventListener(
      'click',
      () => {
        if (!window.__simpleYtTweaksSimulateTransientClick) return;
        window.__simpleYtTweaksSimulateTransientClick = false;
        video.pause();
        window.setTimeout(() => {
          void video.play();
        }, 260);
      },
      { capture: true },
    );
  });

  await videoSurface.click({ position: { x: 120, y: 120 } });
  await expect.poll(() => playbackEvents(page), { timeout: 1_500 }).toEqual(['pause', 'play', 'pause']);
  await expect.poll(() => videoSurface.evaluate((video) => video.paused)).toBe(true);
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
  await expect.poll(() => readExtensionSettings(page)).toMatchObject({
    pipButton: false,
    floatingMiniPlayer: false,
  });
  await page.reload();
  await expect(page.locator('#pipButton')).not.toBeChecked();
  await page.locator('#resetBtn').click();
  await expect(page.locator('#pipButton')).toBeChecked();
  await expect.poll(() => readExtensionSettings(page)).toMatchObject({
    pipButton: true,
    floatingMiniPlayer: true,
  });

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

test('popup fixture resets only the active settings pane', async ({ context, extensionId }) => {
  await writeExtensionSettings(context, extensionId, {
    generalFeedColumns: 4,
    generalApplyFeedColumnsToSearch: false,
    generalStickyPlayer: false,
    pipButton: false,
    floatingMiniPlayer: false,
    generalSidebarCleanup: false,
    generalHideSidebar: true,
    defaultHideComments: true,
  });

  const page = await context.newPage();
  const errors = collectPageErrors(page);
  await page.goto(`chrome-extension://${extensionId}/popup/popup.html`);

  await expect(page.locator('#settingsTabs button', { hasText: 'General' })).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('#generalFeedColumns')).toHaveValue('4');
  await expect(page.locator('#generalStickyPlayer')).not.toBeChecked();
  await page.locator('#resetBtn').click();

  await expect(page.locator('#generalFeedColumns')).toHaveValue('3');
  await expect(page.locator('#generalStickyPlayer')).toBeChecked();
  await expect.poll(() => readExtensionSettings(page)).toMatchObject({
    generalFeedColumns: 3,
    generalApplyFeedColumnsToSearch: true,
    generalStickyPlayer: true,
    pipButton: true,
    floatingMiniPlayer: true,
    generalSidebarCleanup: false,
    generalHideSidebar: true,
    defaultHideComments: true,
  });

  await page.locator('#settingsTabs button', { hasText: 'Modes' }).click();
  await page.locator('#viewModes button', { hasText: 'Default' }).click();
  await expect(page.locator('#defaultHideComments')).toBeChecked();
  await page.locator('#resetBtn').click();
  await expect(page.locator('#defaultHideComments')).not.toBeChecked();
  await expect.poll(() => readExtensionSettings(page)).toMatchObject({
    generalSidebarCleanup: false,
    generalHideSidebar: true,
    defaultHideComments: false,
  });
  expect(extensionErrors(errors)).toEqual([]);
});

test('popup fixture keeps nested child disabled state aligned with parent settings', async ({ context, extensionId }) => {
  await writeExtensionSettings(context, extensionId, {
    enhancedTheaterMode: true,
    theaterHideHeader: false,
    theaterShowHeaderOnHover: true,
    theaterHideRecommendations: false,
    theaterRecommendedHoverGrow: true,
    defaultHideMetadata: false,
    defaultShowPrimaryMetadata: true,
    defaultHideRecommendations: false,
    defaultRecommendedHoverGrow: true,
  });

  const page = await context.newPage();
  const errors = collectPageErrors(page);
  await page.goto(`chrome-extension://${extensionId}/popup/popup.html`);

  await page.locator('#settingsTabs button', { hasText: 'Modes' }).click();
  await expect(page.locator('#theaterHideHeader')).not.toBeChecked();
  await expect(page.locator('#theaterShowHeaderOnHover')).toBeChecked();
  await expect(page.locator('#theaterShowHeaderOnHover')).toBeDisabled();
  await expect(page.locator('#theaterHideRecommendations')).not.toBeChecked();
  await expect(page.locator('#theaterRecommendedHoverGrow')).toBeChecked();
  await expect(page.locator('#theaterRecommendedHoverGrow')).toBeEnabled();

  await page.locator('#viewModes button', { hasText: 'Default' }).click();
  await expect(page.locator('#defaultHideMetadata')).not.toBeChecked();
  await expect(page.locator('#defaultShowPrimaryMetadata')).toBeChecked();
  await expect(page.locator('#defaultShowPrimaryMetadata')).toBeDisabled();
  await expect(page.locator('#defaultHideRecommendations')).not.toBeChecked();
  await expect(page.locator('#defaultRecommendedHoverGrow')).toBeChecked();
  await expect(page.locator('#defaultRecommendedHoverGrow')).toBeEnabled();
  expect(extensionErrors(errors)).toEqual([]);
});

test('popup fixture turns on sidebar Shorts cleanup when Hide Shorts is enabled', async ({ context, extensionId }) => {
  await writeExtensionSettings(context, extensionId, {
    generalHideShorts: false,
    generalSidebarCleanup: false,
    generalHideSidebarShorts: false,
  });

  const page = await context.newPage();
  const errors = collectPageErrors(page);
  await page.goto(`chrome-extension://${extensionId}/popup/popup.html`);

  await expect(page.locator('#generalHideShorts')).not.toBeChecked();
  await page.locator('#generalHideShorts').check();
  await expect.poll(() => readExtensionSettings(page)).toMatchObject({
    generalHideShorts: true,
    generalSidebarCleanup: true,
    generalHideSidebarShorts: true,
  });

  await page.locator('#settingsTabs button', { hasText: 'Sidebar' }).click();
  await expect(page.locator('#generalSidebarCleanup')).toBeChecked();
  await expect(page.locator('#generalHideSidebarShorts')).toBeChecked();
  await expect(page.locator('#generalHideSidebarShorts')).toBeEnabled();
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
