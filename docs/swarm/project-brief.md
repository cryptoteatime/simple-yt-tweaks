# Project Brief

## Project Identity

- Name: Simple YT Tweaks
- Folder: `/Users/d4ngl/Git Repos/Codex/simple-yt-tweaks`
- Status: existing repo, active post-v0.3.0 hardening
- Owner / GitHub Org: `cryptoteatime`
- Primary Controller Chat: Simple YT Tweaks Codex controller

## Vision

Make Simple YT Tweaks a small, dependable Chrome/Brave extension with enough automated browser-extension verification that routine hardening and bug fixes can be handled by agents through scoped PRs instead of requiring the user to manually retest every pass.

## Target Users

- Primary: the repo owner using Brave/Chrome on YouTube.
- Secondary: Chrome/Brave users who want focused YouTube cleanup without a large extension surface.

## First Useful Milestone

- Goal: post-v0.3.0 hardening and autonomous controller setup.
- Success looks like: fixture tests cover current regression-prone behavior, #8/#10 are decomposed into scoped lanes, PRs include controller test instructions, and `npm run validate:all` is the normal gate.
- Human QA required before merge: no for routine docs/test/hardening PRs; yes for release-candidate behavior and high-risk live YouTube behavior.

## Non-Goals And Constraints

- Do not reintroduce enhanced home/search hover under #10.
- Do not rely on live YouTube as the primary verification gate.
- Do not bump version, tag, release, or edit Web Store assets unless a release-candidate lane explicitly asks for it.
- Keep private handoff notes and screenshots out of GitHub.
- Preserve native YouTube autoplay and click behavior.
- Keep fixture tests deterministic and repo-owned.

## Existing Facts

- Tech stack: Manifest V3 extension, TypeScript, Vite, Playwright, ESLint.
- Package manager: npm with `package-lock.json`.
- Runtime preflight: Node `v25.9.0`, npm `11.12.1`.
- Key scripts:
  - `npm run typecheck`
  - `npm run lint`
  - `npm run validate`
  - `npm run package`
  - `npm run test:e2e`
  - `npm run test:e2e:live`
  - `npm run validate:all`
- Tests:
  - Playwright fixture project routes local YouTube-like pages.
  - Optional live smoke project runs against real YouTube in an isolated Chromium profile.
- Git status at discovery: clean `main...origin/main`.
- Remote: `https://github.com/cryptoteatime/simple-yt-tweaks.git`.
- GitHub repository: `cryptoteatime/simple-yt-tweaks`, public, default branch `main`.
- Open issues at discovery:
  - #8 `Revisit enhanced home/search grid hover preview`
  - #10 `Post-harness code hardening pass`
- Browser tooling:
  - Repo-owned Playwright is available and passing.
  - Chrome-for-Testing-backed `agent-browser` wrapper opened/closed `about:blank`.
- Validation during bootstrap:
  - `npm run validate:all`: pass.

## Assumptions

- Existing public GitHub visibility is intentional; do not change repository visibility as part of bootstrap.
- The controller may open task branches and draft PRs under the existing remote.
- Routine test/docs/hardening PRs do not need human QA.
- Human QA is still valuable for release candidates and visual live-site behavior where fixtures cannot prove YouTube experiment compatibility.

## Material Questions

No blocking material questions for the current setup. Defaults are safe:

| Question | Why It Matters | Default If Unanswered | Status |
| --- | --- | --- | --- |
| Should repo visibility remain public? | Bootstrap template defaults private, but the existing repo is public. | Keep existing visibility unchanged. | Deferred, non-blocking |
| Should the 90-minute heartbeat be created now? | A real automation should wait until the docs PR is merged and state is clean. | Record heartbeat as proposed, create after clean integration. | Deferred, non-blocking |

## Milestone Sequence

| Milestone | Goal | Human QA Gate | Notes |
| --- | --- | --- | --- |
| M0 | Land repo-local swarm packet | No | Docs-only PR, validates with `git diff --check`. |
| M1 | Test harness coverage audit | No | Ensure fixtures catch #10 hardening risks and guard #8 prerequisites. |
| M2 | Code hardening slices under #10 | No by default | Start with settings parity/source-of-truth and pure helper tests. |
| M3 | Release-candidate workflow smoothing | Yes at final RC | Make validation/package/release checklist controller-friendly. |
| M4 | Future #8 hover research | Yes before implementation merge | Treat as research/prototype because live YouTube preview behavior is high risk. |

## Candidate Parallel Lanes

| Lane | Role | Write Scope | Parallel-Safe | Serial-Required | Depends On | Conflict Risk | Can Run In Parallel With |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `SYT-CTL-001` | Controller | `SWARM.md`, `docs/swarm/**` | No, controller-owned docs | Yes during bootstrap | none | Low, docs only | none under capacity 1 |
| `SYT-010A` | Planner/Runner | `tests/e2e/**`, `DEVELOPMENT.md`, handoff | Yes with docs-only lanes if capacity raised | No | `SYT-CTL-001` merged | Medium: fixture contracts | none by default |
| `SYT-010B` | Senior Runner | `src/shared/settings.ts`, `src/content/settings.ts`, `scripts/validate-extension.mjs`, tests | No while settings contracts change | Yes | `SYT-010A` coverage decision | High: shared settings contracts | none |
| `SYT-010C` | Planner/Runner | `DEVELOPMENT.md`, `docs/swarm/**`, package scripts if needed | Yes with source-free docs if capacity raised | No | `SYT-CTL-001`; ideally after `SYT-010A` | Low/Medium | none by default |
| `SYT-008A` | Planner | issue #8 research notes, fixtures/prototype branch only | No with #10 source work | Yes until research gate passes | `SYT-010A`; user/product gate before implementation | High: live YouTube preview lifecycle | none |

## Verification Strategy

- Unit/type/static checks: `npm run typecheck`, `npm run lint`, `git diff --check`.
- Extension validation/package: `npm run validate`, `npm run package`.
- Integration/e2e checks: `npm run test:e2e`.
- Full gate: `npm run validate:all`.
- Optional live smoke: `npm run test:e2e:live` for RC or live-site risk only.
- Browser QA: Playwright fixtures first; Browser Use or `agent-browser` only for supplemental visual/live inspection.
- Human milestone QA: release candidates and #8 visual behavior.
- Runner verification tier: focused task checks.
- Reviewer verification tier: targeted checks based on changed risk.
- Integrator verification tier: full `npm run validate:all` before merge for non-docs/checkpoint work.

## Next Controller Decision

`SYT-010D` is integrated. The next safe controller action is to route `SYT-008A` as a research-only gate for #8, with no runtime hover implementation until the plan and human/product gate are explicit.
