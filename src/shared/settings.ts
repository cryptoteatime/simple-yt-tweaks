export type SettingTab = 'theater' | 'default';

export type SettingKey =
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

export type Settings = Record<SettingKey, boolean>;

export type SettingDefinition = {
  key: SettingKey;
  label: string;
  description: string;
  tab: SettingTab;
  parentKey?: SettingKey;
};

export const DEFAULT_SETTINGS: Settings = {
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

export const SETTING_TABS: Array<{ id: SettingTab; label: string }> = [
  { id: 'theater', label: 'Theater' },
  { id: 'default', label: 'Default' },
];

export const SETTING_DEFINITIONS: SettingDefinition[] = [
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
