export {
  type BooleanSettingKey,
  type FeedColumnCount,
  type SettingKey,
  type Settings,
} from '../shared/settings';

import type { BooleanSettingKey, FeedColumnCount, SettingKey, Settings } from '../shared/settings';

export const DEFAULT_SETTINGS: Settings = {
  generalHideSponsoredPosts: true,
  generalHideEndScreenCards: true,
  generalFeedColumns: 3,
  generalHideShorts: true,
  generalApplyFeedColumnsToSearch: true,
  generalStickyPlayer: true,
  generalSidebarCleanup: true,
  generalHideSidebar: false,
  generalHideSidebarHome: false,
  generalHideSidebarShorts: true,
  generalHideSidebarSubscriptions: false,
  generalHideSidebarYou: false,
  generalHideSidebarExplore: true,
  generalHideSidebarMoreFromYouTube: true,
  generalHideSidebarReportHistory: false,
  generalHideSidebarFooter: true,
  enhancedTheaterMode: true,
  theaterHideHeader: true,
  theaterShowHeaderOnHover: true,
  theaterHidePlayerUI: true,
  theaterHideScrollbarOnScroll: true,
  theaterHideRecommendations: true,
  theaterRecommendedHoverGrow: true,
  theaterHideComments: false,
  theaterHideMetadata: true,
  theaterShowPrimaryMetadata: true,
  theaterHideLiveChat: true,
  theaterShowLiveChatOverlay: false,
  defaultHideRecommendations: false,
  defaultRecommendedHoverGrow: true,
  defaultHideComments: false,
  defaultHideMetadata: true,
  defaultShowPrimaryMetadata: true,
  defaultHideLiveChat: false,
  fullscreenHideTitleOverlay: true,
  fullscreenHidePlayerUI: true,
  fullscreenHideRecommendationOverlays: true,
  fullscreenHideActionOverlay: true,
  pipButton: true,
  floatingMiniPlayer: true,
};

export const SETTING_KEYS = Object.keys(DEFAULT_SETTINGS) as SettingKey[];

function isFeedColumnCount(value: unknown): value is FeedColumnCount {
  return value === 2 || value === 3 || value === 4;
}

export function normalizeSettings(items: Partial<Record<SettingKey, unknown>>): Settings {
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

  settings.floatingMiniPlayer = settings.pipButton;
  return settings;
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

export function isFeatureEnabled(settings: Settings, key: BooleanSettingKey): boolean {
  if (key === 'floatingMiniPlayer') {
    return settings.pipButton;
  }

  return settings[key];
}
