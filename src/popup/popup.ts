import './popup.css';
import {
  DEFAULT_SETTINGS,
  SETTING_DEFINITIONS,
  SETTING_TABS,
  type SettingKey,
  type SettingTab,
  type Settings,
  loadSettings,
  saveSettings,
} from '../shared/settings';
import packageJson from '../../package.json';

const settingsTabsEl = document.getElementById('settingsTabs');
const settingsEl = document.getElementById('settings');
const resetBtn = document.getElementById('resetBtn');
const pageStatusDot = document.getElementById('pageStatusDot');
const versionLabel = document.getElementById('versionLabel');

let tooltipEl: HTMLDivElement | null = null;
let activeTab: SettingTab = 'theater';
let currentSettings: Settings = { ...DEFAULT_SETTINGS };

function requireElement<T extends HTMLElement>(element: T | null, name: string): T {
  if (!element) {
    throw new Error(`Missing popup element: ${name}`);
  }

  return element;
}

function isSettingDisabled(key: SettingKey, settings: Settings): boolean {
  const definition = SETTING_DEFINITIONS.find((item) => item.key === key);
  if (!definition?.parentKey) return false;

  return !settings[definition.parentKey] || isSettingDisabled(definition.parentKey, settings);
}

function renderTabs(): void {
  const container = requireElement(settingsTabsEl, 'settingsTabs');
  container.textContent = '';

  for (const tab of SETTING_TABS) {
    const button = document.createElement('button');
    button.className = 'settings-tab';
    button.type = 'button';
    button.textContent = tab.label;
    button.setAttribute('aria-selected', String(tab.id === activeTab));
    button.addEventListener('click', () => {
      activeTab = tab.id;
      renderTabs();
      renderSettings(currentSettings);
    });
    container.append(button);
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function ensureTooltip(): HTMLDivElement {
  if (tooltipEl) return tooltipEl;

  tooltipEl = document.createElement('div');
  tooltipEl.id = 'settingsTooltip';
  tooltipEl.className = 'settings-tooltip';
  tooltipEl.setAttribute('role', 'tooltip');
  document.body.append(tooltipEl);
  return tooltipEl;
}

function showTooltip(target: HTMLElement, message: string): void {
  const tooltip = ensureTooltip();
  tooltip.textContent = message;
  tooltip.classList.add('is-visible');

  const margin = 12;
  const targetRect = target.getBoundingClientRect();
  const tooltipRect = tooltip.getBoundingClientRect();
  const preferredLeft = targetRect.left + targetRect.width / 2 - tooltipRect.width / 2;
  const left = clamp(preferredLeft, margin, window.innerWidth - tooltipRect.width - margin);
  let top = targetRect.bottom + 8;

  if (top + tooltipRect.height > window.innerHeight - margin) {
    top = targetRect.top - tooltipRect.height - 8;
  }

  tooltip.style.setProperty(
    '--tooltip-arrow-left',
    `${clamp(targetRect.left + targetRect.width / 2 - left, 14, tooltipRect.width - 14)}px`,
  );
  tooltip.style.left = `${left}px`;
  tooltip.style.top = `${clamp(top, margin, window.innerHeight - tooltipRect.height - margin)}px`;
}

function hideTooltip(): void {
  tooltipEl?.classList.remove('is-visible');
}

async function updatePageStatus(): Promise<void> {
  const dot = requireElement(pageStatusDot, 'pageStatusDot');

  chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    if (chrome.runtime.lastError || !tab?.id) {
      dot.dataset.status = 'inactive';
      dot.setAttribute('aria-label', 'Simple YT Tweaks cannot run on this page');
      return;
    }

    chrome.tabs.sendMessage(tab.id, { type: 'SIMPLE_YT_TWEAKS_PING' }, (response) => {
      const isSupported = !chrome.runtime.lastError && response?.ok === true;
      dot.dataset.status = isSupported ? 'active' : 'inactive';
      dot.setAttribute(
        'aria-label',
        isSupported ? 'Simple YT Tweaks is active on this page' : 'Simple YT Tweaks cannot run on this page',
      );
    });
  });
}

function renderSettings(settings: Settings): void {
  const container = requireElement(settingsEl, 'settings');
  container.textContent = '';
  hideTooltip();

  for (const { key, label, description, parentKey, tab } of SETTING_DEFINITIONS) {
    if (tab !== activeTab) continue;

    const row = document.createElement('div');
    row.className = 'setting-row';
    if (parentKey) row.classList.add('setting-row--child');

    const copy = document.createElement('div');
    copy.className = 'setting-copy';

    const labelEl = document.createElement('label');
    labelEl.className = 'setting-label';
    labelEl.htmlFor = key;
    labelEl.title = description;
    labelEl.textContent = label;

    const help = document.createElement('button');
    help.className = 'help-btn';
    help.type = 'button';
    help.id = `${key}-tip`;
    help.setAttribute('aria-label', `${label}: ${description}`);
    help.setAttribute('aria-describedby', 'settingsTooltip');
    help.dataset.tooltip = description;
    help.textContent = '?';
    help.addEventListener('mouseenter', () => showTooltip(help, description));
    help.addEventListener('focus', () => showTooltip(help, description));
    help.addEventListener('mouseleave', hideTooltip);
    help.addEventListener('blur', hideTooltip);

    copy.append(labelEl, help);

    const control = document.createElement('div');
    control.className = 'setting-control';

    const isDisabled = isSettingDisabled(key, settings);
    const text = document.createElement('span');
    text.className = 'setting-state';
    text.textContent = isDisabled ? 'Off' : settings[key] ? 'On' : 'Off';

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.id = key;
    input.checked = isDisabled ? false : settings[key];
    input.disabled = isDisabled;
    input.setAttribute('aria-describedby', `${key}-tip`);
    input.addEventListener('change', async () => {
      const nextSettings = { ...currentSettings, [key]: input.checked };
      try {
        await saveSettings(nextSettings);
        currentSettings = nextSettings;
        renderSettings(nextSettings);
      } catch (error) {
        console.error('Simple YT Tweaks save failed:', error);
      }
    });

    control.append(text, input);
    row.append(copy, control);
    container.append(row);
  }
}

async function init(): Promise<void> {
  requireElement(versionLabel, 'versionLabel').textContent = `v${packageJson.version}`;

  await updatePageStatus();

  currentSettings = await loadSettings();
  renderTabs();
  renderSettings(currentSettings);

  requireElement(resetBtn, 'resetBtn').addEventListener('click', async () => {
    try {
      await saveSettings(DEFAULT_SETTINGS);
      currentSettings = { ...DEFAULT_SETTINGS };
      renderSettings(DEFAULT_SETTINGS);
    } catch (error) {
      console.error('Simple YT Tweaks reset failed:', error);
    }
  });
}

init().catch((error) => {
  console.error('Simple YT Tweaks popup failed to initialize:', error);
});
