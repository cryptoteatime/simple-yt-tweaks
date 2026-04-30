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
| heartbeat `simple-yt-tweaks-controller-heartbeat` | 2026-04-30 01:21 EDT | Reconcile `SYT-008A` research and route review | Stop after one Reviewer is launched or a blocker is recorded | 90 minutes | Bounded active-pulse pass. |

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
| `docs/swarm/handoffs/SYT-008A.md`, #8 research notes, fixture/prototype plan only | `SYT-008A` | Pending Reviewer launch | `swarm/syt-008a-hover-research` | Research gate review; no runtime implementation | Release when research PR is reviewed/integrated, deferred, or blocked. |

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
| `019dda09-c04a-7040-ab08-a641d093f545` / Helmholtz | `SYT-010B` | Integrator | Merged PR #14 | 2026-04-29 12:25 EDT | PR #14 squash-merged into `main` at `5675059`; local `main` synced; remote and local task branch cleanup completed. |
| `019dda63-8fdc-7531-b649-2a91669070c4` / Ampere | `SYT-010C` | Planner/Runner | Opened draft PR #16 | 2026-04-29 15:30 EDT | Docs-only RC gate; `git diff --check` passed; human QA requested no. |
| `019ddabc-9d77-7692-81b6-80ff60498621` / Boole | `SYT-010C` | Reviewer | Ready to Integrate, no findings | 2026-04-29 17:06 EDT | Docs/process review passed; `git diff --check origin/main...HEAD` passed; human QA requested no. |
| `019ddb16-4dcd-7c83-9fce-e664dfdf53a1` / Carson | `SYT-010C` | Integrator | Merged PR #16 | 2026-04-29 17:14 EDT | PR #16 squash-merged into `main` at `0fca6c3`; remote and local task branch cleanup completed; integration-record docs landed through follow-up PR policy. |
| `019ddb72-af51-7372-8146-43d5ead7148a` / Dirac | `SYT-010D` | Planner/Runner | Opened draft PR #18 | 2026-04-29 20:28 EDT | Added Playwright unit project and helper tests; `npm run test:unit`, `typecheck`, `lint`, and `validate:all` passed. |
| `019ddbcb-2d65-76c1-982c-54abedb730cc` / Ptolemy | `SYT-010D` | Reviewer | Ready to Integrate, no findings | 2026-04-29 22:03 EDT | PR #18 review passed; `npm run test:unit`, `git diff --check origin/main...HEAD`, `npm run validate:all`, and `git diff --check` passed. |
| `019ddc21-c7bb-75a2-94f6-e8d84b8f4489` / Planck | `SYT-010D` | Integrator | Merged PR #18 | 2026-04-29 22:07 EDT | PR #18 squash-merged into `main` at `88f0a91`; local branch cleanup completed and stale remote-tracking ref pruned. |
| `019ddc7d-3114-7603-9c3e-a3daaf9f055a` / Lovelace | `SYT-008A` | Planner | Opened draft PR #20 | 2026-04-30 01:21 EDT | Research decision requires human/product direction before prototype; `git diff --check` passed; no runtime/source/tests touched. |

## Pending Launch

| Task ID | Role | Branch / Worktree | Launch Condition | Prompt Location |
| --- | --- | --- | --- | --- |
| `SYT-008A` | Reviewer | `swarm/syt-008a-hover-research` | Planner completed with PR #20 clean/draft | `docs/swarm/handoffs/SYT-008A.md` |

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
