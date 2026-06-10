# Controller Directives

This file is the repo-local dynamic control plane for the controller chat and any heartbeat. Automation prompts should stay stable and read this file every pass.

## Mode

- Controller mode: `AUTOPILOT_WITH_HEARTBEAT`
- Heartbeat mode: `active-pulse`
- Heartbeat automation id: `simple-yt-tweaks-controller-heartbeat`
- Main controller chat: Simple YT Tweaks controller in Codex workspace
- Last reviewed by controller: 2026-06-10 06:13 EDT

## Current Source Of Truth

- Default branch: `main`
- Current branch: `main`
- Expected Git state: clean `main...origin/main` after the `SYT-010E` integration-record docs follow-up lands
- Open PR expectation: none after the `SYT-010E` integration-record docs follow-up lands
- Active agents expectation: none
- Controller lease expectation: none between bounded heartbeat passes
- Current priority lane: `SYT-010F` planning/routing for the next #10 code-hardening lane while issue #10 remains open

## Controller Lease And Pacing

- Controller lease owner: none
- Lease started: none
- Lease expected action: none
- Lease stop condition: none
- Lease stale after: 90 minutes
- Controller pass budget: max 6 safe orchestration actions or 60 minutes
- Heartbeat pass budget: max 2 safe recovery/routing actions, then stop
- Active capacity: max 1 active subagent total
- Heartbeat cadence target: slow back toward 90 minutes after the `SYT-010E` integration-record docs follow-up lands
- Next human QA gate: release-candidate lane or #8 visual/product-direction gate

## Context Hygiene

- Read `docs/swarm/context-map.md` before loading historical handoffs.
- Keep completed-lane details out of hot docs. Stubs plus PR/merge references are enough for normal controller passes.
- Do not load `docs/swarm/archive/**` unless a current task needs old implementation details.
- When a lane completes, compact its handoff to status, scope, verification, PR, merge, and archive references.

Heartbeat overlap rule:

- If a controller lease is active and younger than 90 minutes, the heartbeat reports in-flight work and stops without editing, spawning, routing, or merging.
- If the lease is stale, the heartbeat may do recovery-only reconciliation and then stop unless this file explicitly allows more.
- If no lease blocks progress, the heartbeat may perform only bounded actions allowed here.

## Worktree Hygiene Protocol

1. Inspect `git status --short --branch`, `git diff --stat`, and relevant diffs.
2. Classify dirty files:
   - `controller-state`: real active agent registry/task-board state.
   - `controller-docs`: controller-owned docs-only state repair or swarm packet updates.
   - `active-agent`: expected changes in a registered task branch/worktree.
   - `build-artifact`: ignored/generated output such as `dist/`, `release/`, `test-results/`, or `playwright-report/`.
   - `user-or-unknown`: unclear ownership, source changes in the wrong checkout, or overlapping scope.
3. Resolve before unrelated spawning:
   - `controller-state`: reconcile real agents and avoid overlapping work.
   - `controller-docs`: run `git diff --check`, branch if needed, commit docs, push/open PR, include `How to test / what to tell the controller`, merge only through approved policy.
   - `active-agent`: route to the owning handoff/agent.
   - `build-artifact`: leave ignored artifacts alone unless cleanup is explicitly safe.
   - `user-or-unknown`: preserve first on a recovery branch or stash and stop.

## Reservation Rules

- A row in Active Agents must represent a real agent/thread/command expected to report.
- A reservation without a real agent id is not active capacity.
- If a reservation cannot launch in the same pass, release it or move it to Pending Launch notes outside Active Agents.
- Do not leave fake `pending-spawn` rows in Active Agents across heartbeat passes.

## Spawn Strategy

- Read `docs/swarm/agent-registry.md` before spawning.
- Default to 1 active subagent at a time.
- Use low/medium effort for routine routing, docs, review, and fixture-test work.
- Use high/xhigh only for hard browser-extension architecture, repeated test failures, merge conflicts, or #8 preview lifecycle work.
- Spawn only when lane labels are present: `parallel-safe`, `serial-required`, `depends-on`, and `conflict-risk`.
- Use task branches and separate worktrees for parallel work. With current capacity 1, one task branch is enough unless the user raises capacity.
- Keep #10 hardening separate from #8 enhanced hover research.
- Do not spawn implementation Runners until the project brief and handoff give a bounded task, branch/worktree rule, write scope, and verification tier.

## GitHub Policy Reminder

- Existing remote: `https://github.com/cryptoteatime/simple-yt-tweaks.git`
- Repository visibility discovered by `gh repo view`: public.
- GitHub issue work is approved.
- Use task branches and draft PRs for issue work when useful.
- Do not push directly to `main`.
- PRs require a visible `How to test / what to tell the controller` section.
- Human QA is not required for routine docs/test/hardening PRs unless a reviewer marks the risk high.
- Human QA is required for release-candidate behavior and risky browser behavior.

## Verification Tiers

- Runner focused checks: task-specific `npm run test:e2e`, `npm run lint`, `npm run typecheck`, or targeted Playwright project as listed in the handoff.
- Reviewer targeted checks: changed-risk checks plus PR body/handoff validation.
- Integrator full verify: `npm run validate:all`.
- Optional live smoke: `npm run test:e2e:live`, only for final/manual gates or when live YouTube behavior is specifically relevant.
- Browser QA: repo-owned Playwright first; Browser Use or Chrome-for-Testing `agent-browser` only as supplemental inspection.

## Current Next Actions

| Priority | Task ID | Action | Owner | Branch / Worktree | Stop Condition |
| --- | --- | --- | --- | --- | --- |
| 1 | `SYT-010F` | Plan and route the next small #10 code-hardening lane if issue #10 remains open | Planner / Senior Runner | TBD | Scoped hardening lane created with verification, or heartbeat slowed if no safe lane is ready |
| 2 | `SYT-008A` | Keep research gate paused until the user wants enhanced hover research again | Planner | `swarm/syt-008a-hover-research` | Decision to defer, prototype, or require human QA |

## Dynamic Notes

- `npm run validate:all` passed on 2026-04-29 during bootstrap.
- Chrome-for-Testing-backed `agent-browser` wrapper opened and closed `about:blank` successfully.
- The live YouTube test exists but should not be the normal gate.
- Issue #8 is intentionally paused until #10 coverage and hardening reduce regression risk.
- PR #11 merged; PR #12 squash-merged into `main` at `59ec975`.
- `SYT-010A` remote and local task branches were cleaned after merge.
- PR #14 squash-merged into `main` at `5675059`; remote and local task branch cleanup completed.
- PR #16 squash-merged into `main` at `0fca6c3`; remote and local task branch cleanup completed.
- PR #18 squash-merged into `main` at `88f0a91`; local branch cleanup completed and stale remote-tracking ref pruned.
- 2026-06-10: User reported live watch-to-Home native hover autoplay regression and requested overnight automation. Controller opened #21 and draft PR #22, implemented `SYT-021`, ran `npm run validate:all`, and performed signed-in Chrome live smoke.
- 2026-06-10: User requested compact docs/context and faster automation. Heartbeat cadence updated to 30 minutes; completed handoffs compacted with archive references.
- 2026-06-10: PR #22 re-review passed with no findings; human QA was optional supplemental QA, not a merge gate.
- 2026-06-10: PR #22 squash-merged into `main` at `8f90ef1`; issue #21 auto-closed; remote/local task branch cleanup completed. Next lane is `SYT-010E`.
- 2026-06-10: PR #24 review passed with no findings; human QA not required.
- 2026-06-10: PR #24 marked ready and squash-merged into `main` at `fae4e5d`; issue #10 remains open; remote/local task branch cleanup completed. Next safe action is `SYT-010F` planning/routing, not #8.
