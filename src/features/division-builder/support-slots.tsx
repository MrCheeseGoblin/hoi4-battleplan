import type { GameDataSet, Unit } from "@/lib/game-data";
import {
  DIVISION_SUPPORT_SLOTS,
  type DivisionTemplate,
} from "@/features/division-builder/types";

type SupportSlotsProps = {
  dataSet: GameDataSet;
  template: DivisionTemplate;
  invalidSlotKey: string | null;
  feedbackId: string;
  onChange: (index: number, unitId: string) => void;
};

export function SupportSlots({
  dataSet,
  template,
  invalidSlotKey,
  feedbackId,
  onChange,
}: SupportSlotsProps) {
  const supportUnits = dataSet.units.filter(
    (unit): unit is Extract<Unit, { kind: "support-company" }> =>
      unit.kind === "support-company",
  );

  return (
    <section className="panel p-5 sm:p-6" aria-labelledby="support-heading">
      <div className="border-b border-ink-700 pb-4">
        <p className="eyebrow">Support detachment</p>
        <h2
          id="support-heading"
          className="mt-2 text-xl font-bold text-paper-50"
        >
          Five support-company slots
        </h2>
        <p className="mt-2 text-xs leading-5 text-slate-500">
          Each support company may appear only once.
        </p>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
        {Array.from({ length: DIVISION_SUPPORT_SLOTS }, (_, index) => {
          const key = `support-${index}`;
          const invalid = invalidSlotKey === key;
          const value = template.supportSlots[index] ?? "";

          return (
            <label key={index}>
              <span className="mb-1.5 block text-[0.65rem] font-bold tracking-[0.1em] text-slate-500 uppercase">
                Support slot {index + 1}
              </span>
              <select
                aria-invalid={invalid || undefined}
                aria-describedby={invalid ? feedbackId : undefined}
                className={`focus-ring min-h-11 w-full rounded-sm border bg-ink-950 px-3 py-2 text-sm font-semibold text-paper-100 ${
                  invalid ? "border-red-400 text-red-100" : "border-ink-600"
                }`}
                value={value}
                onChange={(event) => onChange(index, event.target.value)}
              >
                <option value="">
                  {value ? "Remove support company" : "Empty support slot"}
                </option>
                {supportUnits.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.name}
                  </option>
                ))}
              </select>
            </label>
          );
        })}
      </div>
    </section>
  );
}
