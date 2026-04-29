# GitHub Workflow

Use this file to record the repo's GitHub status and autonomous PR policy.

## Repository

- Owner: cryptoteatime
- Name: simple-yt-tweaks
- Visibility: public
- Remote: `https://github.com/cryptoteatime/simple-yt-tweaks.git`
- Default branch: `main`
- GitHub status: LINKED

## Autonomy

- Repo creation: not applicable, existing remote
- Push permission: APPROVED
- PR permission: APPROVED
- Merge permission: APPROVED_WITH_CHECKS

## Branch And PR Policy

- Work happens on `swarm/<task-id>-<short-slug>` branches.
- Runners push task branches when checks pass.
- Runners open draft PRs for issue work when useful.
- Every PR body must include a `How to test / what to tell the controller` section with:
  - human review requested: `yes` or `no`
  - local commands or preview URL(s)
  - expected result
  - exact feedback format when human feedback is requested
- Reviewers review the branch/PR and report `Needs Fixes`, `Ready to Integrate`, or `Blocked`.
- Integrators merge through PR only after checks pass, review is `Ready to Integrate`, conflicts are resolved, and any required human acceptance checklist is passed or explicitly waived here.
- Controller-owned docs-only repair PRs may be opened and merged when the diff is docs-only, `git diff --check` passes, no human gate is required, and the PR body has controller test instructions.
- Direct pushes to `main` are not allowed unless a repo-specific emergency is explicitly documented.

## Human Acceptance Gate

- Required for: release candidate, high-risk live YouTube behavior, #8 visual hover preview implementation, or explicit reviewer request.
- Required before merge: no for routine docs/test/hardening PRs; yes for release candidates and high-risk browser behavior.
- Who can mark passed: user for human QA; reviewer/integrator for routine agent checks.
- Pass message format: `Human QA passed for <TASK-ID or PR URL>: <notes>`
- Fail message format: `Human QA failed for <TASK-ID or PR URL>: <steps and observed problem>`

## Active Pull Requests

| Task ID | Branch | PR | Status | Owner | Notes |
| --- | --- | --- | --- | --- | --- |
| none | none | none | none | none | none |

## Setup Log

- 2026-04-29: Existing remote and GitHub auth verified. Open issues #8 and #10 confirmed. Repo visibility discovered as public.
- 2026-04-29: Opened draft PR #11 for `SYT-CTL-001`.
- 2026-04-29: PR #11 squash-merged for `SYT-CTL-001`.
- 2026-04-29: PR #12 squash-merged for `SYT-010A`; branch cleanup completed.
