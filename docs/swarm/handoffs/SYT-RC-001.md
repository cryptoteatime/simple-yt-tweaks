# SYT-RC-001: Release-Candidate Checklist And #10 Completion Decision

## Status

- Task ID: `SYT-RC-001`
- GitHub issue: #10 closed after RC QA pass
- Branch: `main` after PR #55 integration
- PR: #55 merged at `82188cf`
- State: Integrated / Human QA passed
- Role: Controller / release-candidate planner
- Last updated: 2026-06-11 01:36 EDT

## Goal

Move the repo from post-v0.3.0 hardening into a release-candidate validation gate without changing runtime behavior, bumping the extension version, tagging a release, or updating Web Store assets.

## Scope

- Capture the final automated and human QA checklist for the next release-candidate pass.
- Record the controller decision for #10: implementation hardening lanes A-F are complete enough to stop routing new #10 work unless RC QA finds a concrete regression.
- Keep #8 enhanced Home/Search hover grow research paused.
- Keep release actions blocked until explicit user approval after RC QA.

## Non-Scope

- No production source edits.
- No test fixture edits unless a later RC failure requires them.
- No enhanced Home/Search hover grow, forced preview playback, or synthetic hover behavior.
- No version bump, tag, GitHub release, package upload, or Web Store asset update.
- The docs-only checklist PR did not close #10; #10 was closed only after human QA passed.

## #10 Completion Decision

`SYT-010H` completed the planned hardening lanes:

- A: settings, popup defaults, and persistence coverage.
- B: selector/runtime churn audit.
- C: hot docs/context compaction.
- D: runtime video binding hardening.
- E: modern Search lockup fixture coverage.
- F: grid-hover watch recommendation selector organization.

Decision: stop opening additional speculative #10 hardening lanes. The checklist PR was integrated, RC QA passed, and #10 was closed with a summary linking the merged hardening PRs and the RC checklist. If a later regression appears, file or route a new narrow issue for the concrete failure instead of reopening broad hardening.

Final result: user reported `Human QA passed for SYT-RC-001` on 2026-06-11. Issue #10 was closed with the hardening summary. No release, version bump, tag, package upload, Web Store asset update, or #8 restart was performed.

## Automated Gate

Run on clean `main` before asking for RC human QA or release approval:

- `npm run validate:all`
- `git status --short --branch`

Current result:

- 2026-06-11: `npm run validate:all` passed on clean `main` after PR #55.
- 2026-06-11: `git status --short --branch` returned clean `main` synced with `origin/main` before the post-integration docs repair branch.

Optional supplemental checks:

- `npm run test:e2e:live` only when a live YouTube path is directly relevant. Consent, captcha, network, or YouTube experiment failures are non-blocking if fixture checks pass and the limitation is recorded.
- Chrome-for-Testing or Brave PWA visual smoke only for release-candidate behavior, not as a replacement for repo-owned tests.

## Human QA Checklist

Use a freshly reloaded unpacked extension or the intended packaged build. The exact pass/fail response format is:

`Human QA passed for SYT-RC-001: <notes>`

or:

`Human QA failed for SYT-RC-001: <steps and observed problem>`

Current result:

- 2026-06-11: Human QA passed. User note: "looks solid mate... all is working and is well it appears."

### Popup And Settings

- Popup opens and shows version `0.3.0` until a release bump is explicitly approved.
- General, Sidebar, and Modes tabs are usable.
- Sticky Player defaults to on for a fresh/default settings load.
- Enhanced Grid Hover remains absent for Home/Search behavior.
- General > Feed Columns > Apply to Search persists and gates Search grid styling.
- Modes > Default > Recommended Hover Grow appears nested under the recommendations group and works.
- Modes > Theater > Recommended Hover Grow appears nested under the recommendations group and works.
- Theater > Hide Live Chat and Show Chat Overlay interact cleanly.
- Reset Tab resets only the current tab/pane expectations and preserves normal persistence behavior.

### Home Feed

- Native YouTube hover preview works after a fresh Home load.
- Native YouTube hover preview works after Home -> watch video -> hover hidden header -> YouTube logo/Home or sidebar Home -> Home.
- First-column Home cards autoplay on hover just like the other visible columns.
- No extension grow/highlight behavior appears on Home cards.
- Home grid has no blank sponsored-card holes.
- Home cards do not retain stuck opaque hover backgrounds after leaving hover.

### Search Results

- Search results show only videos/channels when cleanup is enabled.
- Modern Shorts shelves stay hidden.
- Channel cards fit and keep the centered channel name styling.
- Video cards stay compact: descriptions/extra metadata hidden, badges kept on the compact channel row.
- Infinite-scroll Search results continue filling the grid row instead of starting after a blank gap.
- Native YouTube hover preview works with no extension grow/highlight behavior.

### Watch Pages

- Clicking the main video toggles play/pause in Default, Theater, and Fullscreen modes.
- Comments remain visible and scrollable when Hide Comments is off.
- Theater/default scroll does not snap back to the player when reading comments.
- Sidebar/recommended hover grow waits long enough to feel intentional and is controlled by the relevant mode setting.
- Queue/watch-later/three-dot controls remain accessible on recommendations.
- Sticky Player dock, restore, close, and PiP behavior still work.

### Live Streams

- With Show Chat Overlay on, Theater live chat overlays on the right without squeezing or cutting off the video.
- Overlay close/minimize moves to a subtle right-edge restore affordance.
- Reopening the overlay restores the same usable chat surface with a visible close control.
- The chat three-dot menu remains accessible and is not covered by the extension close/minimize control.
- With Show Chat Overlay off or Hide Live Chat on, the video is not left with a black reserved chat panel.
- Live chat behavior does not block normal comments on non-live videos.

## Verification Tier

- Automated: full.
- Browser/live: supplemental for RC only.
- Human: required before any release/version/tag/Web Store step.

## Next Recommended Controller Action

Wait for an explicit release/version/tag/Web Store instruction or a new scoped issue. Do not restart #8 unless the user asks for hover research.
