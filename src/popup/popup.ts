import './popup.css';
import {
  DEFAULT_SETTINGS,
  SETTING_DEFINITIONS,
  type SettingKey,
  type Settings,
  loadSettings,
  saveSettings,
} from '../shared/settings';

const settingsEl = document.getElementById('settings');
const statusEl = document.getElementById('saveStatus');
const resetBtn = document.getElementById('resetBtn');

let statusTimer: number | undefined;

function requireElement<T extends HTMLElement>(element: T | null, name: string): T {
  if (!element) {
    throw new Error(`Missing popup element: ${name}`);
  }

  return element;
}

function setStatus(message: string): void {
  const status = requireElement(statusEl, 'saveStatus');
  status.textContent = message;
  window.clearTimeout(statusTimer);
  statusTimer = window.setTimeout(() => {
    status.textContent = 'Ready';
  }, 1400);
}

function getCheckbox(key: SettingKey): HTMLInputElement {
  return requireElement(document.getElementById(key) as HTMLInputElement | null, key);
}

function readFormSettings(): Settings {
  return SETTING_DEFINITIONS.reduce<Settings>(
    (settings, { key }) => {
      settings[key] = getCheckbox(key).checked;
      return settings;
    },
    { ...DEFAULT_SETTINGS },
  );
}

function renderSettings(settings: Settings): void {
  const container = requireElement(settingsEl, 'settings');
  container.textContent = '';

  for (const { key, label } of SETTING_DEFINITIONS) {
    const row = document.createElement('label');
    row.className = 'setting-row';

    const text = document.createElement('span');
    text.textContent = label;

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.id = key;
    input.checked = settings[key];
    input.addEventListener('change', async () => {
      try {
        await saveSettings(readFormSettings());
        setStatus('Saved');
      } catch (error) {
        console.error('Simple YT Tweaks save failed:', error);
        setStatus('Save failed');
      }
    });

    row.append(text, input);
    container.append(row);
  }
}

async function init(): Promise<void> {
  const settings = await loadSettings();
  renderSettings(settings);

  requireElement(resetBtn, 'resetBtn').addEventListener('click', async () => {
    try {
      await saveSettings(DEFAULT_SETTINGS);
      renderSettings(DEFAULT_SETTINGS);
      setStatus('Defaults restored');
    } catch (error) {
      console.error('Simple YT Tweaks reset failed:', error);
      setStatus('Reset failed');
    }
  });
}

init().catch((error) => {
  console.error('Simple YT Tweaks popup failed to initialize:', error);
  setStatus('Load failed');
});
