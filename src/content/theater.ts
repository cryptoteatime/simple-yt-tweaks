import { isDefaultWatchView, isEnhancedTheaterActive, isNativeFullscreenActive, isTheaterMinimalLayoutActive, queryAll } from './dom';
import { LIVE_CHAT_CLASS, MASTHEAD_CLASS, SELECTORS, THEATER_PRIMARY_METADATA_CLASS } from './selectors';
import type { Settings } from './settings';
import { state } from './state';

const LIVE_CHAT_RESTORE_BUTTON_ID = 'simple-yt-tweaks-live-chat-restore';
const LIVE_CHAT_IFRAME_CLOSE_BUTTON_ID = 'simple-yt-tweaks-live-chat-frame-close';
const LIVE_CHAT_IFRAME_STYLE_ID = 'simple-yt-tweaks-live-chat-frame-style';
const LIVE_CHAT_FRAME_SRC_ATTR = 'data-simple-yt-tweaks-chat-src';
const LEGACY_LIVE_CHAT_CLOSE_BUTTON_ID = 'simple-yt-tweaks-live-chat-close';
const liveChatCloseBoundTargets = new WeakSet<EventTarget>();

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

    body.simple-yt-tweaks-theater #movie_player .ytp-chrome-bottom {
      left: 0 !important;
      right: 0 !important;
      width: 100% !important;
      max-width: 100% !important;
    }

    body.simple-yt-tweaks-theater #movie_player .ytp-chrome-controls {
      left: 12px !important;
      right: 12px !important;
      width: auto !important;
      max-width: calc(100% - 24px) !important;
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

    ${enhancedTheater && !theaterHideComments ? `
    body.simple-yt-tweaks-theater #below,
    body.simple-yt-tweaks-theater #comments {
      max-height: none !important;
      overflow: visible !important;
      visibility: visible !important;
    }

    body.simple-yt-tweaks-theater #comments {
      display: block !important;
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
    body.simple-yt-tweaks-theater.simple-yt-tweaks-has-live-chat #player-full-bleed-container {
      flex: 0 0 100% !important;
      width: 100% !important;
      min-width: 100% !important;
      max-width: 100% !important;
    }

    body.simple-yt-tweaks-theater.simple-yt-tweaks-has-live-chat #panels-full-bleed-container {
      flex: 0 0 0 !important;
      width: 0 !important;
      min-width: 0 !important;
      max-width: 0 !important;
      overflow: hidden !important;
    }

    body.simple-yt-tweaks-theater.simple-yt-tweaks-has-live-chat #secondary {
      width: 0 !important;
      min-width: 0 !important;
      max-width: 0 !important;
      margin: 0 !important;
      padding: 0 !important;
      overflow: hidden !important;
    }

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

    body.simple-yt-tweaks-theater.simple-yt-tweaks-has-live-chat #player-full-bleed-container {
      flex: 0 0 100% !important;
      width: 100% !important;
      min-width: 100% !important;
      max-width: 100% !important;
    }

    body.simple-yt-tweaks-theater.simple-yt-tweaks-has-live-chat #panels-full-bleed-container {
      flex: 0 0 0 !important;
      width: 0 !important;
      min-width: 0 !important;
      max-width: 0 !important;
      overflow: visible !important;
    }

    body.simple-yt-tweaks-theater.simple-yt-tweaks-has-live-chat #chat-container,
    body.simple-yt-tweaks-theater.simple-yt-tweaks-has-live-chat #chat:not(.${LIVE_CHAT_CLASS}) {
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
      --simple-yt-tweaks-live-chat-width: min(380px, calc(100vw - 32px));
      position: fixed !important;
      top: 84px !important;
      right: 16px !important;
      z-index: 2147483643 !important;
      display: block !important;
      width: var(--simple-yt-tweaks-live-chat-width) !important;
      height: min(70vh, calc(100vh - 120px)) !important;
      max-height: calc(100vh - 120px) !important;
      border: 1px solid rgba(255, 255, 255, 0.16) !important;
      border-radius: 8px !important;
      overflow: hidden !important;
      background: rgba(15, 15, 15, 0.92) !important;
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.42) !important;
      transition: opacity 0.18s ease, transform 0.22s cubic-bezier(0.2, 0.8, 0.2, 1) !important;
    }

    body.simple-yt-tweaks-theater.simple-yt-tweaks-has-live-chat #chat.${LIVE_CHAT_CLASS},
    body.simple-yt-tweaks-theater.simple-yt-tweaks-has-live-chat ytd-live-chat-frame.${LIVE_CHAT_CLASS} {
      width: var(--simple-yt-tweaks-live-chat-width) !important;
      height: min(70vh, calc(100vh - 120px)) !important;
      max-width: calc(100vw - 32px) !important;
      max-height: calc(100vh - 120px) !important;
    }

    body.simple-yt-tweaks-theater.simple-yt-tweaks-has-live-chat .${LIVE_CHAT_CLASS} iframe#chatframe {
      display: block !important;
      width: 100% !important;
      height: 100% !important;
      max-width: 100% !important;
      max-height: 100% !important;
    }

    body.simple-yt-tweaks-theater.simple-yt-tweaks-has-live-chat.simple-yt-tweaks-live-chat-minimized .${LIVE_CHAT_CLASS} {
      opacity: 0 !important;
      pointer-events: none !important;
      transform: translateX(calc(100% + 24px)) !important;
    }

    body.simple-yt-tweaks-theater #${LIVE_CHAT_RESTORE_BUTTON_ID} {
      appearance: none !important;
      border: 1px solid rgba(255, 255, 255, 0.18) !important;
      color: #fff !important;
      background: rgba(15, 15, 15, 0.78) !important;
      box-shadow: 0 10px 26px rgba(0, 0, 0, 0.34) !important;
      font: 500 12px/1.2 Roboto, Arial, sans-serif !important;
      cursor: pointer !important;
      z-index: 2147483645 !important;
      -webkit-user-select: none !important;
      user-select: none !important;
    }

    body.simple-yt-tweaks-theater #${LIVE_CHAT_RESTORE_BUTTON_ID} {
      position: fixed !important;
      top: 50% !important;
      right: 0 !important;
      display: none !important;
      align-items: center !important;
      justify-content: center !important;
      width: 44px !important;
      min-height: 92px !important;
      padding: 10px 8px !important;
      border-radius: 10px 0 0 10px !important;
      writing-mode: vertical-rl !important;
      text-orientation: mixed !important;
      letter-spacing: 0 !important;
      opacity: 0.58 !important;
      transform: translate(14px, -50%) !important;
      transition: opacity 0.14s ease, transform 0.14s ease, background 0.14s ease !important;
    }

    body.simple-yt-tweaks-theater.simple-yt-tweaks-has-live-chat.simple-yt-tweaks-live-chat-minimized #${LIVE_CHAT_RESTORE_BUTTON_ID} {
      display: inline-flex !important;
    }

    body.simple-yt-tweaks-theater #${LIVE_CHAT_RESTORE_BUTTON_ID}:hover,
    body.simple-yt-tweaks-theater #${LIVE_CHAT_RESTORE_BUTTON_ID}:focus-visible {
      opacity: 1 !important;
      transform: translate(0, -50%) !important;
      background: rgba(15, 15, 15, 0.94) !important;
    }

    ` : ''}

    ${isTheaterMinimalLayoutActive(settings) ? `
    body.simple-yt-tweaks-theater.simple-yt-tweaks-theater-minimal #secondary,
    body.simple-yt-tweaks-theater.simple-yt-tweaks-theater-minimal #related,
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
    document.body.classList.remove('simple-yt-tweaks-live-chat-minimized');
    document.body.classList.remove('simple-yt-tweaks-live-chat-native-close-missing');
    state.liveChatOverlayMinimized = false;
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

  document.getElementById(LEGACY_LIVE_CHAT_CLOSE_BUTTON_ID)?.remove();
  document.getElementById(LIVE_CHAT_RESTORE_BUTTON_ID)?.remove();
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
  let hasNativeLiveChatClose = false;

  for (const frame of liveChatFrames) {
    frame.classList.toggle(LIVE_CHAT_CLASS, hasLiveChat);
    bindLiveChatNativeClose(frame);
    syncLiveChatIframeCloseButton(frame, hasLiveChat && state.settings.theaterShowLiveChatOverlay);
    hasNativeLiveChatClose ||= hasLiveChat && frameHasNativeLiveChatClose(frame);
    const iframeSrc = frame.querySelector<HTMLIFrameElement>('iframe#chatframe')?.getAttribute('src');
    if (iframeSrc && shouldStoreLiveChatFrameSrc(frame, iframeSrc)) {
      frame.setAttribute(LIVE_CHAT_FRAME_SRC_ATTR, iframeSrc);
    }
  }

  if (hasLiveChat && state.settings.theaterShowLiveChatOverlay) {
    if (liveChatFrames.some((frame) => frame.hasAttribute('collapsed') || frame.hasAttribute('hide-chat-frame'))) {
      state.liveChatOverlayMinimized = true;
    }
  } else {
    state.liveChatOverlayMinimized = false;
  }

  document.body.classList.toggle('simple-yt-tweaks-has-live-chat', hasLiveChat);
  document.body.classList.toggle(
    'simple-yt-tweaks-live-chat-minimized',
    hasLiveChat && state.settings.theaterShowLiveChatOverlay && state.liveChatOverlayMinimized,
  );
  document.body.classList.toggle(
    'simple-yt-tweaks-live-chat-native-close-missing',
    hasLiveChat && state.settings.theaterShowLiveChatOverlay && !state.liveChatOverlayMinimized && !hasNativeLiveChatClose,
  );
  syncLiveChatOverlayControls(hasLiveChat && state.settings.theaterShowLiveChatOverlay);

  if (hasLiveChat && state.settings.theaterShowLiveChatOverlay && !state.liveChatOverlayMinimized) {
    restoreLiveChatOverlayFrames();
  }

  if (!hasLiveChat) {
    for (const frame of queryAll<HTMLElement>(`.${LIVE_CHAT_CLASS}`)) {
      removeLiveChatIframeCloseButton(frame);
      frame.classList.remove(LIVE_CHAT_CLASS);
    }
  }
}

function frameHasNativeLiveChatClose(frame: HTMLElement): boolean {
  const iframe = frame.querySelector<HTMLIFrameElement>('iframe#chatframe');
  if (!iframe) return false;

  try {
    const iframeDocument = iframe.contentDocument;
    return Boolean(
      iframeDocument &&
        Array.from(iframeDocument.querySelectorAll('button, [role="button"]')).some((element) =>
          /\bclose\b/i.test(
            [
              element.getAttribute('aria-label'),
              element.getAttribute('title'),
              element.textContent,
            ].join(' '),
          ),
        ),
    );
  } catch {
    return false;
  }
}

function getLiveChatIframeDocument(frame: HTMLElement): Document | null {
  const iframe = frame.querySelector<HTMLIFrameElement>('iframe#chatframe');
  if (!iframe) return null;

  try {
    return iframe.contentDocument;
  } catch {
    return null;
  }
}

function syncLiveChatIframeCloseButton(frame: HTMLElement, shouldShowControls: boolean): void {
  const iframeDocument = getLiveChatIframeDocument(frame);
  if (!iframeDocument) return;

  const hasNativeClose = frameHasNativeLiveChatClose(frame);
  if (!shouldShowControls || hasNativeClose || state.liveChatOverlayMinimized) {
    iframeDocument.getElementById(LIVE_CHAT_IFRAME_CLOSE_BUTTON_ID)?.remove();
    return;
  }

  ensureLiveChatIframeStyle(iframeDocument);

  let closeButton = iframeDocument.getElementById(LIVE_CHAT_IFRAME_CLOSE_BUTTON_ID) as HTMLButtonElement | null;
  if (!closeButton) {
    closeButton = iframeDocument.createElement('button');
    closeButton.id = LIVE_CHAT_IFRAME_CLOSE_BUTTON_ID;
    closeButton.type = 'button';
    closeButton.textContent = '×';
    closeButton.setAttribute('aria-label', 'Minimize live chat');
    closeButton.title = 'Minimize live chat';
    closeButton.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      setLiveChatOverlayMinimized(true);
    });
  }

  const moreOptionsButton = Array.from(iframeDocument.querySelectorAll<HTMLElement>('button, [role="button"]')).find((element) =>
    /\bmore\b/i.test(
      [
        element.getAttribute('aria-label'),
        element.getAttribute('title'),
        element.textContent,
      ].join(' '),
    ),
  );
  const insertionTarget =
    moreOptionsButton?.closest('yt-live-chat-button#live-chat-header-context-menu') ??
    moreOptionsButton?.closest('yt-live-chat-button') ??
    moreOptionsButton?.closest('button-view-model') ??
    moreOptionsButton?.closest('yt-button-renderer') ??
    moreOptionsButton ??
    iframeDocument.querySelector('yt-live-chat-header-renderer');

  if (insertionTarget?.parentElement) {
    insertionTarget.parentElement.insertBefore(closeButton, insertionTarget.nextSibling);
  }
}

function ensureLiveChatIframeStyle(iframeDocument: Document): void {
  if (iframeDocument.getElementById(LIVE_CHAT_IFRAME_STYLE_ID)) return;

  const style = iframeDocument.createElement('style');
  style.id = LIVE_CHAT_IFRAME_STYLE_ID;
  style.textContent = `
    #${LIVE_CHAT_IFRAME_CLOSE_BUTTON_ID} {
      appearance: none !important;
      width: 40px !important;
      height: 40px !important;
      min-width: 40px !important;
      border: 0 !important;
      border-radius: 999px !important;
      padding: 0 !important;
      margin: 4px 0 0 0 !important;
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      background: transparent !important;
      color: var(--yt-spec-text-primary, #fff) !important;
      font: 400 28px/1 Roboto, Arial, sans-serif !important;
      cursor: pointer !important;
    }

    #${LIVE_CHAT_IFRAME_CLOSE_BUTTON_ID}:hover,
    #${LIVE_CHAT_IFRAME_CLOSE_BUTTON_ID}:focus-visible {
      background: rgba(255, 255, 255, 0.12) !important;
      outline: none !important;
    }
  `;
  iframeDocument.documentElement.append(style);
}

function removeLiveChatIframeCloseButton(frame: HTMLElement): void {
  const iframeDocument = getLiveChatIframeDocument(frame);
  iframeDocument?.getElementById(LIVE_CHAT_IFRAME_CLOSE_BUTTON_ID)?.remove();
}

function shouldStoreLiveChatFrameSrc(frame: HTMLElement, nextSrc: string): boolean {
  const previousSrc = frame.getAttribute(LIVE_CHAT_FRAME_SRC_ATTR);
  if (!previousSrc) return true;

  const previousParams = previousSrc.includes('?') ? previousSrc.split('?')[1] : '';
  const nextParams = nextSrc.includes('?') ? nextSrc.split('?')[1] : '';

  return nextParams.length > previousParams.length;
}

function bindLiveChatNativeClose(frame: HTMLElement): void {
  bindLiveChatNativeCloseTarget(frame);

  const iframe = frame.querySelector<HTMLIFrameElement>('iframe#chatframe');
  if (!iframe) return;

  bindLiveChatNativeCloseTarget(iframe);
  iframe.addEventListener('load', () => bindLiveChatNativeClose(frame), { once: true });

  try {
    if (iframe.contentWindow) {
      bindLiveChatNativeCloseTarget(iframe.contentWindow);
    }
    const iframeDocument = iframe.contentDocument;
    if (iframeDocument) {
      bindLiveChatNativeCloseTarget(iframeDocument);
    }
  } catch {
    // Some live chat embeds may be inaccessible. In that case the restore path still handles YouTube's collapsed state.
  }
}

function bindLiveChatNativeCloseTarget(target: EventTarget): void {
  if (liveChatCloseBoundTargets.has(target)) return;
  liveChatCloseBoundTargets.add(target);

  target.addEventListener(
    'click',
    (event) => {
      if (!isNativeLiveChatCloseClick(event)) return;

      event.preventDefault();
      event.stopImmediatePropagation();
      setLiveChatOverlayMinimized(true);
    },
    { capture: true },
  );
}

function isNativeLiveChatCloseClick(event: Event): boolean {
  return event.composedPath().some((target) => {
    if (!(target instanceof Element)) return false;

    const closeTarget = target.closest(
      [
        '#close-button',
        'button[aria-label*="Close" i]',
        'button[title*="Close" i]',
        '[role="button"][aria-label*="Close" i]',
        '[role="button"][title*="Close" i]',
      ].join(','),
    );
    if (!closeTarget) return false;

    const text = [
      closeTarget.getAttribute('aria-label'),
      closeTarget.getAttribute('title'),
      closeTarget.textContent,
    ].join(' ');

    return /\b(?:close|hide)\b/i.test(text) || closeTarget.id === 'close-button';
  });
}

function setLiveChatOverlayMinimized(minimized: boolean): void {
  state.liveChatOverlayMinimized = minimized;
  document.body.classList.toggle('simple-yt-tweaks-live-chat-minimized', minimized);

  if (!minimized) {
    restoreLiveChatOverlayFrames();
  }
}

function restoreLiveChatOverlayFrames(): void {
  for (const frame of queryAll<HTMLElement>(`ytd-live-chat-frame.${LIVE_CHAT_CLASS}`)) {
    const iframe = frame.querySelector<HTMLIFrameElement>('iframe#chatframe');
    const showHideButton = frame.querySelector<HTMLElement>('#show-hide-button');
    const showChatButton = frame.querySelector<HTMLButtonElement>('#show-hide-button button[aria-label*="Show chat" i]');

    if (showChatButton && showHideButton && !showHideButton.hasAttribute('hidden')) {
      showChatButton.click();
    }

    frame.removeAttribute('collapsed');
    frame.removeAttribute('hide-chat-frame');

    if (!iframe) continue;

    const previousSrc = frame.getAttribute(LIVE_CHAT_FRAME_SRC_ATTR);
    if (!iframe.getAttribute('src') && previousSrc) {
      iframe.setAttribute('src', previousSrc);
      continue;
    }

    const videoId =
      document.querySelector<HTMLElement>(SELECTORS.watchFlexy)?.getAttribute('video-id') ??
      new URLSearchParams(location.search).get('v') ??
      '';
    if (!iframe.getAttribute('src') && videoId) {
      iframe.setAttribute('src', `/live_chat?v=${encodeURIComponent(videoId)}`);
    }
  }
}

function syncLiveChatOverlayControls(shouldShowControls: boolean): void {
  document.getElementById(LEGACY_LIVE_CHAT_CLOSE_BUTTON_ID)?.remove();

  if (!shouldShowControls) {
    document.getElementById(LIVE_CHAT_RESTORE_BUTTON_ID)?.remove();
    return;
  }

  let restoreButton = document.getElementById(LIVE_CHAT_RESTORE_BUTTON_ID) as HTMLButtonElement | null;
  if (!restoreButton) {
    restoreButton = document.createElement('button');
    restoreButton.id = LIVE_CHAT_RESTORE_BUTTON_ID;
    restoreButton.type = 'button';
    restoreButton.textContent = 'Live chat';
    restoreButton.setAttribute('aria-label', 'Show live chat');
    restoreButton.title = 'Show live chat';
    restoreButton.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      setLiveChatOverlayMinimized(false);
    });
    document.body.append(restoreButton);
  }
}

function isStandaloneLikeDisplayMode(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.matchMedia('(display-mode: minimal-ui)').matches
  );
}

function isLiveWatchPlayerActive(): boolean {
  const player = document.querySelector<HTMLElement>(SELECTORS.player);
  const watchFlexy = document.querySelector<HTMLElement>(SELECTORS.watchFlexy);

  return Boolean(
    player?.classList.contains('ytp-livebadge-color') ||
      watchFlexy?.hasAttribute('live-chat-present-and-expanded') ||
      watchFlexy?.hasAttribute('should-stamp-chat'),
  );
}

export function resetLiveTheaterScrollOffset(): void {
  if (!isStandaloneLikeDisplayMode()) return;
  if (!isEnhancedTheaterActive(state.settings)) return;
  if (!state.settings.theaterHideLiveChat || !state.settings.theaterShowLiveChatOverlay) return;
  if (!document.querySelector(`ytd-live-chat-frame.${LIVE_CHAT_CLASS}`)) return;
  if (!isLiveWatchPlayerActive()) return;
  if (window.scrollY <= 0) return;

  const player = document.querySelector<HTMLElement>(SELECTORS.player);
  const playerRect = player?.getBoundingClientRect();
  if (!playerRect || playerRect.top >= -8) return;

  window.scrollTo(0, 0);
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
