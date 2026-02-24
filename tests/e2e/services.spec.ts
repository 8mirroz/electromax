import { test, expect } from "@playwright/test";

test.describe("Service Landing Pages & Calculator", () => {
  test("Service page renders without errors", async ({ page }) => {
    // Navigate to APS service page
    await page.goto("http://localhost:3000/services/aps");

    // Check if the HeroBanner title exists (from mock data: 'Fire Alarm Systems (APS)')
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Fire Alarm Systems (APS)");

    // Check if Breadcrumbs are present
    await expect(page.locator('nav[aria-label="breadcrumb"]')).toBeVisible();
  });

  test("Calculator computes estimated price correctly", async ({ page }) => {
    await page.goto("http://localhost:3000/services/aps");

    // Wait for the calculator to be visible
    const calculatorHeading = page.getByRole("heading", { name: "Калькулятор стоимости" });
    await expect(calculatorHeading).toBeVisible();

    // Default object type: Office (Coef: 1.0)
    // Default area: 100
    // Base price per sqm for APS: 450
    // Initial cost should be: 1.0 * 100 * 450 = 45,000
    await expect(page.getByText("45 000 ₽")).toBeVisible();

    // Change slider (area) to 200
    const slider = page.locator('input[type="range"]');
    await slider.fill("200");

    // Expected value: 1.0 * 200 * 450 = 90,000
    await expect(page.getByText("90 000 ₽")).toBeVisible();

    // Change object type to Proishlenniy (industrial - coef: 1.5)
    await page.getByRole("button", { name: "Промышленный объект" }).click();

    // Expected value: 1.5 * 200 * 450 = 135,000
    await expect(page.getByText("135 000 ₽")).toBeVisible();
  });

  test("Lead capture form submission works", async ({ page }) => {
    await page.goto("http://localhost:3000/services/aps");

    // Fill the phone number
    await page.fill('input[type="tel"]', "+79991234567");

    // Intercept API call
    const responsePromise = page.waitForResponse(
      (response) => response.url().includes("/api/leads") && response.status() === 200,
    );

    // Submit form
    await page.getByRole("button", { name: "Получить точный расчет" }).click();

    // Wait for API response
    const response = await responsePromise;
    const body = await response.json();

    expect(body.success).toBe(true);

    // Verify UI shows success state
    await expect(page.getByText("Спасибо за заявку!")).toBeVisible();
    await expect(page.getByRole("button", { name: "Получить точный расчет" })).not.toBeVisible();
  });
});
