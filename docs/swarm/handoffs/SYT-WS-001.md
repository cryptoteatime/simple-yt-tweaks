# SYT-WS-001 - Web Store Readiness Polish And Asset Refresh

## Task

- Task ID: `SYT-WS-001`
- GitHub issue: #60
- Role: Controller / Planner first, then scoped Runners
- State: In Progress
- Repo: `/Users/d4ngl/Git Repos/Codex/simple-yt-tweaks`
- Current branch: `swarm/syt-ws001-readiness-planning`

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

Controller should route `SYT-WS-001A` implementation next: refresh marketing generation/assets and private Web Store notes. Keep code cleanup conservative; do not touch runtime behavior unless a concrete low-risk test-backed change is selected.
