# Development

This file is for contributor and release workflow notes.

## Local Setup

```bash
npm install
npm run icons
npm run dev
```

Load the built `dist/` folder as an unpacked extension from `chrome://extensions` or `brave://extensions` with Developer mode enabled.

## Release Workflow

```bash
npm run typecheck
npm run lint
npm run build
npm run validate
npm run package
```

The packaged upload is written to:

`release/simple-yt-tweaks-v<version>.zip`

## Manual Smoke Checklist

- Homepage: verify home feed columns, sponsored hiding, Shorts hiding, and sidebar cleanup
- Watch page in Default mode: verify recommendations/comments/metadata/live chat controls and PiP button behavior
- Watch page in Theater mode: verify enhanced theater layout, header hover, metadata behavior, and scrollbar behavior
- Fullscreen mode: verify title, player UI, recommendation overlay, and action overlay behavior
- Popup: verify settings persist after closing/reopening the popup and after YouTube navigation
- PiP: verify the restored button opens true browser PiP and the miniplayer PiP handoff appears only when YouTube's native miniplayer is present

## Versioning

The extension version is synced across `package.json`, `package-lock.json`, and `public/manifest.json`.

```bash
npm run version:set -- 0.2.0
```

Use `version:set` only when preparing a new release candidate or Web Store upload.

## Store Submission Notes

The Chrome Web Store submission checklist is kept locally and should not be treated as public repo documentation.
