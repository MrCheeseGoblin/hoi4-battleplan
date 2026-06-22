# Next task

Last updated: 2026-06-22

## Immediate task: Phase 3 unit catalogue vertical slice

Before starting Phase 3, inspect the working tree. Phase 2 is verified but may still be uncommitted because the previous session could not write `.git/index.lock`. Create the local milestone commit first if Git metadata is writable.

Implement the catalogue against the Phase 2 loader without reading raw JSON in feature code:

1. Load the `1.16-sample` `GameDataSet` in server-only route code.
2. Add a small authored unit-guidance schema keyed by stable unit ID for explanation, strengths, weaknesses, and typical uses. Do not duplicate mechanical statistics.
3. Replace the `/units` placeholder with a compact catalogue showing all six sample units.
4. Add client-side search and filters for unit kind and category.
5. Add `/units/[unitId]` detail pages with:
   - Canonical mechanical statistics.
   - Equipment and DLC requirements resolved to display names.
   - Version/sample-status warning.
   - Separate practical guidance.
   - Related-unit links resolved by stable ID.
6. Add clear empty, invalid-ID, and missing-guidance states.
7. Add unit, component, route, and relevant browser tests.
8. Keep the division builder untouched until the catalogue proves the data access pattern.

## Constraints

- Do not expand to the full HOI4 dataset.
- Do not present `1.16-sample` values as verified gameplay facts.
- Do not place strengths, weaknesses, or recommendations in canonical mechanical JSON.
- Do not add a database or authentication.
- Keep `../divcheck` read-only.
- Update progress, next-task, and decision documentation after the milestone.
