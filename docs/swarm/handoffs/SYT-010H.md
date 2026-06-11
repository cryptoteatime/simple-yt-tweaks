# SYT-010H: Final-Leg Polish And Code Hardening

## Status

- Task ID: `SYT-010H`
- GitHub issue: #10, open
- Branch: `swarm/syt-010h-polish-plan`
- PR: planning PR TBD
- State: Planner output ready for review/routing
- Role: Planner first, then narrow Runner lanes
- Last planner audit: 2026-06-11

## Goal

Polish the post-v0.3.0 codebase without broad churn: reduce redundant logic, remove unnecessary runtime polling/churn where it can be proved safe, tighten selector targeting, improve settings confidence, and keep behavior smooth across Home, Search, watch Default/Theater/Fullscreen, Sticky Player, sidebar recommendations, live chat, and popup settings.

## Current Code/Test Map

- Settings are defined in `src/shared/settings.ts`; popup renders from `SETTING_DEFINITIONS` in `src/popup/popup.ts`; content keeps a duplicated `src/content/settings.ts` copy guarded by `tests/unit/settings.unit.spec.ts`.
- The main content apply loop is `src/content/content.ts`; observer/binding work is in `src/content/lifecycle.ts`.
- Watch recommendation hover grow and native Home/Search preview safety live in `src/content/grid-hover.ts`; Home/Search enhanced hover grow and forced preview playback must stay absent.
- Sidebar/home-feed cleanup lives in `src/content/sidebar.ts`; it also owns deferred home cleanup after watch-to-Home navigation.
- Theater/live-chat behavior lives in `src/content/theater.ts`; recent #38 coverage is in `tests/e2e/extension.fixture.spec.ts`.
- Sticky Player already has pure geometry coverage in `src/content/sticky-player-geometry.ts` and `tests/unit/sticky-player.unit.spec.ts`, plus dock/restore fixture coverage.
- Fullscreen player UI geometry already has pure helper coverage in `src/content/fullscreen-geometry.ts` and `tests/unit/fullscreen-geometry.unit.spec.ts`.
- The fixture suite in `tests/e2e/extension.fixture.spec.ts` covers Home cleanup, watch-to-Home grid metadata repair, hidden watch cache removal, destructive cleanup defer, no synthetic Home hover, off-card preview cleanup, Search grid cleanup/toggle, watch mode classes, recommendation hover grow, player click fallback, live chat overlay/non-overlay Theater behavior, Sticky Player dock/restore, and popup basics.

## Non-Scope

- Do not reintroduce enhanced Home/Search hover grow or forced preview playback.
- Do not bump version, tag, release, or update Web Store assets.
- Do not rewrite large modules for style alone.
- Do not change user-facing behavior unless a bug, redundancy, or settings inconsistency is identified and covered by tests.
- Do not close #10 from this planning PR. Close only after the controller decides final hardening is complete.

## Recommended First Runner Batch

The first safe burst is two parallel Runner lanes plus one docs lane, capped at 3 total agents only if the controller creates separate worktrees and path locks exactly as listed below:

1. `SYT-010H-A` settings/popup/defaults/persistence coverage.
2. `SYT-010H-B` selector/runtime audit as a docs-only or helper-test-only lane, no production source edits unless the controller serializes it after A/C.
3. `SYT-010H-C` hot docs/context compaction.

Do not include `SYT-010H-D` runtime implementation in the first parallel batch. Runtime edits touching `src/content/content.ts`, `src/content/lifecycle.ts`, `src/content/theater.ts`, `src/content/grid-hover.ts`, `src/content/sidebar.ts`, `src/content/sticky-player.ts`, or `src/content/fullscreen.ts` should be serial after the audit/coverage lanes report.

## Lane Map

### `SYT-010H-A`: Settings, Popup Defaults, And Persistence

- Assigned role: Junior/Senior Runner
- Branch/worktree: `swarm/syt-010h-settings-popup`
- State: Ready
- Scope: Add focused fixture/unit coverage for popup reset-by-pane behavior, nested enable/disable expectations, `generalHideShorts` side effects on sidebar settings, `pipButton`/`floatingMiniPlayer` alias persistence, and settings normalization parity.
- Non-scope: Do not redesign popup UI, rename settings, change defaults, or alter release/version files.
- Path locks: `tests/e2e/extension.fixture.spec.ts`, `tests/unit/settings.unit.spec.ts`; `src/shared/settings.ts`, `src/content/settings.ts`, and `src/popup/popup.ts` only for small bug fixes uncovered by tests.
- `parallel-safe`: yes with lanes B and C if B is docs/helper-test-only and C is docs-only.
- `serial-required`: no for test-only work; yes if source settings/popup contracts change.
- `depends-on`: this planning PR merged or controller-approved branch handoff.
- `conflict-risk`: medium, because settings contracts affect popup and content script.
- Verification commands: `npm run test:unit`; `npm run test:e2e -- --grep "popup|settings"` if grep is supported by Playwright, otherwise `npm run test:e2e`; `npm run typecheck`; `npm run lint`; `git diff --check`.
- Live Brave/Chrome QA: no. Fixture popup/storage checks are the gate.
- PR strategy: open a draft PR against `main`, reference #10, keep human review requested `no`, and list exact test commands in `How to test / what to tell the controller`.

### `SYT-010H-B`: Selector Accuracy And Runtime Churn Audit

- Assigned role: Senior Developer or Planner/Reviewer
- Branch/worktree: `swarm/syt-010h-selector-runtime-audit`
- State: Ready
- Scope: Produce a source-backed audit of selector accuracy, broad DOM sweeps, observer churn, and polling. Include `WATCH_TO_HOME_URL_POLL_MS` interval in `src/content/content.ts`, global `MutationObserver` and video bind interval in `src/content/lifecycle.ts`, `clearDetachedNativePreviewRoots`/Home metadata normalization in `src/content/grid-hover.ts`, repeated sidebar sweeps in `src/content/sidebar.ts`, fullscreen action overlay observer in `src/content/fullscreen.ts`, and live-chat iframe/native-close binding in `src/content/theater.ts`.
- Non-scope: Do not implement broad runtime refactors in this parallel lane. Do not remove the watch-to-Home reload guard without proving #36 cannot regress. Do not synthesize Home/Search hover events or force preview playback.
- Path locks: `docs/swarm/handoffs/SYT-010H-B.md` or a new audit note under `docs/swarm/handoffs/`; optional `tests/unit/dom.unit.spec.ts` or new helper unit tests only if a pure selector helper is extracted without touching runtime modules. No production source edits during parallel batch.
- `parallel-safe`: yes only as docs/audit or isolated helper-test work.
- `serial-required`: yes for any implementation that changes runtime source files.
- `depends-on`: this planning PR merged or controller-approved branch handoff.
- `conflict-risk`: low for audit-only, high for implementation.
- Verification commands: `git diff --check`; if helper tests are added, also `npm run test:unit`, `npm run typecheck`, and `npm run lint`.
- Live Brave/Chrome QA: no for audit; yes only for any later implementation affecting watch-to-Home reload, live YouTube previews, or Brave PWA header-hover -> Home route.
- PR strategy: docs-only draft PR or handoff-only result. If implementation is recommended, hand it back as a new serial lane rather than mixing it into the audit PR.

### `SYT-010H-C`: Swarm Docs And Context Compaction

- Assigned role: Junior Runner / Docs Runner
- Branch/worktree: `swarm/syt-010h-docs-compaction`
- State: Ready
- Scope: Compact hot swarm docs after recent #36/#38/#39 work. Keep `docs/swarm/context-map.md`, `current-state.md`, `task-board.md`, `agent-registry.md`, and completed handoff stubs concise; preserve archive references and current `SYT-010H` routing.
- Non-scope: Do not edit product source, tests, README release content, or GitHub issue state.
- Path locks: `docs/swarm/context-map.md`, `docs/swarm/current-state.md`, `docs/swarm/task-board.md`, `docs/swarm/agent-registry.md`, `docs/swarm/handoffs/*.md`, `docs/swarm/archive/README.md` if needed.
- `parallel-safe`: yes with A and B because it is docs-only and avoids source/tests.
- `serial-required`: no, but controller-owned docs must be reconciled after all parallel lanes report.
- `depends-on`: none beyond current clean `main`.
- `conflict-risk`: low/medium, because controller-owned docs can conflict with live registry updates.
- Verification commands: `git diff --check`.
- Live Brave/Chrome QA: no.
- PR strategy: docs-only draft PR, reference #10, human review requested `no`, controller can merge after reviewer confirms no state loss.

### `SYT-010H-D`: Runtime Apply-Loop And Polling Hardening

- Assigned role: Senior Developer
- Branch/worktree: `swarm/syt-010h-runtime-churn`
- State: Hold until lane B reports.
- Scope: Implement one or two audit-backed, behavior-preserving reductions in polling/observer churn. Candidate targets are replacing or narrowing the 250 ms watch-to-Home URL watcher, tightening the 2 s video bind interval, reducing duplicate `applyFeatureState` work after navigation, or avoiding repeated broad sweeps when settings are disabled.
- Non-scope: Do not combine with theater live-chat layout rewrites, grid-hover behavior changes, or settings contract changes. Do not weaken #36 watch -> header-hover -> logo/Home reload recovery.
- Path locks: likely `src/content/content.ts`, `src/content/lifecycle.ts`, `src/content/state.ts`, and targeted fixture/unit tests only.
- `parallel-safe`: no.
- `serial-required`: yes.
- `depends-on`: B audit; A if settings behavior is touched.
- `conflict-risk`: high, because this is shared content-script runtime behavior.
- Verification commands: focused Home/watch tests from `npm run test:e2e`; `npm run test:e2e:live` only if watch-to-Home or live preview behavior changes; `npm run typecheck`; `npm run lint`; `git diff --check`; integrator later runs `npm run validate:all`.
- Live Brave/Chrome QA: yes if the watch-to-Home reload guard changes; use the exact Brave PWA route from user feedback.
- PR strategy: one serial draft PR, request human QA only if live watch-to-Home behavior changes.

### `SYT-010H-E`: Selector Helper And Fixture Gap Hardening

- Assigned role: Senior Developer
- Branch/worktree: `swarm/syt-010h-selector-fixtures`
- State: Hold until lane B identifies target selectors.
- Scope: Add small helper tests or fixture assertions for selector behavior that is currently implicit: modern `yt-lockup-view-model` watch recommendations, Search non-video filtering, sponsored Home container detection, sidebar label matching, live chat iframe close/restore selectors, and fullscreen action overlay target scoring.
- Non-scope: Do not split every selector into a new module. Do not update Home/Search native hover behavior.
- Path locks: `tests/unit/**`, `tests/e2e/extension.fixture.spec.ts`, `tests/e2e/youtube-fixtures.ts`; production source only if extracting pure helpers from one module at a time.
- `parallel-safe`: no with D or any runtime module edits; yes later only if confined to tests and not overlapping A.
- `serial-required`: yes if touching `grid-hover.ts`, `sidebar.ts`, `fullscreen.ts`, or `theater.ts`.
- `depends-on`: B audit; avoid overlapping with A popup/settings tests.
- `conflict-risk`: medium/high depending on source extraction.
- Verification commands: `npm run test:unit`; `npm run test:e2e`; `npm run typecheck`; `npm run lint`; `git diff --check`.
- Live Brave/Chrome QA: no unless a selector change affects real live YouTube DOM not represented by fixtures.
- PR strategy: split by module if source edits are needed; keep one behavior area per PR.

### `SYT-010H-F`: Theater/Grid/Sidebar Code Organization Cleanup

- Assigned role: Senior Developer
- Branch/worktree: `swarm/syt-010h-content-organization`
- State: Proposed, serial-only after D/E or if controller decides no runtime churn implementation is needed.
- Scope: Reduce duplicated code only where tests already cover behavior. Candidate extractions: live-chat iframe control helpers from `theater.ts`, watch recommendation selector construction from `grid-hover.ts`, sidebar section matching helpers from `sidebar.ts`, or default-mode CSS construction from `content.ts`.
- Non-scope: No broad file splitting, no style-only rewrites, no behavior changes without fixture coverage.
- Path locks: exactly one content module plus its tests per sub-PR.
- `parallel-safe`: no.
- `serial-required`: yes.
- `depends-on`: A/B/E coverage where relevant.
- `conflict-risk`: high if more than one content module is touched.
- Verification commands: targeted unit/fixture tests for the module, `npm run typecheck`, `npm run lint`, `git diff --check`; integrator runs `npm run validate:all`.
- Live Brave/Chrome QA: only if live-chat, Home hover, or watch-to-Home behavior changes.
- PR strategy: one module per PR; reviewer must reject mixed broad cleanup.

## Final Review And Integration Sequence

1. Review and integrate the planning PR first, or let the controller treat this handoff as the approved route.
2. Launch first batch A/B/C only if separate branches/worktrees and registry locks are recorded.
3. Reconcile A/B/C outputs in controller docs; select at most one serial runtime implementation lane from B's recommendations.
4. Run review serially for each implementation PR.
5. Integrator gate for each source/test PR: `npm run validate:all`.
6. Keep #10 open until the controller records whether D/E/F produced enough hardening or a release-candidate lane is still needed.

## Commands Run By Planner

- `git status --short --branch`
- `sed` reads for required swarm docs, README, DEVELOPMENT, package.json, and relevant source/test files
- `rg --files src tests`
- `rg -n "setInterval|setTimeout|MutationObserver|requestAnimationFrame|observe\\(|querySelector|querySelectorAll|chrome\\.storage|DEFAULT|default|settings" src tests/e2e tests/unit`
- `gh issue view 10 --comments --json number,title,state,body,comments,url`

## Blockers And Risks

- No blocker for the first A/B/C batch.
- Runtime implementation is intentionally blocked on B's audit result to avoid speculative refactors.
- Live Brave PWA QA is required only if a later lane changes watch-to-Home reload/native preview behavior or live YouTube behavior beyond existing fixture coverage.
- The active 250 ms URL watcher is a known churn target, but it protects a recently user-confirmed Brave PWA regression path; treat it as high risk.

## Next Recommended Controller Action

Open/review the docs-only planning PR for this handoff. After it is accepted, register and launch A/B/C as the first supervised burst only if capacity remains 3 and the controller can create separate worktrees with the listed path locks. Otherwise launch A first, then B, then C.
