# SYT-WS-001 - Web Store Readiness Polish And Asset Refresh

## Task

- Task ID: `SYT-WS-001`
- GitHub issue: #60
- Role: Controller / Planner first, then scoped Runners
- State: Complete from automation side; final user Web Store approval/upload remains
- Repo: `/Users/d4ngl/Git Repos/Codex/simple-yt-tweaks`
- Current branch: `swarm/syt-ws001a-assets-refresh`

## Goal

Bring Simple YT Tweaks from RC-passed to nearly Web Store-ready without changing release/version state yet.

## Scope

- Remove local `.DS_Store` noise and keep junk out of source/package artifacts.
- Audit and refresh Web Store/repo graphics and listing collateral.
- Audit code polish targets before editing runtime:
  - duplicated settings definitions in `src/shared/settings.ts` and `src/content/settings.ts`
  - watch-to-Home watcher/polling behavior
  - large fragile modules: `theater.ts`, `grid-hover.ts`, `sidebar.ts`, `sticky-player.ts`, `fullscreen.ts`
- Implement only low-risk polish with focused tests and full final validation.
- Stop the automation when ready and give the user exact remaining Web Store/release steps.

## Non-Scope

- No version bump.
- No tag or GitHub release.
- No Chrome Web Store submission or asset upload.
- Do not reintroduce enhanced Home/Search hover grow, synthetic hover, or forced preview playback.
- Do not broaden extension permissions or add remote code.

## Parallelization

- `parallel-safe`: audit/docs/assets planning can run in parallel after this setup PR if path scopes are explicit.
- `serial-required`: runtime implementation, review, integration, release handoff.
- `depends-on`: user request on 2026-06-11 and GitHub issue #60.
- `conflict-risk`: medium overall; high for runtime content modules.

## Proposed Lanes

1. `SYT-WS-001A` - Store/repo graphics and listing collateral audit/refresh.
   - Scope: `store-assets/`, asset generation scripts, README/listing copy if needed.
   - First output: concrete asset inventory and refresh plan.
2. `SYT-WS-001B` - Final code polish audit and low-risk cleanup.
   - Scope: settings duplication, targeted watchers, large content modules.
   - First output: audit with recommended changes split into safe-now vs defer.
3. `SYT-WS-001C` - Final package/release handoff.
   - Scope: run full validation/package, confirm artifact contents, pause automation, provide exact user steps.

## Verification

- Focused lane checks for Runner PRs.
- `npm run validate:all` before integration of runtime/source/test changes.
- Supplemental Chrome/Brave live checks only when behavior cannot be proved by fixtures.
- Final package inspection before Web Store handoff.

## Decisions

- `.DS_Store` is ignored and should not be tracked or packaged.
- Existing accepted behavior remains native YouTube Home/Search hover only.
- The watch-to-Home watcher is allowed to remain if the audit confirms it is still the narrowest fix for Brave PWA / YouTube SPA behavior.

## Audit Results

### `SYT-WS-001A` Store/Listings

- Assets present:
  - `public/icons/icon16.png`, `icon32.png`, `icon48.png`, `icon128.png`.
  - Five `1280x800` PNG screenshots in `store-assets/screenshots/`.
  - Small promo tile `440x280` in `store-assets/promo/`.
  - README banner and three repo feature cards in `store-assets/repo/`.
  - `PRIVACY.md` exists; README points support to GitHub issues.
  - Private listing notes exist at `.private/WEBSTORE.md` and remain ignored.
- Gaps:
  - Marketing assets are stale and still show older `v0.2.0` popup imagery while package/manifest are `0.3.0`.
  - Marketing assets do not reflect the refreshed red play/settings icon.
  - Optional marquee promo `1400x560` is missing.
  - Current screenshots are partly marketing cards instead of clean full-bleed product screenshots.
  - Some real YouTube captures are visually noisy; neutral deterministic captures are preferable where possible.
  - `.private/WEBSTORE.md` needs local refresh for current version, package path, screenshot list, copy, privacy answers, and support URL.
- Next safe lane: refresh marketing generation and assets first; use a distinct Simple YT Tweaks red play/settings mark rather than copying YouTube branding directly.

### `SYT-WS-001B` Code Polish

- No code/manifest Web Store no-go found.
- Manifest remains narrow: `storage`, `https://www.youtube.com/*`, popup, and a single YouTube content script.
- Keep the 250ms watch-to-Home watcher/reload path stable before Web Store submission unless a specific change gets fixture coverage plus Brave PWA live QA.
- Safe-now candidates:
  - Keep deleting ignored `.DS_Store` files from the working tree when they appear.
  - Optional settings cleanup: make `src/content/settings.ts` thinner over `src/shared/settings.ts` only if it stays low-risk with existing parity tests.
  - Optional tests-only coverage for the one-shot reload guard/sessionStorage behavior.
- Defer:
  - Broad splits of `theater.ts`, `grid-hover.ts`, `sidebar.ts`, `sticky-player.ts`, and `fullscreen.ts`.
  - Selector rewrites without a concrete live regression.

## Next Recommended Role

Controller should close #60, stop/delete the heartbeat automation, and give the user exact final Web Store/release steps. Keep runtime behavior stable until after submission unless the user reports a concrete regression.

## `SYT-WS-001A` Implementation

### Files / Areas Touched

- Added `scripts/capture-popup-assets.mjs` to capture current popup tabs from the built extension in an isolated Playwright Chromium profile.
- Rebuilt `scripts/generate-marketing-assets.mjs` so repo/store graphics are generated from the current popup captures and refreshed icon.
- Added package scripts:
  - `npm run assets:popup`
  - `npm run assets:store`
- Extended validation to require the new `store-assets/promo/marquee-promo-1400x560.png`.
- Regenerated:
  - popup source captures in `store-assets/popup/`
  - small promo tile
  - new marquee promo tile
  - README banner and repo feature cards
  - five Web Store screenshot PNG/SVG pairs
- Refreshed `.private/WEBSTORE.md` locally for `v0.3.0`, current asset names, and current feature copy. This file is ignored and must not be staged.

### Verification

- `npm run assets:store` passed.
- `sips` dimension check confirmed:
  - small promo: `440x280`
  - marquee promo: `1400x560`
  - screenshots: `1280x800`
  - repo cards/banner: `1280x640`
- Visual spot-check passed for the small promo, marquee promo, README banner, General settings screenshot, Home/Search cleanup screenshot, and Watch-page modes screenshot.
- First `npm run validate:all` failed on generated SVG trailing whitespace.
- Fixed the generator to trim trailing whitespace before writing SVG files.
- `git diff --check` passed.
- Final `npm run validate:all` passed:
  - typecheck
  - lint
  - package + packaged validation
  - 25 unit tests
  - 21 fixture tests
- Packaged zip inspection confirmed `release/simple-yt-tweaks-v0.3.0.zip` contains only extension runtime files:
  - popup files
  - content script
  - icons
  - manifest

### Decisions / Risks

- No runtime behavior changed.
- No version bump, tag, release, Web Store upload, or permission change.
- Store assets are refreshed in-repo so final Web Store submission can use current collateral after user approval.
- The final Web Store listing/assets acceptance remains a user gate before submission.
- PR #63 merged at `65a52f7`.
- `SYT-WS-001B` is deferred because the audit found no Web Store blocker and broad runtime cleanup is higher risk than value before submission.
- Final clean-main readiness checks passed:
  - `npm run assets:store`
  - `npm run validate:all`
  - store asset dimension check
  - packaged zip inspection

### Next Exact Action

1. Close #60 with the readiness summary.
2. Stop/delete `simple-yt-tweaks-controller-heartbeat`.
3. Tell the user the exact remaining Web Store/release steps.
