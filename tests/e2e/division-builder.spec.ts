import { expect, test } from "@playwright/test";

test("builds, evaluates, removes, and replaces a division", async ({
  page,
}) => {
  await page.goto("/divisions");

  await expect(
    page.getByRole("heading", {
      name: "Build for a mission, then inspect the trade-offs.",
    }),
  ).toBeVisible();

  const firstLineSlot = page.getByRole("combobox", {
    name: "Line slot row 1, regiment 1",
  });
  const secondLineSlot = page.getByRole("combobox", {
    name: "Line slot row 2, regiment 1",
  });

  await firstLineSlot.selectOption("infantry");
  await secondLineSlot.selectOption("line-artillery");

  await expect(page.locator("#builder-placement-feedback")).toContainText(
    "regiment 1 is locked to infantry-battalions",
  );
  await expect(secondLineSlot).toHaveValue("");

  await secondLineSlot.selectOption("infantry");
  await page
    .getByRole("combobox", { name: "Support slot 1" })
    .selectOption("engineer-company");

  await expect(page.getByTestId("division-stat-combatWidth")).toHaveText("4");
  await expect(page.getByTestId("division-stat-organization")).toHaveText("60");
  await expect(page.getByText("Infantry Equipment")).toBeVisible();
  await expect(page.getByTestId("role-suitability")).toContainText(
    "Strong role fit",
  );

  await page
    .getByRole("combobox", { name: "Evaluate for" })
    .selectOption("offensive-infantry");

  await expect(
    page.getByRole("heading", { name: "Offensive infantry" }),
  ).toBeVisible();
  await expect(
    page.getByText(
      "Add line or support artillery to improve soft attack density.",
    ),
  ).toBeVisible();
  await expect(page.getByText("Assumptions and limitations")).toBeVisible();

  await secondLineSlot.selectOption("");
  await firstLineSlot.selectOption("medium-tank");

  await expect(firstLineSlot).toHaveValue("medium-tank");
  await expect(page.getByTestId("division-stat-breakthrough")).toHaveText("36");
  await expect(page.getByText("Medium Tank Equipment")).toBeVisible();
});

test("division builder remains usable at a 390px viewport", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/divisions");

  await page
    .getByRole("combobox", {
      name: "Line slot row 1, regiment 1",
    })
    .selectOption("infantry");
  const firstSupportSlot = page.getByRole("combobox", {
    name: "Support slot 1",
  });
  await firstSupportSlot.selectOption("support-artillery");

  await expect(page.getByTestId("division-stat-softAttack")).toHaveText("21");
  await expect(firstSupportSlot).toHaveValue("support-artillery");
  await expect(
    page.getByText("Artillery Equipment", { exact: true }),
  ).toBeVisible();

  expect(
    await page.evaluate(
      () =>
        document.documentElement.scrollWidth ===
        document.documentElement.clientWidth,
    ),
  ).toBe(true);
});
