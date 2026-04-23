export type TopLevelTab = 'general' | 'sidebar' | 'modes';
export type ViewMode = 'theater' | 'default' | 'fullscreen';
export type FeedColumnCount = 2 | 3 | 4;

export type BooleanSettingKey =
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

export type SettingKey = BooleanSettingKey | 'generalFeedColumns';

export type Settings = Record<BooleanSettingKey, boolean> & {
  generalFeedColumns: FeedColumnCount;
};

export type SettingOption = {
  value: FeedColumnCount;
  label: string;
};

export type SettingDefinition = {
  key: SettingKey;
  label: string;
  description: string;
  topTab: TopLevelTab;
  viewMode?: ViewMode;
  parentKey?: BooleanSettingKey;
  kind?: 'toggle' | 'select';
  options?: SettingOption[];
};

export const DEFAULT_SETTINGS: Settings = {
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

export const SETTING_TABS: Array<{ id: TopLevelTab; label: string }> = [
  { id: 'general', label: 'General' },
  { id: 'sidebar', label: 'Sidebar' },
  { id: 'modes', label: 'Modes' },
];

export const VIEW_MODES: Array<{ id: ViewMode; label: string }> = [
  { id: 'theater', label: 'Theater' },
  { id: 'default', label: 'Default' },
  { id: 'fullscreen', label: 'Fullscreen' },
];

export const SETTING_DEFINITIONS: SettingDefinition[] = [
  {
    key: 'generalFeedColumns',
    label: 'Home Feed Columns',
    description: 'Controls the number of columns shown on the YouTube home feed.',
    topTab: 'general',
    kind: 'select',
    options: [
      { value: 2, label: '2 columns' },
      { value: 3, label: '3 columns' },
      { value: 4, label: '4 columns' },
    ],
  },
  {
    key: 'generalHideSponsoredPosts',
    label: 'Hide Sponsored Posts',
    description: 'Hides sponsored and promoted cards where they can be identified confidently.',
    topTab: 'general',
  },
  {
    key: 'generalHideShorts',
    label: 'Hide Shorts',
    description: 'Hides Shorts shelves, results, and recommendations while leaving the dedicated Shorts page available.',
    topTab: 'general',
  },
  {
    key: 'generalHideEndScreenCards',
    label: 'Hide End-Screen Cards',
    description: 'Hides YouTube end-screen overlays that appear over the video near the end.',
    topTab: 'general',
  },
  {
    key: 'pipButton',
    label: 'Restore PiP Button',
    description: 'Adds a Picture-in-Picture button to the YouTube player controls across supported watch modes.',
    topTab: 'general',
  },
  {
    key: 'floatingMiniPlayer',
    label: 'Floating Mini-Player',
    description: 'Docks the actual YouTube player in the corner when you scroll below it.',
    topTab: 'general',
    parentKey: 'pipButton',
  },
  {
    key: 'generalSidebarCleanup',
    label: 'Sidebar Cleanup',
    description: 'Cleans up the left sidebar, uses a simple Subscriptions icon row, keeps You expanded by default, trims extra clutter, and unlocks the cleanup toggles below.',
    topTab: 'sidebar',
  },
  {
    key: 'generalHideSidebar',
    label: 'Hide Entire Sidebar',
    description: 'Hides the main YouTube left navigation sidebar and mini guide.',
    topTab: 'sidebar',
    parentKey: 'generalSidebarCleanup',
  },
  {
    key: 'generalHideSidebarHome',
    label: 'Hide Home Link',
    description: 'Hides Home entries from the YouTube sidebar.',
    topTab: 'sidebar',
    parentKey: 'generalSidebarCleanup',
  },
  {
    key: 'generalHideSidebarShorts',
    label: 'Hide Shorts Link',
    description: 'Hides Shorts entries from the YouTube sidebar.',
    topTab: 'sidebar',
    parentKey: 'generalSidebarCleanup',
  },
  {
    key: 'generalHideSidebarSubscriptions',
    label: 'Hide Subscriptions',
    description: 'Hides the Subscriptions sidebar section.',
    topTab: 'sidebar',
    parentKey: 'generalSidebarCleanup',
  },
  {
    key: 'generalHideSidebarYou',
    label: 'Hide You',
    description: 'Hides You, Your channel, History, Playlists, and similar personal library entries from the sidebar.',
    topTab: 'sidebar',
    parentKey: 'generalSidebarCleanup',
  },
  {
    key: 'generalHideSidebarExplore',
    label: 'Hide Explore',
    description: 'Hides Explore and category entries from the YouTube sidebar.',
    topTab: 'sidebar',
    parentKey: 'generalSidebarCleanup',
  },
  {
    key: 'generalHideSidebarMoreFromYouTube',
    label: 'Hide More from YouTube',
    description: 'Hides YouTube Premium, YouTube TV, Kids, Music, and similar product links from the sidebar.',
    topTab: 'sidebar',
    parentKey: 'generalSidebarCleanup',
  },
  {
    key: 'generalHideSidebarReportHistory',
    label: 'Hide Report History',
    description: 'Hides the Report history sidebar link without tying it to the You section.',
    topTab: 'sidebar',
    parentKey: 'generalSidebarCleanup',
  },
  {
    key: 'generalHideSidebarFooter',
    label: 'Hide Sidebar Footer',
    description: 'Hides the About, Press, Copyright, Terms, Privacy, and related footer links in the sidebar.',
    topTab: 'sidebar',
    parentKey: 'generalSidebarCleanup',
  },
  {
    key: 'enhancedTheaterMode',
    label: 'Enhanced Theater Mode',
    description: 'Expands YouTube theater mode into a cleaner full-window viewing layout.',
    topTab: 'modes',
    viewMode: 'theater',
  },
  {
    key: 'theaterHideHeader',
    label: 'Hide Header',
    description: 'Hides the YouTube header while enhanced theater mode is active.',
    topTab: 'modes',
    viewMode: 'theater',
    parentKey: 'enhancedTheaterMode',
  },
  {
    key: 'theaterShowHeaderOnHover',
    label: 'Show Header on Hover',
    description: 'Reveals the hidden header when you hover near the top of the page.',
    topTab: 'modes',
    viewMode: 'theater',
    parentKey: 'theaterHideHeader',
  },
  {
    key: 'theaterHidePlayerUI',
    label: 'Hide Player UI',
    description: 'Hides player controls until you hover near the control bar.',
    topTab: 'modes',
    viewMode: 'theater',
    parentKey: 'enhancedTheaterMode',
  },
  {
    key: 'theaterHideScrollbarOnScroll',
    label: 'Hide Scrollbar on Scroll',
    description: 'Keeps the page scrollbar hidden in enhanced theater mode to prevent layout shift while scrolling.',
    topTab: 'modes',
    viewMode: 'theater',
    parentKey: 'enhancedTheaterMode',
  },
  {
    key: 'theaterHideRecommendations',
    label: 'Hide Recommendations',
    description: 'Hides the right-side recommendations column while enhanced theater mode is active.',
    topTab: 'modes',
    viewMode: 'theater',
    parentKey: 'enhancedTheaterMode',
  },
  {
    key: 'theaterHideComments',
    label: 'Hide Comments',
    description: 'Hides only the comments section while enhanced theater mode is active.',
    topTab: 'modes',
    viewMode: 'theater',
    parentKey: 'enhancedTheaterMode',
  },
  {
    key: 'theaterHideMetadata',
    label: 'Hide Metadata',
    description: 'Hides the title, channel row, actions, description, views, date, and other below-video metadata.',
    topTab: 'modes',
    viewMode: 'theater',
    parentKey: 'enhancedTheaterMode',
  },
  {
    key: 'theaterShowPrimaryMetadata',
    label: 'Show Title and Top Row',
    description: 'Keeps the video title, channel row, and action buttons visible while hiding the description and extra metadata.',
    topTab: 'modes',
    viewMode: 'theater',
    parentKey: 'theaterHideMetadata',
  },
  {
    key: 'theaterHideLiveChat',
    label: 'Hide Live Chat',
    description: 'Hides live chat while enhanced theater mode is active.',
    topTab: 'modes',
    viewMode: 'theater',
    parentKey: 'enhancedTheaterMode',
  },
  {
    key: 'theaterShowLiveChatOverlay',
    label: 'Show Chat Overlay',
    description: 'Shows live chat as a floating overlay on top of the video when chat exists.',
    topTab: 'modes',
    viewMode: 'theater',
    parentKey: 'theaterHideLiveChat',
  },
  {
    key: 'defaultHideRecommendations',
    label: 'Hide Recommendations',
    description: 'Hides recommendations in the normal watch-page view.',
    topTab: 'modes',
    viewMode: 'default',
  },
  {
    key: 'defaultHideComments',
    label: 'Hide Comments',
    description: 'Hides only the comments section in the normal watch-page view.',
    topTab: 'modes',
    viewMode: 'default',
  },
  {
    key: 'defaultHideMetadata',
    label: 'Hide Metadata',
    description: 'Hides the title, channel row, actions, description, views, date, and other below-video metadata.',
    topTab: 'modes',
    viewMode: 'default',
  },
  {
    key: 'defaultShowPrimaryMetadata',
    label: 'Show Title and Top Row',
    description: 'Keeps the video title, channel row, and action buttons visible while hiding the description and extra metadata.',
    topTab: 'modes',
    viewMode: 'default',
    parentKey: 'defaultHideMetadata',
  },
  {
    key: 'defaultHideLiveChat',
    label: 'Hide Live Chat',
    description: 'Hides live chat in the normal watch-page view.',
    topTab: 'modes',
    viewMode: 'default',
  },
  {
    key: 'fullscreenHideTitleOverlay',
    label: 'Hide Title Overlay',
    description: 'Keeps the fullscreen title hidden until the player controls are intentionally revealed.',
    topTab: 'modes',
    viewMode: 'fullscreen',
  },
  {
    key: 'fullscreenHidePlayerUI',
    label: 'Hide Player UI',
    description: 'Hides fullscreen player controls until you hover near the control bar.',
    topTab: 'modes',
    viewMode: 'fullscreen',
  },
  {
    key: 'fullscreenHideRecommendationOverlays',
    label: 'Hide More Videos Overlay',
    description: 'Hides the More videos button and similar recommendation overlays in native fullscreen.',
    topTab: 'modes',
    viewMode: 'fullscreen',
  },
  {
    key: 'fullscreenHideActionOverlay',
    label: 'Hide Action Overlay',
    description: 'Hides fullscreen overlays for comments, reactions, and related watch actions instead of showing them over the video.',
    topTab: 'modes',
    viewMode: 'fullscreen',
  },
];

export const SETTING_KEYS = Object.keys(DEFAULT_SETTINGS) as SettingKey[];

function isFeedColumnCount(value: unknown): value is FeedColumnCount {
  return value === 2 || value === 3 || value === 4;
}

export function normalizeSettings(items: Partial<Record<SettingKey, unknown>>): Settings {
  return SETTING_KEYS.reduce<Settings>(
    (settings, key) => {
      if (key === 'generalFeedColumns') {
        settings.generalFeedColumns = isFeedColumnCount(items.generalFeedColumns)
          ? items.generalFeedColumns
          : DEFAULT_SETTINGS.generalFeedColumns;
        return settings;
      }

      settings[key] = typeof items[key] === 'boolean' ? items[key] : DEFAULT_SETTINGS[key];
      return settings;
    },
    { ...DEFAULT_SETTINGS },
  );
}

export function loadSettings(): Promise<Settings> {
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

export function saveSettings(settings: Settings): Promise<void> {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.set(settings, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
        return;
      }

      resolve();
    });
  });
}
