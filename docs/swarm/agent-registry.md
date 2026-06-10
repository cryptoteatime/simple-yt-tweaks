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
| none | none | none | none | 90 minutes | No active controller lease after `SYT-021` integration. |

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
| none | none | none | none | none | none |

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
| `019eb0bd-d604-78a3-a94f-949659401efb` / Godel | `SYT-021` | Reviewer | Needs Fixes | 2026-06-10 04:52 EDT | Review found `git diff --check origin/main...HEAD` failed on EOF blank lines in compact docs; `npm run test:e2e` passed. Controller fixed whitespace on the PR branch; re-review next. |
| `019eb0c7-e8dc-7352-9531-8f7be5692bdb` / Gibbs | `SYT-021` | Reviewer | Ready to Integrate | 2026-06-10 05:13 EDT | Re-review passed with no findings; `git diff --check origin/main...HEAD` and `npm run test:e2e` passed; human QA optional, not required. |
| `019eb0d4-9f71-7c52-a08f-2186cff049d5` / Lorentz | `SYT-021` | Integrator | Merged PR #22 | 2026-06-10 05:23 EDT | `npm run validate:all` passed; PR #22 squash-merged into `main` at `8f90ef1`; issue #21 closed; remote/local task branch cleanup completed. |
| `019eb0f1-9608-74f3-af18-2f13569896b5` / Euler | `SYT-010E` | Senior Runner | Opened draft PR #24 | 2026-06-10 05:52 EDT | Narrow grid-hover selector normalization; `npm run test:unit`, `npm run test:e2e`, and `npm run validate:all` passed; issue #10 commented. |
| `019eb0fc-5137-71b1-ad83-a22a768775ed` / Hilbert | `SYT-010E` | Reviewer | Ready to Integrate | 2026-06-10 05:55 EDT | No findings; `git diff --check origin/main...HEAD` and `npm run test:unit` passed; human QA not required; PR #24 still draft. |
| `019eb100-fe46-7bc3-b8a5-9c5f563a73b1` / Ramanujan | `SYT-010E` | Integrator | Merged PR #24 | 2026-06-10 06:13 EDT | `npm run validate:all` passed; PR #24 marked ready and squash-merged into `main` at `fae4e5d`; issue #10 remains open; remote/local task branch cleanup completed. |
| `019eb10d-7fef-7c52-916f-0245bf25d828` / Dalton | `SYT-010F` | Planner | Needs Review | 2026-06-10 06:40 EDT | Chose Sticky Player hardening, created Runner-ready handoff, and opened draft PR #26 for review; #8 remains paused. |
| `019eb128-3fca-7111-bbb2-152f11a8747c` / McClintock | `SYT-010F` | Reviewer | Ready to Integrate | 2026-06-10 06:49 EDT | No findings; `git diff --check origin/main...HEAD` passed; human QA not required; PR #26 still draft. |
| `019eb12d-5860-7852-8447-17dfb4db7cc3` / Faraday | `SYT-010F` | Integrator | Merged PR #26 | 2026-06-10 07:00 EDT | PR #26 marked ready and squash-merged into `main` at `66d756f`; issue #10 remains open; remote/local planning branch cleanup completed. |

## Pending Launch

| Task ID | Role | Branch / Worktree | Launch Condition | Prompt Location |
| --- | --- | --- | --- | --- |
| none | none | none | none | none |

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
