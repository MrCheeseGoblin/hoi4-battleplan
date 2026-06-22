# Progress

Last updated: 2026-06-22

## Current milestone

Phase 0 (repository foundation), Phase 1 (application shell), and Phase 2 (canonical game data) are complete and verified. Phase 3 (unit catalogue) is next.

## Phase 2 completed

- Added strict Zod schemas for game-version metadata, DLCs, equipment, line battalions, support companies, equipment requirements, and unit statistics.
- Added explicit `schemaVersion: 1` to every canonical JSON document.
- Preserved distinct `category`, `regimentType`, and `regimentGroup` concepts.
- Added synchronous framework-independent loaders that return one typed `GameDataSet` per version.
- Added structured validation errors with portable file paths, JSON field paths, error codes, and specific explanations.
- Added validation for:
  - Invalid JSON and schema violations.
  - Missing required files and directories.
  - Unknown files or directories that would otherwise be ignored.
  - Version metadata/directory mismatches.
  - Duplicate stable IDs.
  - Missing DLC, equipment, and related-unit references.
  - Self-referencing related units.
- Added a representative `1.16-sample` snapshot:
  - 1 DLC record.
  - 5 equipment records.
  - 4 line battalions.
  - 2 support companies.
- Marked the sample snapshot explicitly unverified and unsuitable for public gameplay authority.
- Added `npm run validate:data`; it runs directly, during production builds, and in CI.
- Added contributor documentation for adding units and game versions.
- Kept practical guidance outside canonical mechanical records.
- Did not modify `../divcheck`.

## Verification

All relevant checks passed on 2026-06-22:

- `npm run format:check`
- `npm run lint`
- `npm run typecheck`
- `npm test` — 4 test files, 7 tests passed
- `npm run validate:data` — 1 version, 1 DLC, 5 equipment records, 6 units
- `npm run build` — data validation passed and 8 static routes generated
- `npm run test:e2e` — 1 Chromium smoke test passed
- `npm audit --audit-level=moderate` — 0 vulnerabilities
- `git diff --check`

The first E2E attempt was invalid because it was run concurrently with `next build`, which rewrote `.next` while the test server was reading it. The required sequential rerun passed without code changes.

## Git state

Phase 2 is verified but remains uncommitted. The current Windows sandbox ACL denies creation of `.git/index.lock` even after repository-specific write permission is granted. No files were staged and nothing was pushed.

## Known limitations

- The sample statistics are representative scaffolding and have not been verified for public gameplay recommendations.
- Only metadata, DLCs, equipment, and units are modelled.
- Technologies, doctrines, terrain, country modifiers, and equipment designs remain future schema extensions.
- The dataset is intentionally tiny and incomplete.
- No unit catalogue UI or practical guidance content exists yet.
- The loader is synchronous and repository-file based by design; this is appropriate for current build/server use.
- A local Phase 2 milestone commit still needs to be created when Git metadata is writable.
