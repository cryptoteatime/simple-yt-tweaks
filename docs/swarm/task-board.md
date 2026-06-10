# Task Board

Use this file as the repo-local queue. Keep entries short and route details to handoff files.

## Status Values

`Proposed`, `Ready`, `In Progress`, `Needs Review`, `Needs Fixes`, `Ready for Human QA`, `Ready to Integrate`, `Integrated`, `Blocked`, `Paused`

## Planning Gate

- Project brief: Ready
- Material questions: Deferred, not blocking
- First milestone plan: Ready
- Implementation dispatch: none active; `SYT-010G` is integrated and issue #10 remains open.

## Active Tasks

| Task ID | Title | Role | Status | Branch | Scope | Parallel | Depends On | Conflict Risk | Handoff | PR |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `SYT-010A` | Audit and harden fixture coverage for #10/#8 risk | Integrator | Integrated | `swarm/syt-010a-test-harness-audit` | `tests/e2e/**`, docs as needed | parallel-safe after bootstrap | `SYT-CTL-001` | medium, fixture contracts | `docs/swarm/handoffs/SYT-010A.md` | #12 merged |
| `SYT-010B` | Settings parity and source-of-truth hardening | Integrator | Integrated | `swarm/syt-010b-settings-hardening` | `src/shared/settings.ts`, `src/content/settings.ts`, validation/tests | serial-required | `SYT-010A` | high, settings contracts | `docs/swarm/handoffs/SYT-010B.md` | #14 merged |
| `SYT-010C` | Release-candidate process smoothing | Integrator | Integrated | `swarm/syt-010c-rc-process` | `DEVELOPMENT.md`, `docs/swarm/**`, scripts if needed | parallel-safe with source-free work | `SYT-010A` preferred | low/medium, release docs | `docs/swarm/handoffs/SYT-010C.md` | #16 merged |
| `SYT-010D` | Pure helper tests | Integrator | Integrated | `swarm/syt-010d-helper-tests` | `tests/unit/**`, `playwright.config.ts`, `package.json`, helper modules only if needed | parallel-safe with no other source task | `SYT-010A`, `SYT-010B`, `SYT-010C` | low/medium, test config/helper exports | `docs/swarm/handoffs/SYT-010D.md` | #18 merged |
| `SYT-008A` | Enhanced home/search hover research gate | Planner | Paused | `swarm/syt-008a-hover-research` | #8 research, fixtures/prototype only | serial-required | `SYT-010A`, user/product gate | high, live YouTube preview lifecycle | `docs/swarm/handoffs/SYT-008A.md` | none |
| `SYT-021` | Native hover SPA regression and live recommendation drift | Integrator | Integrated | `swarm/syt-008b-native-hover-spa-regression` | #21 native Home/Search preview repair, watch click fallback hardening, modern recommendation selector drift | serial-required | v0.3.0 baseline | high, live YouTube SPA/player behavior | `docs/swarm/handoffs/SYT-021.md` | #22 merged |
| `SYT-010E` | Code-hardening lane after #21 | Integrator | Integrated | `swarm/syt-010e-code-hardening` | Grid-hover selector normalization with unit coverage | serial-required | `SYT-021` | medium/high, runtime source hardening | `docs/swarm/handoffs/SYT-010E.md` | #24 merged |
| `SYT-010F` | Sticky Player hardening | Integrator | Integrated | `swarm/syt-010f-sticky-player-hardening` | Sticky Player visibility/resize helpers and deterministic dock/restore fixture coverage | serial-required | `SYT-010F` planning PR #26 merged | medium/high, player DOM docking | `docs/swarm/handoffs/SYT-010F.md` | #28 merged |
| `SYT-031` | Home native hover autoplay after watch-to-Home SPA | Integrator | Integrated | `swarm/syt-031-home-hover-stationary-spa` | #31 stale/missing Home native preview recovery, fixture/live coverage | serial-required | `SYT-021` | high, live YouTube SPA preview lifecycle | `docs/swarm/handoffs/SYT-031.md` | #32 merged |
| `SYT-010G` | Fullscreen player UI geometry hardening | Integrator | Integrated | `swarm/syt-010g-fullscreen-ui-geometry` | Extract/test player UI hover reveal geometry | serial-required | `SYT-031` | medium, watch-page player UI behavior | `docs/swarm/handoffs/SYT-010G.md` | #34 merged |

## Backlog

| Task ID | Title | Reason | Notes |
| --- | --- | --- | --- |
| `SYT-RC-001` | Next release-candidate checklist | Make future version bump/package/release flow smoother. | Human QA required before release. |
| `SYT-010H` | Next bounded #10 hardening lane | Issue #10 remains open after `SYT-010G` unless the controller closes it. | Proposed only; requires a narrow source/test target and handoff before dispatch. |

## Blocked

| Task ID | Blocker | Needed From | Next Check |
| --- | --- | --- | --- |
| none | none | none | none |

## Ready For Review

| Task ID | Branch | Reviewer Focus | Verification Tier | Handoff |
| --- | --- | --- | --- | --- |
| none | none | none | none | none |

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

- Active controller-spawned subagents: none after Hume integrated `SYT-010F` implementation PR #28.
- Active cron bursts: none; cron is a failsafe, not the normal execution path.
- Parallel worktree root: none yet.
- Batch dispatch policy: disabled by default because max active subagents is 1.
- Shared docs lock: controller owns task-board, current-state, controller-directives, and agent-registry during parallel work.
- Verification tiers: focused runner checks, targeted reviewer checks, full integrator/checkpoint verify.
- Agent registry: `docs/swarm/agent-registry.md`.
- Bootstrap log: `docs/swarm/bootstrap-log.md`.
- GitHub workflow: `docs/swarm/github.md`.
- Current controller phase: Phase 4 active; decide whether to plan `SYT-010H` or leave #10 open for later.
- 2026-06-10: User reported live watch-to-Home native hover autoplay regression. Controller opened #21 and draft PR #22 for `SYT-021` on `swarm/syt-008b-native-hover-spa-regression`.
- 2026-06-10: User requested compact context/docs and more frequent automation. Completed historical handoffs were compacted to stubs with `docs/swarm/archive/README.md` reference mapping; `docs/swarm/context-map.md` is now the hot context entrypoint.
- 2026-06-10: PR #22 squash-merged at `8f90ef1`, closing #21. Remote/local task branch cleanup completed. Route `SYT-010E` next.
- 2026-06-10: PR #24 squash-merged at `fae4e5d`, leaving #10 open for future hardening lanes. Remote/local task branch cleanup completed. Plan/route `SYT-010F` next if work remains safe and bounded.
- 2026-06-10: `SYT-010F` planning selected Sticky Player hardening: pure visibility/resize helper coverage plus one deterministic dock/restore fixture if feasible. Keep #8 paused.
- 2026-06-10: PR #26 squash-merged at `66d756f`, leaving #10 open. Next safe action is Senior Runner on `swarm/syt-010f-sticky-player-hardening`.
- 2026-06-10: PR #28 squash-merged at `fa07c18`, adding Sticky Player geometry/unit/fixture hardening. PR #29 docs follow-up merged at `6580065`. Issue #10 remains open; #8 remains paused.
- 2026-06-10: User reported #21 still failed after watch-to-Home SPA navigation. Controller opened #31 and implemented `SYT-031` to recover stale/missing native Home previews without reintroducing #8 hover grow.
- 2026-06-10: PR #32 squash-merged at `8e881c9`, closing #31. Route `SYT-010G` next only if a narrow #10 hardening target is identified.
- 2026-06-10: `SYT-010G` selected fullscreen/player UI geometry hardening. Unit/type/diff checks passed; route review next.
- 2026-06-10: Reviewer Russell marked PR #34 Ready to Integrate with no findings; route Integrator next.
- 2026-06-10: PR #34 squash-merged at `99156b5`, adding fullscreen/player UI geometry unit hardening. Issue #10 remains open; #8 remains paused.
