# Context Map

Use this file as the fast entrypoint after `SWARM.md` and `docs/swarm/controller-directives.md`.

## Current Hot State

- Active implementation lane: `SYT-036`
- Last integrated lane: `SYT-010G`
- GitHub issues: #10 open; #36 open; #38 open; #31 closed
- PR: #37 draft for `SYT-036` / `SYT-038`
- Branch: `swarm/syt-036-home-hover-stuck-lifecycle`
- Current status: `SYT-036` Home autoplay route passed user QA; user then reported #38 live-stream Theater video cut-off/chat overlay collapse. #38 fix is on PR #37 with full validation and live Brave PWA geometry/screenshot verification; push/update PR and route fresh review next.
- Next priority lane: finish #36/#38 before planning more #10 hardening
- Do not route next: #8 enhanced Home/Search hover grow research unless the user explicitly reopens that gate

## Hot Files

- Controller routing: `docs/swarm/controller-directives.md`
- Current state: `docs/swarm/current-state.md`
- Task queue: `docs/swarm/task-board.md`
- Agent capacity: `docs/swarm/agent-registry.md`
- GitHub policy/state: `docs/swarm/github.md`
- Next handoff: `docs/swarm/handoffs/SYT-036.md`
- User steering: `docs/swarm/user-feedback.md`

## Cold / Archived History

Completed lanes are intentionally compacted to stubs:

- `SYT-CTL-001` -> PR #11, merge `676efc8`
- `SYT-010A` -> PR #12, merge `59ec975`
- `SYT-010B` -> PR #14, merge `5675059`
- `SYT-010C` -> PR #16, merge `0fca6c3`
- `SYT-010D` -> PR #18, merge `88f0a91`
- `SYT-021` -> PR #22, merge `8f90ef1`, closes #21
- `SYT-010E` -> PR #24, merge `fae4e5d`, refs #10
- `SYT-010F` planning -> PR #26, merge `66d756f`, refs #10
- `SYT-010F` implementation -> PR #28, merge `fa07c18`, refs #10
- `SYT-010F` docs follow-up -> PR #29, merge `6580065`
- `SYT-031` -> PR #32, merge `8e881c9`, closes #31
- `SYT-010G` -> PR #34, merge `99156b5`, refs #10
- `SYT-036` / `SYT-038` -> issues #36/#38, draft PR #37

Full prior handoff text is recoverable through Git history before the 2026-06-10 compaction commit. Use `docs/swarm/archive/README.md` for the reference map.

## Next Safe Controller Action

Finish `SYT-036` / `SYT-038`:

- Do not bump version, tag, or release.
- Push and route fresh review for PR #37 after the post-review #38 live-stream Theater/chat overlay patch.
- After review passes, wait for `Human QA passed/failed for SYT-036/#38: <notes>` unless reviewer/integrator records an explicit waiver based on the live Brave PWA evidence.
- Integrate PR #37 only after review and human QA pass or an explicit waiver is recorded.
- Do not restart #8 enhanced hover research.
