# Task Board

Use this file as the repo-local queue. Keep entries short and route details to handoff files.

## Status Values

`Proposed`, `Ready`, `In Progress`, `Needs Review`, `Needs Fixes`, `Ready for Human QA`, `Ready to Integrate`, `Integrated`, `Blocked`, `Paused`

## Planning Gate

- Project brief: Ready
- Material questions: Deferred, not blocking
- Current milestone plan: `SYT-010H` lane map integrated in PR #43; A/B/C/D are integrated through PR #48.
- Implementation dispatch: next source lane is serial `SYT-010H-E` selector helper and fixture gap hardening, after controller reconciliation.

## Active Tasks

| Task ID | Title | Role | Status | Branch | Scope | Parallel | Depends On | Conflict Risk | Handoff | PR |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `SYT-010H-A` | Settings, popup defaults, and persistence | Integrator | Integrated | `swarm/syt-010h-settings-popup` | settings/popup/defaults tests | parallel-safe with B/C while test-only | `SYT-010H` plan | medium | `docs/swarm/handoffs/SYT-010H.md` | #45 merged |
| `SYT-010H-B` | Selector accuracy and runtime churn audit | Integrator | Integrated | `swarm/syt-010h-selector-runtime-audit` | docs/audit; no production runtime edits | parallel-safe as audit-only | `SYT-010H` plan | low for audit, high for implementation | `docs/swarm/handoffs/SYT-010H-B.md` | #46 merged |
| `SYT-010H-C` | Swarm docs and context compaction | Integrator | Integrated | `swarm/syt-010h-docs-compaction` | compact hot swarm docs and completed handoff stubs | parallel-safe | `SYT-010H` plan | low/medium docs state | `docs/swarm/handoffs/SYT-010H.md` | #47 merged |
| `SYT-008A` | Enhanced Home/Search hover research gate | Planner | Paused | `swarm/syt-008a-hover-research` | #8 research, fixtures/prototype only | serial-required | user/product gate | high | `docs/swarm/handoffs/SYT-008A.md` | none |

## Hold / Future Tasks

| Task ID | Title | Status | Release Condition |
| --- | --- | --- | --- |
| `SYT-010H-D` | Runtime apply-loop and polling hardening | Integrated | PR #48; event/apply-loop video binding hardening. |
| `SYT-010H-E` | Selector helper and fixture gap hardening | In Progress | Archimedes is running on `swarm/syt-010h-selector-fixtures`; keep serial if touching runtime selectors. |
| `SYT-010H-F` | Theater/grid/sidebar organization cleanup | Proposed | Serial-only after coverage/audit lanes, one module per PR. |
| `SYT-RC-001` | Next release-candidate checklist | Backlog | After #10 hardening. Human QA required before release. |
| `SYT-RC-002` | Release-candidate polish after #10 hardening | Backlog | After `SYT-010H` and follow-up fixes are integrated. |

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

## Review / Integration Queues

| Queue | Task ID | Branch | Next Action |
| --- | --- | --- | --- |
| Ready For Review | none | none | none |
| Ready To Integrate | none | none | none |
| Blocked | none | none | none |

## Human QA

| Task ID | PR / URL | Status | Required Before Merge | Exact Pass/Fail Message |
| --- | --- | --- | --- | --- |
| `SYT-008A` | none | Not started | Yes before implementing visual hover behavior | `Human QA passed/failed for SYT-008A: <notes>` |
| `SYT-RC-001` | none | Not started | Yes before release | `Human QA passed/failed for SYT-RC-001: <notes>` |

## Controller Notes

- Capacity returns to serial for runtime implementation after the A/B/C burst.
- Runtime source changes, review, integration, merge conflicts, and release-candidate work stay serial.
- Current controller phase: wait for `SYT-010H-E` draft PR or blocker; do not spawn overlapping selector/runtime work.
- Do not route #8 unless the user explicitly reopens that gate.
