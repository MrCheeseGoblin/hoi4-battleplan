import type { GameDataSet } from "@/lib/game-data";
import type {
  DivisionCalculation,
  DivisionEvaluation,
  DivisionRoleId,
  DivisionTemplate,
  EvaluationDimension,
  EvaluationDimensionId,
  RoleSuitability,
} from "@/features/division-builder/types";

type RoleDefinition = {
  id: DivisionRoleId;
  name: string;
  description: string;
  dimensions: Array<{
    id: EvaluationDimensionId;
    label: string;
    weight: number;
    value: (calculation: DivisionCalculation) => number;
    score: (value: number) => number;
    display: (value: number) => string;
    explanation: (value: number) => string;
  }>;
};

function clampScore(value: number) {
  return Math.round(Math.min(100, Math.max(0, value)));
}

function formatMetric(value: number, suffix = "") {
  const formatted = Number.isInteger(value)
    ? String(value)
    : value.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
  return `${formatted}${suffix}`;
}

function scoreHigher(value: number, weak: number, strong: number) {
  if (strong === weak) {
    return value >= strong ? 100 : 0;
  }
  return clampScore(((value - weak) / (strong - weak)) * 100);
}

function scoreLower(value: number, strong: number, weak: number) {
  if (weak === strong) {
    return value <= strong ? 100 : 0;
  }
  return clampScore(((weak - value) / (weak - strong)) * 100);
}

function perWidth(value: number, calculation: DivisionCalculation) {
  return calculation.stats.combatWidth > 0
    ? value / calculation.stats.combatWidth
    : 0;
}

export const divisionRoles: RoleDefinition[] = [
  {
    id: "defensive-line-infantry",
    name: "Defensive line infantry",
    description:
      "Hold ground with organization, defence, HP, entrenchment, and manageable supply use.",
    dimensions: [
      {
        id: "organization",
        label: "Organization",
        weight: 0.25,
        value: ({ stats }) => stats.organization,
        score: (value) => scoreHigher(value, 25, 50),
        display: (value) => formatMetric(value),
        explanation: () =>
          "This simplified role model treats 50 organization as strong and 25 as weak.",
      },
      {
        id: "defense",
        label: "Defence per width",
        weight: 0.3,
        value: (calculation) =>
          perWidth(calculation.stats.defense, calculation),
        score: (value) => scoreHigher(value, 5, 12),
        display: (value) => formatMetric(value),
        explanation: () =>
          "Higher defence density is favoured for routine line holding.",
      },
      {
        id: "hp",
        label: "HP per width",
        weight: 0.2,
        value: (calculation) => perWidth(calculation.stats.hp, calculation),
        score: (value) => scoreHigher(value, 3, 10),
        display: (value) => formatMetric(value),
        explanation: () =>
          "HP per width is used as a simplified equipment-loss resilience signal.",
      },
      {
        id: "entrenchment",
        label: "Entrenchment",
        weight: 0.15,
        value: ({ stats }) => stats.entrenchment,
        score: (value) => scoreHigher(value, 0, 4),
        display: (value) => formatMetric(value),
        explanation: () =>
          "Entrenchment is summed from the selected sample units.",
      },
      {
        id: "logistics",
        label: "Supply per width",
        weight: 0.1,
        value: (calculation) =>
          perWidth(calculation.stats.supplyUse, calculation),
        score: (value) => scoreLower(value, 0.04, 0.18),
        display: (value) => formatMetric(value),
        explanation: () =>
          "Lower supply use per combat width receives a higher score.",
      },
    ],
  },
  {
    id: "offensive-infantry",
    name: "Offensive infantry",
    description:
      "Apply soft attack while retaining enough breakthrough, organization, speed, and supply efficiency to keep attacking.",
    dimensions: [
      {
        id: "soft-attack",
        label: "Soft attack per width",
        weight: 0.3,
        value: (calculation) =>
          perWidth(calculation.stats.softAttack, calculation),
        score: (value) => scoreHigher(value, 3, 8),
        display: (value) => formatMetric(value),
        explanation: () =>
          "This role favours concentrated soft attack against soft targets.",
      },
      {
        id: "breakthrough",
        label: "Breakthrough per width",
        weight: 0.25,
        value: (calculation) =>
          perWidth(calculation.stats.breakthrough, calculation),
        score: (value) => scoreHigher(value, 1, 6),
        display: (value) => formatMetric(value),
        explanation: () =>
          "Low breakthrough per combat width is a major attacking weakness.",
      },
      {
        id: "organization",
        label: "Organization",
        weight: 0.2,
        value: ({ stats }) => stats.organization,
        score: (value) => scoreHigher(value, 20, 45),
        display: (value) => formatMetric(value),
        explanation: () => "Sustained attacks still need organization.",
      },
      {
        id: "speed",
        label: "Speed",
        weight: 0.1,
        value: ({ stats }) => stats.speed,
        score: (value) => scoreHigher(value, 4, 8),
        display: (value) => formatMetric(value, " km/h"),
        explanation: () =>
          "Speed is based on the slowest selected line battalion.",
      },
      {
        id: "logistics",
        label: "Supply per width",
        weight: 0.15,
        value: (calculation) =>
          perWidth(calculation.stats.supplyUse, calculation),
        score: (value) => scoreLower(value, 0.08, 0.2),
        display: (value) => formatMetric(value),
        explanation: () =>
          "Lower supply burden leaves more operational flexibility.",
      },
    ],
  },
];

export function getDivisionRole(roleId: DivisionRoleId) {
  return divisionRoles.find((role) => role.id === roleId)!;
}

function suitability(score: number): {
  id: RoleSuitability;
  label: string;
} {
  if (score >= 80) return { id: "strong", label: "Strong role fit" };
  if (score >= 65) return { id: "promising", label: "Promising role fit" };
  if (score >= 45) return { id: "limited", label: "Limited role fit" };
  return { id: "poor", label: "Poor role fit" };
}

function dimensionResult(
  definition: RoleDefinition["dimensions"][number],
  calculation: DivisionCalculation,
): EvaluationDimension {
  const value = definition.value(calculation);
  return {
    id: definition.id,
    label: definition.label,
    score: definition.score(value),
    value,
    displayValue: definition.display(value),
    explanation: definition.explanation(value),
  };
}

export function evaluateDivision(
  template: DivisionTemplate,
  calculation: DivisionCalculation,
  dataSet: GameDataSet,
): DivisionEvaluation {
  const role = getDivisionRole(template.roleId);
  const criticalWarnings = calculation.issues
    .filter((issue) => issue.severity === "error")
    .map((issue) => issue.message);

  if (calculation.stats.lineBattalionCount === 0) {
    return {
      roleId: role.id,
      roleName: role.name,
      suitability: "not-ready",
      suitabilityLabel: "Not ready to evaluate",
      roleScore: null,
      dimensions: [],
      strengths: [],
      weaknesses: [],
      criticalWarnings: [
        ...criticalWarnings,
        "The division has no line battalions.",
      ],
      suggestions: ["Add at least two compatible line battalions."],
      assumptions: baseAssumptions(dataSet),
    };
  }

  if (criticalWarnings.length > 0) {
    return {
      roleId: role.id,
      roleName: role.name,
      suitability: "not-ready",
      suitabilityLabel: "Fix structural errors",
      roleScore: null,
      dimensions: [],
      strengths: [],
      weaknesses: [],
      criticalWarnings,
      suggestions: ["Fix the invalid placements before evaluating this role."],
      assumptions: baseAssumptions(dataSet),
    };
  }

  if (calculation.stats.lineBattalionCount < 2) {
    criticalWarnings.push(
      "This one-battalion template is only a skeleton, so its role score is low-confidence.",
    );
  }

  if (calculation.stats.organization < 20) {
    criticalWarnings.push(
      "Organization is below 20 in the simplified model; the division may leave combat quickly.",
    );
  }

  const dimensions = role.dimensions.map((dimension) =>
    dimensionResult(dimension, calculation),
  );
  const calculatedRoleScore = Math.round(
    dimensions.reduce((total, dimension, index) => {
      return total + dimension.score * role.dimensions[index]!.weight;
    }, 0),
  );
  const roleScore =
    calculation.stats.lineBattalionCount < 2
      ? Math.min(calculatedRoleScore, 44)
      : calculatedRoleScore;
  const resultSuitability = suitability(roleScore);
  const strengths = dimensions
    .filter((dimension) => dimension.score >= 75)
    .map(
      (dimension) =>
        `${dimension.label} is a relative strength (${dimension.score}/100 for this role).`,
    );
  const weaknesses = dimensions
    .filter((dimension) => dimension.score <= 45)
    .map(
      (dimension) =>
        `${dimension.label} is a weakness (${dimension.score}/100 for this role).`,
    );
  const suggestions = suggestionsForRole(role.id, calculation);

  if (role.id === "defensive-line-infantry" && calculation.stats.fuelUse > 0) {
    criticalWarnings.push(
      "This defensive template consumes fuel, which may make routine line holding unnecessarily fragile.",
    );
  }

  return {
    roleId: role.id,
    roleName: role.name,
    suitability: resultSuitability.id,
    suitabilityLabel: resultSuitability.label,
    roleScore,
    dimensions,
    strengths,
    weaknesses,
    criticalWarnings,
    suggestions,
    assumptions: baseAssumptions(dataSet),
  };
}

function suggestionsForRole(
  roleId: DivisionRoleId,
  calculation: DivisionCalculation,
) {
  const suggestions: string[] = [];
  const width = Math.max(calculation.stats.combatWidth, 1);

  if (calculation.stats.organization < 35) {
    suggestions.push(
      roleId === "offensive-infantry"
        ? "Add infantry or motorized battalions to improve organization."
        : "Add more infantry battalions to improve organization and staying power.",
    );
  }

  if (
    roleId === "defensive-line-infantry" &&
    calculation.stats.defense / width < 8
  ) {
    suggestions.push(
      "Increase defence density with more defensive battalions or suitable support.",
    );
  }

  if (
    roleId === "defensive-line-infantry" &&
    calculation.stats.entrenchment < 2
  ) {
    suggestions.push(
      "Consider an engineer company for additional sample entrenchment.",
    );
  }

  if (
    roleId === "offensive-infantry" &&
    calculation.stats.softAttack / width < 5
  ) {
    suggestions.push(
      "Add line or support artillery to improve soft attack density.",
    );
  }

  if (
    roleId === "offensive-infantry" &&
    calculation.stats.breakthrough / width < 3
  ) {
    suggestions.push(
      "Add a breakthrough-oriented battalion, while protecting organization with infantry or motorized support.",
    );
  }

  return suggestions;
}

function baseAssumptions(dataSet: GameDataSet) {
  return [
    `Uses the ${dataSet.version.label} canonical snapshot, currently marked ${dataSet.version.status}.`,
    "Attack, defence, HP, supply, fuel, and entrenchment values are summed from selected units.",
    "Organization, recovery, and hardness are simple line-battalion averages.",
    "Speed is the slowest selected line battalion; armor and piercing use the selected maximum.",
    "Role thresholds are transparent coaching heuristics, not a universal HOI4 meta score.",
    "Doctrines, technologies, terrain, country bonuses, commanders, designers, and equipment variants are not modelled.",
  ];
}
