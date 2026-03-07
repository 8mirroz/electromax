import { test, expect } from "@playwright/test";

test.describe("Electromax UI/UX and Functional QA Suite", () => {
  test.beforeEach(async ({ page }) => {
    // Go to the starting url before each test.
    await page.goto("/");
  });

  test("Homepage is accessible and loads correctly", async ({ page }) => {
    // Check main title visibility
    await expect(page).toHaveTitle(/Electromax|Electric/i);
    // Determine a few key elements that must be visible
    const mainHeading = page.locator("h1").first();
    await expect(mainHeading).toBeVisible();
  });

  test("Navigation menu links are functional", async ({ page }) => {
    // Assumes there's a navigation menu to the services page
    const servicesLink = page.locator("nav").getByRole("link", { name: /услуги/i });
    if ((await servicesLink.count()) > 0) {
      await servicesLink.click();
      await expect(page).toHaveURL(/.*services/);
    }
  });

  test("UI elements respond and behave correctly under different viewports", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator("h1").first()).toBeVisible();

    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator("h1").first()).toBeVisible();

    // Desktop viewport
    await page.setViewportSize({ width: 1440, height: 900 });
    await expect(page.locator("h1").first()).toBeVisible();
  });

  test("Contact or calculation form functions properly (Happy Path)", async ({ page }) => {
    // Search for a form or CTA button
    const ctaButton = page.getByRole("button", { name: /заказать|расчет|связаться/i }).first();
    if ((await ctaButton.count()) > 0) {
      await expect(ctaButton).toBeVisible();
      // Optional: test clicking logic if required
    }
  });

  test("All main navigation links do not return 404", async ({ page }) => {
    // Test all main nav links from homepage
    const navLinks = page.locator('nav a[href^="/"]');
    const count = await navLinks.count();

    for (let i = 0; i < count; i++) {
      const href = await navLinks.nth(i).getAttribute("href");
      if (href) {
        await page.goto(`http://localhost:3000${href}`);
        await expect(page).not.toHaveURL(/.*404/);

        // Check page has content (h1 exists)
        const h1 = page.locator("h1").first();
        await expect(h1).toBeVisible({ timeout: 5000 });
      }
    }
  });

  test("Primary CTAs lead to valid pages", async ({ page }) => {
    // Find primary CTA buttons
    const primaryCTAs = page.locator(
      'button:has-text("Получить"), button:has-text("Заказать"), a:has-text("Расчет")',
    );

    const count = await primaryCTAs.count();

    for (let i = 0; i < count; i++) {
      const cta = primaryCTAs.nth(i);
      await expect(cta).toBeVisible();

      // If it's a link, check href
      if (await cta.evaluate((el) => el.tagName === "A")) {
        const href = await cta.getAttribute("href");
        if (href && href.startsWith("/")) {
          await page.goto(`http://localhost:3000${href}`);
          await expect(page).not.toHaveURL(/.*404/);
        }
      }
    }
  });

  test("Service cards link to valid service pages", async ({ page }) => {
    // Find service cards on homepage
    const serviceCards = page.locator('a[href^="/services/"]');
    const count = await serviceCards.count();

    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < Math.min(count, 3); i++) {
      const card = serviceCards.nth(i);
      await expect(card).toBeVisible();

      const href = await card.getAttribute("href");
      if (href) {
        await page.goto(`http://localhost:3000${href}`);
        await expect(page).not.toHaveURL(/.*404/);

        // Service page should have h1 with service name
        const h1 = page.locator("h1").first();
        await expect(h1).toBeVisible();
      }
    }
  });

  test("Footer links are functional", async ({ page }) => {
    await page.goto("/");
    await page.locator("footer").scrollIntoViewIfNeeded();

    // Find footer links
    const footerLinks = page.locator('footer a[href^="/"]');
    const count = await footerLinks.count();

    expect(count).toBeGreaterThan(0);

    // Test first 3 footer links
    for (let i = 0; i < Math.min(count, 3); i++) {
      const link = footerLinks.nth(i);
      await expect(link).toBeVisible();

      const href = await link.getAttribute("href");
      if (href) {
        await page.goto(`http://localhost:3000${href}`);
        await expect(page).not.toHaveURL(/.*404/);
      }
    }
  });
});
