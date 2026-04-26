import { GENERAL_HIDDEN_CLASS } from './selectors';
import type { Settings } from './settings';

const GRID_HOVER_READY_CLASS = 'simple-yt-tweaks-grid-hover-ready';
const GRID_HOVER_MEDIA_CLASS = 'simple-yt-tweaks-grid-hover-media';
const GRID_EDGE_START_CLASS = 'simple-yt-tweaks-grid-edge-start';
const GRID_EDGE_END_CLASS = 'simple-yt-tweaks-grid-edge-end';
const SEARCH_BADGE_ROW_CLASS = 'simple-yt-tweaks-search-badges';
const SIDEBAR_HOVER_DELAY_MS = 560;
const FALLBACK_HOVER_DELAY_MS = 250;
const PREVIEW_CONTAINER_SELECTOR = [
  'ytd-moving-thumbnail-renderer',
  'ytd-thumbnail-overlay-loading-preview-renderer',
  'ytd-thumbnail-overlay-inline-preview-renderer',
  'ytd-thumbnail-overlay-inline-unplayable-renderer',
  'yt-inline-player-view-model',
  'inline-player-view-model',
  '.ytInlinePlayerViewModelHost',
  '.html5-video-player',
  '.ytp-inline-preview-ui',
  'video',
].join(',');
const SIDEBAR_CARD_SELECTOR = [
  '#related ytd-compact-video-renderer',
  'ytd-watch-next-secondary-results-renderer ytd-compact-video-renderer',
  '#related yt-lockup-view-model',
  'ytd-watch-next-secondary-results-renderer yt-lockup-view-model',
].join(',');
const SEARCH_GRID_CONTENTS_SELECTOR =
  'ytd-search ytd-two-column-search-results-renderer #primary ytd-section-list-renderer > #contents.ytd-section-list-renderer';
const HOVER_CARD_SELECTOR = SIDEBAR_CARD_SELECTOR;
const HOVER_MEDIA_SELECTOR = [
  '#related ytd-compact-video-renderer ytd-thumbnail',
  'ytd-watch-next-secondary-results-renderer ytd-compact-video-renderer ytd-thumbnail',
  '#related yt-lockup-view-model yt-thumbnail-view-model',
  'ytd-watch-next-secondary-results-renderer yt-lockup-view-model yt-thumbnail-view-model',
].join(',');

let handlersBound = false;
let activeHoverCard: HTMLElement | null = null;
let hoverReadyTimer: number | null = null;
let hoverClearTimer: number | null = null;
let lastPointerX = Number.POSITIVE_INFINITY;
let lastPointerY = Number.POSITIVE_INFINITY;

function buildSearchGridCss(columns: number): string {
  return `
    body.simple-yt-tweaks-active ${SEARCH_GRID_CONTENTS_SELECTOR} {
      display: grid !important;
      grid-template-columns: repeat(${columns}, minmax(0, 1fr)) !important;
      grid-auto-flow: row dense !important;
      align-items: start !important;
      column-gap: 16px !important;
      row-gap: 24px !important;
      padding-top: var(--ytd-item-section-item-margin, 16px) !important;
      box-sizing: border-box !important;
      position: relative !important;
      overflow: visible !important;
    }

    body.simple-yt-tweaks-active ${SEARCH_GRID_CONTENTS_SELECTOR} > ytd-item-section-renderer,
    body.simple-yt-tweaks-active ${SEARCH_GRID_CONTENTS_SELECTOR} > ytd-item-section-renderer > #contents {
      display: contents !important;
    }

    body.simple-yt-tweaks-active ${SEARCH_GRID_CONTENTS_SELECTOR} > ytd-item-section-renderer > #header,
    body.simple-yt-tweaks-active ${SEARCH_GRID_CONTENTS_SELECTOR} > ytd-item-section-renderer > #spinner-container,
    body.simple-yt-tweaks-active ${SEARCH_GRID_CONTENTS_SELECTOR} > ytd-item-section-renderer > #continuations {
      display: none !important;
    }

    body.simple-yt-tweaks-active ${SEARCH_GRID_CONTENTS_SELECTOR} ytd-continuation-item-renderer {
      grid-column: 1 / -1 !important;
      position: absolute !important;
      bottom: 0 !important;
      left: 0 !important;
      width: 1px !important;
      height: 1px !important;
      min-width: 0 !important;
      min-height: 0 !important;
      margin: 0 !important;
      padding: 0 !important;
      overflow: hidden !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }

    body.simple-yt-tweaks-active ytd-search ytd-video-renderer,
    body.simple-yt-tweaks-active ytd-search ytd-grid-video-renderer,
    body.simple-yt-tweaks-active ytd-search ytd-channel-renderer {
      min-width: 0 !important;
      max-width: none !important;
      margin-top: 0 !important;
    }

    body.simple-yt-tweaks-active ytd-search ytd-video-renderer,
    body.simple-yt-tweaks-active ytd-search ytd-grid-video-renderer {
      margin: 0 !important;
      padding: 0 !important;
    }

    body.simple-yt-tweaks-active ytd-search ytd-video-renderer #dismissible {
      display: block !important;
      height: 100% !important;
      margin: 0 !important;
      padding: 0 !important;
    }

    body.simple-yt-tweaks-active ytd-search ytd-video-renderer ytd-thumbnail {
      width: 100% !important;
      margin: 0 0 10px !important;
    }

    body.simple-yt-tweaks-active ytd-search ytd-video-renderer #meta,
    body.simple-yt-tweaks-active ytd-search ytd-video-renderer ytd-video-meta-block {
      min-width: 0 !important;
    }

    body.simple-yt-tweaks-active ytd-search ytd-channel-renderer {
      order: -10 !important;
      display: flex !important;
      min-height: clamp(220px, 23vw, 292px) !important;
      padding: 16px !important;
      border-radius: 12px !important;
      border: 1px solid rgba(255, 255, 255, 0.06) !important;
      background: rgba(255, 255, 255, 0.04) !important;
    }

    body.simple-yt-tweaks-active ytd-search ytd-channel-renderer #content-section {
      display: grid !important;
      grid-template-rows: auto minmax(0, 1fr) !important;
      align-content: center !important;
      justify-items: center !important;
      gap: 12px !important;
      min-width: 0 !important;
      width: 100% !important;
      text-align: center !important;
    }

    body.simple-yt-tweaks-active ytd-search ytd-channel-renderer #avatar-section {
      display: flex !important;
      justify-content: center !important;
      width: 100% !important;
      margin: 0 auto !important;
    }

    body.simple-yt-tweaks-active ytd-search ytd-channel-renderer #info-section,
    body.simple-yt-tweaks-active ytd-search ytd-channel-renderer #main-link,
    body.simple-yt-tweaks-active ytd-search ytd-channel-renderer #info {
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      min-width: 0 !important;
      width: 100% !important;
      text-align: center !important;
    }

    body.simple-yt-tweaks-active ytd-search ytd-channel-renderer #channel-title {
      width: 100% !important;
      justify-content: center !important;
    }

    body.simple-yt-tweaks-active ytd-search ytd-channel-renderer #channel-title #container,
    body.simple-yt-tweaks-active ytd-search ytd-channel-renderer #channel-title #text-container {
      display: flex !important;
      justify-content: center !important;
      max-width: 100% !important;
      text-align: center !important;
    }

    body.simple-yt-tweaks-active ytd-search ytd-channel-renderer #channel-title #text {
      max-width: 100% !important;
      text-align: center !important;
    }

    body.simple-yt-tweaks-active ytd-search ytd-channel-renderer #metadata {
      display: flex !important;
      justify-content: center !important;
      flex-wrap: wrap !important;
      gap: 2px 5px !important;
      margin-top: 4px !important;
      text-align: center !important;
    }

    body.simple-yt-tweaks-active ytd-search ytd-channel-renderer #description {
      display: -webkit-box !important;
      max-width: 100% !important;
      margin-top: 8px !important;
      overflow: hidden !important;
      -webkit-box-orient: vertical !important;
      -webkit-line-clamp: 2 !important;
      text-align: center !important;
    }

    body.simple-yt-tweaks-active ytd-search ytd-channel-renderer #buttons {
      display: flex !important;
      justify-content: center !important;
      width: 100% !important;
      margin-top: 10px !important;
    }

    body.simple-yt-tweaks-active ytd-search ytd-channel-renderer yt-img-shadow,
    body.simple-yt-tweaks-active ytd-search ytd-channel-renderer #avatar,
    body.simple-yt-tweaks-active ytd-search ytd-channel-renderer img {
      width: clamp(76px, 7.5vw, 108px) !important;
      height: clamp(76px, 7.5vw, 108px) !important;
    }

    body.simple-yt-tweaks-active ytd-search ytd-video-renderer #description-text,
    body.simple-yt-tweaks-active ytd-search ytd-video-renderer #metadata-snippet-container,
    body.simple-yt-tweaks-active ytd-search ytd-video-renderer .metadata-snippet-container,
    body.simple-yt-tweaks-active ytd-search ytd-video-renderer #metadata-line .inline-metadata-item,
    body.simple-yt-tweaks-active ytd-search ytd-video-renderer #metadata-line #separator,
    body.simple-yt-tweaks-active ytd-search ytd-video-renderer #additional-metadata-line,
    body.simple-yt-tweaks-active ytd-search ytd-video-renderer #expandable-metadata,
    body.simple-yt-tweaks-active ytd-search ytd-video-renderer ytd-button-renderer,
    body.simple-yt-tweaks-active ytd-search ytd-video-renderer:has(a[href*="/shorts/"]),
    body.simple-yt-tweaks-active ytd-search ytd-video-renderer:has(a[href*="list=RD"]),
    body.simple-yt-tweaks-active ytd-search ytd-video-renderer:has(a[href*="start_radio=1"]),
    body.simple-yt-tweaks-active ytd-search ytd-video-renderer:has(a[href*="/playlist?list="]),
    body.simple-yt-tweaks-active ytd-search ytd-grid-video-renderer:has(a[href*="/shorts/"]),
    body.simple-yt-tweaks-active ytd-search ytd-reel-video-renderer,
    body.simple-yt-tweaks-active ytd-search ytd-reel-item-renderer,
    body.simple-yt-tweaks-active ytd-search grid-shelf-view-model:has(a[href*="/shorts/"]),
    body.simple-yt-tweaks-active ytd-search ytm-shorts-lockup-view-model-v2,
    body.simple-yt-tweaks-active ytd-search ytm-shorts-lockup-view-model,
    body.simple-yt-tweaks-active ytd-search ytd-playlist-renderer,
    body.simple-yt-tweaks-active ytd-search ytd-radio-renderer,
    body.simple-yt-tweaks-active ytd-search ytd-grid-playlist-renderer,
    body.simple-yt-tweaks-active ytd-search ytd-compact-radio-renderer,
    body.simple-yt-tweaks-active ytd-search yt-lockup-view-model:has(a[href*="/shorts/"]),
    body.simple-yt-tweaks-active ytd-search yt-lockup-view-model:has(a[href*="list=RD"]),
    body.simple-yt-tweaks-active ytd-search yt-lockup-view-model:has(a[href*="start_radio=1"]),
    body.simple-yt-tweaks-active ytd-search yt-lockup-view-model:has(a[href*="/playlist?list="]),
    body.simple-yt-tweaks-active ytd-search ytd-shelf-renderer,
    body.simple-yt-tweaks-active ytd-search ytd-reel-shelf-renderer,
    body.simple-yt-tweaks-active ytd-search ytd-horizontal-card-list-renderer,
    body.simple-yt-tweaks-active ytd-search ytd-item-section-renderer:not(:has(ytd-video-renderer)):not(:has(ytd-channel-renderer)) {
      display: none !important;
    }

    body.simple-yt-tweaks-active ytd-search ytd-video-renderer #channel-info {
      display: flex !important;
      align-items: center !important;
      gap: 6px !important;
      min-width: 0 !important;
      margin-top: 6px !important;
    }

    body.simple-yt-tweaks-active ytd-search ytd-video-renderer #channel-info ytd-channel-name {
      display: inline-flex !important;
      align-items: center !important;
      min-width: 0 !important;
    }

    body.simple-yt-tweaks-active ytd-search ytd-video-renderer #channel-info ytd-channel-name #text {
      overflow: hidden !important;
      text-overflow: ellipsis !important;
      white-space: nowrap !important;
    }

    body.simple-yt-tweaks-active ytd-search ytd-video-renderer #badges:not([hidden]),
    body.simple-yt-tweaks-active ytd-search ytd-video-renderer ytd-video-meta-block #metadata-line ytd-badge-supported-renderer:not([hidden]) {
      display: inline-flex !important;
      align-items: center !important;
      width: auto !important;
      min-width: 0 !important;
      margin: 0 0 0 4px !important;
    }

    body.simple-yt-tweaks-active ytd-search ytd-video-renderer .${SEARCH_BADGE_ROW_CLASS} {
      display: inline-flex !important;
      align-items: center !important;
      flex: 0 0 auto !important;
      gap: 4px !important;
      min-width: 0 !important;
    }

    body.simple-yt-tweaks-active ytd-search ytd-video-renderer .${SEARCH_BADGE_ROW_CLASS}:empty {
      display: none !important;
    }
  `;
}

function buildSidebarFoundationCss(): string {
  return `
    body.simple-yt-tweaks-active #related,
    body.simple-yt-tweaks-active ytd-watch-next-secondary-results-renderer,
    body.simple-yt-tweaks-active ytd-watch-next-secondary-results-renderer #items,
    body.simple-yt-tweaks-active ytd-watch-next-secondary-results-renderer #contents,
    body.simple-yt-tweaks-active ytd-compact-video-renderer,
    body.simple-yt-tweaks-active ytd-compact-video-renderer #dismissible,
    body.simple-yt-tweaks-active ytd-compact-video-renderer #thumbnail-container,
    body.simple-yt-tweaks-active #related yt-lockup-view-model,
    body.simple-yt-tweaks-active #related .ytLockupViewModelHost,
    body.simple-yt-tweaks-active ytd-watch-next-secondary-results-renderer yt-lockup-view-model,
    body.simple-yt-tweaks-active ytd-watch-next-secondary-results-renderer .ytLockupViewModelHost {
      overflow: visible !important;
    }
  `;
}

function scopedSelectors(scopes: string[], selectors: string[]): string {
  return scopes
    .flatMap((scope) => selectors.map((selector) => `${scope} ${selector}`))
    .join(',\n    ');
}

function buildSidebarHoverCss(settings: Settings): string {
  const scopes = [
    settings.defaultRecommendedHoverGrow ? 'body.simple-yt-tweaks-active.simple-yt-tweaks-default-view' : '',
    settings.theaterRecommendedHoverGrow ? 'body.simple-yt-tweaks-active.simple-yt-tweaks-theater' : '',
  ].filter(Boolean);

  if (!scopes.length) return '';

  const cards = scopedSelectors(scopes, [
    'ytd-compact-video-renderer',
    '#related yt-lockup-view-model:has(a[href*="/watch"])',
    'ytd-watch-next-secondary-results-renderer yt-lockup-view-model:has(a[href*="/watch"])',
  ]);
  const media = scopedSelectors(scopes, [
    'ytd-compact-video-renderer ytd-thumbnail',
    '#related yt-lockup-view-model:has(a[href*="/watch"]) yt-thumbnail-view-model',
    'ytd-watch-next-secondary-results-renderer yt-lockup-view-model:has(a[href*="/watch"]) yt-thumbnail-view-model',
  ]);
  const readyMedia = scopedSelectors(scopes, [
    `ytd-compact-video-renderer.${GRID_HOVER_READY_CLASS} ytd-thumbnail`,
    `#related yt-lockup-view-model.${GRID_HOVER_READY_CLASS}:has(a[href*="/watch"]) yt-thumbnail-view-model`,
    `ytd-watch-next-secondary-results-renderer yt-lockup-view-model.${GRID_HOVER_READY_CLASS}:has(a[href*="/watch"]) yt-thumbnail-view-model`,
  ]);
  const readyCards = scopedSelectors(scopes, [
    `ytd-compact-video-renderer.${GRID_HOVER_READY_CLASS}`,
    `#related yt-lockup-view-model.${GRID_HOVER_READY_CLASS}:has(a[href*="/watch"])`,
    `ytd-watch-next-secondary-results-renderer yt-lockup-view-model.${GRID_HOVER_READY_CLASS}:has(a[href*="/watch"])`,
  ]);
  const overlayButtons = scopedSelectors(scopes, [
    `#related yt-lockup-view-model.${GRID_HOVER_READY_CLASS}:has(a[href*="/watch"]) thumbnail-overlay-button-view-model`,
    `ytd-watch-next-secondary-results-renderer yt-lockup-view-model.${GRID_HOVER_READY_CLASS}:has(a[href*="/watch"]) thumbnail-overlay-button-view-model`,
    `ytd-compact-video-renderer.${GRID_HOVER_READY_CLASS} ytd-thumbnail-overlay-toggle-button-renderer`,
  ]);
  const overlayButtonElements = scopedSelectors(scopes, [
    `#related yt-lockup-view-model.${GRID_HOVER_READY_CLASS}:has(a[href*="/watch"]) thumbnail-overlay-button-view-model button`,
    `ytd-watch-next-secondary-results-renderer yt-lockup-view-model.${GRID_HOVER_READY_CLASS}:has(a[href*="/watch"]) thumbnail-overlay-button-view-model button`,
    `ytd-compact-video-renderer.${GRID_HOVER_READY_CLASS} ytd-thumbnail-overlay-toggle-button-renderer button`,
  ]);
  const overlayButtonIcons = scopedSelectors(scopes, [
    `#related yt-lockup-view-model.${GRID_HOVER_READY_CLASS}:has(a[href*="/watch"]) thumbnail-overlay-button-view-model button .ytIconWrapperHost`,
    `ytd-watch-next-secondary-results-renderer yt-lockup-view-model.${GRID_HOVER_READY_CLASS}:has(a[href*="/watch"]) thumbnail-overlay-button-view-model button .ytIconWrapperHost`,
    `ytd-compact-video-renderer.${GRID_HOVER_READY_CLASS} ytd-thumbnail-overlay-toggle-button-renderer button .ytIconWrapperHost`,
  ]);

  return `
    ${cards} {
      isolation: isolate !important;
      overflow: visible !important;
    }

    ${readyCards} {
      position: relative !important;
      z-index: 80 !important;
    }

    ${media} {
      display: block !important;
      position: relative !important;
      z-index: 1 !important;
      border-radius: 10px !important;
      overflow: hidden !important;
      transform-origin: center center !important;
      scale: 1 !important;
      transition:
        filter 0.14s ease,
        scale 0.14s ease,
        box-shadow 0.14s ease !important;
      will-change: scale !important;
    }

    ${readyMedia} {
      filter: brightness(1.06) contrast(1.03) saturate(1.03) !important;
      scale: 1.46 !important;
      box-shadow: 0 16px 34px rgba(0, 0, 0, 0.4) !important;
    }

    ${overlayButtons} {
      scale: 1 !important;
      transform: scale(0.68) !important;
      transform-origin: top right !important;
    }

    ${overlayButtonElements} {
      width: 24px !important;
      height: 24px !important;
      min-width: 24px !important;
      min-height: 24px !important;
    }

    ${overlayButtonIcons} {
      width: 18px !important;
      height: 18px !important;
    }
  `;
}

export function buildGridHoverCss(settings: Settings): string {
  const searchGridCss = settings.generalApplyFeedColumnsToSearch
    ? buildSearchGridCss(settings.generalFeedColumns)
    : '';
  const sidebarHoverCss = buildSidebarHoverCss(settings);

  return `
    ${searchGridCss}
    ${sidebarHoverCss ? buildSidebarFoundationCss() : ''}
    ${sidebarHoverCss}
  `;
}

function getHoverDelay(card: HTMLElement): number {
  if (card.matches(SIDEBAR_CARD_SELECTOR)) return SIDEBAR_HOVER_DELAY_MS;
  return FALLBACK_HOVER_DELAY_MS;
}

function hasWatchTarget(card: HTMLElement): boolean {
  return Boolean(
    card.querySelector(
      [
        '.ytLockupViewModelContentImage[href^="/watch"]',
        '.ytLockupViewModelContentImage[href*="youtube.com/watch"]',
        'a#thumbnail[href*="/watch"]',
        'a[href^="/watch"]',
        'a[href*="youtube.com/watch"]',
      ].join(','),
    ),
  );
}

function isEligibleHoverCard(card: HTMLElement): boolean {
  if (card.classList.contains(GENERAL_HIDDEN_CLASS) || card.hidden) return false;
  if (!hasWatchTarget(card)) return false;
  if (card.querySelector('a[href*="/shorts/"], a[href="/shorts"]')) return false;
  return true;
}

function getHoverCard(target: EventTarget | null): HTMLElement | null {
  if (!(target instanceof Element)) return null;
  const card = target.closest<HTMLElement>(HOVER_CARD_SELECTOR);
  if (!card || !isEligibleHoverCard(card)) return null;
  return card;
}

function clearHoverReadyTimer(): void {
  if (hoverReadyTimer === null) return;
  window.clearTimeout(hoverReadyTimer);
  hoverReadyTimer = null;
}

function clearHoverClearTimer(): void {
  if (hoverClearTimer === null) return;
  window.clearTimeout(hoverClearTimer);
  hoverClearTimer = null;
}

function clearActiveHoverCard(): void {
  clearHoverReadyTimer();
  clearHoverClearTimer();
  activeHoverCard?.classList.remove(GRID_HOVER_READY_CLASS);
  activeHoverCard = null;
}

function scheduleHoverReady(card: HTMLElement): void {
  if (activeHoverCard !== card) {
    clearActiveHoverCard();
    activeHoverCard = card;
  }

  if (!shouldArmHoverGrowth(card)) return;

  if (hoverReadyTimer !== null || card.classList.contains(GRID_HOVER_READY_CLASS)) return;

  clearHoverClearTimer();

  hoverReadyTimer = window.setTimeout(() => {
    hoverReadyTimer = null;
    if (activeHoverCard !== card || !isEligibleHoverCard(card) || !shouldArmHoverGrowth(card)) return;
    card.classList.add(GRID_HOVER_READY_CLASS);
  }, getHoverDelay(card));
}

function getElementUnderPointer(): Element | null {
  if (!Number.isFinite(lastPointerX) || !Number.isFinite(lastPointerY)) return null;
  return document.elementFromPoint(lastPointerX, lastPointerY);
}

function isPointerInsideCard(card: HTMLElement): boolean {
  const target = getElementUnderPointer();
  if (target && card.contains(target)) return true;

  const rect = card.getBoundingClientRect();
  const tolerance = 12;
  return (
    lastPointerX >= rect.left - tolerance &&
    lastPointerX <= rect.right + tolerance &&
    lastPointerY >= rect.top - tolerance &&
    lastPointerY <= rect.bottom + tolerance
  );
}

function isMediaTargetForCard(target: EventTarget | null, card: HTMLElement): boolean {
  if (!(target instanceof Element)) return false;
  const media = target.closest(HOVER_MEDIA_SELECTOR);
  return Boolean(media && card.contains(media));
}

function isPointerOverMedia(card: HTMLElement): boolean {
  return isMediaTargetForCard(getElementUnderPointer(), card);
}

function cardHasPreviewSurface(card: HTMLElement): boolean {
  return card.hasAttribute('is-mouse-over-for-preview') || Boolean(card.querySelector(PREVIEW_CONTAINER_SELECTOR));
}

function shouldArmHoverGrowth(card: HTMLElement): boolean {
  return isPointerOverMedia(card) || cardHasPreviewSurface(card);
}

function scheduleHoverClear(card: HTMLElement): void {
  clearHoverClearTimer();

  hoverClearTimer = window.setTimeout(() => {
    hoverClearTimer = null;
    if (activeHoverCard !== card) return;

    if (!document.body.contains(card) || !isPointerInsideCard(card)) {
      clearActiveHoverCard();
      return;
    }

    if (!shouldArmHoverGrowth(card)) {
      card.classList.remove(GRID_HOVER_READY_CLASS);
      clearHoverReadyTimer();
    }
  }, 90);
}

function removeGridHoverClasses(): void {
  for (const card of document.querySelectorAll<HTMLElement>(
    `.${GRID_HOVER_READY_CLASS}, .${GRID_HOVER_MEDIA_CLASS}, .${GRID_EDGE_START_CLASS}, .${GRID_EDGE_END_CLASS}`,
  )) {
    card.classList.remove(GRID_HOVER_READY_CLASS, GRID_HOVER_MEDIA_CLASS, GRID_EDGE_START_CLASS, GRID_EDGE_END_CLASS);
  }
}

function ensureSearchBadgeRow(card: HTMLElement): HTMLElement | null {
  const channelInfo = card.querySelector<HTMLElement>('#channel-info');
  if (!channelInfo) return null;

  let row = channelInfo.querySelector<HTMLElement>(`.${SEARCH_BADGE_ROW_CLASS}`);
  if (!row) {
    row = document.createElement('span');
    row.className = SEARCH_BADGE_ROW_CLASS;
    channelInfo.append(row);
  }

  return row;
}

function moveSearchBadgesToChannelRow(): void {
  for (const card of document.querySelectorAll<HTMLElement>('ytd-search ytd-video-renderer')) {
    const row = ensureSearchBadgeRow(card);
    if (!row) continue;

    for (const badge of card.querySelectorAll<HTMLElement>(
      [
        ':scope > #dismissible > .text-wrapper > #badges:not([hidden])',
        ':scope > #dismissible #meta > #badges:not([hidden])',
        ':scope > #dismissible #additional-metadata-line ytd-badge-supported-renderer:not([hidden])',
        ':scope > #dismissible ytd-video-meta-block #metadata-line > ytd-badge-supported-renderer:not([hidden])',
      ].join(','),
    )) {
      if (badge.closest(`.${SEARCH_BADGE_ROW_CLASS}`)) continue;
      row.append(badge);
    }

    if (!row.children.length) {
      row.remove();
    }
  }
}

function normalizeSearchGridContinuations(): void {
  for (const sectionList of document.querySelectorAll<HTMLElement>(SEARCH_GRID_CONTENTS_SELECTOR)) {
    for (const continuation of sectionList.querySelectorAll<HTMLElement>('ytd-continuation-item-renderer')) {
      sectionList.append(continuation);
    }

    for (const section of sectionList.querySelectorAll<HTMLElement>(':scope > ytd-item-section-renderer')) {
      if (
        !section.querySelector('ytd-video-renderer, ytd-grid-video-renderer, ytd-channel-renderer') &&
        !section.textContent?.trim()
      ) {
        section.remove();
      }
    }
  }
}

function isRecommendedHoverGrowEnabled(settings: Settings): boolean {
  return settings.defaultRecommendedHoverGrow || settings.theaterRecommendedHoverGrow;
}

export function syncGridHoverState(settings: Settings): void {
  // Home/search feed previews stay native; avoid writing YouTube's own column metadata during preview startup.

  if (settings.generalApplyFeedColumnsToSearch) {
    moveSearchBadgesToChannelRow();
    normalizeSearchGridContinuations();
  }

  if (!document.body || !isRecommendedHoverGrowEnabled(settings)) {
    clearActiveHoverCard();
    removeGridHoverClasses();
    return;
  }

  if (
    activeHoverCard &&
    document.body.contains(activeHoverCard) &&
    isPointerInsideCard(activeHoverCard) &&
    isEligibleHoverCard(activeHoverCard) &&
    shouldArmHoverGrowth(activeHoverCard)
  ) {
    scheduleHoverReady(activeHoverCard);
  }

  if (activeHoverCard && (!document.body.contains(activeHoverCard) || !isEligibleHoverCard(activeHoverCard))) {
    clearActiveHoverCard();
  }
}

export function bindGridHoverHandlers(getSettings: () => Settings): void {
  if (handlersBound) return;
  handlersBound = true;

  document.addEventListener(
    'pointerover',
    (event) => {
      lastPointerX = event.clientX;
      lastPointerY = event.clientY;
      if (!isRecommendedHoverGrowEnabled(getSettings())) return;

      const card = getHoverCard(event.target);
      if (!card) return;
      if (!isMediaTargetForCard(event.target, card) && !cardHasPreviewSurface(card)) {
        if (activeHoverCard && activeHoverCard !== card) clearActiveHoverCard();
        return;
      }

      scheduleHoverReady(card);
    },
    { passive: true },
  );

  document.addEventListener(
    'pointermove',
    (event) => {
      lastPointerX = event.clientX;
      lastPointerY = event.clientY;
      if (!isRecommendedHoverGrowEnabled(getSettings())) return;

      const card = activeHoverCard ?? getHoverCard(event.target);
      if (!card || !isEligibleHoverCard(card)) return;

      if (shouldArmHoverGrowth(card)) {
        scheduleHoverReady(card);
        return;
      }

      scheduleHoverClear(card);
    },
    { passive: true },
  );

  document.addEventListener(
    'pointerout',
    (event) => {
      lastPointerX = event.clientX;
      lastPointerY = event.clientY;
      const card = activeHoverCard;
      if (!card) return;
      if (event.relatedTarget instanceof Node && card.contains(event.relatedTarget)) {
        scheduleHoverClear(card);
        return;
      }

      scheduleHoverClear(card);
    },
    { passive: true },
  );

  document.addEventListener(
    'focusin',
    (event) => {
      if (!isRecommendedHoverGrowEnabled(getSettings())) return;

      const card = getHoverCard(event.target);
      if (!card) return;
      scheduleHoverReady(card);
    },
    { passive: true },
  );

  document.addEventListener('focusout', () => {
    window.setTimeout(() => {
      const card = activeHoverCard;
      if (!card || (document.activeElement instanceof Node && card.contains(document.activeElement))) {
        return;
      }

      clearActiveHoverCard();
    }, 0);
  });

  document.addEventListener('pointercancel', clearActiveHoverCard, { passive: true });
  window.addEventListener(
    'blur',
    () => {
      lastPointerX = Number.POSITIVE_INFINITY;
      lastPointerY = Number.POSITIVE_INFINITY;
      clearActiveHoverCard();
    },
    { passive: true },
  );
}
