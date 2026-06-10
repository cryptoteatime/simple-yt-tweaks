# Context Map

Use this file as the fast entrypoint after `SWARM.md` and `docs/swarm/controller-directives.md`.

## Current Hot State

- Active implementation lane: `SYT-021`
- GitHub issue: #21
- Draft PR: #22
- Branch: `swarm/syt-008b-native-hover-spa-regression`
- Current status: Needs Review
- Required gate before merge: reviewer result plus any human QA gate the reviewer/controller keeps
- Do not do during this lane: version bump, tag, release, Web Store asset changes, or #8 enhanced Home/Search hover grow revival

## Hot Files

- Controller routing: `docs/swarm/controller-directives.md`
- Current state: `docs/swarm/current-state.md`
- Task queue: `docs/swarm/task-board.md`
- Agent capacity: `docs/swarm/agent-registry.md`
- GitHub policy/state: `docs/swarm/github.md`
- Active handoff: `docs/swarm/handoffs/SYT-021.md`
- User steering: `docs/swarm/user-feedback.md`

## Cold / Archived History

Completed lanes are intentionally compacted to stubs:

- `SYT-CTL-001` -> PR #11, merge `676efc8`
- `SYT-010A` -> PR #12, merge `59ec975`
- `SYT-010B` -> PR #14, merge `5675059`
- `SYT-010C` -> PR #16, merge `0fca6c3`
- `SYT-010D` -> PR #18, merge `88f0a91`

Full prior handoff text is recoverable through Git history before the 2026-06-10 compaction commit. Use `docs/swarm/archive/README.md` for the reference map.

## Next Safe Controller Action

Route a reviewer for PR #22. The reviewer should focus on:

- Home/Search native hover behavior stays native, with no extension grow/highlight revival.
- SPA cleanup deferral does not leave sponsored/Shorts holes permanently.
- Native preview fallback only plays an already-mounted preview under the pointer.
- Watch helpers prefer `#movie_player video.html5-main-video`.
- Player click fallback timing does not double-toggle normal native clicks.
- Modern `#secondary yt-lockup-view-model` recommendations are covered.

