// @vitest-environment node

import { describe, expect, it } from "vitest";

import { loadAllGameData } from "@/lib/game-data";
import { calculateDivisionStats } from "@/features/division-builder/calculation";
import {
  createEmptyDivisionTemplate,
  setLineBattalion,
  setSupportCompany,
} from "@/features/division-builder/template";

const dataSet = loadAllGameData()[0]!;

describe("calculateDivisionStats", () => {
  it("returns a zeroed result and warning for an empty division", () => {
    const calculation = calculateDivisionStats(
      createEmptyDivisionTemplate(dataSet.version.id),
      dataSet,
    );

    expect(calculation.stats).toEqual(
      expect.objectContaining({
        combatWidth: 0,
        lineBattalionCount: 0,
        supportCompanyCount: 0,
        organization: 0,
        softAttack: 0,
      }),
    );
    expect(calculation.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "empty-division" }),
      ]),
    );
  });

  it("aggregates canonical statistics and equipment requirements", () => {
    let template = createEmptyDivisionTemplate(dataSet.version.id);
    template = setLineBattalion(template, 0, 0, "infantry", dataSet).template;
    template = setLineBattalion(template, 1, 0, "infantry", dataSet).template;
    template = setSupportCompany(
      template,
      0,
      "support-artillery",
      dataSet,
    ).template;

    const calculation = calculateDivisionStats(template, dataSet);

    expect(calculation.stats).toEqual(
      expect.objectContaining({
        combatWidth: 4,
        lineBattalionCount: 2,
        supportCompanyCount: 1,
        organization: 60,
        hp: 50.2,
        softAttack: 27,
        defense: 48,
        speed: 4,
        supplyUse: 0.19,
      }),
    );
    expect(calculation.equipment).toEqual([
      {
        equipmentId: "artillery-equipment",
        name: "Artillery Equipment",
        amount: 12,
      },
      {
        equipmentId: "infantry-equipment",
        name: "Infantry Equipment",
        amount: 200,
      },
    ]);
  });
});
