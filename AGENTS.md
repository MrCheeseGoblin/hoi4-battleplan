# AGENTS.md

This file contains permanent repository instructions for Codex and other coding agents.

## Start every session here

Read these files before making changes:

1. `README.md`
2. `AGENTS.md`
3. `docs/progress.md`
4. `docs/next.md`
5. `docs/decisions.md`

Then inspect the working tree before editing. Existing uncommitted changes belong to the user unless proven otherwise.

## Product and scope

- `MASTER_BUILD_BRIEF.md` is the authoritative product and engineering brief.
- Build the smallest useful version first and follow the staged roadmap.
- The product must remain useful without an account.
- Keep official/mechanical game data separate from community or user-generated content.
- Never duplicate canonical unit statistics between features.
- Version game data, evaluations, published templates, and patch-dependent guidance.
- Explain evaluations with assumptions, strengths, weaknesses, warnings, and suggestions. Never present uncertain advice as objective truth.

## Engineering rules

- Use strict TypeScript.
- Validate external and file-based data at runtime.
- Keep evaluation and calculation logic framework-independent, deterministic, and unit-tested.
- Prefer server components unless client-side interactivity is required.
- Prefer small components and feature modules.
- Avoid premature abstraction.
- Add comments for non-obvious product or game rules, not trivial syntax.
- Preserve responsive behavior, keyboard access, visible focus states, semantic HTML, and reduced-motion preferences.
- Do not add dependencies without a concrete current need.
- Never commit secrets. Add or update `.env.example` when environment variables are introduced.

## Data and content

- Canonical official game data belongs under `data/game/<game-version>/`.
- Community content must not be stored in the canonical game-data tree.
- Every data file must be validated at build/test time.
- Duplicate stable IDs must fail validation clearly.
- Do not use copyrighted Hearts of Iron IV assets without permission.
- Keep the fan-project disclaimer visible and accurate.

## Legacy reference

- `../divcheck` is read-only reference material.
- Never edit, format, move, delete, or commit files in `../divcheck`.
- Reuse concepts deliberately rather than copying its architecture.
- Document any code or data copied from it. No code or data has been copied at repository foundation.

## Verification

Run all relevant checks before declaring work complete:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

Run `npm run test:e2e` when routes, navigation, or critical user flows change. Run `npm run format:check` before a milestone commit.

Never claim a check passed unless it was actually run.

## Documentation and handoff

- Update `docs/progress.md` and `docs/next.md` after every meaningful milestone.
- Record architectural or product choices in `docs/decisions.md`.
- Keep `README.md` commands and status accurate.
- End each work session with a concise summary of completed work, verification, limitations, and the exact recommended next task.

## Git

- Never push without explicit user permission.
- Local commits are allowed only after a complete verified milestone.
- Use clear, focused commit messages.
- Do not add a licence unless explicitly requested.
