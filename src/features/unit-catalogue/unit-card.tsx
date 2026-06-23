import Link from "next/link";

import type { UnitCatalogueEntry } from "@/features/unit-catalogue/catalogue";
import {
  catalogueLabel,
  formatStatValue,
  unitKindLabels,
} from "@/features/unit-catalogue/labels";

type UnitCardProps = {
  entry: UnitCatalogueEntry;
};

export function UnitCard({ entry }: UnitCardProps) {
  const { unit, guidance } = entry;
  const keyStats = [
    { label: "Org", value: formatStatValue(unit.stats.organization) },
    { label: "Soft atk", value: formatStatValue(unit.stats.softAttack) },
    { label: "Defence", value: formatStatValue(unit.stats.defense) },
    { label: "Speed", value: formatStatValue(unit.stats.speed, " km/h") },
    {
      label: "Width",
      value: unit.kind === "line-battalion" ? String(unit.combatWidth) : "—",
    },
  ];

  return (
    <article className="panel group flex h-full flex-col p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[0.68rem] font-black tracking-[0.16em] text-brass-300 uppercase">
            {unitKindLabels[unit.kind]}
          </p>
          <h3 className="mt-2 text-xl font-bold text-paper-50">{unit.name}</h3>
        </div>
        <span className="rounded-full border border-ink-600 bg-ink-950/50 px-2.5 py-1 text-[0.65rem] font-bold tracking-[0.1em] text-slate-400 uppercase">
          {catalogueLabel(unit.category)}
        </span>
      </div>

      <p className="mt-4 min-h-18 text-sm leading-6 text-slate-400">
        {guidance?.description ??
          "Practical guidance has not been authored for this unit yet."}
      </p>

      <dl className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-ink-700 bg-ink-700 sm:grid-cols-5">
        {keyStats.map((stat) => (
          <div key={stat.label} className="bg-ink-900 px-3 py-3">
            <dt className="text-[0.62rem] font-bold tracking-[0.1em] text-slate-500 uppercase">
              {stat.label}
            </dt>
            <dd className="mt-1 text-sm font-bold text-paper-100">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-5 flex flex-wrap gap-2">
        {unit.regimentType ? (
          <span className="rounded-sm bg-olive-400/10 px-2 py-1 text-xs font-semibold text-olive-200">
            {catalogueLabel(unit.regimentType)}
          </span>
        ) : null}
        {unit.requiredDlcIds.length > 0 ? (
          <span className="rounded-sm bg-brass-400/10 px-2 py-1 text-xs font-semibold text-brass-300">
            DLC required
          </span>
        ) : (
          <span className="rounded-sm bg-ink-800 px-2 py-1 text-xs font-semibold text-slate-400">
            No DLC recorded
          </span>
        )}
      </div>

      <Link
        href={`/units/${unit.id}`}
        className="focus-ring mt-6 inline-flex min-h-10 items-center self-start rounded-sm text-sm font-black text-olive-200 underline decoration-olive-500/40 underline-offset-4 hover:text-olive-100"
      >
        View {unit.name} details
        <span
          aria-hidden="true"
          className="ml-2 transition-transform group-hover:translate-x-1"
        >
          →
        </span>
      </Link>
    </article>
  );
}
