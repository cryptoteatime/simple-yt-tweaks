# Task Board

Use this file as the repo-local queue. Keep entries short and route details to handoff files.

## Status Values

`Proposed`, `Ready`, `In Progress`, `Needs Review`, `Needs Fixes`, `Ready for Human QA`, `Ready to Integrate`, `Integrated`, `Blocked`, `Paused`

## Planning Gate

- Project brief: Ready
- Material questions: Deferred, not blocking
- First milestone plan: Ready
- Implementation dispatch: Active; `SYT-010B` is integrated and `SYT-010C` is the next safe lane

## Active Tasks

| Task ID | Title | Role | Status | Branch | Scope | Parallel | Depends On | Conflict Risk | Handoff | PR |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `SYT-010A` | Audit and harden fixture coverage for #10/#8 risk | Integrator | Integrated | `swarm/syt-010a-test-harness-audit` | `tests/e2e/**`, docs as needed | parallel-safe after bootstrap | `SYT-CTL-001` | medium, fixture contracts | `docs/swarm/handoffs/SYT-010A.md` | #12 merged |
| `SYT-010B` | Settings parity and source-of-truth hardening | Integrator | Integrated | `swarm/syt-010b-settings-hardening` | `src/shared/settings.ts`, `src/content/settings.ts`, validation/tests | serial-required | `SYT-010A` | high, settings contracts | `docs/swarm/handoffs/SYT-010B.md` | #14 merged |
| `SYT-010C` | Release-candidate process smoothing | Reviewer | Needs Review | `swarm/syt-010c-rc-process` | `DEVELOPMENT.md`, `docs/swarm/**`, scripts if needed | parallel-safe with source-free work | `SYT-010A` preferred | low/medium, release docs | `docs/swarm/handoffs/SYT-010C.md` | #16 |
| `SYT-008A` | Enhanced home/search hover research gate | Planner | Paused | `swarm/syt-008a-hover-research` | #8 research, fixtures/prototype only | serial-required | `SYT-010A`, user/product gate | high, live YouTube preview lifecycle | `docs/swarm/handoffs/SYT-008A.md` | none |

## Backlog

| Task ID | Title | Reason | Notes |
| --- | --- | --- | --- |
| `SYT-010D` | Pure helper tests | Add fast coverage for settings normalization and selector-safe DOM helpers. | Can follow `SYT-010A` if it identifies browser-independent logic. |
| `SYT-010E` | Large module split review | Reduce risk in large content modules only where it lowers real maintenance cost. | Do not split for aesthetics; require test coverage first. |
| `SYT-RC-001` | Next release-candidate checklist | Make future version bump/package/release flow smoother. | Human QA required before release. |

## Blocked

| Task ID | Blocker | Needed From | Next Check |
| --- | --- | --- | --- |
| none | none | none | none |

## Ready For Review

| Task ID | Branch | Reviewer Focus | Verification Tier | Handoff |
| --- | --- | --- | --- | --- |
| `SYT-010C` | `swarm/syt-010c-rc-process` | RC gate clarity, fixture-first policy, live-smoke/human-QA/release approval boundaries, docs-only scope | docs/process review | `docs/swarm/handoffs/SYT-010C.md` |

## Ready To Integrate

| Task ID | Branch | Checks | Cleanup Plan | Handoff |
| --- | --- | --- | --- | --- |
| none | none | none | none | none |

## Human QA

| Task ID | PR / URL | Status | Required Before Merge | Exact Pass/Fail Message |
| --- | --- | --- | --- | --- |
| `SYT-008A` | none | Not started | Yes before implementing visual hover behavior | `Human QA passed/failed for SYT-008A: <notes>` |
| `SYT-RC-001` | none | Not started | Yes before release | `Human QA passed/failed for SYT-RC-001: <notes>` |

## Controller Notes

- Active controller-spawned subagents: none; next safe route is `SYT-010C` Reviewer for PR #16.
- Active cron bursts: none; cron is a failsafe, not the normal execution path.
- Parallel worktree root: none yet.
- Batch dispatch policy: disabled by default because max active subagents is 1.
- Shared docs lock: controller owns task-board, current-state, controller-directives, and agent-registry during parallel work.
- Verification tiers: focused runner checks, targeted reviewer checks, full integrator/checkpoint verify.
- Agent registry: `docs/swarm/agent-registry.md`.
- Bootstrap log: `docs/swarm/bootstrap-log.md`.
- GitHub workflow: `docs/swarm/github.md`.
- Current controller phase: Phase 4 active; `SYT-010C` is ready for review.
