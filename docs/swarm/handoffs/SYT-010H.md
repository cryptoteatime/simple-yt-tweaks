# SYT-010H: Final-Leg Polish And Code Hardening

## Status

- Task ID: `SYT-010H`
- GitHub issue: #10
- Branch: TBD after PR #37 is integrated
- PR: none yet
- State: Ready
- Role: Planner first, then narrow Runner lanes

## Goal

Polish the post-v0.3.0 codebase without broad churn: reduce redundant logic, remove unnecessary runtime polling/churn, tighten selector targeting, improve settings confidence, and keep the extension behavior smooth across Home, Search, watch Default/Theater/Fullscreen, Sticky Player, sidebar recommendations, live chat, and popup settings.

## Scope

- Audit settings defaults, nesting, popup persistence, and content-script application for parity and user-facing clarity.
- Walk the visual behavior matrix with repo-owned fixture tests first and live Brave/Chrome only as supplemental QA:
  - Home feed native hover autoplay after fresh load and watch-to-Home navigation.
  - Search grid cleanup and compact cards.
  - Watch Default, Theater, and Fullscreen modes.
  - Sticky Player dock/restore/PiP behavior.
  - Recommended hover grow delay and toggle gating.
  - Live stream overlay on/off, Hide Live Chat on/off, comments scrolling, and non-overlay no-black-panel behavior.
  - Popup tabs, nested controls, defaults, reset, and persistence.
- Identify and reduce unnecessary polling, repeated observers, broad DOM sweeps, and duplicate apply paths where a narrower event/observer/state transition is safer.
- Harden selector helpers and module boundaries in the most fragile content modules:
  - `src/content/theater.ts`
  - `src/content/grid-hover.ts`
  - `src/content/sticky-player.ts`
  - `src/content/sidebar.ts`
  - `src/content/fullscreen.ts`
  - shared settings helpers as needed
- Add or adjust fixture/unit tests for behavior that is currently protected only by live/manual QA.
- Compact hot handoffs/docs after PR #37 integration so future controller passes start fast.

## Non-Scope

- Do not reintroduce enhanced Home/Search hover grow or forced preview playback.
- Do not bump version, tag, release, or update Web Store assets.
- Do not rewrite large modules for style alone.
- Do not change user-facing behavior unless a bug, redundancy, or settings inconsistency is identified and covered by tests.
- Do not close #10 until at least one bounded polish/hardening PR lands and the controller records whether more hardening remains.

## Parallelization

- `parallel-safe`: no for the initial planner/audit pass
- `serial-required`: yes
- `depends-on`: PR #37 integrated
- `conflict-risk`: medium/high, because this touches shared content-script behavior and settings flow

## Verification Plan

- Planner/audit: `git diff --check` for docs-only output.
- Runner focused checks: targeted unit/fixture tests for touched modules.
- Reviewer checks: changed-risk review plus relevant tests.
- Integrator gate: `npm run validate:all`.
- Supplemental live QA: only for behavior that fixtures cannot prove, especially live YouTube DOM and Brave PWA behavior.

## First Recommended Action

After PR #37 is merged, create a planner branch `swarm/syt-010h-polish-plan` that audits code paths and produces a small list of runner-sized cleanup tasks. Prefer one high-value implementation lane at a time over a broad refactor.
