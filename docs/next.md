# Next task

Last updated: 2026-06-23

## Immediate task: Phase 5 Nation Guide MVP

Implement one complete, version-aware nation-guide vertical slice:

1. Define a strict Zod schema for guide metadata, nation overview, path sections,
   ordered priorities, common mistakes, and canonical references.
2. Store authored guide content outside `data/game` under a versioned `content`
   path.
3. Add a loader that validates every guide file and resolves game-version, DLC,
   unit, and recommended-division references clearly.
4. Replace `/guides` with a compact guide index containing exactly one complete
   representative nation/path.
5. Add `/guides/[nationId]` overview and
   `/guides/[nationId]/[pathId]` detail routes.
6. Display game version, DLC, difficulty, context, and last-verified metadata.
7. Cover starting situation, focus order, research, construction, production,
   divisions, timing, diplomacy/wars, alternatives, and common mistakes.
8. Link guide recommendations to canonical unit pages and the Division Builder
   where the data supports it.
9. Add schema, loader, route, component, accessibility, and Chromium tests.
10. Keep the content explicitly representative; do not create many empty nation
    pages or expand unrelated canonical data.

## Constraints

- Keep guide prose separate from canonical official/mechanical data.
- Version every guide and validate all stable-ID references.
- Implement exactly one complete example path before generalizing.
- Do not add accounts, persistence, community submissions, ratings, comments,
  news ingestion, or a database.
- Keep `../divcheck` read-only.
