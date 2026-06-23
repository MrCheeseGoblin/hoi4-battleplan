import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  findUnitCatalogueEntry,
  loadUnitCatalogue,
} from "@/features/unit-catalogue/catalogue";
import { UnitDetail } from "@/features/unit-catalogue/unit-detail";

describe("UnitDetail", () => {
  it("displays canonical statistics and resolved requirements", () => {
    const catalogue = loadUnitCatalogue();
    const entry = findUnitCatalogueEntry(catalogue, "infantry");

    expect(entry).toBeDefined();
    render(<UnitDetail catalogue={catalogue} entry={entry!} />);

    expect(
      screen.getByRole("heading", { name: "Infantry", level: 1 }),
    ).toBeInTheDocument();
    expect(screen.getByText("Loaded from 1.16-sample")).toBeInTheDocument();

    const requirements = screen
      .getByRole("heading", { name: "Equipment requirements" })
      .closest("section");
    expect(requirements).not.toBeNull();
    expect(
      within(requirements!).getByText("Infantry Equipment"),
    ).toBeInTheDocument();
    expect(within(requirements!).getByText("× 100")).toBeInTheDocument();

    expect(
      screen.getByRole("link", { name: "Motorized Infantry →" }),
    ).toHaveAttribute("href", "/units/motorized-infantry");
  });

  it("keeps practical guidance visibly separate from canonical mechanics", () => {
    const catalogue = loadUnitCatalogue();
    const entry = findUnitCatalogueEntry(catalogue, "support-artillery");

    expect(entry).toBeDefined();
    render(<UnitDetail catalogue={catalogue} entry={entry!} />);

    expect(
      screen.getByText(
        "Authored advice is separate from canonical game mechanics.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Strengths" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Terrain modifiers are not modelled in the current canonical sample.",
      ),
    ).toBeInTheDocument();
  });
});
