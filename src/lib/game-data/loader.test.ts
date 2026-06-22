// @vitest-environment node

import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { GameDataValidationError } from "@/lib/game-data/errors";
import { loadGameDataVersion } from "@/lib/game-data/loader";

type JsonRecord = Record<string, unknown>;

const temporaryRoots: string[] = [];

function writeJson(filePath: string, value: unknown) {
  writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function validStats() {
  return {
    organization: 60,
    hp: 25,
    recoveryRate: 0.3,
    suppression: 1.5,
    weight: 0.5,
    supplyUse: 0.07,
    fuelUse: 0,
    speed: 4,
    softAttack: 6,
    hardAttack: 1,
    airAttack: 0,
    defense: 22,
    breakthrough: 2,
    armor: 0,
    piercing: 5,
    hardness: 0,
    entrenchment: 2,
  };
}

function validInfantry(overrides: JsonRecord = {}) {
  return {
    id: "infantry",
    name: "Infantry",
    kind: "line-battalion",
    category: "infantry",
    combatWidth: 2,
    regimentType: "infantry",
    regimentGroup: "infantry-battalions",
    requiredDlcIds: [],
    equipmentRequirements: [
      {
        equipmentId: "infantry-equipment",
        amount: 100,
      },
    ],
    relatedUnitIds: [],
    stats: validStats(),
    ...overrides,
  };
}

function createFixture(options?: {
  lineUnits?: JsonRecord[];
  supportUnits?: JsonRecord[];
}) {
  const gameDataRoot = mkdtempSync(
    path.join(os.tmpdir(), "battleplan-game-data-"),
  );
  temporaryRoots.push(gameDataRoot);

  const versionDirectory = path.join(gameDataRoot, "test-version");
  const unitsDirectory = path.join(versionDirectory, "units");
  mkdirSync(unitsDirectory, { recursive: true });

  writeJson(path.join(versionDirectory, "metadata.json"), {
    schemaVersion: 1,
    id: "test-version",
    label: "Test version",
    gameVersion: "Test",
    status: "sample",
    verifiedAt: null,
    sourceNotes: ["Fixture data."],
  });
  writeJson(path.join(versionDirectory, "dlcs.json"), {
    schemaVersion: 1,
    dlcs: [{ id: "test-dlc", name: "Test DLC" }],
  });
  writeJson(path.join(versionDirectory, "equipment.json"), {
    schemaVersion: 1,
    equipment: [
      {
        id: "infantry-equipment",
        name: "Infantry Equipment",
        category: "infantry-equipment",
      },
    ],
  });
  writeJson(path.join(unitsDirectory, "line.json"), {
    schemaVersion: 1,
    units: options?.lineUnits ?? [validInfantry()],
  });

  if (options?.supportUnits) {
    writeJson(path.join(unitsDirectory, "support.json"), {
      schemaVersion: 1,
      units: options.supportUnits,
    });
  }

  return { gameDataRoot, versionDirectory };
}

afterEach(() => {
  for (const root of temporaryRoots.splice(0)) {
    if (path.basename(root).startsWith("battleplan-game-data-")) {
      rmSync(root, { recursive: true, force: true });
    }
  }
});

describe("loadGameDataVersion", () => {
  it("loads a valid version into one canonical typed dataset", () => {
    const fixture = createFixture();

    const dataSet = loadGameDataVersion(
      fixture.versionDirectory,
      fixture.gameDataRoot,
    );

    expect(dataSet.version.id).toBe("test-version");
    expect(dataSet.equipment).toHaveLength(1);
    expect(dataSet.units).toEqual([
      expect.objectContaining({
        id: "infantry",
        kind: "line-battalion",
      }),
    ]);
  });

  it("reports the file and field for schema-invalid data", () => {
    const fixture = createFixture({
      lineUnits: [validInfantry({ combatWidth: 0 })],
    });

    expect(() =>
      loadGameDataVersion(fixture.versionDirectory, fixture.gameDataRoot),
    ).toThrowError(GameDataValidationError);

    try {
      loadGameDataVersion(fixture.versionDirectory, fixture.gameDataRoot);
    } catch (error) {
      expect(error).toBeInstanceOf(GameDataValidationError);
      expect((error as GameDataValidationError).issues).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            code: "schema",
            file: "test-version/units/line.json",
            field: "units[0].combatWidth",
          }),
        ]),
      );
    }
  });

  it("rejects duplicate stable IDs across separate unit files", () => {
    const fixture = createFixture({
      supportUnits: [validInfantry({ name: "Duplicate Infantry" })],
    });

    expect(() =>
      loadGameDataVersion(fixture.versionDirectory, fixture.gameDataRoot),
    ).toThrowError(/Stable ID "infantry" is already defined/);
  });

  it("rejects broken equipment and related-unit references", () => {
    const fixture = createFixture({
      lineUnits: [
        validInfantry({
          equipmentRequirements: [
            { equipmentId: "missing-equipment", amount: 10 },
          ],
          relatedUnitIds: ["missing-unit"],
        }),
      ],
    });

    try {
      loadGameDataVersion(fixture.versionDirectory, fixture.gameDataRoot);
      expect.unreachable("Expected broken references to fail validation.");
    } catch (error) {
      expect(error).toBeInstanceOf(GameDataValidationError);
      expect((error as GameDataValidationError).issues).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            code: "broken-reference",
            field: "units[0].equipmentRequirements[0].equipmentId",
          }),
          expect.objectContaining({
            code: "broken-reference",
            field: "units[0].relatedUnitIds[0]",
          }),
        ]),
      );
    }
  });
});
