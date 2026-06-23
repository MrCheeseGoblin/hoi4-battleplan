import type { Dlc, Equipment, GameDataSet, Unit } from "@/lib/game-data";
import { loadAllGameData } from "@/lib/game-data";
import {
  loadUnitGuidance,
  type UnitGuidance,
} from "@/features/unit-catalogue/guidance";

export const CATALOGUE_VERSION_ID = "1.16-sample";

export type UnitCatalogueEntry = {
  unit: Unit;
  guidance: UnitGuidance | null;
  equipmentRequirements: Array<{
    equipment: Equipment;
    amount: number;
  }>;
  requiredDlcs: Dlc[];
  relatedUnits: Unit[];
};

export type UnitCatalogue = {
  dataSet: GameDataSet;
  entries: UnitCatalogueEntry[];
};

export function createUnitCatalogue(
  dataSet: GameDataSet,
  guidanceByUnitId: ReadonlyMap<string, UnitGuidance>,
): UnitCatalogue {
  const equipmentById = new Map(
    dataSet.equipment.map((equipment) => [equipment.id, equipment]),
  );
  const dlcById = new Map(dataSet.dlcs.map((dlc) => [dlc.id, dlc]));
  const unitById = new Map(dataSet.units.map((unit) => [unit.id, unit]));

  const entries = dataSet.units
    .map<UnitCatalogueEntry>((unit) => ({
      unit,
      guidance: guidanceByUnitId.get(unit.id) ?? null,
      equipmentRequirements: unit.equipmentRequirements.map((requirement) => ({
        equipment: equipmentById.get(requirement.equipmentId)!,
        amount: requirement.amount,
      })),
      requiredDlcs: unit.requiredDlcIds.map((id) => dlcById.get(id)!),
      relatedUnits: unit.relatedUnitIds.map((id) => unitById.get(id)!),
    }))
    .sort((left, right) => left.unit.name.localeCompare(right.unit.name));

  return { dataSet, entries };
}

export function loadUnitCatalogue(): UnitCatalogue {
  const dataSet = loadAllGameData().find(
    (candidate) => candidate.version.id === CATALOGUE_VERSION_ID,
  );

  if (!dataSet) {
    throw new Error(
      `Catalogue game version "${CATALOGUE_VERSION_ID}" was not found.`,
    );
  }

  return createUnitCatalogue(dataSet, loadUnitGuidance(dataSet));
}

export function findUnitCatalogueEntry(
  catalogue: UnitCatalogue,
  unitId: string,
) {
  return catalogue.entries.find((entry) => entry.unit.id === unitId);
}
