# Context Map

Use this file as the fast entrypoint after `SWARM.md` and `docs/swarm/controller-directives.md`.

## Current Hot State

- Active implementation lane: none
- Last integrated lane: `SYT-010E`
- GitHub issue: #10 open
- PR: #24 merged at `fae4e5d`
- Branch: `swarm/syt-010e-code-hardening` cleaned locally and remotely
- Current status: `SYT-010E` Integrated
- Next priority lane: plan/route the next small #10 hardening lane (`SYT-010F`) if issue #10 remains open
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
- `SYT-010E` -> PR #24, merge `fae4e5d`, refs #10

Full prior handoff text is recoverable through Git history before the 2026-06-10 compaction commit. Use `docs/swarm/archive/README.md` for the reference map.

## Next Safe Controller Action

After this integration-record docs follow-up lands and the worktree is clean, plan or route one more small #10 hardening lane (`SYT-010F`):

- Pick one bounded target from the remaining high-risk modules; do not start a broad rewrite.
- Preserve the `npm run validate:all` final gate.
- Keep issue #10 open until the controller decides the overall hardening pass is complete.
- Do not restart #8 enhanced hover research.
