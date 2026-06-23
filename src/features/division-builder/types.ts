import type { UnitStats } from "@/features/division-builder/calculation-types";

export const DIVISION_GRID_ROWS = 5;
export const DIVISION_GRID_COLUMNS = 5;
export const DIVISION_SUPPORT_SLOTS = 5;

export type DivisionRoleId = "defensive-line-infantry" | "offensive-infantry";

export type DivisionTemplate = {
  gameVersionId: string;
  lineSlots: Array<string | null>;
  supportSlots: Array<string | null>;
  roleId: DivisionRoleId;
};

export type DivisionSlotLocation =
  | {
      kind: "line";
      row: number;
      column: number;
    }
  | {
      kind: "support";
      index: number;
    };

export type TemplateIssueCode =
  | "duplicate-support"
  | "empty-division"
  | "invalid-slot"
  | "invalid-regiment-group"
  | "line-gap"
  | "unknown-unit"
  | "wrong-unit-kind";

export type TemplateIssue = {
  code: TemplateIssueCode;
  severity: "error" | "warning";
  message: string;
  location?: DivisionSlotLocation;
};

export type TemplateOperationResult =
  | {
      ok: true;
      template: DivisionTemplate;
    }
  | {
      ok: false;
      template: DivisionTemplate;
      issue: TemplateIssue;
    };

export type EquipmentTotal = {
  equipmentId: string;
  name: string;
  amount: number;
};

export type DivisionCalculation = {
  stats: UnitStats & {
    combatWidth: number;
    lineBattalionCount: number;
    supportCompanyCount: number;
  };
  equipment: EquipmentTotal[];
  issues: TemplateIssue[];
};

export type EvaluationDimensionId =
  | "breakthrough"
  | "defense"
  | "entrenchment"
  | "hp"
  | "logistics"
  | "organization"
  | "soft-attack"
  | "speed";

export type EvaluationDimension = {
  id: EvaluationDimensionId;
  label: string;
  score: number;
  value: number;
  displayValue: string;
  explanation: string;
};

export type RoleSuitability =
  | "not-ready"
  | "poor"
  | "limited"
  | "promising"
  | "strong";

export type DivisionEvaluation = {
  roleId: DivisionRoleId;
  roleName: string;
  suitability: RoleSuitability;
  suitabilityLabel: string;
  roleScore: number | null;
  dimensions: EvaluationDimension[];
  strengths: string[];
  weaknesses: string[];
  criticalWarnings: string[];
  suggestions: string[];
  assumptions: string[];
};
