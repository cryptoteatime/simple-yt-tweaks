# Current State

## Project

- Name: Simple YT Tweaks
- Folder: `/Users/d4ngl/Git Repos/Codex/simple-yt-tweaks`
- Status: existing repo, post-v0.3.0 hardening setup
- GitHub: `https://github.com/cryptoteatime/simple-yt-tweaks`

## Project Brief

- Brief: `docs/swarm/project-brief.md`
- Question gate: deferred, not blocking
- Dispatch readiness: docs-only bootstrap in progress; implementation dispatch waits for `SYT-010A`

## Goal

Put Simple YT Tweaks into a paced autonomous controller rhythm with scoped GitHub issue lanes, stronger fixture-first automated verification, and a smoother release-candidate process.

## Current Focus

1. Land the repo-local swarm packet.
2. Audit Playwright fixture coverage against #8 and #10 risks.
3. Route #10 hardening into small PRs with `validate:all` as the final gate.
4. Keep #8 as a future high-risk research lane until tests and product direction justify it.

## Success Criteria

- `SWARM.md` and `docs/swarm/**` exist and are repo-local.
- Task board maps #8 and #10 into scoped lanes with dependencies, verification commands, PR strategy, and human QA gates.
- Repo-owned Playwright fixture tests remain the primary verification path.
- Controller heartbeat is proposed at about 90 minutes after state is clean.
- No product code is changed during bootstrap.

## Constraints

- Existing repo, not blank.
- Use existing remote and GitHub issues.
- Use task branches and draft PRs when useful.
- Default to 1 active subagent at a time.
- Do not request human QA for every small PR.
- Do not rely on live YouTube tests as the default gate.
- Keep private `.private/` notes off GitHub.
- Do not bump versions, tag releases, or edit Web Store assets during hardening setup.

## Known Risks

- `src/content/grid-hover.ts`, `sticky-player.ts`, `sidebar.ts`, `fullscreen.ts`, and `theater.ts` are large and touch fragile YouTube DOM behavior.
- Settings are duplicated between `src/shared/settings.ts` and `src/content/settings.ts`; validation checks parity, but refactoring could affect bundling.
- Fixture tests do not fully simulate live YouTube hover preview overlay behavior, so #8 needs a research gate and likely human/visual QA.
- Live YouTube smoke can be flaky due to consent, experiments, bot checks, ads, or network issues.

## Recommended First Milestone

`SYT-010A`: audit and harden Playwright fixture coverage so future #10 code changes can be validated without using the user's normal browser profile.

## Verification Defaults

- Runner focused checks: task-specific `npm run test:e2e`, `npm run lint`, or `npm run typecheck`.
- Reviewer targeted checks: targeted Playwright tests plus source diff review.
- Integrator full verify: `npm run validate:all`.
- Browser QA: repo-owned Playwright first; `agent-browser`/Browser Use only as supplemental inspection.
- Human milestone QA: release candidate, #8 live hover preview, or explicit high-risk browser behavior.

## Tooling Preflight

- Git: clean `main...origin/main` at discovery.
- Remote: `origin` points to `https://github.com/cryptoteatime/simple-yt-tweaks.git`.
- GitHub auth: `gh auth status` passed as `cryptoteatime`.
- GitHub repo: `cryptoteatime/simple-yt-tweaks`, public, default branch `main`.
- Runtime: Node `v25.9.0`, npm `11.12.1`.
- Dependencies: `node_modules/` present.
- Full verification: `npm run validate:all` passed on 2026-04-29 after the swarm docs were added.
- Agent browser: `/opt/homebrew/bin/agent-browser`; wrapper `.codex-swarm/bin/agent-browser-cft` opened and closed `about:blank`.

## Automation Notes

- Controller heartbeat: proposed, not created yet.
- Heartbeat cadence: about 90 minutes while active after docs PR integration and clean state.
- Execution strategy: paced controller with direct subagents only after lane readiness.
- Batch dispatch policy: disabled by default via max 1 active subagent; require disjoint parallel-safe labels if capacity is raised.
- Shared docs lock: controller owns task-board, current-state, controller-directives, and agent-registry during parallel work unless assigned.
- Active subagents: none.
- Agent registry: `docs/swarm/agent-registry.md`.
- Bootstrap log: `docs/swarm/bootstrap-log.md`.
- GitHub workflow: `docs/swarm/github.md`.

## Last Updated

- Date: 2026-04-29
- By: Controller
