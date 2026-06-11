# Context Map

Use this file as the fast entrypoint after `SWARM.md` and `docs/swarm/controller-directives.md`.

## Current Hot State

- Active lane family: `SYT-010H`, final-leg polish/code-hardening under issue #10.
- Current routing: planning PR #43 merged at `7ce7872`; batch registration PR #44 merged at `2f991ef`; first supervised burst is A/B/C only.
- Active batch:
  - `SYT-010H-A`: settings/popup/defaults/persistence coverage on `swarm/syt-010h-settings-popup`, PR #45 open.
  - `SYT-010H-B`: selector/runtime churn audit on `swarm/syt-010h-selector-runtime-audit`, PR #46 open.
  - `SYT-010H-C`: docs/context compaction on `swarm/syt-010h-docs-compaction`.
- Hold lanes: `SYT-010H-D/E/F` stay serial until A/B/C report and the controller reconciles docs.
- GitHub issues: #10 open; #36/#38/#31 closed; #8 paused.
- Recent merged swarm docs PRs: #39 integration record, #40 context repair, #41 burst capacity, #42 planner registration, #43 SYT-010H lane plan, #44 batch registration.
- Do not route next: #8 enhanced Home/Search hover grow research unless the user explicitly reopens that gate.

## Hot Files

- Controller routing: `docs/swarm/controller-directives.md`
- Current state: `docs/swarm/current-state.md`
- Task queue: `docs/swarm/task-board.md`
- Agent capacity: `docs/swarm/agent-registry.md`
- GitHub policy/state: `docs/swarm/github.md`
- Active lane handoff: `docs/swarm/handoffs/SYT-010H.md`
- User steering: `docs/swarm/user-feedback.md`

## Completed Lane References

Completed lanes are intentionally compacted to stubs. Use PRs and `docs/swarm/archive/README.md` for full history.

- `SYT-CTL-001` -> PR #11, merge `676efc8`
- `SYT-010A` -> PR #12, merge `59ec975`
- `SYT-010B` -> PR #14, merge `5675059`
- `SYT-010C` -> PR #16, merge `0fca6c3`
- `SYT-010D` -> PR #18, merge `88f0a91`
- `SYT-021` -> PR #22, merge `8f90ef1`, closes #21
- `SYT-010E` -> PR #24, merge `fae4e5d`, refs #10
- `SYT-010F` planning/implementation/docs -> PRs #26/#28/#29, merges `66d756f`/`fa07c18`/`6580065`
- `SYT-031` -> PR #32, merge `8e881c9`, closes #31
- `SYT-010G` -> PR #34, merge `99156b5`, refs #10
- `SYT-036` / `SYT-038` -> PR #37, merge `342854f`, closes #36/#38
- `SYT-036`/`SYT-010H` docs repairs -> PRs #39/#40/#41/#42/#43/#44, through merge `2f991ef`

## Next Safe Controller Action

Wait for or reconcile the active `SYT-010H-A/B/C` batch. After all three report, update the registry/task board, review their PRs serially, then select at most one serial runtime lane from B's audit recommendations.
