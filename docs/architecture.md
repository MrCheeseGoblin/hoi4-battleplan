# Architecture

## Chosen approach

HOI4 Battleplan is a single full-stack Next.js application using the App Router, React, and strict TypeScript.

This keeps routing, rendering, future server actions, content, and domain logic in one repository without introducing a separate API service before it is needed.

## Layers

```text
Routes and layouts (src/app)
        |
Shared interface components (src/components)
        |
Feature modules (src/features)
        |
Framework-independent domain logic (src/lib)
        |
Validated canonical files (data/game) and authored content (content)
```

Dependencies should point downward. Core calculations and validation must not import React or Next.js.

## Rendering

- Use server components by default.
- Use client components only for stateful interactions such as search, filters, or the future division grid.
- Prefer static generation for canonical catalogue and guide pages where practical.
- Keep browser-only state close to the interactive feature that needs it.

## Planned source structure

```text
src/
  app/                         Route definitions and route states
  components/layout/           Site header and footer
  components/ui/               Reusable presentational primitives
  features/division-builder/   Builder UI and adapters
  features/unit-catalogue/     Catalogue UI and query helpers
  features/nation-guides/      Guide presentation
  lib/game-data/               Zod schemas, loaders, validation
  lib/evaluation/              Pure division rules and calculations
  lib/versioning/              Shared version utilities
  types/                       Cross-feature TypeScript types
data/game/<game-version>/      Canonical mechanical data
content/guides/                Structured authored guidance
content/news/                  Later curated links and updates
tests/e2e/                     Critical browser journeys
```

Empty feature and data directories are added only when their first implementation needs them.

The Phase 3 catalogue follows this boundary:

```text
src/app/units/                         Routes and route states
src/features/unit-catalogue/           Search, filters, view models, UI
src/lib/game-data/                     Canonical mechanical source
content/unit-guidance/<version>.json   Separate authored advice
```

Catalogue routes never import raw canonical JSON. They consume a `GameDataSet`, resolve relationships into view models, and combine it with separately validated guidance.

## Testing

- Vitest covers pure domain logic.
- Testing Library covers important shared components and accessible behavior.
- Playwright covers a small number of critical user journeys.
- Phase 2 data loaders synchronously read repository JSON, validate it with Zod, and return a complete version snapshot. Validation runs in tests, production builds, and CI.

## Future persistence

PostgreSQL and a typed ORM may be introduced when community features require persistence. Canonical official game data remains version-controlled in repository files even after a database exists.

## Boundaries

- No database or authentication in the current foundation.
- No separate backend service.
- No network calls for canonical game data at runtime.
- No duplicated unit statistics in UI modules.
- No direct dependency from pure evaluation logic to Next.js or React.
- Canonical consumers load a complete `GameDataSet`; feature code must not read raw JSON files directly.
- Practical catalogue guidance may reference canonical stable IDs but must not duplicate mechanical values.
