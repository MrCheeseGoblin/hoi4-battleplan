# Progress

Last updated: 2026-06-23

## Current milestone

Phase 4 (Division Builder MVP) is complete and verified. Phase 5 (Nation Guide
MVP) is next.

## Phase 4 implemented

- Replaced the `/divisions` placeholder with a complete interactive builder.
- Added a 5 × 5 line-battalion grid and five separate support-company slots.
- Added immutable add, replace, remove, and column-compaction operations.
- Enforced:
  - Top-down line placement.
  - One regiment group per occupied column.
  - Correct line/support unit kinds.
  - Five support slots.
  - No duplicate support company.
- Added clear placement feedback while preserving the last valid template.
- Derived every picker option, label, statistic, and equipment requirement from
  the validated `1.16-sample` canonical `GameDataSet`.
- Added pure, deterministic aggregation for the mechanical fields represented by
  the sample schema.
- Added two deliberately limited intended roles:
  - Defensive line infantry.
  - Offensive infantry.
- Added transparent role suitability, dimension scores, strengths, weaknesses,
  critical warnings, practical suggestions, assumptions, and limitations.
- Refused to score empty or structurally invalid templates and prevented
  one-battalion skeletons from receiving a positive suitability result.
- Kept structural validation, aggregation, and role evaluation separate from
  React and from each other.
- Added unit/component tests for operations, rules, calculations, both roles,
  warnings, suggestions, determinism, and canonical-data rendering.
- Added Chromium journeys for the full builder flow and 390 px mobile usability.
- Fixed the grid container so the wide tactical table scrolls locally without
  causing page-level mobile overflow.
- Updated architecture, data-strategy, decision, contributor, and status
  documentation.
- Did not expand the canonical sample dataset or modify `../divcheck`.

## Verification

Final verification completed on 2026-06-23:

- Formatting: `npm run format` and `npm run format:check` passed.
- Lint: `npm run lint` passed.
- Type-check: `npm run typecheck` passed.
- Unit/component tests: `npm test` passed, 13 files and 33 tests.
- Canonical data validation: `npm run validate:data` passed for one version,
  one DLC, five equipment records, and six units.
- Production build: `npm run build` passed and generated 14 routes.
- Chromium E2E: `npm run test:e2e` passed, six journeys including the complete
  builder flow and 390 px mobile overflow check.
- Accessibility review: semantic regions, labelled native controls, live
  placement feedback, progress-bar semantics, keyboard-compatible interactions,
  visible focus styling, and mobile behavior were covered by component/E2E
  tests and browser inspection.
- Desktop production review: correct title, heading, five builder regions, 31
  labelled selects, local grid scroller, no page overflow, and no browser
  warnings/errors.
- Dependency audit: `npm audit --audit-level=moderate` found zero
  vulnerabilities.
- Repository hygiene: `git diff --check` passed.

## Known limitations

- The builder uses six representative canonical sample units with incomplete,
  unverified statistics.
- The two roles prove the evaluation architecture; they are not a complete role
  catalogue or authoritative meta ranking.
- Additive statistics, simple line averages, minimum speed, and maximum
  armor/piercing are documented approximations.
- Doctrines, technologies, terrain, country bonuses, designers, commanders,
  equipment variants, industrial cost, and full HOI4 combat formulas are not
  modelled.
- Templates exist only in browser memory. Saving, sharing, export, accounts,
  databases, and community features remain out of scope.
