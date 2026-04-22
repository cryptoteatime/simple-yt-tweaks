# Simple YT Tweaks

Simple YT Tweaks is an unofficial Chrome/Brave extension that bundles a few player usability tweaks for YouTube into one small Manifest V3 extension.

This project is not affiliated with, endorsed by, sponsored by, or otherwise associated with YouTube or Google.

## Features

- Enhanced theater mode that expands the watch layout.
- Optional masthead/sidebar hiding while theater mode is active.
- Auto-hide for player chrome after inactivity.
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

## Privacy

Simple YT Tweaks does not collect, transmit, sell, or share user data. Feature settings are stored with Chrome extension storage. See [PRIVACY.md](PRIVACY.md).

## License

MIT
