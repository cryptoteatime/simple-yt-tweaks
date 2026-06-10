# Current State

## Project

- Name: Simple YT Tweaks
- Folder: `/Users/d4ngl/Git Repos/Codex/simple-yt-tweaks`
- Status: existing repo, post-v0.3.0 hardening; #21 and `SYT-010E` integrated; `SYT-010F` planning selected Sticky Player hardening
- GitHub: `https://github.com/cryptoteatime/simple-yt-tweaks`

## Project Brief

- Brief: `docs/swarm/project-brief.md`
- Question gate: deferred, not blocking
- Dispatch readiness: swarm packet integrated; `SYT-010F` Sticky Player implementation lane is ready after planning PR review/merge

## Goal

Put Simple YT Tweaks into a paced autonomous controller rhythm with scoped GitHub issue lanes, stronger fixture-first automated verification, and a smoother release-candidate process.

## Current Focus

1. Review/merge the `SYT-010F` planning PR, then route Sticky Player hardening while issue #10 remains open.
2. Keep #10 hardening in small PRs with `validate:all` as the final gate.
3. Keep #8 as a future high-risk research lane until tests and product direction justify it.
4. Keep release-candidate work separate from routine fixture/source hardening.
5. Keep hot swarm context compact; use `docs/swarm/context-map.md` and archive references instead of loading old completed handoffs.

## Success Criteria

- `SWARM.md` and `docs/swarm/**` exist and are repo-local.
- Task board maps #8 and #10 into scoped lanes with dependencies, verification commands, PR strategy, and human QA gates.
- Repo-owned Playwright fixture tests remain the primary verification path.
- Controller heartbeat is active at about 90 minutes while work remains active.
- No product code is changed during fixture-hardening setup unless a scoped task explicitly owns it.

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
- Current live YouTube recommendations may render as modern `#secondary yt-lockup-view-model` cards instead of legacy compact renderers.

## Recommended First Milestone

`SYT-010E` is integrated via PR #24 at `fae4e5d`, and issue #10 remains open. The next useful milestone is `SYT-010F`: Sticky Player visibility/resize helper hardening plus deterministic dock/restore fixture coverage where feasible.

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

- Controller heartbeat: active.
- Heartbeat automation id: `simple-yt-tweaks-controller-heartbeat`.
- Heartbeat cadence: slow back toward about 90 minutes after the `SYT-010E` integration-record docs follow-up lands.
- Execution strategy: paced controller with direct subagents only after lane readiness.
- Batch dispatch policy: disabled by default via max 1 active subagent; require disjoint parallel-safe labels if capacity is raised.
- Shared docs lock: controller owns task-board, current-state, controller-directives, and agent-registry during parallel work unless assigned.
- Active subagents: none expected after the `SYT-010F` planning PR is reviewed/merged.
- Agent registry: `docs/swarm/agent-registry.md`.
- Bootstrap log: `docs/swarm/bootstrap-log.md`.
- GitHub workflow: `docs/swarm/github.md`.

## Last Updated

- Date: 2026-06-10
- By: Planner, `SYT-010F`
