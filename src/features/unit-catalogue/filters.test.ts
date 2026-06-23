// @vitest-environment node

import { describe, expect, it } from "vitest";

import { loadUnitCatalogue } from "@/features/unit-catalogue/catalogue";
import {
  filterCatalogueEntries,
  parseCatalogueFilters,
} from "@/features/unit-catalogue/filters";

const catalogue = loadUnitCatalogue();

describe("filterCatalogueEntries", () => {
  it("searches units by display name", () => {
    const results = filterCatalogueEntries(
      catalogue.entries,
      parseCatalogueFilters({ q: "artillery" }),
    );

    expect(results.map(({ unit }) => unit.id)).toEqual([
      "line-artillery",
      "support-artillery",
    ]);
  });

  it("filters by structural fields", () => {
    const results = filterCatalogueEntries(
      catalogue.entries,
      parseCatalogueFilters({
        kind: "line-battalion",
        regimentType: "mobile",
        regimentGroup: "mobile-battalions",
      }),
    );

    expect(results.map(({ unit }) => unit.id)).toEqual(["motorized-infantry"]);
  });

  it("combines name search, category, kind, and DLC state", () => {
    const results = filterCatalogueEntries(
      catalogue.entries,
      parseCatalogueFilters({
        q: "infantry",
        category: "infantry",
        kind: "line-battalion",
        dlc: "none",
      }),
    );

    expect(results.map(({ unit }) => unit.id)).toEqual(["infantry"]);
  });

  it("returns an empty collection when no unit matches every filter", () => {
    const results = filterCatalogueEntries(
      catalogue.entries,
      parseCatalogueFilters({
        q: "tank",
        kind: "support-company",
      }),
    );

    expect(results).toEqual([]);
  });
});
