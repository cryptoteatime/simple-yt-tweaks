# SYT-008A: Enhanced Home/Search Hover Research Gate

## State

- Status: Needs Review - research decision drafted; product direction required before prototype
- Role: Planner
- Repo: Simple YT Tweaks
- Branch: `swarm/syt-008a-hover-research`
- Owner: Lovelace (`019ddc7d-3114-7603-9c3e-a3daaf9f055a`)
- Created: 2026-04-29
- Updated: 2026-04-30

## Goal

Research whether #8 can be safely revived in a future release without breaking native YouTube hover autoplay, preview overlays, or edge-card behavior.

## Scope

- Read GitHub #8 and prior handoff notes.
- Identify what fixture tests can prove and what requires live/manual validation.
- Propose a prototype plan only after #10 test hardening is in place.

## Non-Scope

- Do not implement enhanced home/search hover in the current hardening milestone.
- Do not change current native home/search hover behavior.
- Do not use live YouTube as the only validation path.

## Dependencies

- `SYT-010A` coverage audit complete.
- `SYT-010D` helper tests integrated.
- User/product-direction gate before implementation.

## Lane Metadata

- Parallel-safe: no with #10 source work.
- Serial-required: yes; live YouTube preview lifecycle is fragile.
- Depends-on: `SYT-010A`, user/product gate.
- Conflict-risk: high; home/search feed CSS, YouTube preview overlay lifecycle, `src/content/grid-hover.ts`.
- Shared coordination docs allowed: this handoff only unless controller assigns more.

## Verification

| Check | Result | Notes |
| --- | --- | --- |
| `git diff --check` | Passed | Docs-only whitespace check. |
| `npm run test:e2e` | Not run for this docs-only lane | Required for any fixture/prototype lane. |
| `npm run test:e2e:live` | Not run for this lane yet | Optional research smoke, not stable gate. |
| Human QA | Not run for this lane yet | Required before merging any visual behavior change. |

## Files Touched

- `docs/swarm/handoffs/SYT-008A.md`

## Commands Run

| Command | Result | Notes |
| --- | --- | --- |
| `gh api repos/cryptoteatime/simple-yt-tweaks/issues/8 --jq '{title, state, body, created_at, updated_at, html_url}'` | Passed | Read issue #8 after `gh issue view` hit GitHub's deprecated Projects classic GraphQL field. |
| `gh api repos/cryptoteatime/simple-yt-tweaks/issues/8/comments --jq '.[] | {user:.user.login, created_at, body}'` | Passed | Read issue comments. |
| `rg -n "hover|preview|autoplay|flicker|edge|clip|#8|SYT-008|grid-hover|home/search|home search" . -g '!node_modules/**' -g '!dist/**' -g '!release/**'` | Passed | Found current guardrails and prior notes; output included generated asset noise, so source/docs were read directly afterward. |
| `git diff --check` | Passed | Required docs-only verification. |

## Blockers / Risks

- Future implementation is blocked on human/product direction: keep deferred, approve an off-by-default prototype, or narrow the idea to non-transform polish.
- Fixtures can prove selector/class guardrails and setting behavior, but cannot prove live YouTube preview startup timing, renderer experiments, consent/ad surfaces, or all edge-card clipping cases.
- Any runtime prototype remains high conflict risk in `src/content/grid-hover.ts` and should be serial-only.

## Research Sources

- GitHub issue #8: `Revisit enhanced home/search grid hover preview`.
- `src/content/grid-hover.ts`: current hover growth is intentionally scoped to watch-page sidebar recommendations; `syncGridHoverState` notes that home/search feed previews stay native to avoid YouTube preview startup bookkeeping.
- `tests/e2e/extension.fixture.spec.ts`: home/search fixtures assert injected CSS does not include `ytd-video-preview` or old home/search hover-ready selectors; the home fixture hovers a native-preview-like card and asserts the extension does not add `simple-yt-tweaks-grid-hover-ready`.
- `tests/e2e/youtube-fixtures.ts`: includes a native-preview-like home card with `is-mouse-over-for-preview` and `ytd-video-preview`.
- `docs/swarm/handoffs/SYT-010A.md`: coverage audit says fixtures can guard against reintroducing old selectors, but cannot prove live YouTube preview startup timing, renderer experiments, or edge-card behavior.
- `CHANGELOG.md`: v0.3.0 explicitly kept home/search hover playback native because enhanced grid hover proved too fragile.

## Research Decision

Decision: require human/product direction before any prototype.

Rationale:

- The issue is an enhancement, not a correctness blocker.
- The known failures are visual and lifecycle-sensitive: native hover autoplay startup, flicker when entering through thumbnail/title/card edges, first-row/first-column clipping, and top-level `ytd-video-preview` overlays.
- The current repo already has a stable guardrail that prevents accidental home/search hover enhancement from returning. That guardrail should stay in place until a human confirms the desired product tradeoff.
- A prototype without product direction risks spending implementation time on a visual treatment the owner may not want once the tradeoffs are explicit.

Prototype is not ready to dispatch from this lane. The next safe action is a product-direction review that chooses one of these paths:

1. Keep #8 deferred indefinitely and preserve native home/search hover only.
2. Approve a branch-only prototype with an independent off-by-default setting.
3. Narrow the idea to non-transform visual polish that never touches YouTube preview/card hover state.

## Future Prototype Constraints

If product direction approves a prototype, the implementation lane should be branch-only and off by default.

- Add an independent setting such as `generalEnhancedFeedHoverPreview`, default `false`; do not couple it to feed columns or sidebar `Recommended Hover Grow`.
- Do not change YouTube-owned preview state attributes such as `is-mouse-over-for-preview`, player/preview elements, inline player surfaces, or card bookkeeping.
- Do not apply transforms to `ytd-video-preview`, `yt-inline-player-view-model`, `video`, or `.html5-video-player`.
- Prefer a wrapper/outline/shadow treatment that leaves the thumbnail/preview element geometry and hit testing stable.
- Keep the existing native-home/search guardrails enabled when the setting is off.
- Keep watch sidebar hover behavior separate from home/search behavior.
- Avoid shipping until fixture, optional live smoke, and manual visual gates all pass.

## Validation Plan

Stable fixture gate:

- Keep existing negative assertions that home/search CSS does not include `ytd-video-preview` or old home/search hover-ready selectors when the new setting is off.
- Add a future fixture-only lane before runtime implementation if product direction approves a prototype:
  - Home cards with native preview markup in first column, middle column, and last column.
  - Search video cards with thumbnail, title, and card-edge pointer entry paths.
  - Disabled setting assertion proving no runtime class, CSS selector, or layout effect is added.
  - Enabled setting assertion limited to the proposed wrapper/outline class, with no mutation of `is-mouse-over-for-preview` and no selector targeting preview player surfaces.
- Prototype lane focused checks should run `npm run test:e2e`, `npm run lint`, `npm run typecheck`, and `git diff --check`.

Live/manual gate:

- Do not use live YouTube as the stable gate.
- Use `npm run test:e2e:live` only as supplemental evidence after fixture tests pass and only if the prototype is ready for visual inspection.
- Required human QA before merging any implementation:
  - Home and search, at least 3-column layout.
  - First column, middle column, last column, and first row.
  - Pointer entry from thumbnail, title, card edge, and quick card-to-card movement.
  - Confirm native hover autoplay still starts and stops normally.
  - Confirm no flicker, no edge clipping, no swallowed clicks, and setting can disable the behavior independently.

## Proposed Next Lanes

| Task ID | Role | Status | Scope | Parallel-safe | Serial-required | Depends-on | Conflict-risk |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `SYT-008B` | Product/Planner | Blocked pending human direction | Decide whether #8 remains deferred, gets an off-by-default prototype, or narrows to non-transform polish. | yes, docs only | no | `SYT-008A` review | low |
| `SYT-008C` | Runner | Proposed only if `SYT-008B` approves prototype | Add fixture coverage for off/default-on prototype gates before runtime hover behavior. | no with hover source work | yes | `SYT-008B` | medium, fixture contracts |
| `SYT-008D` | Senior Runner | Proposed only after fixture gate | Branch-only off-by-default prototype; no release/version/store assets. | no | yes | `SYT-008C` | high, live YouTube preview lifecycle |

## Human Acceptance Checklist

- Required before merge: Yes for any implementation.
- URL(s): PR TBD
- Who should test: User for final visual/live YouTube behavior.
- Expected result: no flicker, no autoplay breakage, no edge clipping, independently disableable.
- If it passes, tell the controller: `Human QA passed for SYT-008A: <notes>`
- If it fails, tell the controller: `Human QA failed for SYT-008A: <steps and observed problem>`

## Next Handoff

- Next role: Reviewer for docs/research review, then controller/product direction.
- Next action: Review this handoff, then ask the user whether #8 should stay deferred, move to an off-by-default prototype, or be narrowed to non-transform polish.
- Branch/worktree cleanup needed after merge: yes.
- PR: TBD.
- Copy-ready prompt:

```text
Review Simple YT Tweaks SYT-008A research output.

Repo: /Users/d4ngl/Git Repos/Codex/simple-yt-tweaks
Branch: swarm/syt-008a-hover-research

Read GitHub #8, the swarm docs, and docs/swarm/handoffs/SYT-008A.md. Review the research decision, validation plan, and proposed next lanes. Confirm whether the lane is ready for controller/product direction. Do not implement runtime hover behavior.
```
