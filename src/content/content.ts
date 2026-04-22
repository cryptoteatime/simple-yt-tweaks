type SettingKey =
  | 'enhancedTheaterMode'
  | 'hideHeaderInTheater'
  | 'autoHideUI'
  | 'pipButton'
  | 'floatingMiniPlayer';

type Settings = Record<SettingKey, boolean>;

type DockState = {
  target: HTMLElement;
  originalParent: Node;
  originalNextSibling: ChildNode | null;
  placeholder: HTMLElement;
  shell: HTMLElement;
};

const DEFAULT_SETTINGS: Settings = {
  enhancedTheaterMode: true,
  hideHeaderInTheater: true,
  autoHideUI: true,
  pipButton: true,
  floatingMiniPlayer: true,
};

const SETTING_KEYS = Object.keys(DEFAULT_SETTINGS) as SettingKey[];

const SELECTORS = {
  masthead: '#masthead-container, ytd-masthead',
  guide: '#guide, ytd-guide-renderer, #guide-content',
  watchFlexy: 'ytd-watch-flexy',
  player: '#movie_player',
  html5Video: 'video.html5-main-video',
  controlsRight: '.ytp-right-controls',
  comments: '#comments',
  playerContainer: '#player, #player-container, #player-container-inner',
  dockTarget: '#player-container-inner, #player-container, #player',
};

const STYLE_ID = 'simple-yt-tweaks-style';
const PIP_BUTTON_ID = 'simple-yt-tweaks-pip-button';
const DOCK_ID = 'simple-yt-tweaks-dock';

const state: {
  settings: Settings;
  currentUrl: string;
  idleTimer: number | undefined;
  observer: MutationObserver | null;
  dock: DockState | null;
  miniPlayerDismissed: boolean;
  storageObserverBound: boolean;
  activityHandlersBound: boolean;
} = {
  settings: { ...DEFAULT_SETTINGS },
  currentUrl: location.href,
  idleTimer: undefined,
  observer: null,
  dock: null,
  miniPlayerDismissed: false,
  storageObserverBound: false,
  activityHandlersBound: false,
};

function loadSettings(): Promise<Settings> {
  return new Promise((resolve) => {
    chrome.storage.sync.get(DEFAULT_SETTINGS, (items) => {
      if (chrome.runtime.lastError) {
        console.warn('Simple YT Tweaks settings load failed:', chrome.runtime.lastError);
        resolve({ ...DEFAULT_SETTINGS });
        return;
      }

      const settings = SETTING_KEYS.reduce<Settings>(
        (normalized, key) => {
          normalized[key] = typeof items[key] === 'boolean' ? items[key] : DEFAULT_SETTINGS[key];
          return normalized;
        },
        { ...DEFAULT_SETTINGS },
      );

      resolve(settings);
    });
  });
}

function debounce<TArgs extends unknown[]>(fn: (...args: TArgs) => void, wait = 120): (...args: TArgs) => void {
  let timer: number | undefined;

  return (...args: TArgs) => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => fn(...args), wait);
  };
}

function query<T extends Element = Element>(selector: string, root: ParentNode = document): T | null {
  try {
    return root.querySelector<T>(selector);
  } catch {
    return null;
  }
}

function getVideo(): HTMLVideoElement | null {
  return query<HTMLVideoElement>(SELECTORS.html5Video);
}

function getPlayer(): HTMLElement | null {
  return query<HTMLElement>(SELECTORS.player);
}

function isWatchPage(): boolean {
  return location.pathname === '/watch';
}

function isTheaterMode(): boolean {
  const watchFlexy = query<HTMLElement>(SELECTORS.watchFlexy);
  const player = getPlayer();

  return Boolean(
    watchFlexy?.hasAttribute('theater') ||
      watchFlexy?.classList.contains('theater') ||
      player?.classList.contains('ytp-size-button-expanded') ||
      document.querySelector('ytd-watch-flexy[theater]'),
  );
}

function buildCss(): string {
  const enhancedTheater = state.settings.enhancedTheaterMode;
  const hideHeader = state.settings.hideHeaderInTheater;
  const autoHide = state.settings.autoHideUI;

  return `
    body.simple-yt-tweaks-active .simple-yt-tweaks-pip-btn.ytp-button {
      display: inline-flex !important;
      align-items: center;
      justify-content: center;
    }

    body.simple-yt-tweaks-active .simple-yt-tweaks-pip-btn svg {
      width: 24px;
      height: 24px;
      fill: currentColor;
    }

    #${DOCK_ID} {
      position: fixed;
      right: 16px;
      bottom: 16px;
      width: min(420px, calc(100vw - 32px));
      aspect-ratio: 16 / 9;
      z-index: 2147483645;
      display: none;
      overflow: hidden;
      border-radius: 8px;
      background: #000;
      box-shadow: 0 14px 38px rgba(0, 0, 0, 0.42);
    }

    #${DOCK_ID}.is-visible {
      display: block;
    }

    #${DOCK_ID} .simple-yt-tweaks-dock-actions {
      position: absolute;
      top: 8px;
      right: 8px;
      z-index: 3;
      display: flex;
      gap: 8px;
      opacity: 0;
      transition: opacity 0.16s ease;
    }

    #${DOCK_ID}:hover .simple-yt-tweaks-dock-actions,
    #${DOCK_ID}:focus-within .simple-yt-tweaks-dock-actions {
      opacity: 1;
    }

    #${DOCK_ID} .simple-yt-tweaks-dock-btn {
      width: 32px;
      height: 32px;
      border: 0;
      border-radius: 999px;
      background: rgba(20, 20, 20, 0.86);
      color: #fff;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.35);
    }

    #${DOCK_ID} .simple-yt-tweaks-dock-body,
    #${DOCK_ID} .simple-yt-tweaks-docked-target {
      width: 100% !important;
      height: 100% !important;
    }

    #${DOCK_ID} .simple-yt-tweaks-docked-target #movie_player,
    #${DOCK_ID} .simple-yt-tweaks-docked-target .html5-video-container,
    #${DOCK_ID} .simple-yt-tweaks-docked-target video.html5-main-video {
      width: 100% !important;
      height: 100% !important;
    }

    .simple-yt-tweaks-player-placeholder {
      width: 100%;
      min-height: 220px;
      background: transparent;
    }

    ${enhancedTheater ? `
    body.simple-yt-tweaks-theater #page-manager,
    body.simple-yt-tweaks-theater ytd-watch-flexy,
    body.simple-yt-tweaks-theater #columns,
    body.simple-yt-tweaks-theater #primary {
      max-width: 100% !important;
      width: 100% !important;
    }

    body.simple-yt-tweaks-theater #secondary,
    body.simple-yt-tweaks-theater #related,
    body.simple-yt-tweaks-theater ytd-watch-next-secondary-results-renderer,
    body.simple-yt-tweaks-theater #below,
    body.simple-yt-tweaks-theater #meta,
    body.simple-yt-tweaks-theater #comments {
      display: none !important;
    }

    body.simple-yt-tweaks-theater #player-container-outer,
    body.simple-yt-tweaks-theater #full-bleed-container,
    body.simple-yt-tweaks-theater #player-full-bleed-container,
    body.simple-yt-tweaks-theater #player,
    body.simple-yt-tweaks-theater #movie_player {
      width: 100vw !important;
      max-width: 100vw !important;
    }

    body.simple-yt-tweaks-theater #movie_player,
    body.simple-yt-tweaks-theater .html5-video-container,
    body.simple-yt-tweaks-theater video.html5-main-video {
      height: 100vh !important;
      max-height: 100vh !important;
    }
    ` : ''}

    ${hideHeader ? `
    body.simple-yt-tweaks-theater ${SELECTORS.masthead},
    body.simple-yt-tweaks-theater ${SELECTORS.guide} {
      display: none !important;
    }
    ` : ''}

    ${autoHide ? `
    body.simple-yt-tweaks-ui-idle .ytp-chrome-top,
    body.simple-yt-tweaks-ui-idle .ytp-chrome-bottom,
    body.simple-yt-tweaks-ui-idle .ytp-gradient-top,
    body.simple-yt-tweaks-ui-idle .ytp-ce-element,
    body.simple-yt-tweaks-ui-idle ${SELECTORS.masthead} {
      opacity: 0 !important;
      pointer-events: none !important;
      transition: opacity 0.18s ease !important;
    }

    body.simple-yt-tweaks-active .ytp-chrome-top,
    body.simple-yt-tweaks-active .ytp-chrome-bottom,
    body.simple-yt-tweaks-active .ytp-gradient-top,
    body.simple-yt-tweaks-active .ytp-ce-element,
    body.simple-yt-tweaks-active ${SELECTORS.masthead} {
      transition: opacity 0.18s ease !important;
    }
    ` : ''}
  `;
}

function ensureStyle(): void {
  let styleEl = document.getElementById(STYLE_ID);
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = STYLE_ID;
    document.documentElement.append(styleEl);
  }

  styleEl.textContent = buildCss();
  document.body.classList.add('simple-yt-tweaks-active');
}

function updateTheaterClass(): void {
  const enabled = state.settings.enhancedTheaterMode && isWatchPage() && isTheaterMode();
  document.body.classList.toggle('simple-yt-tweaks-theater', enabled);

  if (enabled) {
    restoreDockedPlayer();
  }
}

function showUi(): void {
  if (!state.settings.autoHideUI) return;

  document.body.classList.remove('simple-yt-tweaks-ui-idle');
  window.clearTimeout(state.idleTimer);
  state.idleTimer = window.setTimeout(() => {
    const player = getPlayer();
    if (!player) return;

    const playerRect = player.getBoundingClientRect();
    const playerInViewport = playerRect.bottom > 0 && playerRect.top < window.innerHeight;
    if (playerInViewport && !player.matches(':hover')) {
      document.body.classList.add('simple-yt-tweaks-ui-idle');
    }
  }, 2400);
}

function bindActivityHandlers(): void {
  if (state.activityHandlersBound) return;
  state.activityHandlersBound = true;

  document.addEventListener('mousemove', showUi, { passive: true });
  document.addEventListener('mouseenter', showUi, { passive: true });
  document.addEventListener('keydown', showUi, { passive: true });
  document.addEventListener(
    'mouseleave',
    () => document.body.classList.remove('simple-yt-tweaks-ui-idle'),
    { passive: true },
  );
}

function createPipButton(): void {
  if (!state.settings.pipButton || !isWatchPage()) return;

  const rightControls = query<HTMLElement>(SELECTORS.controlsRight);
  const video = getVideo();
  if (!rightControls || !video || document.getElementById(PIP_BUTTON_ID)) return;

  const button = document.createElement('button');
  button.id = PIP_BUTTON_ID;
  button.className = 'ytp-button simple-yt-tweaks-pip-btn';
  button.type = 'button';
  button.setAttribute('aria-label', 'Picture in Picture');
  button.setAttribute('title', 'Picture in Picture');
  button.innerHTML = `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M19 7H5v10h14V7zm0-2c1.1 0 2 .9 2 2v10c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V7c0-1.1.9-2 2-2h14zm-1 8h-6v4h6v-4z"></path>
    </svg>
  `;

  button.addEventListener('click', async (event) => {
    event.preventDefault();
    event.stopPropagation();

    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
        return;
      }

      if (document.pictureInPictureEnabled && !video.disablePictureInPicture) {
        await video.requestPictureInPicture();
      }
    } catch (error) {
      console.warn('Simple YT Tweaks PiP failed:', error);
    }
  });

  rightControls.prepend(button);
}

function removePipButton(): void {
  document.getElementById(PIP_BUTTON_ID)?.remove();
}

function ensureDockShell(): HTMLElement {
  let shell = document.getElementById(DOCK_ID);
  if (shell) return shell;

  shell = document.createElement('section');
  shell.id = DOCK_ID;
  shell.setAttribute('aria-label', 'Floating video player');
  shell.innerHTML = `
    <div class="simple-yt-tweaks-dock-actions">
      <button class="simple-yt-tweaks-dock-btn" type="button" data-action="restore" aria-label="Restore player" title="Restore player">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M5 5h8v2H8.41l5.3 5.29-1.42 1.42L7 8.41V13H5V5zm14 14h-8v-2h4.59l-5.3-5.29 1.42-1.42L17 15.59V11h2v8z"></path></svg>
      </button>
      <button class="simple-yt-tweaks-dock-btn" type="button" data-action="close" aria-label="Close floating player" title="Close floating player">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M18.3 5.71 12 12l6.3 6.29-1.41 1.41L10.59 13.4 4.29 19.7 2.88 18.29 9.17 12 2.88 5.71 4.29 4.3l6.3 6.29 6.29-6.3z"></path></svg>
      </button>
    </div>
    <div class="simple-yt-tweaks-dock-body"></div>
  `;

  shell.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const button = target.closest<HTMLButtonElement>('[data-action]');
    if (!button) return;

    const action = button.dataset.action;
    if (action === 'close') {
      state.miniPlayerDismissed = true;
    }

    restoreDockedPlayer();
  });

  document.body.append(shell);
  return shell;
}

function getDockBody(shell: HTMLElement): HTMLElement | null {
  return query<HTMLElement>('.simple-yt-tweaks-dock-body', shell);
}

function findDockTarget(): HTMLElement | null {
  const currentDockTarget = state.dock?.target;
  if (currentDockTarget?.isConnected) return currentDockTarget;

  const target = query<HTMLElement>(SELECTORS.dockTarget);
  if (!target || target.closest(`#${DOCK_ID}`)) return null;

  return target;
}

function getOriginalPlayerRect(): DOMRect | null {
  if (state.dock?.placeholder.isConnected) {
    return state.dock.placeholder.getBoundingClientRect();
  }

  return findDockTarget()?.getBoundingClientRect() ?? null;
}

function shouldShowDockedPlayer(): boolean {
  if (
    !state.settings.floatingMiniPlayer ||
    !isWatchPage() ||
    state.miniPlayerDismissed ||
    isTheaterMode()
  ) {
    return false;
  }

  const comments = query<HTMLElement>(SELECTORS.comments);
  const playerRect = getOriginalPlayerRect();
  if (!comments || !playerRect) return false;

  const commentsRect = comments.getBoundingClientRect();
  const playerMostlyOffscreen = playerRect.bottom < 120;
  const commentsEnteredViewport = commentsRect.top < window.innerHeight;

  return playerMostlyOffscreen && commentsEnteredViewport;
}

function dockPlayer(): void {
  if (state.dock) {
    state.dock.shell.classList.add('is-visible');
    return;
  }

  const target = findDockTarget();
  if (!target || !target.parentNode) return;

  const shell = ensureDockShell();
  const dockBody = getDockBody(shell);
  if (!dockBody) return;

  const rect = target.getBoundingClientRect();
  const placeholder = document.createElement('div');
  placeholder.className = 'simple-yt-tweaks-player-placeholder';
  placeholder.style.height = `${Math.max(Math.round(rect.height), 220)}px`;

  const originalParent = target.parentNode;
  const originalNextSibling = target.nextSibling;

  originalParent.insertBefore(placeholder, target);
  target.classList.add('simple-yt-tweaks-docked-target');
  dockBody.append(target);
  shell.classList.add('is-visible');

  state.dock = {
    target,
    originalParent,
    originalNextSibling,
    placeholder,
    shell,
  };
}

function restoreDockedPlayer(): void {
  const dock = state.dock;
  if (!dock) {
    document.getElementById(DOCK_ID)?.classList.remove('is-visible');
    return;
  }

  dock.shell.classList.remove('is-visible');
  dock.target.classList.remove('simple-yt-tweaks-docked-target');

  if (dock.placeholder.isConnected && dock.placeholder.parentNode) {
    dock.placeholder.parentNode.insertBefore(dock.target, dock.placeholder);
  } else if (dock.originalParent.isConnected) {
    dock.originalParent.insertBefore(dock.target, dock.originalNextSibling);
  }

  dock.placeholder.remove();
  state.dock = null;
}

function updateDockedPlayer(): void {
  if (shouldShowDockedPlayer()) {
    dockPlayer();
    return;
  }

  restoreDockedPlayer();
}

function resetNavigationState(): void {
  if (location.href === state.currentUrl) return;

  state.currentUrl = location.href;
  state.miniPlayerDismissed = false;
  restoreDockedPlayer();
}

function applyFeatureState(): void {
  if (!document.body) return;

  ensureStyle();
  resetNavigationState();
  updateTheaterClass();

  if (state.settings.pipButton) {
    createPipButton();
  } else {
    removePipButton();
  }

  if (state.settings.autoHideUI) {
    bindActivityHandlers();
    showUi();
  } else {
    document.body.classList.remove('simple-yt-tweaks-ui-idle');
  }

  updateDockedPlayer();
}

function bindStorageObserver(): void {
  if (state.storageObserverBound) return;
  state.storageObserverBound = true;

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== 'sync') return;

    let touched = false;
    for (const key of SETTING_KEYS) {
      const change = changes[key as SettingKey];
      if (change && typeof change.newValue === 'boolean') {
        state.settings[key] = change.newValue;
        touched = true;
      }
    }

    if (touched) {
      applyFeatureState();
    }
  });
}

function observeDom(): void {
  state.observer?.disconnect();

  const debouncedApply = debounce(() => applyFeatureState(), 150);
  state.observer = new MutationObserver(() => debouncedApply());
  state.observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class', 'theater', 'hidden'],
  });
}

function observeNavigation(): void {
  const rerun = debounce(() => applyFeatureState(), 120);
  const updateDock = debounce(() => updateDockedPlayer(), 40);

  window.addEventListener('yt-navigate-finish', rerun, { passive: true });
  window.addEventListener('yt-page-data-updated', rerun, { passive: true });
  window.addEventListener('popstate', rerun, { passive: true });
  window.addEventListener('scroll', updateDock, { passive: true });
  window.addEventListener(
    'resize',
    debounce(() => {
      updateTheaterClass();
      updateDockedPlayer();
    }, 80),
    { passive: true },
  );
}

function bindVideoEvents(): void {
  const attach = () => {
    const video = getVideo();
    if (!video || video.dataset.simpleYtTweaksBound === '1') return;

    video.dataset.simpleYtTweaksBound = '1';
    video.addEventListener('enterpictureinpicture', () => updateDockedPlayer(), { passive: true });
    video.addEventListener('leavepictureinpicture', () => updateDockedPlayer(), { passive: true });
  };

  attach();
  window.setInterval(attach, 2000);
}

async function init(): Promise<void> {
  state.settings = await loadSettings();

  if (!document.body) {
    window.addEventListener('DOMContentLoaded', () => void init(), { once: true });
    return;
  }

  ensureStyle();
  bindStorageObserver();
  observeDom();
  observeNavigation();
  bindVideoEvents();
  applyFeatureState();
}

init().catch((error) => {
  console.error('Simple YT Tweaks failed to initialize:', error);
});
