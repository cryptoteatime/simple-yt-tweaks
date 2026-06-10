import { expect, test } from '@playwright/test';

import { buildGridHoverCss } from '../../src/content/grid-hover';
import { DEFAULT_SETTINGS } from '../../src/content/settings';
import type { Settings } from '../../src/content/settings';

function settings(overrides: Partial<Settings>): Settings {
  return {
    ...DEFAULT_SETTINGS,
    ...overrides,
  };
}

test('grid hover CSS scopes watch recommendation selectors to enabled modes', () => {
  const css = buildGridHoverCss(settings({
    generalApplyFeedColumnsToSearch: false,
    defaultRecommendedHoverGrow: true,
    theaterRecommendedHoverGrow: true,
  }));

  expect(css).toContain('body.simple-yt-tweaks-active.simple-yt-tweaks-default-view ytd-compact-video-renderer');
  expect(css).toContain('body.simple-yt-tweaks-active.simple-yt-tweaks-theater ytd-compact-video-renderer');
  expect(css).toContain(
    'body.simple-yt-tweaks-active.simple-yt-tweaks-default-view #secondary yt-lockup-view-model:has(a[href*="/watch"]) yt-thumbnail-view-model',
  );
  expect(css).toContain(
    'body.simple-yt-tweaks-active.simple-yt-tweaks-theater #related yt-lockup-view-model.simple-yt-tweaks-grid-hover-ready:has(a[href*="/watch"]) thumbnail-overlay-button-view-model button .ytIconWrapperHost',
  );
});

test('grid hover CSS omits disabled watch recommendation hover scopes', () => {
  const theaterOnlyCss = buildGridHoverCss(settings({
    generalApplyFeedColumnsToSearch: false,
    defaultRecommendedHoverGrow: false,
    theaterRecommendedHoverGrow: true,
  }));

  expect(theaterOnlyCss).not.toContain('body.simple-yt-tweaks-active.simple-yt-tweaks-default-view');
  expect(theaterOnlyCss).toContain('body.simple-yt-tweaks-active.simple-yt-tweaks-theater ytd-compact-video-renderer');

  const disabledCss = buildGridHoverCss(settings({
    generalApplyFeedColumnsToSearch: false,
    defaultRecommendedHoverGrow: false,
    theaterRecommendedHoverGrow: false,
  }));

  expect(disabledCss).not.toContain('simple-yt-tweaks-grid-hover-ready');
  expect(disabledCss).not.toContain('ytd-compact-video-renderer');
});
