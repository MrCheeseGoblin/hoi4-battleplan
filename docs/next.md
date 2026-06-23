# Next task

Last updated: 2026-06-22

## Immediate task: Phase 4 Division Builder MVP

Build the first complete builder journey on the proven canonical data boundary:

1. Define framework-independent division-template types for a 5 × 5 line grid and five support slots.
2. Implement pure structural rules:
   - Top-down slot filling.
   - One regiment group per occupied column.
   - No duplicate support company.
   - Maximum support-slot count.
3. Add pure canonical aggregation for the subset of statistics that can be honestly combined from the sample data.
4. Build an accessible client-side grid and unit picker using the same `GameDataSet` as the catalogue.
5. Let users add, replace, and remove line battalions and support companies.
6. Show structural errors next to the relevant action and keep invalid templates from being evaluated.
7. Add one clearly labelled simplified role, such as defensive line infantry, with transparent assumptions and deterministic explanation rules.
8. Add strengths, warnings, and suggestions without claiming complete HOI4 simulation accuracy.
9. Add focused unit, component, and end-to-end tests for constructing and evaluating a sample division.

## Constraints

- Do not copy statistics into builder components.
- Do not add new canonical entities unless the builder genuinely needs them.
- Keep evaluation logic pure and independent from React.
- Do not implement accounts, saving, sharing, ratings, comments, or a database.
- Do not expand to the full HOI4 dataset.
- Keep `../divcheck` read-only.
- Update progress, next-task, and decision documentation after the milestone.
