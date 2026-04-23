export type SettingTab = 'general' | 'theater' | 'default';

export type SettingKey =
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
  | 'pipButton'
  | 'floatingMiniPlayer';

export type Settings = Record<SettingKey, boolean>;

export type SettingDefinition = {
  key: SettingKey;
  label: string;
  description: string;
  tab: SettingTab;
  parentKey?: SettingKey;
};

export const DEFAULT_SETTINGS: Settings = {
  generalHideEndScreenCards: true,
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
  pipButton: true,
  floatingMiniPlayer: true,
};

export const SETTING_TABS: Array<{ id: SettingTab; label: string }> = [
  { id: 'general', label: 'General' },
  { id: 'theater', label: 'Theater View' },
  { id: 'default', label: 'Default View' },
];

export const SETTING_DEFINITIONS: SettingDefinition[] = [
  {
    key: 'generalHideEndScreenCards',
    label: 'Hide End-Screen Cards',
    description: 'Hides YouTube end-screen overlays that appear over the video near the end.',
    tab: 'general',
  },
  {
    key: 'generalHideShorts',
    label: 'Hide Shorts',
    description: 'Hides Shorts shelves, results, and recommendations while leaving the dedicated Shorts page available.',
    tab: 'general',
  },
  {
    key: 'generalSidebarCleanup',
    label: 'Sidebar Cleanup',
    description: 'Enables left sidebar cleanup options for YouTube navigation.',
    tab: 'general',
  },
  {
    key: 'generalHideSidebar',
    label: 'Hide Entire Sidebar',
    description: 'Hides the main YouTube left navigation sidebar and mini guide.',
    tab: 'general',
    parentKey: 'generalSidebarCleanup',
  },
  {
    key: 'generalHideSidebarHome',
    label: 'Hide Home Link',
    description: 'Hides Home entries from the YouTube sidebar.',
    tab: 'general',
    parentKey: 'generalSidebarCleanup',
  },
  {
    key: 'generalHideSidebarShorts',
    label: 'Hide Shorts Link',
    description: 'Hides Shorts entries from the YouTube sidebar.',
    tab: 'general',
    parentKey: 'generalSidebarCleanup',
  },
  {
    key: 'generalHideSidebarSubscriptions',
    label: 'Hide Subscriptions',
    description: 'Hides the Subscriptions sidebar section, including channel shortcuts and show-more controls.',
    tab: 'general',
    parentKey: 'generalSidebarCleanup',
  },
  {
    key: 'generalHideSidebarYou',
    label: 'Hide You',
    description: 'Hides You, Your channel, History, Playlists, and similar personal library entries from the sidebar.',
    tab: 'general',
    parentKey: 'generalSidebarCleanup',
  },
  {
    key: 'generalHideSidebarExplore',
    label: 'Hide Explore',
    description: 'Hides Explore and category entries from the YouTube sidebar.',
    tab: 'general',
    parentKey: 'generalSidebarCleanup',
  },
  {
    key: 'generalHideSidebarMoreFromYouTube',
    label: 'Hide More from YouTube',
    description: 'Hides YouTube Premium, YouTube TV, Kids, Music, and similar product links from the sidebar.',
    tab: 'general',
    parentKey: 'generalSidebarCleanup',
  },
  {
    key: 'generalHideSidebarReportHistory',
    label: 'Hide Report History',
    description: 'Hides the Report history sidebar link without tying it to the You section.',
    tab: 'general',
    parentKey: 'generalSidebarCleanup',
  },
  {
    key: 'generalHideSidebarFooter',
    label: 'Hide Sidebar Footer',
    description: 'Hides the About, Press, Copyright, Terms, Privacy, and related footer links in the sidebar.',
    tab: 'general',
    parentKey: 'generalSidebarCleanup',
  },
  {
    key: 'enhancedTheaterMode',
    label: 'Enhanced Theater Mode',
    description: 'Expands YouTube theater mode into a cleaner full-window viewing layout.',
    tab: 'theater',
  },
  {
    key: 'theaterHideHeader',
    label: 'Hide Header',
    description: 'Hides the YouTube header while enhanced theater mode is active.',
    tab: 'theater',
    parentKey: 'enhancedTheaterMode',
  },
  {
    key: 'theaterShowHeaderOnHover',
    label: 'Show Header on Hover',
    description: 'Reveals the hidden header when you hover near the top of the page.',
    tab: 'theater',
    parentKey: 'theaterHideHeader',
  },
  {
    key: 'theaterHidePlayerUI',
    label: 'Hide Player UI',
    description: 'Hides player controls until you hover near the control bar.',
    tab: 'theater',
    parentKey: 'enhancedTheaterMode',
  },
  {
    key: 'theaterHideScrollbarOnScroll',
    label: 'Hide Scrollbar on Scroll',
    description: 'Keeps the page scrollbar hidden in enhanced theater mode to prevent layout shift while scrolling.',
    tab: 'theater',
    parentKey: 'enhancedTheaterMode',
  },
  {
    key: 'theaterHideRecommendations',
    label: 'Hide Recommendations',
    description: 'Hides the right-side recommendations column while enhanced theater mode is active.',
    tab: 'theater',
    parentKey: 'enhancedTheaterMode',
  },
  {
    key: 'theaterHideComments',
    label: 'Hide Comments',
    description: 'Hides only the comments section while enhanced theater mode is active.',
    tab: 'theater',
    parentKey: 'enhancedTheaterMode',
  },
  {
    key: 'theaterHideMetadata',
    label: 'Hide Metadata',
    description: 'Hides the title, channel row, actions, description, views, date, and other below-video metadata.',
    tab: 'theater',
    parentKey: 'enhancedTheaterMode',
  },
  {
    key: 'theaterShowPrimaryMetadata',
    label: 'Show Title and Top Row',
    description: 'Keeps the video title, channel row, and action buttons visible while hiding the description and extra metadata.',
    tab: 'theater',
    parentKey: 'theaterHideMetadata',
  },
  {
    key: 'theaterHideLiveChat',
    label: 'Hide Live Chat',
    description: 'Hides live chat while enhanced theater mode is active.',
    tab: 'theater',
    parentKey: 'enhancedTheaterMode',
  },
  {
    key: 'theaterShowLiveChatOverlay',
    label: 'Show Chat Overlay',
    description: 'Shows live chat as a floating overlay on top of the video when chat exists.',
    tab: 'theater',
    parentKey: 'theaterHideLiveChat',
  },
  {
    key: 'defaultHideRecommendations',
    label: 'Hide Recommendations',
    description: 'Hides recommendations in the normal watch-page view.',
    tab: 'default',
  },
  {
    key: 'defaultHideComments',
    label: 'Hide Comments',
    description: 'Hides only the comments section in the normal watch-page view.',
    tab: 'default',
  },
  {
    key: 'defaultHideMetadata',
    label: 'Hide Metadata',
    description: 'Hides the title, channel row, actions, description, views, date, and other below-video metadata.',
    tab: 'default',
  },
  {
    key: 'defaultShowPrimaryMetadata',
    label: 'Show Title and Top Row',
    description: 'Keeps the video title, channel row, and action buttons visible while hiding the description and extra metadata.',
    tab: 'default',
    parentKey: 'defaultHideMetadata',
  },
  {
    key: 'defaultHideLiveChat',
    label: 'Hide Live Chat',
    description: 'Hides live chat in the normal watch-page view.',
    tab: 'default',
  },
  {
    key: 'pipButton',
    label: 'Restore PiP Button',
    description: 'Adds a Picture-in-Picture button to the YouTube player controls.',
    tab: 'default',
  },
  {
    key: 'floatingMiniPlayer',
    label: 'Floating Mini-Player',
    description: 'Docks the actual YouTube player in the corner when you scroll below it.',
    tab: 'default',
    parentKey: 'pipButton',
  },
];

export const SETTING_KEYS = SETTING_DEFINITIONS.map(({ key }) => key);

export function normalizeSettings(items: Partial<Record<SettingKey, unknown>>): Settings {
  return SETTING_KEYS.reduce<Settings>(
    (settings, key) => {
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
