# Development

This file is for contributor and release workflow notes.

## Local Setup

```bash
npm install
npm run icons
npm run dev
```

Load the built `dist/` folder as an unpacked extension from `chrome://extensions` or `brave://extensions` with Developer mode enabled.

## Release Workflow

```bash
npm run typecheck
npm run lint
npm run build
npm run validate
npm run package
```

The packaged upload is written to:

`release/simple-yt-tweaks-v<version>.zip`

## Release-Candidate Gate

Use this gate when the controller prepares a release-candidate branch. Routine docs, tests, and hardening PRs can use their focused checks; this gate is for versioned RCs and Web Store upload candidates.

1. Confirm the candidate scope is complete and no release-blocking issue remains open.
2. Update public release notes only after the candidate scope is known. Keep private Web Store submission notes out of the public repo.
3. If the RC needs a version change, run:

```bash
npm run version:set -- <next-version>
```

This syncs `package.json`, `package-lock.json`, and `public/manifest.json`. Do not run it for non-release process/docs work.

4. Run the stable automated gate:

```bash
npm run validate:all
```

`validate:all` is fixture-first: it runs typecheck, lint, `git diff --check`, package creation, packaged validation, and the deterministic Playwright fixture project. A passing run should produce `release/simple-yt-tweaks-v<version>.zip`.

5. Run optional live smoke only when the RC changes YouTube-facing behavior, when the reviewer/controller asks for live-site confidence, or immediately before a final manual acceptance pass:

```bash
npm run test:e2e:live
```

Do not block an otherwise sound RC only because live smoke is inconclusive from consent screens, bot checks, ads, experiments, or network conditions. Record the exact reason and fall back to fixture results plus manual QA.

6. Human QA is required before publishing an RC or Web Store upload. Use the manual smoke checklist below against the packaged/unpacked candidate, then tell the controller one of:

```text
Human QA passed for SYT-RC-001: <browser/version, package version, notes>
Human QA failed for SYT-RC-001: <steps and observed problem>
```

7. The controller may tag, create a GitHub release, or prepare Web Store upload artifacts only after explicit release approval. Approval should name the version, confirm the package path, and say whether to publish, draft, or stop.

For release-candidate PRs, the PR body should tell the controller:

- human review requested: `yes`
- commands run and their results
- whether optional live smoke was run, skipped, or inconclusive
- package path, for example `release/simple-yt-tweaks-v<version>.zip`
- exact human QA pass/fail message expected
- whether version bump, tag, GitHub release, and Web Store upload are approved or still blocked

## Browser Validation

The project includes an isolated Playwright harness for extension smoke tests. It uses Playwright's bundled Chromium with a temporary profile and loads the unpacked `dist/` extension with `--load-extension`; it does not use your normal Brave or Chrome profile.

```bash
npm run test:e2e
```

The fixture suite routes `https://www.youtube.com/` requests to deterministic local YouTube-like pages. It verifies home-feed cleanup, search-grid cleanup, watch-page mode behavior, popup settings, storage persistence, and the player click fallback without depending on the live YouTube site.

If Chromium is missing, install the Playwright browser once:

```bash
npx playwright install chromium
```

Optional live smoke checks run against real YouTube in the same isolated Chromium profile:

```bash
npm run test:e2e:live
```

Live smoke is intentionally not the release gate. YouTube consent screens, bot checks, network failures, ads, or experiments can make it inconclusive. Treat fixture E2E plus package validation as the stable automated baseline, then use manual testing for final YouTube-specific acceptance.

For a full local validation pass:

```bash
npm run validate:all
```

## Manual Smoke Checklist

- Homepage: verify home feed columns, sponsored hiding, Shorts hiding, and sidebar cleanup
- Watch page in Default mode: verify recommendations/comments/metadata/live chat controls and PiP button behavior
- Watch page in Theater mode: verify enhanced theater layout, header hover, metadata behavior, and scrollbar behavior
- Fullscreen mode: verify title, player UI, recommendation overlay, and action overlay behavior
- Popup: verify settings persist after closing/reopening the popup and after YouTube navigation
- PiP: verify the restored button opens true browser PiP and the miniplayer PiP handoff appears only when YouTube's native miniplayer is present

## Versioning

The extension version is synced across `package.json`, `package-lock.json`, and `public/manifest.json`.

```bash
npm run version:set -- 0.2.0
```

Use `version:set` only when preparing a new release candidate or Web Store upload.

## Store Submission Notes

The Chrome Web Store submission checklist is kept locally and should not be treated as public repo documentation.
