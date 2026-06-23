import Link from "next/link";

import type { UnitCatalogueEntry } from "@/features/unit-catalogue/catalogue";
import { UnitCard } from "@/features/unit-catalogue/unit-card";

type CatalogueResultsProps = {
  entries: readonly UnitCatalogueEntry[];
  totalCount: number;
};

export function CatalogueResults({
  entries,
  totalCount,
}: CatalogueResultsProps) {
  return (
    <section aria-labelledby="catalogue-results-heading">
      <div className="flex flex-col justify-between gap-3 border-b border-ink-700 pb-5 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow">Available records</p>
          <h2
            id="catalogue-results-heading"
            className="mt-2 text-2xl font-black tracking-[-0.025em] text-paper-50"
          >
            {entries.length} of {totalCount} sample units
          </h2>
        </div>
        <p className="max-w-md text-sm leading-6 text-slate-500">
          This is a representative slice for proving the catalogue, not the
          complete HOI4 roster.
        </p>
      </div>

      {entries.length > 0 ? (
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {entries.map((entry) => (
            <UnitCard key={entry.unit.id} entry={entry} />
          ))}
        </div>
      ) : (
        <div className="panel mt-6 border-dashed p-8 text-center sm:p-12">
          <p className="text-xs font-black tracking-[0.18em] text-brass-300 uppercase">
            No matching units
          </p>
          <h3 className="mt-3 text-2xl font-bold text-paper-50">
            No sample record fits every filter.
          </h3>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-400">
            Broaden the search or clear one of the structural filters. The
            current dataset contains only six demonstration records.
          </p>
          <Link
            className="focus-ring mt-6 inline-flex min-h-11 items-center rounded-sm bg-olive-400 px-5 py-2.5 text-sm font-black text-ink-950 uppercase hover:bg-olive-300"
            href="/units"
          >
            Reset catalogue
          </Link>
        </div>
      )}
    </section>
  );
}
