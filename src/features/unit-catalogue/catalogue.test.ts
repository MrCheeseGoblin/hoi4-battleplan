// @vitest-environment node

import { describe, expect, it } from "vitest";

import {
  findUnitCatalogueEntry,
  loadUnitCatalogue,
} from "@/features/unit-catalogue/catalogue";

describe("unit catalogue model", () => {
  it("resolves canonical relationships and authored guidance", () => {
    const catalogue = loadUnitCatalogue();
    const infantry = findUnitCatalogueEntry(catalogue, "infantry");

    expect(infantry).toEqual(
      expect.objectContaining({
        unit: expect.objectContaining({
          id: "infantry",
          stats: expect.objectContaining({
            organization: 60,
          }),
        }),
        equipmentRequirements: [
          expect.objectContaining({
            equipment: expect.objectContaining({
              name: "Infantry Equipment",
            }),
            amount: 100,
          }),
        ],
        relatedUnits: [
          expect.objectContaining({
            id: "motorized-infantry",
          }),
        ],
        guidance: expect.objectContaining({
          unitId: "infantry",
        }),
      }),
    );
  });

  it("returns undefined for an unknown stable unit ID", () => {
    expect(
      findUnitCatalogueEntry(loadUnitCatalogue(), "unknown-unit"),
    ).toBeUndefined();
  });
});
