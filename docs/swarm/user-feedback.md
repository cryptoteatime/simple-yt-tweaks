# User Feedback

Use this file for durable human steering that should survive across controller turns, subagents, and heartbeats.

## Active Steering

- 2026-04-29: Use the workspace repo bootstrap flow for an existing repo, not a new project.
- 2026-04-29: Put Simple YT Tweaks into a paced autonomous controller rhythm for hardening, issue cleanup, automated verification, and smoother release-candidate process.
- 2026-04-29: Prefer fixture tests by default. Do not rely on live YouTube tests unless clearly useful for a final/manual gate.
- 2026-04-29: Make repo-owned automated tests the primary verification path. Browser/agent-browser/manual QA should supplement, not replace, Playwright/extension tests.
- 2026-04-29: Use task branches and draft PRs when useful. Include `How to test / what to tell the controller` in PR bodies.
- 2026-04-29: Do not request human QA for every small PR. Save human QA for release candidates, risky browser behavior, or visual/product-direction questions.
- 2026-04-29: Default to 1 active subagent at a time and a slow controller heartbeat around 90 minutes after repo state is clean.

## Product Ideas

| Idea | Source | Status | Routed Task |
| --- | --- | --- | --- |
| Revisit enhanced home/search grid hover preview | GitHub #8 / prior manual testing | Deferred | `SYT-008A` |
| Strengthen fixture tests before hardening code | User | Planned | `SYT-010A` |
| Smooth release-candidate validation/package flow | User | Planned | `SYT-010C` |

## Human QA Notes

| Date | Milestone / PR | Result | Notes |
| --- | --- | --- | --- |
| 2026-04-29 | v0.3.0 baseline | Passed previously | v0.3.0 released; hardening starts from passing baseline. |

## Rules

- Controllers and planners read this file before planning new lanes.
- New feedback should be captured here first, then routed to `docs/swarm/task-board.md` or a handoff.
- Human QA feedback should be specific enough for a Runner or Planner to continue without chat history.
- Agents should keep working on other unblocked tasks when feedback is not required for the current lane.
