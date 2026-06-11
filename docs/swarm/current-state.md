# Current State

## Project

- Name: Simple YT Tweaks
- Folder: `/Users/d4ngl/Git Repos/Codex/simple-yt-tweaks`
- Status: existing repo, post-v0.3.0 hardening; `SYT-010H` implementation lanes are integrated, `SYT-RC-001` human QA passed, and #10 is closed.
- GitHub: `https://github.com/cryptoteatime/simple-yt-tweaks`

## Current Focus

1. Completed `SYT-010H` lanes:
   - A: settings/popup/defaults/persistence coverage, PR #45 merged at `ce09953`.
   - B: selector/runtime churn audit, PR #46 merged at `ddac456`.
   - C: swarm docs/context compaction, PR #47 merged at `b5e3f34`.
   - D: runtime video binding hardening, PR #48.
   - E: modern Search lockup selector fixture hardening, PR #50.
2. `SYT-010H-F` integrated one-module `grid-hover.ts` watch-recommendation selector organization cleanup.
3. `SYT-RC-001` human QA passed on 2026-06-11.
4. Keep #8 enhanced Home/Search hover grow research paused unless the user explicitly reopens it.
5. Keep version/tag/Web Store release actions out unless explicitly approved.

## Recent State

- PR #37 merged at `342854f`, closing #36/#38 after user-confirmed Home hover and live Theater/chat behavior.
- PR #39 recorded #36/#38 integration.
- PRs #40/#41/#42 repaired SYT-010H context, burst capacity, and planner registry state.
- PR #43 merged the `SYT-010H` lane map at `7ce7872`.
- PR #44 registered the A/B/C batch at `2f991ef`.
- PR #45 merged settings/popup coverage.
- PR #46 merged the selector/runtime churn audit.
- PR #47 merged docs compaction at `b5e3f34`.
- PR #48 hardened runtime video binding from the existing apply loop.
- PR #50 hardened modern Search lockup fixture coverage.
- PR #54 organized grid-hover watch recommendation selector construction and added unit assertions.
- PR #55 integrated the `SYT-RC-001` checklist and #10 completion criteria.
- `npm run validate:all` passed on clean `main` after PR #55.
- Issue #10 is closed after `SYT-RC-001` human QA passed; #8 remains a future gated research lane.

## Constraints And Risks

- Source modules such as `grid-hover.ts`, `sticky-player.ts`, `sidebar.ts`, `fullscreen.ts`, and `theater.ts` touch fragile YouTube DOM behavior.
- Settings are duplicated between `src/shared/settings.ts` and `src/content/settings.ts`; parity tests are the guardrail.
- Live YouTube smoke can be noisy; fixture-first checks remain the normal gate.
- Do not reintroduce Home/Search enhanced hover grow, synthetic hover, or forced preview playback.
- Do not bump version, tag releases, edit Web Store assets, or restart #8 without explicit user approval.

## Verification Defaults

- Runner focused checks: task-specific `npm run test:e2e`, `npm run test:unit`, `npm run lint`, `npm run typecheck`, or `git diff --check` as assigned.
- Reviewer targeted checks: changed-risk checks plus PR body/handoff validation.
- Integrator full gate for source/test PRs: `npm run validate:all`.
- Human QA: `SYT-RC-001` passed; future human QA is required for #8 visual hover implementation, release candidates, or explicit high-risk live browser behavior.

## Automation Notes

- Controller heartbeat: paused after `SYT-RC-001` became human-gated, id `simple-yt-tweaks-controller-heartbeat`.
- Capacity: up to 3 only for planner-approved disjoint `SYT-010H` A/B/C work; review, integration, and runtime implementation stay serial.
- Shared docs lock: controller owns task-board, current-state, controller-directives, and agent-registry unless a handoff explicitly assigns them.
- Registry: `docs/swarm/agent-registry.md`.

## Last Updated

- Date: 2026-06-11
- By: Controller after `SYT-RC-001` human QA pass and #10 closure
