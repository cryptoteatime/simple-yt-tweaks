# Current State

## Project

- Name: Simple YT Tweaks
- Folder: `/Users/d4ngl/Git Repos/Codex/simple-yt-tweaks`
- Status: existing repo, post-v0.3.0 hardening; `SYT-036` Home hover lifecycle regression passed user QA, and PR #37 now includes post-review #38 live-stream Theater/chat overlay layout plus minimize/restore fixes awaiting fresh review
- GitHub: `https://github.com/cryptoteatime/simple-yt-tweaks`

## Project Brief

- Brief: `docs/swarm/project-brief.md`
- Question gate: deferred, not blocking
- Dispatch readiness: swarm packet integrated; no active implementation lane after `SYT-010G`

## Goal

Put Simple YT Tweaks into a paced autonomous controller rhythm with scoped GitHub issue lanes, stronger fixture-first automated verification, and a smoother release-candidate process.

## Current Focus

1. Route fresh review for PR #37 after the post-review #38 patch: live streams in enhanced Theater mode no longer let YouTube's live-chat panel squeeze the player, the chat overlay has usable dimensions, and the overlay `X` minimizes to a visibly exposed right-edge `Live chat` restore tab without covering YouTube's chat controls.
2. Keep the recorded SYT-036 human QA pass for Home hover autoplay; after review, integrate only if checks/review are clean and any remaining human QA gate is passed or explicitly waived with the recorded Brave PWA evidence.
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

`SYT-036` passed user QA for the Home hover autoplay route on PR #37. During that QA, the user found #38: live streams in enhanced Theater mode could appear cut off while live chat overlay collapsed. The #38 fix is now on PR #37 with fixture coverage, full validation, and live Brave PWA geometry plus minimize/restore verification; the latest close/restore placement refinement is fixture/full-validation verified and needs extension reload before the active PWA reflects it. Issue #10 remains open until the controller decides the hardening pass is complete.

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
- Heartbeat cadence: slow back toward about 90 minutes after the `SYT-010F` hot-state repair lands.
- Execution strategy: paced controller with direct subagents only after lane readiness.
- Batch dispatch policy: disabled by default via max 1 active subagent; require disjoint parallel-safe labels if capacity is raised.
- Shared docs lock: controller owns task-board, current-state, controller-directives, and agent-registry during parallel work unless assigned.
- Active subagents: none.
- Agent registry: `docs/swarm/agent-registry.md`.
- Bootstrap log: `docs/swarm/bootstrap-log.md`.
- GitHub workflow: `docs/swarm/github.md`.

## Last Updated

- Date: 2026-06-10
- By: Controller/Runner for `SYT-036`
