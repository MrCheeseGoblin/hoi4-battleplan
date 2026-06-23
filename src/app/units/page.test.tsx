import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import UnitsPage from "@/app/units/page";

describe("UnitsPage", () => {
  it("applies URL search parameters to canonical catalogue records", async () => {
    render(
      await UnitsPage({
        searchParams: Promise.resolve({ q: "artillery" }),
      }),
    );

    expect(
      screen.getByRole("heading", { name: "2 of 6 sample units" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Line Artillery" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Support Artillery" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Infantry" }),
    ).not.toBeInTheDocument();
  });

  it("renders a useful no-results state", async () => {
    render(
      await UnitsPage({
        searchParams: Promise.resolve({
          q: "tank",
          kind: "support-company",
        }),
      }),
    );

    expect(
      screen.getByRole("heading", {
        name: "No sample record fits every filter.",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Reset catalogue" }),
    ).toHaveAttribute("href", "/units");
  });
});
