import { SELECTORS, GENERAL_HIDDEN_CLASS } from './selectors';
import type { Settings } from './settings';

export function debounce<TArgs extends unknown[]>(
  fn: (...args: TArgs) => void,
  wait = 120,
): (...args: TArgs) => void {
  let timer: number | undefined;

  return (...args: TArgs) => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => fn(...args), wait);
  };
}

export function query<T extends Element = Element>(
  selector: string,
  root: ParentNode = document,
): T | null {
  try {
    return root.querySelector<T>(selector);
  } catch {
    return null;
  }
}

export function queryAll<T extends Element = Element>(
  selector: string,
  root: ParentNode = document,
): T[] {
  try {
    return [...root.querySelectorAll<T>(selector)];
  } catch {
    return [];
  }
}

export function getVideo(): HTMLVideoElement | null {
  return query<HTMLVideoElement>(SELECTORS.html5Video);
}

export function getPlayer(): HTMLElement | null {
  return query<HTMLElement>(SELECTORS.player);
}

export function isWatchPage(): boolean {
  return location.pathname === '/watch';
}

export function isDedicatedShortsPage(): boolean {
  return location.pathname === '/shorts' || location.pathname.startsWith('/shorts/');
}

export function isTheaterMode(): boolean {
  const watchFlexy = query<HTMLElement>(SELECTORS.watchFlexy);

  return Boolean(
    watchFlexy?.hasAttribute('theater') ||
      watchFlexy?.classList.contains('theater') ||
      document.querySelector('ytd-watch-flexy[theater]'),
  );
}

export function isEnhancedTheaterActive(settings: Settings): boolean {
  return settings.enhancedTheaterMode && isWatchPage() && isTheaterMode();
}

export function isDefaultWatchView(): boolean {
  return isWatchPage() && !isTheaterMode();
}

export function isNativeFullscreenActive(): boolean {
  return isWatchPage() && Boolean(document.fullscreenElement);
}

export function isTheaterMinimalLayoutActive(settings: Settings): boolean {
  return (
    isEnhancedTheaterActive(settings) &&
    settings.theaterHideRecommendations &&
    settings.theaterHideComments &&
    settings.theaterHideMetadata &&
    !settings.theaterShowPrimaryMetadata &&
    settings.theaterHideLiveChat
  );
}

export function normalizeLabel(value: string): string {
  return value.toLowerCase().replace(/[›>]/g, '').replace(/\s+/g, ' ').trim();
}

export function getElementLabel(element: Element): string {
  const ariaLabel = element.getAttribute('aria-label') ?? '';
  const title = element.getAttribute('title') ?? '';
  const text = element.textContent ?? '';

  return normalizeLabel(`${ariaLabel} ${title} ${text}`);
}

export function labelMatchesEntry(label: string, entry: string): boolean {
  const normalizedEntry = normalizeLabel(entry);

  return (
    label === normalizedEntry ||
    label === `${normalizedEntry} ${normalizedEntry}` ||
    label.startsWith(`${normalizedEntry} selected`) ||
    label.startsWith(`${normalizedEntry} link`)
  );
}

export function elementMatchesAnyLabel(element: Element, labels: readonly string[]): boolean {
  const label = getElementLabel(element);
  if (!label) return false;

  return labels.some((entry) => labelMatchesEntry(label, entry));
}

export function isVisibleNode(element: HTMLElement): boolean {
  const styles = window.getComputedStyle(element);

  return (
    !element.classList.contains(GENERAL_HIDDEN_CLASS) &&
    styles.display !== 'none' &&
    styles.visibility !== 'hidden' &&
    styles.opacity !== '0' &&
    (element.offsetWidth > 0 || element.offsetHeight > 0)
  );
}
