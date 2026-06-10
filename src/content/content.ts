import { buildFullscreenCss, buildSharedPlayerUiCss, resetFullscreenGridPeekState, resetFullscreenNavigationState, shouldSuppressFullscreenGridPeekInteraction, updateFullscreenActionDock, updatePlayerUiFocusState, updatePlayerUiHoverState } from './fullscreen';
import { bindGridHoverHandlers, buildGridHoverCss, syncGridHoverState } from './grid-hover';
import { bindPlayerSurfaceClickFallback, bindPointerHandlers, bindRuntimeMessages, bindStorageObserver, bindVideoEvents, observeDom, observeNavigation, scheduleModeStabilization, syncWatchObserver, updateViewportHeightVar } from './lifecycle';
import { buildPipCss, ensureMiniPlayerPipButton, syncPipButtons } from './pip';
import { GENERAL_HIDDEN_CLASS, SELECTORS, STYLE_ID } from './selectors';
import { loadSettings } from './settings';
import { buildGeneralCss, buildSidebarCss, clearStaleSidebarItemFocus, updateGeneralVisibility, updateSidebarHomeSelectionState } from './sidebar';
import { state } from './state';
import { buildStickyPlayerCss, resetStickyPlayerState, updateStickyPlayerState } from './sticky-player';
import { buildTheaterCss, clearStaleGuideFocus, updateLiveChatTargets, updateMastheadTargets, updateScrollbarState, updateTopHoverState, updateViewClasses } from './theater';

const WATCH_TO_HOME_RELOAD_KEY = 'simpleYtTweaksWatchToHomeReload';
const WATCH_TO_HOME_RELOAD_GUARD_MS = 8_000;
const WATCH_TO_HOME_URL_POLL_MS = 250;
let watchNavigationCaptureBound = false;
let watchToHomeUrlWatcherId: number | null = null;
let lastObservedNavigationHref = location.href;

function buildUtilityCss(): string {
  return `
    .${GENERAL_HIDDEN_CLASS} {
      display: none !important;
    }
  `;
}

function buildDefaultCss(): string {
  return `
    ${state.settings.defaultHideRecommendations ? `
    body.simple-yt-tweaks-default-view #related,
    body.simple-yt-tweaks-default-view ytd-watch-next-secondary-results-renderer {
      display: none !important;
    }
    ` : ''}

    ${state.settings.defaultHideComments ? `
    body.simple-yt-tweaks-default-view #comments {
      display: none !important;
    }
    ` : ''}

    ${!state.settings.defaultHideComments ? `
    body.simple-yt-tweaks-default-view #below,
    body.simple-yt-tweaks-default-view #comments {
      max-height: none !important;
      overflow: visible !important;
      visibility: visible !important;
    }

    body.simple-yt-tweaks-default-view #comments {
      display: block !important;
    }
    ` : ''}

    ${state.settings.defaultHideMetadata && !state.settings.defaultShowPrimaryMetadata ? `
    body.simple-yt-tweaks-default-view ytd-watch-metadata,
    body.simple-yt-tweaks-default-view #info-contents ytd-video-primary-info-renderer,
    body.simple-yt-tweaks-default-view #meta-contents ytd-video-secondary-info-renderer {
      display: none !important;
    }
    ` : ''}

    ${state.settings.defaultHideMetadata && state.settings.defaultShowPrimaryMetadata ? `
    body.simple-yt-tweaks-default-view ytd-watch-metadata #bottom-row,
    body.simple-yt-tweaks-default-view ytd-watch-metadata #description,
    body.simple-yt-tweaks-default-view ytd-watch-metadata #description-inline-expander,
    body.simple-yt-tweaks-default-view ytd-watch-metadata ytd-text-inline-expander,
    body.simple-yt-tweaks-default-view #info-contents ytd-video-primary-info-renderer #info,
    body.simple-yt-tweaks-default-view #meta-contents ytd-video-secondary-info-renderer #description,
    body.simple-yt-tweaks-default-view #meta-contents ytd-video-secondary-info-renderer #metadata,
    body.simple-yt-tweaks-default-view #meta-contents ytd-video-secondary-info-renderer ytd-expander {
      display: none !important;
    }

    body.simple-yt-tweaks-default-view ytd-watch-metadata #title,
    body.simple-yt-tweaks-default-view #info-contents ytd-video-primary-info-renderer #title {
      display: block !important;
    }

    body.simple-yt-tweaks-default-view ytd-watch-metadata #top-row,
    body.simple-yt-tweaks-default-view #meta-contents ytd-video-secondary-info-renderer #owner {
      display: flex !important;
    }
    ` : ''}

    ${state.settings.defaultHideLiveChat ? `
    body.simple-yt-tweaks-default-view ${SELECTORS.liveChat} {
      display: none !important;
    }
    ` : ''}
  `;
}

function buildCss(): string {
  return [
    buildUtilityCss(),
    buildPipCss(),
    buildGeneralCss(state.settings),
    buildSidebarCss(state.settings),
    buildTheaterCss(state.settings),
    buildSharedPlayerUiCss(state.settings),
    buildFullscreenCss(state.settings),
    buildDefaultCss(),
    buildStickyPlayerCss(state.settings),
    buildGridHoverCss(state.settings),
  ].join('\n');
}

function ensureStyle(): void {
  let styleEl = document.getElementById(STYLE_ID);
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = STYLE_ID;
    document.documentElement.append(styleEl);
  }

  styleEl.textContent = buildCss();
  document.body.classList.add('simple-yt-tweaks-active');
}

function parseLocation(href: string): URL | null {
  try {
    return new URL(href, location.origin);
  } catch {
    return null;
  }
}

function getWatchVideoId(href: string): string {
  const url = parseLocation(href);
  if (!url || url.pathname !== '/watch') return '';

  return url.searchParams.get('v') ?? '';
}

function recordCurrentWatchNavigation(syncCurrentUrl = false): void {
  const videoId = getWatchVideoId(location.href);
  if (!videoId || !document.querySelector('ytd-watch-flexy')) return;

  state.lastWatchNavigationVideoId = videoId;
  if (syncCurrentUrl) {
    state.currentUrl = location.href;
  }
  try {
    sessionStorage.removeItem(WATCH_TO_HOME_RELOAD_KEY);
  } catch {
    // If storage is unavailable, the URL transition check below still keeps the reload one-shot per page life.
  }
}

function isHomeNavigationClick(event: MouseEvent): boolean {
  if (!(event.target instanceof Element)) return false;

  const link = event.target.closest<HTMLAnchorElement>(
    [
      'ytd-topbar-logo-renderer a',
      'a#logo',
      'a[title="YouTube Home"]',
      'a[aria-label="YouTube Home"]',
      'ytd-guide-entry-renderer a[href="/"]',
      'a[href="/"]',
    ].join(','),
  );
  if (!link) return false;
  if (link.getAttribute('href') === '/') return true;

  const label = `${link.getAttribute('title') ?? ''} ${link.getAttribute('aria-label') ?? ''}`.trim();
  return /\b(?:YouTube|Home)\b/i.test(label);
}

function bindWatchNavigationCapture(): void {
  if (watchNavigationCaptureBound) return;
  watchNavigationCaptureBound = true;

  window.addEventListener('yt-navigate-start', () => recordCurrentWatchNavigation(true), {
    capture: true,
    passive: true,
  });
  document.addEventListener(
    'click',
    (event) => {
      if (isHomeNavigationClick(event)) recordCurrentWatchNavigation(true);
    },
    { capture: true, passive: true },
  );
}

function syncWatchToHomeUrlWatcher(): void {
  recordCurrentWatchNavigation();

  const nextHref = location.href;
  if (nextHref === lastObservedNavigationHref) return;

  const previousHref = lastObservedNavigationHref;
  lastObservedNavigationHref = nextHref;
  maybeReloadHomeAfterWatchNavigation(previousHref, nextHref);
}

function bindWatchToHomeUrlWatcher(): void {
  if (watchToHomeUrlWatcherId !== null) return;
  watchToHomeUrlWatcherId = window.setInterval(syncWatchToHomeUrlWatcher, WATCH_TO_HOME_URL_POLL_MS);
}

function maybeReloadHomeAfterWatchNavigation(previousHref: string, nextHref: string): boolean {
  const previousUrl = parseLocation(previousHref);
  const nextUrl = parseLocation(nextHref);
  if (!previousUrl || !nextUrl || previousUrl.pathname !== '/watch' || nextUrl.pathname !== '/') return false;

  const videoId = state.lastWatchNavigationVideoId;
  if (!videoId) return false;

  const now = Date.now();
  let lastReload = '';
  try {
    lastReload = sessionStorage.getItem(WATCH_TO_HOME_RELOAD_KEY) ?? '';
  } catch {
    lastReload = '';
  }

  if (lastReload) {
    const [lastVideoId, lastAtValue] = lastReload.split(':');
    const lastAt = Number(lastAtValue);
    if (lastVideoId === videoId && Number.isFinite(lastAt) && now - lastAt < WATCH_TO_HOME_RELOAD_GUARD_MS) {
      return false;
    }
  }

  try {
    sessionStorage.setItem(WATCH_TO_HOME_RELOAD_KEY, `${videoId}:${now}`);
  } catch {
    // The reload itself is still safe; storage only prevents duplicate navigation events from retriggering.
  }

  window.setTimeout(() => {
    if (location.pathname === '/') {
      location.reload();
    }
  }, 80);

  return true;
}

function resetNavigationState(): void {
  if (location.href === state.currentUrl) return;

  const previousUrl = state.currentUrl;
  state.currentUrl = location.href;
  document.body.classList.remove('simple-yt-tweaks-player-ui-hover');
  document.body.classList.remove('simple-yt-tweaks-player-ui-focus');
  document.body.classList.remove('simple-yt-tweaks-top-hover');
  resetStickyPlayerState();
  resetFullscreenNavigationState();
  state.homeFeedCleanupDeferredUntil = Date.now() + 1_500;
  maybeReloadHomeAfterWatchNavigation(previousUrl, location.href);
}

function refreshPlayerLayout(): void {
  window.dispatchEvent(new Event('resize'));
  window.requestAnimationFrame(() => window.dispatchEvent(new Event('resize')));
  window.setTimeout(() => window.dispatchEvent(new Event('resize')), 120);
}

function stabilizeUi(): void {
  updateViewportHeightVar();
  updateViewClasses();
  resetFullscreenGridPeekState();
  updateMastheadTargets();
  updateLiveChatTargets();
  updateGeneralVisibility();
  clearStaleGuideFocus();
  clearStaleSidebarItemFocus();
  updateSidebarHomeSelectionState();
  updateScrollbarState();
  ensureMiniPlayerPipButton();
  updateFullscreenActionDock();
  updateStickyPlayerState();
  syncGridHoverState(state.settings);
  refreshPlayerLayout();
}

function refreshInteractionUiState(): void {
  updatePlayerUiHoverState(state.lastPointerX, state.lastPointerY);
  updatePlayerUiFocusState();
  resetFullscreenGridPeekState();
  updateFullscreenActionDock();
  updateStickyPlayerState();
}

function bindFullscreenGridPeekSuppressor(): void {
  const suppressGridPeek = (event: WheelEvent | TouchEvent) => {
    if (!shouldSuppressFullscreenGridPeekInteraction()) return;

    event.preventDefault();
    event.stopImmediatePropagation();
    refreshInteractionUiState();
    window.requestAnimationFrame(refreshInteractionUiState);
    window.setTimeout(refreshInteractionUiState, 80);
  };

  document.addEventListener('wheel', suppressGridPeek, { capture: true, passive: false });
  document.addEventListener('touchmove', suppressGridPeek, { capture: true, passive: false });
}

function applyFeatureState(): void {
  if (!document.body) return;

  if (state.domRerun) {
    syncWatchObserver(state.domRerun);
  }

  ensureStyle();
  bindWatchNavigationCapture();
  bindWatchToHomeUrlWatcher();
  recordCurrentWatchNavigation();
  resetNavigationState();
  updateViewportHeightVar();
  const modeChanged = updateViewClasses();
  resetFullscreenGridPeekState();
  updateMastheadTargets();
  updateLiveChatTargets();
  updateGeneralVisibility();
  clearStaleGuideFocus();
  clearStaleSidebarItemFocus();
  updateSidebarHomeSelectionState();
  updateScrollbarState();
  syncPipButtons();
  updateFullscreenActionDock();
  updateStickyPlayerState();
  syncGridHoverState(state.settings);

  if (
    state.settings.theaterHidePlayerUI ||
    state.settings.theaterShowHeaderOnHover ||
    state.settings.fullscreenHidePlayerUI ||
    state.settings.fullscreenHideTitleOverlay ||
    state.settings.fullscreenHideActionOverlay
  ) {
    bindPointerHandlers({
      updateTopHoverState,
      updatePlayerUiHoverState,
      clearStaleSidebarItemFocus,
      updateSidebarHomeSelectionState,
      updatePlayerUiFocusState,
      refreshInteractionUiState,
    });
  }

  if (
    !state.settings.theaterHidePlayerUI &&
    !state.settings.fullscreenHidePlayerUI &&
    !state.settings.fullscreenHideTitleOverlay &&
    !state.settings.fullscreenHideActionOverlay
  ) {
    document.body.classList.remove('simple-yt-tweaks-player-ui-hover');
    document.body.classList.remove('simple-yt-tweaks-player-ui-focus');
  }

  if (!state.settings.theaterShowHeaderOnHover) {
    document.body.classList.remove('simple-yt-tweaks-top-hover');
  }

  if (modeChanged) {
    refreshPlayerLayout();
    scheduleModeStabilization(stabilizeUi);
  }
}

async function init(): Promise<void> {
  state.settings = await loadSettings();

  if (!document.body) {
    window.addEventListener('DOMContentLoaded', () => void init(), { once: true });
    return;
  }

  ensureStyle();
  bindStorageObserver(applyFeatureState);
  observeDom(applyFeatureState);
  observeNavigation({
    rerun: applyFeatureState,
    onScrollUi: () => {
      resetFullscreenGridPeekState();
      updateScrollbarState();
      refreshInteractionUiState();
      updateFullscreenActionDock();
      ensureMiniPlayerPipButton();
      updateStickyPlayerState();
    },
    onViewportUi: stabilizeUi,
  });
  bindFullscreenGridPeekSuppressor();
  bindGridHoverHandlers(() => state.settings);
  bindPlayerSurfaceClickFallback();
  bindRuntimeMessages();
  bindVideoEvents({
    onPipChange: () => {
      ensureMiniPlayerPipButton();
      updateStickyPlayerState();
    },
    onPlaybackStateChange: () => {
      refreshInteractionUiState();
    },
  });
  applyFeatureState();
}

init().catch((error) => {
  console.error('Simple YT Tweaks failed to initialize:', error);
});
