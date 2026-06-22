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
