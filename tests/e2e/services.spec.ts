import { expect, test } from "@playwright/test";

const SLUGS = ["aps", "asuz", "eom", "eo", "os", "sks", "skud", "sot", "soue", "to"];

test.describe("Service pages / Project Tray", () => {
  test("all service slugs render without runtime errors", async ({ page }) => {
    for (const slug of SLUGS) {
      await page.goto(`http://localhost:3000/services/${slug}`);
      await expect(page.getByTestId("service-hero-compact")).toBeVisible();
      await expect(page.getByTestId("project-tray-trigger")).toBeVisible();
      await expect(page.getByTestId("seo-faq-block")).toBeVisible();
      await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(3);
    }
  });

  test("catalog item can be added to project and tray persists across service pages", async ({
    page,
  }) => {
    await page.goto("http://localhost:3000/services/aps");
    await expect(page.getByTestId("hero-audit-cta")).toBeVisible();

    const firstAddButton = page.locator('[data-testid^="add-to-project-"]').first();
    await expect(firstAddButton).toBeVisible();
    await firstAddButton.click();

    await expect(page.getByTestId("project-tray-drawer")).toBeVisible();
    await expect(page.getByText(/1 поз\./)).toBeVisible();

    await page.getByRole("button", { name: "Закрыть" }).click();
    await page.goto("http://localhost:3000/services/soue");

    await page.getByTestId("project-tray-trigger").click();
    await expect(page.getByTestId("project-tray-drawer")).toBeVisible();
    await expect(page.getByText(/1 поз\./)).toBeVisible();
    await expect(page.getByTestId("ai-rail")).toBeVisible();
  });

  test("mobile layout shows hero CTA and tray bottom sheet", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("http://localhost:3000/services/skud");

    await expect(page.getByTestId("hero-audit-cta")).toBeVisible();
    await page.getByTestId("project-tray-trigger").click();
    await expect(page.getByTestId("project-tray-drawer")).toBeVisible();
  });
});
