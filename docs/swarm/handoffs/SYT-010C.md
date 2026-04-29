# SYT-010C: Release-Candidate Process Smoothing

## State

- Status: Proposed
- Role: Planner/Runner
- Repo: Simple YT Tweaks
- Branch: `swarm/syt-010c-rc-process`
- Owner: Unassigned
- Created: 2026-04-29
- Updated: 2026-04-29

## Goal

Make the next release-candidate process smoother and less dependent on ad hoc chat memory.

## Scope

- Document release-candidate gates in `DEVELOPMENT.md` and swarm docs.
- Define when to run fixture tests, live smoke, package validation, and human QA.
- Add scripts only if a clear repeatable command is missing.

## Non-Scope

- Do not bump version or create a release.
- Do not change product behavior.
- Do not edit Web Store assets unless a future release issue explicitly asks.

## Dependencies

- Prefer waiting for `SYT-010A` so the RC process references accurate test coverage.

## Lane Metadata

- Parallel-safe: yes with source-free docs lanes if capacity is raised.
- Serial-required: no.
- Depends-on: `SYT-010A` preferred.
- Conflict-risk: low/medium; release docs and package scripts.
- Shared coordination docs allowed: this handoff only unless controller assigns more.

## Verification

| Check | Result | Notes |
| --- | --- | --- |
| `git diff --check` | Not run for this lane yet | Required for docs-only changes. |
| `npm run validate:all` | Not run for this lane yet | Required if scripts or release commands change. |

## Human Acceptance Checklist

- Required before merge: No for process docs; yes before an actual release candidate is shipped.

## Next Handoff

- Next role: Planner/Runner after `SYT-010A`.
- Next action: Turn current release steps into a controller-friendly RC checklist.
- Branch/worktree cleanup needed after merge: yes.
- Copy-ready prompt:

```text
Run Simple YT Tweaks SYT-010C after SYT-010A is integrated or when the controller asks for RC process docs.

Repo: /Users/d4ngl/Git Repos/Codex/simple-yt-tweaks
Create branch: swarm/syt-010c-rc-process

Read the swarm docs and docs/swarm/handoffs/SYT-010C.md. Document a release-candidate gate that uses fixture tests first, optional live smoke only when useful, package validation, and human QA only for RC behavior. Do not bump version or release.
```
