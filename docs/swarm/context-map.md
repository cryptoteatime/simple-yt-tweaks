# Context Map

Use this file as the fast entrypoint after `SWARM.md` and `docs/swarm/controller-directives.md`.

## Current Hot State

- Active implementation lane: none
- Last integrated lane: `SYT-021`
- GitHub issue: #21 closed
- PR: #22 merged at `8f90ef1`
- Branch: `swarm/syt-008b-native-hover-spa-regression` cleaned locally and remotely
- Current status: `SYT-021` Integrated
- Next priority lane: `SYT-010E` (#10 code hardening)
- Do not route next: #8 enhanced Home/Search hover grow research unless the user explicitly reopens that gate

## Hot Files

- Controller routing: `docs/swarm/controller-directives.md`
- Current state: `docs/swarm/current-state.md`
- Task queue: `docs/swarm/task-board.md`
- Agent capacity: `docs/swarm/agent-registry.md`
- GitHub policy/state: `docs/swarm/github.md`
- Next handoff: `docs/swarm/handoffs/SYT-010E.md`
- User steering: `docs/swarm/user-feedback.md`

## Cold / Archived History

Completed lanes are intentionally compacted to stubs:

- `SYT-CTL-001` -> PR #11, merge `676efc8`
- `SYT-010A` -> PR #12, merge `59ec975`
- `SYT-010B` -> PR #14, merge `5675059`
- `SYT-010C` -> PR #16, merge `0fca6c3`
- `SYT-010D` -> PR #18, merge `88f0a91`
- `SYT-021` -> PR #22, merge `8f90ef1`, closes #21
- `SYT-010E` -> next #10 hardening lane, `docs/swarm/handoffs/SYT-010E.md`

Full prior handoff text is recoverable through Git history before the 2026-06-10 compaction commit. Use `docs/swarm/archive/README.md` for the reference map.

## Next Safe Controller Action

Route `SYT-010E` as the next #10 code-hardening lane. Keep it small and source-risk driven:

- Start from `docs/swarm/handoffs/SYT-010E.md`.
- Preserve the `validate:all` final gate.
- Do not restart #8 enhanced hover research.
