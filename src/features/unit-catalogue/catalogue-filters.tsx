import Link from "next/link";

import type { UnitCatalogueEntry } from "@/features/unit-catalogue/catalogue";
import {
  catalogueFilterOptions,
  type CatalogueFilters,
} from "@/features/unit-catalogue/filters";
import {
  catalogueLabel,
  unitKindLabels,
} from "@/features/unit-catalogue/labels";

type CatalogueFiltersFormProps = {
  entries: readonly UnitCatalogueEntry[];
  filters: CatalogueFilters;
};

const inputClassName =
  "focus-ring min-h-11 w-full rounded-sm border border-ink-600 bg-ink-950 px-3 py-2.5 text-sm text-paper-50 shadow-inner shadow-black/10 placeholder:text-slate-600";

export function CatalogueFiltersForm({
  entries,
  filters,
}: CatalogueFiltersFormProps) {
  const options = catalogueFilterOptions(entries);

  return (
    <form
      action="/units"
      method="get"
      className="panel p-5 sm:p-6"
      aria-labelledby="catalogue-filters-heading"
    >
      <div className="flex flex-col justify-between gap-3 border-b border-ink-700 pb-4 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow">Search parameters</p>
          <h2
            id="catalogue-filters-heading"
            className="mt-2 text-lg font-bold text-paper-50"
          >
            Narrow the sample catalogue
          </h2>
        </div>
        <Link
          href="/units"
          className="focus-ring decoration-ink-500 self-start rounded-sm text-sm font-bold text-slate-300 underline underline-offset-4 hover:text-paper-50 sm:self-auto"
        >
          Clear filters
        </Link>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <label className="md:col-span-2 xl:col-span-1">
          <span className="mb-2 block text-xs font-bold tracking-[0.12em] text-slate-400 uppercase">
            Unit name
          </span>
          <input
            className={inputClassName}
            type="search"
            name="q"
            defaultValue={filters.query}
            placeholder="Search infantry, artillery…"
            autoComplete="off"
          />
        </label>

        <FilterSelect
          label="Unit kind"
          name="kind"
          value={filters.kind}
          options={options.kinds.map((value) => ({
            value,
            label: unitKindLabels[value as keyof typeof unitKindLabels],
          }))}
        />
        <FilterSelect
          label="Category"
          name="category"
          value={filters.category}
          options={options.categories.map((value) => ({
            value,
            label: catalogueLabel(value),
          }))}
        />
        <FilterSelect
          label="Regiment type"
          name="regimentType"
          value={filters.regimentType}
          options={options.regimentTypes.map((value) => ({
            value,
            label: catalogueLabel(value),
          }))}
        />
        <FilterSelect
          label="Regiment group"
          name="regimentGroup"
          value={filters.regimentGroup}
          options={options.regimentGroups.map((value) => ({
            value,
            label: catalogueLabel(value),
          }))}
        />
        <FilterSelect
          label="DLC requirement"
          name="dlc"
          value={filters.dlc}
          options={[
            { value: "required", label: "Requires DLC" },
            { value: "none", label: "No DLC recorded" },
          ]}
        />
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-4 border-t border-ink-700 pt-5">
        <button
          className="focus-ring inline-flex min-h-11 cursor-pointer items-center rounded-sm bg-olive-400 px-5 py-2.5 text-sm font-black tracking-wide text-ink-950 uppercase hover:bg-olive-300"
          type="submit"
        >
          Apply filters
        </button>
        <p className="text-xs leading-5 text-slate-500">
          Filters are stored in the URL for sharing and refresh.
        </p>
      </div>
    </form>
  );
}

type FilterSelectProps = {
  label: string;
  name: string;
  value: string;
  options: Array<{ value: string; label: string }>;
};

function FilterSelect({ label, name, value, options }: FilterSelectProps) {
  return (
    <label>
      <span className="mb-2 block text-xs font-bold tracking-[0.12em] text-slate-400 uppercase">
        {label}
      </span>
      <select className={inputClassName} name={name} defaultValue={value}>
        <option value="">Any</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
