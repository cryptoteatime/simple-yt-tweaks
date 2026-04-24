export const SELECTORS = {
  masthead: '#masthead-container, ytd-masthead',
  mastheadTargets: '#masthead-container, ytd-masthead, ytd-masthead #container',
  watchFlexy: 'ytd-watch-flexy',
  player: '#movie_player',
  html5Video: 'video.html5-main-video',
  chromeControls: '.ytp-chrome-controls',
  chromeBottom: '.ytp-chrome-bottom',
  controlsRight: '.ytp-right-controls',
  overlaysContainer: '.ytp-overlays-container',
  overlayBottomRight: '.ytp-overlay-bottom-right',
  comments: '#comments',
  liveChat: '#chat, #chat-container, ytd-live-chat-frame',
} as const;

export const STYLE_ID = 'simple-yt-tweaks-style';
export const PIP_BUTTON_ID = 'simple-yt-tweaks-pip-button';
export const MINIPLAYER_PIP_BUTTON_ID = 'simple-yt-tweaks-miniplayer-pip-button';
export const FULLSCREEN_ACTION_DOCK_ID = 'simple-yt-tweaks-fullscreen-actions';
export const MASTHEAD_CLASS = 'simple-yt-tweaks-masthead';
export const LIVE_CHAT_CLASS = 'simple-yt-tweaks-live-chat';
export const GENERAL_HIDDEN_CLASS = 'simple-yt-tweaks-hidden';
export const SIDEBAR_SUBSCRIPTIONS_CLASS = 'simple-yt-tweaks-sidebar-subscriptions';
export const SIDEBAR_SUBSCRIPTIONS_ICON_CLASS = 'simple-yt-tweaks-sidebar-subscriptions-icon';
export const SIDEBAR_HOME_NEUTRAL_CLASS = 'simple-yt-tweaks-sidebar-home-neutral';
export const THEATER_PRIMARY_METADATA_CLASS = 'simple-yt-tweaks-theater-primary-metadata';
export const FULLSCREEN_ACTION_TARGET_CLASS = 'simple-yt-tweaks-fullscreen-action-target';

export const SPONSORED_CARD_SELECTORS = [
  'ytd-display-ad-renderer',
  'ytd-promoted-sparkles-web-renderer',
  'ytd-ad-slot-renderer',
  'ytd-in-feed-ad-layout-renderer',
  'ytd-banner-promo-renderer',
  'ytd-search-pyv-renderer',
  'ytd-companion-slot-renderer',
  'ytm-promoted-sparkles-web-renderer',
] as const;

export const SIDEBAR_ITEM_LABELS = {
  home: ['home'],
  shorts: ['shorts'],
  subscriptions: ['subscriptions'],
  you: ['you', 'your channel', 'history', 'playlists', 'your videos', 'downloads', 'watch later', 'liked videos'],
  explore: ['explore', 'trending', 'shopping', 'music', 'movies', 'movies & tv', 'live', 'gaming', 'news', 'sports', 'learning', 'fashion & beauty', 'podcasts'],
  moreFromYouTube: ['more from youtube', 'youtube premium', 'youtube studio', 'youtube music', 'youtube kids', 'youtube tv'],
  reportHistory: ['report history'],
} as const;

export const SUBSCRIPTIONS_ICON_SVG = `
  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" focusable="false" aria-hidden="true" style="pointer-events: none; display: inherit; width: 100%; height: 100%;">
    <path d="M18 1H6a2 2 0 00-2 2h16a2 2 0 00-2-2Zm3 4H3a2 2 0 00-2 2v13a2 2 0 002 2h18a2 2 0 002-2V7a2 2 0 00-2-2ZM3 20V7h18v13H3Zm13-6.5L10 10v7l6-3.5Z"></path>
  </svg>
`;
