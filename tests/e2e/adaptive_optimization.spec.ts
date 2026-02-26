/**
 * Adaptive Site Optimization — E2E Test Suite
 *
 * Covers the adaptive performance infrastructure:
 *   src/hooks/useAdaptivePerformance.ts  — scoring + class application
 *   src/components/AdaptiveProvider.tsx  — context + perf debug widget
 *
 * Implementation notes that drive test design:
 *  - `perf-lite` class is added to <html> by a client-side useEffect,
 *    AFTER React hydration. Must use waitForFunction, not getAttribute.
 *  - URL param ?perf=lite is the highest-priority override and persists
 *    to localStorage via window.location.reload(). The reload is a new
 *    navigation; addInitScript only seeds the FIRST load.
 *  - prefers-reduced-motion: reduce forces tier=lite ("forced" path),
 *    but localStorage overrides it — always clear storage first.
 *  - footer ul.grid is the correct selector for the 10-item services list.
 */

import { test, expect, Page } from "@playwright/test";

const BASE = "http://127.0.0.1:3000";
const STORAGE_KEY = "electromax_perf_tier";

/**
 * Seed localStorage BEFORE the page loads via addInitScript.
 * This persists through the first navigation but NOT through reloads.
 */
async function seedStorage(page: Page, value: "lite" | "full") {
  await page.addInitScript(
    ({ key, val }) => localStorage.setItem(key, val),
    { key: STORAGE_KEY, val: value }
  );
}

/**
 * Clear the perf tier from localStorage before page load so hardware/network
 * signals take effect without a prior ?perf= visit poisoning the state.
 */
async function clearPerfStorage(page: Page) {
  await page.addInitScript((key) => localStorage.removeItem(key), STORAGE_KEY);
}

/**
 * Wait for the adaptive useEffect to apply (or not apply) the perf-lite class.
 * Uses waitForFunction which polls the real DOM after hydration.
 */
async function waitForPerfClass(page: Page, expected: "lite" | "full", timeout = 8000) {
  // Both `cls` and `isLite` must be passed in the arg object — the predicate
  // runs in browser context and cannot close over TypeScript variables.
  await page.waitForFunction(
    ({ cls, isLite }: { cls: string; isLite: boolean }) =>
      isLite
        ? document.documentElement.classList.contains(cls)
        : !document.documentElement.classList.contains(cls),
    { cls: "perf-lite", isLite: expected === "lite" },
    { timeout }
  );
}

// ---------------------------------------------------------------------------
// Test Case 1 — Lite Mode via slow-2g network + low memory
// ---------------------------------------------------------------------------
test.describe("TC-1: Lite Mode triggered by slow-2g network + 2GB RAM", () => {
  test("html element gets perf-lite class", async ({ page }) => {
    await clearPerfStorage(page);

    // Mock Network Information API and deviceMemory BEFORE first page load
    await page.addInitScript(() => {
      const conn = {
        effectiveType: "slow-2g",
        downlink: 0.1,
        saveData: false,
        addEventListener: () => { },
        removeEventListener: () => { },
      };
      Object.defineProperty(navigator, "connection", {
        get: () => conn,
        configurable: true,
      });
      Object.defineProperty(navigator, "deviceMemory", {
        get: () => 2,
        configurable: true,
      });
      // 4 cores: no bonus/penalty on hardwareScore
      Object.defineProperty(navigator, "hardwareConcurrency", {
        get: () => 4,
        configurable: true,
      });
    });

    await page.goto(BASE);
    // Score: hardwareScore = 50 - 20(ram≤2) = 30; networkScore = 10(slow-2g) capped at 20 by downlink<1 → 10
    // composite = 30*0.6 + 10*0.4 = 18+4 = 22 → tier=lite
    await waitForPerfClass(page, "lite");

    const htmlClass = await page.locator("html").getAttribute("class");
    expect(htmlClass).toContain("perf-lite");
  });

  test("perf debug widget reports LITE tier", async ({ page }) => {
    await clearPerfStorage(page);

    await page.addInitScript(() => {
      const conn = {
        effectiveType: "slow-2g",
        downlink: 0.1,
        saveData: false,
        addEventListener: () => { },
        removeEventListener: () => { },
      };
      Object.defineProperty(navigator, "connection", { get: () => conn, configurable: true });
      Object.defineProperty(navigator, "deviceMemory", { get: () => 2, configurable: true });
    });

    await page.goto(BASE);
    await waitForPerfClass(page, "lite");

    // AdaptiveProvider renders a hidden debug widget: "PERF: LITE (score)"
    const widgetText = await page
      .locator("text=/PERF: LITE/i")
      .first()
      .textContent({ timeout: 5000 });
    expect(widgetText).toMatch(/PERF: LITE/i);
  });
});

// ---------------------------------------------------------------------------
// Test Case 2 — Lite Mode via prefers-reduced-motion: reduce
// ---------------------------------------------------------------------------
test.describe("TC-2: Lite Mode forced by prefers-reduced-motion: reduce", () => {
  test("html element gets perf-lite class on fast hardware with reduced motion", async ({
    page,
  }) => {
    await clearPerfStorage(page);

    // Emulate high-end hardware: composite would be ~100 → "full" without the media query
    await page.addInitScript(() => {
      Object.defineProperty(navigator, "hardwareConcurrency", {
        get: () => 16,
        configurable: true,
      });
      Object.defineProperty(navigator, "deviceMemory", {
        get: () => 16,
        configurable: true,
      });
      // No connection mock → networkScore = 100
    });

    // emulateMedia must be called BEFORE goto so matchMedia returns 'reduce' on first eval
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(BASE);

    // prefersReducedMotion=true overrides composite score and forces tier=lite
    await waitForPerfClass(page, "lite");

    const htmlClass = await page.locator("html").getAttribute("class");
    expect(
      htmlClass,
      "prefers-reduced-motion should force perf-lite even on fast hardware"
    ).toContain("perf-lite");
  });

  test("perf debug widget reports LITE on reduced motion", async ({ page }) => {
    await clearPerfStorage(page);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(BASE);
    await waitForPerfClass(page, "lite");

    const widgetText = await page
      .locator("text=/PERF: LITE/i")
      .first()
      .textContent({ timeout: 5000 });
    expect(widgetText).toMatch(/PERF: LITE/i);
  });
});

// ---------------------------------------------------------------------------
// Test Case 3 — Manual URL Override ?perf=lite / ?perf=full
// ---------------------------------------------------------------------------
test.describe("TC-3: Manual URL override", () => {
  test("?perf=lite sets perf-lite class regardless of fast hardware", async ({ page }) => {
    await clearPerfStorage(page);

    // Fast hardware — without URL param tier would be "full"
    await page.addInitScript(() => {
      Object.defineProperty(navigator, "hardwareConcurrency", {
        get: () => 16,
        configurable: true,
      });
      Object.defineProperty(navigator, "deviceMemory", {
        get: () => 16,
        configurable: true,
      });
    });

    // The hook writes localStorage and calls window.location.reload()
    // so we navigate and then wait for the reload to settle
    await page.goto(`${BASE}/?perf=lite`);
    await page.waitForLoadState("networkidle");

    await waitForPerfClass(page, "lite");

    const htmlClass = await page.locator("html").getAttribute("class");
    expect(htmlClass, "?perf=lite URL param must set perf-lite class").toContain("perf-lite");
  });

  test("?perf=lite persists tier to localStorage after reload", async ({ page }) => {
    await clearPerfStorage(page);
    await page.goto(`${BASE}/?perf=lite`);
    // The hook writes localStorage then calls window.location.reload().
    // Wait for the reload navigation to complete (domcontentloaded is sufficient;
    // networkidle times out on the dev server due to HMR keepalive connections).
    await page.waitForLoadState("domcontentloaded");
    await waitForPerfClass(page, "lite");

    const stored = await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY);
    expect(stored, "URL override should persist to localStorage").toBe("lite");
  });

  test("localStorage=lite without URL param still activates perf-lite", async ({ page }) => {
    // Pre-seed localStorage so the hook picks it up on first load (no reload)
    await seedStorage(page, "lite");

    await page.goto(BASE);
    await waitForPerfClass(page, "lite");

    const htmlClass = await page.locator("html").getAttribute("class");
    expect(htmlClass, "localStorage=lite should activate perf-lite class").toContain("perf-lite");
  });

  test("localStorage=full prevents perf-lite on slow network", async ({ page }) => {
    // localStorage override beats the forced/network path
    await seedStorage(page, "full");

    await page.addInitScript(() => {
      const conn = { effectiveType: "slow-2g", downlink: 0.1, saveData: false, addEventListener: () => { }, removeEventListener: () => { } };
      Object.defineProperty(navigator, "connection", { get: () => conn, configurable: true });
      Object.defineProperty(navigator, "deviceMemory", { get: () => 2, configurable: true });
    });

    await page.goto(BASE);
    await page.waitForLoadState("networkidle");
    // Give the hook time to run; if it incorrectly sets lite class this will time out
    await page.waitForTimeout(1500);

    const htmlClass = await page.locator("html").getAttribute("class") ?? "";
    expect(
      htmlClass,
      "localStorage=full should suppress perf-lite even on slow-2g"
    ).not.toContain("perf-lite");
  });
});

// ---------------------------------------------------------------------------
// Test Case 4 — Responsive Layouts
// ---------------------------------------------------------------------------
test.describe("TC-4: Responsive layouts", () => {
  // Seeds localStorage BEFORE first load AND overwrites it after load to guard
  // against cross-test contamination from TC-3's window.location.reload() calls
  // which can persist "lite" into the shared browser context.
  const forceFullTier = async (page: Page) => {
    await seedStorage(page, "full"); // addInitScript for initial load
  };

  // After goto, write "full" directly into localStorage and wait for
  // the adaptive useEffect to see it. Because the page already loaded with
  // "full" seeded, no reload is needed.
  const ensureFullAfterLoad = async (page: Page) => {
    await page.evaluate((key) => localStorage.setItem(key, "full"), STORAGE_KEY);
  };

  test("Mobile (375px): Hero heading is visible", async ({ page }) => {
    await forceFullTier(page);
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(BASE);
    await page.waitForLoadState("networkidle");

    await expect(page.locator("h1")).toContainText("СИСТЕМЫ");
  });

  test("Mobile (375px): Hero CTA button is visible and within viewport width", async ({
    page,
  }) => {
    await forceFullTier(page);
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(BASE);
    await page.waitForLoadState("networkidle");

    const cta = page.locator("button:has-text('РАССЧИТАТЬ СТОИМОСТЬ')");
    await expect(cta).toBeVisible();

    const box = await cta.boundingBox();
    expect(box, "CTA button must have a bounding box").not.toBeNull();
    expect(box!.x, "CTA button left edge should not be negative").toBeGreaterThanOrEqual(0);
    expect(
      box!.x + box!.width,
      "CTA button right edge should not overflow 375px viewport"
    ).toBeLessThanOrEqual(375 + 2);
  });

  test("Desktop (1440px): Footer services ul renders exactly 10 links", async ({ page }) => {
    await forceFullTier(page);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(BASE);
    await page.waitForLoadState("networkidle");
    await page.locator("footer").scrollIntoViewIfNeeded();

    // ul.grid is the services list (10 items); other footer uls don't have .grid
    const count = await page.locator("footer ul.grid a").count();
    expect(count, "Footer services grid should contain exactly 10 links").toBe(10);
  });

  test("Desktop (1440px): Footer services render in 2-column layout", async ({ page }) => {
    await forceFullTier(page);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(BASE);
    await page.waitForLoadState("networkidle");
    await page.locator("footer").scrollIntoViewIfNeeded();

    const links = page.locator("footer ul.grid a");

    // Wait until both links have settled bounding boxes (height > 0).
    // motion.li animates from opacity:0 → 1; Playwright's toBeVisible fires at
    // opacity > 0 but the element may still have height:0 mid-animation.
    // Use in-page evaluate for geometry — more reliable than page.boundingBox()
    // when elements are inside animated containers with overflow:hidden parents.
    const [firstRect, secondRect] = await page.evaluate(() => {
      const els = Array.from(document.querySelectorAll("footer ul.grid a"));
      return [els[0], els[1]].map((el) => {
        const r = el.getBoundingClientRect();
        return { top: r.top, left: r.left, width: r.width, height: r.height };
      });
    });

    expect(firstRect.height, "first service link must have positive height").toBeGreaterThan(0);
    expect(secondRect.height, "second service link must have positive height").toBeGreaterThan(0);

    // Both links in the first grid row must share the same vertical position (±4px)
    expect(
      Math.abs(firstRect.top - secondRect.top),
      "First two footer service links should be on the same row (grid-cols-2)"
    ).toBeLessThanOrEqual(4);

    // Second link must be positioned to the right of the first
    expect(
      secondRect.left,
      "Second link should be to the right of first link in 2-col grid"
    ).toBeGreaterThan(firstRect.left + firstRect.width * 0.5);
  });

  test("Desktop (1440px): All 10 Cyrillic abbreviations visible in Footer", async ({ page }) => {
    await forceFullTier(page);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(BASE);
    await page.waitForLoadState("networkidle");
    await page.locator("footer").scrollIntoViewIfNeeded();

    const expected = ["АПС", "АСУЗ", "ЭО", "ЭОМ", "ОС", "СКС", "СКУД", "СОТ", "СОУЭ", "ТО"];
    for (const abbr of expected) {
      await expect(
        page.locator(`footer >> text="${abbr}"`).first(),
        `Footer should contain abbreviation: ${abbr}`
      ).toBeVisible();
    }
  });

  test("Mobile (375px): Footer is fully within viewport width", async ({ page }) => {
    await forceFullTier(page);
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(BASE);
    await page.waitForLoadState("networkidle");
    await page.locator("footer").scrollIntoViewIfNeeded();

    const footerBox = await page.locator("footer").boundingBox();
    expect(footerBox, "Footer must be visible with a bounding box").not.toBeNull();
    expect(
      footerBox!.width,
      "Footer must not overflow the 375px mobile viewport"
    ).toBeLessThanOrEqual(375 + 2);
  });
});
