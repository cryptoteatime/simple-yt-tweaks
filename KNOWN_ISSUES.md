# Known Issues

These are the current known limitations and polish items for `0.2.0`.

## Current UI quirks

- On some watch-page flows, opening and closing the left sidebar can leave a non-current entry visually highlighted until another pointer or navigation state update occurs. Tracked in [#1](https://github.com/cryptoteatime/simple-yt-tweaks/issues/1).
- In some fullscreen scroll/reveal flows, YouTube's own overlay state can temporarily desync from the extension's reveal logic until another interaction updates the player state. Tracked in [#2](https://github.com/cryptoteatime/simple-yt-tweaks/issues/2).

## Platform-owned behavior

- The extension adds a real browser Picture-in-Picture button, but it does not force YouTube's native miniplayer to open or close.
- Native YouTube miniplayer behavior can vary by current YouTube build and browser behavior. The extension intentionally stays hands-off there.

## Scope

These are known polish issues, not data-loss or security issues. Core settings, fullscreen cleanup, sidebar cleanup, and browser PiP behavior remain the intended release surface.
