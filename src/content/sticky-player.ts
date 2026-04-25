import { isDefaultWatchView, isNativeFullscreenActive, isTheaterMode, isWatchPage, query, queryAll } from './dom';
import type { Settings } from './settings';
import { state } from './state';

const STICKY_PLAYER_CLASS = 'simple-yt-tweaks-sticky-player-active';
const STICKY_PLAYER_DISMISSED_CLASS = 'simple-yt-tweaks-sticky-player-dismissed';
const STICKY_PLAYER_SHELL_ID = 'simple-yt-tweaks-sticky-player-shell';
const STICKY_PLAYER_PLACEHOLDER_ID = 'simple-yt-tweaks-sticky-player-placeholder';
const STICKY_PLAYER_FRAME_ID = 'simple-yt-tweaks-sticky-player-frame';

type StickyPlayerDockState = {
  target: HTMLElement;
  originalParent: Node;
  originalNextSibling: ChildNode | null;
  placeholder: HTMLElement;
  shell: HTMLElement;
  frame: HTMLElement;
};

type PlayerVisibility = {
  rect: DOMRect;
  viewportHeight: number;
  visibleHeight: number;
  visibleRatio: number;
};

type ResizeDirection = 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw';

const STICKY_ASPECT_RATIO = 16 / 9;
const STICKY_MIN_WIDTH = 260;
const STICKY_MAX_WIDTH = 640;
const STICKY_VIEWPORT_MARGIN = 8;

let stickyDock: StickyPlayerDockState | null = null;
let stickyDismissedUntilPlayerVisible = false;

function getViewportHeight(): number {
  return Math.round(window.visualViewport?.height ?? window.innerHeight);
}

function getPlayerTarget(): HTMLElement | null {
  return query<HTMLElement>('#movie_player') ?? query<HTMLElement>('#player-container');
}

function getStickyPlaceholder(): HTMLElement | null {
  return document.getElementById(STICKY_PLAYER_PLACEHOLDER_ID);
}

function hasUsableRect(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0;
}

function getPlayerVisibility(anchor: HTMLElement): PlayerVisibility | null {
  const rect = anchor.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) return null;

  const viewportHeight = getViewportHeight();
  const visibleHeight = Math.max(0, Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0));

  return {
    rect,
    viewportHeight,
    visibleHeight,
    visibleRatio: visibleHeight / rect.height,
  };
}

function getPlayerAnchor(playerTarget: HTMLElement | null): HTMLElement | null {
  const placeholder = getStickyPlaceholder();
  if (placeholder?.isConnected && hasUsableRect(placeholder)) {
    return placeholder;
  }

  const anchors = queryAll<HTMLElement>(
    [
      '#player-container-outer',
      '#full-bleed-container',
      '#player-full-bleed-container',
      '#player-container',
    ].join(','),
  );

  return anchors.find(hasUsableRect) ?? playerTarget;
}

function isBrowserPipActive(): boolean {
  return Boolean(document.pictureInPictureElement);
}

function isStickyPlayerEligible(settings: Settings): boolean {
  if (!settings.generalStickyPlayer) return false;
  if (!isWatchPage() || isNativeFullscreenActive()) return false;
  if (isBrowserPipActive()) return false;

  return isDefaultWatchView() || isTheaterMode();
}

function isPlayerScrolledAway(anchor: HTMLElement): boolean {
  const visibility = getPlayerVisibility(anchor);
  if (!visibility) return false;

  const { rect, viewportHeight, visibleRatio } = visibility;

  if (isDefaultWatchView() && !isTheaterMode()) {
    return window.scrollY > 96 && rect.bottom <= viewportHeight * 0.52 && visibleRatio < 0.22;
  }

  return window.scrollY > 64 && rect.bottom <= viewportHeight * 0.72 && visibleRatio < 0.35;
}

function isPlayerMostlyVisible(anchor: HTMLElement): boolean {
  const visibility = getPlayerVisibility(anchor);
  if (!visibility) return false;

  if (isDefaultWatchView() && !isTheaterMode()) {
    return visibility.visibleRatio > 0.78 || window.scrollY <= 64;
  }

  return visibility.visibleRatio > 0.6 || window.scrollY <= 64;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function buildStickyPlayerCss(settings: Settings): string {
  if (!settings.generalStickyPlayer) return '';

  return `
    body.simple-yt-tweaks-active #${STICKY_PLAYER_SHELL_ID} {
      position: fixed !important;
      top: auto !important;
      left: auto !important;
      right: max(16px, env(safe-area-inset-right)) !important;
      bottom: max(16px, env(safe-area-inset-bottom)) !important;
      z-index: 2147483642 !important;
      display: flex !important;
      flex-direction: column !important;
      width: min(420px, calc(100vw - 32px)) !important;
      min-width: 0 !important;
      max-width: min(640px, calc(100vw - 24px)) !important;
      color: #fff !important;
      border-radius: 10px !important;
      overflow: hidden !important;
      background: #000 !important;
      box-shadow: 0 18px 48px rgba(0, 0, 0, 0.48), 0 0 0 1px rgba(255, 255, 255, 0.14) !important;
      transform: translateZ(0) !important;
      user-select: none !important;
    }

    body.simple-yt-tweaks-active #${STICKY_PLAYER_FRAME_ID} {
      position: relative !important;
      width: 100% !important;
      aspect-ratio: 16 / 9 !important;
      min-width: 0 !important;
      min-height: 0 !important;
      max-width: calc(100vw - 32px) !important;
      max-height: calc(var(--simple-yt-tweaks-vh, 100vh) - 32px) !important;
      margin: 0 !important;
      padding: 0 !important;
      overflow: hidden !important;
      border-radius: 10px !important;
      background: #000 !important;
    }

    body.simple-yt-tweaks-active #${STICKY_PLAYER_SHELL_ID} .simple-yt-tweaks-sticky-player-drag {
      position: absolute !important;
      top: 8px !important;
      left: 8px !important;
      right: 36px !important;
      z-index: 3 !important;
      height: 24px !important;
      background: transparent !important;
      cursor: move !important;
    }

    body.simple-yt-tweaks-active #${STICKY_PLAYER_SHELL_ID} .simple-yt-tweaks-sticky-player-btn {
      position: absolute !important;
      top: 8px !important;
      right: 8px !important;
      z-index: 6 !important;
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      width: 28px !important;
      height: 28px !important;
      min-width: 28px !important;
      padding: 0 !important;
      color: rgba(255, 255, 255, 0.9) !important;
      border: 0 !important;
      border-radius: 999px !important;
      background: rgba(0, 0, 0, 0.58) !important;
      cursor: pointer !important;
      opacity: 0 !important;
      pointer-events: none !important;
      transition: opacity 0.14s ease, background 0.14s ease !important;
    }

    body.simple-yt-tweaks-active #${STICKY_PLAYER_SHELL_ID}:hover .simple-yt-tweaks-sticky-player-btn,
    body.simple-yt-tweaks-active #${STICKY_PLAYER_SHELL_ID}:focus-within .simple-yt-tweaks-sticky-player-btn {
      opacity: 1 !important;
      pointer-events: auto !important;
    }

    body.simple-yt-tweaks-active #${STICKY_PLAYER_SHELL_ID} .simple-yt-tweaks-sticky-player-btn:hover,
    body.simple-yt-tweaks-active #${STICKY_PLAYER_SHELL_ID} .simple-yt-tweaks-sticky-player-btn:focus-visible {
      color: #fff !important;
      background: rgba(0, 0, 0, 0.78) !important;
      outline: none !important;
    }

    body.simple-yt-tweaks-active #${STICKY_PLAYER_SHELL_ID} .simple-yt-tweaks-sticky-player-btn svg {
      width: 18px !important;
      height: 18px !important;
      fill: currentColor !important;
    }

    body.simple-yt-tweaks-active #${STICKY_PLAYER_SHELL_ID} .simple-yt-tweaks-sticky-player-resize {
      position: absolute !important;
      z-index: 5 !important;
      background: transparent !important;
      opacity: 0 !important;
      transition: opacity 0.14s ease !important;
    }

    body.simple-yt-tweaks-active #${STICKY_PLAYER_SHELL_ID} .simple-yt-tweaks-sticky-player-resize-n,
    body.simple-yt-tweaks-active #${STICKY_PLAYER_SHELL_ID} .simple-yt-tweaks-sticky-player-resize-s {
      left: 18px !important;
      right: 18px !important;
      height: 8px !important;
      cursor: ns-resize !important;
    }

    body.simple-yt-tweaks-active #${STICKY_PLAYER_SHELL_ID} .simple-yt-tweaks-sticky-player-resize-n {
      top: 0 !important;
    }

    body.simple-yt-tweaks-active #${STICKY_PLAYER_SHELL_ID} .simple-yt-tweaks-sticky-player-resize-s {
      bottom: 0 !important;
    }

    body.simple-yt-tweaks-active #${STICKY_PLAYER_SHELL_ID} .simple-yt-tweaks-sticky-player-resize-e,
    body.simple-yt-tweaks-active #${STICKY_PLAYER_SHELL_ID} .simple-yt-tweaks-sticky-player-resize-w {
      top: 18px !important;
      bottom: 18px !important;
      width: 8px !important;
      cursor: ew-resize !important;
    }

    body.simple-yt-tweaks-active #${STICKY_PLAYER_SHELL_ID} .simple-yt-tweaks-sticky-player-resize-e {
      right: 0 !important;
    }

    body.simple-yt-tweaks-active #${STICKY_PLAYER_SHELL_ID} .simple-yt-tweaks-sticky-player-resize-w {
      left: 0 !important;
    }

    body.simple-yt-tweaks-active #${STICKY_PLAYER_SHELL_ID} .simple-yt-tweaks-sticky-player-resize-ne,
    body.simple-yt-tweaks-active #${STICKY_PLAYER_SHELL_ID} .simple-yt-tweaks-sticky-player-resize-sw {
      width: 18px !important;
      height: 18px !important;
      cursor: nesw-resize !important;
    }

    body.simple-yt-tweaks-active #${STICKY_PLAYER_SHELL_ID} .simple-yt-tweaks-sticky-player-resize-nw,
    body.simple-yt-tweaks-active #${STICKY_PLAYER_SHELL_ID} .simple-yt-tweaks-sticky-player-resize-se {
      width: 18px !important;
      height: 18px !important;
      cursor: nwse-resize !important;
    }

    body.simple-yt-tweaks-active #${STICKY_PLAYER_SHELL_ID} .simple-yt-tweaks-sticky-player-resize-ne,
    body.simple-yt-tweaks-active #${STICKY_PLAYER_SHELL_ID} .simple-yt-tweaks-sticky-player-resize-nw {
      top: 0 !important;
    }

    body.simple-yt-tweaks-active #${STICKY_PLAYER_SHELL_ID} .simple-yt-tweaks-sticky-player-resize-se,
    body.simple-yt-tweaks-active #${STICKY_PLAYER_SHELL_ID} .simple-yt-tweaks-sticky-player-resize-sw {
      bottom: 0 !important;
    }

    body.simple-yt-tweaks-active #${STICKY_PLAYER_SHELL_ID} .simple-yt-tweaks-sticky-player-resize-ne,
    body.simple-yt-tweaks-active #${STICKY_PLAYER_SHELL_ID} .simple-yt-tweaks-sticky-player-resize-se {
      right: 0 !important;
    }

    body.simple-yt-tweaks-active #${STICKY_PLAYER_SHELL_ID} .simple-yt-tweaks-sticky-player-resize-nw,
    body.simple-yt-tweaks-active #${STICKY_PLAYER_SHELL_ID} .simple-yt-tweaks-sticky-player-resize-sw {
      left: 0 !important;
    }

    body.simple-yt-tweaks-active #${STICKY_PLAYER_SHELL_ID} .simple-yt-tweaks-sticky-player-resize-se {
      background: linear-gradient(135deg, transparent 45%, rgba(255,255,255,0.32) 46%, rgba(255,255,255,0.32) 52%, transparent 53%) !important;
    }

    body.simple-yt-tweaks-active #${STICKY_PLAYER_SHELL_ID}:hover .simple-yt-tweaks-sticky-player-resize,
    body.simple-yt-tweaks-active #${STICKY_PLAYER_SHELL_ID}:focus-within .simple-yt-tweaks-sticky-player-resize {
      opacity: 1 !important;
    }

    body.${STICKY_PLAYER_CLASS}:not(.simple-yt-tweaks-fullscreen-view) #${STICKY_PLAYER_PLACEHOLDER_ID} {
      display: block !important;
      flex: 0 0 auto !important;
      pointer-events: none !important;
      visibility: hidden !important;
    }

    body.simple-yt-tweaks-active #${STICKY_PLAYER_FRAME_ID} #player-container,
    body.simple-yt-tweaks-active #${STICKY_PLAYER_FRAME_ID} #player-container-inner,
    body.simple-yt-tweaks-active #${STICKY_PLAYER_FRAME_ID} #player,
    body.simple-yt-tweaks-active #${STICKY_PLAYER_FRAME_ID} #movie_player,
    body.simple-yt-tweaks-active #${STICKY_PLAYER_FRAME_ID} .html5-video-player,
    body.simple-yt-tweaks-active #${STICKY_PLAYER_FRAME_ID} .html5-video-container {
      position: relative !important;
      inset: auto !important;
      display: block !important;
      width: 100% !important;
      height: 100% !important;
      min-width: 0 !important;
      min-height: 0 !important;
      max-width: 100% !important;
      max-height: 100% !important;
      margin: 0 !important;
      padding: 0 !important;
      overflow: hidden !important;
      border-radius: inherit !important;
    }

    body.simple-yt-tweaks-active #${STICKY_PLAYER_FRAME_ID} video.html5-main-video {
      width: 100% !important;
      height: 100% !important;
      left: 0 !important;
      top: 0 !important;
      object-fit: contain !important;
    }

    body.simple-yt-tweaks-player-ui-hidden #${STICKY_PLAYER_SHELL_ID}:hover .ytp-chrome-bottom,
    body.simple-yt-tweaks-player-ui-hidden #${STICKY_PLAYER_SHELL_ID}:hover .ytp-gradient-bottom,
    body.simple-yt-tweaks-player-ui-hidden #${STICKY_PLAYER_SHELL_ID}:focus-within .ytp-chrome-bottom,
    body.simple-yt-tweaks-player-ui-hidden #${STICKY_PLAYER_SHELL_ID}:focus-within .ytp-gradient-bottom {
      opacity: 1 !important;
      pointer-events: auto !important;
    }

    body.simple-yt-tweaks-active #${STICKY_PLAYER_FRAME_ID} .ytp-chrome-bottom,
    body.simple-yt-tweaks-active #${STICKY_PLAYER_FRAME_ID} .ytp-gradient-bottom {
      border-radius: 0 0 10px 10px !important;
    }

    body.simple-yt-tweaks-active #${STICKY_PLAYER_FRAME_ID} .ytp-chrome-bottom {
      left: 0 !important;
      right: 0 !important;
      width: 100% !important;
    }

    body.simple-yt-tweaks-active #${STICKY_PLAYER_FRAME_ID} .ytp-chrome-controls {
      left: 12px !important;
      right: 12px !important;
      width: auto !important;
    }

    @media (max-width: 720px) {
      body.simple-yt-tweaks-active #${STICKY_PLAYER_SHELL_ID} {
        right: 12px !important;
        bottom: 12px !important;
        width: min(340px, calc(100vw - 24px)) !important;
        max-width: calc(100vw - 24px) !important;
      }
    }
  `;
}

function dispatchPlayerResize(): void {
  window.dispatchEvent(new Event('resize'));
}

function createStickyButton(label: string, svgPath: string): HTMLButtonElement {
  const button = document.createElement('button');
  button.className = 'simple-yt-tweaks-sticky-player-btn';
  button.type = 'button';
  button.setAttribute('aria-label', label);
  button.title = label;
  button.innerHTML = `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="${svgPath}"></path>
    </svg>
  `;

  return button;
}

function setImportantStyle(element: HTMLElement, property: string, value: string): void {
  element.style.setProperty(property, value, 'important');
}

function getMaxStickyWidth(): number {
  return Math.min(STICKY_MAX_WIDTH, window.innerWidth - STICKY_VIEWPORT_MARGIN * 2);
}

function bindShellDrag(shell: HTMLElement, handle: HTMLElement): void {
  handle.addEventListener('pointerdown', (event) => {
    if (event.button !== 0) return;
    if ((event.target as Element | null)?.closest('button')) return;

    event.preventDefault();
    const rect = shell.getBoundingClientRect();
    const startX = event.clientX;
    const startY = event.clientY;
    const startLeft = rect.left;
    const startTop = rect.top;
    const pointerId = event.pointerId;

    handle.setPointerCapture(pointerId);

    const onPointerMove = (moveEvent: PointerEvent) => {
      const nextLeft = clamp(startLeft + moveEvent.clientX - startX, 8, window.innerWidth - rect.width - 8);
      const nextTop = clamp(startTop + moveEvent.clientY - startY, 8, window.innerHeight - rect.height - 8);

      setImportantStyle(shell, 'left', `${nextLeft}px`);
      setImportantStyle(shell, 'top', `${nextTop}px`);
      setImportantStyle(shell, 'right', 'auto');
      setImportantStyle(shell, 'bottom', 'auto');
    };

    const onPointerUp = () => {
      handle.releasePointerCapture(pointerId);
      handle.removeEventListener('pointermove', onPointerMove);
      handle.removeEventListener('pointerup', onPointerUp);
      handle.removeEventListener('pointercancel', onPointerUp);
    };

    handle.addEventListener('pointermove', onPointerMove);
    handle.addEventListener('pointerup', onPointerUp);
    handle.addEventListener('pointercancel', onPointerUp);
  });
}

function resolveResizedRect(
  rect: DOMRect,
  direction: ResizeDirection,
  deltaX: number,
  deltaY: number,
): { left: number; top: number; width: number } {
  const startRight = rect.right;
  const startBottom = rect.bottom;
  const maxWidth = getMaxStickyWidth();

  let width = rect.width;

  if (direction.includes('e')) {
    width = rect.width + deltaX;
  } else if (direction.includes('w')) {
    width = rect.width - deltaX;
  } else if (direction.includes('s')) {
    width = rect.width + deltaY * STICKY_ASPECT_RATIO;
  } else if (direction.includes('n')) {
    width = rect.width - deltaY * STICKY_ASPECT_RATIO;
  }

  width = clamp(width, STICKY_MIN_WIDTH, maxWidth);

  let left = direction.includes('w') ? startRight - width : rect.left;
  let top = direction.includes('n') ? startBottom - width / STICKY_ASPECT_RATIO : rect.top;

  if (left < STICKY_VIEWPORT_MARGIN) {
    width = direction.includes('w') ? startRight - STICKY_VIEWPORT_MARGIN : width;
    left = STICKY_VIEWPORT_MARGIN;
  }

  if (left + width > window.innerWidth - STICKY_VIEWPORT_MARGIN) {
    width = window.innerWidth - STICKY_VIEWPORT_MARGIN - left;
  }

  const height = width / STICKY_ASPECT_RATIO;
  if (top < STICKY_VIEWPORT_MARGIN) {
    width = direction.includes('n') ? (startBottom - STICKY_VIEWPORT_MARGIN) * STICKY_ASPECT_RATIO : width;
    top = STICKY_VIEWPORT_MARGIN;
  }

  if (top + height > window.innerHeight - STICKY_VIEWPORT_MARGIN) {
    const maxHeightFromTop = window.innerHeight - STICKY_VIEWPORT_MARGIN - top;
    width = Math.min(width, maxHeightFromTop * STICKY_ASPECT_RATIO);
  }

  return {
    left: clamp(left, STICKY_VIEWPORT_MARGIN, window.innerWidth - width - STICKY_VIEWPORT_MARGIN),
    top: clamp(top, STICKY_VIEWPORT_MARGIN, window.innerHeight - width / STICKY_ASPECT_RATIO - STICKY_VIEWPORT_MARGIN),
    width: clamp(width, STICKY_MIN_WIDTH, getMaxStickyWidth()),
  };
}

function bindShellResize(shell: HTMLElement, handle: HTMLElement, direction: ResizeDirection): void {
  handle.addEventListener('pointerdown', (event) => {
    if (event.button !== 0) return;

    event.preventDefault();
    const rect = shell.getBoundingClientRect();
    const startX = event.clientX;
    const startY = event.clientY;
    const pointerId = event.pointerId;

    handle.setPointerCapture(pointerId);

    const onPointerMove = (moveEvent: PointerEvent) => {
      const nextRect = resolveResizedRect(rect, direction, moveEvent.clientX - startX, moveEvent.clientY - startY);

      setImportantStyle(shell, 'left', `${nextRect.left}px`);
      setImportantStyle(shell, 'top', `${nextRect.top}px`);
      setImportantStyle(shell, 'right', 'auto');
      setImportantStyle(shell, 'bottom', 'auto');
      setImportantStyle(shell, 'width', `${nextRect.width}px`);
      dispatchPlayerResize();
    };

    const onPointerUp = () => {
      handle.releasePointerCapture(pointerId);
      handle.removeEventListener('pointermove', onPointerMove);
      handle.removeEventListener('pointerup', onPointerUp);
      handle.removeEventListener('pointercancel', onPointerUp);
      window.setTimeout(dispatchPlayerResize, 50);
    };

    handle.addEventListener('pointermove', onPointerMove);
    handle.addEventListener('pointerup', onPointerUp);
    handle.addEventListener('pointercancel', onPointerUp);
  });
}

function createResizeHandle(direction: ResizeDirection): HTMLElement {
  const handle = document.createElement('div');
  handle.className = `simple-yt-tweaks-sticky-player-resize simple-yt-tweaks-sticky-player-resize-${direction}`;
  handle.setAttribute('aria-hidden', 'true');

  return handle;
}

function createStickyShell(): { shell: HTMLElement; frame: HTMLElement } {
  const shell = document.createElement('div');
  shell.id = STICKY_PLAYER_SHELL_ID;

  const closeButton = createStickyButton(
    'Close sticky player',
    'M18.3 5.71 16.89 4.3 12 9.17 7.11 4.3 5.7 5.71 10.59 10.6 5.7 15.49 7.11 16.9 12 12.01 16.89 16.9 18.3 15.49 13.41 10.6z',
  );
  closeButton.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    stickyDismissedUntilPlayerVisible = true;
    restoreStickyPlayerDock();
    document.body.classList.add(STICKY_PLAYER_DISMISSED_CLASS);
  });

  const frame = document.createElement('div');
  frame.id = STICKY_PLAYER_FRAME_ID;

  const dragHandle = document.createElement('div');
  dragHandle.className = 'simple-yt-tweaks-sticky-player-drag';
  dragHandle.setAttribute('aria-hidden', 'true');

  const resizeHandles = (['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'] as ResizeDirection[]).map((direction) => {
    const handle = createResizeHandle(direction);
    bindShellResize(shell, handle, direction);
    return handle;
  });

  shell.append(frame, dragHandle, closeButton, ...resizeHandles);
  bindShellDrag(shell, dragHandle);

  return { shell, frame };
}

function createStickyPlaceholder(playerTarget: HTMLElement): HTMLElement {
  const rect = playerTarget.getBoundingClientRect();
  const placeholder = document.createElement('div');
  placeholder.id = STICKY_PLAYER_PLACEHOLDER_ID;
  placeholder.setAttribute('aria-hidden', 'true');
  placeholder.style.width = `${Math.max(1, Math.round(rect.width))}px`;
  placeholder.style.height = `${Math.max(1, Math.round(rect.height))}px`;

  return placeholder;
}

function dockStickyPlayer(playerTarget: HTMLElement): void {
  if (stickyDock?.target === playerTarget && stickyDock.shell.isConnected) {
    return;
  }

  restoreStickyPlayerDock();

  const originalParent = playerTarget.parentNode;
  if (!originalParent) return;

  const originalNextSibling = playerTarget.nextSibling;
  const placeholder = createStickyPlaceholder(playerTarget);
  originalParent.insertBefore(placeholder, playerTarget);

  const { shell, frame } = createStickyShell();
  frame.append(playerTarget);
  document.body.append(shell);

  stickyDock = {
    target: playerTarget,
    originalParent,
    originalNextSibling,
    placeholder,
    shell,
    frame,
  };

  document.body.classList.add(STICKY_PLAYER_CLASS);
  document.body.classList.remove(STICKY_PLAYER_DISMISSED_CLASS);
  window.requestAnimationFrame(dispatchPlayerResize);
}

function restoreStickyPlayerDock(): void {
  const dock = stickyDock;

  if (!dock) {
    document.getElementById(STICKY_PLAYER_SHELL_ID)?.remove();
    getStickyPlaceholder()?.remove();
    document.body?.classList.remove(STICKY_PLAYER_CLASS);
    return;
  }

  if (dock.originalParent.isConnected) {
    const referenceNode =
      dock.placeholder.parentNode === dock.originalParent
        ? dock.placeholder
        : dock.originalNextSibling?.parentNode === dock.originalParent
          ? dock.originalNextSibling
          : null;

    dock.originalParent.insertBefore(dock.target, referenceNode);
  }

  dock.placeholder.remove();
  dock.shell.remove();
  stickyDock = null;
  document.body?.classList.remove(STICKY_PLAYER_CLASS);
  window.requestAnimationFrame(dispatchPlayerResize);
}

export function updateStickyPlayerState(): void {
  if (!document.body) return;

  const playerTarget = getPlayerTarget();
  const anchor = getPlayerAnchor(playerTarget);
  const eligible = isStickyPlayerEligible(state.settings);
  const playerVisible = Boolean(anchor) && isPlayerMostlyVisible(anchor as HTMLElement);
  if (playerVisible) {
    stickyDismissedUntilPlayerVisible = false;
    document.body.classList.remove(STICKY_PLAYER_DISMISSED_CLASS);
  }

  if (stickyDock && eligible && !stickyDismissedUntilPlayerVisible && !playerVisible) {
    document.body.classList.add(STICKY_PLAYER_CLASS);
    return;
  }

  const shouldStick =
    Boolean(playerTarget) &&
    Boolean(anchor) &&
    eligible &&
    !stickyDismissedUntilPlayerVisible &&
    isPlayerScrolledAway(anchor as HTMLElement);

  if (shouldStick && playerTarget) {
    dockStickyPlayer(playerTarget);
    return;
  }

  restoreStickyPlayerDock();
}

export function resetStickyPlayerState(): void {
  stickyDismissedUntilPlayerVisible = false;
  restoreStickyPlayerDock();
  document.body?.classList.remove(STICKY_PLAYER_DISMISSED_CLASS);
}
