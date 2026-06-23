import type { UnitCatalogueEntry } from "@/features/unit-catalogue/catalogue";

export type CatalogueFilters = {
  query: string;
  category: string;
  kind: string;
  regimentType: string;
  regimentGroup: string;
  dlc: string;
};

export type CatalogueSearchParams = Record<
  string,
  string | string[] | undefined
>;

const emptyFilters: CatalogueFilters = {
  query: "",
  category: "",
  kind: "",
  regimentType: "",
  regimentGroup: "",
  dlc: "",
};

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

export function parseCatalogueFilters(
  searchParams: CatalogueSearchParams,
): CatalogueFilters {
  return {
    query: firstValue(searchParams.q).trim(),
    category: firstValue(searchParams.category),
    kind: firstValue(searchParams.kind),
    regimentType: firstValue(searchParams.regimentType),
    regimentGroup: firstValue(searchParams.regimentGroup),
    dlc: firstValue(searchParams.dlc),
  };
}

export function hasCatalogueFilters(filters: CatalogueFilters) {
  return Object.values(filters).some(Boolean);
}

export function filterCatalogueEntries(
  entries: readonly UnitCatalogueEntry[],
  filters: CatalogueFilters = emptyFilters,
) {
  const normalizedQuery = filters.query.toLocaleLowerCase();

  return entries.filter(({ unit }) => {
    if (
      normalizedQuery &&
      !unit.name.toLocaleLowerCase().includes(normalizedQuery)
    ) {
      return false;
    }

    if (filters.category && unit.category !== filters.category) {
      return false;
    }

    if (filters.kind && unit.kind !== filters.kind) {
      return false;
    }

    if (filters.regimentType && unit.regimentType !== filters.regimentType) {
      return false;
    }

    if (filters.regimentGroup && unit.regimentGroup !== filters.regimentGroup) {
      return false;
    }

    if (filters.dlc === "required" && unit.requiredDlcIds.length === 0) {
      return false;
    }

    if (filters.dlc === "none" && unit.requiredDlcIds.length > 0) {
      return false;
    }

    return true;
  });
}

export function catalogueFilterOptions(entries: readonly UnitCatalogueEntry[]) {
  function unique(values: Array<string | null>) {
    return [
      ...new Set(values.filter((value): value is string => !!value)),
    ].sort((left, right) => left.localeCompare(right));
  }

  return {
    categories: unique(entries.map(({ unit }) => unit.category)),
    kinds: unique(entries.map(({ unit }) => unit.kind)),
    regimentTypes: unique(entries.map(({ unit }) => unit.regimentType)),
    regimentGroups: unique(entries.map(({ unit }) => unit.regimentGroup)),
  };
}
