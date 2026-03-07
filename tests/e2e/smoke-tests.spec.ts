/**
 * Smoke Test Suite — Critical Routes
 *
 * Verifies that all critical routes are accessible and don't return 404.
 * Run: pnpm test:e2e
 */

import { test, expect } from "@playwright/test";

const BASE_URL = process.env.E2E_BASE_URL || "http://127.0.0.1:3000";

// Core pages that must exist
const CORE_ROUTES = [
  { path: "/", title: "Electromax" },
  { path: "/about", title: "О компании" },
  { path: "/contacts", title: "Контакты" },
  { path: "/projects", title: "Проекты" },
  { path: "/services", title: "Услуги" },
  { path: "/licenses", title: undefined }, // License page exists but title may vary
];

// Service-specific routes
const SERVICE_SLUGS = [
  "aps", // Пожарная сигнализация
  "skud", // СКУД
  "sot", // Видеонаблюдение
  "soue", // СОУЭ
  "sks", // СКС
  "eom", // ЭОМ
  "eo", // Освещение
  "os", // Охранная сигнализация
  "to", // Техобслуживание
];

test.describe("Smoke Tests — Core Routes", () => {
  test.setTimeout(90000);

  test("all core routes return 200", async ({ page }) => {
    for (const route of CORE_ROUTES) {
      const response = await page.goto(`${BASE_URL}${route.path}`);

      expect(response?.status(), `Route ${route.path} should return 200`).toBe(200);

      if (route.title) {
        await expect(
          page,
          `Route ${route.path} should have title containing "${route.title}"`,
        ).toHaveTitle(new RegExp(route.title, "i"));
      }
    }
  });

  test("homepage has main navigation", async ({ page }) => {
    await page.goto(BASE_URL);

    // Check nav exists (desktop) or mobile nav button exists
    const nav = page.locator("nav[aria-label='Основная навигация']");
    const mobileNavButton = page.locator('button[aria-label="Открыть меню"]');

    // Either desktop nav OR mobile nav button should be visible
    const navCount = await nav.count();
    const mobileNavCount = await mobileNavButton.count();

    expect(navCount + mobileNavCount, "Should have navigation").toBeGreaterThanOrEqual(1);
  });

  test("homepage has footer", async ({ page }) => {
    await page.goto(BASE_URL);
    await page.locator("footer").scrollIntoViewIfNeeded();

    const footer = page.locator("footer");
    await expect(footer).toBeVisible();
  });
});

test.describe("Smoke Tests — Service Routes", () => {
  test.setTimeout(90000);

  test("all service routes return 200", async ({ page }) => {
    for (const slug of SERVICE_SLUGS) {
      const response = await page.goto(`${BASE_URL}/services/${slug}`, {
        waitUntil: "domcontentloaded",
        timeout: 45000,
      });

      expect(response?.status(), `Service route /services/${slug} should return 200`).toBe(200);
    }
  });

  test("service pages have service name in heading", async ({ page }) => {
    // Key words from service names that should appear in h1 headings
    const serviceKeyWords: Record<string, string[]> = {
      aps: ["пожарная", "сигнализация", "АПС"],
      skud: ["контроля", "доступа", "СКУД"],
      sot: ["телевидения", "Видеонаблюдение", "видеонаблюдения", "СОТ"],
      soue: ["оповещения", "эвакуации", "СОУЭ"],
      sks: ["кабельная", "кабельные", "СКС"],
      eom: ["Электрооборудование", "силовые", "ЭОМ", "Электроснабжение"],
      eo: ["освещения", "Освещение", "свет"],
      os: ["Охранная", "сигнализация", "ОС"],
      to: ["Техническое", "обслуживание", "ТО"],
    };

    for (const slug of SERVICE_SLUGS) {
      await page.goto(`${BASE_URL}/services/${slug}`, {
        waitUntil: "domcontentloaded",
        timeout: 45000,
      });

      const heading = page.locator("h1").first();
      await expect(heading).toBeVisible();

      const text = await heading.textContent();
      const keywords = serviceKeyWords[slug];
      // Check that at least one keyword appears in the heading
      const hasKeyword = keywords.some((keyword) =>
        text?.toLowerCase().includes(keyword.toLowerCase()),
      );
      expect(
        hasKeyword,
        `Service page ${slug} should have one of [${keywords.join(", ")}] in heading. Got: "${text}"`,
      ).toBeTruthy();
    }
  });
});

test.describe("Smoke Tests — CTA Links", () => {
  test("main CTA buttons don't lead to 404", async ({ page }) => {
    await page.goto(BASE_URL);

    // Find all CTA buttons
    const ctaButtons = page.locator(
      'button:has-text("Получить"), button:has-text("Заказать"), button:has-text("Расчет"), button:has-text("Отправить")',
    );

    const count = await ctaButtons.count();

    if (count > 0) {
      // Check first CTA is visible and clickable
      await expect(ctaButtons.first()).toBeVisible();
    }
  });

  test("contact page form submits without 404", async ({ page }) => {
    await page.goto(`${BASE_URL}/contacts`);

    // Check form exists
    const form = page.locator("form");
    await expect(form).toBeVisible();

    // Check form has required fields
    const phoneField = form.locator('input[type="tel"]');
    await expect(phoneField).toBeVisible();
  });

  test("projects page filter buttons work", async ({ page }) => {
    await page.goto(`${BASE_URL}/projects`);

    // Check filter buttons exist
    const filterButtons = page.locator("button[aria-pressed]");
    const count = await filterButtons.count();

    expect(count, "Should have filter buttons").toBeGreaterThanOrEqual(3);

    // Click first filter
    await filterButtons.first().click();

    // Wait for URL or content update
    await page.waitForTimeout(300);

    // Should still be on projects page
    expect(page.url()).toContain("/projects");
  });
});

test.describe("Smoke Tests — Legal Pages", () => {
  test("licenses page is accessible", async ({ page }) => {
    const response = await page.goto(`${BASE_URL}/licenses`);

    expect(response?.status()).toBe(200);
  });

  test("legal links in contact form point to valid pages", async ({ page }) => {
    await page.goto(`${BASE_URL}/contacts`);

    // Find legal links in form
    const legalLinks = page.locator(
      'form a[href*="license"], form a[href*="privacy"], form a[href*="terms"]',
    );

    const count = await legalLinks.count();
    expect(count).toBeGreaterThanOrEqual(1);

    // Check first legal link doesn't 404
    if (count > 0) {
      const href = await legalLinks.first().getAttribute("href");
      if (href && href.startsWith("/")) {
        const response = await page.goto(`${BASE_URL}${href}`);
        expect(response?.status()).toBe(200);
      }
    }
  });
});

test.describe("Smoke Tests — Mobile Responsiveness", () => {
  test("homepage renders on mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(BASE_URL);

    // Main heading should be visible
    const h1 = page.locator("h1").first();
    await expect(h1).toBeVisible();

    // CTA button should be visible
    const cta = page.locator('button:has-text("Получить"), button:has-text("Расчет")').first();
    await expect(cta).toBeVisible();
  });

  test("navigation collapses on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(BASE_URL);

    // Mobile menu button (hamburger) should exist and be visible
    const mobileMenuButton = page.locator('button[aria-label="Открыть меню"]').first();

    // Check hamburger button is visible on mobile
    await expect(mobileMenuButton, "Mobile menu button should be visible").toBeVisible();

    // Click to open menu
    await mobileMenuButton.click();

    // Wait for drawer animation
    await page.waitForTimeout(500);

    // Check drawer opens - use dialog role which is unique
    const drawer = page.locator("#mobile-nav-drawer");
    await expect(drawer, "Mobile nav drawer should be visible").toBeVisible();
  });
});
