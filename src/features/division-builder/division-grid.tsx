import type { GameDataSet, Unit } from "@/lib/game-data";
import { catalogueLabel } from "@/features/unit-catalogue/labels";
import { lineSlotIndex } from "@/features/division-builder/grid";
import {
  DIVISION_GRID_COLUMNS,
  DIVISION_GRID_ROWS,
  type DivisionTemplate,
} from "@/features/division-builder/types";

type DivisionGridProps = {
  dataSet: GameDataSet;
  template: DivisionTemplate;
  invalidSlotKey: string | null;
  feedbackId: string;
  onChange: (row: number, column: number, unitId: string) => void;
};

const selectClassName =
  "focus-ring min-h-11 w-full min-w-32 rounded-sm border border-ink-600 bg-ink-950 px-2 py-2 text-xs font-semibold text-paper-100";

export function DivisionGrid({
  dataSet,
  template,
  invalidSlotKey,
  feedbackId,
  onChange,
}: DivisionGridProps) {
  const lineUnits = dataSet.units.filter(
    (unit): unit is Extract<Unit, { kind: "line-battalion" }> =>
      unit.kind === "line-battalion",
  );
  const unitById = new Map(dataSet.units.map((unit) => [unit.id, unit]));

  return (
    <section
      className="panel min-w-0 p-5 sm:p-6"
      aria-labelledby="line-grid-heading"
    >
      <div className="flex flex-col justify-between gap-3 border-b border-ink-700 pb-4 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow">Line formation</p>
          <h2
            id="line-grid-heading"
            className="mt-2 text-xl font-bold text-paper-50"
          >
            5 × 5 regiment grid
          </h2>
        </div>
        <p className="max-w-md text-xs leading-5 text-slate-500">
          Fill each column from the top. Its first battalion locks the regiment
          group for every slot below it.
        </p>
      </div>

      <div className="mt-5 max-w-full overflow-x-auto pb-2">
        <table className="w-full min-w-190 border-separate border-spacing-2">
          <caption className="sr-only">
            Division line battalion grid with five regiment columns and five
            rows.
          </caption>
          <thead>
            <tr>
              <th className="w-14 text-left text-[0.62rem] font-bold tracking-[0.12em] text-slate-600 uppercase">
                Row
              </th>
              {Array.from({ length: DIVISION_GRID_COLUMNS }, (_, column) => {
                const firstUnitId =
                  template.lineSlots[lineSlotIndex(0, column)];
                const firstUnit = firstUnitId
                  ? unitById.get(firstUnitId)
                  : undefined;

                return (
                  <th key={column} scope="col" className="px-1 pb-2 text-left">
                    <span className="block text-xs font-black tracking-[0.12em] text-paper-100 uppercase">
                      Regiment {column + 1}
                    </span>
                    <span className="mt-1 block min-h-4 text-[0.62rem] font-semibold text-olive-300">
                      {firstUnit?.regimentGroup
                        ? catalogueLabel(firstUnit.regimentGroup)
                        : "Unlocked"}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: DIVISION_GRID_ROWS }, (_, row) => (
              <tr key={row}>
                <th
                  scope="row"
                  className="text-left text-xs font-bold text-slate-500"
                >
                  {row + 1}
                </th>
                {Array.from({ length: DIVISION_GRID_COLUMNS }, (_, column) => {
                  const key = `line-${row}-${column}`;
                  const value =
                    template.lineSlots[lineSlotIndex(row, column)] ?? "";
                  const invalid = invalidSlotKey === key;

                  return (
                    <td key={column}>
                      <select
                        aria-label={`Line slot row ${row + 1}, regiment ${column + 1}`}
                        aria-invalid={invalid || undefined}
                        aria-describedby={invalid ? feedbackId : undefined}
                        className={`${selectClassName} ${invalid ? "border-red-400 text-red-100" : ""}`}
                        value={value}
                        onChange={(event) =>
                          onChange(row, column, event.target.value)
                        }
                      >
                        <option value="">
                          {value ? "Remove battalion" : "Empty slot"}
                        </option>
                        {lineUnits.map((unit) => (
                          <option key={unit.id} value={unit.id}>
                            {unit.name} · {catalogueLabel(unit.regimentGroup)}
                          </option>
                        ))}
                      </select>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
