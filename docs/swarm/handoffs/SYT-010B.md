# SYT-010B: Settings Parity And Source-Of-Truth Hardening

## State

- Status: Ready to Integrate
- Role: Integrator
- Repo: Simple YT Tweaks
- Branch: `swarm/syt-010b-settings-hardening`
- Owner: Codex Controller
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

- Chose conservative validation hardening with type-level consolidation only.
- Tried full runtime consolidation of content settings onto `src/shared/settings.ts`; fixture E2E exposed the expected bundling risk because Vite emitted a shared `dist/assets/settings.js` chunk and the content script stopped behaving as a self-contained extension script. Reverted that approach before finalizing.
- Kept content runtime defaults, `SETTING_KEYS`, `loadSettings`, and `normalizeSettings` local to preserve self-contained content-script output.
- Removed duplicated content type unions by re-exporting/importing shared setting types only; TypeScript erases these imports from the content bundle.
- Strengthened `scripts/validate-extension.mjs` so validation now checks shared setting definitions against defaults, verifies parent keys/options, enforces the `floatingMiniPlayer` alias behavior, requires content type re-exports from shared, and keeps content runtime defaults/keys in parity with shared settings.

## Work Log

- 2026-04-29: Lane seeded during bootstrap.
- 2026-04-29: Controller opened task branch `swarm/syt-010b-settings-hardening` for runner launch after `SYT-010A` integration.
- 2026-04-29: Controller routed Senior Runner Linnaeus (`019dd952-fc1f-7692-878b-cc0cbaa13d42`) for implementation.
- 2026-04-29: Implemented type-level settings source-of-truth hardening and stronger validation checks; no settings defaults, storage keys, labels, or user-facing behavior changed.
- 2026-04-29: Controller routed Reviewer Hypatia (`019dd9b0-7e98-7983-88de-9463e804000e`) for PR #14 review.
- 2026-04-29: Reviewer Hypatia reported no findings and marked PR #14 Ready to Integrate.

## Verification

- Verification tier: focused runner checks and full gate.

| Check | Result | Notes |
| --- | --- | --- |
| `npm run typecheck` | Passed | Focused check after settings/validation edits. |
| `npm run lint` | Passed | Focused check after settings/validation edits. |
| `npm run test:e2e` | Passed | 8 fixture tests passed after conservative type-only sharing adjustment. A prior full runtime consolidation attempt failed fixture E2E and was abandoned. |
| `npm run validate:all` | Passed | Includes typecheck, lint, `git diff --check`, package validation, packaged validation, and 8 fixture tests. |
| `npm run validate` | Passed | Reviewer targeted check. |
| `npm run build` | Passed | Reviewer verified content build emitted only `dist/content/content.js` for the content script. |
| `rg "^\\s*(import\|export)\\s\|shared/settings" dist/content/content.js` | Passed | Reviewer found no runtime module import/export or shared settings reference. |

## Human Acceptance Checklist

- Required before merge: No, unless user-facing settings behavior changes.
- URL(s): https://github.com/cryptoteatime/simple-yt-tweaks/pull/14
- Who should test: Reviewer/Integrator
- Expected result: no behavior drift, settings defaults/storage parity preserved.

## Blockers / Risks

- Full runtime consolidation is not safe with the current Vite chunking setup unless build config changes also guarantee a self-contained content script.
- Remaining duplication is intentional runtime duplication for content-script bundling safety; validation now guards parity.

## Review Result

- Reviewer: Hypatia (`019dd9b0-7e98-7983-88de-9463e804000e`)
- Verdict: Ready to Integrate
- Findings: none
- Targeted checks:
  - `git diff --check origin/main...HEAD`: passed
  - `npm run validate`: passed
  - `npm run build`: passed
  - `rg "^\\s*(import\|export)\\s\|shared/settings" dist/content/content.js`: no runtime module import/export or shared settings reference found
  - `npm run test:e2e`: passed, 8 fixture tests
- Human QA requested: no

## Next Handoff

- Next role: Integrator.
- Next action: confirm PR #14 is still mergeable, run `npm run validate:all`, mark the draft PR ready if needed, merge through the GitHub PR path, sync `main`, and clean branches when safe.
- Branch/worktree cleanup needed after merge: yes.
- Copy-ready prompt:

```text
Run Simple YT Tweaks SYT-010B after SYT-010A is integrated.

Repo: /Users/d4ngl/Git Repos/Codex/simple-yt-tweaks
Create branch: swarm/syt-010b-settings-hardening

Read the swarm docs and docs/swarm/handoffs/SYT-010B.md. Focus on settings parity/source-of-truth hardening. Preserve existing defaults and user-facing behavior. Prefer strengthening validation if consolidation creates bundling risk. Run npm run validate:all before PR.
```
