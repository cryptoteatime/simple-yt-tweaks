import { buildFullscreenCss, buildSharedPlayerUiCss, resetFullscreenGridPeekState, resetFullscreenNavigationState, shouldSuppressFullscreenGridPeekInteraction, updateFullscreenActionDock, updatePlayerUiFocusState, updatePlayerUiHoverState } from './fullscreen';
import { bindPointerHandlers, bindRuntimeMessages, bindStorageObserver, bindVideoEvents, observeDom, observeNavigation, scheduleModeStabilization, syncWatchObserver, updateViewportHeightVar } from './lifecycle';
import { buildPipCss, ensureMiniPlayerPipButton, syncPipButtons } from './pip';
import { GENERAL_HIDDEN_CLASS, SELECTORS, STYLE_ID } from './selectors';
import { loadSettings } from './settings';
import { buildGeneralCss, buildSidebarCss, clearStaleSidebarItemFocus, updateGeneralVisibility, updateSidebarHomeSelectionState } from './sidebar';
import { state } from './state';
import { buildStickyPlayerCss, resetStickyPlayerState, updateStickyPlayerState } from './sticky-player';
import { buildTheaterCss, clearStaleGuideFocus, updateLiveChatTargets, updateMastheadTargets, updateScrollbarState, updateTopHoverState, updateViewClasses } from './theater';

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

function resetNavigationState(): void {
  if (location.href === state.currentUrl) return;

  state.currentUrl = location.href;
  document.body.classList.remove('simple-yt-tweaks-player-ui-hover');
  document.body.classList.remove('simple-yt-tweaks-player-ui-focus');
  document.body.classList.remove('simple-yt-tweaks-top-hover');
  resetStickyPlayerState();
  resetFullscreenNavigationState();
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
