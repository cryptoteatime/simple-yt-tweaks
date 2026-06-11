# Current State

## Project

- Name: Simple YT Tweaks
- Folder: `/Users/d4ngl/Git Repos/Codex/simple-yt-tweaks`
- Status: existing repo, post-v0.3.0 hardening; `SYT-010H` final-leg polish/code-hardening is active under issue #10.
- GitHub: `https://github.com/cryptoteatime/simple-yt-tweaks`

## Current Focus

1. Finish the first `SYT-010H` supervised burst:
   - A: settings/popup/defaults/persistence coverage.
   - B: selector/runtime churn audit.
   - C: swarm docs/context compaction.
2. Keep runtime implementation serial until B reports. Do not mix `SYT-010H-D/E/F` with the active A/B/C batch.
3. Keep #8 enhanced Home/Search hover grow research paused unless the user explicitly reopens it.
4. Keep release-candidate/version/tag/Web Store work out of the hardening lanes.

## Recent State

- PR #37 merged at `342854f`, closing #36/#38 after user-confirmed Home hover and live Theater/chat behavior.
- PR #39 recorded #36/#38 integration.
- PRs #40/#41/#42 repaired SYT-010H context, burst capacity, and planner registry state.
- PR #43 merged the `SYT-010H` lane map at `7ce7872`.
- PR #44 registered the A/B/C batch at `2f991ef`.
- PRs #45 and #46 are open for A and B; C is this docs compaction branch.
- Issue #10 remains open for final-leg hardening; #8 remains a future gated research lane.

## Constraints And Risks

- Source modules such as `grid-hover.ts`, `sticky-player.ts`, `sidebar.ts`, `fullscreen.ts`, and `theater.ts` touch fragile YouTube DOM behavior.
- Settings are duplicated between `src/shared/settings.ts` and `src/content/settings.ts`; parity tests are the guardrail.
- Live YouTube smoke can be noisy; fixture-first checks remain the normal gate.
- Do not reintroduce Home/Search enhanced hover grow, synthetic hover, or forced preview playback.
- Do not bump version, tag releases, edit Web Store assets, or close #10 from docs/test lanes.

## Verification Defaults

- Runner focused checks: task-specific `npm run test:e2e`, `npm run test:unit`, `npm run lint`, `npm run typecheck`, or `git diff --check` as assigned.
- Reviewer targeted checks: changed-risk checks plus PR body/handoff validation.
- Integrator full gate for source/test PRs: `npm run validate:all`.
- Human QA: release candidate, #8 visual hover implementation, or explicit high-risk live browser behavior.

## Automation Notes

- Controller heartbeat: active, id `simple-yt-tweaks-controller-heartbeat`.
- Capacity: up to 3 only for planner-approved disjoint `SYT-010H` A/B/C work; review, integration, and runtime implementation stay serial.
- Shared docs lock: controller owns task-board, current-state, controller-directives, and agent-registry unless a handoff explicitly assigns them.
- Registry: `docs/swarm/agent-registry.md`.

## Last Updated

- Date: 2026-06-11
- By: Docs Runner for `SYT-010H-C`
