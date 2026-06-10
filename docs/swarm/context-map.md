# Context Map

Use this file as the fast entrypoint after `SWARM.md` and `docs/swarm/controller-directives.md`.

## Current Hot State

- Active implementation lane: none; `SYT-010F` implementation is ready to launch
- Last integrated lane: `SYT-010F` planning
- GitHub issue: #10 open
- PR: #26 merged at `66d756f`; #24 merged at `fae4e5d`
- Branch: `main` after integration-record docs land
- Current status: `SYT-010F` planning integrated; Sticky Player implementation ready
- Next priority lane: spawn Senior Runner on `swarm/syt-010f-sticky-player-hardening`
- Do not route next: #8 enhanced Home/Search hover grow research unless the user explicitly reopens that gate

## Hot Files

- Controller routing: `docs/swarm/controller-directives.md`
- Current state: `docs/swarm/current-state.md`
- Task queue: `docs/swarm/task-board.md`
- Agent capacity: `docs/swarm/agent-registry.md`
- GitHub policy/state: `docs/swarm/github.md`
- Next handoff: `docs/swarm/handoffs/SYT-010F.md`
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

Full prior handoff text is recoverable through Git history before the 2026-06-10 compaction commit. Use `docs/swarm/archive/README.md` for the reference map.

## Next Safe Controller Action

Spawn a Senior Runner from `docs/swarm/handoffs/SYT-010F.md`:

- Branch: `swarm/syt-010f-sticky-player-hardening`.
- Scope: behavior-preserving Sticky Player visibility/resize helper coverage plus deterministic dock/restore fixture coverage if feasible.
- Keep issue #10 open until the controller decides the overall hardening pass is complete.
- Do not restart #8 enhanced hover research.
