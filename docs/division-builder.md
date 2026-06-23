# Division Builder

The Phase 4 builder is a transparent coaching tool over the canonical sample
dataset. It is intentionally not a complete Hearts of Iron IV simulator.

## Template shape

A division template stores:

- A canonical game-version ID.
- One intended role ID.
- 25 line slots arranged as five rows by five regiment columns.
- Five support-company slots.

Slots contain stable unit IDs or `null`. They never contain copied statistics.

## Structural rules

- Line battalions fill each regiment column from the top.
- Every occupied battalion in a column must share a `regimentGroup`.
- Support companies may only occupy support slots.
- A support company may appear once.
- Invalid operations return a specific issue and leave the previous template
  unchanged.

Removing a line battalion compacts the remaining units upward in that column.

## Calculation model

The builder resolves selected IDs through one validated `GameDataSet`.

- Attack, defence, breakthrough, HP, supply, fuel, entrenchment, width, and
  equipment quantities are additive.
- Organization, recovery, and hardness are simple line-battalion averages.
- Speed is the slowest selected line battalion.
- Armor and piercing use the maximum selected value.

These formulas are readable approximations for the current sample schema. The
interface repeats the assumptions beside every evaluation.

## Role evaluation

The initial roles are defensive-line infantry and offensive infantry. Each role
defines named dimensions, weights, and thresholds in
`src/features/division-builder/evaluation.ts`.

The result is role suitability, not a universal division score. Empty or
structurally invalid templates are not scored. A one-battalion skeleton is
capped below a positive result and receives a low-confidence warning.

## Adding a role

1. Add the role ID to `DivisionRoleId`.
2. Add a readable role definition and dimensions to `divisionRoles`.
3. Add role-specific suggestions only where they are actionable.
4. Add tests for the dimensions, thresholds, warnings, suggestions, and
   deterministic output.
5. Confirm the UI still explains that the model is simplified and version-aware.

Do not place canonical unit statistics in role definitions or React components.
