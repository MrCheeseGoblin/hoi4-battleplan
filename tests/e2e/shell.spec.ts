import { expect, test } from "@playwright/test";

test("homepage presents the product and navigates to a feature shell", async ({
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
      name: "Know the tool before choosing the formation.",
    }),
  ).toBeVisible();
  await expect(page).toHaveURL(/\/units$/);
});
