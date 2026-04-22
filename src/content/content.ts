type SettingKey =
  | 'enhancedTheaterMode'
  | 'theaterHideHeader'
  | 'theaterShowHeaderOnHover'
  | 'theaterHidePlayerUI'
  | 'theaterHideScrollbarOnScroll'
  | 'theaterHideRecommendations'
  | 'theaterHideComments'
  | 'theaterHideLiveChat'
  | 'theaterShowLiveChatOverlay'
  | 'defaultHideRecommendations'
  | 'defaultHideComments'
  | 'defaultHideLiveChat'
  | 'pipButton'
  | 'floatingMiniPlayer';

type Settings = Record<SettingKey, boolean>;

type DockState = {
  target: HTMLElement;
  originalParent: Node;
  originalNextSibling: ChildNode | null;
  placeholder: HTMLElement;
  shell: HTMLElement;
};

const DEFAULT_SETTINGS: Settings = {
  enhancedTheaterMode: true,
  theaterHideHeader: true,
  theaterShowHeaderOnHover: true,
  theaterHidePlayerUI: true,
  theaterHideScrollbarOnScroll: true,
  theaterHideRecommendations: true,
  theaterHideComments: false,
  theaterHideLiveChat: false,
  theaterShowLiveChatOverlay: false,
  defaultHideRecommendations: false,
  defaultHideComments: false,
  defaultHideLiveChat: false,
  pipButton: true,
  floatingMiniPlayer: true,
};

const SETTING_KEYS = Object.keys(DEFAULT_SETTINGS) as SettingKey[];

const SELECTORS = {
  masthead: '#masthead-container, ytd-masthead',
  mastheadTargets: '#masthead-container, ytd-masthead, ytd-masthead #container',
  guide: '#guide, ytd-guide-renderer, #guide-content',
  watchFlexy: 'ytd-watch-flexy',
  player: '#movie_player',
  html5Video: 'video.html5-main-video',
  controlsRight: '.ytp-right-controls',
  comments: '#comments',
  liveChat: '#chat, #chat-container, ytd-live-chat-frame',
  dockTarget: '#player-container-inner, #player-container, #player',
};

const STYLE_ID = 'simple-yt-tweaks-style';
const PIP_BUTTON_ID = 'simple-yt-tweaks-pip-button';
const DOCK_ID = 'simple-yt-tweaks-dock';
const MASTHEAD_CLASS = 'simple-yt-tweaks-masthead';
const LIVE_CHAT_CLASS = 'simple-yt-tweaks-live-chat';

const state: {
  settings: Settings;
  currentUrl: string;
  observer: MutationObserver | null;
  dock: DockState | null;
  miniPlayerDismissed: boolean;
  storageObserverBound: boolean;
  pointerHandlersBound: boolean;
  lastEnhancedTheaterActive: boolean;
  modeTransitionTimers: number[];
} = {
  settings: { ...DEFAULT_SETTINGS },
  currentUrl: location.href,
  observer: null,
  dock: null,
  miniPlayerDismissed: false,
  storageObserverBound: false,
  pointerHandlersBound: false,
  lastEnhancedTheaterActive: false,
  modeTransitionTimers: [],
};

function loadSettings(): Promise<Settings> {
  return new Promise((resolve) => {
    chrome.storage.sync.get(DEFAULT_SETTINGS, (items) => {
      if (chrome.runtime.lastError) {
        console.warn('Simple YT Tweaks settings load failed:', chrome.runtime.lastError);
        resolve({ ...DEFAULT_SETTINGS });
        return;
      }

      const settings = SETTING_KEYS.reduce<Settings>(
        (normalized, key) => {
          normalized[key] = typeof items[key] === 'boolean' ? items[key] : DEFAULT_SETTINGS[key];
          return normalized;
        },
        { ...DEFAULT_SETTINGS },
      );

      resolve(settings);
    });
  });
}

function isFeatureEnabled(key: SettingKey): boolean {
  if (key === 'floatingMiniPlayer') {
    return state.settings.pipButton && state.settings.floatingMiniPlayer;
  }

  return state.settings[key];
}

function debounce<TArgs extends unknown[]>(fn: (...args: TArgs) => void, wait = 120): (...args: TArgs) => void {
  let timer: number | undefined;

  return (...args: TArgs) => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => fn(...args), wait);
  };
}

function query<T extends Element = Element>(selector: string, root: ParentNode = document): T | null {
  try {
    return root.querySelector<T>(selector);
  } catch {
    return null;
  }
}

function queryAll<T extends Element = Element>(selector: string, root: ParentNode = document): T[] {
  try {
    return [...root.querySelectorAll<T>(selector)];
  } catch {
    return [];
  }
}

function getVideo(): HTMLVideoElement | null {
  return query<HTMLVideoElement>(SELECTORS.html5Video);
}

function getPlayer(): HTMLElement | null {
  return query<HTMLElement>(SELECTORS.player);
}

function isWatchPage(): boolean {
  return location.pathname === '/watch';
}

function isTheaterMode(): boolean {
  const watchFlexy = query<HTMLElement>(SELECTORS.watchFlexy);

  return Boolean(
    watchFlexy?.hasAttribute('theater') ||
      watchFlexy?.classList.contains('theater') ||
      document.querySelector('ytd-watch-flexy[theater]'),
  );
}

function isEnhancedTheaterActive(): boolean {
  return state.settings.enhancedTheaterMode && isWatchPage() && isTheaterMode();
}

function isDefaultWatchView(): boolean {
  return isWatchPage() && !isTheaterMode();
}

function buildCss(): string {
  const enhancedTheater = state.settings.enhancedTheaterMode;
  const theaterHideHeader = state.settings.theaterHideHeader;
  const theaterShowHeaderOnHover = state.settings.theaterShowHeaderOnHover;
  const theaterHidePlayerUI = state.settings.theaterHidePlayerUI;
  const theaterHideRecommendations = state.settings.theaterHideRecommendations;
  const theaterHideComments = state.settings.theaterHideComments;
  const theaterHideLiveChat = state.settings.theaterHideLiveChat;
  const theaterShowLiveChatOverlay = state.settings.theaterShowLiveChatOverlay;
  const defaultHideRecommendations = state.settings.defaultHideRecommendations;
  const defaultHideComments = state.settings.defaultHideComments;
  const defaultHideLiveChat = state.settings.defaultHideLiveChat;

  return `
    body.simple-yt-tweaks-active .simple-yt-tweaks-pip-btn.ytp-button {
      display: inline-flex !important;
      align-items: center;
      justify-content: center;
    }

    body.simple-yt-tweaks-active .simple-yt-tweaks-pip-btn svg {
      width: 24px;
      height: 24px;
      fill: currentColor;
    }

    #${DOCK_ID} {
      position: fixed;
      right: 16px;
      bottom: 16px;
      width: min(420px, calc(100vw - 32px));
      aspect-ratio: 16 / 9;
      z-index: 2147483645;
      display: none;
      overflow: hidden;
      border-radius: 8px;
      background: #000;
      box-shadow: 0 14px 38px rgba(0, 0, 0, 0.42);
    }

    #${DOCK_ID}.is-visible {
      display: block;
    }

    #${DOCK_ID} .simple-yt-tweaks-dock-actions {
      position: absolute;
      top: 8px;
      right: 8px;
      z-index: 3;
      display: flex;
      gap: 8px;
      opacity: 0;
      transition: opacity 0.16s ease;
    }

    #${DOCK_ID}:hover .simple-yt-tweaks-dock-actions,
    #${DOCK_ID}:focus-within .simple-yt-tweaks-dock-actions {
      opacity: 1;
    }

    #${DOCK_ID} .simple-yt-tweaks-dock-btn {
      width: 32px;
      height: 32px;
      border: 0;
      border-radius: 999px;
      background: rgba(20, 20, 20, 0.86);
      color: #fff;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.35);
    }

    #${DOCK_ID} .simple-yt-tweaks-dock-body,
    #${DOCK_ID} .simple-yt-tweaks-docked-target {
      width: 100% !important;
      height: 100% !important;
    }

    #${DOCK_ID} .simple-yt-tweaks-docked-target #movie_player,
    #${DOCK_ID} .simple-yt-tweaks-docked-target .html5-video-container,
    #${DOCK_ID} .simple-yt-tweaks-docked-target video.html5-main-video {
      width: 100% !important;
      height: 100% !important;
    }

    .simple-yt-tweaks-player-placeholder {
      width: 100%;
      min-height: 220px;
      background: transparent;
    }

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

    body.simple-yt-tweaks-theater ytd-mini-guide-renderer,
    body.simple-yt-tweaks-theater #guide-spacer,
    body.simple-yt-tweaks-theater tp-yt-app-drawer {
      display: none !important;
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
      height: min(100vh, 56.25vw) !important;
      max-height: 100vh !important;
      min-height: 0 !important;
      overflow: hidden !important;
    }

    body.simple-yt-tweaks-theater #full-bleed-container,
    body.simple-yt-tweaks-theater #player-full-bleed-container,
    body.simple-yt-tweaks-theater #player,
    body.simple-yt-tweaks-theater #movie_player {
      height: min(100vh, 56.25vw) !important;
      max-height: 100vh !important;
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

    body.simple-yt-tweaks-theater ${SELECTORS.guide} {
      display: none !important;
    }
    ` : ''}

    ${theaterHidePlayerUI ? `
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
    ` : ''}

    ${defaultHideRecommendations ? `
    body.simple-yt-tweaks-default-view #related,
    body.simple-yt-tweaks-default-view ytd-watch-next-secondary-results-renderer {
      display: none !important;
    }
    ` : ''}

    ${defaultHideComments ? `
    body.simple-yt-tweaks-default-view #comments {
      display: none !important;
    }
    ` : ''}

    ${defaultHideLiveChat ? `
    body.simple-yt-tweaks-default-view ${SELECTORS.liveChat} {
      display: none !important;
    }
    ` : ''}

    body.simple-yt-tweaks-hide-native-miniplayer ytd-miniplayer,
    body.simple-yt-tweaks-hide-native-miniplayer .ytp-miniplayer-ui,
    body.simple-yt-tweaks-hide-native-miniplayer .ytp-player-minimized {
      display: none !important;
      opacity: 0 !important;
      pointer-events: none !important;
      visibility: hidden !important;
    }

    body.simple-yt-tweaks-hide-native-miniplayer #${DOCK_ID} .ytp-player-minimized {
      display: block !important;
      opacity: 1 !important;
      pointer-events: auto !important;
      visibility: visible !important;
    }
  `;
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

function updateTheaterClass(): void {
  const enabled = isEnhancedTheaterActive();
  const wasEnabled = state.lastEnhancedTheaterActive;

  document.body.classList.toggle('simple-yt-tweaks-theater', enabled);
  document.documentElement.classList.toggle('simple-yt-tweaks-theater-scrollbar-hidden', enabled && state.settings.theaterHideScrollbarOnScroll);
  document.body.classList.toggle('simple-yt-tweaks-theater-scrollbar-hidden', enabled && state.settings.theaterHideScrollbarOnScroll);
  document.body.classList.toggle('simple-yt-tweaks-default-view', isDefaultWatchView());

  if (enabled) {
    restoreDockedPlayer();
  } else {
    document.body.classList.remove('simple-yt-tweaks-top-hover');
    document.body.classList.remove('simple-yt-tweaks-player-ui-hover');
    document.body.classList.remove('simple-yt-tweaks-player-ui-hidden');
    document.body.classList.remove('simple-yt-tweaks-has-live-chat');
    document.documentElement.classList.remove('simple-yt-tweaks-scrollbar-hidden');
    document.documentElement.classList.remove('simple-yt-tweaks-theater-scrollbar-hidden');
    document.body.classList.remove('simple-yt-tweaks-scrollbar-hidden');
    document.body.classList.remove('simple-yt-tweaks-theater-scrollbar-hidden');
    restoreTheaterOnlyTargets();
  }

  if (wasEnabled !== enabled) {
    state.lastEnhancedTheaterActive = enabled;
    scheduleModeStabilization();
  }
}

function scheduleModeStabilization(): void {
  for (const timer of state.modeTransitionTimers) {
    window.clearTimeout(timer);
  }

  state.modeTransitionTimers = [80, 220, 520].map((delay) =>
    window.setTimeout(() => {
      updateTheaterClass();
      updateMastheadTargets();
      updateLiveChatTargets();
      updateScrollbarState();
      updateDockedPlayer();
      window.dispatchEvent(new Event('resize'));
    }, delay),
  );
}

function restoreTheaterOnlyTargets(): void {
  for (const target of queryAll<HTMLElement>(`.${MASTHEAD_CLASS}`)) {
    target.classList.remove(MASTHEAD_CLASS);
  }

  for (const target of queryAll<HTMLElement>(`.${LIVE_CHAT_CLASS}`)) {
    target.classList.remove(LIVE_CHAT_CLASS);
  }
}

function updateMastheadTargets(): void {
  const shouldMark =
    isEnhancedTheaterActive() &&
    state.settings.theaterHideHeader;

  for (const target of queryAll<HTMLElement>(SELECTORS.mastheadTargets)) {
    target.classList.toggle(MASTHEAD_CLASS, shouldMark);
  }

  if (!shouldMark) {
    document.body.classList.remove('simple-yt-tweaks-top-hover');
  }
}

function updateLiveChatTargets(): void {
  const shouldUseLiveChat =
    isEnhancedTheaterActive() &&
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

function updateScrollbarState(): void {
  const enhancedTheaterActive = isEnhancedTheaterActive();
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

function bindPointerHandlers(): void {
  if (state.pointerHandlersBound) return;
  state.pointerHandlersBound = true;

  document.addEventListener(
    'mousemove',
    (event) => {
      updateTopHoverState(event.clientY);
      updatePlayerUiHoverState(event.clientX, event.clientY);
    },
    { passive: true },
  );
  document.addEventListener(
    'mouseleave',
    () => {
      document.body.classList.remove('simple-yt-tweaks-top-hover');
      document.body.classList.remove('simple-yt-tweaks-player-ui-hover');
    },
    { passive: true },
  );
}

function updateTopHoverState(pointerY: number): void {
  const shouldRevealHeader =
    isEnhancedTheaterActive() &&
    state.settings.theaterHideHeader &&
    state.settings.theaterShowHeaderOnHover &&
    pointerY <= 72;

  document.body.classList.toggle('simple-yt-tweaks-top-hover', shouldRevealHeader);
}

function updatePlayerUiHoverState(pointerX: number, pointerY: number): void {
  if (!isEnhancedTheaterActive() || !state.settings.theaterHidePlayerUI) {
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
    pointerX >= rect.left && pointerX <= rect.right && pointerY >= rect.top && pointerY <= rect.bottom;
  const isInControlZone = pointerY >= rect.bottom - 118;

  document.body.classList.toggle(
    'simple-yt-tweaks-player-ui-hover',
    isInsidePlayer && isInControlZone,
  );
}

function createPipButton(): void {
  if (!isFeatureEnabled('pipButton') || !isWatchPage()) return;

  const rightControls = query<HTMLElement>(SELECTORS.controlsRight);
  const video = getVideo();
  if (!rightControls || !video || document.getElementById(PIP_BUTTON_ID)) return;

  const button = document.createElement('button');
  button.id = PIP_BUTTON_ID;
  button.className = 'ytp-button simple-yt-tweaks-pip-btn';
  button.type = 'button';
  button.setAttribute('aria-label', 'Picture in Picture');
  button.setAttribute('title', 'Picture in Picture');
  button.innerHTML = `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M19 7H5v10h14V7zm0-2c1.1 0 2 .9 2 2v10c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V7c0-1.1.9-2 2-2h14zm-1 8h-6v4h6v-4z"></path>
    </svg>
  `;

  button.addEventListener('click', async (event) => {
    event.preventDefault();
    event.stopPropagation();

    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
        return;
      }

      if (document.pictureInPictureEnabled && !video.disablePictureInPicture) {
        await video.requestPictureInPicture();
      }
    } catch (error) {
      console.warn('Simple YT Tweaks PiP failed:', error);
    }
  });

  rightControls.prepend(button);
}

function removePipButton(): void {
  document.getElementById(PIP_BUTTON_ID)?.remove();
}

function ensureDockShell(): HTMLElement {
  let shell = document.getElementById(DOCK_ID);
  if (shell) return shell;

  shell = document.createElement('section');
  shell.id = DOCK_ID;
  shell.setAttribute('aria-label', 'Floating video player');
  shell.innerHTML = `
    <div class="simple-yt-tweaks-dock-actions">
      <button class="simple-yt-tweaks-dock-btn" type="button" data-action="restore" aria-label="Restore player" title="Restore player">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M5 5h8v2H8.41l5.3 5.29-1.42 1.42L7 8.41V13H5V5zm14 14h-8v-2h4.59l-5.3-5.29 1.42-1.42L17 15.59V11h2v8z"></path></svg>
      </button>
      <button class="simple-yt-tweaks-dock-btn" type="button" data-action="close" aria-label="Close floating player" title="Close floating player">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M18.3 5.71 12 12l6.3 6.29-1.41 1.41L10.59 13.4 4.29 19.7 2.88 18.29 9.17 12 2.88 5.71 4.29 4.3l6.3 6.29 6.29-6.3z"></path></svg>
      </button>
    </div>
    <div class="simple-yt-tweaks-dock-body"></div>
  `;

  shell.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const button = target.closest<HTMLButtonElement>('[data-action]');
    if (!button) return;

    const action = button.dataset.action;
    if (action === 'close') {
      state.miniPlayerDismissed = true;
    }

    restoreDockedPlayer();
  });

  document.body.append(shell);
  return shell;
}

function getDockBody(shell: HTMLElement): HTMLElement | null {
  return query<HTMLElement>('.simple-yt-tweaks-dock-body', shell);
}

function findDockTarget(): HTMLElement | null {
  const currentDockTarget = state.dock?.target;
  if (currentDockTarget?.isConnected) return currentDockTarget;

  const target = query<HTMLElement>(SELECTORS.dockTarget);
  if (!target || target.closest(`#${DOCK_ID}`)) return null;

  return target;
}

function getOriginalPlayerRect(): DOMRect | null {
  if (state.dock?.placeholder.isConnected) {
    return state.dock.placeholder.getBoundingClientRect();
  }

  return findDockTarget()?.getBoundingClientRect() ?? null;
}

function shouldShowDockedPlayer(): boolean {
  if (
    !isFeatureEnabled('floatingMiniPlayer') ||
    !isWatchPage() ||
    state.miniPlayerDismissed ||
    isTheaterMode()
  ) {
    return false;
  }

  const comments = query<HTMLElement>(SELECTORS.comments);
  const playerRect = getOriginalPlayerRect();
  if (!comments || !playerRect) return false;

  const commentsRect = comments.getBoundingClientRect();
  const playerMostlyOffscreen = playerRect.bottom < 120;
  const commentsEnteredViewport = commentsRect.top < window.innerHeight;

  return playerMostlyOffscreen && commentsEnteredViewport;
}

function dockPlayer(): void {
  if (state.dock) {
    state.dock.shell.classList.add('is-visible');
    return;
  }

  const target = findDockTarget();
  if (!target || !target.parentNode) return;

  const shell = ensureDockShell();
  const dockBody = getDockBody(shell);
  if (!dockBody) return;

  const rect = target.getBoundingClientRect();
  const placeholder = document.createElement('div');
  placeholder.className = 'simple-yt-tweaks-player-placeholder';
  placeholder.style.height = `${Math.max(Math.round(rect.height), 220)}px`;

  const originalParent = target.parentNode;
  const originalNextSibling = target.nextSibling;

  originalParent.insertBefore(placeholder, target);
  target.classList.add('simple-yt-tweaks-docked-target');
  dockBody.append(target);
  shell.classList.add('is-visible');

  state.dock = {
    target,
    originalParent,
    originalNextSibling,
    placeholder,
    shell,
  };
}

function restoreDockedPlayer(): void {
  const dock = state.dock;
  if (!dock) {
    document.getElementById(DOCK_ID)?.classList.remove('is-visible');
    return;
  }

  dock.shell.classList.remove('is-visible');
  dock.target.classList.remove('simple-yt-tweaks-docked-target');

  if (dock.placeholder.isConnected && dock.placeholder.parentNode) {
    dock.placeholder.parentNode.insertBefore(dock.target, dock.placeholder);
  } else if (dock.originalParent.isConnected) {
    dock.originalParent.insertBefore(dock.target, dock.originalNextSibling);
  }

  dock.placeholder.remove();
  state.dock = null;
}

function updateDockedPlayer(): void {
  if (shouldShowDockedPlayer()) {
    dockPlayer();
    return;
  }

  restoreDockedPlayer();
}

function resetNavigationState(): void {
  if (location.href === state.currentUrl) return;

  state.currentUrl = location.href;
  state.miniPlayerDismissed = false;
  restoreDockedPlayer();
}

function applyFeatureState(): void {
  if (!document.body) return;

  ensureStyle();
  resetNavigationState();
  updateTheaterClass();
  updateMastheadTargets();
  updateLiveChatTargets();
  updateScrollbarState();

  if (isFeatureEnabled('pipButton')) {
    createPipButton();
  } else {
    removePipButton();
  }

  if (state.settings.theaterHidePlayerUI || state.settings.theaterShowHeaderOnHover) {
    bindPointerHandlers();
  }

  document.body.classList.toggle(
    'simple-yt-tweaks-player-ui-hidden',
    isEnhancedTheaterActive() && state.settings.theaterHidePlayerUI,
  );
  document.body.classList.toggle(
    'simple-yt-tweaks-hide-native-miniplayer',
    isDefaultWatchView() && isFeatureEnabled('floatingMiniPlayer'),
  );

  if (!state.settings.theaterHidePlayerUI) {
    document.body.classList.remove('simple-yt-tweaks-player-ui-hover');
  }

  if (!state.settings.theaterShowHeaderOnHover) {
    document.body.classList.remove('simple-yt-tweaks-top-hover');
  }

  updateDockedPlayer();
}

function bindStorageObserver(): void {
  if (state.storageObserverBound) return;
  state.storageObserverBound = true;

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== 'sync') return;

    let touched = false;
    for (const key of SETTING_KEYS) {
      const change = changes[key as SettingKey];
      if (change && typeof change.newValue === 'boolean') {
        state.settings[key] = change.newValue;
        touched = true;
      }
    }

    if (touched) {
      applyFeatureState();
    }
  });
}

function observeDom(): void {
  state.observer?.disconnect();

  const debouncedApply = debounce(() => applyFeatureState(), 150);
  state.observer = new MutationObserver(() => debouncedApply());
  state.observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class', 'theater', 'hidden'],
  });
}

function observeNavigation(): void {
  const rerun = debounce(() => applyFeatureState(), 120);
  const updateScrollUi = debounce(() => {
    updateDockedPlayer();
    updateScrollbarState();
  }, 40);

  window.addEventListener('yt-navigate-finish', rerun, { passive: true });
  window.addEventListener('yt-page-data-updated', rerun, { passive: true });
  window.addEventListener('popstate', rerun, { passive: true });
  window.addEventListener('scroll', updateScrollUi, { passive: true });
  window.addEventListener(
    'resize',
    debounce(() => {
      updateTheaterClass();
      updateMastheadTargets();
      updateLiveChatTargets();
      updateScrollbarState();
      updateDockedPlayer();
    }, 80),
    { passive: true },
  );
}

function bindRuntimeMessages(): void {
  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message?.type !== 'SIMPLE_YT_TWEAKS_PING') return false;

    sendResponse({ ok: true });
    return false;
  });
}

function bindVideoEvents(): void {
  const attach = () => {
    const video = getVideo();
    if (!video || video.dataset.simpleYtTweaksBound === '1') return;

    video.dataset.simpleYtTweaksBound = '1';
    video.addEventListener('enterpictureinpicture', () => updateDockedPlayer(), { passive: true });
    video.addEventListener('leavepictureinpicture', () => updateDockedPlayer(), { passive: true });
  };

  attach();
  window.setInterval(attach, 2000);
}

async function init(): Promise<void> {
  state.settings = await loadSettings();

  if (!document.body) {
    window.addEventListener('DOMContentLoaded', () => void init(), { once: true });
    return;
  }

  ensureStyle();
  bindStorageObserver();
  observeDom();
  observeNavigation();
  bindRuntimeMessages();
  bindVideoEvents();
  applyFeatureState();
}

init().catch((error) => {
  console.error('Simple YT Tweaks failed to initialize:', error);
});
