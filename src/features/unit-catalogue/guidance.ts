import { readFileSync } from "node:fs";
import path from "node:path";

import { z } from "zod";

import type { GameDataSet } from "@/lib/game-data";

const stableIdSchema = z.string().regex(/^[a-z0-9]+(?:[.-][a-z0-9]+)*$/);

export const unitGuidanceSchema = z
  .object({
    unitId: stableIdSchema,
    description: z.string().trim().min(1),
    strengths: z.array(z.string().trim().min(1)).min(1),
    weaknesses: z.array(z.string().trim().min(1)).min(1),
    typicalUses: z.array(z.string().trim().min(1)).min(1),
  })
  .strict();

export const unitGuidanceFileSchema = z
  .object({
    schemaVersion: z.literal(1),
    gameVersionId: stableIdSchema,
    entries: z.array(unitGuidanceSchema),
  })
  .strict();

export type UnitGuidance = z.infer<typeof unitGuidanceSchema>;

function fieldPath(pathSegments: PropertyKey[]) {
  return pathSegments.reduce<string>((result, segment) => {
    if (typeof segment === "number") {
      return `${result}[${segment}]`;
    }

    return result ? `${result}.${String(segment)}` : String(segment);
  }, "");
}

export function loadUnitGuidance(
  dataSet: GameDataSet,
  contentRoot = path.resolve(process.cwd(), "content", "unit-guidance"),
): Map<string, UnitGuidance> {
  const filePath = path.join(contentRoot, `${dataSet.version.id}.json`);
  const relativeFile = path
    .relative(process.cwd(), filePath)
    .split(path.sep)
    .join("/");

  let value: unknown;

  try {
    value = JSON.parse(readFileSync(filePath, "utf8"));
  } catch (error) {
    throw new Error(
      `${relativeFile}: ${
        error instanceof Error ? error.message : "Could not read guidance JSON."
      }`,
    );
  }

  const result = unitGuidanceFileSchema.safeParse(value);

  if (!result.success) {
    const issues = result.error.issues
      .map(
        (issue) =>
          `${relativeFile}:${fieldPath(issue.path)} [schema] ${issue.message}`,
      )
      .join("\n");
    throw new Error(`Unit-guidance validation failed.\n${issues}`);
  }

  if (result.data.gameVersionId !== dataSet.version.id) {
    throw new Error(
      `${relativeFile}:gameVersionId must match "${dataSet.version.id}".`,
    );
  }

  const unitIds = new Set(dataSet.units.map((unit) => unit.id));
  const guidanceByUnitId = new Map<string, UnitGuidance>();

  result.data.entries.forEach((entry, index) => {
    if (!unitIds.has(entry.unitId)) {
      throw new Error(
        `${relativeFile}:entries[${index}].unitId references unknown unit "${entry.unitId}".`,
      );
    }

    if (guidanceByUnitId.has(entry.unitId)) {
      throw new Error(
        `${relativeFile}:entries[${index}].unitId duplicates "${entry.unitId}".`,
      );
    }

    guidanceByUnitId.set(entry.unitId, entry);
  });

  return guidanceByUnitId;
}
