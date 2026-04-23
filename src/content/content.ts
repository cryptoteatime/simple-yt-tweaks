type FeedColumnCount = 2 | 3 | 4;

type BooleanSettingKey =
  | 'generalHideSponsoredPosts'
  | 'generalHideEndScreenCards'
  | 'generalHideShorts'
  | 'generalSidebarCleanup'
  | 'generalHideSidebar'
  | 'generalHideSidebarHome'
  | 'generalHideSidebarShorts'
  | 'generalHideSidebarSubscriptions'
  | 'generalHideSidebarYou'
  | 'generalHideSidebarExplore'
  | 'generalHideSidebarMoreFromYouTube'
  | 'generalHideSidebarReportHistory'
  | 'generalHideSidebarFooter'
  | 'enhancedTheaterMode'
  | 'theaterHideHeader'
  | 'theaterShowHeaderOnHover'
  | 'theaterHidePlayerUI'
  | 'theaterHideScrollbarOnScroll'
  | 'theaterHideRecommendations'
  | 'theaterHideComments'
  | 'theaterHideMetadata'
  | 'theaterShowPrimaryMetadata'
  | 'theaterHideLiveChat'
  | 'theaterShowLiveChatOverlay'
  | 'defaultHideRecommendations'
  | 'defaultHideComments'
  | 'defaultHideMetadata'
  | 'defaultShowPrimaryMetadata'
  | 'defaultHideLiveChat'
  | 'fullscreenHideTitleOverlay'
  | 'fullscreenHidePlayerUI'
  | 'fullscreenHideRecommendationOverlays'
  | 'fullscreenHideActionOverlay'
  | 'pipButton'
  | 'floatingMiniPlayer';

type SettingKey = BooleanSettingKey | 'generalFeedColumns';

type Settings = Record<BooleanSettingKey, boolean> & {
  generalFeedColumns: FeedColumnCount;
};

const DEFAULT_SETTINGS: Settings = {
  generalHideSponsoredPosts: true,
  generalHideEndScreenCards: true,
  generalFeedColumns: 3,
  generalHideShorts: true,
  generalSidebarCleanup: true,
  generalHideSidebar: false,
  generalHideSidebarHome: false,
  generalHideSidebarShorts: true,
  generalHideSidebarSubscriptions: false,
  generalHideSidebarYou: false,
  generalHideSidebarExplore: false,
  generalHideSidebarMoreFromYouTube: true,
  generalHideSidebarReportHistory: true,
  generalHideSidebarFooter: true,
  enhancedTheaterMode: true,
  theaterHideHeader: true,
  theaterShowHeaderOnHover: true,
  theaterHidePlayerUI: true,
  theaterHideScrollbarOnScroll: true,
  theaterHideRecommendations: true,
  theaterHideComments: false,
  theaterHideMetadata: false,
  theaterShowPrimaryMetadata: true,
  theaterHideLiveChat: false,
  theaterShowLiveChatOverlay: false,
  defaultHideRecommendations: false,
  defaultHideComments: false,
  defaultHideMetadata: false,
  defaultShowPrimaryMetadata: true,
  defaultHideLiveChat: false,
  fullscreenHideTitleOverlay: true,
  fullscreenHidePlayerUI: true,
  fullscreenHideRecommendationOverlays: true,
  fullscreenHideActionOverlay: true,
  pipButton: true,
  floatingMiniPlayer: true,
};

const SETTING_KEYS = Object.keys(DEFAULT_SETTINGS) as SettingKey[];

function isFeedColumnCount(value: unknown): value is FeedColumnCount {
  return value === 2 || value === 3 || value === 4;
}

function normalizeSettings(items: Partial<Record<SettingKey, unknown>>): Settings {
  const settings = { ...DEFAULT_SETTINGS };

  for (const key of SETTING_KEYS) {
    if (key === 'generalFeedColumns') {
      settings.generalFeedColumns = isFeedColumnCount(items.generalFeedColumns)
        ? items.generalFeedColumns
        : DEFAULT_SETTINGS.generalFeedColumns;
      continue;
    }

    settings[key] = typeof items[key] === 'boolean' ? items[key] : DEFAULT_SETTINGS[key];
  }

  return settings;
}

type DockState = {
  target: HTMLElement;
  originalParent: Node;
  originalNextSibling: ChildNode | null;
  placeholder: HTMLElement;
  shell: HTMLElement;
};

type FullscreenActionDockState = {
  target: HTMLElement;
  originalParent: Node;
  originalNextSibling: ChildNode | null;
  shell: HTMLElement;
};

const SELECTORS = {
  masthead: '#masthead-container, ytd-masthead',
  mastheadTargets: '#masthead-container, ytd-masthead, ytd-masthead #container',
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
const FULLSCREEN_ACTION_DOCK_ID = 'simple-yt-tweaks-fullscreen-actions';
const MASTHEAD_CLASS = 'simple-yt-tweaks-masthead';
const LIVE_CHAT_CLASS = 'simple-yt-tweaks-live-chat';
const GENERAL_HIDDEN_CLASS = 'simple-yt-tweaks-hidden';
const SIDEBAR_SUBSCRIPTIONS_CLASS = 'simple-yt-tweaks-sidebar-subscriptions';
const SIDEBAR_SUBSCRIPTIONS_ICON_CLASS = 'simple-yt-tweaks-sidebar-subscriptions-icon';
const THEATER_PRIMARY_METADATA_CLASS = 'simple-yt-tweaks-theater-primary-metadata';
const FULLSCREEN_ACTION_TARGET_CLASS = 'simple-yt-tweaks-fullscreen-action-target';

const SPONSORED_CARD_SELECTORS = [
  'ytd-display-ad-renderer',
  'ytd-promoted-sparkles-web-renderer',
  'ytd-ad-slot-renderer',
  'ytd-in-feed-ad-layout-renderer',
  'ytd-banner-promo-renderer',
  'ytd-search-pyv-renderer',
  'ytd-companion-slot-renderer',
  'ytm-promoted-sparkles-web-renderer',
] as const;

const SIDEBAR_ITEM_LABELS = {
  home: ['home'],
  shorts: ['shorts'],
  subscriptions: ['subscriptions'],
  you: ['you', 'your channel', 'history', 'playlists', 'your videos', 'downloads', 'watch later', 'liked videos'],
  explore: ['explore', 'trending', 'shopping', 'music', 'movies', 'movies & tv', 'live', 'gaming', 'news', 'sports', 'learning', 'fashion & beauty', 'podcasts'],
  moreFromYouTube: ['more from youtube', 'youtube premium', 'youtube studio', 'youtube music', 'youtube kids', 'youtube tv'],
  reportHistory: ['report history'],
} as const;

const SUBSCRIPTIONS_ICON_SVG = `
  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" focusable="false" aria-hidden="true" style="pointer-events: none; display: inherit; width: 100%; height: 100%;">
    <path d="M18 1H6a2 2 0 00-2 2h16a2 2 0 00-2-2Zm3 4H3a2 2 0 00-2 2v13a2 2 0 002 2h18a2 2 0 002-2V7a2 2 0 00-2-2ZM3 20V7h18v13H3Zm13-6.5L10 10v7l6-3.5Z"></path>
  </svg>
`;

const state: {
  settings: Settings;
  currentUrl: string;
  observer: MutationObserver | null;
  watchObserver: MutationObserver | null;
  watchObservedTarget: Element | null;
  domRerun: (() => void) | null;
  dock: DockState | null;
  fullscreenActionDock: FullscreenActionDockState | null;
  miniPlayerDismissed: boolean;
  storageObserverBound: boolean;
  pointerHandlersBound: boolean;
  lastEnhancedTheaterActive: boolean;
  modeTransitionTimers: number[];
} = {
  settings: { ...DEFAULT_SETTINGS },
  currentUrl: location.href,
  observer: null,
  watchObserver: null,
  watchObservedTarget: null,
  domRerun: null,
  dock: null,
  fullscreenActionDock: null,
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

      resolve(normalizeSettings(items));
    });
  });
}

function isFeatureEnabled(key: BooleanSettingKey): boolean {
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

function isDedicatedShortsPage(): boolean {
  return location.pathname === '/shorts' || location.pathname.startsWith('/shorts/');
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

function isNativeFullscreenActive(): boolean {
  return isWatchPage() && Boolean(document.fullscreenElement);
}

function isTheaterMinimalLayoutActive(): boolean {
  return (
    isEnhancedTheaterActive() &&
    state.settings.theaterHideRecommendations &&
    state.settings.theaterHideComments &&
    state.settings.theaterHideMetadata &&
    !state.settings.theaterShowPrimaryMetadata &&
    state.settings.theaterHideLiveChat
  );
}

function normalizeLabel(value: string): string {
  return value.toLowerCase().replace(/[›>]/g, '').replace(/\s+/g, ' ').trim();
}

function getElementLabel(element: Element): string {
  const ariaLabel = element.getAttribute('aria-label') ?? '';
  const title = element.getAttribute('title') ?? '';
  const text = element.textContent ?? '';

  return normalizeLabel(`${ariaLabel} ${title} ${text}`);
}

function labelMatchesEntry(label: string, entry: string): boolean {
  const normalizedEntry = normalizeLabel(entry);

  return (
    label === normalizedEntry ||
    label === `${normalizedEntry} ${normalizedEntry}` ||
    label.startsWith(`${normalizedEntry} selected`) ||
    label.startsWith(`${normalizedEntry} link`)
  );
}

function elementMatchesAnyLabel(element: Element, labels: readonly string[]): boolean {
  const label = getElementLabel(element);
  if (!label) return false;

  return labels.some((entry) => labelMatchesEntry(label, entry));
}

function buildCss(): string {
  const generalHideEndScreenCards = state.settings.generalHideEndScreenCards;
  const generalFeedColumns = state.settings.generalFeedColumns;
  const generalHideShorts = state.settings.generalHideShorts && !isDedicatedShortsPage();
  const generalSidebarCleanup = state.settings.generalSidebarCleanup;
  const generalHideSidebar = generalSidebarCleanup && state.settings.generalHideSidebar;
  const generalHideSidebarShorts = state.settings.generalHideSidebarShorts && (generalSidebarCleanup || state.settings.generalHideShorts);
  const enhancedTheater = state.settings.enhancedTheaterMode;
  const theaterHideHeader = state.settings.theaterHideHeader;
  const theaterShowHeaderOnHover = state.settings.theaterShowHeaderOnHover;
  const theaterHidePlayerUI = state.settings.theaterHidePlayerUI;
  const theaterHideRecommendations = state.settings.theaterHideRecommendations;
  const theaterHideComments = state.settings.theaterHideComments;
  const theaterHideMetadata = state.settings.theaterHideMetadata;
  const theaterShowPrimaryMetadata = state.settings.theaterShowPrimaryMetadata;
  const theaterHideLiveChat = state.settings.theaterHideLiveChat;
  const theaterShowLiveChatOverlay = state.settings.theaterShowLiveChatOverlay;
  const defaultHideRecommendations = state.settings.defaultHideRecommendations;
  const defaultHideComments = state.settings.defaultHideComments;
  const defaultHideMetadata = state.settings.defaultHideMetadata;
  const defaultShowPrimaryMetadata = state.settings.defaultShowPrimaryMetadata;
  const defaultHideLiveChat = state.settings.defaultHideLiveChat;
  const fullscreenHideTitleOverlay = state.settings.fullscreenHideTitleOverlay;
  const fullscreenHidePlayerUI = state.settings.fullscreenHidePlayerUI;
  const fullscreenHideRecommendationOverlays = state.settings.fullscreenHideRecommendationOverlays;
  const fullscreenHideActionOverlay = state.settings.fullscreenHideActionOverlay;

  return `
    .${GENERAL_HIDDEN_CLASS} {
      display: none !important;
    }

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

    body.simple-yt-tweaks-active ytd-browse[page-subtype="home"] ytd-rich-grid-renderer,
    body.simple-yt-tweaks-active ytd-browse[page-subtype="home"] ytd-rich-grid-renderer #contents {
      --ytd-rich-grid-items-per-row: ${generalFeedColumns} !important;
      --ytd-rich-grid-posts-per-row: ${generalFeedColumns} !important;
      --ytd-rich-grid-slim-items-per-row: ${generalFeedColumns} !important;
      --ytd-rich-grid-game-cards-per-row: ${generalFeedColumns} !important;
    }

    body.simple-yt-tweaks-active ytd-browse[page-subtype="home"] ytd-rich-grid-renderer #contents {
      display: grid !important;
      grid-template-columns: repeat(${generalFeedColumns}, minmax(0, 1fr)) !important;
      align-items: start !important;
      column-gap: 16px !important;
      row-gap: 24px !important;
    }

    body.simple-yt-tweaks-active ytd-browse[page-subtype="home"] ytd-rich-grid-row {
      display: contents !important;
    }

    body.simple-yt-tweaks-active ytd-browse[page-subtype="home"] ytd-rich-item-renderer {
      width: auto !important;
      margin: 0 !important;
      min-width: 0 !important;
      max-width: none !important;
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

    ${generalSidebarCleanup ? `
    body.simple-yt-tweaks-active .${SIDEBAR_SUBSCRIPTIONS_CLASS} #header-entry .guide-icon,
    body.simple-yt-tweaks-active .${SIDEBAR_SUBSCRIPTIONS_CLASS} #header-entry yt-icon,
    body.simple-yt-tweaks-active .${SIDEBAR_SUBSCRIPTIONS_CLASS} #header-entry yt-img-shadow {
      display: none !important;
      visibility: hidden !important;
    }

    body.simple-yt-tweaks-active .${SIDEBAR_SUBSCRIPTIONS_CLASS} .${SIDEBAR_SUBSCRIPTIONS_ICON_CLASS} {
      display: inline-flex !important;
      width: 24px !important;
      height: 24px !important;
      margin-right: 24px !important;
      align-items: center !important;
      justify-content: center !important;
      color: currentColor !important;
    }

    body.simple-yt-tweaks-active .${SIDEBAR_SUBSCRIPTIONS_CLASS} .${SIDEBAR_SUBSCRIPTIONS_ICON_CLASS} svg {
      width: 24px !important;
      height: 24px !important;
      fill: currentColor !important;
    }

    body.simple-yt-tweaks-active .${SIDEBAR_SUBSCRIPTIONS_CLASS} #header-entry .arrow-icon {
      display: none !important;
    }
    ` : ''}

    ${generalHideEndScreenCards ? `
    body.simple-yt-tweaks-active .ytp-ce-element,
    body.simple-yt-tweaks-active .ytp-ce-video,
    body.simple-yt-tweaks-active .ytp-ce-playlist,
    body.simple-yt-tweaks-active .ytp-ce-channel,
    body.simple-yt-tweaks-active .ytp-endscreen-content {
      display: none !important;
      opacity: 0 !important;
      pointer-events: none !important;
      visibility: hidden !important;
    }
    ` : ''}

    ${generalHideSidebar ? `
    body.simple-yt-tweaks-active #guide,
    body.simple-yt-tweaks-active #guide-content,
    body.simple-yt-tweaks-active ytd-guide-renderer,
    body.simple-yt-tweaks-active ytd-mini-guide-renderer,
    body.simple-yt-tweaks-active #guide-spacer {
      display: none !important;
    }

    body.simple-yt-tweaks-active #guide-button,
    body.simple-yt-tweaks-active ytd-masthead #guide-button,
    body.simple-yt-tweaks-active ytd-masthead button[aria-label*="Guide"],
    body.simple-yt-tweaks-active ytd-masthead button[aria-label*="menu"] {
      display: none !important;
    }

    body.simple-yt-tweaks-active #page-manager,
    body.simple-yt-tweaks-active ytd-page-manager,
    body.simple-yt-tweaks-active #content {
      margin-left: 0 !important;
    }
    ` : ''}

    ${generalHideSidebarShorts ? `
    body.simple-yt-tweaks-active ytd-mini-guide-entry-renderer[aria-label*="Shorts"],
    body.simple-yt-tweaks-active ytd-mini-guide-entry-renderer[title*="Shorts"],
    body.simple-yt-tweaks-active ytd-guide-entry-renderer:has(a[href^="/shorts"]),
    body.simple-yt-tweaks-active ytd-guide-entry-renderer:has(a[title*="Shorts"]),
    body.simple-yt-tweaks-active ytd-guide-entry-renderer:has(a[aria-label*="Shorts"]) {
      display: none !important;
    }
    ` : ''}

    ${generalHideShorts ? `
    body.simple-yt-tweaks-active ytd-rich-shelf-renderer[is-shorts],
    body.simple-yt-tweaks-active ytd-reel-shelf-renderer,
    body.simple-yt-tweaks-active ytd-reel-video-renderer,
    body.simple-yt-tweaks-active ytd-shorts,
    body.simple-yt-tweaks-active ytd-video-renderer:has(a[href^="/shorts/"]),
    body.simple-yt-tweaks-active ytd-grid-video-renderer:has(a[href^="/shorts/"]),
    body.simple-yt-tweaks-active ytd-rich-item-renderer:has(a[href^="/shorts/"]),
    body.simple-yt-tweaks-active ytd-compact-video-renderer:has(a[href^="/shorts/"]),
    body.simple-yt-tweaks-active ytd-shelf-renderer:has(a[href^="/shorts/"]),
    body.simple-yt-tweaks-active ytd-item-section-renderer:has(ytd-reel-shelf-renderer) {
      display: none !important;
    }
    ` : ''}

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

    ${isTheaterMinimalLayoutActive() ? `
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

    ${theaterHidePlayerUI || fullscreenHidePlayerUI ? `
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
    body.simple-yt-tweaks-fullscreen-view #movie_player:focus-within .ytp-chrome-top {
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
    body.simple-yt-tweaks-fullscreen-view #movie_player:focus-within .ytp-title,
    body.simple-yt-tweaks-fullscreen-view #movie_player:focus-within .ytp-title-channel,
    body.simple-yt-tweaks-fullscreen-view #movie_player:focus-within .ytp-title-channel-logo,
    body.simple-yt-tweaks-fullscreen-view #movie_player:focus-within .ytp-title-text,
    body.simple-yt-tweaks-fullscreen-view #movie_player:focus-within .ytp-title-link,
    body.simple-yt-tweaks-fullscreen-view #movie_player:focus-within .ytp-title-expanded-overlay,
    body.simple-yt-tweaks-fullscreen-view #movie_player:focus-within .ytp-title-text > a,
    body.simple-yt-tweaks-fullscreen-view #movie_player:focus-within .ytp-gradient-top,
    body.simple-yt-tweaks-fullscreen-view #movie_player:focus-within .ytp-fullscreen-metadata,
    body.simple-yt-tweaks-fullscreen-view #movie_player:focus-within .ytp-fullscreen-metadata yt-player-overlay-video-details-renderer,
    body.simple-yt-tweaks-fullscreen-view #movie_player:focus-within .ytp-fullscreen-metadata .ytPlayerOverlayVideoDetailsRendererHost {
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
    body.simple-yt-tweaks-fullscreen-view .ytp-cards-teaser-box {
      display: none !important;
      opacity: 0 !important;
      pointer-events: none !important;
      visibility: hidden !important;
    }
    ` : ''}

    ${fullscreenHideActionOverlay ? `
    body.simple-yt-tweaks-fullscreen-view .ytp-overlay-bottom-left .ytp-suggested-action:not(.${FULLSCREEN_ACTION_TARGET_CLASS}),
    body.simple-yt-tweaks-fullscreen-view .ytp-overlay-bottom-left [class*="ytp-suggested-action-badge-with-controls"]:not(.${FULLSCREEN_ACTION_TARGET_CLASS}) {
      display: none !important;
      opacity: 0 !important;
      pointer-events: none !important;
      visibility: hidden !important;
    }

    body.simple-yt-tweaks-fullscreen-view #${FULLSCREEN_ACTION_DOCK_ID} {
      display: inline-flex !important;
      align-items: center !important;
      justify-content: flex-end !important;
      height: 100% !important;
      margin-left: 8px !important;
      gap: 8px !important;
      flex: 0 0 auto !important;
      opacity: 1 !important;
      pointer-events: auto !important;
      visibility: visible !important;
    }

    body.simple-yt-tweaks-fullscreen-view #${FULLSCREEN_ACTION_DOCK_ID} .${FULLSCREEN_ACTION_TARGET_CLASS} {
      position: static !important;
      inset: auto !important;
      display: inline-flex !important;
      align-items: center !important;
      justify-content: flex-end !important;
      width: auto !important;
      min-width: 0 !important;
      max-width: none !important;
      margin: 0 !important;
      gap: 6px !important;
      opacity: 1 !important;
      pointer-events: auto !important;
      visibility: visible !important;
      transform: none !important;
    }

    body.simple-yt-tweaks-fullscreen-view #${FULLSCREEN_ACTION_DOCK_ID} .${FULLSCREEN_ACTION_TARGET_CLASS} > .ytp-button,
    body.simple-yt-tweaks-fullscreen-view #${FULLSCREEN_ACTION_DOCK_ID} .${FULLSCREEN_ACTION_TARGET_CLASS} [class*="ytp-suggested-action-badge"] {
      display: inline-flex !important;
      align-items: center !important;
      position: static !important;
      inset: auto !important;
      margin: 0 !important;
      opacity: 1 !important;
      pointer-events: auto !important;
      visibility: visible !important;
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

    ${defaultHideMetadata && !defaultShowPrimaryMetadata ? `
    body.simple-yt-tweaks-default-view ytd-watch-metadata,
    body.simple-yt-tweaks-default-view #info-contents ytd-video-primary-info-renderer,
    body.simple-yt-tweaks-default-view #meta-contents ytd-video-secondary-info-renderer {
      display: none !important;
    }
    ` : ''}

    ${defaultHideMetadata && defaultShowPrimaryMetadata ? `
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
  const theaterEnabled = isEnhancedTheaterActive();
  const fullscreenEnabled = isNativeFullscreenActive();
  const wasTheaterEnabled = state.lastEnhancedTheaterActive;
  const wasFullscreenEnabled = document.body.classList.contains('simple-yt-tweaks-fullscreen-view');

  document.body.classList.toggle('simple-yt-tweaks-theater', theaterEnabled);
  document.body.classList.toggle('simple-yt-tweaks-default-view', isDefaultWatchView());
  document.body.classList.toggle('simple-yt-tweaks-fullscreen-view', fullscreenEnabled);
  document.body.classList.toggle('simple-yt-tweaks-theater-minimal', isTheaterMinimalLayoutActive());
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

  if (theaterEnabled) {
    restoreDockedPlayer();
  } else {
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

  document.body.classList.toggle('simple-yt-tweaks-player-ui-hidden', shouldHidePlayerUi);

  if (!shouldHidePlayerUi) {
    document.body.classList.remove('simple-yt-tweaks-player-ui-hover');
  }

  if (wasTheaterEnabled !== theaterEnabled || wasFullscreenEnabled !== fullscreenEnabled) {
    state.lastEnhancedTheaterActive = theaterEnabled;
    scheduleModeStabilization();
  }
}

function scheduleModeStabilization(): void {
  for (const timer of state.modeTransitionTimers) {
    window.clearTimeout(timer);
  }

  state.modeTransitionTimers = [80, 220, 520].map((delay) =>
    window.setTimeout(() => {
      updateViewportHeightVar();
      updateTheaterClass();
      updateMastheadTargets();
      updateLiveChatTargets();
      updateScrollbarState();
      updateFullscreenActionDock();
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

function clearGeneralHiddenTargets(): void {
  for (const target of queryAll<HTMLElement>(`.${GENERAL_HIDDEN_CLASS}`)) {
    target.classList.remove(GENERAL_HIDDEN_CLASS);
  }

  for (const target of queryAll<HTMLElement>(`.${SIDEBAR_SUBSCRIPTIONS_CLASS}`)) {
    target.classList.remove(SIDEBAR_SUBSCRIPTIONS_CLASS);
  }

  for (const target of queryAll<HTMLElement>(`.${SIDEBAR_SUBSCRIPTIONS_ICON_CLASS}`)) {
    target.remove();
  }
}

function hideElement(element: Element | null): void {
  if (element instanceof HTMLElement) {
    element.classList.add(GENERAL_HIDDEN_CLASS);
  }
}

function hideClosest(element: Element, selector: string): void {
  hideElement(element.closest(selector));
}

function hideClosestTag(element: Element, tagNames: readonly string[]): void {
  let current: Element | null = element;

  while (current && current !== document.documentElement) {
    if (tagNames.includes(current.tagName.toLowerCase())) {
      hideElement(current);
      return;
    }

    current = current.parentElement;
  }
}

function getSidebarSectionHeading(section: HTMLElement): string {
  const heading = query<HTMLElement>(
    '#guide-section-title, #title, h3',
    section,
  );

  return heading ? getElementLabel(heading) : '';
}

function getTopLevelSidebarSections(): HTMLElement[] {
  return queryAll<HTMLElement>(
    [
      '#guide ytd-guide-renderer > #sections > ytd-guide-section-renderer',
      'ytd-guide-renderer > #sections > ytd-guide-section-renderer',
    ].join(','),
  );
}

function sectionHasSidebarLink(section: HTMLElement, href: string): boolean {
  return Boolean(query(`a[href="${href}"]`, section));
}

function getSidebarSection(kind: 'subscriptions' | 'you' | 'explore' | 'moreFromYouTube' | 'reportHistory'): HTMLElement | null {
  for (const section of getTopLevelSidebarSections()) {
    const heading = getSidebarSectionHeading(section);

    if (kind === 'subscriptions' && sectionHasSidebarLink(section, '/feed/subscriptions')) {
      return section;
    }

    if (kind === 'you' && sectionHasSidebarLink(section, '/feed/you')) {
      return section;
    }

    if (kind === 'explore' && labelMatchesEntry(heading, 'explore')) {
      return section;
    }

    if (kind === 'moreFromYouTube' && labelMatchesEntry(heading, 'more from youtube')) {
      return section;
    }

    if (kind === 'reportHistory' && sectionHasSidebarLink(section, '/reporthistory')) {
      return section;
    }
  }

  return null;
}

function clickElement(element: HTMLElement | null): void {
  if (!element) return;

  element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
}

function updateSidebarSectionPolish(): void {
  if (!state.settings.generalSidebarCleanup || state.settings.generalHideSidebar) {
    return;
  }

  const subscriptionsSection = getSidebarSection('subscriptions');
  if (subscriptionsSection && !state.settings.generalHideSidebarSubscriptions) {
    subscriptionsSection.classList.add(SIDEBAR_SUBSCRIPTIONS_CLASS);
    const headerEntry = query<HTMLElement>('#header-entry', subscriptionsSection);
    const guideIcon = query<HTMLElement>('#header-entry .guide-icon', subscriptionsSection);
    const imageShadow = query<HTMLElement>('#header-entry yt-img-shadow', subscriptionsSection);
    const title = query<HTMLElement>('#header-entry .title', subscriptionsSection);
    const existingCustomIcon = query<HTMLElement>(`.${SIDEBAR_SUBSCRIPTIONS_ICON_CLASS}`, subscriptionsSection);

    hideElement(guideIcon);
    hideElement(imageShadow);

    if (headerEntry && title && !existingCustomIcon) {
      const icon = document.createElement('span');
      icon.className = SIDEBAR_SUBSCRIPTIONS_ICON_CLASS;
      icon.setAttribute('aria-hidden', 'true');
      icon.innerHTML = SUBSCRIPTIONS_ICON_SVG;
      title.parentElement?.insertBefore(icon, title);
    }

    const subscriptionsItems = query<HTMLElement>('#items', subscriptionsSection);
    if (subscriptionsItems) {
      for (const child of Array.from(subscriptionsItems.children)) {
        if (child.tagName === 'YTD-GUIDE-COLLAPSIBLE-SECTION-ENTRY-RENDERER') continue;
        hideElement(child);
      }
    }

    hideElement(query('#section-items', subscriptionsSection));
    hideElement(query('ytd-guide-collapsible-entry-renderer', subscriptionsSection));
    hideElement(query('#header-entry .arrow-icon', subscriptionsSection));
  }

  const youSection = getSidebarSection('you');
  if (youSection && !state.settings.generalHideSidebarYou) {
    const youCollapsible = query<HTMLElement>('ytd-guide-collapsible-entry-renderer', youSection);
    const expanded = youCollapsible ? query<HTMLElement>('#expanded', youCollapsible) : null;
    const expanderItem = youCollapsible ? query<HTMLElement>('#expander-item', youCollapsible) : null;
    const isExpanded = expanded
      ? !expanded.hasAttribute('hidden') && window.getComputedStyle(expanded).display !== 'none'
      : true;

    if (expanderItem && !isExpanded) {
      clickElement(expanderItem);
    }

    hideElement(expanderItem);
    hideElement(youCollapsible ? query('#collapser-item', youCollapsible) : null);
  }
}

function isVisibleNode(element: HTMLElement): boolean {
  const styles = window.getComputedStyle(element);

  return (
    !element.classList.contains(GENERAL_HIDDEN_CLASS) &&
    styles.display !== 'none' &&
    styles.visibility !== 'hidden' &&
    styles.opacity !== '0' &&
    (element.offsetWidth > 0 || element.offsetHeight > 0)
  );
}

function updateSponsoredVisibility(): void {
  if (!state.settings.generalHideSponsoredPosts) return;

  for (const target of queryAll<HTMLElement>(SPONSORED_CARD_SELECTORS.join(','))) {
    const onHomeFeed = Boolean(target.closest('ytd-browse[page-subtype="home"]'));

    if (onHomeFeed) {
      hideClosestTag(target, [
        'ytd-rich-item-renderer',
        'ytd-rich-section-renderer',
        'ytd-feed-nudge-renderer',
      ]);
      continue;
    }

    hideClosest(
      target,
      [
        'ytd-search-pyv-renderer',
        'ytd-companion-slot-renderer',
        'ytd-display-ad-renderer',
        'ytd-promoted-sparkles-web-renderer',
        'ytd-ad-slot-renderer',
        'ytd-in-feed-ad-layout-renderer',
        'ytd-banner-promo-renderer',
      ].join(','),
    );
  }
}

function updateSidebarFooterVisibility(): void {
  if (!state.settings.generalSidebarCleanup || !state.settings.generalHideSidebarFooter) return;

  for (const target of queryAll<HTMLElement>(
    [
      '#guide #footer',
      '#guide #copyright',
      'ytd-guide-renderer #footer',
      'ytd-guide-renderer #copyright',
      'ytd-guide-renderer #legal',
    ].join(','),
  )) {
    hideElement(target);
  }
}

function updateSidebarItemVisibility(): void {
  const shortsLinkCleanupEnabled = state.settings.generalHideSidebarShorts && (state.settings.generalSidebarCleanup || state.settings.generalHideShorts);
  const homeLinkCleanupEnabled = state.settings.generalSidebarCleanup && state.settings.generalHideSidebarHome;
  const sectionCleanupEnabled = state.settings.generalSidebarCleanup;

  if (sectionCleanupEnabled && state.settings.generalHideSidebar) return;

  updateSidebarFooterVisibility();

  if (sectionCleanupEnabled && state.settings.generalHideSidebarSubscriptions) {
    hideElement(getSidebarSection('subscriptions'));
  }
  if (sectionCleanupEnabled && state.settings.generalHideSidebarYou) {
    hideElement(getSidebarSection('you'));
  }
  if (sectionCleanupEnabled && state.settings.generalHideSidebarExplore) {
    hideElement(getSidebarSection('explore'));
  }
  if (sectionCleanupEnabled && state.settings.generalHideSidebarMoreFromYouTube) {
    hideElement(getSidebarSection('moreFromYouTube'));
  }
  if (sectionCleanupEnabled && state.settings.generalHideSidebarReportHistory) {
    hideElement(getSidebarSection('reportHistory'));
  }

  if (!homeLinkCleanupEnabled && !shortsLinkCleanupEnabled) return;

  const sidebarItems = queryAll<HTMLElement>(
    [
      '#guide ytd-guide-entry-renderer',
      '#guide ytd-guide-collapsible-entry-renderer',
      '#guide tp-yt-paper-item',
      'ytd-guide-renderer ytd-guide-entry-renderer',
      'ytd-guide-renderer ytd-guide-collapsible-entry-renderer',
      'ytd-guide-renderer tp-yt-paper-item',
      'ytd-mini-guide-renderer ytd-mini-guide-entry-renderer',
      'ytd-guide-renderer a',
    ].join(','),
  );

  for (const item of sidebarItems) {
    if (homeLinkCleanupEnabled && elementMatchesAnyLabel(item, SIDEBAR_ITEM_LABELS.home)) {
      hideElement(item);
      continue;
    }

    if (shortsLinkCleanupEnabled && elementMatchesAnyLabel(item, SIDEBAR_ITEM_LABELS.shorts)) {
      hideElement(item);
    }
  }
}

function updateShortsVisibility(): void {
  if (!state.settings.generalHideShorts || isDedicatedShortsPage()) return;

  for (const target of queryAll<HTMLElement>('ytd-rich-shelf-renderer[is-shorts], ytd-reel-shelf-renderer, ytd-reel-video-renderer')) {
    hideElement(target);
  }

  for (const link of queryAll<HTMLAnchorElement>('a[href^="/shorts/"], a[href="/shorts"]')) {
    hideClosest(
      link,
      [
        'ytd-rich-item-renderer',
        'ytd-video-renderer',
        'ytd-grid-video-renderer',
        'ytd-compact-video-renderer',
        'ytd-reel-video-renderer',
        'ytd-shelf-renderer',
      ].join(','),
    );
  }

  for (const item of queryAll<HTMLElement>('ytd-rich-section-renderer, ytd-item-section-renderer, ytd-shelf-renderer')) {
    if (elementMatchesAnyLabel(item, SIDEBAR_ITEM_LABELS.shorts) && query<HTMLAnchorElement>('a[href^="/shorts/"], a[href="/shorts"]', item)) {
      hideElement(item);
    }
  }
}

function normalizeHomeFeedLayout(): void {
  const homeFeed = query<HTMLElement>('ytd-browse[page-subtype="home"] ytd-rich-grid-renderer #contents');
  if (!homeFeed) return;

  for (const item of queryAll<HTMLElement>('ytd-rich-item-renderer', homeFeed)) {
    const hasVisibleChild = Array.from(item.children).some(
      (child) => child instanceof HTMLElement && isVisibleNode(child),
    );

    if (!hasVisibleChild) {
      hideElement(item);
    }
  }

  for (const row of queryAll<HTMLElement>('ytd-rich-grid-row', homeFeed)) {
    const visibleItems = queryAll<HTMLElement>('ytd-rich-item-renderer', row).filter(isVisibleNode);
    if (visibleItems.length === 0) {
      hideElement(row);
    }
  }
}

function updateGeneralVisibility(): void {
  clearGeneralHiddenTargets();
  if (state.settings.generalSidebarCleanup || state.settings.generalHideShorts) {
    updateSidebarItemVisibility();
  }

  if (state.settings.generalSidebarCleanup) {
    updateSidebarSectionPolish();
  }

  updateSponsoredVisibility();
  updateShortsVisibility();
  normalizeHomeFeedLayout();
}

function updateViewportHeightVar(): void {
  const height = Math.round(window.visualViewport?.height ?? window.innerHeight);
  document.documentElement.style.setProperty('--simple-yt-tweaks-vh', `${height}px`);
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
  const theaterActive = isEnhancedTheaterActive() && state.settings.theaterHidePlayerUI;
  const fullscreenActive = isNativeFullscreenActive() && state.settings.fullscreenHidePlayerUI;

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
    pointerX >= rect.left && pointerX <= rect.right && pointerY >= rect.top && pointerY <= rect.bottom;
  const controlZoneHeight = fullscreenActive ? 138 : 118;
  const isInControlZone = pointerY >= rect.bottom - controlZoneHeight;
  const shouldRevealPlayerUi = isInsidePlayer && isInControlZone;

  document.body.classList.toggle(
    'simple-yt-tweaks-player-ui-hover',
    shouldRevealPlayerUi,
  );

  if (fullscreenActive && state.settings.fullscreenHideActionOverlay) {
    updateFullscreenActionDock();
  }
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

function ensureFullscreenActionDockShell(): HTMLElement | null {
  const rightControls = query<HTMLElement>(SELECTORS.controlsRight);
  if (!rightControls) return null;

  let shell = document.getElementById(FULLSCREEN_ACTION_DOCK_ID);
  if (shell) return shell;

  shell = document.createElement('div');
  shell.id = FULLSCREEN_ACTION_DOCK_ID;
  rightControls.append(shell);
  return shell;
}

function getFullscreenActionCandidate(element: HTMLElement): HTMLElement | null {
  if (element.id === FULLSCREEN_ACTION_DOCK_ID) return null;

  const target = element.matches('.ytp-suggested-action')
    ? element
    : element.closest<HTMLElement>('.ytp-suggested-action');

  if (!target || target.closest(`#${FULLSCREEN_ACTION_DOCK_ID}`)) {
    return null;
  }

  return target;
}

function findFullscreenActionTarget(): HTMLElement | null {
  const currentTarget = state.fullscreenActionDock?.target;
  if (currentTarget?.isConnected) return currentTarget;

  const candidates = [
    '.ytp-overlay-bottom-left .ytp-suggested-action',
    '.ytp-overlay-bottom-left [class*="ytp-suggested-action-badge-with-controls"]',
    '.ytp-overlay-bottom-left [class*="ytp-suggested-action-badge-expanded"]',
    '.ytp-overlay-bottom-left [class*="ytp-suggested-action-badge-fullscreen"]',
  ];

  let bestTarget: HTMLElement | null = null;
  let bestScore = -Infinity;

  for (const selector of candidates) {
    for (const element of queryAll<HTMLElement>(selector)) {
      const target = getFullscreenActionCandidate(element);
      if (!target) continue;

      let score = 0;
      if (target.querySelector('[class*="ytp-suggested-action-badge-with-controls"]')) score += 6;
      if (target.querySelector('.ytp-button.ytp-suggested-action-badge')) score += 4;
      if (target.querySelector('[class*="ytp-suggested-action-badge-expanded"]')) score += 3;
      if (target.querySelector('[class*="ytp-featured-product"]')) score -= 5;
      if (isVisibleNode(target)) score += 2;

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

function restoreFullscreenActionDock(): void {
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

function updateFullscreenActionDock(): void {
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
    dockFullscreenActions();
    return;
  }

  restoreFullscreenActionDock();
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
  if (!isFeatureEnabled('floatingMiniPlayer') || !isWatchPage() || state.miniPlayerDismissed || isNativeFullscreenActive()) {
    return false;
  }

  const playerRect = getOriginalPlayerRect();
  if (!playerRect) return false;

  const belowTargets = [
    query<HTMLElement>('#below'),
    query<HTMLElement>(SELECTORS.comments),
    query<HTMLElement>('#secondary'),
    query<HTMLElement>('ytd-watch-metadata'),
  ].filter((element): element is HTMLElement => Boolean(element) && isVisibleNode(element as HTMLElement));

  if (belowTargets.length === 0) return false;

  const playerMostlyOffscreen = playerRect.bottom < 120;
  const belowContentEnteredViewport = belowTargets.some((target) => target.getBoundingClientRect().top < window.innerHeight);

  return playerMostlyOffscreen && belowContentEnteredViewport;
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
  restoreFullscreenActionDock();
}

function applyFeatureState(): void {
  if (!document.body) return;

  if (state.domRerun) {
    syncWatchObserver(state.domRerun);
  }

  ensureStyle();
  resetNavigationState();
  updateViewportHeightVar();
  updateTheaterClass();
  updateMastheadTargets();
  updateLiveChatTargets();
  updateGeneralVisibility();
  updateScrollbarState();

  if (isFeatureEnabled('pipButton')) {
    createPipButton();
  } else {
    removePipButton();
  }

  updateFullscreenActionDock();

  if (
    state.settings.theaterHidePlayerUI ||
    state.settings.theaterShowHeaderOnHover ||
    state.settings.fullscreenHidePlayerUI
  ) {
    bindPointerHandlers();
  }
  document.body.classList.toggle(
    'simple-yt-tweaks-hide-native-miniplayer',
    isDefaultWatchView() && isFeatureEnabled('floatingMiniPlayer'),
  );

  if (!state.settings.theaterHidePlayerUI && !state.settings.fullscreenHidePlayerUI) {
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
      if (!change) continue;

      if (
        key === 'generalFeedColumns' &&
        (change.newValue === 2 || change.newValue === 3 || change.newValue === 4)
      ) {
        state.settings.generalFeedColumns = change.newValue;
        touched = true;
        continue;
      }

      if (typeof change.newValue === 'boolean') {
        state.settings[key as BooleanSettingKey] = change.newValue;
        touched = true;
      }
    }

    if (touched) {
      state.settings = normalizeSettings(state.settings);
      applyFeatureState();
    }
  });
}

function syncWatchObserver(onChange: () => void): void {
  const watchFlexy = query<HTMLElement>(SELECTORS.watchFlexy);
  if (watchFlexy === state.watchObservedTarget) return;

  state.watchObserver?.disconnect();
  state.watchObserver = null;
  state.watchObservedTarget = watchFlexy;

  if (!watchFlexy) return;

  state.watchObserver = new MutationObserver(() => onChange());
  state.watchObserver.observe(watchFlexy, {
    attributes: true,
    attributeFilter: ['class', 'theater'],
  });
}

function observeDom(): void {
  state.observer?.disconnect();
  state.watchObserver?.disconnect();
  state.watchObserver = null;
  state.watchObservedTarget = null;

  const debouncedApply = debounce(() => applyFeatureState(), 150);
  state.domRerun = debouncedApply;
  state.observer = new MutationObserver(() => debouncedApply());
  state.observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
  syncWatchObserver(debouncedApply);
}

function observeNavigation(): void {
  const rerun = debounce(() => applyFeatureState(), 120);
  const updateScrollUi = debounce(() => {
    updateDockedPlayer();
    updateScrollbarState();
  }, 40);
  const updateViewportUi = debounce(() => {
    updateViewportHeightVar();
    updateTheaterClass();
    updateMastheadTargets();
    updateLiveChatTargets();
    updateScrollbarState();
    updateDockedPlayer();
  }, 80);

  window.addEventListener('yt-navigate-finish', rerun, { passive: true });
  window.addEventListener('yt-page-data-updated', rerun, { passive: true });
  window.addEventListener('popstate', rerun, { passive: true });
  window.addEventListener('scroll', updateScrollUi, { passive: true });
  window.addEventListener('resize', updateViewportUi, { passive: true });
  window.visualViewport?.addEventListener('resize', updateViewportUi, { passive: true });
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
