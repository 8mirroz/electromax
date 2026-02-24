import { test, expect } from "@playwright/test";

test("homepage has primary CTA", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: /deploy now/i })).toBeVisible();
});
