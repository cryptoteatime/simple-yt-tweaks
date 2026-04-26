# Changelog

## 0.3.0

### Added

- Added Sticky Player behavior for keeping the current video visible while scrolling away from the main player.
- Added Default and Theater `Recommended Hover Grow` settings for sidebar/recommended videos.
- Added search-result grid cleanup with compact video/channel cards and a `General > Feed Columns > Apply to Search` setting.

### Changed

- Kept home and search hover playback native to YouTube after enhanced grid hover proved too fragile for the current release.
- Defaulted Sticky Player and Recommended Hover Grow behavior on for fresh settings.

### Fixed

- Removed blank home-feed gaps left behind by hidden sponsored cards.
- Fixed modern search Shorts shelves and non-video result containers continuing to appear in cleaned search grids.
- Fixed Sticky Player PiP handoff so browser PiP opens on the live playing video instead of a stale paused frame.
- Restored native video click play/pause behavior in Default, Theater, and Fullscreen modes.

### Notes

- Enhanced home/search grid hover preview is deferred to GitHub issue #8.

## 0.2.1

### Changed

- Refreshed the Chrome Web Store small promo tile with a cleaner layout based on the current popup UI.

### Fixed

- Reduced stale sidebar highlight states on YouTube guide/sidebar flows by tightening pointer detection and neutral sidebar item styling.
- Prevented fullscreen scroll interactions from entering YouTube's hidden grid-peek state when `Hide More Videos Overlay` is enabled.
- Improved fullscreen reveal stability after pause/play and scroll interactions.

### Notes

- Native YouTube miniplayer scroll behavior remains platform-owned and is tracked separately for investigation.

## 0.2.0

### Added

- Added a release-candidate workflow with packaging, validation, and Web Store submission notes.
- Added store-ready listing assets, including screenshots and a small promo tile.
- Added release validation for docs, store assets, and packaged zip version naming.
- Added native fullscreen cleanup controls for title overlays, player UI, recommendation overlays, and action overlays.

### Changed

- Reorganized the popup into `General`, `Sidebar`, and `Modes` tabs, with `Modes > Theater / Default / Fullscreen`.
- Moved shared PiP controls into `General` so the restored browser PiP flow lives in one place.
- Tightened sidebar cleanup so it uses a clean Subscriptions icon row, keeps You expanded by default, and explains that behavior more clearly in the UI.
- Updated public docs and Web Store copy to match the shipped UI and feature layout.
- Refactored the content script into focused modules so fullscreen, theater, sidebar, PiP, and lifecycle behavior are easier to debug and maintain.
- Bumped the first public release to `0.2.0`.

### Fixed

- Restored self-contained MV3 content-script packaging so tweaks reliably run on YouTube after reloads.
- Improved theater-mode stabilization when switching between default, theater, and fullscreen states.
- Reduced false positives in sponsored-post hiding so normal watch-page recommendations are not removed accidentally.
- Improved fullscreen hover behavior so title and control overlays follow the intended control-zone reveal behavior more closely.
- Tightened popup layout so the footer sits consistently at the bottom across shorter tabs.
- Fixed sidebar Subscriptions cleanup so the icon row renders cleanly instead of mixing image/icon states.

### Notes

- This is the first public release submitted for Chrome Web Store review.
- The packaged upload is generated locally in `release/simple-yt-tweaks-v0.2.0.zip`.
- Current known limitations are tracked in `KNOWN_ISSUES.md`.
