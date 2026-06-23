import { describe, expect, it } from "vitest";

import {
  catalogueLabel,
  formatStatValue,
} from "@/features/unit-catalogue/labels";

describe("catalogue labels", () => {
  it("formats known structural IDs for display", () => {
    expect(catalogueLabel("combat-support-battalions")).toBe(
      "Combat support battalions",
    );
    expect(catalogueLabel("special-forces")).toBe("Special forces");
  });

  it("formats compact canonical statistic values", () => {
    expect(formatStatValue(0.3)).toBe("0.3");
    expect(formatStatValue(12, " km/h")).toBe("12 km/h");
  });
});
