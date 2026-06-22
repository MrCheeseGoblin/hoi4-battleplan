import { z } from "zod";

const stableIdSchema = z
  .string()
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Must use lowercase letters, numbers, and single hyphens only.",
  );

const gameVersionIdSchema = z
  .string()
  .regex(
    /^[a-z0-9]+(?:[.-][a-z0-9]+)*$/,
    "Must use lowercase letters, numbers, dots, and single hyphens only.",
  );

const nonNegativeNumberSchema = z
  .number()
  .finite()
  .nonnegative("Must be zero or greater.");

const positiveIntegerSchema = z
  .number()
  .int()
  .positive("Must be a positive integer.");

const isoDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Must use YYYY-MM-DD format.");

export const gameVersionStatusSchema = z.enum([
  "sample",
  "draft",
  "verified",
  "archived",
]);

export const gameVersionSchema = z
  .object({
    schemaVersion: z.literal(1),
    id: gameVersionIdSchema,
    label: z.string().trim().min(1),
    gameVersion: z.string().trim().min(1),
    status: gameVersionStatusSchema,
    verifiedAt: isoDateSchema.nullable(),
    sourceNotes: z.array(z.string().trim().min(1)).min(1),
  })
  .strict();

export const dlcSchema = z
  .object({
    id: stableIdSchema,
    name: z.string().trim().min(1),
  })
  .strict();

export const dlcFileSchema = z
  .object({
    schemaVersion: z.literal(1),
    dlcs: z.array(dlcSchema),
  })
  .strict();

export const equipmentCategorySchema = z.enum([
  "infantry-equipment",
  "support-equipment",
  "artillery",
  "motorized",
  "armored",
]);

export const equipmentSchema = z
  .object({
    id: stableIdSchema,
    name: z.string().trim().min(1),
    category: equipmentCategorySchema,
  })
  .strict();

export const equipmentFileSchema = z
  .object({
    schemaVersion: z.literal(1),
    equipment: z.array(equipmentSchema),
  })
  .strict();

export const unitCategorySchema = z.enum([
  "infantry",
  "artillery",
  "mobile",
  "armored",
  "special-forces",
  "support",
]);

export const lineUnitCategorySchema = z.enum([
  "infantry",
  "artillery",
  "mobile",
  "armored",
  "special-forces",
]);

export const regimentTypeSchema = z.enum(["infantry", "mobile", "armored"]);

export const regimentGroupSchema = z.enum([
  "infantry-battalions",
  "mobile-battalions",
  "armored-battalions",
  "combat-support-battalions",
  "mobile-combat-support-battalions",
]);

export const unitStatsSchema = z
  .object({
    organization: nonNegativeNumberSchema,
    hp: nonNegativeNumberSchema,
    recoveryRate: nonNegativeNumberSchema,
    suppression: nonNegativeNumberSchema,
    weight: nonNegativeNumberSchema,
    supplyUse: nonNegativeNumberSchema,
    fuelUse: nonNegativeNumberSchema,
    speed: nonNegativeNumberSchema,
    softAttack: nonNegativeNumberSchema,
    hardAttack: nonNegativeNumberSchema,
    airAttack: nonNegativeNumberSchema,
    defense: nonNegativeNumberSchema,
    breakthrough: nonNegativeNumberSchema,
    armor: nonNegativeNumberSchema,
    piercing: nonNegativeNumberSchema,
    hardness: z.number().finite().min(0).max(1),
    entrenchment: nonNegativeNumberSchema,
  })
  .strict();

export const equipmentRequirementSchema = z
  .object({
    equipmentId: stableIdSchema,
    amount: positiveIntegerSchema,
  })
  .strict();

const commonUnitFields = {
  id: stableIdSchema,
  name: z.string().trim().min(1),
  category: unitCategorySchema,
  requiredDlcIds: z.array(stableIdSchema),
  equipmentRequirements: z.array(equipmentRequirementSchema),
  relatedUnitIds: z.array(stableIdSchema),
  stats: unitStatsSchema,
} satisfies z.ZodRawShape;

export const lineBattalionSchema = z
  .object({
    ...commonUnitFields,
    kind: z.literal("line-battalion"),
    category: lineUnitCategorySchema,
    combatWidth: positiveIntegerSchema,
    regimentType: regimentTypeSchema,
    regimentGroup: regimentGroupSchema,
  })
  .strict();

export const supportCompanySchema = z
  .object({
    ...commonUnitFields,
    kind: z.literal("support-company"),
    category: z.literal("support"),
    combatWidth: z.literal(0),
    regimentType: z.null(),
    regimentGroup: z.null(),
  })
  .strict();

export const unitSchema = z.discriminatedUnion("kind", [
  lineBattalionSchema,
  supportCompanySchema,
]);

export const unitFileSchema = z
  .object({
    schemaVersion: z.literal(1),
    units: z.array(unitSchema),
  })
  .strict();

export type GameVersion = z.infer<typeof gameVersionSchema>;
export type Dlc = z.infer<typeof dlcSchema>;
export type Equipment = z.infer<typeof equipmentSchema>;
export type Unit = z.infer<typeof unitSchema>;
export type LineBattalion = z.infer<typeof lineBattalionSchema>;
export type SupportCompany = z.infer<typeof supportCompanySchema>;

export type GameDataSet = {
  version: GameVersion;
  dlcs: Dlc[];
  equipment: Equipment[];
  units: Unit[];
};
