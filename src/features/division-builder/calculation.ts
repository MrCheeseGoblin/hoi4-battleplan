import type { GameDataSet, Unit } from "@/lib/game-data";
import type { UnitStats } from "@/features/division-builder/calculation-types";
import type {
  DivisionCalculation,
  DivisionTemplate,
  EquipmentTotal,
} from "@/features/division-builder/types";
import { validateDivisionStructure } from "@/features/division-builder/validation";

const additiveStats = [
  "hp",
  "suppression",
  "weight",
  "supplyUse",
  "fuelUse",
  "softAttack",
  "hardAttack",
  "airAttack",
  "defense",
  "breakthrough",
  "entrenchment",
] as const satisfies ReadonlyArray<keyof UnitStats>;

function round(value: number) {
  return Math.round(value * 1000) / 1000;
}

function average(units: Unit[], key: keyof UnitStats) {
  return units.length === 0
    ? 0
    : round(
        units.reduce((total, unit) => total + unit.stats[key], 0) /
          units.length,
      );
}

export function calculateDivisionStats(
  template: DivisionTemplate,
  dataSet: GameDataSet,
): DivisionCalculation {
  const unitById = new Map(dataSet.units.map((unit) => [unit.id, unit]));
  const equipmentById = new Map(
    dataSet.equipment.map((equipment) => [equipment.id, equipment]),
  );
  const lineUnits = template.lineSlots
    .map((unitId) => (unitId ? unitById.get(unitId) : undefined))
    .filter(
      (unit): unit is Extract<Unit, { kind: "line-battalion" }> =>
        unit?.kind === "line-battalion",
    );
  const supportUnits = template.supportSlots
    .map((unitId) => (unitId ? unitById.get(unitId) : undefined))
    .filter(
      (unit): unit is Extract<Unit, { kind: "support-company" }> =>
        unit?.kind === "support-company",
    );
  const allUnits: Unit[] = [...lineUnits, ...supportUnits];
  const stats: UnitStats = {
    organization: average(lineUnits, "organization"),
    recoveryRate: average(lineUnits, "recoveryRate"),
    hardness: average(lineUnits, "hardness"),
    speed:
      lineUnits.length === 0
        ? 0
        : Math.min(...lineUnits.map((unit) => unit.stats.speed)),
    armor:
      allUnits.length === 0
        ? 0
        : Math.max(...allUnits.map((unit) => unit.stats.armor)),
    piercing:
      allUnits.length === 0
        ? 0
        : Math.max(...allUnits.map((unit) => unit.stats.piercing)),
    hp: 0,
    suppression: 0,
    weight: 0,
    supplyUse: 0,
    fuelUse: 0,
    softAttack: 0,
    hardAttack: 0,
    airAttack: 0,
    defense: 0,
    breakthrough: 0,
    entrenchment: 0,
  };

  for (const key of additiveStats) {
    stats[key] = round(
      allUnits.reduce((total, unit) => total + unit.stats[key], 0),
    );
  }

  const equipmentAmounts = new Map<string, number>();

  allUnits.forEach((unit) => {
    unit.equipmentRequirements.forEach((requirement) => {
      equipmentAmounts.set(
        requirement.equipmentId,
        (equipmentAmounts.get(requirement.equipmentId) ?? 0) +
          requirement.amount,
      );
    });
  });

  const equipment: EquipmentTotal[] = [...equipmentAmounts.entries()]
    .map(([equipmentId, amount]) => ({
      equipmentId,
      name: equipmentById.get(equipmentId)?.name ?? equipmentId,
      amount,
    }))
    .sort((left, right) => left.name.localeCompare(right.name));

  return {
    stats: {
      ...stats,
      combatWidth: lineUnits.reduce(
        (total, unit) => total + unit.combatWidth,
        0,
      ),
      lineBattalionCount: lineUnits.length,
      supportCompanyCount: supportUnits.length,
    },
    equipment,
    issues: validateDivisionStructure(template, dataSet),
  };
}
