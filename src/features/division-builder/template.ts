import type { GameDataSet } from "@/lib/game-data";
import {
  DIVISION_GRID_COLUMNS,
  DIVISION_GRID_ROWS,
  DIVISION_SUPPORT_SLOTS,
  type DivisionRoleId,
  type DivisionTemplate,
  type TemplateIssue,
  type TemplateOperationResult,
} from "@/features/division-builder/types";
import { validateDivisionStructure } from "@/features/division-builder/validation";
import { lineSlotIndex } from "@/features/division-builder/grid";

export function createEmptyDivisionTemplate(
  gameVersionId: string,
  roleId: DivisionRoleId = "defensive-line-infantry",
): DivisionTemplate {
  return {
    gameVersionId,
    lineSlots: Array.from(
      { length: DIVISION_GRID_ROWS * DIVISION_GRID_COLUMNS },
      () => null,
    ),
    supportSlots: Array.from({ length: DIVISION_SUPPORT_SLOTS }, () => null),
    roleId,
  };
}

function invalidOperation(
  template: DivisionTemplate,
  issue: TemplateIssue,
): TemplateOperationResult {
  return { ok: false, template, issue };
}

export function setLineBattalion(
  template: DivisionTemplate,
  row: number,
  column: number,
  unitId: string,
  dataSet: GameDataSet,
): TemplateOperationResult {
  if (
    !Number.isInteger(row) ||
    !Number.isInteger(column) ||
    row < 0 ||
    row >= DIVISION_GRID_ROWS ||
    column < 0 ||
    column >= DIVISION_GRID_COLUMNS
  ) {
    return invalidOperation(template, {
      code: "invalid-slot",
      severity: "error",
      message: `Line slot row ${row + 1}, regiment ${column + 1} is outside the ${DIVISION_GRID_ROWS} × ${DIVISION_GRID_COLUMNS} grid.`,
    });
  }

  const unit = dataSet.units.find((candidate) => candidate.id === unitId);

  if (!unit) {
    return invalidOperation(template, {
      code: "unknown-unit",
      severity: "error",
      message: `Unit "${unitId}" is not available in ${dataSet.version.id}.`,
      location: { kind: "line", row, column },
    });
  }

  if (unit.kind !== "line-battalion") {
    return invalidOperation(template, {
      code: "wrong-unit-kind",
      severity: "error",
      message: `${unit.name} is a support company and cannot occupy a line slot.`,
      location: { kind: "line", row, column },
    });
  }

  const candidate: DivisionTemplate = {
    ...template,
    lineSlots: [...template.lineSlots],
  };
  candidate.lineSlots[lineSlotIndex(row, column)] = unitId;

  const issue = validateDivisionStructure(candidate, dataSet).find(
    (candidateIssue) =>
      candidateIssue.severity === "error" &&
      candidateIssue.location?.kind === "line" &&
      candidateIssue.location.column === column,
  );

  return issue
    ? invalidOperation(template, issue)
    : { ok: true, template: candidate };
}

export function removeLineBattalion(
  template: DivisionTemplate,
  row: number,
  column: number,
): DivisionTemplate {
  const columnUnits = Array.from(
    { length: DIVISION_GRID_ROWS },
    (_, index) => template.lineSlots[lineSlotIndex(index, column)],
  ).filter((unitId): unitId is string => unitId !== null);
  columnUnits.splice(row, 1);

  const lineSlots = [...template.lineSlots];

  for (let index = 0; index < DIVISION_GRID_ROWS; index += 1) {
    lineSlots[lineSlotIndex(index, column)] = columnUnits[index] ?? null;
  }

  return { ...template, lineSlots };
}

export function setSupportCompany(
  template: DivisionTemplate,
  index: number,
  unitId: string,
  dataSet: GameDataSet,
): TemplateOperationResult {
  if (
    !Number.isInteger(index) ||
    index < 0 ||
    index >= DIVISION_SUPPORT_SLOTS
  ) {
    return invalidOperation(template, {
      code: "invalid-slot",
      severity: "error",
      message: `Support slot ${index + 1} is outside the ${DIVISION_SUPPORT_SLOTS}-slot limit.`,
    });
  }

  const unit = dataSet.units.find((candidate) => candidate.id === unitId);

  if (!unit) {
    return invalidOperation(template, {
      code: "unknown-unit",
      severity: "error",
      message: `Unit "${unitId}" is not available in ${dataSet.version.id}.`,
      location: { kind: "support", index },
    });
  }

  if (unit.kind !== "support-company") {
    return invalidOperation(template, {
      code: "wrong-unit-kind",
      severity: "error",
      message: `${unit.name} is a line battalion and cannot occupy a support slot.`,
      location: { kind: "support", index },
    });
  }

  if (
    template.supportSlots.some(
      (assignedUnitId, assignedIndex) =>
        assignedIndex !== index && assignedUnitId === unitId,
    )
  ) {
    return invalidOperation(template, {
      code: "duplicate-support",
      severity: "error",
      message: `${unit.name} is already assigned to another support slot.`,
      location: { kind: "support", index },
    });
  }

  const candidate: DivisionTemplate = {
    ...template,
    supportSlots: [...template.supportSlots],
  };
  candidate.supportSlots[index] = unitId;

  const issue = validateDivisionStructure(candidate, dataSet).find(
    (candidateIssue) =>
      candidateIssue.severity === "error" &&
      candidateIssue.location?.kind === "support" &&
      candidateIssue.location.index === index,
  );

  return issue
    ? invalidOperation(template, issue)
    : { ok: true, template: candidate };
}

export function removeSupportCompany(
  template: DivisionTemplate,
  index: number,
): DivisionTemplate {
  const supportSlots = [...template.supportSlots];
  supportSlots[index] = null;
  return { ...template, supportSlots };
}
