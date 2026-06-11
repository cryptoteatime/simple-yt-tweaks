# SYT-010H-E: Selector Helper And Fixture Gap Hardening

## Status

- Task ID: `SYT-010H-E`
- Title: Selector Helper And Fixture Gap Hardening
- Assigned role: Senior Developer Runner
- Current state: Needs Review
- Repo: `/Users/d4ngl/Git Repos/Codex/simple-yt-tweaks`
- Branch: `swarm/syt-010h-selector-fixtures`
- PR: https://github.com/cryptoteatime/simple-yt-tweaks/pull/50
- GitHub issue: #10
- Verification tier: focused fixture plus static checks

## Scope

Add a narrow selector-fixture hardening target from the `SYT-010H-B` audit recommendations.

Chosen target: Search modern `yt-lockup-view-model` non-video filtering. The production CSS already included selectors for modern lockup Shorts, radio, and playlist variants, but the fixture only asserted legacy renderer variants.

## Non-Scope

- No production runtime source changes.
- No Home/Search hover grow behavior.
- No synthetic hover or forced preview playback.
- No version, release, tag, Web Store, or #8 work.
- No broad selector refactor.

## Parallelization Metadata

- `parallel-safe`: yes for this test-only change after `SYT-010H-D` integration
- `serial-required`: no production selector/runtime edits were needed
- `depends-on`: integrated `SYT-010H-B` audit and `SYT-010H-D`
- `conflict-risk`: low for fixture-only Search selector coverage

## Files Touched

- `tests/e2e/youtube-fixtures.ts`
- `tests/e2e/extension.fixture.spec.ts`
- `docs/swarm/handoffs/SYT-010H-E.md`

## Changes

- Added a reusable Search fixture lockup helper.
- Added modern Search lockup examples for:
  - a valid watch video result
  - a Shorts result
  - a radio result
  - a playlist result
- Extended the Search fixture assertions so compact Search cleanup:
  - keeps the valid modern watch lockup visible
  - hides modern Shorts, radio, and playlist lockups
  - leaves a modern playlist lockup visible when compact Search cleanup is disabled

## Commands Run

- Passed: `npm run test:e2e -- --grep "search fixture"`
- Passed: `npm run test:e2e`
- Passed: `npm run test:unit`
- Passed: `npm run typecheck`
- Passed: `npm run lint`
- Passed: `git diff --check`
- Passed after PR-scope cleanup: `git diff --check main...HEAD`

## Decisions Made

- Kept the lane fixture-only because the existing selectors already handled the modern lockup variants.
- Chose Search lockup filtering over live chat/fullscreen source extraction to avoid unnecessary runtime changes in this final-leg lane.
- Preserved the earlier controller registration state on local backup branch `swarm/syt-010h-selector-fixtures-with-registration`, then narrowed the pushed PR branch so this runner PR contains only the fixture and handoff files.

## Blockers Or Risks

- No known blockers.
- Live YouTube / Brave QA is not requested because this is deterministic fixture coverage only and does not alter runtime behavior.

## Next Recommended Role And Action

Reviewer: review the fixture additions and PR body, then mark Ready to Integrate if the Search selector coverage is acceptable. Controller/Integrator can run the standard integration gate after review.
