// @vitest-environment node

import { describe, expect, it } from "vitest";

import { loadAllGameData } from "@/lib/game-data";
import {
  createEmptyDivisionTemplate,
  removeLineBattalion,
  removeSupportCompany,
  setLineBattalion,
  setSupportCompany,
} from "@/features/division-builder/template";
import { lineSlotIndex } from "@/features/division-builder/grid";
import { validateDivisionStructure } from "@/features/division-builder/validation";

const dataSet = loadAllGameData()[0]!;

describe("division template operations", () => {
  it("places compatible battalions from the top of a regiment", () => {
    const empty = createEmptyDivisionTemplate(dataSet.version.id);
    const first = setLineBattalion(empty, 0, 0, "infantry", dataSet);
    expect(first.ok).toBe(true);

    const second = setLineBattalion(first.template, 1, 0, "infantry", dataSet);

    expect(second.ok).toBe(true);
    expect(second.template.lineSlots[lineSlotIndex(1, 0)]).toBe("infantry");
    expect(
      validateDivisionStructure(second.template, dataSet).filter(
        (issue) => issue.severity === "error",
      ),
    ).toEqual([]);
  });

  it("rejects a battalion from a different regiment group", () => {
    const empty = createEmptyDivisionTemplate(dataSet.version.id);
    const first = setLineBattalion(empty, 0, 0, "infantry", dataSet);
    const result = setLineBattalion(
      first.template,
      1,
      0,
      "line-artillery",
      dataSet,
    );

    expect(result).toEqual(
      expect.objectContaining({
        ok: false,
        issue: expect.objectContaining({
          code: "invalid-regiment-group",
        }),
      }),
    );
    expect(result.template).toBe(first.template);
  });

  it("rejects line placement below an empty slot", () => {
    const template = createEmptyDivisionTemplate(dataSet.version.id);
    const result = setLineBattalion(template, 1, 2, "infantry", dataSet);

    expect(result.ok).toBe(false);
    expect(result.ok ? null : result.issue.code).toBe("line-gap");
  });

  it("enforces support-company kind and uniqueness", () => {
    const template = createEmptyDivisionTemplate(dataSet.version.id);
    const overflow = setSupportCompany(
      template,
      5,
      "engineer-company",
      dataSet,
    );
    expect(overflow.ok).toBe(false);
    expect(overflow.ok ? null : overflow.issue.code).toBe("invalid-slot");

    const wrongKind = setSupportCompany(template, 0, "infantry", dataSet);
    expect(wrongKind.ok).toBe(false);
    expect(wrongKind.ok ? null : wrongKind.issue.code).toBe("wrong-unit-kind");

    const first = setSupportCompany(template, 0, "engineer-company", dataSet);
    const duplicate = setSupportCompany(
      first.template,
      1,
      "engineer-company",
      dataSet,
    );

    expect(duplicate.ok).toBe(false);
    expect(duplicate.ok ? null : duplicate.issue.code).toBe(
      "duplicate-support",
    );
  });

  it("adds, replaces, removes, and compacts selected units immutably", () => {
    const empty = createEmptyDivisionTemplate(dataSet.version.id);
    const infantry = setLineBattalion(empty, 0, 0, "infantry", dataSet);
    const replaced = setLineBattalion(
      infantry.template,
      0,
      0,
      "medium-tank",
      dataSet,
    );
    const secondTank = setLineBattalion(
      replaced.template,
      1,
      0,
      "medium-tank",
      dataSet,
    );
    const removed = removeLineBattalion(secondTank.template, 0, 0);

    expect(empty.lineSlots[lineSlotIndex(0, 0)]).toBeNull();
    expect(replaced.ok).toBe(true);
    expect(removed.lineSlots[lineSlotIndex(0, 0)]).toBe("medium-tank");
    expect(removed.lineSlots[lineSlotIndex(1, 0)]).toBeNull();

    const support = setSupportCompany(removed, 0, "engineer-company", dataSet);
    expect(
      removeSupportCompany(support.template, 0).supportSlots[0],
    ).toBeNull();
  });
});
