# SYT-010E: Post-#21 Code Hardening Lane

## Status

- State: Ready after PR #22 review/integration state is clear
- GitHub issue: #10
- Branch: TBD, use `swarm/syt-010e-<short-slug>`
- Role: Planner or Senior Runner
- Updated: 2026-06-10

## Goal

Continue post-v0.3.0 hardening without broad rewrites. Use fixture and unit coverage as the gate, and only refactor where it reduces real regression risk.

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

1. Review PR #22 outcome and any reviewer/user QA notes.
2. Run `npm run validate:all` on the current baseline.
3. Choose one hardening target with a bounded write scope.
4. Add/adjust fixture or unit coverage for that target.
5. Implement the smallest behavior-preserving cleanup.
6. Open a draft PR with `How to test / what to tell the controller`.

## Verification

- Focused checks for the chosen scope.
- Always run `npm run validate:all` before integration.
- Use signed-in Chrome live smoke only when the target touches live-only YouTube behavior.
