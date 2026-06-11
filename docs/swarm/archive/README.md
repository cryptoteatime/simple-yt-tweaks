# Swarm Archive Reference Map

This archive keeps completed-lane history out of hot controller context while preserving recovery paths.

## How To Recover Full History

Use Git history for the handoff before the relevant compaction commit:

```bash
git log -- docs/swarm/handoffs/<TASK-ID>.md
git show <commit-before-compaction>:docs/swarm/handoffs/<TASK-ID>.md
```

GitHub PR bodies, reviews, and issue comments remain the preferred public history for completed work.

## Completed Lane Map

| Task | Public Reference | Merge / Result | Hot Stub |
| --- | --- | --- | --- |
| `SYT-CTL-001` | PR #11 | `676efc8`, swarm packet integrated | `docs/swarm/handoffs/SYT-CTL-001.md` |
| `SYT-010A` | PR #12 | `59ec975`, fixture coverage hardening integrated | `docs/swarm/handoffs/SYT-010A.md` |
| `SYT-010B` | PR #14 | `5675059`, settings parity validation hardening integrated | `docs/swarm/handoffs/SYT-010B.md` |
| `SYT-010C` | PR #16 | `0fca6c3`, release-candidate process docs integrated | `docs/swarm/handoffs/SYT-010C.md` |
| `SYT-010D` | PR #18 | `88f0a91`, helper unit tests integrated | `docs/swarm/handoffs/SYT-010D.md` |
| `SYT-021` | PR #22 / issue #21 | `8f90ef1`, native hover SPA regression integrated | `docs/swarm/handoffs/SYT-021.md` |
| `SYT-010E` | PR #24 / issue #10 | `fae4e5d`, grid-hover selector hardening integrated | `docs/swarm/handoffs/SYT-010E.md` |
| `SYT-010F` | PRs #26/#28/#29 / issue #10 | `66d756f` planning, `fa07c18` implementation, `6580065` docs follow-up | `docs/swarm/handoffs/SYT-010F.md` |
| `SYT-031` | PR #32 / issue #31 | `8e881c9`, Home native hover autoplay regression integrated | `docs/swarm/handoffs/SYT-031.md` |
| `SYT-010G` | PR #34 / issue #10 | `99156b5`, fullscreen player UI geometry hardening integrated | `docs/swarm/handoffs/SYT-010G.md` |
| `SYT-036` / `SYT-038` | PR #37 / issues #36/#38 | `342854f`, Home hover lifecycle and live Theater/chat fixes integrated | `docs/swarm/handoffs/SYT-036.md` |
| `SYT-036` integration record | PR #39 | `969c3b7`, post-integration state recorded | `docs/swarm/context-map.md`, `docs/swarm/task-board.md` |
| `SYT-010H` setup | PRs #40/#41/#42/#43/#44 / issue #10 | context repair, burst capacity, planner registration, lane map, and batch registration integrated through `2f991ef` | `docs/swarm/handoffs/SYT-010H.md` |
| `SYT-010H-A` | PR #45 / issue #10 | `ce09953`, settings/popup coverage integrated | `docs/swarm/handoffs/SYT-010H.md` |
| `SYT-010H-B` | PR #46 / issue #10 | `ddac456`, selector/runtime churn audit integrated | `docs/swarm/handoffs/SYT-010H-B.md` |
| `SYT-010H-C` | PR #47 / issue #10 | docs/context compaction integrated | `docs/swarm/context-map.md` |

## Active / Deferred Work

| Task | Status | Reference |
| --- | --- | --- |
| `SYT-010H-D` | Ready serial runtime apply-loop/polling lane | `docs/swarm/handoffs/SYT-010H.md`, `docs/swarm/handoffs/SYT-010H-B.md` |
| `SYT-010H-E/F` | Hold until D or selector-fixture decision | `docs/swarm/handoffs/SYT-010H.md` |
| `SYT-008A` | Closed as not planned; native Home/Search hover accepted | `docs/swarm/handoffs/SYT-008A.md` |
| `SYT-RC-001` | Backlog release candidate checklist | `docs/swarm/task-board.md` |
