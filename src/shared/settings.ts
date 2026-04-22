export type SettingKey =
  | 'enhancedTheaterMode'
  | 'hideHeaderInTheater'
  | 'autoHideUI'
  | 'pipButton'
  | 'floatingMiniPlayer';

export type Settings = Record<SettingKey, boolean>;

export const DEFAULT_SETTINGS: Settings = {
  enhancedTheaterMode: true,
  hideHeaderInTheater: true,
  autoHideUI: true,
  pipButton: true,
  floatingMiniPlayer: true,
};

export const SETTING_DEFINITIONS: Array<{ key: SettingKey; label: string }> = [
  { key: 'enhancedTheaterMode', label: 'Enhanced Theater Mode' },
  { key: 'hideHeaderInTheater', label: 'Hide Header in Theater Mode' },
  { key: 'autoHideUI', label: 'Auto-Hide Player UI' },
  { key: 'pipButton', label: 'Restore PiP Button' },
  { key: 'floatingMiniPlayer', label: 'Floating Mini Player' },
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
