# SYT-010H-D: Runtime Apply-Loop And Polling Hardening

## Status

- Task ID: `SYT-010H-D`
- Title: Runtime Apply-Loop And Polling Hardening
- Assigned role: Senior Developer Runner
- Current state: Needs Review
- Repo: `/Users/d4ngl/Git Repos/Codex/simple-yt-tweaks`
- Branch: `swarm/syt-010h-runtime-churn`
- PR: https://github.com/cryptoteatime/simple-yt-tweaks/pull/48
- GitHub issue: #10
- Verification tier: focused fixture plus static checks

## Scope

Implement one audit-backed, behavior-preserving runtime churn reduction from `SYT-010H-B`.

Chosen target: video event binding. The previous implementation attached once at startup and kept a permanent 2 second interval alive for the whole page lifetime. This lane makes normal DOM/navigation apply passes attach replacement video nodes immediately and keeps only a slower watch-page fallback.

## Non-Scope

- No watch-to-Home reload guard changes.
- No native Home/Search preview behavior changes.
- No enhanced Home/Search hover grow, synthetic hover, or forced preview playback.
- No settings contract, release/version, Web Store, or broad module refactor changes.

## Parallelization Metadata

- `parallel-safe`: no
- `serial-required`: yes
- `depends-on`: integrated `SYT-010H-B` audit
- `conflict-risk`: high for shared content runtime behavior, kept narrow in `src/content/lifecycle.ts` and `src/content/content.ts`

## Files Touched

- `src/content/lifecycle.ts`
- `src/content/content.ts`
- `tests/e2e/extension.fixture.spec.ts`
- `docs/swarm/handoffs/SYT-010H-D.md`

## Runtime Change

- Extracted video listener attachment into `syncVideoEventBinding()`.
- Calls `syncVideoEventBinding()` from the existing apply/stabilization path, so DOM observer bursts and navigation reruns bind replacement watch video nodes without waiting on interval polling.
- Slowed the fallback interval from 2 seconds to 10 seconds and gated it to watch pages.
- Preserved the existing `data-simple-yt-tweaks-bound` duplicate-listener guard and existing PiP/play/pause listeners.

## Verification

- Passed: `npm run test:e2e -- --grep "binds replacement video"`
- Passed: `npm run test:e2e -- --grep "watch fixture validates|binds replacement video|player click fallback|docks and restores sticky"`
- Passed: `npm run test:unit`
- Passed: `npm run typecheck`
- Passed: `npm run lint`
- Passed: `git diff --check`

Live YouTube / Brave PWA QA was not run and is not requested for this PR because the lane did not change watch-to-Home reload, native Home/Search preview, or live YouTube behavior.

## Decisions Made

- Did not change `WATCH_TO_HOME_URL_POLL_MS`; that remains a future high-risk lane because it protects the recently user-confirmed Brave PWA watch -> Home regression.
- Used fixture coverage instead of live smoke because the behavior under change is local video-node listener binding.

## Blockers Or Risks

- No known blockers.
- Residual risk: real YouTube can still replace player/video nodes in unusual sequences; the 10 second watch-page fallback remains as a safety net while the normal path is now event/apply-driven.

## Next Recommended Role And Action

Reviewer: inspect the narrow runtime diff, confirm the PR body has the required controller section, and run targeted checks or mark `Ready to Integrate` if clean.
