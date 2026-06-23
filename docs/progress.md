# Progress

Last updated: 2026-06-22

## Current milestone

Phases 0 through 3 are complete and verified. Phase 4 (Division Builder MVP) is next.

## Phase 3 completed

- Replaced the `/units` placeholder with a compact server-rendered catalogue.
- Added case-insensitive unit-name search.
- Added shareable URL filters for:
  - Unit kind.
  - Category.
  - Regiment type.
  - Regiment group.
  - DLC requirement state.
- Derived filter options from canonical loaded records.
- Added clear result counts, reset actions, and no-results states.
- Added responsive cards with canonical organization, attack, defence, speed, and combat-width values.
- Added static `/units/[unitId]` pages for all six sample records.
- Resolved equipment, DLC, and related-unit IDs through the Phase 2 `GameDataSet`.
- Added catalogue-specific unknown-unit handling.
- Added complete canonical sample stat blocks and structural classification panels.
- Added explicit unavailable states for terrain and technology data that is not modelled yet.
- Added separately validated version-aware authored guidance:
  - Practical descriptions.
  - Strengths.
  - Weaknesses.
  - Typical uses.
- Clearly labelled authored advice separately from canonical mechanics.
- Kept all sample/incomplete-data warnings visible on catalogue and detail pages.
- Added contributor documentation for authored guidance.
- Did not expand the canonical sample dataset.
- Did not modify `../divcheck`.

## Verification

Final verification results must remain current after the ordered final run:

- Formatting: pending final run.
- Lint: pending final run.
- Type-check: pending final run.
- Unit/component tests: pending final run.
- Canonical data validation: pending final run.
- Production build: pending final run.
- Chromium E2E: pending final run.
- Audit and repository checks: pending final run.

## Known limitations

- The catalogue contains only six representative sample records.
- Canonical sample statistics remain incomplete and unverified.
- No canonical terrain modifiers or technology requirements exist yet.
- The current sample records do not require DLC, so the “Requires DLC” filter demonstrates a legitimate no-results state.
- Search and filters submit a GET form rather than updating instantly; this preserves a no-JavaScript, shareable baseline.
- The Division Builder, evaluation engine, authentication, database, and community features remain out of scope.
