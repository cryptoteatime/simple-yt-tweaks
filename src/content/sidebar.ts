import { query, queryAll, getElementLabel, elementMatchesAnyLabel, labelMatchesEntry, isDedicatedShortsPage, isVisibleNode } from './dom';
import {
  GENERAL_HIDDEN_CLASS,
  SIDEBAR_HOME_NEUTRAL_CLASS,
  SIDEBAR_ITEM_LABELS,
  SIDEBAR_SUBSCRIPTIONS_CLASS,
  SIDEBAR_SUBSCRIPTIONS_ICON_CLASS,
  SPONSORED_CARD_SELECTORS,
  SUBSCRIPTIONS_ICON_SVG,
} from './selectors';
import type { Settings } from './settings';
import { state } from './state';

const HOME_SPONSORED_ITEM_SELECTORS = [
  ...SPONSORED_CARD_SELECTORS,
  'ad-badge-view-model',
  'ad-button-group-view-model',
  'ad-button-view-model',
  'ad-details-line-view-model',
  'feed-ad-metadata-view-model',
  'video-display-button-group-layout-view-model',
  'video-display-compact-button-group-layout-view-model',
  '.ytBadgeShapeAd',
  'a[href*="googleadservices.com"]',
  'a[href*="doubleclick.net"]',
].join(',');

const HOME_SPONSORED_CONTAINER_CSS_SELECTOR = [
  'ytd-rich-item-renderer',
  'ytd-rich-section-renderer',
  'ytd-feed-nudge-renderer',
].map((selector) =>
  `body.simple-yt-tweaks-active ytd-browse[page-subtype="home"] ytd-rich-grid-renderer ${selector}:has(${HOME_SPONSORED_ITEM_SELECTORS})`,
).join(',\n    ');

export function buildGeneralCss(settings: Settings): string {
  const generalHideEndScreenCards = settings.generalHideEndScreenCards;
  const generalFeedColumns = settings.generalFeedColumns;
  const generalHideShorts = settings.generalHideShorts && !isDedicatedShortsPage();
  const generalHideSponsoredPosts = settings.generalHideSponsoredPosts;

  return `
    body.simple-yt-tweaks-active ytd-browse[page-subtype="home"] ytd-rich-grid-renderer,
    body.simple-yt-tweaks-active ytd-browse[page-subtype="home"] ytd-rich-grid-renderer #contents {
      --ytd-rich-grid-items-per-row: ${generalFeedColumns} !important;
      --ytd-rich-grid-posts-per-row: ${generalFeedColumns} !important;
      --ytd-rich-grid-slim-items-per-row: ${generalFeedColumns} !important;
      --ytd-rich-grid-game-cards-per-row: ${generalFeedColumns} !important;
    }

    body.simple-yt-tweaks-active ytd-browse[page-subtype="home"] ytd-rich-grid-renderer #contents {
      display: grid !important;
      grid-template-columns: repeat(${generalFeedColumns}, minmax(0, 1fr)) !important;
      grid-auto-flow: row dense !important;
      align-items: start !important;
      column-gap: 16px !important;
      row-gap: 24px !important;
    }

    body.simple-yt-tweaks-active ytd-browse[page-subtype="home"] ytd-rich-grid-row {
      display: contents !important;
    }

    body.simple-yt-tweaks-active ytd-browse[page-subtype="home"] ytd-rich-item-renderer {
      width: auto !important;
      margin: 0 !important;
      min-width: 0 !important;
      max-width: none !important;
    }

    body.simple-yt-tweaks-active ytd-browse[page-subtype="home"] ytd-rich-grid-renderer ytd-rich-item-renderer.${GENERAL_HIDDEN_CLASS},
    body.simple-yt-tweaks-active ytd-browse[page-subtype="home"] ytd-rich-grid-renderer ytd-rich-item-renderer:has(.${GENERAL_HIDDEN_CLASS}),
    body.simple-yt-tweaks-active ytd-browse[page-subtype="home"] ytd-rich-grid-renderer ytd-rich-section-renderer.${GENERAL_HIDDEN_CLASS},
    body.simple-yt-tweaks-active ytd-browse[page-subtype="home"] ytd-rich-grid-renderer ytd-rich-section-renderer:has(.${GENERAL_HIDDEN_CLASS}),
    body.simple-yt-tweaks-active ytd-browse[page-subtype="home"] ytd-rich-grid-renderer ytd-feed-nudge-renderer.${GENERAL_HIDDEN_CLASS},
    body.simple-yt-tweaks-active ytd-browse[page-subtype="home"] ytd-rich-grid-renderer ytd-feed-nudge-renderer:has(.${GENERAL_HIDDEN_CLASS}) {
      display: none !important;
    }

    ${generalHideSponsoredPosts ? `
    ${HOME_SPONSORED_CONTAINER_CSS_SELECTOR} {
      display: none !important;
    }
    ` : ''}

    ${generalHideEndScreenCards ? `
    body.simple-yt-tweaks-active .ytp-ce-element,
    body.simple-yt-tweaks-active .ytp-ce-video,
    body.simple-yt-tweaks-active .ytp-ce-playlist,
    body.simple-yt-tweaks-active .ytp-ce-channel,
    body.simple-yt-tweaks-active .ytp-endscreen-content {
      display: none !important;
      opacity: 0 !important;
      pointer-events: none !important;
      visibility: hidden !important;
    }
    ` : ''}

    ${generalHideShorts ? `
    body.simple-yt-tweaks-active ytd-rich-shelf-renderer[is-shorts],
    body.simple-yt-tweaks-active ytd-reel-shelf-renderer,
    body.simple-yt-tweaks-active ytd-reel-video-renderer,
    body.simple-yt-tweaks-active ytd-reel-item-renderer,
    body.simple-yt-tweaks-active grid-shelf-view-model:has(a[href*="/shorts/"]),
    body.simple-yt-tweaks-active ytm-shorts-lockup-view-model-v2,
    body.simple-yt-tweaks-active ytm-shorts-lockup-view-model,
    body.simple-yt-tweaks-active ytd-shorts,
    body.simple-yt-tweaks-active ytd-video-renderer:has(a[href*="/shorts/"]),
    body.simple-yt-tweaks-active ytd-grid-video-renderer:has(a[href*="/shorts/"]),
    body.simple-yt-tweaks-active ytd-rich-item-renderer:has(a[href*="/shorts/"]),
    body.simple-yt-tweaks-active ytd-compact-video-renderer:has(a[href*="/shorts/"]),
    body.simple-yt-tweaks-active ytd-shelf-renderer:has(a[href*="/shorts/"]),
    body.simple-yt-tweaks-active yt-lockup-view-model:has(a[href*="/shorts/"]),
    body.simple-yt-tweaks-active ytd-item-section-renderer:has(ytd-reel-shelf-renderer) {
      display: none !important;
    }
    ` : ''}
  `;
}

export function buildSidebarCss(settings: Settings): string {
  const generalSidebarCleanup = settings.generalSidebarCleanup;
  const generalHideSidebar = generalSidebarCleanup && settings.generalHideSidebar;
  const generalHideSidebarShorts =
    settings.generalHideSidebarShorts &&
    (generalSidebarCleanup || settings.generalHideShorts);

  return `
    ${generalSidebarCleanup ? `
    body.simple-yt-tweaks-active .${SIDEBAR_SUBSCRIPTIONS_CLASS} #header-entry .guide-icon,
    body.simple-yt-tweaks-active .${SIDEBAR_SUBSCRIPTIONS_CLASS} #header-entry yt-icon,
    body.simple-yt-tweaks-active .${SIDEBAR_SUBSCRIPTIONS_CLASS} #header-entry yt-img-shadow {
      display: none !important;
      visibility: hidden !important;
    }

    body.simple-yt-tweaks-active .${SIDEBAR_SUBSCRIPTIONS_CLASS} .${SIDEBAR_SUBSCRIPTIONS_ICON_CLASS} {
      display: inline-flex !important;
      width: 24px !important;
      height: 24px !important;
      margin-right: 24px !important;
      align-items: center !important;
      justify-content: center !important;
      color: currentColor !important;
    }

    body.simple-yt-tweaks-active .${SIDEBAR_SUBSCRIPTIONS_CLASS} .${SIDEBAR_SUBSCRIPTIONS_ICON_CLASS} svg {
      width: 24px !important;
      height: 24px !important;
      fill: currentColor !important;
    }

    body.simple-yt-tweaks-active .${SIDEBAR_SUBSCRIPTIONS_CLASS} #header-entry .arrow-icon {
      display: none !important;
    }

    body.simple-yt-tweaks-active .${SIDEBAR_HOME_NEUTRAL_CLASS},
    body.simple-yt-tweaks-active .${SIDEBAR_HOME_NEUTRAL_CLASS} #endpoint,
    body.simple-yt-tweaks-active .${SIDEBAR_HOME_NEUTRAL_CLASS} tp-yt-paper-item,
    body.simple-yt-tweaks-active .${SIDEBAR_HOME_NEUTRAL_CLASS} a,
    body.simple-yt-tweaks-active .${SIDEBAR_HOME_NEUTRAL_CLASS} #contentContainer {
      --paper-item-focused-before-background: transparent !important;
      background: transparent !important;
      background-color: transparent !important;
      box-shadow: none !important;
    }

    body.simple-yt-tweaks-active .${SIDEBAR_HOME_NEUTRAL_CLASS}:hover,
    body.simple-yt-tweaks-active .${SIDEBAR_HOME_NEUTRAL_CLASS}:hover #endpoint,
    body.simple-yt-tweaks-active .${SIDEBAR_HOME_NEUTRAL_CLASS}:hover tp-yt-paper-item,
    body.simple-yt-tweaks-active .${SIDEBAR_HOME_NEUTRAL_CLASS}:hover a,
    body.simple-yt-tweaks-active .${SIDEBAR_HOME_NEUTRAL_CLASS}:hover #contentContainer,
    body.simple-yt-tweaks-active .${SIDEBAR_HOME_NEUTRAL_CLASS} #endpoint:hover,
    body.simple-yt-tweaks-active .${SIDEBAR_HOME_NEUTRAL_CLASS} tp-yt-paper-item:hover,
    body.simple-yt-tweaks-active .${SIDEBAR_HOME_NEUTRAL_CLASS} a:hover {
      --paper-item-focused-before-background: transparent !important;
      background: transparent !important;
      background-color: transparent !important;
      box-shadow: none !important;
    }
    ` : ''}

    ${generalHideSidebar ? `
    body.simple-yt-tweaks-active #guide,
    body.simple-yt-tweaks-active #guide-content,
    body.simple-yt-tweaks-active ytd-guide-renderer,
    body.simple-yt-tweaks-active ytd-mini-guide-renderer,
    body.simple-yt-tweaks-active #guide-spacer {
      display: none !important;
    }

    body.simple-yt-tweaks-active #guide-button,
    body.simple-yt-tweaks-active ytd-masthead #guide-button,
    body.simple-yt-tweaks-active ytd-masthead button[aria-label*="Guide"],
    body.simple-yt-tweaks-active ytd-masthead button[aria-label*="menu"] {
      display: none !important;
    }

    body.simple-yt-tweaks-active #page-manager,
    body.simple-yt-tweaks-active ytd-page-manager,
    body.simple-yt-tweaks-active #content {
      margin-left: 0 !important;
    }
    ` : ''}

    ${generalHideSidebarShorts ? `
    body.simple-yt-tweaks-active ytd-mini-guide-entry-renderer[aria-label*="Shorts"],
    body.simple-yt-tweaks-active ytd-mini-guide-entry-renderer[title*="Shorts"],
    body.simple-yt-tweaks-active ytd-guide-entry-renderer:has(a[href^="/shorts"]),
    body.simple-yt-tweaks-active ytd-guide-entry-renderer:has(a[title*="Shorts"]),
    body.simple-yt-tweaks-active ytd-guide-entry-renderer:has(a[aria-label*="Shorts"]) {
      display: none !important;
    }
    ` : ''}
  `;
}

export function clearGeneralHiddenTargets(): void {
  for (const target of queryAll<HTMLElement>(`.${GENERAL_HIDDEN_CLASS}`)) {
    target.classList.remove(GENERAL_HIDDEN_CLASS);
  }

  for (const target of queryAll<HTMLElement>(`.${SIDEBAR_SUBSCRIPTIONS_CLASS}`)) {
    target.classList.remove(SIDEBAR_SUBSCRIPTIONS_CLASS);
  }

  for (const target of queryAll<HTMLElement>(`.${SIDEBAR_SUBSCRIPTIONS_ICON_CLASS}`)) {
    target.remove();
  }

  for (const target of queryAll<HTMLElement>(`.${SIDEBAR_HOME_NEUTRAL_CLASS}`)) {
    target.classList.remove(SIDEBAR_HOME_NEUTRAL_CLASS);
  }
}

function hideElement(element: Element | null): void {
  if (element instanceof HTMLElement) {
    element.classList.add(GENERAL_HIDDEN_CLASS);
  }
}

function removeElement(element: Element | null): void {
  if (element instanceof HTMLElement) {
    element.remove();
  }
}

function hideClosest(element: Element, selector: string): void {
  hideElement(element.closest(selector));
}

function removeClosestTag(element: Element, tagNames: readonly string[]): void {
  let current: Element | null = element;

  while (current && current !== document.documentElement) {
    if (tagNames.includes(current.tagName.toLowerCase())) {
      removeElement(current);
      return;
    }

    current = current.parentElement;
  }
}

function isSponsoredBadge(element: HTMLElement): boolean {
  const label = getElementLabel(element);
  return label === 'sponsored' || label.startsWith('sponsored ');
}

function isSponsoredHomeFeedItem(item: HTMLElement): boolean {
  if (query<HTMLElement>(HOME_SPONSORED_ITEM_SELECTORS, item)) return true;
  if (query<HTMLElement>(`.${GENERAL_HIDDEN_CLASS}`, item)) return true;

  return queryAll<HTMLElement>(
    [
      'ad-badge-view-model',
      'badge-shape.ytBadgeShapeAd',
      '.ytBadgeShapeAd',
    ].join(','),
    item,
  ).some(isSponsoredBadge);
}

function removeSponsoredHomeFeedItems(): void {
  if (!state.settings.generalHideSponsoredPosts) return;

  for (const item of queryAll<HTMLElement>(
    'ytd-browse[page-subtype="home"] ytd-rich-grid-renderer #contents ytd-rich-item-renderer',
  )) {
    if (isSponsoredHomeFeedItem(item)) {
      item.remove();
    }
  }
}

function getSidebarSectionHeading(section: HTMLElement): string {
  const heading = query<HTMLElement>('#guide-section-title, #title, h3', section);
  return heading ? getElementLabel(heading) : '';
}

function getTopLevelSidebarSections(): HTMLElement[] {
  return queryAll<HTMLElement>(
    [
      '#guide ytd-guide-renderer > #sections > ytd-guide-section-renderer',
      'ytd-guide-renderer > #sections > ytd-guide-section-renderer',
    ].join(','),
  );
}

function sectionHasSidebarLink(section: HTMLElement, href: string): boolean {
  return Boolean(query(`a[href="${href}"]`, section));
}

function getSidebarSection(
  kind: 'subscriptions' | 'you' | 'explore' | 'moreFromYouTube' | 'reportHistory',
): HTMLElement | null {
  for (const section of getTopLevelSidebarSections()) {
    const heading = getSidebarSectionHeading(section);

    if (kind === 'subscriptions' && sectionHasSidebarLink(section, '/feed/subscriptions')) {
      return section;
    }

    if (kind === 'you' && sectionHasSidebarLink(section, '/feed/you')) {
      return section;
    }

    if (kind === 'explore' && labelMatchesEntry(heading, 'explore')) {
      return section;
    }

    if (kind === 'moreFromYouTube' && labelMatchesEntry(heading, 'more from youtube')) {
      return section;
    }

    if (kind === 'reportHistory' && sectionHasSidebarLink(section, '/reporthistory')) {
      return section;
    }
  }

  return null;
}

function clickElement(element: HTMLElement | null): void {
  if (!element) return;
  element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
}

function stripSidebarSelectedState(entry: HTMLElement): void {
  if (query<HTMLAnchorElement>('a[href="/"], a[href="https://www.youtube.com/"]', entry)) {
    return;
  }

  for (const target of [
    entry,
    query<HTMLElement>('#endpoint', entry),
    query<HTMLElement>('tp-yt-paper-item', entry),
    query<HTMLElement>('a', entry),
    query<HTMLElement>('#contentContainer', entry),
  ]) {
    if (!target) continue;
    target.removeAttribute('active');
    target.removeAttribute('selected');
    if (target.getAttribute('aria-current') === 'page') {
      target.removeAttribute('aria-current');
    }
    target.classList.remove('iron-selected');
    target.classList.remove('selected');
  }
}

function entryMatchesCurrentLocation(entry: HTMLElement): boolean {
  const endpoint =
    query<HTMLAnchorElement>('#endpoint[href], a[href]', entry) ??
    query<HTMLAnchorElement>('a[href]', entry);
  if (!endpoint) return false;

  try {
    const url = new URL(endpoint.href, location.origin);
    if (url.origin !== location.origin) return false;

    if (location.pathname === '/' || location.pathname === '') {
      return url.pathname === '/' || url.pathname === '';
    }

    if (location.pathname.startsWith('/shorts/')) {
      return url.pathname === '/shorts';
    }

    return url.pathname === location.pathname;
  } catch {
    return false;
  }
}

export function updateSidebarSectionPolish(): void {
  if (!state.settings.generalSidebarCleanup || state.settings.generalHideSidebar) {
    return;
  }

  const subscriptionsSection = getSidebarSection('subscriptions');
  if (subscriptionsSection && !state.settings.generalHideSidebarSubscriptions) {
    subscriptionsSection.classList.add(SIDEBAR_SUBSCRIPTIONS_CLASS);
    const headerEntry = query<HTMLElement>('#header-entry', subscriptionsSection);
    const guideIcon = query<HTMLElement>('#header-entry .guide-icon', subscriptionsSection);
    const imageShadow = query<HTMLElement>('#header-entry yt-img-shadow', subscriptionsSection);
    const title = query<HTMLElement>('#header-entry .title', subscriptionsSection);
    const existingCustomIcon = query<HTMLElement>(`.${SIDEBAR_SUBSCRIPTIONS_ICON_CLASS}`, subscriptionsSection);

    hideElement(guideIcon);
    hideElement(imageShadow);

    if (headerEntry && title && !existingCustomIcon) {
      const icon = document.createElement('span');
      icon.className = SIDEBAR_SUBSCRIPTIONS_ICON_CLASS;
      icon.setAttribute('aria-hidden', 'true');
      icon.innerHTML = SUBSCRIPTIONS_ICON_SVG;
      title.parentElement?.insertBefore(icon, title);
    }

    const subscriptionsItems = query<HTMLElement>('#items', subscriptionsSection);
    if (subscriptionsItems) {
      for (const child of Array.from(subscriptionsItems.children)) {
        if (child.tagName === 'YTD-GUIDE-COLLAPSIBLE-SECTION-ENTRY-RENDERER') continue;
        hideElement(child);
      }
    }

    hideElement(query('#section-items', subscriptionsSection));
    hideElement(query('ytd-guide-collapsible-entry-renderer', subscriptionsSection));
    hideElement(query('#header-entry .arrow-icon', subscriptionsSection));
  }

  const youSection = getSidebarSection('you');
  if (youSection && !state.settings.generalHideSidebarYou) {
    const youCollapsible = query<HTMLElement>('ytd-guide-collapsible-entry-renderer', youSection);
    const expanded = youCollapsible ? query<HTMLElement>('#expanded', youCollapsible) : null;
    const expanderItem = youCollapsible ? query<HTMLElement>('#expander-item', youCollapsible) : null;
    const isExpanded = expanded
      ? !expanded.hasAttribute('hidden') && window.getComputedStyle(expanded).display !== 'none'
      : true;

    if (expanderItem && !isExpanded) {
      clickElement(expanderItem);
    }

    hideElement(expanderItem);
    hideElement(youCollapsible ? query('#collapser-item', youCollapsible) : null);
  }
}

export function updateSponsoredVisibility(): void {
  if (!state.settings.generalHideSponsoredPosts) return;

  for (const target of queryAll<HTMLElement>(SPONSORED_CARD_SELECTORS.join(','))) {
    const onHomeFeed = Boolean(target.closest('ytd-browse[page-subtype="home"]'));

    if (onHomeFeed) {
      removeClosestTag(target, [
        'ytd-rich-item-renderer',
        'ytd-rich-section-renderer',
        'ytd-feed-nudge-renderer',
      ]);
      continue;
    }

    hideClosest(
      target,
      [
        'ytd-search-pyv-renderer',
        'ytd-companion-slot-renderer',
        'ytd-display-ad-renderer',
        'ytd-promoted-sparkles-web-renderer',
        'ytd-ad-slot-renderer',
        'ytd-in-feed-ad-layout-renderer',
        'ytd-banner-promo-renderer',
      ].join(','),
    );
  }

  removeSponsoredHomeFeedItems();
}

export function updateSidebarFooterVisibility(): void {
  if (!state.settings.generalSidebarCleanup || !state.settings.generalHideSidebarFooter) return;

  for (const target of queryAll<HTMLElement>(
    [
      '#guide #footer',
      '#guide #copyright',
      'ytd-guide-renderer #footer',
      'ytd-guide-renderer #copyright',
      'ytd-guide-renderer #legal',
    ].join(','),
  )) {
    hideElement(target);
  }
}

export function updateSidebarItemVisibility(): void {
  const shortsLinkCleanupEnabled =
    state.settings.generalHideSidebarShorts &&
    (state.settings.generalSidebarCleanup || state.settings.generalHideShorts);
  const homeLinkCleanupEnabled =
    state.settings.generalSidebarCleanup && state.settings.generalHideSidebarHome;
  const sectionCleanupEnabled = state.settings.generalSidebarCleanup;

  if (sectionCleanupEnabled && state.settings.generalHideSidebar) return;

  updateSidebarFooterVisibility();

  if (sectionCleanupEnabled && state.settings.generalHideSidebarSubscriptions) {
    hideElement(getSidebarSection('subscriptions'));
  }
  if (sectionCleanupEnabled && state.settings.generalHideSidebarYou) {
    hideElement(getSidebarSection('you'));
  }
  if (sectionCleanupEnabled && state.settings.generalHideSidebarExplore) {
    hideElement(getSidebarSection('explore'));
  }
  if (sectionCleanupEnabled && state.settings.generalHideSidebarMoreFromYouTube) {
    hideElement(getSidebarSection('moreFromYouTube'));
  }
  if (sectionCleanupEnabled && state.settings.generalHideSidebarReportHistory) {
    hideElement(getSidebarSection('reportHistory'));
  }

  if (!homeLinkCleanupEnabled && !shortsLinkCleanupEnabled) return;

  const sidebarItems = queryAll<HTMLElement>(
    [
      '#guide ytd-guide-entry-renderer',
      '#guide ytd-guide-collapsible-entry-renderer',
      '#guide tp-yt-paper-item',
      'ytd-guide-renderer ytd-guide-entry-renderer',
      'ytd-guide-renderer ytd-guide-collapsible-entry-renderer',
      'ytd-guide-renderer tp-yt-paper-item',
      'ytd-mini-guide-renderer ytd-mini-guide-entry-renderer',
      'ytd-guide-renderer a',
    ].join(','),
  );

  for (const item of sidebarItems) {
    if (homeLinkCleanupEnabled && elementMatchesAnyLabel(item, SIDEBAR_ITEM_LABELS.home)) {
      hideElement(item);
      continue;
    }

    if (shortsLinkCleanupEnabled && elementMatchesAnyLabel(item, SIDEBAR_ITEM_LABELS.shorts)) {
      hideElement(item);
    }
  }
}

export function updateShortsVisibility(): void {
  if (!state.settings.generalHideShorts || isDedicatedShortsPage()) return;

  for (const target of queryAll<HTMLElement>(
    [
      'ytd-rich-shelf-renderer[is-shorts]',
      'ytd-reel-shelf-renderer',
      'ytd-reel-video-renderer',
      'ytd-reel-item-renderer',
      'grid-shelf-view-model:has(a[href*="/shorts/"])',
      'ytm-shorts-lockup-view-model-v2',
      'ytm-shorts-lockup-view-model',
    ].join(','),
  )) {
    hideElement(target);
  }

  for (const link of queryAll<HTMLAnchorElement>('a[href*="/shorts/"], a[href="/shorts"]')) {
    hideClosest(
      link,
      [
        'ytd-rich-item-renderer',
        'ytd-video-renderer',
        'ytd-grid-video-renderer',
        'ytd-compact-video-renderer',
        'ytd-reel-video-renderer',
        'ytd-reel-item-renderer',
        'ytd-shelf-renderer',
        'yt-lockup-view-model',
        'grid-shelf-view-model',
        'ytm-shorts-lockup-view-model-v2',
        'ytm-shorts-lockup-view-model',
      ].join(','),
    );
  }

  for (const item of queryAll<HTMLElement>('ytd-rich-section-renderer, ytd-item-section-renderer, ytd-shelf-renderer')) {
    if (
      elementMatchesAnyLabel(item, SIDEBAR_ITEM_LABELS.shorts) &&
      query<HTMLAnchorElement>('a[href*="/shorts/"], a[href="/shorts"]', item)
    ) {
      hideElement(item);
    }
  }
}

export function normalizeHomeFeedLayout(): void {
  const homeFeed = query<HTMLElement>('ytd-browse[page-subtype="home"] ytd-rich-grid-renderer #contents');
  if (!homeFeed) return;

  for (const container of queryAll<HTMLElement>('ytd-rich-section-renderer, ytd-feed-nudge-renderer', homeFeed)) {
    if (
      container.classList.contains(GENERAL_HIDDEN_CLASS) ||
      (state.settings.generalHideSponsoredPosts && isSponsoredHomeFeedItem(container))
    ) {
      container.remove();
    }
  }

  for (const item of queryAll<HTMLElement>('ytd-rich-item-renderer', homeFeed)) {
    if (
      item.classList.contains(GENERAL_HIDDEN_CLASS) ||
      (state.settings.generalHideSponsoredPosts && isSponsoredHomeFeedItem(item))
    ) {
      item.remove();
      continue;
    }

    const hasVisibleChild = Array.from(item.children).some(
      (child) => child instanceof HTMLElement && isVisibleNode(child),
    );

    if (!hasVisibleChild) {
      item.remove();
    }
  }

  for (const row of queryAll<HTMLElement>('ytd-rich-grid-row', homeFeed)) {
    const visibleItems = queryAll<HTMLElement>('ytd-rich-item-renderer', row).filter(isVisibleNode);
    if (visibleItems.length === 0) {
      row.remove();
    }
  }
}

export function updateGeneralVisibility(): void {
  clearGeneralHiddenTargets();

  if (state.settings.generalSidebarCleanup || state.settings.generalHideShorts) {
    updateSidebarItemVisibility();
  }

  if (state.settings.generalSidebarCleanup) {
    updateSidebarSectionPolish();
  }

  updateSponsoredVisibility();
  updateShortsVisibility();
  normalizeHomeFeedLayout();
}

export function isPointerInsideVisibleSidebar(): boolean {
  if (!Number.isFinite(state.lastPointerX) || !Number.isFinite(state.lastPointerY)) {
    return false;
  }

  const sidebarCandidates = queryAll<HTMLElement>(
    [
      'ytd-guide-renderer',
      'ytd-mini-guide-renderer',
      '#guide',
      '#guide-content',
    ].join(','),
  );

  return sidebarCandidates.some((element) => {
    const rect = element.getBoundingClientRect();
    const style = window.getComputedStyle(element);
    const looksLikeLeftGuideSurface = rect.left <= 32 && rect.right <= 420;

    if (
      rect.width <= 0 ||
      rect.height <= 0 ||
      !looksLikeLeftGuideSurface ||
      style.display === 'none' ||
      style.visibility === 'hidden'
    ) {
      return false;
    }

    return (
      state.lastPointerX >= rect.left &&
      state.lastPointerX <= rect.right &&
      state.lastPointerY >= rect.top &&
      state.lastPointerY <= rect.bottom
    );
  });
}

export function clearStaleSidebarItemFocus(): void {
  const activeElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  if (!activeElement) return;
  if (!activeElement.closest('#guide, #guide-content, ytd-guide-renderer, ytd-mini-guide-renderer')) return;
  if (isPointerInsideVisibleSidebar()) return;

  activeElement.blur();
}

export function updateSidebarHomeSelectionState(): void {
  if (!state.settings.generalSidebarCleanup) return;

  const shouldNeutralize = !isPointerInsideVisibleSidebar();
  const entries = queryAll<HTMLElement>(
    [
      '#guide ytd-guide-entry-renderer',
      '#guide ytd-guide-collapsible-entry-renderer',
      '#guide tp-yt-paper-item',
      'ytd-guide-renderer ytd-guide-entry-renderer',
      'ytd-guide-renderer ytd-guide-collapsible-entry-renderer',
      'ytd-guide-renderer tp-yt-paper-item',
      'ytd-mini-guide-renderer ytd-mini-guide-entry-renderer',
    ].join(','),
  );

  for (const entry of entries) {
    if (entryMatchesCurrentLocation(entry)) {
      entry.classList.remove(SIDEBAR_HOME_NEUTRAL_CLASS);
      continue;
    }

    stripSidebarSelectedState(entry);
    entry.classList.toggle(SIDEBAR_HOME_NEUTRAL_CLASS, shouldNeutralize);
  }
}
