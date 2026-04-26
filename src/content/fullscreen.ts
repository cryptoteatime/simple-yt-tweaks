import { debounce, getPlayer, isNativeFullscreenActive, isVisibleNode, isWatchPage, query, queryAll } from './dom';
import {
  FULLSCREEN_ACTION_DOCK_ID,
  FULLSCREEN_ACTION_TARGET_CLASS,
  MASTHEAD_CLASS,
  SELECTORS,
} from './selectors';
import type { Settings } from './settings';
import { state } from './state';

const PLAYER_CLICK_SURFACE_CSS = `
    body.simple-yt-tweaks-active #movie_player,
    body.simple-yt-tweaks-active .html5-video-player,
    body.simple-yt-tweaks-active .html5-video-container,
    body.simple-yt-tweaks-active video.html5-main-video {
      pointer-events: auto !important;
    }
`;

export function buildFullscreenCss(settings: Settings): string {
  const fullscreenHideTitleOverlay = settings.fullscreenHideTitleOverlay;
  const fullscreenHideRecommendationOverlays = settings.fullscreenHideRecommendationOverlays;
  const fullscreenHideActionOverlay = settings.fullscreenHideActionOverlay;

  return `
    ${fullscreenHideTitleOverlay ? `
    body.simple-yt-tweaks-fullscreen-view .ytp-chrome-top,
    body.simple-yt-tweaks-fullscreen-view .ytp-title,
    body.simple-yt-tweaks-fullscreen-view .ytp-title-channel,
    body.simple-yt-tweaks-fullscreen-view .ytp-title-channel-logo,
    body.simple-yt-tweaks-fullscreen-view .ytp-title-text,
    body.simple-yt-tweaks-fullscreen-view .ytp-title-link,
    body.simple-yt-tweaks-fullscreen-view .ytp-title-expanded-overlay,
    body.simple-yt-tweaks-fullscreen-view .ytp-title-text > a,
    body.simple-yt-tweaks-fullscreen-view .ytp-gradient-top,
    body.simple-yt-tweaks-fullscreen-view .ytp-fullscreen-metadata,
    body.simple-yt-tweaks-fullscreen-view .ytp-fullscreen-metadata yt-player-overlay-video-details-renderer,
    body.simple-yt-tweaks-fullscreen-view .ytp-fullscreen-metadata .ytPlayerOverlayVideoDetailsRendererHost {
      opacity: 0 !important;
      pointer-events: none !important;
      visibility: hidden !important;
      transition: opacity 0.18s ease !important;
    }

    body.simple-yt-tweaks-fullscreen-view .ytp-chrome-top {
      transform: translateY(-8px) !important;
      transition:
        opacity 0.18s ease !important,
        transform 0.18s ease !important;
    }

    body.simple-yt-tweaks-fullscreen-view.simple-yt-tweaks-player-ui-hover .ytp-chrome-top,
    body.simple-yt-tweaks-fullscreen-view.simple-yt-tweaks-player-ui-focus .ytp-chrome-top {
      opacity: 1 !important;
      pointer-events: auto !important;
      visibility: visible !important;
      transform: translateY(0) !important;
    }

    body.simple-yt-tweaks-fullscreen-view.simple-yt-tweaks-player-ui-hover .ytp-title,
    body.simple-yt-tweaks-fullscreen-view.simple-yt-tweaks-player-ui-hover .ytp-title-channel,
    body.simple-yt-tweaks-fullscreen-view.simple-yt-tweaks-player-ui-hover .ytp-title-channel-logo,
    body.simple-yt-tweaks-fullscreen-view.simple-yt-tweaks-player-ui-hover .ytp-title-text,
    body.simple-yt-tweaks-fullscreen-view.simple-yt-tweaks-player-ui-hover .ytp-title-link,
    body.simple-yt-tweaks-fullscreen-view.simple-yt-tweaks-player-ui-hover .ytp-title-expanded-overlay,
    body.simple-yt-tweaks-fullscreen-view.simple-yt-tweaks-player-ui-hover .ytp-title-text > a,
    body.simple-yt-tweaks-fullscreen-view.simple-yt-tweaks-player-ui-hover .ytp-gradient-top,
    body.simple-yt-tweaks-fullscreen-view.simple-yt-tweaks-player-ui-hover .ytp-fullscreen-metadata,
    body.simple-yt-tweaks-fullscreen-view.simple-yt-tweaks-player-ui-hover .ytp-fullscreen-metadata yt-player-overlay-video-details-renderer,
    body.simple-yt-tweaks-fullscreen-view.simple-yt-tweaks-player-ui-hover .ytp-fullscreen-metadata .ytPlayerOverlayVideoDetailsRendererHost,
    body.simple-yt-tweaks-fullscreen-view.simple-yt-tweaks-player-ui-focus .ytp-title,
    body.simple-yt-tweaks-fullscreen-view.simple-yt-tweaks-player-ui-focus .ytp-title-channel,
    body.simple-yt-tweaks-fullscreen-view.simple-yt-tweaks-player-ui-focus .ytp-title-channel-logo,
    body.simple-yt-tweaks-fullscreen-view.simple-yt-tweaks-player-ui-focus .ytp-title-text,
    body.simple-yt-tweaks-fullscreen-view.simple-yt-tweaks-player-ui-focus .ytp-title-link,
    body.simple-yt-tweaks-fullscreen-view.simple-yt-tweaks-player-ui-focus .ytp-title-expanded-overlay,
    body.simple-yt-tweaks-fullscreen-view.simple-yt-tweaks-player-ui-focus .ytp-title-text > a,
    body.simple-yt-tweaks-fullscreen-view.simple-yt-tweaks-player-ui-focus .ytp-gradient-top,
    body.simple-yt-tweaks-fullscreen-view.simple-yt-tweaks-player-ui-focus .ytp-fullscreen-metadata,
    body.simple-yt-tweaks-fullscreen-view.simple-yt-tweaks-player-ui-focus .ytp-fullscreen-metadata yt-player-overlay-video-details-renderer,
    body.simple-yt-tweaks-fullscreen-view.simple-yt-tweaks-player-ui-focus .ytp-fullscreen-metadata .ytPlayerOverlayVideoDetailsRendererHost {
      opacity: 1 !important;
      pointer-events: auto !important;
      visibility: visible !important;
    }
    ` : ''}

    ${fullscreenHideRecommendationOverlays ? `
    body.simple-yt-tweaks-fullscreen-view .ytp-ce-element,
    body.simple-yt-tweaks-fullscreen-view .ytp-endscreen-content,
    body.simple-yt-tweaks-fullscreen-view .ytp-pause-overlay,
    body.simple-yt-tweaks-fullscreen-view .ytp-upnext,
    body.simple-yt-tweaks-fullscreen-view .ytp-scroll-min,
    body.simple-yt-tweaks-fullscreen-view .ytp-more-videos-container,
    body.simple-yt-tweaks-fullscreen-view .ytp-more-videos-view,
    body.simple-yt-tweaks-fullscreen-view .ytp-more-videos-title,
    body.simple-yt-tweaks-fullscreen-view .ytp-button[aria-label*="More videos"],
    body.simple-yt-tweaks-fullscreen-view .ytp-button[title*="More videos"],
    body.simple-yt-tweaks-fullscreen-view .ytp-cards-button,
    body.simple-yt-tweaks-fullscreen-view .ytp-cards-teaser,
    body.simple-yt-tweaks-fullscreen-view .ytp-cards-teaser-box,
    body.simple-yt-tweaks-fullscreen-view .ytp-fullscreen-grid,
    body.simple-yt-tweaks-fullscreen-view .ytp-fullscreen-grid-hover-overlay,
    body.simple-yt-tweaks-fullscreen-view .ytp-fullscreen-grid-buttons-container,
    body.simple-yt-tweaks-fullscreen-view .ytp-fullscreen-grid-expand-button,
    body.simple-yt-tweaks-fullscreen-view .ytp-fullscreen-grid-main-content,
    body.simple-yt-tweaks-fullscreen-view .ytp-fullscreen-grid-stills-container,
    body.simple-yt-tweaks-fullscreen-view .ytp-modern-videowall,
    body.simple-yt-tweaks-fullscreen-view .ytp-modern-videowall-still {
      display: none !important;
      opacity: 0 !important;
      pointer-events: none !important;
      visibility: hidden !important;
    }

    body.simple-yt-tweaks-fullscreen-view #movie_player,
    body.simple-yt-tweaks-fullscreen-view #movie_player.ytp-grid-scrollable,
    body.simple-yt-tweaks-fullscreen-view #movie_player.ytp-fullscreen-grid-peeking {
      --ytp-grid-peek-height: 0px !important;
      --ytp-grid-scroll-percentage: 0 !important;
      transform: none !important;
    }

    body.simple-yt-tweaks-fullscreen-view #movie_player.ytp-fullscreen-grid-peeking .ytp-chrome-bottom,
    body.simple-yt-tweaks-fullscreen-view #movie_player.ytp-fullscreen-grid-peeking .ytp-chrome-controls,
    body.simple-yt-tweaks-fullscreen-view #movie_player.ytp-fullscreen-grid-peeking .ytp-progress-bar-container,
    body.simple-yt-tweaks-fullscreen-view #movie_player.ytp-fullscreen-grid-peeking .ytp-left-controls,
    body.simple-yt-tweaks-fullscreen-view #movie_player.ytp-fullscreen-grid-peeking .ytp-right-controls {
      bottom: 0 !important;
      margin-bottom: 0 !important;
      padding-bottom: 0 !important;
      transform: none !important;
    }
    ` : ''}

    ${fullscreenHideActionOverlay ? `
    body.simple-yt-tweaks-fullscreen-view .ytp-fullscreen-quick-actions:not(.${FULLSCREEN_ACTION_TARGET_CLASS}),
    body.simple-yt-tweaks-fullscreen-view .ytp-overlay-bottom-right .ytp-player-content.ytp-timely-actions-content {
      opacity: 0 !important;
      pointer-events: none !important;
      visibility: hidden !important;
    }

    body.simple-yt-tweaks-fullscreen-view #${FULLSCREEN_ACTION_DOCK_ID} {
      display: inline-flex !important;
      align-items: center !important;
      justify-content: flex-end !important;
      align-self: center !important;
      height: auto !important;
      margin: 0 8px 0 0 !important;
      max-width: min(40vw, 320px) !important;
      gap: 6px !important;
      flex: 0 0 auto !important;
      overflow: visible !important;
      opacity: 1 !important;
      pointer-events: auto !important;
      visibility: visible !important;
    }

    body.simple-yt-tweaks-fullscreen-view #${FULLSCREEN_ACTION_DOCK_ID} .${FULLSCREEN_ACTION_TARGET_CLASS} {
      position: static !important;
      inset: auto !important;
      display: block !important;
      flex: 0 0 auto !important;
      width: auto !important;
      min-width: 0 !important;
      max-width: 100% !important;
      margin: 0 !important;
      padding: 0 !important;
      opacity: 1 !important;
      pointer-events: auto !important;
      visibility: visible !important;
      transform: none !important;
      overflow: visible !important;
    }

    @media (max-width: 1100px) {
      body.simple-yt-tweaks-fullscreen-view #${FULLSCREEN_ACTION_DOCK_ID} {
        margin-right: 4px !important;
        max-width: min(46vw, 260px) !important;
        gap: 4px !important;
      }
    }
    ` : ''}
  `;
}

export function buildSharedPlayerUiCss(settings: Settings): string {
  if (!settings.theaterHidePlayerUI && !settings.fullscreenHidePlayerUI) {
    return `
      ${PLAYER_CLICK_SURFACE_CSS}

      body.simple-yt-tweaks-active .ytp-chrome-top,
      body.simple-yt-tweaks-active .ytp-chrome-bottom,
      body.simple-yt-tweaks-active .ytp-gradient-top,
      body.simple-yt-tweaks-active .ytp-gradient-bottom,
      body.simple-yt-tweaks-active .ytp-ce-element,
      body.simple-yt-tweaks-active .${MASTHEAD_CLASS} {
        transition: opacity 0.18s ease !important;
      }
    `;
  }

  return `
    ${PLAYER_CLICK_SURFACE_CSS}

    body.simple-yt-tweaks-player-ui-hidden .ytp-chrome-top,
    body.simple-yt-tweaks-player-ui-hidden .ytp-chrome-bottom,
    body.simple-yt-tweaks-player-ui-hidden .ytp-gradient-top,
    body.simple-yt-tweaks-player-ui-hidden .ytp-gradient-bottom,
    body.simple-yt-tweaks-player-ui-hidden .ytp-ce-element {
      opacity: 0 !important;
      pointer-events: none !important;
      transition: opacity 0.18s ease !important;
    }

    body.simple-yt-tweaks-player-ui-hover .ytp-chrome-top,
    body.simple-yt-tweaks-player-ui-hover .ytp-chrome-bottom,
    body.simple-yt-tweaks-player-ui-hover .ytp-gradient-top,
    body.simple-yt-tweaks-player-ui-hover .ytp-gradient-bottom,
    body.simple-yt-tweaks-player-ui-hover .ytp-ce-element,
    body.simple-yt-tweaks-player-ui-hidden .ytp-chrome-top:focus-within,
    body.simple-yt-tweaks-player-ui-hidden .ytp-chrome-bottom:focus-within {
      opacity: 1 !important;
      pointer-events: auto !important;
    }

    body.simple-yt-tweaks-active .ytp-chrome-top,
    body.simple-yt-tweaks-active .ytp-chrome-bottom,
    body.simple-yt-tweaks-active .ytp-gradient-top,
    body.simple-yt-tweaks-active .ytp-gradient-bottom,
    body.simple-yt-tweaks-active .ytp-ce-element,
    body.simple-yt-tweaks-active .${MASTHEAD_CLASS} {
      transition: opacity 0.18s ease !important;
    }
  `;
}

export function getPlayerUiFocusHost(target: Element | null): HTMLElement | null {
  if (!target) return null;

  return target.closest<HTMLElement>(
    [
      '.ytp-chrome-top',
      SELECTORS.chromeBottom,
      SELECTORS.controlsRight,
      '.ytp-overlay-top-right',
      `#${FULLSCREEN_ACTION_DOCK_ID}`,
    ].join(','),
  );
}

export function updatePlayerUiFocusState(): void {
  const fullscreenActive = isNativeFullscreenActive();
  const theaterActive = isWatchPage() && document.body.classList.contains('simple-yt-tweaks-theater');
  const relevantMode =
    (theaterActive && state.settings.theaterHidePlayerUI) ||
    (fullscreenActive &&
      (state.settings.fullscreenHidePlayerUI ||
        state.settings.fullscreenHideTitleOverlay ||
        state.settings.fullscreenHideActionOverlay));

  if (!relevantMode) {
    document.body.classList.remove('simple-yt-tweaks-player-ui-focus');
    return;
  }

  const activeElement = document.activeElement instanceof Element ? document.activeElement : null;
  document.body.classList.toggle(
    'simple-yt-tweaks-player-ui-focus',
    Boolean(getPlayerUiFocusHost(activeElement)),
  );
}

function getPlayerControlZoneTop(playerRect: DOMRect, fullscreenActive: boolean): number {
  const chromeBottom = query<HTMLElement>(SELECTORS.chromeBottom);
  const chromeRect = chromeBottom?.getBoundingClientRect();

  if (
    chromeRect &&
    chromeRect.height > 0 &&
    chromeRect.bottom > playerRect.top &&
    chromeRect.top < playerRect.bottom
  ) {
    return Math.max(
      playerRect.top,
      Math.min(playerRect.bottom - 44, chromeRect.top - (fullscreenActive ? 18 : 14)),
    );
  }

  const fallbackZoneHeight = fullscreenActive ? 94 : 118;
  return playerRect.bottom - fallbackZoneHeight;
}

export function updatePlayerUiHoverState(pointerX: number, pointerY: number): void {
  const theaterActive = isWatchPage() && document.body.classList.contains('simple-yt-tweaks-theater') && state.settings.theaterHidePlayerUI;
  const fullscreenActive =
    isNativeFullscreenActive() &&
    (state.settings.fullscreenHidePlayerUI ||
      state.settings.fullscreenHideTitleOverlay ||
      state.settings.fullscreenHideActionOverlay);

  if (!theaterActive && !fullscreenActive) {
    document.body.classList.remove('simple-yt-tweaks-player-ui-hover');
    return;
  }

  const player = getPlayer();
  if (!player) {
    document.body.classList.remove('simple-yt-tweaks-player-ui-hover');
    return;
  }

  const rect = player.getBoundingClientRect();
  const isInsidePlayer =
    pointerX >= rect.left &&
    pointerX <= rect.right &&
    pointerY >= rect.top &&
    pointerY <= rect.bottom;
  const controlZoneTop = getPlayerControlZoneTop(rect, fullscreenActive);
  const isInControlZone = pointerY >= controlZoneTop;
  const shouldRevealPlayerUi = isInsidePlayer && isInControlZone;

  document.body.classList.toggle('simple-yt-tweaks-player-ui-hover', shouldRevealPlayerUi);

  if (fullscreenActive && state.settings.fullscreenHideActionOverlay) {
    updateFullscreenActionDock();
  }
}

export function resetFullscreenGridPeekState(): void {
  const player = getPlayer();
  if (!player) return;

  const controlsSelector = [
    SELECTORS.chromeBottom,
    SELECTORS.chromeControls,
    '.ytp-progress-bar-container',
    '.ytp-left-controls',
    '.ytp-right-controls',
  ].join(',');
  const gridShellSelector = [
    '.ytp-fullscreen-grid',
    '.ytp-fullscreen-grid-hover-overlay',
    '.ytp-fullscreen-grid-buttons-container',
    '.ytp-fullscreen-grid-expand-button',
    '.ytp-fullscreen-grid-main-content',
    '.ytp-fullscreen-grid-stills-container',
  ].join(',');

  const shouldClamp =
    isWatchPage() &&
    isNativeFullscreenActive() &&
    state.settings.fullscreenHideRecommendationOverlays;

  if (shouldClamp) {
    player.classList.remove('ytp-fullscreen-grid-peeking');
    player.classList.remove('ytp-grid-scrollable');
    player.style.setProperty('--ytp-grid-peek-height', '0px');
    player.style.setProperty('--ytp-grid-scroll-percentage', '0');

    for (const element of queryAll<HTMLElement>(gridShellSelector, player)) {
      element.style.display = 'none';
      element.style.opacity = '0';
      element.style.visibility = 'hidden';
      element.style.pointerEvents = 'none';
    }

    for (const element of queryAll<HTMLElement>(controlsSelector, player)) {
      element.style.bottom = '0';
      element.style.marginBottom = '0';
      element.style.paddingBottom = '0';
      element.style.transform = 'none';
    }

    return;
  }

  player.style.removeProperty('--ytp-grid-peek-height');
  player.style.removeProperty('--ytp-grid-scroll-percentage');

  for (const element of queryAll<HTMLElement>(gridShellSelector, player)) {
    element.style.removeProperty('display');
    element.style.removeProperty('opacity');
    element.style.removeProperty('visibility');
    element.style.removeProperty('pointer-events');
  }

  for (const element of queryAll<HTMLElement>(controlsSelector, player)) {
    element.style.removeProperty('bottom');
    element.style.removeProperty('margin-bottom');
    element.style.removeProperty('padding-bottom');
    element.style.removeProperty('transform');
  }
}

export function shouldSuppressFullscreenGridPeekInteraction(): boolean {
  return (
    isWatchPage() &&
    isNativeFullscreenActive() &&
    state.settings.fullscreenHideRecommendationOverlays
  );
}

function ensureFullscreenActionDockShell(): HTMLElement | null {
  const chromeControls = query<HTMLElement>(SELECTORS.chromeControls);
  const rightControls = query<HTMLElement>(SELECTORS.controlsRight);
  if (!chromeControls || !rightControls) return null;

  let shell = document.getElementById(FULLSCREEN_ACTION_DOCK_ID);
  if (!shell) {
    shell = document.createElement('div');
    shell.id = FULLSCREEN_ACTION_DOCK_ID;
  }

  if (rightControls.parentNode === chromeControls) {
    if (shell.parentNode !== chromeControls || shell.nextSibling !== rightControls) {
      chromeControls.insertBefore(shell, rightControls);
    }
  } else if (shell.parentNode !== chromeControls) {
    chromeControls.append(shell);
  }

  return shell;
}

function disconnectFullscreenActionObserver(): void {
  state.fullscreenActionObserver?.disconnect();
  state.fullscreenActionObserver = null;
  state.fullscreenActionObservedTarget = null;
}

function isDockedFullscreenActionTarget(target: HTMLElement): boolean {
  return (
    target.classList.contains(FULLSCREEN_ACTION_TARGET_CLASS) &&
    Boolean(target.closest(`#${FULLSCREEN_ACTION_DOCK_ID}`))
  );
}

function getFullscreenActionCandidate(element: HTMLElement): HTMLElement | null {
  if (element.id === FULLSCREEN_ACTION_DOCK_ID) return null;

  const quickActions = element.matches('.ytp-fullscreen-quick-actions')
    ? element
    : element.closest<HTMLElement>('.ytp-fullscreen-quick-actions');
  if (quickActions && !quickActions.closest(`#${FULLSCREEN_ACTION_DOCK_ID}`)) {
    return quickActions;
  }

  const target = element.matches('.ytp-suggested-action')
    ? element
    : element.closest<HTMLElement>('.ytp-suggested-action');

  if (!target || target.closest(`#${FULLSCREEN_ACTION_DOCK_ID}`)) {
    return null;
  }

  return target;
}

function isEligibleFullscreenActionTarget(target: HTMLElement): boolean {
  if (target.matches('.ytp-fullscreen-quick-actions')) {
    return Boolean(
      target.querySelector('yt-player-quick-action-buttons') &&
        target.querySelector(
          [
            '[aria-label*="like this video"]',
            '[aria-label*="dislike this video"]',
            '[aria-label^="Comments"]',
            '[aria-label*="comments"]',
          ].join(','),
        ),
    );
  }

  if (!isVisibleNode(target)) return false;
  if (target.querySelector('[class*="ytp-featured-product"]')) return false;

  return Boolean(
    target.querySelector('[class*="ytp-suggested-action-badge-with-controls"], .ytp-button.ytp-suggested-action-badge'),
  );
}

function findFullscreenActionTarget(): HTMLElement | null {
  const currentTarget = state.fullscreenActionDock?.target;
  if (
    currentTarget?.isConnected &&
    isDockedFullscreenActionTarget(currentTarget) &&
    isEligibleFullscreenActionTarget(currentTarget)
  ) {
    return currentTarget;
  }

  const candidates = [
    `${SELECTORS.overlayBottomRight} .ytp-fullscreen-quick-actions`,
    '.ytp-overlay-bottom-left .ytp-suggested-action',
    '.ytp-overlay-bottom-left [class*="ytp-suggested-action-badge-with-controls"]',
  ];

  let bestTarget: HTMLElement | null = null;
  let bestScore = -Infinity;

  for (const selector of candidates) {
    for (const element of queryAll<HTMLElement>(selector)) {
      const target = getFullscreenActionCandidate(element);
      if (!target) continue;
      if (!isEligibleFullscreenActionTarget(target)) continue;

      let score = 0;
      if (target.matches('.ytp-fullscreen-quick-actions')) score += 16;
      if (target.querySelector('yt-player-quick-action-buttons')) score += 10;
      if (target.querySelector('[aria-label*="like this video"]')) score += 8;
      if (target.querySelector('[aria-label*="comments"], [aria-label^="Comments"]')) score += 6;
      if (target.querySelector('[class*="ytp-suggested-action-badge-with-controls"]')) score += 3;
      if (target.querySelector('.ytp-button.ytp-suggested-action-badge')) score += 2;

      if (score > bestScore) {
        bestScore = score;
        bestTarget = target;
      }
    }
  }

  return bestTarget;
}

function dockFullscreenActions(): void {
  if (state.fullscreenActionDock) {
    const dock = state.fullscreenActionDock;
    if (dock.target.isConnected && dock.shell.isConnected && dock.shell.contains(dock.target)) {
      return;
    }

    restoreFullscreenActionDock();
  }

  const target = findFullscreenActionTarget();
  const shell = ensureFullscreenActionDockShell();
  if (!target || !target.parentNode || !shell) return;

  const originalParent = target.parentNode;
  const originalNextSibling = target.nextSibling;

  target.classList.add(FULLSCREEN_ACTION_TARGET_CLASS);
  shell.append(target);

  state.fullscreenActionDock = {
    target,
    originalParent,
    originalNextSibling,
    shell,
  };
}

export function restoreFullscreenActionDock(): void {
  const dock = state.fullscreenActionDock;
  const shell = document.getElementById(FULLSCREEN_ACTION_DOCK_ID);

  if (!dock) {
    shell?.remove();
    return;
  }

  dock.target.classList.remove(FULLSCREEN_ACTION_TARGET_CLASS);

  if (dock.originalParent.isConnected) {
    dock.originalParent.insertBefore(dock.target, dock.originalNextSibling);
  }

  dock.shell.remove();
  state.fullscreenActionDock = null;
}

function syncFullscreenActionObserver(): void {
  const shouldObserve =
    isNativeFullscreenActive() &&
    isWatchPage() &&
    state.settings.fullscreenHideActionOverlay;

  if (!shouldObserve) {
    disconnectFullscreenActionObserver();
    return;
  }

  const overlaysContainer = query<HTMLElement>(SELECTORS.overlaysContainer);
  if (!overlaysContainer) {
    disconnectFullscreenActionObserver();
    return;
  }

  if (state.fullscreenActionObservedTarget === overlaysContainer && state.fullscreenActionObserver) {
    return;
  }

  disconnectFullscreenActionObserver();

  const rerun = debounce(() => {
    if (
      state.fullscreenActionDock &&
      !isEligibleFullscreenActionTarget(state.fullscreenActionDock.target)
    ) {
      restoreFullscreenActionDock();
    }

    updateFullscreenActionDock();
  }, 80);

  state.fullscreenActionObserver = new MutationObserver(() => rerun());
  state.fullscreenActionObserver.observe(overlaysContainer, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class', 'style', 'hidden', 'aria-hidden'],
  });
  state.fullscreenActionObservedTarget = overlaysContainer;
}

export function updateFullscreenActionDock(): void {
  const shouldDock =
    isNativeFullscreenActive() &&
    isWatchPage() &&
    state.settings.fullscreenHideActionOverlay;

  if (
    shouldDock &&
    state.fullscreenActionDock &&
    (!state.fullscreenActionDock.target.isConnected || !state.fullscreenActionDock.shell.isConnected)
  ) {
    restoreFullscreenActionDock();
  }

  if (shouldDock) {
    syncFullscreenActionObserver();
    dockFullscreenActions();
    return;
  }

  disconnectFullscreenActionObserver();
  restoreFullscreenActionDock();
}

export function resetFullscreenNavigationState(): void {
  disconnectFullscreenActionObserver();
  restoreFullscreenActionDock();
}
