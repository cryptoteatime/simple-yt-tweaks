import { debounce, getVideo } from './dom';
import { SETTING_KEYS, normalizeSettings, type BooleanSettingKey, type SettingKey } from './settings';
import { state } from './state';

let videoBindIntervalId: number | null = null;

export function updateViewportHeightVar(): void {
  const height = Math.round(window.visualViewport?.height ?? window.innerHeight);
  document.documentElement.style.setProperty('--simple-yt-tweaks-vh', `${height}px`);
}

export function scheduleModeStabilization(onStabilize: () => void): void {
  for (const timer of state.modeTransitionTimers) {
    window.clearTimeout(timer);
  }

  state.modeTransitionTimers = [80, 220, 520].map((delay) =>
    window.setTimeout(() => onStabilize(), delay),
  );
}

export function bindPointerHandlers(handlers: {
  updateTopHoverState: (pointerY: number) => void;
  updatePlayerUiHoverState: (pointerX: number, pointerY: number) => void;
  clearStaleSidebarItemFocus: () => void;
  updateSidebarHomeSelectionState: () => void;
  updatePlayerUiFocusState: () => void;
}): void {
  if (state.pointerHandlersBound) return;
  state.pointerHandlersBound = true;

  document.addEventListener(
    'mousemove',
    (event) => {
      state.lastPointerX = event.clientX;
      state.lastPointerY = event.clientY;
      handlers.updateTopHoverState(event.clientY);
      handlers.updatePlayerUiHoverState(event.clientX, event.clientY);
      handlers.clearStaleSidebarItemFocus();
      handlers.updateSidebarHomeSelectionState();
    },
    { passive: true },
  );

  document.addEventListener(
    'mouseleave',
    () => {
      state.lastPointerX = Number.POSITIVE_INFINITY;
      state.lastPointerY = Number.POSITIVE_INFINITY;
      document.body.classList.remove('simple-yt-tweaks-top-hover');
      document.body.classList.remove('simple-yt-tweaks-player-ui-hover');
      handlers.updateSidebarHomeSelectionState();
    },
    { passive: true },
  );

  document.addEventListener('focusin', () => handlers.updatePlayerUiFocusState(), { passive: true });
  document.addEventListener('focusout', () => {
    window.setTimeout(() => handlers.updatePlayerUiFocusState(), 0);
  });

  window.addEventListener(
    'blur',
    () => {
      document.body.classList.remove('simple-yt-tweaks-player-ui-hover');
      document.body.classList.remove('simple-yt-tweaks-player-ui-focus');
    },
    { passive: true },
  );
}

export function bindStorageObserver(onChange: () => void): void {
  if (state.storageObserverBound) return;
  state.storageObserverBound = true;

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== 'sync') return;

    let touched = false;
    for (const key of SETTING_KEYS) {
      const change = changes[key as SettingKey];
      if (!change) continue;

      if (
        key === 'generalFeedColumns' &&
        (change.newValue === 2 || change.newValue === 3 || change.newValue === 4)
      ) {
        state.settings.generalFeedColumns = change.newValue;
        touched = true;
        continue;
      }

      if (typeof change.newValue === 'boolean') {
        state.settings[key as BooleanSettingKey] = change.newValue;
        touched = true;
      }
    }

    if (touched) {
      state.settings = normalizeSettings(state.settings);
      onChange();
    }
  });
}

export function syncWatchObserver(onChange: () => void): void {
  const watchFlexy = document.querySelector<HTMLElement>('ytd-watch-flexy');
  if (watchFlexy === state.watchObservedTarget) return;

  state.watchObserver?.disconnect();
  state.watchObserver = null;
  state.watchObservedTarget = watchFlexy;

  if (!watchFlexy) return;

  state.watchObserver = new MutationObserver(() => onChange());
  state.watchObserver.observe(watchFlexy, {
    attributes: true,
    attributeFilter: ['class', 'theater'],
  });
}

export function observeDom(onChange: () => void): void {
  state.observer?.disconnect();
  state.watchObserver?.disconnect();
  state.watchObserver = null;
  state.watchObservedTarget = null;

  const debouncedApply = debounce(() => onChange(), 150);
  state.domRerun = debouncedApply;
  state.observer = new MutationObserver(() => debouncedApply());
  state.observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
  syncWatchObserver(debouncedApply);
}

export function observeNavigation(handlers: {
  rerun: () => void;
  onScrollUi: () => void;
  onViewportUi: () => void;
}): void {
  const rerun = debounce(handlers.rerun, 120);
  const updateScrollUi = debounce(handlers.onScrollUi, 40);
  const updateViewportUi = debounce(handlers.onViewportUi, 80);

  window.addEventListener('yt-navigate-finish', rerun, { passive: true });
  window.addEventListener('yt-page-data-updated', rerun, { passive: true });
  window.addEventListener('popstate', rerun, { passive: true });
  document.addEventListener('fullscreenchange', rerun);
  window.addEventListener('scroll', updateScrollUi, { passive: true });
  window.addEventListener('resize', updateViewportUi, { passive: true });
  window.visualViewport?.addEventListener('resize', updateViewportUi, { passive: true });
}

export function bindRuntimeMessages(): void {
  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message?.type !== 'SIMPLE_YT_TWEAKS_PING') return false;

    sendResponse({ ok: true });
    return false;
  });
}

export function bindVideoEvents(onPipChange: () => void): void {
  const attach = () => {
    const video = getVideo();
    if (!video || video.dataset.simpleYtTweaksBound === '1') return;

    video.dataset.simpleYtTweaksBound = '1';
    video.addEventListener('enterpictureinpicture', onPipChange, { passive: true });
    video.addEventListener('leavepictureinpicture', onPipChange, { passive: true });
  };

  attach();
  if (videoBindIntervalId === null) {
    videoBindIntervalId = window.setInterval(attach, 2000);
  }
}
