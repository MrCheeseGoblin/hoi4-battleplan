import { expect, test } from "@playwright/test";

test("homepage presents the product and opens the unit catalogue", async ({
  page,
}) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: /plan with context/i }),
  ).toBeVisible();
  await expect(
    page
      .getByText("Not affiliated with or endorsed by Paradox Interactive.", {
        exact: false,
      })
      .first(),
  ).toBeVisible();

  await page.getByRole("link", { name: "Units" }).click();

  await expect(
    page.getByRole("heading", {
      name: "Know what each unit contributes.",
    }),
  ).toBeVisible();
  await expect(page).toHaveURL(/\/units$/);
});

test("catalogue filters lead to a canonical unit detail page", async ({
  page,
}) => {
  await page.goto("/units");

  await expect(
    page.getByRole("heading", { name: "Know what each unit contributes." }),
  ).toBeVisible();

  await page.getByRole("searchbox", { name: "Unit name" }).fill("artillery");
  await page.getByRole("button", { name: "Apply filters" }).click();

  await expect(page).toHaveURL(/\/units\?q=artillery/);
  await expect(
    page.getByRole("heading", { name: "2 of 6 sample units" }),
  ).toBeVisible();

  await page.getByRole("link", { name: "View Line Artillery details" }).click();

  await expect(page).toHaveURL(/\/units\/line-artillery$/);
  await expect(
    page.getByRole("heading", { name: "Line Artillery", level: 1 }),
  ).toBeVisible();
  await expect(
    page.getByText("Artillery Equipment", { exact: true }),
  ).toBeVisible();
  await expect(page.getByText("Loaded from 1.16-sample")).toBeVisible();
});

test("unknown unit IDs show a catalogue-specific not-found state", async ({
  page,
}) => {
  await page.goto("/units/not-a-real-unit");

  await expect(
    page.getByRole("heading", {
      name: "This unit is not in the current sample.",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Browse available units" }),
  ).toHaveAttribute("href", "/units");
});

test("catalogue and detail remain usable at a mobile viewport", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/units?kind=support-company");

  await expect(
    page.getByRole("heading", { name: "2 of 6 sample units" }),
  ).toBeVisible();
  await expect(page.getByRole("combobox", { name: "Unit kind" })).toHaveValue(
    "support-company",
  );

  expect(
    await page.evaluate(
      () =>
        document.documentElement.scrollWidth ===
        document.documentElement.clientWidth,
    ),
  ).toBe(true);

  await page
    .getByRole("link", { name: "View Engineer Company details" })
    .click();
  await expect(
    page.getByRole("heading", { name: "Engineer Company", level: 1 }),
  ).toBeVisible();

  expect(
    await page.evaluate(
      () =>
        document.documentElement.scrollWidth ===
        document.documentElement.clientWidth,
    ),
  ).toBe(true);
});
