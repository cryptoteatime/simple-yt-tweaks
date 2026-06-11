# Agent Registry

Use this file to track who is working, where they are working, and whether the controller has capacity to spawn more agents.

## Capacity

- Max active planners: 1
- Max active runners: 3 during planner-approved `SYT-010H` disjoint lanes; otherwise 1
- Max active reviewers: 1
- Max active integrators: 1
- Max total active agents: 3 during planner-approved `SYT-010H` disjoint lanes; otherwise 1
- Capacity note: user approved a supervised `SYT-010H` final-leg burst up to 3 subagents. Use it only for non-overlapping audit/test/docs/helper lanes with separate branches/worktrees and explicit path locks. Keep fragile runtime implementation, review, and integration serial.

## Controller Lease

| Owner | Started | Expected Action | Stop Condition | Stale After | Notes |
| --- | --- | --- | --- | --- | --- |
| none | none | none | none | 90 minutes | No active controller lease between bounded passes. |

## Active Agents

Active rows preserve the registered A/B/C batch from PR #44. If a row is stale, the controller should reconcile it against branch/PR state before removing it.

| Agent / Thread | Task ID | Role | Status | Branch | Worktree | PR | Started | Last Seen | Expected Next Step | Heartbeat |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `019eb49a-c484-7b40-9f6f-662172dd8c22` / Nietzsche | `SYT-010H-A` | Runner | Needs Review | `swarm/syt-010h-settings-popup` | agent workspace | #45 | 2026-06-11 02:55 UTC | 2026-06-11 | Controller should route review for PR #45 after active batch reconciliation | none |
| `019eb49b-58af-79f1-aca5-38fba53c14da` / Wegener | `SYT-010H-B` | Runner/Auditor | Needs Review | `swarm/syt-010h-selector-runtime-audit` | agent workspace | #46 | 2026-06-11 02:55 UTC | 2026-06-11 | Controller should route review for PR #46 after active batch reconciliation | none |
| `019eb49b-ef01-7923-8c57-f4faedee2108` / Leibniz | `SYT-010H-C` | Docs Runner | Running | `swarm/syt-010h-docs-compaction` | agent workspace | TBD | 2026-06-11 02:55 UTC | 2026-06-11 | Compact hot swarm docs without source/test edits, run `git diff --check`, open draft PR | none |

## Paused / Stale Agents

| Agent / Thread | Task ID | Role | Status | Branch | Worktree | PR | Last Seen | Expected Next Step | Heartbeat |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| none | none | none | none | none | none | none | none | none | none |

## Reservations / Locks

| Path / Area | Task ID | Owner | Branch / Worktree | Reason | Release Condition |
| --- | --- | --- | --- | --- | --- |
| `tests/e2e/extension.fixture.spec.ts`, `tests/unit/settings.unit.spec.ts`, optional `src/shared/settings.ts`, `src/content/settings.ts`, `src/popup/popup.ts` | `SYT-010H-A` | Nietzsche | `swarm/syt-010h-settings-popup` | Settings/popup coverage lane | PR reviewed/integrated or lane closed |
| `docs/swarm/handoffs/SYT-010H-B.md`, optional isolated unit helper tests only | `SYT-010H-B` | Wegener | `swarm/syt-010h-selector-runtime-audit` | Selector/runtime churn audit lane; no production source edits | PR reviewed/integrated or lane closed |
| `docs/swarm/context-map.md`, `docs/swarm/current-state.md`, `docs/swarm/task-board.md`, `docs/swarm/agent-registry.md`, selected completed handoff stubs/archive docs | `SYT-010H-C` | Leibniz | `swarm/syt-010h-docs-compaction` | Hot docs/context compaction lane | PR reviewed/integrated or lane closed |

## Recently Completed

Completed agent history is compacted here. Use `docs/swarm/archive/README.md`, task handoff stubs, PRs, and Git history for details.

| Task / PR | Result |
| --- | --- |
| `SYT-CTL-001` / #11 | swarm packet integrated |
| `SYT-010A` / #12 | fixture coverage hardening integrated |
| `SYT-010B` / #14 | settings parity validation hardening integrated |
| `SYT-010C` / #16 | release-candidate process docs integrated |
| `SYT-010D` / #18 | helper unit-test project integrated |
| `SYT-021` / #22 | native hover SPA regression integrated; issue #21 closed |
| `SYT-010E` / #24 | grid-hover selector normalization integrated |
| `SYT-010F` / #26/#28/#29 | Sticky Player planning, implementation, and docs follow-up integrated |
| `SYT-031` / #32 | Home native hover autoplay regression integrated; issue #31 closed |
| `SYT-010G` / #34 | fullscreen/player UI geometry hardening integrated |
| `SYT-036` / #37 | Home hover lifecycle and #38 live Theater/chat fixes integrated |
| `SYT-010H` setup / #39/#40/#41/#42/#43 | integration record, context repair, burst capacity, planner registration, and lane plan integrated |
| `SYT-010H` batch registration / #44 | active A/B/C batch registered; preserve active rows until controller reconciliation |

## Pending Launch

| Task ID | Role | Branch / Worktree | Launch Condition | Prompt Location |
| --- | --- | --- | --- | --- |
| `SYT-010H-D` | Senior Developer | `swarm/syt-010h-runtime-churn` | Only after B reports and controller selects one serial implementation target | `docs/swarm/handoffs/SYT-010H.md` |

## Side Chats

| Chat / Automation | Task ID | Role | Heartbeat | Status | Stop Condition |
| --- | --- | --- | --- | --- | --- |
| none | none | none | none | none | none |

## Rules

- The controller updates this registry before spawning a subagent and after receiving its result.
- Active Agents should include only agents still expected to report.
- Do not spawn a new agent when it would exceed capacity.
- Do not spawn two agents with overlapping write scopes unless one is read-only.
- Workers normally update only their own handoff and report back; the controller consolidates this registry.
- During parallel work, the controller owns `docs/swarm/task-board.md`, `docs/swarm/current-state.md`, `docs/swarm/controller-directives.md`, and this registry unless a handoff explicitly assigns one of those files.
