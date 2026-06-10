# Context Map

Use this file as the fast entrypoint after `SWARM.md` and `docs/swarm/controller-directives.md`.

## Current Hot State

- Active implementation lane: none
- Last integrated lane: `SYT-010F` implementation
- GitHub issue: #10 open
- PR: #28 merged at `fa07c18`; #29 docs follow-up merged at `6580065`
- Branch: `main` after hot-state repair lands
- Current status: `SYT-010F` integrated; issue #10 remains open for future bounded hardening
- Next priority lane: decide whether to plan `SYT-010G` or leave #10 open for later
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
- `SYT-010F` implementation -> PR #28, merge `fa07c18`, refs #10
- `SYT-010F` docs follow-up -> PR #29, merge `6580065`

Full prior handoff text is recoverable through Git history before the 2026-06-10 compaction commit. Use `docs/swarm/archive/README.md` for the reference map.

## Next Safe Controller Action

Decide whether to plan another #10 hardening lane:

- `SYT-010F` is integrated; do not respawn it.
- Start `SYT-010G` only with a narrow source/test target and fresh handoff.
- Keep issue #10 open until the controller decides the overall hardening pass is complete.
- Do not restart #8 enhanced hover research.
