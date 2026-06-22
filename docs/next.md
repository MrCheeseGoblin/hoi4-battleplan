# Next task

Last updated: 2026-06-22

## Immediate task: Phase 2 canonical game data

Before starting Phase 2, inspect the working tree. Phase 0/1 is verified but may still be uncommitted because the previous session could not write `.git/index.lock`. Create the local milestone commit first if Git metadata is writable.

Build the smallest validated vertical slice of the shared game-data layer:

1. Define a `GameVersion` metadata schema and a deliberately evolvable `Unit` schema with Zod.
2. Preserve distinct `category`, `regimentType`, and `regimentGroup` fields.
3. Create `data/game/<sample-version>/metadata.json` and a tiny representative unit dataset covering line battalions and support companies.
4. Implement framework-independent loaders under `src/lib/game-data/`.
5. Report file paths and readable Zod issues when validation fails.
6. Reject duplicate stable IDs and unresolved local references.
7. Add a `validate:data` npm command that runs during tests and CI.
8. Add focused tests for valid data, malformed records, duplicate IDs, and cross-reference failures.
9. Document exactly how to add a version or unit without duplicating data.

## Constraints

- Do not begin the catalogue UI until the loaders and validation tests are clean.
- Do not attempt a complete HOI4 data import.
- Do not claim exact mechanical accuracy for fields affected by equipment design, doctrine, technology, or country modifiers.
- Keep `../divcheck` read-only.
- Update progress, next-task, and decision documentation after the milestone.
