# Adding canonical game data

Canonical mechanical data lives under `data/game/<game-version-id>/`. It is separate from authored guides and future community/user data.

Run this after every data edit:

```bash
npm run validate:data
```

Validation also runs in unit tests, production builds, and CI.

## Add a unit

1. Choose the existing game-version directory the unit belongs to.
2. Add the record to an appropriate JSON file under that version's `units/` directory. You may create another descriptively named `.json` file if that keeps the files readable.
3. Use a stable lowercase hyphenated `id`. Never rename an ID merely to improve its display text.
4. Set `kind` to either `line-battalion` or `support-company`.
5. Keep these concepts separate:
   - `category` controls catalogue grouping.
   - `regimentType` describes structural identity.
   - `regimentGroup` controls line-column compatibility.
6. Support companies must use:

   ```json
   {
     "kind": "support-company",
     "category": "support",
     "combatWidth": 0,
     "regimentType": null,
     "regimentGroup": null
   }
   ```

7. Reference only equipment, DLC, and related-unit IDs defined in the same game-version directory.
8. Add missing equipment to `equipment.json` or DLCs to `dlcs.json`; never copy a unit's statistics into a feature component.
9. Run `npm run validate:data` and the full verification sequence.

Every unit requires the complete current `stats` object. A missing value is an error; the loader does not silently invent defaults for mechanical statistics.

## Add practical unit guidance

Practical explanations are authored separately under:

```text
content/unit-guidance/<game-version-id>.json
```

Add one entry keyed by the canonical unit's stable `unitId`. Guidance may contain:

- A practical description.
- Strengths.
- Weaknesses.
- Typical uses.

Do not repeat statistics, equipment counts, classifications, DLC requirements, or other mechanical fields in guidance. The catalogue resolves those from the canonical `GameDataSet`.

Guidance files are runtime-validated when the catalogue loads. Unknown or duplicate unit IDs fail the build and tests.

## Add a game version

1. Copy the structure of an existing version directory, not its conclusions.
2. Name the directory with the stable version ID, for example `1.16-sample`.
3. Make `metadata.json.id` exactly match the directory name.
4. Include:
   - `metadata.json`
   - `dlcs.json`
   - `equipment.json`
   - at least one JSON file under `units/`
5. Set every file's `schemaVersion` to the schema version it follows. The current value is `1`.
6. Use `status: "sample"` or `"draft"` until the mechanical values have been verified.
7. Record concise source and verification notes in `metadata.json`.
8. Validate all references within the new snapshot. IDs do not resolve across version directories.
9. Run `npm run validate:data`, tests, and the production build.

Once a version is relied upon by published templates or guides, balance changes should create a new version directory rather than silently changing the old snapshot's meaning. Factual corrections remain allowed and should be documented.

## Error messages

Validation errors use this shape:

```text
1.16-sample/units/line-battalions.json:units[0].combatWidth [schema] Must be a positive integer.
```

The file comes first, followed by the JSON field path, error category, and explanation. Duplicate-ID messages also identify the first definition.

## Current limitations

- The checked-in dataset is deliberately small and marked as representative sample data.
- Statistics have not yet been verified for public gameplay recommendations.
- Technologies, doctrines, terrain, country modifiers, and equipment designs are not modelled yet.
- Do not add speculative fields to bypass validation; evolve the schema and document the decision instead.
