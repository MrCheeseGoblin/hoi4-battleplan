# HOI4 Battleplan

**Build divisions. Explore units. Master nations.**

HOI4 Battleplan is an unofficial community platform for Hearts of Iron IV players. It will combine practical unit information, a transparent division-template coach, and version-aware nation guides in one compact website.

The project is not affiliated with or endorsed by Paradox Interactive. It uses an original interface and does not include official game artwork, logos, fonts, or other copyrighted assets.

## Current status

Phases 0 through 4 are complete. The current application provides:

- A responsive shared layout and original visual system.
- Searchable and filterable `/units` catalogue with shareable URL parameters.
- Responsive compact cards using canonical statistics.
- Static `/units/[unitId]` detail pages.
- Resolved equipment, DLC, and related-unit references.
- Separately validated practical guidance.
- An interactive `/divisions` builder with a 5 × 5 line grid and five support slots.
- Structural placement rules with specific feedback.
- Canonical aggregate statistics and equipment requirements.
- Transparent evaluation for defensive-line and offensive-infantry roles.
- Strengths, weaknesses, critical warnings, suggestions, and explicit assumptions.
- Accessible route states, automated checks, and browser coverage.

The canonical dataset remains intentionally small and unverified. The builder is
a simplified coaching model, not a complete HOI4 simulation. Authentication,
database persistence, and community features are not implemented.

## Tech stack

- Next.js App Router
- React and strict TypeScript
- Tailwind CSS
- Zod for future runtime data validation
- Vitest and Testing Library
- Playwright
- ESLint and Prettier
- npm

The detailed rationale is in [docs/architecture.md](docs/architecture.md).

## Requirements

- Node.js 20.19 or newer
- npm 11 or newer

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Verification

Run the complete local verification sequence:

```bash
npm run lint
npm run typecheck
npm test
npm run validate:data
npm run build
npm run test:e2e
```

Formatting can be checked separately with:

```bash
npm run format:check
```

Playwright requires a one-time browser install:

```bash
npm run test:e2e:install
```

Validate every canonical game-data file without running the rest of the suite:

```bash
npm run validate:data
```

## Repository map

```text
src/
  app/                  Routes, layouts, and route-level states
  components/           Shared layout and UI components
  features/             Feature modules as they are implemented
  lib/                  Framework-independent data and domain logic
  types/                Shared TypeScript types
data/game/              Version-controlled canonical game data
content/                Version-controlled guides and curated content
docs/                   Product, architecture, decisions, and handoff notes
tests/                  Browser smoke tests
```

## Working on the project

Before changing code, read:

1. `README.md`
2. `AGENTS.md`
3. `docs/progress.md`
4. `docs/next.md`
5. `docs/decisions.md`

`../divcheck` is read-only reference material. Never modify it.

The master product brief is preserved as `MASTER_BUILD_BRIEF.md`. It is the authoritative scope and roadmap unless a later explicit user instruction changes direction.

## Documentation

- [Product vision](docs/product-vision.md)
- [MVP scope](docs/mvp-scope.md)
- [Architecture](docs/architecture.md)
- [Data strategy](docs/data-strategy.md)
- [Adding game data](docs/adding-game-data.md)
- [Division Builder rules](docs/division-builder.md)
- [Design direction](docs/design-direction.md)
- [Roadmap](docs/roadmap.md)
- [Architecture decisions](docs/decisions.md)
- [Progress](docs/progress.md)
- [Next task](docs/next.md)

No licence has been added because the repository owner has not requested one.
