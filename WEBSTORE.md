# Chrome Web Store Submission

Simple YT Tweaks is not affiliated with, endorsed by, sponsored by, or otherwise associated with YouTube or Google.

## Release Candidate

- Version: `0.2.0`
- Package path: `release/simple-yt-tweaks-v0.2.0.zip`
- Intended first listing state: draft first, then submit the public listing once the final smoke test is complete

## Release Workflow

Run this sequence before uploading:

```bash
npm run typecheck
npm run lint
npm run build
npm run validate
npm run package
```

Then do a manual smoke test in Brave and one final smoke pass in Chrome stable.

## Final Listing Copy

### Short description

```text
Unofficial player usability tweaks for YouTube.
```

### Detailed description

```text
Simple YT Tweaks is an unofficial Chrome and Brave extension that gives YouTube a cleaner, less distracting viewing experience without adding bloat.

It includes grouped controls for Theater, Default, and Fullscreen viewing modes, optional sidebar cleanup, Shorts hiding, sponsored/promoted post hiding, end-screen card removal, a restored Picture-in-Picture button, and a floating mini-player for scrolling through watch pages.

Settings are stored with Chrome extension storage so your preferences persist between sessions.

Simple YT Tweaks does not collect, transmit, sell, or share user data. It is not affiliated with, endorsed by, sponsored by, or otherwise associated with YouTube or Google.
```

## Privacy Tab Answers

- Single purpose: improve the YouTube viewing experience with optional layout and player usability controls
- Data collection: none
- Data sale or sharing: none
- Analytics: none
- Remote code: none
- Authentication or accounts: none
- Permission used: `storage`
- Host permission used: `https://www.youtube.com/*`

## Permission Justifications

- `storage`: saves the user’s toggle and layout preferences locally through extension storage
- `https://www.youtube.com/*`: required so the extension can apply layout, player, and sidebar tweaks on YouTube pages only

## Store Assets

- Store icon: `public/icons/icon128.png`
- Small promo tile: `store-assets/promo/small-promo-tile-440x280.png`
- Screenshots:
  - `store-assets/screenshots/general-settings-1280x800.png`
  - `store-assets/screenshots/sidebar-cleanup-1280x800.png`
  - `store-assets/screenshots/fullscreen-settings-1280x800.png`

## Manual Smoke Checklist

- Homepage
  - feed columns apply cleanly
  - sponsored and Shorts hiding do not leave broken rows
  - sidebar cleanup behaves correctly
- Watch page in Default mode
  - comments, recommendations, live chat, metadata, PiP, and mini-player behave correctly
- Watch page in Theater mode
  - enhanced theater layout, header reveal, metadata controls, and docked mini-player behave correctly
- Fullscreen mode
  - title overlay, player UI, recommendation overlay, and action overlay toggles behave correctly
- Popup
  - status dot turns green on YouTube
  - settings persist after refresh/navigation

## Submission Notes

- Chrome Web Store test instructions can stay empty because the extension needs no login, credentials, or special reviewer setup.
- Keep the repository private until the release candidate package and draft listing are staged successfully.
- Once the draft listing looks right, the repo can be made public and the Web Store submission can proceed.
