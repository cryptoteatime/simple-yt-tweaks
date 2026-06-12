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

- Required for: release candidate, high-risk live YouTube behavior, fresh visual hover preview implementation, or explicit reviewer request.
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
- 2026-04-29: Opened draft PR #14 for `SYT-010B`.
- 2026-04-29: PR #14 squash-merged for `SYT-010B`; branch cleanup completed.
- 2026-04-29: Opened draft PR #16 for `SYT-010C`.
- 2026-04-29: PR #16 squash-merged for `SYT-010C`; branch cleanup completed.
- 2026-04-29: PR #18 squash-merged for `SYT-010D`; branch cleanup completed.
- 2026-06-10: Opened issue #21 for native Home/Search hover preview stall after watch-to-Home SPA navigation and modern `#secondary yt-lockup-view-model` recommendation selector drift. Opened draft PR #22 from `swarm/syt-008b-native-hover-spa-regression`.
- 2026-06-10: PR #22 marked ready and squash-merged at `8f90ef1`; issue #21 auto-closed; remote/local task branch cleanup completed.
- 2026-06-10: PR #24 marked ready and squash-merged at `fae4e5d` for `SYT-010E`; issue #10 remains open; remote/local task branch cleanup completed.
- 2026-06-10: Opened draft PR #26 for docs-only `SYT-010F` planning; chosen target is Sticky Player hardening under issue #10.
- 2026-06-10: PR #26 marked ready and squash-merged at `66d756f`; issue #10 remains open; remote/local planning branch cleanup completed.
- 2026-06-10: PR #28 marked ready and squash-merged at `fa07c18` for `SYT-010F`; issue #10 remains open; remote/local task branch cleanup completed.
- 2026-06-10: PR #29 merged docs-only `SYT-010F` integration record at `6580065`; hot-state repair follows because controller docs still pointed at the completed runner lane.
- 2026-06-10: Opened issue #31 for the remaining Home native hover regression after watch-to-Home SPA navigation. Implemented `SYT-031` on `swarm/syt-031-home-hover-stationary-spa`; opened draft PR #32.
- 2026-06-10: PR #32 marked ready and squash-merged at `8e881c9`; issue #31 closed; remote task branch deleted by merge.
- 2026-06-10: Opened draft PR #34 for `SYT-010G` fullscreen/player UI geometry hardening under issue #10.
- 2026-06-10: PR #34 marked ready and squash-merged at `99156b5` for `SYT-010G`; issue #10 remains open; remote/local task branch cleanup completed.
- 2026-06-10: Opened issue #36 for Home hover previews leaving stale card states after watch-to-Home navigation. Opened draft PR #37 for `SYT-036`; after failed QA, final follow-up was verified in the Brave YouTube PWA on the header-hover -> logo/Home path.
- 2026-06-10: Opened issue #38 for live streams being squeezed in enhanced Theater mode when live chat overlay is enabled. Patched PR #37 to cover #38 after the user confirmed #36 Home autoplay worked; follow-up patch made the overlay `X` minimize to a right-edge restore tab instead of leaving YouTube's collapsed opaque chat overlay.
- 2026-06-11: User confirmed desired #36/#38 behavior is working and asked to proceed to polish/hardening. Keep PR #37 in review path, then integrate if clean before launching `SYT-010H` under #10.
- 2026-06-11: PR #37 marked ready and squash-merged at `342854f` after `npm run validate:all` passed. Issues #36 and #38 closed. Next GitHub work should be a `SYT-010H` polish/hardening branch under #10.
- 2026-06-11: PR #20 was closed and branch `swarm/syt-008a-hover-research` deleted. Issue #8 was closed as not planned because native YouTube Home/Search hover is the accepted direction.
- 2026-06-12: PR #63 squash-merged at `65a52f7` for `SYT-WS-001A`; remote branch cleanup completed by merge.
