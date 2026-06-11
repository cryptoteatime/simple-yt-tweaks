# Context Map

Use this file as the fast entrypoint after `SWARM.md` and `docs/swarm/controller-directives.md`.

## Current Hot State

- Active implementation lane: none
- Last integrated lane: `SYT-036` / `SYT-038`
- GitHub issues: #10 open; #36 closed; #38 closed; #31 closed
- PR: none active for #10 hardening; #20 remains paused draft for #8 research
- Branch: `main`
- Current status: PR #37 was merged at `342854f`, closing #36/#38; PR #39 merged the post-integration state repair at `969c3b7`. User confirmed the desired behavior was working before merge.
- Next priority lane: launch `SYT-010H` final-leg polish/code-hardening under #10.
- Do not route next: #8 enhanced Home/Search hover grow research unless the user explicitly reopens that gate

## Hot Files

- Controller routing: `docs/swarm/controller-directives.md`
- Current state: `docs/swarm/current-state.md`
- Task queue: `docs/swarm/task-board.md`
- Agent capacity: `docs/swarm/agent-registry.md`
- GitHub policy/state: `docs/swarm/github.md`
- Next handoff: `docs/swarm/handoffs/SYT-010H.md`
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
- `SYT-036` / `SYT-038` -> PR #37, merge `342854f`, closes #36/#38
- `SYT-036` integration record -> PR #39, merge `969c3b7`

Full prior handoff text is recoverable through Git history before the 2026-06-10 compaction commit. Use `docs/swarm/archive/README.md` for the reference map.

## Next Safe Controller Action

Launch `SYT-010H`:

- Do not bump version, tag, or release.
- Start with a planner/audit branch such as `swarm/syt-010h-polish-plan`.
- Produce a small list of runner-sized cleanup tasks before source refactors, including which tasks are safe for up to 3-way parallel dispatch.
- Focus on settings walkthrough, selector accuracy, runtime polling/churn reduction, fixture gaps, redundancy, and docs compaction.
- Do not restart #8 enhanced hover research.
