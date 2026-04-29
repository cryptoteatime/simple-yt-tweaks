# SYT-010A: Audit And Harden Fixture Coverage

## State

- Status: In Progress
- Role: Integrator
- Repo: Simple YT Tweaks
- Branch: `swarm/syt-010a-test-harness-audit`
- Owner: Codex Controller
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
- 2026-04-29: Runner audited fixture harness, added deterministic hardening coverage, and opened draft PR #12 from `swarm/syt-010a-test-harness-audit`.
- 2026-04-29: Controller heartbeat routed Reviewer Mendel (`019dd89b-89b0-79f3-bf62-b64b3cb0ae6f`) for PR #12.
- 2026-04-29: Reviewer Mendel reported no findings and marked PR #12 Ready to Integrate.
- 2026-04-29: Controller heartbeat routed Integrator McClintock (`019dd8f8-d696-7f82-a403-c1f7b70e2716`) for PR #12.

## Coverage Matrix

| Area / Risk | Current Coverage Before This Lane | Added / Confirmed In This Lane | Missing Deterministic Cases | Fixtures Cannot Prove | Live / Human Gate |
| --- | --- | --- | --- | --- | --- |
| Home feed cleanup and #8 guardrail | Home fixture verified 3-column layout, sponsored removal, Shorts hidden, and CSS did not include old home preview selectors. | Added a native preview-like home card and verifies hover does not add `simple-yt-tweaks-grid-hover-ready`; keeps CSS negative assertions for `ytd-video-preview` and old home hover class. | Does not assert every possible YouTube home renderer variant. | Whether live YouTube experiments change native preview markup or preview startup timing. | No gate for #10. Required before any #8 implementation decision. |
| Search compact grid cleanup | Search fixture verified grid display, channel card centering, Shorts grid hidden, playlist hidden, badge movement, and continuation hiding. | Added deterministic exclusions for Shorts-like video results, radio/mix results, `ytd-radio-renderer`, generic shelves, and no old home/search hover CSS. | Additional renderer names may appear on live YouTube and should be added when observed. | Live search experiment renderer churn and ad/consent/bot surfaces. | No gate for #10; optional live smoke only if reviewer asks. |
| Search setting gate | Popup default checked `generalApplyFeedColumnsToSearch`, but content behavior only covered enabled state. | Added storage-backed disabled-state fixture: no grid CSS behavior, playlist remains visible, badges are not moved. | Does not cover every feed-column count in search. | Live YouTube layout with disabled setting. | No human gate. |
| Popup defaults, normalization, and storage | Popup test covered version, default tabs, two defaults, persistence for `pipButton`, and nested mode controls. | Added visible-pane reset for `pipButton`; added invalid stored values test for `generalFeedColumns`, boolean fallback, and `pipButton` retaining valid false. | Storage runtime error fallback remains source-level only; not simulated because Chrome extension APIs do not expose a stable way to force `runtime.lastError` in this harness. | Browser-specific sync storage quota/error behavior. | No human gate. |
| Watch comments visibility | Default/theater comments were asserted visible under defaults. | Added storage-backed hidden comments coverage for default and theater modes. | Fullscreen comments/action overlays remain covered only by existing source behavior and optional manual checks. | YouTube live-chat/comment experiment variants. | No human gate for comments. |
| Sidebar recommendation hover grow | Existing watch fixture covered hover-ready class after hover. | Added delay guard before ready class appears; added disabled default/theater hover-grow setting gate. | Does not test every recommendation renderer variant or edge positioning class. | Real hover preview lifecycle and renderer timing on live YouTube. | #8 future hover research needs human/visual gate. |
| Player click fallback | Existing watch fixture proved video surface clicks toggle play/pause. | Extracted playback probe helper and added guardrails that player controls and modified video clicks do not trigger fallback. | Bottom-control-region coordinate test was avoided to keep fixture stable across overlay hit-testing. | Native YouTube player controls and browser media policy nuances. | No human gate unless reviewer flags live player behavior risk. |
| Sticky player | Existing fixture indirectly keeps video pointer events `auto`; no sticky dock fixture. | No new deterministic sticky-player dock test added in this lane; audit documents gap. | Deterministic scroll/visibility dock/undock behavior for sticky player. | Real viewport, player sizing, PiP interactions, and YouTube layout shifts. | Candidate future fixture task before sticky-player refactors; live/manual for release candidates. |
| Live YouTube smoke | Optional `test:e2e:live` exists and skips unless `SIMPLE_YT_TWEAKS_LIVE=1`. | Confirmed it remains optional and non-blocking. | None for this lane. | Consent screens, bot checks, ads, experiments, network failures. | Not requested for SYT-010A. |

## Files Changed

- `tests/e2e/extension.fixture.spec.ts`
  - Added extension storage writer helper.
  - Added reusable playback probe helper.
  - Added search disabled-setting test, hover disabled/hidden comments test, player click fallback guardrail test, and invalid popup storage normalization test.
  - Strengthened existing home, search, watch, and popup tests.
- `tests/e2e/youtube-fixtures.ts`
  - Added native preview-like home fixture card.
  - Added search cleanup edge-case renderers.
  - Added a player control button to the watch fixture.

## Decisions

- Kept live YouTube smoke optional and non-blocking.
- Did not edit runtime/product behavior; fixture coverage did not expose a product bug requiring source changes.
- Did not add sticky-player dock assertions in this pass because stable scroll/visibility docking deserves a separate focused fixture task instead of fragile incidental coverage.
- Did not update shared controller-owned docs beyond this handoff.

## Verification

- Verification tier: focused runner checks plus full gate before PR.

| Check | Result | Notes |
| --- | --- | --- |
| `npm run test:e2e` | Passed | 8 fixture tests passed after adding coverage. |
| `npm run validate:all` | Passed | Includes typecheck, lint, `git diff --check`, package validation, and fixture Playwright tests. |
| `git diff --check origin/main...HEAD` | Passed | Reviewer targeted whitespace check. |
| `npm run test:e2e:live` | Optional | Use only if the lane explicitly needs live smoke context. |

## Human Acceptance Checklist

- Required before merge: No
- URL(s): https://github.com/cryptoteatime/simple-yt-tweaks/pull/12
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
- Sticky-player dock/undock behavior remains a documented deterministic coverage gap for a future focused test lane.

## Review Result

- Reviewer: Mendel (`019dd89b-89b0-79f3-bf62-b64b3cb0ae6f`)
- Verdict: Ready to Integrate
- Findings: none
- Targeted checks:
  - `git status --short --branch`: clean on `swarm/syt-010a-test-harness-audit...origin/swarm/syt-010a-test-harness-audit`
  - `git diff --check origin/main...HEAD`: passed
  - `npm run test:e2e`: passed, 8 fixture tests
- Human QA requested: no

## Next Handoff

- Next role: Integrator
- Next action: Confirm PR #12 is still mergeable, run `npm run validate:all`, mark the draft PR ready if needed, merge through the GitHub PR path, sync `main`, and clean branches when safe.
- Branch/worktree cleanup needed after merge: yes.
- Copy-ready prompt:

```text
Run Simple YT Tweaks SYT-010A.

Repo: /Users/d4ngl/Git Repos/Codex/simple-yt-tweaks
Create branch: swarm/syt-010a-test-harness-audit

Read ../AGENTS.md, SWARM.md, docs/swarm/controller-directives.md, docs/swarm/project-brief.md, docs/swarm/current-state.md, docs/swarm/task-board.md, docs/swarm/github.md, and docs/swarm/handoffs/SYT-010A.md.

Audit Playwright fixture coverage against #8 and #10. Add deterministic fixture tests only where they will catch likely hardening regressions. Keep live YouTube smoke optional and non-blocking. Run npm run test:e2e and npm run validate:all. Update this handoff and open a draft PR with a How to test / what to tell the controller section.
```
