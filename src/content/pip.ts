import { getVideo, isNativeFullscreenActive, isVisibleNode, isWatchPage, query } from './dom';
import { MINIPLAYER_PIP_BUTTON_ID, PIP_BUTTON_ID, SELECTORS } from './selectors';
import { isFeatureEnabled } from './settings';
import { state } from './state';
import { prepareStickyPlayerForPictureInPicture } from './sticky-player';

export function buildPipCss(): string {
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

    body.simple-yt-tweaks-active .simple-yt-tweaks-miniplayer-pip-btn.ytp-button {
      display: inline-flex !important;
      align-items: center;
      justify-content: center;
      width: 36px !important;
      min-width: 36px !important;
      height: 36px !important;
      flex: 0 0 auto !important;
    }

    body.simple-yt-tweaks-active .simple-yt-tweaks-miniplayer-pip-btn svg {
      width: 22px;
      height: 22px;
      fill: currentColor;
    }
  `;
}

export async function toggleBrowserPictureInPicture(): Promise<void> {
  const initialVideo = getVideo();
  if (!initialVideo) return;

  try {
    if (document.pictureInPictureElement) {
      await document.exitPictureInPicture();
      return;
    }

    if (document.pictureInPictureEnabled && !initialVideo.disablePictureInPicture) {
      const wasPlaying = !initialVideo.paused && !initialVideo.ended;
      await prepareStickyPlayerForPictureInPicture();

      const video = getVideo() ?? initialVideo;
      if (video.disablePictureInPicture) return;
      await video.requestPictureInPicture();

      if (wasPlaying && video.paused) {
        void video.play().catch((error) => {
          console.warn('Simple YT Tweaks PiP resume failed:', error);
        });
      }
    }
  } catch (error) {
    console.warn('Simple YT Tweaks PiP failed:', error);
  }
}

export function createPipButton(): void {
  if (!isFeatureEnabled(state.settings, 'pipButton') || !isWatchPage()) return;

  const rightControls = query<HTMLElement>(SELECTORS.controlsRight);
  if (!rightControls || document.getElementById(PIP_BUTTON_ID)) return;

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
    await toggleBrowserPictureInPicture();
  });

  rightControls.prepend(button);
}

export function removePipButton(): void {
  document.getElementById(PIP_BUTTON_ID)?.remove();
}

export function removeMiniPlayerPipButton(): void {
  document.getElementById(MINIPLAYER_PIP_BUTTON_ID)?.remove();
}

export function ensureMiniPlayerPipButton(): void {
  if (!isFeatureEnabled(state.settings, 'pipButton') || !isWatchPage() || isNativeFullscreenActive()) {
    removeMiniPlayerPipButton();
    return;
  }

  const miniplayerUi = query<HTMLElement>('ytd-miniplayer, .ytp-miniplayer-ui');
  if (!miniplayerUi || !isVisibleNode(miniplayerUi)) {
    removeMiniPlayerPipButton();
    return;
  }

  const controls =
    query<HTMLElement>(
      [
        '.ytp-miniplayer-controls',
        '.ytp-miniplayer-buttons',
        '.ytdMiniplayerComponentContent',
        '.ytdMiniplayerInfoBarContent',
      ].join(','),
      miniplayerUi,
    ) ?? miniplayerUi;

  let button = document.getElementById(MINIPLAYER_PIP_BUTTON_ID) as HTMLButtonElement | null;
  if (!button) {
    button = document.createElement('button');
    button.id = MINIPLAYER_PIP_BUTTON_ID;
    button.className = 'ytp-button simple-yt-tweaks-miniplayer-pip-btn';
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
      await toggleBrowserPictureInPicture();
    });
  }

  if (button.parentElement !== controls) {
    const anchor = query<HTMLElement>(
      [
        '.ytp-miniplayer-close-button',
        '.ytp-miniplayer-expand-watch-page-button',
      ].join(','),
      controls,
    );

    if (anchor && anchor.parentElement === controls) {
      controls.insertBefore(button, anchor);
    } else {
      controls.append(button);
    }
  }
}

export function syncPipButtons(): void {
  if (isFeatureEnabled(state.settings, 'pipButton')) {
    createPipButton();
  } else {
    removePipButton();
  }

  ensureMiniPlayerPipButton();
}
