# SYT-010B: Settings Parity And Source-Of-Truth Hardening

## State

- Status: Proposed
- Role: Senior Runner
- Repo: Simple YT Tweaks
- Branch: `swarm/syt-010b-settings-hardening`
- Owner: Unassigned
- Created: 2026-04-29
- Updated: 2026-04-29

## Goal

Reduce settings-maintenance risk after fixture coverage is ready.

## Scope

- Review duplication between `src/shared/settings.ts` and `src/content/settings.ts`.
- Either consolidate safely or keep duplication and strengthen parity validation/tests.
- Preserve existing defaults and popup behavior.

## Non-Scope

- Do not change setting defaults.
- Do not rename user-facing settings unless a separate product decision approves it.
- Do not edit unrelated modules.

## Dependencies

- `SYT-010A` should complete first so behavior coverage is stronger.

## Lane Metadata

- Parallel-safe: no by default.
- Serial-required: yes; settings contracts touch popup, content, validation, and storage.
- Depends-on: `SYT-010A`.
- Conflict-risk: high; `src/shared/settings.ts`, `src/content/settings.ts`, popup rendering, validation script.
- Shared coordination docs allowed: only this handoff unless controller assigns more.

## Plan

1. Inspect bundling constraints around shared settings in popup and content script.
2. Decide whether true consolidation is worth the risk.
3. If consolidation is not clean, add stronger validation or tests for parity.
4. Run focused checks and full `npm run validate:all`.

## Files / Areas

- `src/shared/settings.ts`
- `src/content/settings.ts`
- `src/popup/popup.ts`
- `scripts/validate-extension.mjs`
- `tests/e2e/**` if needed

## Decisions

- Conservative default: strengthen parity checks before attempting a source-of-truth refactor.

## Work Log

- 2026-04-29: Lane seeded during bootstrap.

## Verification

- Verification tier: focused runner checks and full gate.

| Check | Result | Notes |
| --- | --- | --- |
| `npm run typecheck` | Not run for this lane yet | Required. |
| `npm run lint` | Not run for this lane yet | Required. |
| `npm run test:e2e` | Not run for this lane yet | Required if settings or popup behavior changes. |
| `npm run validate:all` | Not run for this lane yet | Required before PR. |

## Human Acceptance Checklist

- Required before merge: No, unless user-facing settings behavior changes.
- URL(s): PR TBD
- Who should test: Reviewer/Integrator
- Expected result: no behavior drift, settings defaults/storage parity preserved.

## Blockers / Risks

- Consolidating settings may affect content-script bundling. Stop and report if that becomes unclear.

## Next Handoff

- Next role: Senior Runner after `SYT-010A`.
- Next action: choose conservative parity hardening or safe consolidation.
- Branch/worktree cleanup needed after merge: yes.
- Copy-ready prompt:

```text
Run Simple YT Tweaks SYT-010B after SYT-010A is integrated.

Repo: /Users/d4ngl/Git Repos/Codex/simple-yt-tweaks
Create branch: swarm/syt-010b-settings-hardening

Read the swarm docs and docs/swarm/handoffs/SYT-010B.md. Focus on settings parity/source-of-truth hardening. Preserve existing defaults and user-facing behavior. Prefer strengthening validation if consolidation creates bundling risk. Run npm run validate:all before PR.
```
