# Known Issues

These are the current known limitations and polish items after `0.2.1`.

## Current UI quirks

- On some watch-page flows, a non-current sidebar entry may briefly flash as highlighted during YouTube's own drawer transition. The extension now neutralizes this state after the sidebar settles.

## Platform-owned behavior

- The extension adds a real browser Picture-in-Picture button, but it does not force YouTube's native miniplayer to open or close.
- Native YouTube miniplayer behavior can vary by current YouTube build and browser behavior. The extension intentionally stays hands-off there.
- YouTube's current desktop help documents starting the native Miniplayer manually from the player menu. It does not document automatic desktop miniplayer activation while scrolling a watch page.

## Scope

These are known polish issues, not data-loss or security issues. Core settings, fullscreen cleanup, sidebar cleanup, and browser PiP behavior remain the intended release surface.
