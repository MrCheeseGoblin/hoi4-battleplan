import type { Metadata } from "next";

import { CatalogueFiltersForm } from "@/features/unit-catalogue/catalogue-filters";
import { CatalogueResults } from "@/features/unit-catalogue/catalogue-results";
import { loadUnitCatalogue } from "@/features/unit-catalogue/catalogue";
import {
  filterCatalogueEntries,
  parseCatalogueFilters,
  type CatalogueSearchParams,
} from "@/features/unit-catalogue/filters";
import { PageIntro } from "@/components/ui/page-intro";

export const metadata: Metadata = {
  title: "Unit catalogue",
  description:
    "Search and inspect a compact, practical sample catalogue of Hearts of Iron IV units.",
};

type UnitsPageProps = {
  searchParams: Promise<CatalogueSearchParams>;
};

export default async function UnitsPage({ searchParams }: UnitsPageProps) {
  const catalogue = loadUnitCatalogue();
  const filters = parseCatalogueFilters(await searchParams);
  const filteredEntries = filterCatalogueEntries(catalogue.entries, filters);

  return (
    <>
      <PageIntro
        eyebrow="Phase 3 / Unit catalogue"
        title="Know what each unit contributes."
        description="Search a compact representative sample, compare canonical mechanics, and read practical guidance without mixing opinion into the game-data layer."
        aside={
          <div className="flex flex-wrap gap-2 lg:justify-end">
            <span className="rounded-full border border-brass-400/35 bg-brass-400/8 px-3 py-2 text-xs font-bold tracking-[0.1em] text-brass-300 uppercase">
              {catalogue.dataSet.version.status} data
            </span>
            <span className="rounded-full border border-ink-600 bg-ink-900 px-3 py-2 text-xs font-bold tracking-[0.1em] text-slate-300 uppercase">
              {catalogue.dataSet.version.gameVersion}
            </span>
          </div>
        }
      />

      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <aside
          className="mb-8 border-l-2 border-brass-400 bg-brass-400/5 p-5"
          aria-label="Sample data warning"
        >
          <p className="text-sm leading-6 text-slate-300">
            <strong className="text-brass-300">Incomplete sample:</strong> this
            catalogue contains {catalogue.entries.length} representative,
            unverified records. It is not the full HOI4 unit roster and should
            not be treated as authoritative balance data.
          </p>
        </aside>

        <CatalogueFiltersForm entries={catalogue.entries} filters={filters} />

        <div className="mt-10">
          <CatalogueResults
            entries={filteredEntries}
            totalCount={catalogue.entries.length}
          />
        </div>
      </div>
    </>
  );
}
