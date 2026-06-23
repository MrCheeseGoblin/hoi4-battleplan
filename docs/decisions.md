# Architecture and product decisions

Record durable choices here so future sessions do not have to reconstruct them.

## ADR-001: Single Next.js application

- **Date:** 2026-06-22
- **Status:** Accepted
- **Decision:** Use one Next.js App Router application with strict TypeScript.
- **Why:** It keeps the initial operational model simple while supporting static content, interactive client features, and future server-side persistence.
- **Consequence:** Do not add a separate API service until a concrete requirement justifies it.

## ADR-002: Server components by default

- **Date:** 2026-06-22
- **Status:** Accepted
- **Decision:** Routes and presentational components are server components unless browser state or effects are required.
- **Why:** This reduces shipped JavaScript and keeps data loading close to the server-side source.

## ADR-003: Repository files for canonical game data

- **Date:** 2026-06-22
- **Status:** Accepted
- **Decision:** Store versioned official/mechanical data in validated repository files, separate from future community persistence.
- **Why:** Data changes remain reviewable, reproducible, and usable at build time.

## ADR-004: Framework-independent evaluation engine

- **Date:** 2026-06-22
- **Status:** Accepted
- **Decision:** Put calculations and role evaluation in pure deterministic TypeScript modules.
- **Why:** Rules must be testable, explainable, and reusable outside the UI.

## ADR-005: npm and current stable dependencies

- **Date:** 2026-06-22
- **Status:** Accepted
- **Decision:** Use npm with exact versions in `package.json` and a committed lockfile.
- **Why:** npm is already available and the brief prefers it. Exact versions make the initial foundation reproducible.

## ADR-006: Tailwind plus project-owned design tokens

- **Date:** 2026-06-22
- **Status:** Accepted
- **Decision:** Use Tailwind CSS with semantic CSS custom properties and a small set of shared UI primitives.
- **Why:** This supports rapid responsive work without importing a generic component system or copying the game interface.

## ADR-007: Vitest and Playwright

- **Date:** 2026-06-22
- **Status:** Accepted
- **Decision:** Use Vitest/Testing Library for unit and component tests and Playwright for a small critical browser suite.
- **Why:** Domain rules need fast isolated tests, while route integration needs real-browser coverage.

## ADR-008: Preserve distinct unit classification concepts

- **Date:** 2026-06-22
- **Status:** Accepted
- **Decision:** Model browsing category, structural regiment type, and compatibility regiment group as separate fields.
- **Why:** The read-only DivCheck prototype demonstrated that these fields serve different UI and builder rules. No code or data was copied.

## ADR-009: No database, authentication, or automated scraping in the foundation

- **Date:** 2026-06-22
- **Status:** Accepted
- **Decision:** Defer these systems until roadmap phases with explicit product need or approval.
- **Why:** They would add complexity before the canonical data and core tools are proven.

## ADR-010: Repository-local Playwright browser and server runner

- **Date:** 2026-06-22
- **Status:** Accepted
- **Decision:** Store the local Playwright browser in an ignored repository directory and run E2E tests through `scripts/run-e2e.mjs`.
- **Why:** The standard user cache is not reliably writable in the Windows development environment, and Playwright's automatic web-server teardown did not exit cleanly there.
- **Consequence:** `npm run test:e2e:install` is required once per local checkout. The runner starts and stops only the production server process it owns.

## ADR-011: Strict schema-versioned JSON documents

- **Date:** 2026-06-22
- **Status:** Accepted
- **Decision:** Every canonical JSON document declares `schemaVersion: 1`, and Zod object schemas reject unknown fields.
- **Why:** Explicit schema versions give future migrations a stable boundary, while strict objects catch misspelled or obsolete properties instead of silently discarding them.

## ADR-012: Complete per-version snapshots with local references

- **Date:** 2026-06-22
- **Status:** Accepted
- **Decision:** Each game-version directory contains its own metadata, DLCs, equipment, and units. References resolve only inside that directory.
- **Why:** A template or guide can load one reproducible snapshot without inheriting changed records from another patch.
- **Consequence:** Some unchanged records will be repeated across future version snapshots. This is intentional historical versioning, not feature-level duplication.

## ADR-013: Repository JSON loader is the canonical access boundary

- **Date:** 2026-06-22
- **Status:** Accepted
- **Decision:** Application features consume typed `GameDataSet` objects returned by `src/lib/game-data`; they must not import raw JSON files.
- **Why:** One loader centralizes runtime validation, duplicate detection, reference checks, and version semantics for both the catalogue and division builder.

## ADR-014: Mechanical records exclude practical guidance

- **Date:** 2026-06-22
- **Status:** Accepted
- **Decision:** Canonical unit records contain classifications, requirements, relationships, and mechanical statistics. Strengths, weaknesses, typical uses, and recommendations will live in a separate authored-content layer.
- **Why:** This prevents Battleplan advice from being mistaken for official game data while still letting both layers reference the same stable unit IDs.

## ADR-015: Version-aware validated unit guidance

- **Date:** 2026-06-22
- **Status:** Accepted
- **Decision:** Store practical unit guidance in `content/unit-guidance/<game-version-id>.json`, validate it with Zod, and require every guidance ID to resolve in that version's canonical dataset.
- **Why:** Advice can change between patches without contaminating mechanical records or losing stable links to units.

## ADR-016: Server-rendered catalogue filters use URL query parameters

- **Date:** 2026-06-22
- **Status:** Accepted
- **Decision:** Implement catalogue search and filters as a semantic GET form. Parse and apply filters in framework-independent utilities on the server.
- **Why:** Filtered views are shareable, refresh-safe, keyboard-accessible, and useful without client-side state or extra JavaScript.

## ADR-017: Division templates store stable IDs in fixed slots

- **Date:** 2026-06-23
- **Status:** Accepted
- **Decision:** Represent an MVP division as a version ID, role ID, 25 line-slot unit IDs, and five support-slot unit IDs.
- **Why:** A fixed shape makes structural rules explicit and serializable without copying canonical statistics.
- **Consequence:** Empty slots are `null`; columns fill top-down, each occupied column uses one regiment group, and duplicate support companies are rejected.

## ADR-018: Separate structural validation, aggregation, and role evaluation

- **Date:** 2026-06-23
- **Status:** Accepted
- **Decision:** Implement template operations, structural validation, canonical stat aggregation, and role evaluation as separate pure TypeScript modules inside the Division Builder feature.
- **Why:** Each stage has different rules and failure modes. Separation keeps the logic deterministic, framework-independent, and directly testable.
- **Consequence:** React components may orchestrate these functions but must not contain scoring thresholds or canonical unit statistics.

## ADR-019: Role-specific coaching replaces a universal division score

- **Date:** 2026-06-23
- **Status:** Accepted
- **Decision:** The MVP supports defensive-line infantry and offensive infantry with readable weighted dimensions and role-specific thresholds.
- **Why:** Division quality depends on intended use; one unexplained universal score would imply false objectivity.
- **Consequence:** The interface labels the result as role suitability, exposes every dimension and assumption, refuses to score empty or invalid templates, and caps one-battalion skeletons below a positive result.
