import { expect, test } from '@playwright/test';

import {
  STICKY_ASPECT_RATIO,
  resolveStickyPlayerResizedRect,
  resolveStickyPlayerVisibility,
  shouldDockStickyPlayer,
  isStickyPlayerMostlyVisible,
  type StickyPlayerRect,
} from '../../src/content/sticky-player-geometry';

function rect(overrides: Partial<StickyPlayerRect>): StickyPlayerRect {
  const width = overrides.width ?? 960;
  const height = overrides.height ?? 540;
  const left = overrides.left ?? 0;
  const top = overrides.top ?? 0;

  return {
    bottom: top + height,
    height,
    left,
    right: left + width,
    top,
    width,
    ...overrides,
  };
}

test('sticky player dock thresholds preserve default watch-view behavior', () => {
  const dockable = resolveStickyPlayerVisibility(rect({ top: -800, bottom: 200, height: 1_000 }), 1_000);

  expect(shouldDockStickyPlayer(dockable, 'default', 120)).toBe(true);
  expect(shouldDockStickyPlayer(dockable, 'default', 96)).toBe(false);

  const visibleAtBoundary = resolveStickyPlayerVisibility(rect({ top: -780, bottom: 220, height: 1_000 }), 1_000);
  expect(shouldDockStickyPlayer(visibleAtBoundary, 'default', 120)).toBe(false);
});

test('sticky player dock thresholds preserve theater watch-view behavior', () => {
  const dockable = resolveStickyPlayerVisibility(rect({ top: -550, bottom: 250, height: 800 }), 1_000);

  expect(shouldDockStickyPlayer(dockable, 'theater', 65)).toBe(true);
  expect(shouldDockStickyPlayer(dockable, 'theater', 64)).toBe(false);

  const visibleAtBoundary = resolveStickyPlayerVisibility(rect({ top: -520, bottom: 280, height: 800 }), 1_000);
  expect(shouldDockStickyPlayer(visibleAtBoundary, 'theater', 65)).toBe(false);
});

test('sticky player restore thresholds preserve mostly-visible behavior', () => {
  const defaultVisible = resolveStickyPlayerVisibility(rect({ top: -200, bottom: 800, height: 1_000 }), 1_000);
  const defaultBoundary = resolveStickyPlayerVisibility(rect({ top: -220, bottom: 780, height: 1_000 }), 1_000);
  const theaterVisible = resolveStickyPlayerVisibility(rect({ top: -312, bottom: 488, height: 800 }), 1_000);
  const theaterBoundary = resolveStickyPlayerVisibility(rect({ top: -320, bottom: 480, height: 800 }), 1_000);

  expect(isStickyPlayerMostlyVisible(defaultVisible, 'default', 120)).toBe(true);
  expect(isStickyPlayerMostlyVisible(defaultBoundary, 'default', 120)).toBe(false);
  expect(isStickyPlayerMostlyVisible(theaterVisible, 'theater', 120)).toBe(true);
  expect(isStickyPlayerMostlyVisible(theaterBoundary, 'theater', 120)).toBe(false);
  expect(isStickyPlayerMostlyVisible(theaterBoundary, 'theater', 64)).toBe(true);
});

test('sticky player visibility ignores unusable rectangles', () => {
  expect(resolveStickyPlayerVisibility(rect({ width: 0 }), 1_000)).toBeNull();
  expect(resolveStickyPlayerVisibility(rect({ height: 0 }), 1_000)).toBeNull();
});

test('sticky player resize clamps east drag to max width', () => {
  const nextRect = resolveStickyPlayerResizedRect({
    rect: rect({ left: 100, right: 520, top: 100, bottom: 336.25, width: 420, height: 236.25 }),
    direction: 'e',
    deltaX: 400,
    deltaY: 0,
    viewportWidth: 1_280,
    viewportHeight: 800,
  });

  expect(nextRect).toEqual({ left: 100, top: 100, width: 640 });
});

test('sticky player resize clamps west drag to min width while preserving right edge', () => {
  const nextRect = resolveStickyPlayerResizedRect({
    rect: rect({ left: 120, right: 540, top: 100, bottom: 336.25, width: 420, height: 236.25 }),
    direction: 'w',
    deltaX: 500,
    deltaY: 0,
    viewportWidth: 1_280,
    viewportHeight: 800,
  });

  expect(nextRect).toEqual({ left: 280, top: 100, width: 260 });
});

test('sticky player resize uses vertical drag with the sticky aspect ratio', () => {
  const nextRect = resolveStickyPlayerResizedRect({
    rect: rect({ left: 120, right: 540, top: 100, bottom: 336.25, width: 420, height: 236.25 }),
    direction: 's',
    deltaX: 0,
    deltaY: 90,
    viewportWidth: 1_280,
    viewportHeight: 800,
  });

  expect(nextRect.left).toBe(120);
  expect(nextRect.top).toBe(100);
  expect(nextRect.width).toBe(420 + 90 * STICKY_ASPECT_RATIO);
});

test('sticky player resize clamps north drag to viewport top while preserving aspect ratio', () => {
  const nextRect = resolveStickyPlayerResizedRect({
    rect: rect({ left: 120, right: 540, top: 120, bottom: 356.25, width: 420, height: 236.25 }),
    direction: 'n',
    deltaX: 0,
    deltaY: -160,
    viewportWidth: 1_280,
    viewportHeight: 800,
  });

  expect(nextRect.left).toBe(120);
  expect(nextRect.top).toBe(8);
  expect(nextRect.width).toBeCloseTo((356.25 - 8) * STICKY_ASPECT_RATIO, 5);
});
