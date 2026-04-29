# Simple YT Tweaks Swarm

This repo uses the local Codex swarm workflow for paced controller-led work.

Shared workspace instructions live at:

```text
../AGENTS.md
```

If this repo is opened outside `/Users/d4ngl/Git Repos/Codex`, use this file plus `docs/swarm/` as the repo-local source of truth.

## Required Reading

Before acting, read:

1. `../AGENTS.md` if available
2. `SWARM.md`
3. `docs/swarm/controller-directives.md`
4. `docs/swarm/project-brief.md`
5. `docs/swarm/current-state.md`
6. `docs/swarm/bootstrap-log.md`
7. `docs/swarm/agent-registry.md`
8. `docs/swarm/github.md`
9. `docs/swarm/task-board.md`
10. `docs/swarm/user-feedback.md`
11. Relevant files in `docs/swarm/handoffs/`
12. `docs/swarm/integration-log.md`
13. Existing repo docs such as `README.md`, `DEVELOPMENT.md`, `CHANGELOG.md`, and `KNOWN_ISSUES.md`

## Repo Goal

Simple YT Tweaks is a Manifest V3 Chrome/Brave extension that improves YouTube usability with focused cleanup controls for home/search feeds, watch-page modes, sidebar cleanup, Sticky Player, and browser Picture-in-Picture.

The current goal is post-v0.3.0 hardening: make automated verification strong enough that routine changes can move through task branches and draft PRs without requiring the user to manually retest every small patch.

## Working Rules

- Inspect before asking questions.
- Preserve user work and unrelated changes.
- Use GitHub issues as the public tracker and keep private notes out of GitHub.
- Work on task branches named like `swarm/<task-id>-<short-slug>`.
- Use draft PRs for issue work when useful.
- Use PR merge as the normal path to update `main`; do not push directly to `main` except an explicitly documented emergency.
- Every PR body must include `How to test / what to tell the controller`, human review requested (`yes` or `no`), exact commands, expected results, and feedback format when human feedback is requested.
- Human QA is reserved for release candidates, risky browser behavior, visual/product-direction questions, or explicit reviewer/controller gates. Routine docs, tests, and scoped hardening should use agent review plus repo-owned checks.
- Use repo-owned automated tests as the primary verification path. Prefer `npm run test:e2e` and `npm run validate:all`; live YouTube smoke and agent-browser are supplemental.
- Prefer fixture tests by default. Do not rely on live YouTube tests unless clearly useful for a final/manual gate.
- Keep every task scoped to a task id, branch, owner role, and handoff.
- Planner-created task lanes must include `parallel-safe`, `serial-required`, `depends-on`, and `conflict-risk` labels before Runner dispatch.
- Default active capacity is 1 total active subagent.
- Keep shared coordination files controller-owned during parallel work unless a handoff explicitly assigns them: `docs/swarm/task-board.md`, `docs/swarm/current-state.md`, `docs/swarm/controller-directives.md`, and `docs/swarm/agent-registry.md`.
- Workers normally update only their handoff, scoped source/test files, and PR body.
- Do not reintroduce enhanced home/search hover implementation under #10; #8 is the separate future enhancement lane.
- Do not bump version, tag, release, or update Web Store assets unless a release-candidate lane explicitly asks for it.

## Repo Swarm Files

- `docs/swarm/controller-directives.md`: dynamic controller mode, pacing, next actions, spawn strategy, and stop conditions
- `docs/swarm/current-state.md`: current mission, constraints, priorities, risks, and verification status
- `docs/swarm/project-brief.md`: durable discovery brief and milestone lane map
- `docs/swarm/task-board.md`: active queue and task state
- `docs/swarm/agent-registry.md`: active agents, capacity, locks, worktrees, PRs, side chats, and ownership
- `docs/swarm/bootstrap-log.md`: resumable bootstrap phases
- `docs/swarm/github.md`: branch, PR, merge, and human QA policy
- `docs/swarm/user-feedback.md`: durable user steering and product direction
- `docs/swarm/handoffs/`: per-task continuation files
- `docs/swarm/integration-log.md`: merge and release history

## Automation

This repo should use a paced controller-led model:

- The main repo chat acts as controller.
- Controller passes should do only a few safe orchestration actions, then leave a clean recovery point.
- A 90-minute active-pulse heartbeat is proposed after the swarm packet branch is merged and the worktree is clean.
- The heartbeat prompt should stay generic and read `SWARM.md` plus `docs/swarm/controller-directives.md`; do not encode current PR lists or one-off task state in the automation prompt.
