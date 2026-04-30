import { expect, test } from '@playwright/test';

import {
  DEFAULT_SETTINGS as CONTENT_DEFAULT_SETTINGS,
  SETTING_KEYS,
  isFeatureEnabled,
  normalizeSettings,
  type Settings,
} from '../../src/content/settings';
import { DEFAULT_SETTINGS as SHARED_DEFAULT_SETTINGS } from '../../src/shared/settings';

test('content defaults stay aligned with shared settings defaults', () => {
  expect(CONTENT_DEFAULT_SETTINGS).toEqual(SHARED_DEFAULT_SETTINGS);
  expect(SETTING_KEYS).toEqual(Object.keys(CONTENT_DEFAULT_SETTINGS));
});

test('normalizeSettings accepts valid stored values and falls back for invalid values', () => {
  const settings = normalizeSettings({
    generalFeedColumns: 4,
    generalHideSponsoredPosts: false,
    generalHideShorts: 'false',
    theaterHideComments: true,
    defaultHideComments: 1,
    pipButton: false,
    floatingMiniPlayer: true,
  });

  expect(settings.generalFeedColumns).toBe(4);
  expect(settings.generalHideSponsoredPosts).toBe(false);
  expect(settings.generalHideShorts).toBe(CONTENT_DEFAULT_SETTINGS.generalHideShorts);
  expect(settings.theaterHideComments).toBe(true);
  expect(settings.defaultHideComments).toBe(CONTENT_DEFAULT_SETTINGS.defaultHideComments);
  expect(settings.pipButton).toBe(false);
  expect(settings.floatingMiniPlayer).toBe(false);
});

test('normalizeSettings rejects unsupported feed column counts', () => {
  for (const generalFeedColumns of [0, 1, 5, '3', null, undefined]) {
    expect(normalizeSettings({ generalFeedColumns }).generalFeedColumns).toBe(
      CONTENT_DEFAULT_SETTINGS.generalFeedColumns,
    );
  }

  for (const generalFeedColumns of [2, 3, 4]) {
    expect(normalizeSettings({ generalFeedColumns }).generalFeedColumns).toBe(generalFeedColumns);
  }
});

test('isFeatureEnabled preserves the PiP-controlled floating mini player compatibility alias', () => {
  const disabledPipSettings: Settings = {
    ...CONTENT_DEFAULT_SETTINGS,
    pipButton: false,
    floatingMiniPlayer: true,
  };
  const enabledPipSettings: Settings = {
    ...CONTENT_DEFAULT_SETTINGS,
    pipButton: true,
    floatingMiniPlayer: false,
  };

  expect(isFeatureEnabled(disabledPipSettings, 'floatingMiniPlayer')).toBe(false);
  expect(isFeatureEnabled(enabledPipSettings, 'floatingMiniPlayer')).toBe(true);
  expect(isFeatureEnabled(disabledPipSettings, 'generalHideSponsoredPosts')).toBe(
    disabledPipSettings.generalHideSponsoredPosts,
  );
});
