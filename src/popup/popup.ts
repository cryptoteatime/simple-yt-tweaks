import './popup.css';
import {
  DEFAULT_SETTINGS,
  SETTING_DEFINITIONS,
  SETTING_TABS,
  VIEW_MODES,
  type FeedColumnCount,
  type SettingDefinition,
  type SettingKey,
  type Settings,
  type TopLevelTab,
  type ViewMode,
  loadSettings,
  saveSettings,
} from '../shared/settings';
import packageJson from '../../package.json';

const settingsTabsEl = document.getElementById('settingsTabs');
const viewModesEl = document.getElementById('viewModes');
const settingsEl = document.getElementById('settings');
const resetBtn = document.getElementById('resetBtn');
const pageStatusDot = document.getElementById('pageStatusDot');
const versionLabel = document.getElementById('versionLabel');

let tooltipEl: HTMLDivElement | null = null;
let activeTopTab: TopLevelTab = 'general';
let activeViewMode: ViewMode = 'theater';
let currentSettings: Settings = { ...DEFAULT_SETTINGS };

function requireElement<T extends HTMLElement>(element: T | null, name: string): T {
  if (!element) {
    throw new Error(`Missing popup element: ${name}`);
  }

  return element;
}

function getDefinition(key: SettingKey): SettingDefinition | undefined {
  return SETTING_DEFINITIONS.find((item) => item.key === key);
}

function isSettingDisabled(key: SettingKey, settings: Settings): boolean {
  if (key === 'generalHideSidebarShorts' && settings.generalHideShorts) {
    return false;
  }

  const definition = getDefinition(key);
  if (!definition?.parentKey) return false;

  return !settings[definition.parentKey] || isSettingDisabled(definition.parentKey, settings);
}

function getSettingDepth(key: SettingKey): number {
  const definition = getDefinition(key);
  if (!definition?.parentKey) return 0;

  return getSettingDepth(definition.parentKey) + 1;
}

function matchesActivePane(definition: SettingDefinition): boolean {
  if (definition.topTab !== activeTopTab) return false;
  if (activeTopTab !== 'views') return true;

  return definition.viewMode === activeViewMode;
}

function getVisiblePaneDefaults(): Partial<Settings> {
  return SETTING_DEFINITIONS.reduce<Partial<Settings>>((defaults, definition) => {
    if (!matchesActivePane(definition)) return defaults;

    if (definition.key === 'generalFeedColumns') {
      defaults.generalFeedColumns = DEFAULT_SETTINGS.generalFeedColumns;
    } else {
      defaults[definition.key] = DEFAULT_SETTINGS[definition.key];
    }

    return defaults;
  }, {});
}

function renderTopTabs(): void {
  const container = requireElement(settingsTabsEl, 'settingsTabs');
  container.textContent = '';

  for (const tab of SETTING_TABS) {
    const button = document.createElement('button');
    button.className = 'settings-tab';
    button.type = 'button';
    button.textContent = tab.label;
    button.setAttribute('aria-selected', String(tab.id === activeTopTab));
    button.addEventListener('click', () => {
      activeTopTab = tab.id;
      renderTopTabs();
      renderViewModes();
      renderSettings(currentSettings);
    });
    container.append(button);
  }
}

function renderViewModes(): void {
  const container = requireElement(viewModesEl, 'viewModes');
  container.textContent = '';
  container.hidden = activeTopTab !== 'views';

  if (activeTopTab !== 'views') return;

  for (const mode of VIEW_MODES) {
    const button = document.createElement('button');
    button.className = 'settings-subtab';
    button.type = 'button';
    button.textContent = mode.label;
    button.setAttribute('aria-selected', String(mode.id === activeViewMode));
    button.addEventListener('click', () => {
      activeViewMode = mode.id;
      renderViewModes();
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

async function persistSettings(nextSettings: Settings): Promise<void> {
  await saveSettings(nextSettings);
  currentSettings = nextSettings;
  renderSettings(nextSettings);
}

function renderSettings(settings: Settings): void {
  const container = requireElement(settingsEl, 'settings');
  container.textContent = '';
  container.dataset.topTab = activeTopTab;
  container.dataset.viewMode = activeTopTab === 'views' ? activeViewMode : '';
  hideTooltip();

  for (const definition of SETTING_DEFINITIONS) {
    if (!matchesActivePane(definition)) continue;

    const { key, label, description, parentKey, kind = 'toggle', options } = definition;
    const row = document.createElement('div');
    row.className = 'setting-row';
    if (kind === 'select') row.classList.add('setting-row--select');
    const depth = getSettingDepth(key);
    if (parentKey) row.classList.add('setting-row--child', `setting-row--depth-${depth}`);

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
    help.textContent = '?';
    help.addEventListener('mouseenter', () => showTooltip(help, description));
    help.addEventListener('focus', () => showTooltip(help, description));
    help.addEventListener('mouseleave', hideTooltip);
    help.addEventListener('blur', hideTooltip);

    copy.append(labelEl, help);

    const control = document.createElement('div');
    control.className = 'setting-control';

    const isDisabled = isSettingDisabled(key, settings);

    if (kind === 'select' && options) {
      const text = document.createElement('span');
      text.className = 'setting-state';
      text.textContent = `${settings.generalFeedColumns}-col`;

      const select = document.createElement('select');
      select.className = 'setting-select';
      select.id = key;
      select.disabled = isDisabled;
      select.setAttribute('aria-describedby', `${key}-tip`);

      for (const option of options) {
        const optionEl = document.createElement('option');
        optionEl.value = String(option.value);
        optionEl.textContent = option.label;
        optionEl.selected = settings.generalFeedColumns === option.value;
        select.append(optionEl);
      }

      select.addEventListener('change', async () => {
        const nextSettings = {
          ...currentSettings,
          generalFeedColumns: Number(select.value) as FeedColumnCount,
        };

        try {
          await persistSettings(nextSettings);
        } catch (error) {
          console.error('Simple YT Tweaks save failed:', error);
        }
      });

      control.append(text, select);
    } else {
      const text = document.createElement('span');
      text.className = 'setting-state';
      text.textContent = settings[key] ? 'On' : 'Off';

      const input = document.createElement('input');
      input.type = 'checkbox';
      input.id = key;
      input.checked = settings[key] as boolean;
      input.disabled = isDisabled;
      input.setAttribute('aria-describedby', `${key}-tip`);
      input.addEventListener('change', async () => {
        const nextSettings = { ...currentSettings, [key]: input.checked };
        if (key === 'generalHideShorts' && input.checked) {
          nextSettings.generalSidebarCleanup = true;
          nextSettings.generalHideSidebarShorts = true;
        }

        try {
          await persistSettings(nextSettings);
        } catch (error) {
          console.error('Simple YT Tweaks save failed:', error);
        }
      });

      control.append(text, input);
    }

    row.append(copy, control);
    container.append(row);
  }
}

async function init(): Promise<void> {
  requireElement(versionLabel, 'versionLabel').textContent = `v${packageJson.version}`;

  await updatePageStatus();

  currentSettings = await loadSettings();
  renderTopTabs();
  renderViewModes();
  renderSettings(currentSettings);

  requireElement(resetBtn, 'resetBtn').addEventListener('click', async () => {
    try {
      const nextSettings = {
        ...currentSettings,
        ...getVisiblePaneDefaults(),
      };
      await persistSettings(nextSettings);
    } catch (error) {
      console.error('Simple YT Tweaks reset failed:', error);
    }
  });
}

init().catch((error) => {
  console.error('Simple YT Tweaks popup failed to initialize:', error);
});
