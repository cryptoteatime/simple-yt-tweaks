# Swarm Archive Reference Map

This archive keeps completed-lane history out of hot controller context while preserving recovery paths.

## How To Recover Full History

Use Git history for the file before the 2026-06-10 compaction commit:

```bash
git log -- docs/swarm/handoffs/<TASK-ID>.md
git show <commit-before-compaction>:docs/swarm/handoffs/<TASK-ID>.md
```

GitHub PR bodies and reviews remain the preferred public history for completed work.

## Completed Lane Map

| Task | Public Reference | Merge / Result | Hot Stub |
| --- | --- | --- | --- |
| `SYT-CTL-001` | PR #11 | `676efc8`, repo-local swarm packet integrated | `docs/swarm/handoffs/SYT-CTL-001.md` |
| `SYT-010A` | PR #12 | `59ec975`, fixture coverage hardening integrated | `docs/swarm/handoffs/SYT-010A.md` |
| `SYT-010B` | PR #14 | `5675059`, settings parity validation hardening integrated | `docs/swarm/handoffs/SYT-010B.md` |
| `SYT-010C` | PR #16 | `0fca6c3`, release-candidate process docs integrated | `docs/swarm/handoffs/SYT-010C.md` |
| `SYT-010D` | PR #18 | `88f0a91`, helper unit tests integrated | `docs/swarm/handoffs/SYT-010D.md` |

## Active / Deferred Work

| Task | Status | Reference |
| --- | --- | --- |
| `SYT-021` | Active, PR #22 Needs Review | `docs/swarm/handoffs/SYT-021.md` |
| `SYT-008A` | Paused future research | `docs/swarm/handoffs/SYT-008A.md` |
| `SYT-010E` | Backlog code hardening | `docs/swarm/task-board.md` |
| `SYT-RC-001` | Backlog release candidate checklist | `docs/swarm/task-board.md` |

