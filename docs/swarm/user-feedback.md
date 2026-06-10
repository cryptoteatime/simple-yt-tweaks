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
- 2026-06-10: Use the signed-in Chrome profile for supplemental live YouTube usability audits when behavior depends on real YouTube SPA/player state. Keep repo-owned tests and `validate:all` as the required gate.
- 2026-06-10: For #21, fix the watch-to-Home native hover autoplay regression, audit other live features/settings, patch regressions found during audit, and keep automation running while the user sleeps.
- 2026-06-10: Keep repo docs compact so controller passes do not repeatedly compact; archive completed-lane detail with clear reference maps. Run the heartbeat more frequently, around every 30 minutes, while active work is moving.
- 2026-06-10: #21 was not actually fixed in live use. User reported Home hover autoplay still failing after watch-to-Home navigation and explicitly asked to stop deferring, avoid bypassing blocked browser surfaces, and finish the fix with real validation.
- 2026-06-10: User provided screenshot showing multiple Home cards with stuck opaque hover backgrounds and missing hover autoplay after refresh -> watch video -> SPA Home navigation. Track as #36 / `SYT-036`; do not treat old #31 closure as proof this is fixed.
- 2026-06-10: First `SYT-036` human QA failed. User reported autoplay on hover still does not work when going from a video back to Home, while it works on first YouTube load. Treat stricter advancing-preview validation and live signed-in Chrome inspection as required supporting evidence.

## Product Ideas

| Idea | Source | Status | Routed Task |
| --- | --- | --- | --- |
| Revisit enhanced home/search grid hover preview | GitHub #8 / prior manual testing | Deferred | `SYT-008A` |
| Strengthen fixture tests before hardening code | User | Planned | `SYT-010A` |
| Smooth release-candidate validation/package flow | User | Planned | `SYT-010C` |
| Keep native Home/Search hover only, with no enhanced grow/highlight | User / #8 decision | Active constraint | `SYT-021`, `SYT-008A` deferred |

## Human QA Notes

| Date | Milestone / PR | Result | Notes |
| --- | --- | --- | --- |
| 2026-04-29 | v0.3.0 baseline | Passed previously | v0.3.0 released; hardening starts from passing baseline. |
| 2026-06-10 | SYT-021 live Chrome smoke | Passed by controller | Signed-in Chrome: watch-to-Home Home hover previews played/advanced; Search previews/cleanup passed; comments visible; real player click toggled; modern recommendation hover delay passed. |
| 2026-06-10 | SYT-036 PR #37 | Failed by user | Autoplay on hover still failed after video -> Home; only worked on fresh YouTube load. |

## Rules

- Controllers and planners read this file before planning new lanes.
- New feedback should be captured here first, then routed to `docs/swarm/task-board.md` or a handoff.
- Human QA feedback should be specific enough for a Runner or Planner to continue without chat history.
- Agents should keep working on other unblocked tasks when feedback is not required for the current lane.
