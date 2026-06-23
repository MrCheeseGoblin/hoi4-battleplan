import type { DivisionCalculation } from "@/features/division-builder/types";
import { formatStatValue } from "@/features/unit-catalogue/labels";

type DivisionStatisticsProps = {
  calculation: DivisionCalculation;
};

const displayedStats = [
  ["Combat width", "combatWidth"],
  ["Organization", "organization"],
  ["HP", "hp"],
  ["Soft attack", "softAttack"],
  ["Hard attack", "hardAttack"],
  ["Defence", "defense"],
  ["Breakthrough", "breakthrough"],
  ["Armor", "armor"],
  ["Piercing", "piercing"],
  ["Speed", "speed"],
  ["Supply use", "supplyUse"],
  ["Fuel use", "fuelUse"],
] as const;

export function DivisionStatistics({ calculation }: DivisionStatisticsProps) {
  return (
    <section
      className="panel p-5 sm:p-6"
      aria-labelledby="division-stats-heading"
    >
      <div className="flex flex-col justify-between gap-3 border-b border-ink-700 pb-4 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow">Simplified calculation</p>
          <h2
            id="division-stats-heading"
            className="mt-2 text-xl font-bold text-paper-50"
          >
            Aggregate statistics
          </h2>
        </div>
        <p className="text-xs text-slate-500">
          {calculation.stats.lineBattalionCount} line ·{" "}
          {calculation.stats.supportCompanyCount} support
        </p>
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-ink-700 bg-ink-700 sm:grid-cols-3 lg:grid-cols-4">
        {displayedStats.map(([label, key]) => (
          <div key={key} className="bg-ink-900 px-3 py-3">
            <dt className="text-[0.62rem] font-bold tracking-[0.1em] text-slate-500 uppercase">
              {label}
            </dt>
            <dd
              className="mt-1 text-sm font-bold text-paper-100"
              data-testid={`division-stat-${key}`}
            >
              {formatStatValue(
                calculation.stats[key],
                key === "speed" ? " km/h" : "",
              )}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-6">
        <h3 className="text-xs font-black tracking-[0.12em] text-paper-100 uppercase">
          Equipment requirements
        </h3>
        {calculation.equipment.length > 0 ? (
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {calculation.equipment.map((equipment) => (
              <li
                key={equipment.equipmentId}
                className="flex justify-between gap-4 rounded-sm border border-ink-700 bg-ink-950/45 px-3 py-2 text-sm"
              >
                <span className="text-slate-300">{equipment.name}</span>
                <strong className="text-paper-100">× {equipment.amount}</strong>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-slate-500">
            Add units to calculate equipment requirements.
          </p>
        )}
      </div>
    </section>
  );
}
