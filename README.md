# Simple YT Tweaks

Simple YT Tweaks is an unofficial Chrome/Brave extension that bundles a few player usability tweaks for YouTube into one small Manifest V3 extension.

This project is not affiliated with, endorsed by, sponsored by, or otherwise associated with YouTube or Google.

## Features

- Enhanced theater mode that expands the watch layout.
- Optional hidden header, header hover reveal, recommendations, comments, and live chat controls while theater mode is active.
- Optional live chat overlay for streams and premieres.
- Compact popup settings with page support status and clamped tooltips.
- Separate General, Theater View, and Default View tabs for global and mode-specific preferences.
- Optional grouped sidebar cleanup controls for hiding the main sidebar, navigation entries, product links, and sidebar footer clutter.
- Optional Shorts hiding across common navigation, home, feed, search, and recommendation surfaces.
- Optional Report History sidebar cleanup without tying it to the You section.
- Optional end-screen card hiding.
- Tab-scoped reset defaults so one settings view does not wipe preferences from another view.
- Optional hidden player controls that reappear when hovering near the control area.
- Optional theater scrollbar hiding to reduce layout shift while scrolling.
- Optional metadata hiding, with a title and top-row keep-visible option.
- Restored Picture-in-Picture button in the player controls.
- Floating mini-player that docks the actual YouTube player instead of mirroring the video stream.

## Development

```bash
npm install
npm run icons
npm run dev
```

Load the generated `dist/` folder as an unpacked extension from `chrome://extensions` or `brave://extensions` with Developer mode enabled.

## Release Build

```bash
npm run typecheck
npm run lint
npm run build
npm run validate
npm run package
```

The Web Store zip is written to `release/simple-yt-tweaks-v<version>.zip`.

## Versioning

The extension version is shared by `package.json`, `package-lock.json`, and `public/manifest.json`.

```bash
npm run version:sync
npm run version:set -- 0.1.1
```

Use `version:set` only when preparing a new Web Store upload or GitHub release. Normal development commits can stay on the current version.

## Compatibility

Currently tested during development on:

- Brave Browser 146.1.88.136 on macOS

Chrome and Brave are the intended targets because the extension uses Manifest V3.

## Privacy

Simple YT Tweaks does not collect, transmit, sell, or share user data. Feature settings are stored with Chrome extension storage. See [PRIVACY.md](PRIVACY.md).

## License

MIT
