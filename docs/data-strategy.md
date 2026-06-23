# Data strategy

## Source of truth

All official or mechanical game data used by the product will live in version-controlled files under:

```text
data/game/<game-version>/
```

The unit catalogue and division builder must load the same records through the same validated loader. Feature-specific copies of unit statistics are forbidden.

Division templates store only the selected game-version ID, role ID, and stable
unit IDs in fixed line/support slots. Calculated statistics and equipment totals
are derived on demand from the matching `GameDataSet`. Future persisted or
shared templates must keep this version reference so later data snapshots do
not silently change historical results.

## Implemented Phase 2 layout

```text
data/game/<game-version>/
  metadata.json
  dlcs.json
  equipment.json
  units/
    *.json
```

The loader reads every JSON file directly inside `units/` and rejects unknown entries so files are not silently ignored. Terrain, technologies, doctrines, and other entities will be added only when a feature needs them.

## Validation

- Zod schemas define runtime contracts.
- Loaders return typed data only after successful parsing.
- Validation reports include the file and field that failed.
- Stable IDs must be unique within their entity namespace.
- A validation command runs locally, in tests, and in CI.
- Cross-references such as equipment or related-unit IDs must resolve.
- Each JSON document declares `schemaVersion`.
- Unknown fields fail validation so misspellings cannot silently enter the canonical dataset.
- Unit references resolve only inside their own game-version snapshot.

## Version model

Game-version directories are immutable historical snapshots once published. Corrections remain possible, but balance updates create a new version rather than silently rewriting the meaning of old templates or guides.

Metadata currently records:

- Stable version ID.
- Human-readable label and represented game version.
- Data verification status.
- Last verification date when known.
- Source notes.

The directory name must exactly match the metadata ID.

## Unit classification

The initial unit schema should preserve distinct concepts:

- `category` for browsing and presentation.
- `regimentType` for structural identity.
- `regimentGroup` for column compatibility.

The fields may have similar names but serve different rules. This lesson comes from the read-only DivCheck prototype; no implementation or data has been copied.

## Official data versus authored content

Official/mechanical data belongs under `data/game`.

Battleplan recommendations and guide prose belong under `content` or framework-independent evaluation rules. Future user-generated content belongs in the community database. These sources must be labelled separately in the interface.

Phase 3 practical unit guidance lives in version-aware files under `content/unit-guidance/`. Guidance records reference canonical unit IDs and are validated against the loaded snapshot. They intentionally contain no unit statistics or mechanical requirements.

## Accuracy

Equipment designs, technologies, doctrines, country modifiers, and DLC can alter results. Early schemas should permit future modifiers, but the MVP must label simplified assumptions rather than claim complete simulation accuracy.

The initial `1.16-sample` snapshot is explicitly representative and unverified. It proves the data pipeline; it is not yet a public gameplay authority.

Contributor steps and error examples are documented in [adding-game-data.md](adding-game-data.md).
