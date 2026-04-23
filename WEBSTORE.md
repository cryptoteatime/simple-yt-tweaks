# Chrome Web Store Submission

Simple YT Tweaks is not affiliated with, endorsed by, sponsored by, or otherwise associated with YouTube or Google.

## Current Package

- Version: `0.1.0`
- Package path: `release/simple-yt-tweaks-v0.1.0.zip`
- Intended visibility for first submission: Private testing or unlisted/public only when ready

## Pre-Submission Checks

Run these before uploading a zip:

```bash
npm run typecheck
npm run lint
npm run build
npm run validate
npm run package
```

## Draft Listing Copy

Short description:

```text
Unofficial player usability tweaks for YouTube.
```

Detailed description:

```text
Simple YT Tweaks is an unofficial Chrome and Brave extension that adds lightweight YouTube watch-page controls for cleaner viewing.

Features include enhanced theater mode, optional header hiding, player control hiding, metadata hiding, recommendation/comment/live chat controls, sidebar cleanup, Shorts hiding, end-screen card hiding, restored Picture-in-Picture access, and a docked mini-player for scrolling through comments.

This extension does not collect, transmit, sell, or share user data. Settings are stored with Chrome extension storage.

Simple YT Tweaks is not affiliated with, endorsed by, sponsored by, or otherwise associated with YouTube or Google.
```

## Privacy Answers

- Data collection: none
- Data sale/sharing: none
- Remote code: none
- Analytics: none
- Permissions: `storage`
- Host permissions: `https://www.youtube.com/*`

## Assets To Prepare

- Store icon: use `public/icons/icon128.png`
- Screenshots:
  - Popup settings panel on YouTube
  - Enhanced theater mode with hidden header
  - General settings with sidebar and Shorts controls
  - Default view with floating mini-player
  - Picture-in-Picture button in the player controls

## Manual Test Notes

- Tested during development on Brave Browser 146.1.88.136 on macOS.
- Confirm toggles persist after closing/reopening the popup.
- Confirm Theater and Default tab settings only affect their intended YouTube watch-page mode.
- Confirm YouTube navigation, theater/default switching, and page refresh restore the player layout cleanly.
