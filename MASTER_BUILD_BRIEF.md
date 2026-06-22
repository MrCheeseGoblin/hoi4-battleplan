# MASTER BUILD BRIEF FOR CODEX — HOI4 BATTLEPLAN

You are the lead engineer, technical product planner, and documentation owner for a new project called **HOI4 Battleplan**.

The repository is intentionally starting from scratch. Build a clean foundation for a serious, maintainable, unofficial Hearts of Iron IV community platform.

Do not ask for approval after every small step. Make reasonable, conservative decisions, document them, and proceed. Pause only when a decision is genuinely blocking, destructive, legally risky, or would significantly change the product direction.

Never push to GitHub unless the user explicitly asks. You may create local commits after verified milestones. Never modify the legacy DivCheck repository.

---

## 1. PRODUCT VISION

HOI4 Battleplan is an unofficial community platform for Hearts of Iron IV players.

Its long-term purpose is to combine several scattered player needs into one coherent website:

1. A division creator that calculates statistics and also grades the division for different roles.
2. A compact unit catalogue/wiki with useful statistics and practical explanations.
3. Nation guides that explain different political paths, focus orders, research, production, divisions, timing, and common mistakes.
4. A community area where players can publish, browse, rate, and discuss division templates.
5. A small curated news area for official patch notes, developer diaries, useful YouTube videos, and important website updates.
6. Optional user accounts for saving, publishing, rating, commenting, following, and moderation.

The platform must be useful without an account. Login should only be required for persistent or community actions.

The central product idea is:

> Turn raw HOI4 data and scattered strategy advice into clear, practical decisions.

This must not become only another stat calculator or a copy of a normal wiki.

---

## 2. BRAND AND POSITIONING

Working product name:

**HOI4 Battleplan**

Working tagline:

**Build divisions. Explore units. Master nations.**

Positioning:

- Unofficial community project for Hearts of Iron IV.
- Serious, compact, practical, and easy to scan.
- Useful for newer players without becoming shallow for experienced players.
- Explanation-focused rather than only data-focused.
- Version-aware because HOI4 balance and mechanics change between patches.

Include an obvious unofficial fan-project disclaimer. Do not copy the official HOI4 logo, UI, icons, artwork, fonts, or other copyrighted assets. Use original interface design and placeholders unless the user later provides assets they are allowed to use.

Visual direction:

- Dark, serious, military-planning atmosphere.
- Charcoal/navy base, muted olive and warm paper-like accents.
- Compact stat panels, clear hierarchy, strong readability.
- Inspired by strategic planning rooms, not a direct imitation of the game UI.
- Responsive and accessible.
- Avoid excessive animation and visual clutter.

---

## 3. LEGACY REFERENCE PROJECT

A previous prototype named **DivCheck** may exist as a sibling repository at:

`../divcheck`

Treat it as **read-only reference material**.

It may contain useful lessons or concepts such as:

- Division evaluation ideas.
- Battalion and support-company catalogue data.
- Battalion `category`.
- Structural `regiment_type`.
- Compatibility-oriented `regiment_group`.
- Regiment-column locking.
- Runtime API response validation.
- Existing documentation and terminology.
- Previous frontend/backend architecture decisions.

Rules:

- Do not edit the DivCheck repository.
- Do not blindly copy its architecture or implementation.
- Inspect it only when useful.
- Reuse concepts deliberately.
- Document any code or data copied from it.
- The new repository must remain independently understandable and maintainable.

---

## 4. PRODUCT PRINCIPLES

Follow these principles throughout the project:

1. **One source of truth for game data**
   - The unit catalogue and division builder must use the same versioned data.
   - Never maintain separate duplicated stats for different features.

2. **Separate official game data from community content**
   - Official/mechanical data: units, equipment, technologies, terrain, doctrines, countries, focus trees, patch versions.
   - Community content: templates, ratings, comments, user guides, profiles, reports.

3. **Version everything that can become outdated**
   - Game data.
   - Division evaluations.
   - Published templates.
   - Nation guides.
   - Patch-dependent recommendations.

4. **Explain results**
   - Never show only a score.
   - Show strengths, weaknesses, warnings, assumptions, and actionable improvements.

5. **No false objectivity**
   - Division quality depends on role, doctrine, technology, terrain, industry, country bonuses, multiplayer rules, and game version.
   - The evaluator must clearly display assumptions.

6. **Build the smallest useful version first**
   - Do not begin with authentication, ratings, comments, scraping, or a large database.
   - Prove the core tools first.

7. **Small, testable changes**
   - Avoid large rewrites.
   - Keep modules isolated.
   - Add tests for core rules and calculations.

8. **Beginner-maintainable**
   - The repository owner is learning.
   - Prefer clear code, comments where they add real value, explicit naming, and useful documentation.
   - Avoid clever abstractions that make the project harder to understand.

---

## 5. RECOMMENDED TECHNICAL DIRECTION

Use a single full-stack web application to reduce operational complexity.

Preferred stack:

- Current stable **Next.js** with App Router.
- **TypeScript** with strict settings.
- **React**.
- **Tailwind CSS**.
- **Zod** for runtime schema validation.
- **Vitest** or an equally suitable current stable unit-testing tool.
- **Playwright** for a small number of critical end-to-end tests.
- **ESLint** and **Prettier**.
- **npm** unless the environment already has a clearly established alternative.

Future data layer:

- PostgreSQL for production community data.
- Prisma or another well-supported typed ORM.
- Do not add the database or authentication until a feature truly needs it.
- Official game data should remain version-controlled and reviewable in the repository, not hidden inside a community database.

Use current stable releases only. Avoid preview, canary, alpha, beta, and experimental dependencies unless there is an exceptional reason. Prefer official documentation.

A suggested high-level structure:

```text
src/
  app/
    page.tsx
    divisions/
    units/
    guides/
    about/
  components/
    layout/
    ui/
  features/
    division-builder/
    unit-catalogue/
    nation-guides/
    community/
    news/
  lib/
    game-data/
    evaluation/
    validation/
    versioning/
  types/

data/
  game/
    <game-version>/
      units/
      equipment/
      terrain/
      technologies/
      doctrines/
      metadata.json

content/
  guides/
  news/

docs/
tests/
public/
```

Adjust this structure if there is a strong technical reason, but document the decision.

---

## 6. CORE DATA STRATEGY

Design a version-aware canonical game-data layer before implementing complex UI.

The minimum conceptual entities are:

- `GameVersion`
- `Dlc`
- `Unit`
- `Battalion`
- `SupportCompany`
- `Equipment`
- `TerrainModifier`
- `TechnologyModifier`
- `DoctrineModifier`
- `CountryModifier`
- `DivisionTemplate`
- `DivisionRole`
- `DivisionEvaluation`
- `Nation`
- `NationPath`
- `NationGuide`

Important unit fields may include:

- Stable internal ID.
- Display name.
- Unit type.
- Category.
- Regiment type.
- Regiment group.
- Support or line battalion.
- Combat width.
- Organisation.
- HP.
- Recovery rate.
- Suppression.
- Weight.
- Supply use.
- Fuel use.
- Speed.
- Soft attack.
- Hard attack.
- Air attack.
- Defence.
- Breakthrough.
- Armour.
- Piercing.
- Hardness.
- Entrenchment.
- Equipment requirements.
- Terrain modifiers.
- Technology requirements.
- DLC requirements.
- Patch/game version.
- Short practical explanation.
- Strengths.
- Weaknesses.
- Typical use cases.

Do not pretend all final HOI4 calculations are simple. Build schemas that can evolve.

Every data file must be validated at build/test time. Invalid or duplicate IDs must fail clearly.

Create a small sample dataset first. Do not attempt to enter the entire game catalogue during initial scaffolding.

---

## 7. DIVISION BUILDER PRODUCT REQUIREMENTS

The division builder is the flagship feature.

Long-term capabilities:

- Add line battalions in a structured division grid.
- Add support companies.
- Enforce structural compatibility rules.
- Calculate division statistics from canonical game data.
- Choose an intended role.
- Grade the template for that role.
- Explain every grade.
- Show strengths, weaknesses, red flags, and improvement suggestions.
- Show assumptions and confidence.
- Support version, doctrine, technology, equipment, and country modifiers later.
- Create shareable templates later.
- Export an image or compact code later.

Potential roles:

- Defensive line infantry.
- Offensive infantry.
- Armoured breakthrough.
- Mobile exploitation.
- Port/coastal defence.
- Garrison/suppression.
- Special forces.
- Low-cost emergency division.

Potential evaluation dimensions:

- Organisation and staying power.
- HP and equipment-loss risk.
- Soft attack.
- Hard attack.
- Defence.
- Breakthrough.
- Armour and piercing.
- Hardness.
- Speed.
- Supply and fuel burden.
- Industrial cost.
- Combat width efficiency.
- Terrain performance.
- Reliability/complexity.
- Role suitability.

The evaluator must not reduce everything to one unexplained overall number.

A useful result format:

- Overall role suitability.
- Dimension scores.
- Strengths.
- Weaknesses.
- Critical warnings.
- Suggested changes.
- Assumptions.
- Explanation of why each score was produced.

The evaluation engine should be implemented as pure deterministic TypeScript functions with strong unit tests. UI code must not contain the core scoring rules.

For the first MVP, a simplified and clearly labelled evaluation model is acceptable. Accuracy must not be falsely claimed.

---

## 8. UNIT CATALOGUE REQUIREMENTS

The unit catalogue should be compact and more practical than a wall-of-text wiki.

Required MVP capabilities:

- Search.
- Filters.
- Unit cards/list.
- Unit detail route.
- Key stats.
- Requirements.
- Strengths and weaknesses.
- Typical uses.
- Version information.
- Links to related units.
- Reuse the exact same canonical game data as the division builder.

Possible routes:

```text
/units
/units/[unitId]
```

The catalogue should be the first substantial feature after the site shell because it validates the data architecture before the evaluator becomes complex.

---

## 9. NATION GUIDE REQUIREMENTS

Nation guides should be structured and actionable.

A guide can contain:

- Nation overview.
- Intended path.
- Required DLC.
- Difficulty.
- Singleplayer/multiplayer context.
- Patch version.
- Starting situation.
- Focus order.
- Political choices and decisions.
- Advisors and laws.
- Research priorities.
- Construction priorities.
- Production priorities.
- Air/navy considerations.
- Recommended divisions.
- Timing milestones.
- Wars and diplomacy.
- Common mistakes.
- Alternative choices.
- Last verified date.

Start with exactly one complete example guide and one path. Do not build dozens of empty nation pages.

Possible routes:

```text
/guides
/guides/[nationId]
/guides/[nationId]/[pathId]
```

Guides should be able to link directly to units and division templates.

Store guide content in a structured, version-controlled form such as typed MDX, Markdown with validated frontmatter, or a well-defined content schema. Choose the simplest maintainable approach and document it.

---

## 10. COMMUNITY FEATURES — LATER PHASE

Do not implement these in the MVP, but design the architecture so they can be added cleanly.

Future capabilities:

- User accounts.
- Profiles.
- Saved private templates.
- Published templates.
- Template tags and intended roles.
- Search and filters.
- Ratings.
- Comments.
- Reports.
- Moderation.
- Creator attribution.
- Version metadata.
- “Last verified” state.
- Community guide submissions later.

Anonymous users must be able to browse and use the core tools.

Accounts should be required only for:

- Saving.
- Publishing.
- Rating.
- Commenting.
- Following.
- Reporting.
- Editing.

Every published template should eventually store:

- Game version.
- DLC assumptions.
- Doctrine.
- Technology level.
- Country.
- Intended role.
- Singleplayer or multiplayer.
- Date submitted.
- Last verified date.
- Evaluation version.

Do not implement public comments until moderation and reporting exist.

---

## 11. NEWS AND VIDEO AREA — LATER PHASE

Do not automate scraping during the MVP.

Start later with manually curated entries for:

- Official patch notes.
- Developer diaries.
- Selected useful videos.
- Website updates.
- Recently updated guides.
- Popular templates.

Potential future integrations must respect source terms, copyright, rate limits, and attribution.

---

## 12. MVP SCOPE

The first meaningful public version should contain only:

1. Homepage.
2. Shared responsive layout and navigation.
3. Unit catalogue using a small validated sample dataset.
4. Unit detail pages.
5. Division builder shell.
6. Simplified division calculation/evaluation using the same sample data.
7. Nation guide system.
8. One complete example nation/path guide.
9. About/disclaimer page.
10. Tests, documentation, and CI.

Explicitly out of scope for the first MVP:

- Authentication.
- Profiles.
- Ratings.
- Comments.
- Community submissions.
- Moderation.
- Automated news ingestion.
- Full game data.
- Every country.
- Perfect simulation of all HOI4 mechanics.
- Deployment infrastructure beyond a simple documented path.

---

## 13. ROADMAP

Use the following staged roadmap.

### Phase 0 — Repository Foundation

Create:

- `README.md`
- `AGENTS.md`
- `.gitignore`
- `.editorconfig`
- formatting/linting configuration
- `docs/product-vision.md`
- `docs/mvp-scope.md`
- `docs/architecture.md`
- `docs/data-strategy.md`
- `docs/design-direction.md`
- `docs/roadmap.md`
- `docs/decisions.md`
- `docs/progress.md`
- `docs/next.md`

Document:

- Product goals.
- Non-goals.
- Technical choices.
- Development commands.
- Verification commands.
- Repository conventions.
- Legal/unofficial disclaimer.
- How to resume work in future Codex sessions.

### Phase 1 — Application Shell

Implement:

- Next.js/TypeScript foundation.
- Global layout.
- Header/navigation.
- Footer.
- Homepage.
- Placeholder routes for divisions, units, guides, and about.
- Responsive design system.
- Original placeholder branding.
- Basic accessibility.
- Error and not-found pages.
- Initial unit, component, and end-to-end smoke tests.
- CI that runs install, lint, type-check, test, and build.

Do not add major feature logic yet.

### Phase 2 — Canonical Game Data

Implement:

- Versioned game-data directories.
- Zod schemas.
- Loader functions.
- Validation script.
- Duplicate-ID detection.
- Small sample dataset.
- Unit tests.
- Clear documentation for adding or updating game data.

### Phase 3 — Unit Catalogue

Implement:

- Search.
- Filters.
- Unit listing.
- Unit cards.
- Unit detail pages.
- Practical explanations.
- Version and DLC display.
- Related-unit links.
- Empty/error states.
- Tests.

### Phase 4 — Division Builder MVP

Implement:

- Division grid.
- Support-company slots.
- Structural validation.
- Stat calculations from canonical game data.
- Role selection.
- Simplified transparent evaluation.
- Strengths, weaknesses, warnings, and suggestions.
- Assumptions panel.
- Unit tests for rules/calculations.
- End-to-end test for creating and evaluating a sample division.

### Phase 5 — Nation Guide MVP

Implement:

- Guide content schema.
- Guide index.
- Nation overview.
- One complete example path.
- Version/DLC/last-verified metadata.
- Links to units and recommended divisions.
- Tests.

### Phase 6 — Shareability

Only after MVP quality is acceptable:

- URL-encoded or server-stored shareable templates.
- Exportable template image or compact code.
- No login required.

### Phase 7 — Accounts and Community

Only after explicit approval:

- Database.
- Authentication.
- Profiles.
- Saved and published templates.
- Ratings.
- Reporting/moderation.
- Comments last.

### Phase 8 — Curated News

Only after explicit approval:

- Manual content workflow.
- Official-source links.
- Selected video embeds.
- No broad scraping without a separate design review.

---

## 14. CODE QUALITY AND REPOSITORY RULES

Create a root `AGENTS.md` that permanently instructs future Codex sessions.

Include these rules:

- Read `README.md`, `AGENTS.md`, `docs/progress.md`, `docs/next.md`, and `docs/decisions.md` before making changes.
- Keep official game data separate from community/user data.
- Never duplicate canonical unit stats.
- Use strict TypeScript.
- Validate external and file-based data at runtime.
- Core evaluation logic must be framework-independent and unit-tested.
- Prefer small components and feature modules.
- Avoid premature abstraction.
- Add comments for non-obvious business/game rules, not for trivial syntax.
- Preserve accessibility.
- Never commit secrets.
- Maintain `.env.example` when environment variables are introduced.
- Run all verification commands before declaring a task complete.
- Update `docs/progress.md` and `docs/next.md` after every meaningful milestone.
- Record architectural choices in `docs/decisions.md`.
- Never push without explicit user permission.
- Never edit `../divcheck`.
- Do not add a licence unless explicitly requested.
- Do not use copyrighted HOI4 assets without permission.

Recommended verification sequence:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

Add an end-to-end command when Playwright is configured.

Use clear commit messages. Local commits may be created after a complete, verified milestone.

---

## 15. WORKING STYLE

The repository owner does not want to repeatedly move between separate planning conversations.

Therefore:

- Own the technical planning inside the repository.
- Keep documentation current enough that another Codex session can resume immediately.
- Do not require approval for normal non-destructive implementation details.
- Ask questions only when genuinely blocked.
- When several options are reasonable, choose the simplest maintainable option and record the decision.
- Do not overwhelm the user with internal implementation detail unless it affects a decision they must make.
- At the end of each work session, provide:
  1. What was completed.
  2. What was verified.
  3. Any limitations.
  4. The exact next recommended task.
- Continue with the next sensible task automatically when time/context permits.
- Never claim something works unless the relevant checks were actually run.

---

## 16. FIRST EXECUTION INSTRUCTIONS

Begin now.

1. Inspect the current repository.
2. Confirm whether it is empty or contains only a GitHub-generated README.
3. Optionally inspect `../divcheck` read-only for lessons, terminology, and useful documentation.
4. Create the Phase 0 documentation and `AGENTS.md`.
5. Decide and document the exact technical architecture.
6. Scaffold the Phase 1 application shell.
7. Add the initial original visual system and placeholder pages.
8. Add verification scripts and basic tests.
9. Run lint, type-check, tests, and production build.
10. Fix failures.
11. Update `docs/progress.md` and `docs/next.md`.
12. Create a local milestone commit if all checks pass.
13. Do not push.
14. Report the result concisely and continue to Phase 2 only if Phase 1 is clean and there is sufficient context/time.

The immediate goal is not to build every feature. The immediate goal is to create a trustworthy foundation that can grow into the complete HOI4 Battleplan platform without repeating the architectural problems of an improvised prototype.
