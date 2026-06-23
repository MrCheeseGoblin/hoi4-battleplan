import Link from "next/link";

import type {
  UnitCatalogue,
  UnitCatalogueEntry,
} from "@/features/unit-catalogue/catalogue";
import {
  catalogueLabel,
  formatStatValue,
  unitKindLabels,
} from "@/features/unit-catalogue/labels";

type UnitDetailProps = {
  catalogue: UnitCatalogue;
  entry: UnitCatalogueEntry;
};

const statDefinitions = [
  ["Organization", "organization"],
  ["HP", "hp"],
  ["Recovery rate", "recoveryRate"],
  ["Suppression", "suppression"],
  ["Weight", "weight"],
  ["Supply use", "supplyUse"],
  ["Fuel use", "fuelUse"],
  ["Speed", "speed"],
  ["Soft attack", "softAttack"],
  ["Hard attack", "hardAttack"],
  ["Air attack", "airAttack"],
  ["Defence", "defense"],
  ["Breakthrough", "breakthrough"],
  ["Armor", "armor"],
  ["Piercing", "piercing"],
  ["Hardness", "hardness"],
  ["Entrenchment", "entrenchment"],
] as const;

export function UnitDetail({ catalogue, entry }: UnitDetailProps) {
  const { unit, guidance } = entry;

  return (
    <>
      <section className="border-b border-ink-700 bg-ink-900/70">
        <div className="planning-grid">
          <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
            <Link
              href="/units"
              className="focus-ring inline-flex rounded-sm text-sm font-bold text-slate-300 underline decoration-ink-600 underline-offset-4 hover:text-paper-50"
            >
              ← Back to unit catalogue
            </Link>
            <div className="mt-8 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <div className="max-w-3xl">
                <p className="eyebrow">
                  {unitKindLabels[unit.kind]} / {catalogueLabel(unit.category)}
                </p>
                <h1 className="mt-4 text-4xl font-black tracking-[-0.04em] text-paper-50 sm:text-6xl">
                  {unit.name}
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                  {guidance?.description ??
                    "Practical guidance has not been authored for this unit yet."}
                </p>
              </div>
              <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-ink-600 bg-ink-600 sm:min-w-80">
                <div className="bg-ink-900 px-4 py-3">
                  <dt className="text-[0.62rem] font-bold tracking-[0.12em] text-slate-500 uppercase">
                    Game version
                  </dt>
                  <dd className="mt-1 text-sm font-bold text-paper-100">
                    {catalogue.dataSet.version.gameVersion}
                  </dd>
                </div>
                <div className="bg-ink-900 px-4 py-3">
                  <dt className="text-[0.62rem] font-bold tracking-[0.12em] text-slate-500 uppercase">
                    Data status
                  </dt>
                  <dd className="mt-1 text-sm font-bold text-brass-300 capitalize">
                    {catalogue.dataSet.version.status}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <aside className="border-l-2 border-brass-400 bg-brass-400/5 p-5">
          <p className="text-sm leading-6 text-slate-300">
            <strong className="text-brass-300">Representative sample:</strong>{" "}
            these statistics are incomplete and unverified. They demonstrate the
            data model and catalogue, not authoritative HOI4 balance data.
          </p>
        </aside>

        <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1.35fr)_minmax(20rem,0.65fr)]">
          <div className="space-y-8">
            <section
              className="panel p-6 sm:p-8"
              aria-labelledby="stats-heading"
            >
              <div className="flex flex-col justify-between gap-3 border-b border-ink-700 pb-5 sm:flex-row sm:items-end">
                <div>
                  <p className="eyebrow">Canonical mechanics</p>
                  <h2
                    id="stats-heading"
                    className="mt-2 text-2xl font-bold text-paper-50"
                  >
                    Sample statistics
                  </h2>
                </div>
                <p className="text-xs font-bold tracking-[0.12em] text-slate-500 uppercase">
                  Loaded from {catalogue.dataSet.version.id}
                </p>
              </div>

              <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-ink-700 bg-ink-700 sm:grid-cols-3 lg:grid-cols-4">
                <StatItem
                  label="Combat width"
                  value={
                    unit.kind === "line-battalion"
                      ? String(unit.combatWidth)
                      : "Support"
                  }
                />
                {statDefinitions.map(([label, key]) => (
                  <StatItem
                    key={key}
                    label={label}
                    value={formatStatValue(
                      key === "hardness"
                        ? unit.stats[key] * 100
                        : unit.stats[key],
                      key === "hardness" ? "%" : key === "speed" ? " km/h" : "",
                    )}
                  />
                ))}
              </dl>
            </section>

            <GuidanceSection entry={entry} />

            <section
              className="panel p-6 sm:p-8"
              aria-labelledby="requirements-heading"
            >
              <p className="eyebrow">Canonical requirements</p>
              <h2
                id="requirements-heading"
                className="mt-2 text-2xl font-bold text-paper-50"
              >
                Equipment, DLC, and unlocks
              </h2>

              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <RequirementBlock title="Equipment requirements">
                  <ul className="space-y-2">
                    {entry.equipmentRequirements.map((requirement) => (
                      <li
                        key={requirement.equipment.id}
                        className="flex justify-between gap-4 border-b border-ink-700 pb-2 text-sm"
                      >
                        <span className="text-slate-300">
                          {requirement.equipment.name}
                        </span>
                        <strong className="text-paper-100">
                          × {requirement.amount}
                        </strong>
                      </li>
                    ))}
                  </ul>
                </RequirementBlock>

                <RequirementBlock title="DLC requirements">
                  {entry.requiredDlcs.length > 0 ? (
                    <ul className="space-y-2 text-sm text-slate-300">
                      {entry.requiredDlcs.map((dlc) => (
                        <li key={dlc.id}>{dlc.name}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm leading-6 text-slate-400">
                      No DLC requirement is recorded for this sample unit.
                    </p>
                  )}
                </RequirementBlock>

                <RequirementBlock title="Technology requirements">
                  <p className="text-sm leading-6 text-slate-400">
                    Technology requirements are not modelled in the current
                    canonical sample.
                  </p>
                </RequirementBlock>

                <RequirementBlock title="Terrain modifiers">
                  <p className="text-sm leading-6 text-slate-400">
                    Terrain modifiers are not modelled in the current canonical
                    sample.
                  </p>
                </RequirementBlock>
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="panel p-6" aria-labelledby="structure-heading">
              <p className="eyebrow">Builder structure</p>
              <h2
                id="structure-heading"
                className="mt-2 text-xl font-bold text-paper-50"
              >
                Classification
              </h2>
              <dl className="mt-5 space-y-4">
                <Definition term="Kind" value={unitKindLabels[unit.kind]} />
                <Definition
                  term="Category"
                  value={catalogueLabel(unit.category)}
                />
                <Definition
                  term="Regiment type"
                  value={
                    unit.regimentType
                      ? catalogueLabel(unit.regimentType)
                      : "Not applicable"
                  }
                />
                <Definition
                  term="Regiment group"
                  value={
                    unit.regimentGroup
                      ? catalogueLabel(unit.regimentGroup)
                      : "Not applicable"
                  }
                />
              </dl>
            </section>

            <section className="panel p-6" aria-labelledby="related-heading">
              <p className="eyebrow">Canonical relationships</p>
              <h2
                id="related-heading"
                className="mt-2 text-xl font-bold text-paper-50"
              >
                Related units
              </h2>
              {entry.relatedUnits.length > 0 ? (
                <ul className="mt-5 space-y-3">
                  {entry.relatedUnits.map((relatedUnit) => (
                    <li key={relatedUnit.id}>
                      <Link
                        className="focus-ring block rounded-sm border border-ink-700 bg-ink-950/45 px-4 py-3 text-sm font-bold text-olive-200 hover:border-ink-600 hover:text-olive-100"
                        href={`/units/${relatedUnit.id}`}
                      >
                        {relatedUnit.name} →
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-sm leading-6 text-slate-400">
                  No related units are recorded in this sample.
                </p>
              )}
            </section>
          </aside>
        </div>
      </div>
    </>
  );
}

function GuidanceSection({ entry }: { entry: UnitCatalogueEntry }) {
  const guidance = entry.guidance;

  return (
    <section className="panel p-6 sm:p-8" aria-labelledby="guidance-heading">
      <div className="border-b border-ink-700 pb-5">
        <p className="eyebrow">Battleplan guidance</p>
        <h2
          id="guidance-heading"
          className="mt-2 text-2xl font-bold text-paper-50"
        >
          Practical role notes
        </h2>
        <p className="mt-2 text-xs leading-5 text-slate-500">
          Authored advice is separate from canonical game mechanics.
        </p>
      </div>

      {guidance ? (
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <GuidanceList title="Strengths" items={guidance.strengths} />
          <GuidanceList title="Weaknesses" items={guidance.weaknesses} />
          <GuidanceList title="Typical uses" items={guidance.typicalUses} />
        </div>
      ) : (
        <p className="mt-5 text-sm leading-6 text-slate-400">
          No practical guidance has been authored for this unit yet. Its
          canonical statistics remain available above.
        </p>
      )}
    </section>
  );
}

function GuidanceList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="text-sm font-black tracking-[0.12em] text-paper-100 uppercase">
        {title}
      </h3>
      <ul className="mt-3 space-y-3">
        {items.map((item) => (
          <li
            key={item}
            className="flex gap-3 text-sm leading-6 text-slate-400"
          >
            <span
              aria-hidden="true"
              className="mt-2 size-1.5 shrink-0 rounded-full bg-olive-400"
            />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-ink-900 px-3 py-3">
      <dt className="text-[0.62rem] font-bold tracking-[0.1em] text-slate-500 uppercase">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-bold text-paper-100">{value}</dd>
    </div>
  );
}

function RequirementBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-ink-700 pt-4">
      <h3 className="text-sm font-black tracking-[0.1em] text-paper-100 uppercase">
        {title}
      </h3>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function Definition({ term, value }: { term: string; value: string }) {
  return (
    <div className="border-b border-ink-700 pb-3">
      <dt className="text-[0.65rem] font-bold tracking-[0.1em] text-slate-500 uppercase">
        {term}
      </dt>
      <dd className="mt-1 text-sm font-semibold text-paper-100">{value}</dd>
    </div>
  );
}
