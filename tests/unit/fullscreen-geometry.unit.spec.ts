import { expect, test } from '@playwright/test';

import {
  isPointerInsidePlayerRect,
  resolvePlayerControlZoneTop,
  shouldRevealPlayerUiFromPointer,
  type PlayerUiRect,
} from '../../src/content/fullscreen-geometry';

function rect(overrides: Partial<PlayerUiRect>): PlayerUiRect {
  const width = overrides.width ?? 1_280;
  const height = overrides.height ?? 720;
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

test('player UI control zone follows visible chrome bottom with mode-specific reveal gap', () => {
  const playerRect = rect({ top: 100, bottom: 820, height: 720 });
  const chromeBottomRect = rect({ top: 730, bottom: 820, height: 90 });

  expect(resolvePlayerControlZoneTop({
    chromeBottomRect,
    fullscreenActive: false,
    playerRect,
  })).toBe(716);

  expect(resolvePlayerControlZoneTop({
    chromeBottomRect,
    fullscreenActive: true,
    playerRect,
  })).toBe(712);
});

test('player UI control zone clamps chrome-derived positions inside the player', () => {
  const playerRect = rect({ top: 100, bottom: 820, height: 720 });

  expect(resolvePlayerControlZoneTop({
    chromeBottomRect: rect({ top: 840, bottom: 920, height: 80 }),
    fullscreenActive: false,
    playerRect,
  })).toBe(702);

  expect(resolvePlayerControlZoneTop({
    chromeBottomRect: rect({ top: 110, bottom: 180, height: 70 }),
    fullscreenActive: true,
    playerRect,
  })).toBe(100);

  expect(resolvePlayerControlZoneTop({
    chromeBottomRect: rect({ top: 800, bottom: 850, height: 50 }),
    fullscreenActive: false,
    playerRect,
  })).toBe(776);
});

test('player UI control zone falls back when chrome bottom is missing or unusable', () => {
  const playerRect = rect({ top: 80, bottom: 800, height: 720 });

  expect(resolvePlayerControlZoneTop({
    chromeBottomRect: null,
    fullscreenActive: false,
    playerRect,
  })).toBe(682);

  expect(resolvePlayerControlZoneTop({
    chromeBottomRect: rect({ top: 760, bottom: 760, height: 0 }),
    fullscreenActive: true,
    playerRect,
  })).toBe(706);

  expect(resolvePlayerControlZoneTop({
    chromeBottomRect: rect({ top: 10, bottom: 60, height: 50 }),
    fullscreenActive: false,
    playerRect,
  })).toBe(682);
});

test('player UI reveal requires the pointer inside the player and below the control zone', () => {
  const playerRect = rect({ left: 40, right: 1_320, top: 100, bottom: 820, width: 1_280, height: 720 });
  const chromeBottomRect = rect({ top: 730, bottom: 820, height: 90 });

  expect(isPointerInsidePlayerRect({ playerRect, pointerX: 40, pointerY: 100 })).toBe(true);
  expect(isPointerInsidePlayerRect({ playerRect, pointerX: 1_321, pointerY: 760 })).toBe(false);

  expect(shouldRevealPlayerUiFromPointer({
    chromeBottomRect,
    fullscreenActive: false,
    playerRect,
    pointerX: 800,
    pointerY: 716,
  })).toBe(true);

  expect(shouldRevealPlayerUiFromPointer({
    chromeBottomRect,
    fullscreenActive: false,
    playerRect,
    pointerX: 800,
    pointerY: 715,
  })).toBe(false);

  expect(shouldRevealPlayerUiFromPointer({
    chromeBottomRect,
    fullscreenActive: false,
    playerRect,
    pointerX: 1_400,
    pointerY: 760,
  })).toBe(false);
});
