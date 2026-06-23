export const unitKindLabels = {
  "line-battalion": "Line battalion",
  "support-company": "Support company",
} as const;

const labelOverrides: Record<string, string> = {
  armored: "Armored",
  artillery: "Artillery",
  infantry: "Infantry",
  mobile: "Mobile",
  "special-forces": "Special forces",
  support: "Support",
  "infantry-battalions": "Infantry battalions",
  "mobile-battalions": "Mobile battalions",
  "armored-battalions": "Armored battalions",
  "combat-support-battalions": "Combat support battalions",
  "mobile-combat-support-battalions": "Mobile combat support battalions",
};

export function catalogueLabel(value: string) {
  return (
    labelOverrides[value] ??
    value
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ")
  );
}

export function formatStatValue(value: number, suffix = "") {
  return `${Number.isInteger(value) ? value : value.toFixed(2).replace(/0+$/, "").replace(/\.$/, "")}${suffix}`;
}
