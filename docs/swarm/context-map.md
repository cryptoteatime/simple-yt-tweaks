# Context Map

Use this file as the fast entrypoint after `SWARM.md` and `docs/swarm/controller-directives.md`.

## Current Hot State

- Active lane family: `SYT-RC-001`, release-candidate checklist and #10 completion decision.
- Current routing: planning PR #43, batch registration PR #44, settings/popup coverage PR #45, selector/runtime audit PR #46, docs compaction PR #47, runtime video binding PR #48, Search lockup fixture PR #50, grid-hover organization PR #54, and RC checklist PR #55 are merged.
- Completed first burst:
  - `SYT-010H-A`: settings/popup/defaults/persistence test coverage, PR #45, merge `ce09953`.
  - `SYT-010H-B`: selector/runtime churn audit, PR #46, merge `ddac456`.
  - `SYT-010H-C`: docs/context compaction, PR #47, merge `b5e3f34`.
  - `SYT-010H-D`: runtime video binding hardening, PR #48.
  - `SYT-010H-E`: Search modern lockup selector fixture hardening, PR #50.
  - `SYT-010H-F`: grid-hover watch recommendation selector organization, PR #54.
- Active serial lane: none after PR #55 integration; next state is human RC QA.
- GitHub issues: #10 open; #36/#38/#31 closed; #8 paused.
- Recent merged swarm docs/code PRs: #39 integration record, #40 context repair, #41 burst capacity, #42 planner registration, #43 SYT-010H lane plan, #44 batch registration, #45 settings tests, #46 selector/runtime audit, #47 docs compaction, #48 runtime video binding, #50 Search lockup fixtures, #54 grid-hover organization, #55 RC checklist.
- Do not route next: #8 enhanced Home/Search hover grow research unless the user explicitly reopens that gate.

## Hot Files

- Controller routing: `docs/swarm/controller-directives.md`
- Current state: `docs/swarm/current-state.md`
- Task queue: `docs/swarm/task-board.md`
- Agent capacity: `docs/swarm/agent-registry.md`
- GitHub policy/state: `docs/swarm/github.md`
- Active lane handoff: `docs/swarm/handoffs/SYT-RC-001.md`
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
- `SYT-036`/`SYT-010H` docs repairs -> PRs #39/#40/#41/#42/#43/#44/#47, through docs compaction
- `SYT-010H-A` -> PR #45, merge `ce09953`, refs #10
- `SYT-010H-B` -> PR #46, merge `ddac456`, refs #10
- `SYT-010H-D` -> PR #48, refs #10
- `SYT-010H-E` -> PR #50, refs #10
- `SYT-010H-F` -> PR #54, refs #10

## Next Safe Controller Action

Request `SYT-RC-001` human RC QA using `docs/swarm/handoffs/SYT-RC-001.md`. `npm run validate:all` passed on clean `main` after PR #55. Do not release, bump version, tag, close #10, or launch #8 hover research without explicit user approval or the checklist's stated gate.
