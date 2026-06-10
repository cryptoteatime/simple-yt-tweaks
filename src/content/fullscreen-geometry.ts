export interface PlayerUiRect {
  bottom: number;
  height: number;
  left: number;
  right: number;
  top: number;
  width: number;
}

export interface PlayerControlZoneInput {
  chromeBottomRect: PlayerUiRect | null;
  fullscreenActive: boolean;
  playerRect: PlayerUiRect;
}

export interface PlayerUiPointerInput extends PlayerControlZoneInput {
  pointerX: number;
  pointerY: number;
}

export function resolvePlayerControlZoneTop({
  chromeBottomRect,
  fullscreenActive,
  playerRect,
}: PlayerControlZoneInput): number {
  if (
    chromeBottomRect &&
    chromeBottomRect.height > 0 &&
    chromeBottomRect.bottom > playerRect.top &&
    chromeBottomRect.top < playerRect.bottom
  ) {
    return Math.max(
      playerRect.top,
      Math.min(playerRect.bottom - 44, chromeBottomRect.top - (fullscreenActive ? 18 : 14)),
    );
  }

  const fallbackZoneHeight = fullscreenActive ? 94 : 118;
  return playerRect.bottom - fallbackZoneHeight;
}

export function isPointerInsidePlayerRect({
  playerRect,
  pointerX,
  pointerY,
}: Pick<PlayerUiPointerInput, 'playerRect' | 'pointerX' | 'pointerY'>): boolean {
  return (
    pointerX >= playerRect.left &&
    pointerX <= playerRect.right &&
    pointerY >= playerRect.top &&
    pointerY <= playerRect.bottom
  );
}

export function shouldRevealPlayerUiFromPointer(input: PlayerUiPointerInput): boolean {
  return (
    isPointerInsidePlayerRect(input) &&
    input.pointerY >= resolvePlayerControlZoneTop(input)
  );
}
