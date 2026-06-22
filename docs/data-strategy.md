# Data strategy

## Source of truth

All official or mechanical game data used by the product will live in version-controlled files under:

```text
data/game/<game-version>/
```

The unit catalogue and division builder must load the same records through the same validated loader. Feature-specific copies of unit statistics are forbidden.

## Planned layout

```text
data/game/<game-version>/
  metadata.json
  units/
  equipment/
  terrain/
  technologies/
  doctrines/
```

Phase 2 will introduce only a small representative sample.

## Validation

- Zod schemas define runtime contracts.
- Loaders return typed data only after successful parsing.
- Validation reports include the file and field that failed.
- Stable IDs must be unique within their entity namespace.
- A validation command runs locally, in tests, and in CI.
- Cross-references such as equipment or related-unit IDs must resolve.

## Version model

Game-version directories are immutable historical snapshots once published. Corrections remain possible, but balance updates create a new version rather than silently rewriting the meaning of old templates or guides.

Metadata should eventually record:

- Human-readable game version.
- Stable version ID.
- Release or effective date when known.
- Data verification status.
- Source notes.
- Supported DLC assumptions.

## Unit classification

The initial unit schema should preserve distinct concepts:

- `category` for browsing and presentation.
- `regimentType` for structural identity.
- `regimentGroup` for column compatibility.

The fields may have similar names but serve different rules. This lesson comes from the read-only DivCheck prototype; no implementation or data has been copied.

## Official data versus authored content

Official/mechanical data belongs under `data/game`.

Battleplan recommendations and guide prose belong under `content` or framework-independent evaluation rules. Future user-generated content belongs in the community database. These sources must be labelled separately in the interface.

## Accuracy

Equipment designs, technologies, doctrines, country modifiers, and DLC can alter results. Early schemas should permit future modifiers, but the MVP must label simplified assumptions rather than claim complete simulation accuracy.
