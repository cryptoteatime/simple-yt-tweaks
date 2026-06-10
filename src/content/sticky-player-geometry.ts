export type StickyPlayerViewMode = 'default' | 'theater';

export type StickyPlayerRect = Pick<DOMRectReadOnly, 'bottom' | 'height' | 'left' | 'right' | 'top' | 'width'>;

export type StickyPlayerVisibility = {
  rect: StickyPlayerRect;
  viewportHeight: number;
  visibleHeight: number;
  visibleRatio: number;
};

export type StickyPlayerResizeDirection = 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw';

export type StickyPlayerResizeInput = {
  rect: StickyPlayerRect;
  direction: StickyPlayerResizeDirection;
  deltaX: number;
  deltaY: number;
  viewportWidth: number;
  viewportHeight: number;
};

export type StickyPlayerResizeRect = {
  left: number;
  top: number;
  width: number;
};

export const STICKY_ASPECT_RATIO = 16 / 9;
export const STICKY_MIN_WIDTH = 260;
export const STICKY_MAX_WIDTH = 640;
export const STICKY_VIEWPORT_MARGIN = 8;

export function clampStickyPlayerValue(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function getStickyPlayerMaxWidth(viewportWidth: number): number {
  return Math.min(STICKY_MAX_WIDTH, viewportWidth - STICKY_VIEWPORT_MARGIN * 2);
}

export function resolveStickyPlayerVisibility(
  rect: StickyPlayerRect,
  viewportHeight: number,
): StickyPlayerVisibility | null {
  if (rect.width <= 0 || rect.height <= 0) return null;

  const visibleHeight = Math.max(0, Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0));

  return {
    rect,
    viewportHeight,
    visibleHeight,
    visibleRatio: visibleHeight / rect.height,
  };
}

export function shouldDockStickyPlayer(
  visibility: StickyPlayerVisibility | null,
  viewMode: StickyPlayerViewMode,
  scrollY: number,
): boolean {
  if (!visibility) return false;

  const { rect, viewportHeight, visibleRatio } = visibility;

  if (viewMode === 'default') {
    return scrollY > 96 && rect.bottom <= viewportHeight * 0.52 && visibleRatio < 0.22;
  }

  return scrollY > 64 && rect.bottom <= viewportHeight * 0.72 && visibleRatio < 0.35;
}

export function isStickyPlayerMostlyVisible(
  visibility: StickyPlayerVisibility | null,
  viewMode: StickyPlayerViewMode,
  scrollY: number,
): boolean {
  if (!visibility) return false;

  if (viewMode === 'default') {
    return visibility.visibleRatio > 0.78 || scrollY <= 64;
  }

  return visibility.visibleRatio > 0.6 || scrollY <= 64;
}

export function resolveStickyPlayerResizedRect(input: StickyPlayerResizeInput): StickyPlayerResizeRect {
  const { rect, direction, deltaX, deltaY, viewportWidth, viewportHeight } = input;
  const startRight = rect.right;
  const startBottom = rect.bottom;
  const maxWidth = getStickyPlayerMaxWidth(viewportWidth);

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

  width = clampStickyPlayerValue(width, STICKY_MIN_WIDTH, maxWidth);

  let left = direction.includes('w') ? startRight - width : rect.left;
  let top = direction.includes('n') ? startBottom - width / STICKY_ASPECT_RATIO : rect.top;

  if (left < STICKY_VIEWPORT_MARGIN) {
    width = direction.includes('w') ? startRight - STICKY_VIEWPORT_MARGIN : width;
    left = STICKY_VIEWPORT_MARGIN;
  }

  if (left + width > viewportWidth - STICKY_VIEWPORT_MARGIN) {
    width = viewportWidth - STICKY_VIEWPORT_MARGIN - left;
  }

  const height = width / STICKY_ASPECT_RATIO;
  if (top < STICKY_VIEWPORT_MARGIN) {
    width = direction.includes('n') ? (startBottom - STICKY_VIEWPORT_MARGIN) * STICKY_ASPECT_RATIO : width;
    top = STICKY_VIEWPORT_MARGIN;
  }

  if (top + height > viewportHeight - STICKY_VIEWPORT_MARGIN) {
    const maxHeightFromTop = viewportHeight - STICKY_VIEWPORT_MARGIN - top;
    width = Math.min(width, maxHeightFromTop * STICKY_ASPECT_RATIO);
  }

  return {
    left: clampStickyPlayerValue(left, STICKY_VIEWPORT_MARGIN, viewportWidth - width - STICKY_VIEWPORT_MARGIN),
    top: clampStickyPlayerValue(top, STICKY_VIEWPORT_MARGIN, viewportHeight - width / STICKY_ASPECT_RATIO - STICKY_VIEWPORT_MARGIN),
    width: clampStickyPlayerValue(width, STICKY_MIN_WIDTH, getStickyPlayerMaxWidth(viewportWidth)),
  };
}
