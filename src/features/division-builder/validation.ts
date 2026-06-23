import type { GameDataSet, Unit } from "@/lib/game-data";
import {
  DIVISION_GRID_COLUMNS,
  DIVISION_GRID_ROWS,
  DIVISION_SUPPORT_SLOTS,
  type DivisionTemplate,
  type TemplateIssue,
} from "@/features/division-builder/types";
import { lineSlotIndex } from "@/features/division-builder/grid";

function unitMap(dataSet: GameDataSet) {
  return new Map<string, Unit>(dataSet.units.map((unit) => [unit.id, unit]));
}

export function validateDivisionStructure(
  template: DivisionTemplate,
  dataSet: GameDataSet,
): TemplateIssue[] {
  const issues: TemplateIssue[] = [];
  const units = unitMap(dataSet);
  let lineBattalionCount = 0;

  if (
    template.lineSlots.length !==
    DIVISION_GRID_ROWS * DIVISION_GRID_COLUMNS
  ) {
    issues.push({
      code: "invalid-slot",
      severity: "error",
      message: `Division templates must contain exactly ${DIVISION_GRID_ROWS * DIVISION_GRID_COLUMNS} line slots.`,
    });
  }

  if (template.supportSlots.length !== DIVISION_SUPPORT_SLOTS) {
    issues.push({
      code: "invalid-slot",
      severity: "error",
      message: `Division templates must contain exactly ${DIVISION_SUPPORT_SLOTS} support slots.`,
    });
  }

  for (let column = 0; column < DIVISION_GRID_COLUMNS; column += 1) {
    let columnGroup: string | null = null;
    let foundGap = false;

    for (let row = 0; row < DIVISION_GRID_ROWS; row += 1) {
      const unitId = template.lineSlots[lineSlotIndex(row, column)];

      if (!unitId) {
        foundGap = true;
        continue;
      }

      lineBattalionCount += 1;
      const unit = units.get(unitId);

      if (!unit) {
        issues.push({
          code: "unknown-unit",
          severity: "error",
          message: `Line slot references unknown unit "${unitId}".`,
          location: { kind: "line", row, column },
        });
        continue;
      }

      if (unit.kind !== "line-battalion") {
        issues.push({
          code: "wrong-unit-kind",
          severity: "error",
          message: `${unit.name} is a support company and cannot occupy a line slot.`,
          location: { kind: "line", row, column },
        });
        continue;
      }

      if (foundGap) {
        issues.push({
          code: "line-gap",
          severity: "error",
          message: `Fill regiment ${column + 1} from the top before using row ${row + 1}.`,
          location: { kind: "line", row, column },
        });
      }

      if (!columnGroup) {
        columnGroup = unit.regimentGroup;
      } else if (unit.regimentGroup !== columnGroup) {
        issues.push({
          code: "invalid-regiment-group",
          severity: "error",
          message: `${unit.name} belongs to ${unit.regimentGroup}; regiment ${column + 1} is locked to ${columnGroup}.`,
          location: { kind: "line", row, column },
        });
      }
    }
  }

  const usedSupportIds = new Set<string>();

  template.supportSlots.forEach((unitId, index) => {
    if (!unitId) {
      return;
    }

    const unit = units.get(unitId);

    if (!unit) {
      issues.push({
        code: "unknown-unit",
        severity: "error",
        message: `Support slot references unknown unit "${unitId}".`,
        location: { kind: "support", index },
      });
      return;
    }

    if (unit.kind !== "support-company") {
      issues.push({
        code: "wrong-unit-kind",
        severity: "error",
        message: `${unit.name} is a line battalion and cannot occupy a support slot.`,
        location: { kind: "support", index },
      });
      return;
    }

    if (usedSupportIds.has(unitId)) {
      issues.push({
        code: "duplicate-support",
        severity: "error",
        message: `${unit.name} is already assigned to another support slot.`,
        location: { kind: "support", index },
      });
    }

    usedSupportIds.add(unitId);
  });

  if (lineBattalionCount === 0) {
    issues.push({
      code: "empty-division",
      severity: "warning",
      message:
        "Add at least one line battalion before evaluating this division.",
    });
  }

  return issues;
}
