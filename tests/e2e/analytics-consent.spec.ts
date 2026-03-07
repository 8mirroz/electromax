import { expect, test } from "@playwright/test";

const BASE_URL = process.env.E2E_BASE_URL || "http://127.0.0.1:3000";

test.describe("Analytics consent", () => {
  test("blocks analytics events before consent and enables after accept", async ({ page }) => {
    let eventsRequests = 0;

    await page.route("**/api/events", async (route) => {
      eventsRequests += 1;
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true }),
      });
    });

    await page.goto(BASE_URL);
    await page.evaluate(() => {
      localStorage.removeItem("electromax.analytics.consent.v1");
      sessionStorage.clear();
    });
    await page.reload();

    await expect(page.getByText("Согласие на аналитику")).toBeVisible();

    await page.getByRole("button", { name: "Заказать аудит" }).click();
    await page.waitForURL("**/contacts");
    await page.waitForTimeout(300);
    expect(eventsRequests).toBe(0);

    await page.goto(BASE_URL);
    await page.getByRole("button", { name: "Принять" }).click();
    await expect(page.getByText("Согласие на аналитику")).not.toBeVisible();

    await page.getByRole("button", { name: "Заказать аудит" }).click();
    await page.waitForURL("**/contacts");
    await page.waitForTimeout(300);

    expect(eventsRequests).toBeGreaterThan(0);
  });

  test("persists denied consent", async ({ page }) => {
    await page.goto(BASE_URL);
    await page.evaluate(() => {
      localStorage.removeItem("electromax.analytics.consent.v1");
      sessionStorage.clear();
    });
    await page.reload();

    await page.getByRole("button", { name: "Отклонить" }).click();

    await page.reload();
    await expect(page.getByText("Согласие на аналитику")).not.toBeVisible();

    const consentState = await page.evaluate(() => localStorage.getItem("electromax.analytics.consent.v1"));
    expect(consentState).toContain("denied");
  });
});
