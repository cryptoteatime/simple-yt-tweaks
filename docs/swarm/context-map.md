# Context Map

Use this file as the fast entrypoint after `SWARM.md` and `docs/swarm/controller-directives.md`.

## Current Hot State

- Active implementation lane: `SYT-031`
- Last integrated lane: `SYT-010F` implementation
- GitHub issues: #31 open; #10 open
- PR: #32 draft for `SYT-031`
- Branch: `swarm/syt-031-home-hover-stationary-spa`
- Current status: `SYT-031` implemented locally and awaiting PR review
- Next priority lane: review/integrate `SYT-031`; then decide whether to plan `SYT-010G` or leave #10 open for later
- Do not route next: #8 enhanced Home/Search hover grow research unless the user explicitly reopens that gate

## Hot Files

- Controller routing: `docs/swarm/controller-directives.md`
- Current state: `docs/swarm/current-state.md`
- Task queue: `docs/swarm/task-board.md`
- Agent capacity: `docs/swarm/agent-registry.md`
- GitHub policy/state: `docs/swarm/github.md`
- Next handoff: `docs/swarm/handoffs/SYT-031.md`
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

Review and integrate `SYT-031`:

- Review the #31 branch for native Home/Search preview lifecycle scope and stale preview matching.
- `npm run validate:all` and `npm run test:e2e:live` passed on the branch.
- Do not bump version, tag, or release.
- After `SYT-031` is integrated, start `SYT-010G` only with a narrow source/test target and fresh handoff.
- Do not restart #8 enhanced hover research.
