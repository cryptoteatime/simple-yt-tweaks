# SYT-010F: Sticky Player Hardening Plan

## Status

- State: In Progress; Ready for Runner after planning PR merge
- GitHub issue: #10
- Planning PR: #26, https://github.com/cryptoteatime/simple-yt-tweaks/pull/26
- Planning branch: `swarm/syt-010f-planning`
- Recommended implementation branch: `swarm/syt-010f-sticky-player-hardening`
- Role: Integrator
- Updated: 2026-06-10 by Controller

## Goal

Continue the post-harness #10 hardening pass with one small, behavior-preserving Sticky Player lane. Reduce regression risk in `src/content/sticky-player.ts` by making its scroll/visibility/resize decisions testable and adding deterministic fixture coverage for dock/restore behavior.

## Chosen Target

`src/content/sticky-player.ts`

Why this target:

- It is one of the largest remaining content modules, at roughly 726 lines.
- Current tests cover the Sticky Player setting in the popup, but not Sticky Player dock/restore behavior.
- The integration log already records Sticky Player dock/undock as a deterministic fixture gap from earlier #10 work.
- The module contains pure decision/geometry logic inside private functions (`isPlayerScrolledAway`, `isPlayerMostlyVisible`, `resolveResizedRect`) that can be extracted and unit-tested without live YouTube.
- The existing watch fixture already has the needed player shape (`#movie_player`, video, controls, `#player-container-outer`), so fixture coverage should be possible with a small scrollable-height adjustment.

## Scope

- Add a narrow source hardening change for Sticky Player decision/geometry logic.
- Prefer extracting pure helpers into a small adjacent module such as `src/content/sticky-player-geometry.ts` if importing `src/content/sticky-player.ts` directly would pull in browser globals or state too early for unit tests.
- Keep `src/content/sticky-player.ts` as the owner of DOM mutation, docking, timers, PiP coordination, and event binding.
- Add unit tests for the extracted pure logic:
  - default-view sticky threshold
  - theater-view sticky threshold
  - mostly-visible restore threshold
  - resize rectangle clamping/aspect-ratio behavior for representative directions
- Add one fixture test for the watch page Sticky Player dock/restore path if it stays deterministic:
  - make the watch fixture scrollable
  - scroll until the player is eligible to dock
  - assert `#simple-yt-tweaks-sticky-player-shell #movie_player`, placeholder, and body class are present
  - scroll back to the visible player position and assert the player restores and the shell is removed
- Update only handoff/docs needed to report the implementation result.

## Non-Scope

- Do not reintroduce enhanced Home/Search hover grow or highlight.
- Do not change settings defaults, labels, storage keys, popup behavior, or version metadata.
- Do not broaden into a Sticky Player redesign.
- Do not change browser Picture-in-Picture behavior except where an existing call path needs to keep compiling after helper extraction.
- Do not add live YouTube smoke as a required gate.
- Do not bump version, tag, release, or edit Web Store assets.
- Do not merge.

## Dependencies

- Depends on `SYT-010E` / PR #24 integration, already complete.
- Depends on issue #10 remaining open, confirmed open on 2026-06-10.
- No dependency on #8; keep #8 paused.

## Parallelization Metadata

- Parallel-safe: no by default under current capacity.
- Serial-required: yes for runtime source hardening in large content modules.
- Depends-on: `SYT-010E` integrated; clean main/planning PR review path.
- Conflict-risk: medium/high because Sticky Player moves live YouTube player DOM nodes and interacts with PiP/fullscreen/theater state.

## Write Scope

Expected implementation files:

- `src/content/sticky-player.ts`
- Optional: `src/content/sticky-player-geometry.ts`
- `tests/unit/sticky-player.unit.spec.ts`
- `tests/e2e/extension.fixture.spec.ts`
- `tests/e2e/youtube-fixtures.ts`
- `docs/swarm/handoffs/SYT-010F.md`

Do not edit unrelated content modules unless a compile/test failure directly requires a small import/type follow-up.

## Verification

Runner focused checks:

- `npm run test:unit`
- `npm run test:e2e`
- `npm run typecheck`
- `npm run lint`
- `git diff --check`

Integrator full gate:

- `npm run validate:all`

Do not run live YouTube for this lane unless the Runner uncovers behavior that cannot be represented in fixtures and records why.

## Risks

- Sticky Player fixture behavior depends on reliable player geometry after scrolling. If Chromium fixture geometry is flaky, keep the helper extraction/unit tests and record the exact fixture blocker rather than forcing a fragile test.
- Helper extraction should preserve the existing thresholds exactly unless a failing test proves an existing threshold is wrong.
- `src/content/sticky-player.ts` imports `state`, which initializes browser-dependent state. Unit tests should avoid importing that module directly if it makes tests depend on global `location` or `document` setup.
- Dock/restore moves the real player node; assertions must verify the node is restored to the watch fixture, not recreated or duplicated.

## Exact Runner Prompt

You are Senior Runner for Simple YT Tweaks task `SYT-010F`.

Repo: `/Users/d4ngl/Git Repos/Codex/simple-yt-tweaks`
Issue: #10, Post-harness code hardening pass
Branch to create/use: `swarm/syt-010f-sticky-player-hardening` from current `main`

Required reading, in order:

1. `/Users/d4ngl/Git Repos/Codex/AGENTS.md`
2. `SWARM.md`
3. `docs/swarm/controller-directives.md`
4. `docs/swarm/context-map.md`
5. `docs/swarm/github.md`
6. `docs/swarm/task-board.md`
7. `docs/swarm/user-feedback.md`
8. `docs/swarm/handoffs/SYT-010F.md`
9. Relevant source/tests you inspect

Scope:

- Implement the Sticky Player hardening lane described in `docs/swarm/handoffs/SYT-010F.md`.
- Keep changes behavior-preserving.
- Prefer extracting pure Sticky Player visibility/resize helpers into a small adjacent module so unit tests can cover thresholds without importing DOM state.
- Add deterministic unit coverage and one fixture dock/restore test if feasible.
- Update this handoff with files touched, commands run, decisions, blockers, and next role.

Non-scope:

- Do not reintroduce #8 enhanced Home/Search hover grow/highlight.
- Do not change settings defaults, version, release assets, or Web Store assets.
- Do not merge.
- Do not run live YouTube unless a fixture gap forces a documented optional smoke.

Verification:

- Run `npm run test:unit`.
- Run `npm run test:e2e`.
- Run `npm run typecheck`.
- Run `npm run lint`.
- Run `git diff --check`.
- If all focused checks pass and time permits, run `npm run validate:all`; otherwise leave it as the Integrator gate.

Expected final state:

- If implementation and focused checks pass, push the branch and open/update a draft PR with title starting `Codex: `.
- PR body must include `How to test / what to tell the controller`, human review requested: `no`, exact commands, expected results, and feedback format if any.
- Report `Needs Review` to the controller.
