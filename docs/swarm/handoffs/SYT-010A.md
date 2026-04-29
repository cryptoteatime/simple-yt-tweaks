# SYT-010A: Audit And Harden Fixture Coverage

## State

- Status: Ready
- Role: Planner/Runner
- Repo: Simple YT Tweaks
- Branch: `swarm/syt-010a-test-harness-audit`
- Owner: Unassigned
- Created: 2026-04-29
- Updated: 2026-04-29

## Goal

Audit the existing Playwright extension harness and add missing deterministic fixture coverage needed before #10 hardening and any future #8 research.

## Scope

- Inspect `tests/e2e/extension.fixture.spec.ts`, `tests/e2e/youtube-fixtures.ts`, `tests/e2e/extension-fixture.ts`, and `playwright.config.ts`.
- Map existing tests to the current GitHub #8/#10 risks.
- Add fixture tests only where they catch likely regressions from hardening work.
- Update `DEVELOPMENT.md` or swarm docs if commands/coverage expectations change.

## Non-Scope

- Do not implement enhanced home/search hover.
- Do not change production behavior unless a fixture bug exposes an obvious test-only issue.
- Do not rely on live YouTube tests as the primary gate.

## Dependencies

- `SYT-CTL-001` merged.

## Lane Metadata

- Parallel-safe: yes with docs-only lanes if capacity is raised; default capacity still keeps this single-owner.
- Serial-required: no.
- Depends-on: `SYT-CTL-001`.
- Conflict-risk: medium; fixture contracts and test expectations.
- Shared coordination docs allowed: only this handoff unless controller assigns more.

## Plan

1. Create a task branch from current `main`.
2. Audit fixture coverage against #10 targets: settings parity, comments visibility, popup defaults, search cleanup, home sponsored gap cleanup, sidebar hover grow, sticky player/PiP click fallback.
3. Audit #8 prerequisites: prove current home/search native hover code is not reintroduced and identify what fixtures cannot prove.
4. Add focused fixture coverage for missing deterministic cases.
5. Run focused tests, then full `npm run validate:all` before PR.

## Files / Areas

- `tests/e2e/**`
- `playwright.config.ts`
- `DEVELOPMENT.md`
- `docs/swarm/handoffs/SYT-010A.md`

## Decisions

- Fixture tests are the gate; live smoke is optional and non-blocking.
- Any #8 implementation remains paused until this lane identifies a safe proof strategy.

## Work Log

- 2026-04-29: Lane seeded during bootstrap.

## Verification

- Verification tier: focused runner checks plus full gate before PR.

| Check | Result | Notes |
| --- | --- | --- |
| `npm run test:e2e` | Not run for this lane yet | Required after fixture changes. |
| `npm run validate:all` | Not run for this lane yet | Required before PR. |
| `npm run test:e2e:live` | Optional | Use only if the lane explicitly needs live smoke context. |

## Human Acceptance Checklist

- Required before merge: No
- URL(s): PR TBD
- Who should test: Reviewer/Integrator
- Steps:
  1. Review coverage matrix.
  2. Run `npm run validate:all`.
  3. Confirm no human YouTube QA is requested for routine test-hardening changes.
- Expected result: fixture suite covers the next safe #10 hardening slice and documents #8 limitations.
- If it passes, tell the controller: `Review passed for SYT-010A: fixture coverage ready`
- If it fails, tell the controller: `Review failed for SYT-010A: <issue>`

## Blockers / Risks

- Future #8 hover behavior may require live-site observation that fixtures cannot safely prove.

## Next Handoff

- Next role: Runner
- Next action: Implement coverage audit and missing fixture tests.
- Branch/worktree cleanup needed after merge: yes.
- Copy-ready prompt:

```text
Run Simple YT Tweaks SYT-010A.

Repo: /Users/d4ngl/Git Repos/Codex/simple-yt-tweaks
Create branch: swarm/syt-010a-test-harness-audit

Read ../AGENTS.md, SWARM.md, docs/swarm/controller-directives.md, docs/swarm/project-brief.md, docs/swarm/current-state.md, docs/swarm/task-board.md, docs/swarm/github.md, and docs/swarm/handoffs/SYT-010A.md.

Audit Playwright fixture coverage against #8 and #10. Add deterministic fixture tests only where they will catch likely hardening regressions. Keep live YouTube smoke optional and non-blocking. Run npm run test:e2e and npm run validate:all. Update this handoff and open a draft PR with a How to test / what to tell the controller section.
```
