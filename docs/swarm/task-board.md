# Task Board

Use this file as the repo-local queue. Keep entries short and route details to handoff files.

## Status Values

`Proposed`, `Ready`, `In Progress`, `Needs Review`, `Needs Fixes`, `Ready for Human QA`, `Ready to Integrate`, `Integrated`, `Blocked`, `Paused`

## Planning Gate

- Project brief: Ready
- Material questions: Deferred, not blocking
- Current milestone plan: `SYT-WS-001` Web Store readiness polish under #60.
- Implementation dispatch: planning/docs setup first, then scoped code/assets lanes.

## Active Tasks

| Task ID | Title | Role | Status | Branch | Scope | Parallel | Depends On | Conflict Risk | Handoff | PR |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| none | none | none | none | none | none | none | none | none | none |

## Hold / Future Tasks

| Task ID | Title | Status | Release Condition |
| --- | --- | --- | --- |
| `SYT-010H-D` | Runtime apply-loop and polling hardening | Integrated | PR #48; event/apply-loop video binding hardening. |
| `SYT-010H-E` | Selector helper and fixture gap hardening | Integrated | PR #50; modern Search lockup fixture coverage. |
| `SYT-010H-F` | Grid-hover watch recommendation selector organization cleanup | Integrated | PR #54; one-module selector organization and unit coverage. |
| `SYT-RC-002` | Release-candidate polish after #10 hardening | Backlog | After `SYT-010H` and follow-up fixes are integrated. |
| `SYT-WS-001B` | Final code polish audit and low-risk cleanup | Deferred | Code audit found no Web Store blocker; broad runtime cleanup is deferred until after submission because behavior is stable. |

## Completed / Archived

Completed lanes are stubs in `docs/swarm/handoffs/` and indexed in `docs/swarm/archive/README.md`.

| Task ID | Result |
| --- | --- |
| `SYT-CTL-001` | PR #11 merged at `676efc8` |
| `SYT-010A` | PR #12 merged at `59ec975` |
| `SYT-010B` | PR #14 merged at `5675059` |
| `SYT-010C` | PR #16 merged at `0fca6c3` |
| `SYT-010D` | PR #18 merged at `88f0a91` |
| `SYT-021` | PR #22 merged at `8f90ef1`; issue #21 closed |
| `SYT-010E` | PR #24 merged at `fae4e5d` |
| `SYT-010F` | PRs #26/#28/#29 merged through `6580065` |
| `SYT-031` | PR #32 merged at `8e881c9`; issue #31 closed |
| `SYT-010G` | PR #34 merged at `99156b5` |
| `SYT-036` / `SYT-038` | PR #37 merged at `342854f`; issues #36/#38 closed |
| `SYT-010H` planning/docs setup | PRs #39/#40/#41/#42/#43/#44 merged through `2f991ef` |
| `SYT-010H-A` | PR #45 merged at `ce09953` |
| `SYT-010H-B` | PR #46 merged at `ddac456` |
| `SYT-010H-C` | PR #47 merged at `b5e3f34` |
| `SYT-010H-D` | PR #48 merged; runtime video binding hardening |
| `SYT-010H-E` | PR #50 merged; Search modern lockup selector fixture hardening |
| `SYT-010H-F` | PR #54 merged; grid-hover watch recommendation selector organization |
| `SYT-RC-001` | PR #55/#56 merged; `validate:all` passed; human QA passed; issue #10 closed |
| `SYT-008A` | PR #20 closed; issue #8 closed as not planned; native Home/Search hover remains accepted |
| `SYT-WS-001A` | PR #63 merged at `65a52f7`; refreshed current store/repo graphics, popup captures, asset scripts, and validation |
| `SYT-WS-001C` | Final readiness checks passed on clean `main`; heartbeat should stop after user-facing final handoff |

## Review / Integration Queues

| Queue | Task ID | Branch | Next Action |
| --- | --- | --- | --- |
| Ready For Review | none | none | none |
| Ready To Integrate | none | none | none |
| Blocked | none | none | none |

## Human QA

| Task ID | PR / URL | Status | Required Before Merge | Exact Pass/Fail Message |
| --- | --- | --- | --- | --- |
| `SYT-RC-001` | #55/#56 | Passed | Complete | `Human QA passed for SYT-RC-001: looks solid mate... all is working and is well it appears.` |

## Controller Notes

- Capacity returns to serial for runtime implementation after the A/B/C burst.
- Runtime source changes, review, integration, merge conflicts, and release-candidate work stay serial.
- Current controller phase: #60 readiness polish. Keep first pass docs/planning-only, then route scoped lanes. No version/release/Web Store submission until explicit approval.
- `SYT-WS-001` is complete from the automation side. Close #60, stop/delete the heartbeat, and give the user final Web Store/release steps.
- Do not route Home/Search hover research unless the user opens a fresh issue.
