# SYT-010E: Post-#21 Code Hardening Lane

## Status

- State: Needs Review
- GitHub issue: #10
- Branch: `swarm/syt-010e-code-hardening`
- PR: #24, https://github.com/cryptoteatime/simple-yt-tweaks/pull/24
- Role: Senior Runner
- Updated: 2026-06-10 by Senior Runner

## Goal

Continue post-v0.3.0 hardening without broad rewrites. Use fixture and unit coverage as the gate, and only refactor where it reduces real regression risk.

## Chosen Target

Narrow behavior-preserving selector normalization in `src/content/grid-hover.ts`:

- Centralized the watch recommendation hover-grow card/media/overlay selector variants used by `buildSidebarHoverCss`.
- Kept the legacy `ytd-compact-video-renderer` and modern `yt-lockup-view-model` selectors emitted for default and theater watch modes.
- Added unit coverage that asserts enabled-mode scoping and disabled-mode omission for the generated grid hover CSS.

## Scope

- Audit the largest/highest-risk content modules after #21 settles:
  - `src/content/grid-hover.ts`
  - `src/content/sidebar.ts`
  - `src/content/sticky-player.ts`
  - `src/content/fullscreen.ts`
  - `src/content/theater.ts`
- Pick one narrow implementation target per PR.
- Prefer behavior-preserving extraction, selector normalization, or helper tests over aesthetic file splitting.
- Add or extend tests before changing fragile YouTube DOM behavior.

## Non-Scope

- Do not revive #8 enhanced Home/Search hover grow.
- Do not change settings defaults.
- Do not version bump, tag, release, or edit Web Store assets.
- Do not combine broad code hardening with release-candidate work.

## Lane Metadata

- Parallel-safe: no while #21 is under review or integration.
- Serial-required: yes for runtime source hardening.
- Depends-on: PR #22 review/integration state clear.
- Conflict-risk: medium/high because these files touch live YouTube DOM behavior.

## Suggested First Pass

Completed:

1. Reviewed hot swarm state after PR #22 integration.
2. Audited the requested high-risk modules by function outline and sampled relevant source/test sections.
3. Chose one bounded target: grid hover watch recommendation selector normalization.
4. Added unit coverage before/alongside the cleanup.
5. Ran focused checks and the full validation gate.

## Files Touched

- `src/content/grid-hover.ts`
- `tests/unit/grid-hover.unit.spec.ts`
- `docs/swarm/handoffs/SYT-010E.md`

## Verification

- Focused: `npm run test:unit` - passed, 10 tests.
- Focused: `npm run test:e2e` - passed, 10 fixture tests.
- Full gate: `npm run validate:all` - passed, including typecheck, lint, `git diff --check`, package validation, unit tests, and fixture tests.
- Live Chrome/YouTube smoke not used; this target is selector/CSS generation cleanup with fixture coverage.

## Risks

- Low/medium residual risk: the selector normalization still touches watch recommendation hover CSS assembly, but the emitted legacy and modern selector families are covered by unit assertions and fixture watch hover tests.
- No settings defaults changed.
- #8 enhanced Home/Search hover grow was not reintroduced.
- No version, release, tag, or Web Store asset changes.

## Next Recommended Role

Reviewer: review `src/content/grid-hover.ts` selector normalization, `tests/unit/grid-hover.unit.spec.ts` coverage, PR body test instructions, and confirm `Needs Review` can move to `Ready to Integrate`.
