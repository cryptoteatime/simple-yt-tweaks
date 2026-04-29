# SYT-008A: Enhanced Home/Search Hover Research Gate

## State

- Status: Paused
- Role: Planner
- Repo: Simple YT Tweaks
- Branch: `swarm/syt-008a-hover-research`
- Owner: Unassigned
- Created: 2026-04-29
- Updated: 2026-04-29

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
| `npm run test:e2e` | Not run for this lane yet | Required for any prototype. |
| `npm run test:e2e:live` | Not run for this lane yet | Optional research smoke, not stable gate. |
| Human QA | Not run for this lane yet | Required before merging any visual behavior change. |

## Human Acceptance Checklist

- Required before merge: Yes for any implementation.
- URL(s): PR TBD
- Who should test: User for final visual/live YouTube behavior.
- Expected result: no flicker, no autoplay breakage, no edge clipping, independently disableable.
- If it passes, tell the controller: `Human QA passed for SYT-008A: <notes>`
- If it fails, tell the controller: `Human QA failed for SYT-008A: <steps and observed problem>`

## Next Handoff

- Next role: Planner after #10 test hardening.
- Next action: Research only; do not implement until controller explicitly unpauses #8.
- Branch/worktree cleanup needed after merge: yes.
- Copy-ready prompt:

```text
Plan Simple YT Tweaks SYT-008A only after SYT-010A is integrated.

Repo: /Users/d4ngl/Git Repos/Codex/simple-yt-tweaks
Branch: swarm/syt-008a-hover-research

Read GitHub #8, the swarm docs, and docs/swarm/handoffs/SYT-008A.md. Produce a research plan for enhanced home/search hover that preserves native YouTube autoplay and defines fixture/live/manual gates. Do not implement runtime hover behavior unless the controller explicitly unpauses implementation.
```
