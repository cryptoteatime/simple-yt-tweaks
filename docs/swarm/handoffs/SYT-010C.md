# SYT-010C: Release-Candidate Process Smoothing

## State

- Status: Ready to Integrate
- Role: Integrator
- Repo: Simple YT Tweaks
- Branch: `swarm/syt-010c-rc-process`
- PR: https://github.com/cryptoteatime/simple-yt-tweaks/pull/16
- Owner: Codex Controller
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

## Controller-Friendly RC Gate

The release-candidate gate is now documented in `DEVELOPMENT.md` as a fixture-first sequence:

1. Confirm candidate scope and release-blocking issues.
2. Update public release notes after scope is known; keep private Web Store notes out of the repo.
3. Run `npm run version:set -- <next-version>` only for an actual RC or Web Store candidate.
4. Run `npm run validate:all` as the stable automated gate. This covers typecheck, lint, `git diff --check`, package creation, packaged validation, and deterministic fixture E2E.
5. Run `npm run test:e2e:live` only for YouTube-facing behavior changes, explicit reviewer/controller live-site confidence, or final manual acceptance. Inconclusive live smoke should be recorded without replacing fixture/package validation.
6. Require human QA before publishing an RC or Web Store upload. Expected controller messages:

```text
Human QA passed for SYT-RC-001: <browser/version, package version, notes>
Human QA failed for SYT-RC-001: <steps and observed problem>
```

7. Require explicit release approval before tagging, creating a GitHub release, or preparing Web Store upload artifacts. Approval should name the version, package path, and publish/draft/stop direction.

## Files Changed

- `DEVELOPMENT.md`: Added the release-candidate gate, live-smoke rule, human QA message format, and controller PR checklist.
- `docs/swarm/handoffs/SYT-010C.md`: Recorded the gate, decisions, verification, and next role.

## Decisions Made

- No script changes were needed. Existing commands already cover the repeatable gate:
  - `npm run validate:all`
  - `npm run package`
  - `npm run validate:packaged`
  - `npm run test:e2e:live`
  - `npm run version:set -- <next-version>`
- `npm run validate:all` remains the stable fixture-first RC baseline.
- Live smoke remains optional and supplemental because live YouTube can be inconclusive for reasons outside the extension.
- Human QA is required for an actual RC/release but not for this docs-only process PR.
- Version bump, tag, GitHub release, and Web Store upload remain blocked until explicit release approval.

## Verification

| Check | Result | Notes |
| --- | --- | --- |
| `git diff --check` | Passed | Docs-only whitespace check passed. |
| `git diff --check origin/main...HEAD` | Passed | Reviewer targeted whitespace check passed. |
| `npm run validate:all` | Not run | Not required because no scripts/package/source files changed. |
| Draft PR | Opened | https://github.com/cryptoteatime/simple-yt-tweaks/pull/16 |

## Work Log

- 2026-04-29: Controller opened task branch `swarm/syt-010c-rc-process` for release-candidate process smoothing after `SYT-010B` integration.
- 2026-04-29: Controller routed Planner/Runner Ampere (`019dda63-8fdc-7531-b649-2a91669070c4`) for implementation.
- 2026-04-29: Added docs-only RC gate to `DEVELOPMENT.md`; kept scripts unchanged because the repo already has repeatable validation/package/live-smoke commands.
- 2026-04-29: Opened draft PR #16 for review.
- 2026-04-29: Controller reconciled Ampere completion and queued Reviewer for PR #16.
- 2026-04-29: Controller routed Reviewer Boole (`019ddabc-9d77-7692-81b6-80ff60498621`) for PR #16 review.
- 2026-04-29: Reviewer Boole reported no findings and marked PR #16 Ready to Integrate.

## Human Acceptance Checklist

- Required before merge: No for this docs-only process PR.
- Required before release: Yes before an actual release candidate is shipped or uploaded.
- Expected release QA pass/fail format is documented in `DEVELOPMENT.md`.

## Blockers / Risks

- No blockers for review.
- Live YouTube smoke can be inconclusive; the documented gate requires recording the reason and falling back to fixture/package validation plus human QA.
- This lane intentionally did not validate or change Web Store submission assets.

## Review Result

- Reviewer: Boole (`019ddabc-9d77-7692-81b6-80ff60498621`)
- Verdict: Ready to Integrate
- Findings: none
- Targeted checks:
  - `gh pr view 16 --json ...`: PR open draft, base `main`, head `swarm/syt-010c-rc-process`, merge state `CLEAN`
  - `git fetch origin main swarm/syt-010c-rc-process --prune`: passed
  - `git diff --name-status origin/main...HEAD`: only `DEVELOPMENT.md` and swarm docs changed
  - `git diff --check origin/main...HEAD`: passed
  - Package scripts inspected: `validate:all` already runs typecheck, lint, `git diff --check`, package, packaged validation, and fixture Playwright
- Human QA requested: no for this docs-only process PR

## Next Handoff

- Next role: Integrator.
- Next action: confirm PR #16 is still mergeable, mark the draft PR ready if needed, merge through the GitHub PR path, sync `main`, and clean branches when safe.
- Branch/worktree cleanup needed after merge: yes.
- Copy-ready prompt:

```text
Run Simple YT Tweaks SYT-010C after SYT-010A is integrated or when the controller asks for RC process docs.

Repo: /Users/d4ngl/Git Repos/Codex/simple-yt-tweaks
Create branch: swarm/syt-010c-rc-process

Read the swarm docs and docs/swarm/handoffs/SYT-010C.md. Document a release-candidate gate that uses fixture tests first, optional live smoke only when useful, package validation, and human QA only for RC behavior. Do not bump version or release.
```
