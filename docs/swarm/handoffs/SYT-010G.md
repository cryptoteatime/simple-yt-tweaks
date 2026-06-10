# SYT-010G: Fullscreen Player UI Geometry Hardening

## Status

- Task ID: `SYT-010G`
- GitHub issue: #10
- Branch: `swarm/syt-010g-fullscreen-ui-geometry` merged and cleaned remotely
- PR: #34 merged at `99156b5`
- State: Integrated
- Role: Controller/Runner/Reviewer/Integrator

## Scope

Extract and test the player UI hover/reveal geometry used by fullscreen and theater player UI hiding. This is a behavior-preserving #10 hardening slice.

## Non-Scope

- Do not change shipped player UI behavior.
- Do not touch Home/Search enhanced hover grow or #8.
- Do not change settings defaults, popup UI, version, release, tag, or Web Store assets.
- Do not require human QA unless review finds a live player behavior risk.

## Parallelization

- `parallel-safe`: no, keep serial with other runtime hardening.
- `serial-required`: yes, touches shared player UI behavior.
- `depends-on`: `SYT-031` integrated.
- `conflict-risk`: medium, `src/content/fullscreen.ts` is a fragile watch-page runtime module.

## Files Touched

- `src/content/fullscreen.ts`
- `src/content/fullscreen-geometry.ts`
- `tests/unit/fullscreen-geometry.unit.spec.ts`
- `docs/swarm/handoffs/SYT-010G.md`
- `docs/swarm/task-board.md`
- `docs/swarm/current-state.md`
- `docs/swarm/controller-directives.md`

## Changes

- Extracted fullscreen/theater player UI control-zone math into `src/content/fullscreen-geometry.ts`.
- Kept DOM querying and class toggling in `src/content/fullscreen.ts`.
- Added unit coverage for:
  - mode-specific control-zone offsets,
  - chrome-bottom clamping,
  - fallback zone heights,
  - pointer-inside-player and reveal threshold behavior.

## Verification

- `npm run test:unit`: PASS, 22 tests.
- `npm run typecheck`: PASS.
- `npm run lint`: PASS.
- `git diff --check`: PASS.
- `npm run validate:all`: PASS before PR open, including package validation, 22 unit tests, and 12 fixture tests.
- `npm run validate:all`: PASS before merge, including package validation, 22 unit tests, and 12 fixture tests.

## Review

- Reviewer: Russell (`019eb293-9f5e-7ca2-ada8-6bad5f84c002`)
- Result: Ready to Integrate, no findings.
- Commands run by reviewer:
  - `git fetch origin main swarm/syt-010g-fullscreen-ui-geometry --prune`: PASS.
  - `git diff --check origin/main...origin/swarm/syt-010g-fullscreen-ui-geometry`: PASS.
  - `npm run test:unit`: PASS, 22 tests.
- Reviewer confirmed the extraction preserved the old 18/14 chrome offset, 44px clamp, 94/118 fallback heights, inclusive pointer bounds, and scope boundaries.

## Risks

- Low/medium. The runtime behavior should be unchanged, but the code protects recent player UI/play-pause behavior, so reviewer should confirm the extraction is mathematically equivalent to the old inline logic.

## Next Action

No immediate action for this lane. Issue #10 remains open for a future bounded hardening lane only if the controller can name a narrow source/test target.
