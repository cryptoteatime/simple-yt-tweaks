# SYT-010D Handoff: Pure Helper Tests

## Task

- Task id: `SYT-010D`
- Title: Pure helper tests
- Assigned role: Planner/Runner - Dirac (`019ddb72-af51-7372-8146-43d5ead7148a`)
- Current state: Needs Review
- Repo: `/Users/d4ngl/Git Repos/Codex/simple-yt-tweaks`
- Branch: `swarm/syt-010d-helper-tests`

## Goal

Add fast helper-level coverage where it provides real regression value for post-v0.3.0 hardening, especially settings normalization and selector-safe DOM helpers. If a helper-level test lane would add more maintenance cost than value, document a narrow deferral instead of forcing a brittle test layer.

## Scope

- Audit browser-independent or low-browser-coupling helpers such as:
  - `src/content/settings.ts`: `normalizeSettings`, `isFeatureEnabled`, settings fallback behavior.
  - `src/content/dom.ts`: `normalizeLabel`, `labelMatchesEntry`, `elementMatchesAnyLabel`, `query`, and `queryAll`.
  - `src/shared/settings.ts` only if needed to assert default/parity behavior.
- Prefer existing tooling. Playwright is already available and can run TypeScript tests; avoid new dependencies unless clearly justified.
- If adding a unit/helper project, keep it small and obvious, such as `tests/unit/**`, `playwright.config.ts`, and `package.json` scripts.
- Keep product/runtime behavior unchanged unless a tiny export or testability adjustment is necessary and low risk.

## Non-Scope

- No version bump, tag, release, or Web Store asset change.
- No enhanced home/search hover implementation; #8 remains a future research lane.
- No broad module splitting or architecture refactor.
- No live YouTube dependency for this lane.
- No popup/user-facing behavior changes.

## Dependencies

- Depends on: `SYT-010A`, `SYT-010B`, `SYT-010C`
- Blocks: none directly; improves confidence before future `SYT-010E` module review or `SYT-008A` research.

## Parallelization

- parallel-safe: yes, if limited to tests/config/helper exports and no other active source tasks exist.
- serial-required: no, under current max capacity 1.
- depends-on: integrated `SYT-010A`, `SYT-010B`, and `SYT-010C`.
- conflict-risk: low/medium. Low for tests-only; medium if helper exports or shared settings contracts are touched.

## Suggested Implementation Plan

1. Inspect existing Playwright config, scripts, and helper exports.
2. Decide whether a `tests/unit` Playwright project is worthwhile.
3. Add narrow tests for settings normalization and DOM helper behavior, or document why the lane should be deferred.
4. Keep `npm run validate:all` as the final gate if config/source/package files change.
5. Push the branch and open a draft PR with a `How to test / what to tell the controller` section.

## Verification Tier

- Verification tier: focused runner checks, full if config/source/package changes.
- Minimum checks if tests/config/source/package change:
  - `npm run typecheck`
  - `npm run lint`
  - focused new helper test command or targeted Playwright project
  - `npm run validate:all`
- Minimum checks if docs-only deferral:
  - `git diff --check`

## GitHub Actions Allowed

- Push branch: yes.
- Open draft PR: yes, if implementation or documented deferral is useful to review.
- Merge: no.
- Human QA: no, unless runtime behavior changes unexpectedly.

## Files Or Areas Touched

- Controller prep:
  - `docs/swarm/handoffs/SYT-010D.md`
  - `docs/swarm/task-board.md`
  - `docs/swarm/agent-registry.md`
  - `docs/swarm/current-state.md`
  - `docs/swarm/controller-directives.md`
- Runner implementation:
  - `package.json`
  - `playwright.config.ts`
  - `tests/unit/dom.unit.spec.ts`
  - `tests/unit/settings.unit.spec.ts`

## Commands Run

- Controller prep:
  - `git diff --check`: PASS
  - `git push -u origin swarm/syt-010d-helper-tests`: PASS
- Runner implementation:
  - `npm run test:unit`: PASS, 8 unit tests passed.
  - `npm run typecheck`: PASS.
  - `npm run lint`: PASS.
  - `npm run validate:all`: PASS, including package validation, 8 unit tests, and 8 fixture tests.

## Decisions Made

- Keep this lane separate from #8 enhanced hover research and `SYT-010E` module splitting.
- Do not add dependencies unless the existing Playwright/TypeScript stack cannot cover the helper behavior cleanly.
- Added a small Playwright `unit` project instead of introducing a new unit-test dependency.
- Added `npm run test:unit` and included the unit project in `npm run validate:all` so helper coverage runs in the full repo gate.
- Kept runtime/source behavior unchanged; no helper exports or source refactors were needed.

## Blockers Or Risks

- No blockers.
- Residual risk: unit tests use fake roots/elements for selector-safe DOM helpers rather than a real DOM. This is intentional to keep the lane fast and dependency-free; browser fixture coverage remains responsible for integrated DOM behavior.

## Pull Request

- Draft PR: https://github.com/cryptoteatime/simple-yt-tweaks/pull/18

## Next Recommended Role

- Reviewer should inspect the helper-test coverage, Playwright project config, and `validate:all` script change. If satisfied, mark `SYT-010D` Ready to Integrate. Human review requested: no.

## Copy-Ready Runner Prompt

```text
You are the Planner/Runner for Simple YT Tweaks task SYT-010D.

Repo: /Users/d4ngl/Git Repos/Codex/simple-yt-tweaks
Branch: swarm/syt-010d-helper-tests

Read ../AGENTS.md, SWARM.md, docs/swarm/controller-directives.md, docs/swarm/task-board.md, docs/swarm/agent-registry.md, docs/swarm/github.md, and docs/swarm/handoffs/SYT-010D.md before editing.

Scope: add fast helper-level coverage for settings normalization and selector-safe DOM helpers, or document a narrow deferral if the test layer would be more costly than useful. Prefer existing Playwright/TypeScript tooling. Avoid new dependencies unless clearly justified. Do not change product/runtime behavior except for tiny low-risk testability exports if needed. Do not work on #8 enhanced hover, releases, version bumps, tags, live YouTube behavior, or broad module splitting.

Allowed GitHub actions: push the task branch and open a draft PR with a visible "How to test / what to tell the controller" section. Do not merge.

Verification: if tests/config/source/package files change, run npm run typecheck, npm run lint, a focused helper test command or targeted Playwright project, and npm run validate:all. If the lane is docs-only deferral, run git diff --check.

Update docs/swarm/handoffs/SYT-010D.md with files touched, commands/results, decisions, blockers, and next role. Report Needs Review when complete.
```
