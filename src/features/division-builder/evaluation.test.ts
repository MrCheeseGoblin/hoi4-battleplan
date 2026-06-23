// @vitest-environment node

import { describe, expect, it } from "vitest";

import { loadAllGameData } from "@/lib/game-data";
import { calculateDivisionStats } from "@/features/division-builder/calculation";
import { evaluateDivision } from "@/features/division-builder/evaluation";
import {
  createEmptyDivisionTemplate,
  setLineBattalion,
  setSupportCompany,
} from "@/features/division-builder/template";

const dataSet = loadAllGameData()[0]!;

function infantryTemplate() {
  let template = createEmptyDivisionTemplate(dataSet.version.id);
  template = setLineBattalion(template, 0, 0, "infantry", dataSet).template;
  template = setLineBattalion(template, 1, 0, "infantry", dataSet).template;
  return template;
}

describe("evaluateDivision", () => {
  it("does not score an empty division", () => {
    const template = createEmptyDivisionTemplate(dataSet.version.id);
    const result = evaluateDivision(
      template,
      calculateDivisionStats(template, dataSet),
      dataSet,
    );

    expect(result.suitability).toBe("not-ready");
    expect(result.roleScore).toBeNull();
    expect(result.criticalWarnings).toContain(
      "The division has no line battalions.",
    );
    expect(result.suggestions).toContain(
      "Add at least two compatible line battalions.",
    );
  });

  it("evaluates defensive line infantry with readable dimensions", () => {
    let template = infantryTemplate();
    template = setSupportCompany(
      template,
      0,
      "engineer-company",
      dataSet,
    ).template;
    const result = evaluateDivision(
      template,
      calculateDivisionStats(template, dataSet),
      dataSet,
    );

    expect(result.roleId).toBe("defensive-line-infantry");
    expect(result.suitability).toBe("strong");
    expect(result.dimensions.map((dimension) => dimension.id)).toEqual([
      "organization",
      "defense",
      "hp",
      "entrenchment",
      "logistics",
    ]);
    expect(result.strengths.length).toBeGreaterThan(0);
  });

  it("evaluates offensive infantry and generates practical suggestions", () => {
    const template = {
      ...infantryTemplate(),
      roleId: "offensive-infantry" as const,
    };
    const result = evaluateDivision(
      template,
      calculateDivisionStats(template, dataSet),
      dataSet,
    );

    expect(result.roleId).toBe("offensive-infantry");
    expect(result.suitability).toBe("poor");
    expect(result.weaknesses).toEqual(
      expect.arrayContaining([
        expect.stringContaining("Soft attack per width"),
        expect.stringContaining("Breakthrough per width"),
      ]),
    );
    expect(result.suggestions).toEqual(
      expect.arrayContaining([
        expect.stringContaining("artillery"),
        expect.stringContaining("breakthrough-oriented"),
      ]),
    );
  });

  it("generates critical warnings for incomplete fuel-dependent templates", () => {
    let template = createEmptyDivisionTemplate(dataSet.version.id);
    template = setLineBattalion(
      template,
      0,
      0,
      "medium-tank",
      dataSet,
    ).template;
    const result = evaluateDivision(
      template,
      calculateDivisionStats(template, dataSet),
      dataSet,
    );

    expect(result.criticalWarnings).toEqual(
      expect.arrayContaining([
        expect.stringContaining("one-battalion template"),
        expect.stringContaining("Organization is below 20"),
        expect.stringContaining("consumes fuel"),
      ]),
    );
    expect(result.roleScore).toBeLessThanOrEqual(44);
    expect(result.suggestions.length).toBeGreaterThan(0);
  });

  it("returns deterministic results for the same template and dataset", () => {
    const template = infantryTemplate();
    const calculation = calculateDivisionStats(template, dataSet);

    expect(evaluateDivision(template, calculation, dataSet)).toEqual(
      evaluateDivision(template, calculation, dataSet),
    );
  });
});
