import { isDefaultWatchView, isEnhancedTheaterActive, isNativeFullscreenActive, isTheaterMinimalLayoutActive, queryAll } from './dom';
import { LIVE_CHAT_CLASS, MASTHEAD_CLASS, SELECTORS, THEATER_PRIMARY_METADATA_CLASS } from './selectors';
import type { Settings } from './settings';
import { state } from './state';

export function buildTheaterCss(settings: Settings): string {
  const enhancedTheater = settings.enhancedTheaterMode;
  const theaterHideHeader = settings.theaterHideHeader;
  const theaterShowHeaderOnHover = settings.theaterShowHeaderOnHover;
  const theaterHideRecommendations = settings.theaterHideRecommendations;
  const theaterHideComments = settings.theaterHideComments;
  const theaterHideMetadata = settings.theaterHideMetadata;
  const theaterShowPrimaryMetadata = settings.theaterShowPrimaryMetadata;
  const theaterHideLiveChat = settings.theaterHideLiveChat;
  const theaterShowLiveChatOverlay = settings.theaterShowLiveChatOverlay;

  return `
    ${enhancedTheater ? `
    html.simple-yt-tweaks-scrollbar-hidden,
    body.simple-yt-tweaks-scrollbar-hidden,
    html.simple-yt-tweaks-theater-scrollbar-hidden,
    body.simple-yt-tweaks-theater-scrollbar-hidden {
      scrollbar-width: none !important;
    }

    html.simple-yt-tweaks-scrollbar-hidden::-webkit-scrollbar,
    body.simple-yt-tweaks-scrollbar-hidden::-webkit-scrollbar,
    html.simple-yt-tweaks-theater-scrollbar-hidden::-webkit-scrollbar,
    body.simple-yt-tweaks-theater-scrollbar-hidden::-webkit-scrollbar {
      width: 0 !important;
      height: 0 !important;
      background: transparent !important;
    }

    body.simple-yt-tweaks-theater {
      overflow-x: hidden !important;
    }

    body.simple-yt-tweaks-theater.simple-yt-tweaks-theater-minimal,
    body.simple-yt-tweaks-theater.simple-yt-tweaks-theater-minimal ytd-app {
      overflow-y: hidden !important;
      max-height: var(--simple-yt-tweaks-vh, 100vh) !important;
    }

    body.simple-yt-tweaks-theater #page-manager,
    body.simple-yt-tweaks-theater ytd-watch-flexy,
    body.simple-yt-tweaks-theater #columns,
    body.simple-yt-tweaks-theater #primary {
      max-width: 100% !important;
      width: 100% !important;
      min-width: 0 !important;
    }

    body.simple-yt-tweaks-theater #page-manager,
    body.simple-yt-tweaks-theater #content,
    body.simple-yt-tweaks-theater ytd-watch-flexy {
      margin-left: 0 !important;
      padding-left: 0 !important;
    }

    body.simple-yt-tweaks-theater ytd-app,
    body.simple-yt-tweaks-theater #content,
    body.simple-yt-tweaks-theater #page-manager,
    body.simple-yt-tweaks-theater #primary,
    body.simple-yt-tweaks-theater #primary-inner {
      padding-top: 0 !important;
      margin-top: 0 !important;
    }

    body.simple-yt-tweaks-theater #player-container-outer,
    body.simple-yt-tweaks-theater #full-bleed-container,
    body.simple-yt-tweaks-theater #player-full-bleed-container {
      top: 0 !important;
      margin-top: 0 !important;
      max-width: 100% !important;
      width: 100% !important;
      min-width: 0 !important;
      height: min(var(--simple-yt-tweaks-vh, 100vh), 56.25vw) !important;
      max-height: var(--simple-yt-tweaks-vh, 100vh) !important;
      min-height: 0 !important;
      overflow: hidden !important;
    }

    body.simple-yt-tweaks-theater #full-bleed-container,
    body.simple-yt-tweaks-theater #player-full-bleed-container,
    body.simple-yt-tweaks-theater #player,
    body.simple-yt-tweaks-theater #movie_player {
      height: min(var(--simple-yt-tweaks-vh, 100vh), 56.25vw) !important;
      max-height: var(--simple-yt-tweaks-vh, 100vh) !important;
    }

    body.simple-yt-tweaks-theater #player,
    body.simple-yt-tweaks-theater #player-container,
    body.simple-yt-tweaks-theater #player-container-inner,
    body.simple-yt-tweaks-theater #movie_player,
    body.simple-yt-tweaks-theater .html5-video-player {
      width: min(100vw, 177.777778vh) !important;
      max-width: 100vw !important;
      margin-right: auto !important;
      margin-left: auto !important;
    }

    body.simple-yt-tweaks-theater .html5-video-container {
      width: 100% !important;
      height: 100% !important;
      left: 0 !important;
      top: 0 !important;
    }

    body.simple-yt-tweaks-theater video.html5-main-video {
      width: 100% !important;
      height: 100% !important;
      left: 0 !important;
      top: 0 !important;
      object-fit: contain !important;
    }

    @media (display-mode: standalone), (display-mode: minimal-ui) {
      body.simple-yt-tweaks-theater #player-container-outer,
      body.simple-yt-tweaks-theater #full-bleed-container,
      body.simple-yt-tweaks-theater #player-full-bleed-container,
      body.simple-yt-tweaks-theater #player,
      body.simple-yt-tweaks-theater #movie_player {
        height: var(--simple-yt-tweaks-vh, 100vh) !important;
        max-height: var(--simple-yt-tweaks-vh, 100vh) !important;
      }
    }
    ` : ''}

    ${enhancedTheater && theaterHideRecommendations ? `
    ${
      theaterHideLiveChat
        ? 'body.simple-yt-tweaks-theater #secondary,'
        : 'body.simple-yt-tweaks-theater:not(.simple-yt-tweaks-has-live-chat) #secondary,'
    }
    body.simple-yt-tweaks-theater #related,
    body.simple-yt-tweaks-theater ytd-watch-next-secondary-results-renderer {
      display: none !important;
    }

    body.simple-yt-tweaks-theater #columns,
    body.simple-yt-tweaks-theater #primary,
    body.simple-yt-tweaks-theater #primary-inner,
    body.simple-yt-tweaks-theater #below,
    body.simple-yt-tweaks-theater #meta,
    body.simple-yt-tweaks-theater #comments {
      max-width: 100% !important;
      width: 100% !important;
    }
    ` : ''}

    ${enhancedTheater && theaterHideComments ? `
    body.simple-yt-tweaks-theater #comments {
      display: none !important;
    }
    ` : ''}

    ${enhancedTheater && theaterHideMetadata && !theaterShowPrimaryMetadata ? `
    body.simple-yt-tweaks-theater ytd-watch-metadata,
    body.simple-yt-tweaks-theater #info-contents ytd-video-primary-info-renderer,
    body.simple-yt-tweaks-theater #meta-contents ytd-video-secondary-info-renderer {
      display: none !important;
    }
    ` : ''}

    ${enhancedTheater && theaterHideMetadata && theaterShowPrimaryMetadata ? `
    body.simple-yt-tweaks-theater.${THEATER_PRIMARY_METADATA_CLASS},
    body.simple-yt-tweaks-theater.${THEATER_PRIMARY_METADATA_CLASS} ytd-app,
    body.simple-yt-tweaks-theater.${THEATER_PRIMARY_METADATA_CLASS} ytd-watch-flexy,
    body.simple-yt-tweaks-theater.${THEATER_PRIMARY_METADATA_CLASS} #columns,
    body.simple-yt-tweaks-theater.${THEATER_PRIMARY_METADATA_CLASS} #primary,
    body.simple-yt-tweaks-theater.${THEATER_PRIMARY_METADATA_CLASS} #primary-inner,
    body.simple-yt-tweaks-theater.${THEATER_PRIMARY_METADATA_CLASS} #below {
      overflow: visible !important;
      max-height: none !important;
      height: auto !important;
    }

    body.simple-yt-tweaks-theater.${THEATER_PRIMARY_METADATA_CLASS} #below,
    body.simple-yt-tweaks-theater.${THEATER_PRIMARY_METADATA_CLASS} ytd-watch-metadata {
      display: block !important;
      max-height: none !important;
      overflow: visible !important;
    }

    body.simple-yt-tweaks-theater.${THEATER_PRIMARY_METADATA_CLASS} #below {
      padding-top: 8px !important;
      min-height: fit-content !important;
    }

    body.simple-yt-tweaks-theater ytd-watch-metadata #bottom-row,
    body.simple-yt-tweaks-theater ytd-watch-metadata #description,
    body.simple-yt-tweaks-theater ytd-watch-metadata #description-inline-expander,
    body.simple-yt-tweaks-theater ytd-watch-metadata ytd-text-inline-expander,
    body.simple-yt-tweaks-theater #info-contents ytd-video-primary-info-renderer #info,
    body.simple-yt-tweaks-theater #meta-contents ytd-video-secondary-info-renderer #description,
    body.simple-yt-tweaks-theater #meta-contents ytd-video-secondary-info-renderer #metadata,
    body.simple-yt-tweaks-theater #meta-contents ytd-video-secondary-info-renderer ytd-expander {
      display: none !important;
    }

    body.simple-yt-tweaks-theater ytd-watch-metadata #title,
    body.simple-yt-tweaks-theater #info-contents ytd-video-primary-info-renderer #title {
      display: block !important;
    }

    body.simple-yt-tweaks-theater ytd-watch-metadata #top-row,
    body.simple-yt-tweaks-theater #meta-contents ytd-video-secondary-info-renderer #owner {
      display: flex !important;
    }
    ` : ''}

    ${enhancedTheater && theaterHideLiveChat && !theaterShowLiveChatOverlay ? `
    body.simple-yt-tweaks-theater.simple-yt-tweaks-has-live-chat ${SELECTORS.liveChat} {
      display: none !important;
    }
    ` : ''}

    ${enhancedTheater && theaterHideLiveChat && theaterShowLiveChatOverlay ? `
    body.simple-yt-tweaks-theater.simple-yt-tweaks-has-live-chat #secondary {
      display: contents !important;
      width: 0 !important;
      min-width: 0 !important;
      max-width: 0 !important;
      margin: 0 !important;
      padding: 0 !important;
    }

    body.simple-yt-tweaks-theater.simple-yt-tweaks-has-live-chat #chat-container,
    body.simple-yt-tweaks-theater.simple-yt-tweaks-has-live-chat #chat {
      display: block !important;
      visibility: visible !important;
      overflow: visible !important;
      width: 0 !important;
      height: 0 !important;
      max-width: 0 !important;
      max-height: 0 !important;
      margin: 0 !important;
      padding: 0 !important;
    }

    body.simple-yt-tweaks-theater.simple-yt-tweaks-has-live-chat .${LIVE_CHAT_CLASS} {
      position: fixed !important;
      top: 84px !important;
      right: 16px !important;
      z-index: 2147483643 !important;
      display: block !important;
      width: min(380px, calc(100vw - 32px)) !important;
      height: min(70vh, calc(100vh - 120px)) !important;
      max-height: calc(100vh - 120px) !important;
      border: 1px solid rgba(255, 255, 255, 0.16) !important;
      border-radius: 8px !important;
      overflow: hidden !important;
      background: rgba(15, 15, 15, 0.92) !important;
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.42) !important;
    }
    ` : ''}

    ${isTheaterMinimalLayoutActive(settings) ? `
    body.simple-yt-tweaks-theater.simple-yt-tweaks-theater-minimal #below,
    body.simple-yt-tweaks-theater.simple-yt-tweaks-theater-minimal #secondary,
    body.simple-yt-tweaks-theater.simple-yt-tweaks-theater-minimal #related,
    body.simple-yt-tweaks-theater.simple-yt-tweaks-theater-minimal #comments,
    body.simple-yt-tweaks-theater.simple-yt-tweaks-theater-minimal ytd-watch-metadata {
      display: none !important;
      margin: 0 !important;
      padding: 0 !important;
      min-height: 0 !important;
      max-height: 0 !important;
      overflow: hidden !important;
    }
    ` : ''}

    ${enhancedTheater && theaterHideHeader ? `
    body.simple-yt-tweaks-theater .${MASTHEAD_CLASS} {
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      right: 0 !important;
      z-index: 2147483644 !important;
      opacity: 0 !important;
      pointer-events: none !important;
      transform: translateY(-105%) !important;
      transition:
        opacity 0.16s ease,
        transform 0.16s ease !important;
    }

    ${theaterShowHeaderOnHover ? `
    body.simple-yt-tweaks-theater.simple-yt-tweaks-top-hover .${MASTHEAD_CLASS},
    body.simple-yt-tweaks-theater .${MASTHEAD_CLASS}:focus-within {
      opacity: 1 !important;
      pointer-events: auto !important;
      transform: translateY(0) !important;
    }
    ` : ''}
    ` : ''}
  `;
}

export function updateViewClasses(): boolean {
  const theaterEnabled = isEnhancedTheaterActive(state.settings);
  const fullscreenEnabled = isNativeFullscreenActive();
  const wasTheaterEnabled = state.lastEnhancedTheaterActive;
  const wasFullscreenEnabled = document.body.classList.contains('simple-yt-tweaks-fullscreen-view');

  document.body.classList.toggle('simple-yt-tweaks-theater', theaterEnabled);
  document.body.classList.toggle('simple-yt-tweaks-default-view', isDefaultWatchView());
  document.body.classList.toggle('simple-yt-tweaks-fullscreen-view', fullscreenEnabled);
  document.body.classList.toggle('simple-yt-tweaks-theater-minimal', isTheaterMinimalLayoutActive(state.settings));
  document.body.classList.toggle(
    THEATER_PRIMARY_METADATA_CLASS,
    theaterEnabled && state.settings.theaterHideMetadata && state.settings.theaterShowPrimaryMetadata,
  );
  document.documentElement.classList.toggle(
    'simple-yt-tweaks-theater-scrollbar-hidden',
    theaterEnabled && state.settings.theaterHideScrollbarOnScroll,
  );
  document.body.classList.toggle(
    'simple-yt-tweaks-theater-scrollbar-hidden',
    theaterEnabled && state.settings.theaterHideScrollbarOnScroll,
  );

  if (!theaterEnabled) {
    document.body.classList.remove('simple-yt-tweaks-top-hover');
    document.body.classList.remove('simple-yt-tweaks-has-live-chat');
    document.body.classList.remove('simple-yt-tweaks-theater-minimal');
    document.documentElement.classList.remove('simple-yt-tweaks-scrollbar-hidden');
    document.documentElement.classList.remove('simple-yt-tweaks-theater-scrollbar-hidden');
    document.body.classList.remove('simple-yt-tweaks-scrollbar-hidden');
    document.body.classList.remove('simple-yt-tweaks-theater-scrollbar-hidden');
    restoreTheaterOnlyTargets();
  }

  const shouldHidePlayerUi =
    (theaterEnabled && state.settings.theaterHidePlayerUI) ||
    (fullscreenEnabled && state.settings.fullscreenHidePlayerUI);
  const shouldManageFullscreenOverlayReveal =
    fullscreenEnabled &&
    (state.settings.fullscreenHideTitleOverlay || state.settings.fullscreenHideActionOverlay);

  document.body.classList.toggle('simple-yt-tweaks-player-ui-hidden', shouldHidePlayerUi);

  if (!shouldHidePlayerUi && !shouldManageFullscreenOverlayReveal) {
    document.body.classList.remove('simple-yt-tweaks-player-ui-hover');
    document.body.classList.remove('simple-yt-tweaks-player-ui-focus');
  }

  const modeChanged = wasTheaterEnabled !== theaterEnabled || wasFullscreenEnabled !== fullscreenEnabled;
  if (modeChanged) {
    state.lastEnhancedTheaterActive = theaterEnabled;
  }

  return modeChanged;
}

export function restoreTheaterOnlyTargets(): void {
  for (const target of queryAll<HTMLElement>(`.${MASTHEAD_CLASS}`)) {
    target.classList.remove(MASTHEAD_CLASS);
  }

  for (const target of queryAll<HTMLElement>(`.${LIVE_CHAT_CLASS}`)) {
    target.classList.remove(LIVE_CHAT_CLASS);
  }
}

export function updateMastheadTargets(): void {
  const shouldMark = isEnhancedTheaterActive(state.settings) && state.settings.theaterHideHeader;

  for (const target of queryAll<HTMLElement>(SELECTORS.mastheadTargets)) {
    target.classList.toggle(MASTHEAD_CLASS, shouldMark);
  }

  if (!shouldMark) {
    document.body.classList.remove('simple-yt-tweaks-top-hover');
  }
}

export function updateLiveChatTargets(): void {
  const shouldUseLiveChat =
    isEnhancedTheaterActive(state.settings) &&
    state.settings.theaterHideLiveChat;
  const liveChatFrames = queryAll<HTMLElement>('ytd-live-chat-frame');
  const hasLiveChat = shouldUseLiveChat && liveChatFrames.length > 0;

  for (const frame of liveChatFrames) {
    frame.classList.toggle(LIVE_CHAT_CLASS, hasLiveChat);
  }

  document.body.classList.toggle('simple-yt-tweaks-has-live-chat', hasLiveChat);

  if (!hasLiveChat) {
    for (const frame of queryAll<HTMLElement>(`.${LIVE_CHAT_CLASS}`)) {
      frame.classList.remove(LIVE_CHAT_CLASS);
    }
  }
}

export function updateScrollbarState(): void {
  const enhancedTheaterActive = isEnhancedTheaterActive(state.settings);
  const shouldHideScrollbar =
    enhancedTheaterActive &&
    (state.settings.theaterHideScrollbarOnScroll || window.scrollY <= 8);

  document.documentElement.classList.toggle('simple-yt-tweaks-scrollbar-hidden', shouldHideScrollbar);
  document.body.classList.toggle('simple-yt-tweaks-scrollbar-hidden', shouldHideScrollbar);
  document.documentElement.classList.toggle(
    'simple-yt-tweaks-theater-scrollbar-hidden',
    enhancedTheaterActive && state.settings.theaterHideScrollbarOnScroll,
  );
  document.body.classList.toggle(
    'simple-yt-tweaks-theater-scrollbar-hidden',
    enhancedTheaterActive && state.settings.theaterHideScrollbarOnScroll,
  );
}

export function updateTopHoverState(pointerY: number): void {
  const shouldRevealHeader =
    isEnhancedTheaterActive(state.settings) &&
    state.settings.theaterHideHeader &&
    state.settings.theaterShowHeaderOnHover &&
    pointerY <= 72;

  document.body.classList.toggle('simple-yt-tweaks-top-hover', shouldRevealHeader);
}

function isSidebarExpanded(): boolean {
  const sidebarCandidates = queryAll<HTMLElement>('#guide, #guide-content, ytd-guide-renderer');

  return sidebarCandidates.some((element) => {
    const rect = element.getBoundingClientRect();
    const style = window.getComputedStyle(element);

    return (
      rect.width >= 180 &&
      rect.height > 0 &&
      style.display !== 'none' &&
      style.visibility !== 'hidden'
    );
  });
}

export function clearStaleGuideFocus(): void {
  const shouldManageGuideFocus =
    isEnhancedTheaterActive(state.settings) &&
    state.settings.theaterHideHeader &&
    state.settings.theaterShowHeaderOnHover;

  if (!shouldManageGuideFocus) return;
  if (document.body.classList.contains('simple-yt-tweaks-top-hover')) return;
  if (state.lastPointerY <= 72) return;
  if (isSidebarExpanded()) return;

  const activeElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  if (!activeElement) return;

  const isGuideButton = Boolean(
    activeElement.closest(
      '#guide-button, ytd-masthead #guide-button, button[aria-label*="Guide"], button[aria-label*="menu"]',
    ),
  );

  if (!isGuideButton) return;

  activeElement.blur();
  document.body.classList.remove('simple-yt-tweaks-top-hover');
}
