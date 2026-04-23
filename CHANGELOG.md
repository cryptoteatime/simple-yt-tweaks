# Changelog

## 0.1.0

### Added

- Created the initial Manifest V3 Chrome/Brave extension scaffold for Simple YT Tweaks.
- Added an npm, TypeScript, Vite, and ESLint development workflow.
- Added validation and packaging scripts for Chrome Web Store zip output.
- Added generated extension icons and a release-ready manifest with narrow YouTube host permissions.
- Added a popup settings panel with page support status, feature toggles, reset defaults, tooltips, and footer links.
- Added separate Theater and Default settings tabs for mode-specific watch-page behavior.
- Added restored Picture-in-Picture button support inside the YouTube player controls.
- Added a floating mini-player that docks the actual YouTube player when scrolling below the video in default view.
- Added theater-mode live chat controls, including an optional floating chat overlay when live chat exists.
- Added theater scrollbar hiding so scrolling does not shift the enhanced theater player.
- Added metadata hiding controls, including an option to keep the title, channel row, and action buttons visible.
- Added a version sync script for package, lockfile, and manifest version management.
- Added README, privacy policy, MIT license, changelog, and GitHub issue templates.

### Changed

- Reworked enhanced theater mode sizing so the player fits the viewport without cropping or horizontal overflow.
- Made theater mode clean up correctly when switching back to default view.
- Kept hidden-header behavior theater-only, with optional top-edge hover reveal.
- Made hidden player controls theater-only, with controls revealed from the player control-bar area.
- Split recommendation, comment, and live-chat hiding between Theater and Default views.
- Allowed the below-video area, title, description, and comments to expand when theater recommendations are hidden.
- Kept Hide Comments scoped to the actual comments section instead of hiding title, metadata, or description.
- Hid YouTube's native mini-player in default view when Simple YT Tweaks floating mini-player is enabled.
- Improved popup layout with compact child settings, clamped tooltips, and version/link footer controls.
- Removed the redundant popup save-status text.
- Added campaign parameters to popup footer links for extension traffic attribution.
- Tightened popup spacing so the Theater settings fit without an awkward overflow scrollbar.
- Made the popup footer version read from the package version instead of hardcoded text.

### Notes

- The repository remains private while the extension is being tested and prepared for Chrome Web Store submission.
- The Web Store package is generated locally in `release/` and is intentionally not tracked in Git.
