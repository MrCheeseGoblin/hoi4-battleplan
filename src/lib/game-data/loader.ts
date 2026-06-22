import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

import type { z } from "zod";

import {
  type GameDataIssue,
  GameDataValidationError,
} from "@/lib/game-data/errors";
import {
  dlcFileSchema,
  equipmentFileSchema,
  type GameDataSet,
  gameVersionSchema,
  unitFileSchema,
} from "@/lib/game-data/schemas";

type ParsedFile<T> = {
  file: string;
  data: T;
};

function toPortablePath(filePath: string) {
  return filePath.split(path.sep).join("/");
}

function relativeFile(rootDirectory: string, filePath: string) {
  return toPortablePath(path.relative(rootDirectory, filePath));
}

function zodPath(pathSegments: PropertyKey[]) {
  return pathSegments.reduce<string>((result, segment) => {
    if (typeof segment === "number") {
      return `${result}[${segment}]`;
    }

    const property = String(segment);
    return result ? `${result}.${property}` : property;
  }, "");
}

function parseJsonFile<T>(
  rootDirectory: string,
  filePath: string,
  schema: z.ZodType<T>,
  issues: GameDataIssue[],
): ParsedFile<T> | null {
  const file = relativeFile(rootDirectory, filePath);

  if (!existsSync(filePath)) {
    issues.push({
      code: "file-not-found",
      file,
      message: "Required game-data file does not exist.",
    });
    return null;
  }

  let value: unknown;

  try {
    value = JSON.parse(readFileSync(filePath, "utf8"));
  } catch (error) {
    issues.push({
      code: "invalid-json",
      file,
      message:
        error instanceof Error ? error.message : "Could not parse JSON file.",
    });
    return null;
  }

  const result = schema.safeParse(value);

  if (!result.success) {
    for (const validationIssue of result.error.issues) {
      issues.push({
        code: "schema",
        file,
        field: zodPath(validationIssue.path),
        message: validationIssue.message,
      });
    }
    return null;
  }

  return { file, data: result.data };
}

function findDuplicates(
  records: ReadonlyArray<{
    id: string;
    sourceFile: string;
    sourceIndex: number;
  }>,
  entityName: string,
  issues: GameDataIssue[],
) {
  const firstRecordById = new Map<string, (typeof records)[number]>();

  for (const record of records) {
    const firstRecord = firstRecordById.get(record.id);

    if (!firstRecord) {
      firstRecordById.set(record.id, record);
      continue;
    }

    issues.push({
      code: "duplicate-id",
      file: record.sourceFile,
      field: `${entityName}[${record.sourceIndex}].id`,
      message: `Stable ID "${record.id}" is already defined in ${firstRecord.sourceFile}:${entityName}[${firstRecord.sourceIndex}].id.`,
    });
  }
}

function validateReferences(
  dataSet: GameDataSet,
  unitSources: ReadonlyArray<{ file: string; index: number }>,
  issues: GameDataIssue[],
) {
  const dlcIds = new Set(dataSet.dlcs.map((dlc) => dlc.id));
  const equipmentIds = new Set(
    dataSet.equipment.map((equipment) => equipment.id),
  );
  const unitIds = new Set(dataSet.units.map((unit) => unit.id));

  dataSet.units.forEach((unit, unitIndex) => {
    const source = unitSources[unitIndex];

    if (!source) {
      return;
    }

    unit.requiredDlcIds.forEach((dlcId, referenceIndex) => {
      if (!dlcIds.has(dlcId)) {
        issues.push({
          code: "broken-reference",
          file: source.file,
          field: `units[${source.index}].requiredDlcIds[${referenceIndex}]`,
          message: `DLC "${dlcId}" does not exist in this game version.`,
        });
      }
    });

    unit.equipmentRequirements.forEach((requirement, referenceIndex) => {
      if (!equipmentIds.has(requirement.equipmentId)) {
        issues.push({
          code: "broken-reference",
          file: source.file,
          field: `units[${source.index}].equipmentRequirements[${referenceIndex}].equipmentId`,
          message: `Equipment "${requirement.equipmentId}" does not exist in this game version.`,
        });
      }
    });

    unit.relatedUnitIds.forEach((relatedUnitId, referenceIndex) => {
      if (relatedUnitId === unit.id) {
        issues.push({
          code: "broken-reference",
          file: source.file,
          field: `units[${source.index}].relatedUnitIds[${referenceIndex}]`,
          message: `Unit "${unit.id}" cannot reference itself as a related unit.`,
        });
      } else if (!unitIds.has(relatedUnitId)) {
        issues.push({
          code: "broken-reference",
          file: source.file,
          field: `units[${source.index}].relatedUnitIds[${referenceIndex}]`,
          message: `Related unit "${relatedUnitId}" does not exist in this game version.`,
        });
      }
    });
  });
}

function unitJsonFiles(
  rootDirectory: string,
  versionDirectory: string,
  issues: GameDataIssue[],
) {
  const unitsDirectory = path.join(versionDirectory, "units");
  const relativeUnitsDirectory = relativeFile(rootDirectory, unitsDirectory);

  if (!existsSync(unitsDirectory)) {
    issues.push({
      code: "file-not-found",
      file: relativeUnitsDirectory,
      message: "Required units directory does not exist.",
    });
    return [];
  }

  if (!statSync(unitsDirectory).isDirectory()) {
    issues.push({
      code: "unexpected-entry",
      file: relativeUnitsDirectory,
      message: "The units entry must be a directory.",
    });
    return [];
  }

  const entries = readdirSync(unitsDirectory, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const entryPath = path.join(unitsDirectory, entry.name);

    if (entry.isFile() && entry.name.endsWith(".json")) {
      files.push(entryPath);
      continue;
    }

    issues.push({
      code: "unexpected-entry",
      file: relativeFile(rootDirectory, entryPath),
      message:
        "The units directory may contain JSON files only; nested directories and other files are not loaded.",
    });
  }

  if (files.length === 0) {
    issues.push({
      code: "file-not-found",
      file: relativeUnitsDirectory,
      message: "At least one unit JSON file is required.",
    });
  }

  return files.sort((left, right) => left.localeCompare(right));
}

function validateVersionDirectoryEntries(
  rootDirectory: string,
  versionDirectory: string,
  issues: GameDataIssue[],
) {
  const allowedEntries = new Set([
    "dlcs.json",
    "equipment.json",
    "metadata.json",
    "units",
  ]);

  for (const entry of readdirSync(versionDirectory, { withFileTypes: true })) {
    if (allowedEntries.has(entry.name)) {
      continue;
    }

    issues.push({
      code: "unexpected-entry",
      file: relativeFile(
        rootDirectory,
        path.join(versionDirectory, entry.name),
      ),
      message:
        "This file or directory is not part of the current game-data schema and will not be loaded.",
    });
  }
}

export function loadGameDataVersion(
  versionDirectory: string,
  gameDataRoot = path.dirname(versionDirectory),
): GameDataSet {
  const issues: GameDataIssue[] = [];

  if (
    !existsSync(versionDirectory) ||
    !statSync(versionDirectory).isDirectory()
  ) {
    throw new GameDataValidationError([
      {
        code: "file-not-found",
        file: relativeFile(gameDataRoot, versionDirectory),
        message: "Game-version directory does not exist.",
      },
    ]);
  }

  validateVersionDirectoryEntries(gameDataRoot, versionDirectory, issues);

  const metadataFile = path.join(versionDirectory, "metadata.json");
  const dlcFile = path.join(versionDirectory, "dlcs.json");
  const equipmentFile = path.join(versionDirectory, "equipment.json");

  const metadata = parseJsonFile(
    gameDataRoot,
    metadataFile,
    gameVersionSchema,
    issues,
  );
  const dlcs = parseJsonFile(gameDataRoot, dlcFile, dlcFileSchema, issues);
  const equipment = parseJsonFile(
    gameDataRoot,
    equipmentFile,
    equipmentFileSchema,
    issues,
  );

  const unitFiles = unitJsonFiles(gameDataRoot, versionDirectory, issues);
  const parsedUnitFiles = unitFiles
    .map((filePath) =>
      parseJsonFile(gameDataRoot, filePath, unitFileSchema, issues),
    )
    .filter((file): file is NonNullable<typeof file> => file !== null);

  if (metadata && metadata.data.id !== path.basename(versionDirectory)) {
    issues.push({
      code: "version-mismatch",
      file: metadata.file,
      field: "id",
      message: `Version ID "${metadata.data.id}" must match directory "${path.basename(versionDirectory)}".`,
    });
  }

  if (!metadata || !dlcs || !equipment) {
    throw new GameDataValidationError(issues);
  }

  const units = parsedUnitFiles.flatMap((file) => file.data.units);
  const unitSources = parsedUnitFiles.flatMap((file) =>
    file.data.units.map((_, index) => ({ file: file.file, index })),
  );

  findDuplicates(
    dlcs.data.dlcs.map((dlc, index) => ({
      id: dlc.id,
      sourceFile: dlcs.file,
      sourceIndex: index,
    })),
    "dlcs",
    issues,
  );
  findDuplicates(
    equipment.data.equipment.map((item, index) => ({
      id: item.id,
      sourceFile: equipment.file,
      sourceIndex: index,
    })),
    "equipment",
    issues,
  );
  findDuplicates(
    units.map((unit, index) => ({
      id: unit.id,
      sourceFile: unitSources[index]?.file ?? "units",
      sourceIndex: unitSources[index]?.index ?? index,
    })),
    "units",
    issues,
  );

  const dataSet: GameDataSet = {
    version: metadata.data,
    dlcs: dlcs.data.dlcs,
    equipment: equipment.data.equipment,
    units,
  };

  validateReferences(dataSet, unitSources, issues);

  if (issues.length > 0) {
    throw new GameDataValidationError(issues);
  }

  return dataSet;
}

export function loadAllGameData(
  gameDataRoot = path.resolve(process.cwd(), "data", "game"),
): GameDataSet[] {
  if (!existsSync(gameDataRoot)) {
    throw new GameDataValidationError([
      {
        code: "file-not-found",
        file: toPortablePath(gameDataRoot),
        message: "Game-data root directory does not exist.",
      },
    ]);
  }

  const entries = readdirSync(gameDataRoot, { withFileTypes: true });
  const versionDirectories = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(gameDataRoot, entry.name))
    .sort((left, right) => left.localeCompare(right));
  const issues: GameDataIssue[] = entries
    .filter((entry) => !entry.isDirectory())
    .map((entry) => ({
      code: "unexpected-entry" as const,
      file: entry.name,
      message: "The game-data root may contain version directories only.",
    }));

  if (versionDirectories.length === 0) {
    issues.push({
      code: "file-not-found",
      file: toPortablePath(gameDataRoot),
      message: "At least one game-version directory is required.",
    });
  }

  const dataSets: GameDataSet[] = [];

  for (const versionDirectory of versionDirectories) {
    if (!statSync(versionDirectory).isDirectory()) {
      continue;
    }

    try {
      dataSets.push(loadGameDataVersion(versionDirectory, gameDataRoot));
    } catch (error) {
      if (error instanceof GameDataValidationError) {
        issues.push(...error.issues);
      } else {
        throw error;
      }
    }
  }

  const versionIds = new Map<string, number>();
  dataSets.forEach((dataSet, index) => {
    const firstIndex = versionIds.get(dataSet.version.id);

    if (firstIndex !== undefined) {
      issues.push({
        code: "duplicate-id",
        file: `${dataSet.version.id}/metadata.json`,
        field: "id",
        message: `Game version "${dataSet.version.id}" duplicates version index ${firstIndex}.`,
      });
    } else {
      versionIds.set(dataSet.version.id, index);
    }
  });

  if (issues.length > 0) {
    throw new GameDataValidationError(issues);
  }

  return dataSets;
}
