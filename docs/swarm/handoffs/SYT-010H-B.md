# SYT-010H-B: Selector Accuracy And Runtime Churn Audit

## Status

- Task ID: `SYT-010H-B`
- Title: Selector Accuracy And Runtime Churn Audit
- Assigned role: Runner/Auditor
- Current state: Integrated
- Repo: `/Users/d4ngl/Git Repos/Codex/simple-yt-tweaks`
- Branch: `swarm/syt-010h-selector-runtime-audit`
- PR: https://github.com/cryptoteatime/simple-yt-tweaks/pull/46, merged at `ddac456`
- GitHub issue: #10
- Verification tier: focused docs-only

## Scope

Produce a source-backed audit of selector accuracy, broad DOM sweeps, observer churn, and polling. This lane is intentionally docs-only during the parallel `SYT-010H` batch.

## Non-Scope

- No production source edits.
- No runtime refactors.
- Do not remove the watch-to-Home reload guard.
- Do not synthesize Home/Search hover events or force preview playback.

## Source Findings

### 1. High Risk: Always-on 250 ms watch-to-Home URL polling

- Source: `src/content/content.ts:12-17`, `src/content/content.ts:188-202`, `src/content/content.ts:204-240`, `src/content/content.ts:304-315`.
- Behavior: `bindWatchToHomeUrlWatcher()` starts one permanent `setInterval` at `WATCH_TO_HOME_URL_POLL_MS = 250`. Every tick calls `recordCurrentWatchNavigation()`, compares `location.href`, and may call `maybeReloadHomeAfterWatchNavigation()`.
- Accuracy: The reload path is narrow and source-backed: previous pathname must be `/watch`, next pathname must be `/`, and `state.lastWatchNavigationVideoId` must be present. The guard uses `sessionStorage` and an 8 second same-video window.
- Churn: This is the only sub-second permanent timer in the audited content path. At four ticks per second, it runs even on pages where YouTube navigation events are working and even when no relevant setting depends on the reload path.
- Regression risk: High. This guard protects the recently user-confirmed Brave PWA watch -> hidden header hover -> YouTube logo/Home regression. Removing it without a live-equivalent replacement risks re-breaking #36/#38 follow-up behavior.
- Recommendation: Keep the guard for now, but make `SYT-010H-D` evaluate a serial replacement that is event-first and timeout-bounded: use `yt-navigate-start`, `yt-navigate-finish`, click capture, `popstate`, and a short post-watch navigation watchdog only after a captured watch context. Require fixture coverage plus live Brave PWA verification if changed.

### 2. High Value: Global document MutationObserver fans into broad apply work

- Source: `src/content/lifecycle.ts:161-175`, `src/content/content.ts:304-367`.
- Behavior: `observeDom()` observes `document.documentElement` with `{ childList: true, subtree: true }`, debounced at 150 ms, then runs `applyFeatureState()`.
- Accuracy: The observer is intentionally broad enough for YouTube SPA churn, late-rendered player controls, live chat iframe changes, Home feed population, and sidebar state. It also separately syncs a watch-flexy attribute observer.
- Churn: One mutation burst reruns style rebuilding, watch navigation capture checks, navigation reset, viewport updates, theater/live-chat targeting, sidebar cleanup, PiP sync, fullscreen docking, Sticky Player state, and grid-hover state. Several of those subroutines perform full-document or large-subtree selector sweeps.
- Regression risk: Medium/high if narrowed blindly. YouTube renders key surfaces asynchronously, and several recent fixes depend on late DOM recovery.
- Recommendation: Do not narrow the observer first. Instead, reduce downstream work with cheap route/settings gates inside high-cost functions and add a small instrumentation helper or debug-only counter in a serial lane to identify which mutation categories actually drive repeated work.

### 3. Medium/High Value: Video binding interval is permanent and coarse

- Source: `src/content/lifecycle.ts:287-309`.
- Behavior: `bindVideoEvents()` calls `attach()` once and then starts a permanent 2000 ms interval until page lifetime ends. The interval scans `getVideo()` and binds playback/PiP listeners once per video via `dataset.simpleYtTweaksBound`.
- Accuracy: The dataset guard prevents duplicate event listeners on a stable video node. The polling handles YouTube replacing the video element without reliably firing an extension-owned hook.
- Churn: Low frequency, but always-on. It also persists across non-watch pages after initialization.
- Recommendation: In a serial runtime lane, replace or supplement with event-driven attach points: call `attach()` from navigation reruns and DOM observer reruns, then keep a slower or watch-only fallback interval. Verify PiP, Sticky Player playback UI, and watch navigation fixture paths.

### 4. Medium Value: Home native preview cleanup does nested broad geometry scans

- Source: `src/content/grid-hover.ts:531-581`, `src/content/grid-hover.ts:781-787`.
- Behavior: `syncGridHoverState()` calls `clearDetachedNativePreviewRoots()` on Home/Search. Each visible preview root under `#video-preview` is measured, then compared against every native feed card from `NATIVE_FEED_CARD_SELECTOR`.
- Accuracy: This is conservative: it only removes visible preview roots that do not meaningfully overlap an eligible native feed card. It deliberately preserves YouTube's zero-height preview loader path, which was important to the Home autoplay fix.
- Churn: Worst-case cost is preview roots times native feed cards plus layout reads. It runs from the global mutation apply path and stabilization path, even when no preview root exists.
- Recommendation: Keep the overlap semantics. Add a cheap first gate before card scanning in a serial lane: query preview roots, return immediately if none have visible bounds, and consider limiting native card candidates to the route-specific selector (`home` vs `results`). Do not remove zero-height loaders.

### 5. Medium Value: Home metadata normalization scans every visible Home grid item on each apply

- Source: `src/content/grid-hover.ts:604-650`, `src/content/grid-hover.ts:781-787`.
- Behavior: `normalizeNativeHomeFeedColumnMetadata()` runs on Home, finds `ytd-rich-grid-renderer #contents`, filters every direct `ytd-rich-item-renderer` through style and rect checks, then writes `elements-per-row`, `items-per-row`, and first/last column attributes only when needed.
- Accuracy: This repair aligns YouTube metadata with the extension's feed column setting and prevents stale Home card layout state after YouTube SPA transitions.
- Churn: It performs style/layout reads for every visible item on every apply, even when `generalFeedColumns` and visible item order have not changed.
- Recommendation: Add a serial helper that caches the last Home grid element, column count, and visible item count/order signature. Re-run fully on navigation, setting change, or item-list changes; otherwise skip. Unit-test the signature helper if extracted.

### 6. Medium Value: Sidebar cleanup repeats multiple broad sweeps

- Source: `src/content/sidebar.ts:220-236`, `src/content/sidebar.ts:455-488`, `src/content/sidebar.ts:506-559`, `src/content/sidebar.ts:561-605`, `src/content/sidebar.ts:607-645`, `src/content/sidebar.ts:694-719`.
- Behavior: `updateGeneralVisibility()` first clears all extension classes/icons, then conditionally re-finds sidebar sections, sponsored targets, Shorts targets/links, Home feed containers, and sidebar selected state.
- Accuracy: Rebuilding from scratch is robust after YouTube reuses or reorders sidebar nodes. The label helpers already have unit coverage in `tests/unit/dom.unit.spec.ts:55-77`.
- Churn: The clear-then-reapply model means many selector sweeps run repeatedly even when settings are disabled or the current route cannot contain the relevant targets.
- Recommendation: Highest value low-risk cleanup is gating, not refactoring: skip `clearGeneralHiddenTargets()` for classes tied to disabled features only after proving stale classes are removed on settings changes; split Home feed cleanup so Home-only scans run only on `/`; skip sidebar selected-state sweeps unless sidebar cleanup is enabled and a guide surface exists.

### 7. Medium Value: Fullscreen action overlay observer is well-gated but watches attributes deeply

- Source: `src/content/fullscreen.ts:555-621`.
- Behavior: `updateFullscreenActionDock()` only enables the observer when native fullscreen, watch page, and `fullscreenHideActionOverlay` are all true. It observes the overlays container with child, subtree, and filtered attribute changes, debounced at 80 ms.
- Accuracy: The target scoring in `findFullscreenActionTarget()` prefers quick actions with like/comment controls, then suggested action badges. This is a reasonable selector strategy for YouTube's shifting fullscreen action DOM.
- Churn: Because the observer is gated to fullscreen action-overlay mode, global cost is low. In fullscreen it may still receive many style/class mutations from player controls.
- Recommendation: Keep as-is unless later profiling identifies fullscreen churn. The better follow-up is selector coverage, not runtime reduction: add helper/fixture assertions for quick-actions scoring and restore behavior before changing observer behavior.

### 8. Medium Risk: Live-chat iframe/native-close binding repeats cross-document probing

- Source: `src/content/theater.ts:524-572`, `src/content/theater.ts:574-656`, `src/content/theater.ts:706-743`, `src/content/theater.ts:779-807`.
- Behavior: `updateLiveChatTargets()` scans all `ytd-live-chat-frame` nodes on each apply, binds native close listeners to the frame, iframe, iframe `contentWindow`, and iframe `contentDocument` with a `WeakSet`, probes same-origin iframe buttons for a native close button, inserts a fallback iframe close button when needed, stores iframe `src`, and restores collapsed/empty frames.
- Accuracy: The `WeakSet` prevents duplicate listener registration for a given event target. The code correctly tolerates inaccessible iframe documents. Recent e2e fixtures cover overlay/non-overlay behavior and minimize/restore paths.
- Churn: Same-origin iframe probing (`querySelectorAll('button, [role="button"]')`) and iframe close-button insertion checks repeat from the global apply path. The iframe `load` listener is registered with `{ once: true }`, but a new iframe target can still add a new load listener when YouTube replaces chat.
- Recommendation: Keep behavior. In a serial theater-specific lane, add a per-frame dataset/version marker for iframe control synchronization so same-origin scans only repeat after iframe load, overlay setting changes, minimized state changes, or chat frame replacement.

## Selector Accuracy Notes

- Watch recommendation selectors intentionally support legacy `ytd-compact-video-renderer` and modern `yt-lockup-view-model` cards under `#related`, `ytd-watch-next-secondary-results-renderer`, and `#secondary` (`src/content/grid-hover.ts:23-43`). This is accurate for the #21 selector drift but should receive fixture coverage for modern lockup cards before source extraction.
- Search grid cleanup has strong CSS selectors for Shorts, playlists, radio, shelves, and lockup variants (`src/content/grid-hover.ts:269-299`), but unit coverage is indirect through e2e fixtures. A later selector-fixture lane should assert Search non-video filtering and lockup playlist filtering.
- Sponsored Home detection combines CSS `:has()` selectors with runtime badge/link detection (`src/content/sidebar.ts:14-34`, `src/content/sidebar.ts:267-284`). This is broad but defensible; add fixture coverage for modern ad view models before changing it.
- Fullscreen action docking candidate scoring is centralized enough to test if exported or extracted (`src/content/fullscreen.ts:421-505`). Do not broaden selectors without scoring tests.
- Live-chat close selectors include `Close` and `Hide` text checks plus `#close-button` (`src/content/theater.ts:745-768`). This is user-facing and recently patched; prefer tests over selector changes.

## Ranked Recommendations

1. Serial `SYT-010H-D`: replace or bound `WATCH_TO_HOME_URL_POLL_MS` polling only with event-first logic and live Brave PWA verification. Highest churn reduction, highest regression risk.
2. Serial `SYT-010H-D`: reduce downstream global observer cost through route/settings gates before narrowing `observeDom()`. High value, safer than observer changes.
3. Serial `SYT-010H-D`: make video event binding navigation/observer-driven with a slower or watch-only fallback interval. Medium value, low/medium risk.
4. Serial `SYT-010H-E`: add selector fixtures for modern watch lockups, Search non-video filtering, sponsored Home containers, fullscreen action target scoring, and live-chat close/restore selectors. High confidence-building value before runtime edits.
5. Serial `SYT-010H-D/E`: add cheap guards around `clearDetachedNativePreviewRoots()` and cache Home grid metadata normalization. Medium value, must preserve zero-height preview loaders and Home metadata repair.
6. Serial `SYT-010H-F`: split sidebar cleanup into route/settings-gated helpers after fixture coverage. Medium value, medium risk because stale classes must still clear on settings changes.

## Commands Run

- `git status --short --branch`
- `sed`/`nl` reads for required swarm docs and audited source/test files
- `rg -n "WATCH_TO_HOME|setInterval|MutationObserver|clearDetachedNativePreviewRoots|normalizeNativeHomeFeedColumnMetadata|updateGeneralVisibility|updateFullscreenActionDock|updateLiveChatTargets|queryAll|querySelectorAll|liveChat" src/content tests/unit tests/e2e`
- `node -e "const p=require('./package.json'); console.log(p.scripts)"`

## Verification

- Passed: `git diff --check`

No helper tests were added, so `npm run test:unit`, `npm run typecheck`, and `npm run lint` are not required for this docs-only lane.

## Files Touched

- `docs/swarm/handoffs/SYT-010H-B.md`

## Blockers And Risks

- No blocker for review.
- Runtime changes should be serial. Do not combine watch-to-Home polling changes with theater, sidebar, or grid-hover refactors.
- Any change to watch-to-Home reload/native preview behavior needs live Brave PWA verification on the exact watch -> hidden header hover -> YouTube logo/Home route.

## Next Recommended Role And Action

Controller: use this integrated audit to launch one serial runtime lane focused on event-first polling/downstream gate reductions, plus a separate selector-fixture lane before any selector rewrites if needed.
