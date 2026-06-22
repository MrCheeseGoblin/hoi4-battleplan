import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SiteHeader } from "@/components/layout/site-header";

describe("SiteHeader", () => {
  it("exposes the primary destinations through labelled navigation", () => {
    render(<SiteHeader />);

    const navigation = screen.getByRole("navigation", {
      name: "Primary navigation",
    });

    expect(navigation).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Divisions" })).toHaveAttribute(
      "href",
      "/divisions",
    );
    expect(screen.getByRole("link", { name: "Nation guides" })).toHaveAttribute(
      "href",
      "/guides",
    );
  });
});
