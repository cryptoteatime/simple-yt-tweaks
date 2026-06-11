# SYT-010H-F: One-Module Grid-Hover Organization Cleanup

## Status

- Task ID: `SYT-010H-F`
- Title: One-module grid-hover organization cleanup
- Assigned role: Senior Developer Runner
- Current state: Needs Review
- Repo: `/Users/d4ngl/Git Repos/Codex/simple-yt-tweaks`
- Worktree: `/Users/d4ngl/Git Repos/Codex/simple-yt-tweaks-syt010h-f`
- Branch: `swarm/syt-010h-content-organization`
- GitHub issue: #10
- Verification tier: focused unit/static checks

## Scope

Organization-only cleanup in `src/content/grid-hover.ts` for the watch recommendation / sidebar-recommended hover grow path.

## Non-Scope

- No enhanced Home/Search hover grow.
- No synthetic hover or forced preview playback.
- No Search grid cleanup, Home native hover cleanup, watch-to-Home reload behavior, live chat, Sticky Player, settings contracts, version, tag, release, Web Store assets, or #8 changes.
- No broad module splitting or multi-runtime cleanup.
- No selector broadening.

## Parallelization Metadata

- `parallel-safe`: no
- `serial-required`: yes
- `depends-on`: integrated `SYT-010H-B` audit and `SYT-010H-E` selector fixture lane
- `conflict-risk`: medium/high for runtime source, kept narrow to one module plus unit tests

## Files Touched

- `src/content/grid-hover.ts`
- `tests/unit/grid-hover.unit.spec.ts`
- `docs/swarm/handoffs/SYT-010H-F.md`

## Changes

- Extracted the watch recommendation container list used by related/sidebar recommendation selectors.
- Added small local helpers for scoping watch recommendation selectors, appending descendants, and deriving the ready-state selector form.
- Reused those helpers for legacy compact-card and modern lockup selector construction without changing the generated selector strings.
- Added a focused unit assertion that locks the current legacy compact-card behavior and all three modern watch lockup scopes.

## Commands Run

- Initial blocked check: `npm run test:unit -- --grep "grid hover"` failed before dependency install because `playwright` was missing.
- Setup: `npm ci` passed; reported one existing moderate `npm audit` finding.
- Passed: `npm run test:unit -- --grep "grid hover"` (3 tests)
- Passed: `npm run typecheck`
- Passed: `npm run lint`
- Passed: `git diff --check`

## Decisions Made

- Kept the legacy `ytd-compact-video-renderer` CSS behavior unscoped because that was the existing generated CSS behavior.
- Kept modern `yt-lockup-view-model` watch selectors scoped to `#related`, `ytd-watch-next-secondary-results-renderer`, and `#secondary`.
- Did not add e2e coverage because no fixture behavior or runtime behavior changed.

## Blockers Or Risks

- No known blockers.
- Live YouTube / Brave QA is not requested for this PR because the change is selector-construction organization only and is covered by unit CSS assertions.
- `npm ci` reported one moderate audit finding; not addressed because dependency remediation is outside this task.

## Next Recommended Role And Action

Reviewer: review the narrow selector-helper diff and PR body, then mark `Ready to Integrate` if no selector regression or scope issue is found.
