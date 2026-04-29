# Agent Registry

Use this file to track who is working, where they are working, and whether the controller has capacity to spawn more agents.

## Capacity

- Max active planners: 1
- Max active runners: 1
- Max active reviewers: 1
- Max active integrators: 1
- Max total active agents: 1
- Capacity note: paced autonomous default. Raise capacity only for a named pass when the user explicitly wants a supervised burst.

## Controller Lease

| Owner | Started | Expected Action | Stop Condition | Stale After | Notes |
| --- | --- | --- | --- | --- | --- |
| none | none | none | none | 90 minutes | No active lease after bootstrap turn completes. |

## Active Agents

| Agent / Thread | Task ID | Role | Status | Branch | Worktree | PR | Started | Last Seen | Expected Next Step | Heartbeat |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| none | none | none | none | none | none | none | none | none | none | none |

## Paused / Stale Agents

| Agent / Thread | Task ID | Role | Status | Branch | Worktree | PR | Last Seen | Expected Next Step | Heartbeat |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| none | none | none | none | none | none | none | none | none | none |

## Reservations / Locks

| Path / Area | Task ID | Owner | Branch / Worktree | Reason | Release Condition |
| --- | --- | --- | --- | --- | --- |
| `src/shared/settings.ts`, `src/content/settings.ts`, `scripts/validate-extension.mjs`, `tests/e2e/**`, `docs/swarm/handoffs/SYT-010B.md` | `SYT-010B` | Integrator pending | `swarm/syt-010b-settings-hardening` / repo checkout | Settings parity/source-of-truth integration | Release after PR #14 is merged or abandoned |

## Recently Completed

| Agent / Thread | Task ID | Role | Result | Completed | Notes |
| --- | --- | --- | --- | --- | --- |
| `019dd83b-c95c-7ab3-a871-ed8aa6fb941c` / Gauss | `SYT-CTL-001` | Reviewer | Ready to Integrate, no findings | 2026-04-29 03:54 EDT | Read-only PR #11 review passed. |
| `019dd83e-75af-73d2-81c1-a30a12305198` / Meitner | `SYT-CTL-001` | Integrator | Merged PR #11 | 2026-04-29 03:58 EDT | PR #11 squash-merged into `main` at `676efc8`; branch cleaned. |
| `019dd841-965d-7cf2-be3b-d79b0f2e0595` / Beauvoir | `SYT-010A` | Runner | Opened draft PR #12 | 2026-04-29 05:37 EDT | `npm run test:e2e`, `npm run validate:all`, and `git diff --check` passed. |
| `019dd89b-89b0-79f3-bf62-b64b3cb0ae6f` / Mendel | `SYT-010A` | Reviewer | Ready to Integrate, no findings | 2026-04-29 07:12 EDT | Targeted PR #12 review passed; `npm run test:e2e` and `git diff --check origin/main...HEAD` passed. |
| `019dd8f8-d696-7f82-a403-c1f7b70e2716` / McClintock | `SYT-010A` | Integrator | Merged PR #12 | 2026-04-29 07:25 EDT | PR #12 squash-merged into `main` at `59ec975`; local task branch deleted and remote branch already removed. |
| `019dd952-fc1f-7692-878b-cc0cbaa13d42` / Linnaeus | `SYT-010B` | Senior Runner | Opened draft PR #14 | 2026-04-29 10:38 EDT | Conservative validation hardening; `npm run validate:all`, `npm run test:e2e`, `npm run lint`, and `npm run typecheck` passed. |
| `019dd9b0-7e98-7983-88de-9463e804000e` / Hypatia | `SYT-010B` | Reviewer | Ready to Integrate, no findings | 2026-04-29 12:15 EDT | Targeted PR #14 review passed; `npm run validate`, `npm run build`, `npm run test:e2e`, and content-script module checks passed. |

## Pending Launch

| Task ID | Role | Branch / Worktree | Launch Condition | Prompt Location |
| --- | --- | --- | --- | --- |
| `SYT-010B` | Integrator | `swarm/syt-010b-settings-hardening` / repo checkout | PR #14 remains mergeable after controller ready-state update is pushed | `docs/swarm/handoffs/SYT-010B.md` |

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
