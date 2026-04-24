# Changelog

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
