import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { loadDivisionBuilderData } from "@/features/division-builder/data";
import { DivisionBuilder } from "@/features/division-builder/division-builder";

describe("DivisionBuilder", () => {
  it("renders canonical values while adding, rejecting, replacing, and removing units", async () => {
    const user = userEvent.setup();
    render(<DivisionBuilder dataSet={loadDivisionBuilderData()} />);

    expect(screen.getByTestId("role-suitability")).toHaveTextContent(
      "Not ready to evaluate",
    );

    const firstLineSlot = screen.getByRole("combobox", {
      name: "Line slot row 1, regiment 1",
    });
    const secondLineSlot = screen.getByRole("combobox", {
      name: "Line slot row 2, regiment 1",
    });

    await user.selectOptions(firstLineSlot, "infantry");

    expect(screen.getByTestId("division-stat-organization")).toHaveTextContent(
      "60",
    );
    expect(screen.getByTestId("division-stat-softAttack")).toHaveTextContent(
      "6",
    );
    expect(screen.getByText("Infantry Equipment")).toBeInTheDocument();
    expect(screen.getByText("× 100")).toBeInTheDocument();

    await user.selectOptions(secondLineSlot, "line-artillery");

    expect(screen.getByRole("alert")).toHaveTextContent(
      "regiment 1 is locked to infantry-battalions",
    );
    expect(secondLineSlot).toHaveValue("");

    await user.selectOptions(secondLineSlot, "infantry");
    await user.selectOptions(
      screen.getByRole("combobox", { name: "Support slot 1" }),
      "engineer-company",
    );

    expect(screen.getByTestId("division-stat-combatWidth")).toHaveTextContent(
      "4",
    );
    expect(screen.getByTestId("role-suitability")).toHaveTextContent(
      "Strong role fit",
    );

    await user.selectOptions(
      screen.getByRole("combobox", { name: "Evaluate for" }),
      "offensive-infantry",
    );

    expect(
      screen.getByRole("heading", { name: "Offensive infantry" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Add line or support artillery to improve soft attack density.",
      ),
    ).toBeInTheDocument();

    await user.selectOptions(secondLineSlot, "");
    await user.selectOptions(firstLineSlot, "medium-tank");

    expect(firstLineSlot).toHaveValue("medium-tank");
    expect(screen.getByTestId("division-stat-breakthrough")).toHaveTextContent(
      "36",
    );
    expect(screen.getByTestId("division-stat-fuelUse")).toHaveTextContent(
      "2.5",
    );
  });

  it("blocks duplicate support companies and keeps the original template", async () => {
    const user = userEvent.setup();
    render(<DivisionBuilder dataSet={loadDivisionBuilderData()} />);

    await user.selectOptions(
      screen.getByRole("combobox", { name: "Support slot 1" }),
      "support-artillery",
    );
    const secondSupport = screen.getByRole("combobox", {
      name: "Support slot 2",
    });
    await user.selectOptions(secondSupport, "support-artillery");

    expect(screen.getByRole("alert")).toHaveTextContent(
      "already assigned to another support slot",
    );
    expect(secondSupport).toHaveValue("");
  });
});
