/**
 * Ralph's Loop Test Runner — 100 Iterations
 *
 * This script runs comprehensive test suites in a loop to collect
 * performance, accessibility, and reliability metrics.
 *
 * Based on Enterprise UI/UX Governance Framework v1.0
 * Ralph's Loop: Multi-agent validation cycle for quality assurance
 */

import { test, expect } from "@playwright/test";
import type { Page } from "@playwright/test";

// ============================================================================
// CONFIGURATION
// ============================================================================

const TOTAL_ITERATIONS = 100;
const BASE_URL = "http://127.0.0.1:3000";

// Metrics collection
interface TestMetrics {
  iteration: number;
  timestamp: string;
  loadTime: number;
  lcpTime: number;
  fidTime: number;
  clsScore: number;
  accessibilityScore: number;
  errors: string[];
  warnings: string[];
  viewport: "desktop" | "tablet" | "mobile";
  success: boolean;
}

// Global metrics storage
const metricsResults: TestMetrics[] = [];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

async function measurePageLoadMetrics(page: Page): Promise<{
  loadTime: number;
  lcpTime: number;
  clsScore: number;
}> {
  const startTime = Date.now();

  await page.goto(BASE_URL);

  const loadTime = Date.now() - startTime;

  // Measure LCP (Largest Contentful Paint)
  const lcpTime = await page
    .evaluate(() => {
      return new Promise<number>((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          resolve(lastEntry.startTime);
        }).observe({ entryTypes: ["largest-contentful-paint"] });

        // Timeout after 5 seconds
        setTimeout(() => resolve(0), 5000);
      });
    })
    .catch(() => 0);

  // Measure CLS (Cumulative Layout Shift)
  const clsScore = await page
    .evaluate(() => {
      return new Promise<number>((resolve) => {
        let clsValue = 0;
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!(entry as PerformanceEntry & { hadRecentInput?: boolean }).hadRecentInput) {
              clsValue += (entry as unknown as { value: number }).value;
            }
          }
          resolve(clsValue);
        }).observe({ entryTypes: ["layout-shift"] });

        // Timeout after 5 seconds
        setTimeout(() => resolve(clsValue), 5000);
      });
    })
    .catch(() => 0);

  return { loadTime, lcpTime, clsScore };
}

async function checkAccessibility(page: Page): Promise<{
  score: number;
  violations: string[];
}> {
  const violations: string[] = [];
  let score = 100;

  // Check for skip link
  const hasSkipLink = (await page.locator('a[href="#main-content"]').count()) > 0;
  if (!hasSkipLink) {
    violations.push("Missing skip-to-content link");
    score -= 10;
  }

  // Check for main landmark
  const hasMain = (await page.locator("main, [role='main']").count()) > 0;
  if (!hasMain) {
    violations.push("Missing main landmark");
    score -= 10;
  }

  // Check for proper heading hierarchy
  const h1Count = await page.locator("h1").count();
  if (h1Count === 0) {
    violations.push("Missing h1 heading");
    score -= 15;
  } else if (h1Count > 1) {
    violations.push(`Multiple h1 headings found: ${h1Count}`);
    score -= 5;
  }

  // Check for alt text on images
  const images = await page.locator("img").count();
  const imagesWithoutAlt = await page.locator("img:not([alt])").count();
  if (imagesWithoutAlt > 0) {
    violations.push(`${imagesWithoutAlt}/${images} images missing alt text`);
    score -= Math.min(20, imagesWithoutAlt * 2);
  }

  // Check for form labels
  const inputs = await page.locator("input:not([type='hidden']), textarea").count();
  const labeledInputs = await page
    .locator("input[aria-label], input[aria-labelledby], input[id]")
    .count();
  if (inputs > labeledInputs) {
    violations.push(`${inputs - labeledInputs} form inputs missing labels`);
    score -= Math.min(15, (inputs - labeledInputs) * 3);
  }

  // Check color contrast (simplified check)
  // In production, use axe-core for proper contrast checking

  return { score: Math.max(0, score), violations };
}

// ============================================================================
// RALPH'S LOOP TEST SUITE
// ============================================================================

test.describe("Ralph's Loop — 100 Iteration Test Suite", () => {
  test.beforeEach(async ({ page, context }) => {
    // Clear cookies and storage before each iteration
    await context.clearCookies();
    // Clear storage via CDP protocol instead of evaluate
    await page.addInitScript(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  });

  test(`Run comprehensive test loop (${TOTAL_ITERATIONS} iterations)`, async ({ page }) => {
    console.log(`\n🔄 Starting Ralph's Loop: ${TOTAL_ITERATIONS} iterations\n`);

    for (let i = 1; i <= TOTAL_ITERATIONS; i++) {
      const iterationMetrics: TestMetrics = {
        iteration: i,
        timestamp: new Date().toISOString(),
        loadTime: 0,
        lcpTime: 0,
        fidTime: 0,
        clsScore: 0,
        accessibilityScore: 100,
        errors: [],
        warnings: [],
        viewport: "desktop",
        success: true,
      };

      try {
        // ========== DESKTOP TEST (60% of iterations) ==========
        if (i <= 60) {
          await page.setViewportSize({ width: 1920, height: 1080 });
          iterationMetrics.viewport = "desktop";
        }
        // ========== TABLET TEST (20% of iterations) ==========
        else if (i <= 80) {
          await page.setViewportSize({ width: 768, height: 1024 });
          iterationMetrics.viewport = "tablet";
        }
        // ========== MOBILE TEST (20% of iterations) ==========
        else {
          await page.setViewportSize({ width: 375, height: 812 });
          iterationMetrics.viewport = "mobile";
        }

        // Measure load performance
        const loadMetrics = await measurePageLoadMetrics(page);
        iterationMetrics.loadTime = loadMetrics.loadTime;
        iterationMetrics.lcpTime = loadMetrics.lcpTime;
        iterationMetrics.clsScore = loadMetrics.clsScore;

        // Check accessibility
        const a11y = await checkAccessibility(page);
        iterationMetrics.accessibilityScore = a11y.score;
        iterationMetrics.warnings.push(...a11y.violations);

        // Test critical functionality
        // 1. Navigation links work
        const navLinks = page.locator("nav a[href^='/']");
        const navCount = await navLinks.count();
        if (navCount === 0) {
          iterationMetrics.errors.push("No navigation links found");
          iterationMetrics.success = false;
        }

        // 2. Main content exists
        const mainHeading = page.locator("h1").first();
        const headingVisible = await mainHeading.isVisible().catch(() => false);
        if (!headingVisible) {
          iterationMetrics.errors.push("Main heading not visible");
          iterationMetrics.success = false;
        }

        // 3. CTA buttons exist
        const ctaButtons = page.locator(
          'button:has-text("Получить"), button:has-text("Расчет"), a:has-text("Расчет")',
        );
        const ctaCount = await ctaButtons.count();
        if (ctaCount === 0) {
          iterationMetrics.warnings.push("No CTA buttons found");
        }

        // 4. Test service cards (if on homepage)
        if (page.url() === BASE_URL + "/" || page.url() === BASE_URL) {
          const serviceCards = page.locator('a[href^="/services/"]');
          const cardCount = await serviceCards.count();
          if (cardCount === 0) {
            iterationMetrics.warnings.push("No service cards found on homepage");
          }
        }

        // 5. Check for console errors
        page.on("console", (msg) => {
          if (msg.type() === "error") {
            iterationMetrics.errors.push(`Console: ${msg.text()}`);
          } else if (msg.type() === "warning") {
            iterationMetrics.warnings.push(`Console: ${msg.text()}`);
          }
        });

        // 6. Test responsive behavior
        if (iterationMetrics.viewport === "mobile") {
          // Check touch targets are at least 44px
          const buttons = page.locator("button, a[role='button']");
          const buttonCount = await buttons.count();
          for (let j = 0; j < Math.min(buttonCount, 5); j++) {
            const button = buttons.nth(j);
            const box = await button.boundingBox().catch(() => null);
            if (box && (box.height < 44 || box.width < 44)) {
              iterationMetrics.warnings.push(
                `Touch target too small: ${Math.round(box.width)}x${Math.round(box.height)}px`,
              );
            }
          }
        }

        // 7. Test animation performance (check for reduced motion support)
        const prefersReducedMotion = await page.evaluate(() => {
          return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        });

        if (!prefersReducedMotion) {
          // Check if animations respect motion preferences
          const animatedElements = page.locator("[class*='animate'], [style*='animation']");
          const animationCount = await animatedElements.count();
          if (animationCount > 10) {
            iterationMetrics.warnings.push(`${animationCount} animated elements found`);
          }
        }

        // 8. Test form functionality (Contacts page)
        if (i % 10 === 0) {
          // Every 10th iteration, test the contact form
          await page.goto(`${BASE_URL}/contacts`);
          const form = page.locator("form");
          const formExists = (await form.count()) > 0;
          if (!formExists) {
            iterationMetrics.errors.push("Contact form not found");
          }

          // Test phone input formatting
          const phoneInput = form.locator('input[type="tel"]');
          const phoneExists = (await phoneInput.count()) > 0;
          if (!phoneExists) {
            iterationMetrics.warnings.push("Phone input not found in contact form");
          }

          // Return to homepage
          await page.goto(BASE_URL);
        }

        // 9. Test service pages (rotate through different services)
        if (i % 5 === 0) {
          const services = ["aps", "skud", "sot", "soue", "sks"];
          const serviceIndex = Math.floor((i / 5) % services.length);
          const serviceSlug = services[serviceIndex];

          await page.goto(`${BASE_URL}/services/${serviceSlug}`);
          const serviceHeading = page.locator("h1").first();
          const serviceHeadingVisible = await serviceHeading.isVisible().catch(() => false);
          if (!serviceHeadingVisible) {
            iterationMetrics.errors.push(`Service page ${serviceSlug} missing heading`);
          }

          // Return to homepage
          await page.goto(BASE_URL);
        }

        // 10. Test projects page filter
        if (i % 7 === 0) {
          await page.goto(`${BASE_URL}/projects`);
          const filterButtons = page.locator("button[aria-pressed]");
          const filterCount = await filterButtons.count();
          if (filterCount > 0) {
            await filterButtons.first().click();
            await page.waitForTimeout(300);
          }

          // Return to homepage
          await page.goto(BASE_URL);
        }

        // Store metrics
        metricsResults.push(iterationMetrics);

        // Log progress every 10 iterations
        if (i % 10 === 0) {
          const successRate = (metricsResults.filter((m) => m.success).length / i) * 100;
          const avgLoadTime = metricsResults.reduce((sum, m) => sum + m.loadTime, 0) / i;
          const avgA11yScore = metricsResults.reduce((sum, m) => sum + m.accessibilityScore, 0) / i;

          console.log(
            `📊 Iteration ${i}/${TOTAL_ITERATIONS}: ` +
              `Success: ${successRate.toFixed(1)}%, ` +
              `Avg Load: ${avgLoadTime.toFixed(0)}ms, ` +
              `Avg A11Y: ${avgA11yScore.toFixed(0)}`,
          );
        }
      } catch (error) {
        iterationMetrics.errors.push(`Test error: ${(error as Error).message}`);
        iterationMetrics.success = false;
        metricsResults.push(iterationMetrics);

        console.error(`❌ Iteration ${i} failed:`, error);
      }
    }

    // ========================================================================
    // GENERATE FINAL REPORT
    // ========================================================================

    console.log("\n\n📈 ======================================================================");
    console.log("📈 RALPH'S LOOP — FINAL REPORT");
    console.log("📈 ======================================================================\n");

    const totalTests = metricsResults.length;
    const successfulTests = metricsResults.filter((m) => m.success).length;
    const successRate = (successfulTests / totalTests) * 100;

    const avgLoadTime = metricsResults.reduce((sum, m) => sum + m.loadTime, 0) / totalTests;
    const avgLcpTime = metricsResults.reduce((sum, m) => sum + m.lcpTime, 0) / totalTests;
    const avgClsScore = metricsResults.reduce((sum, m) => sum + m.clsScore, 0) / totalTests;
    const avgA11yScore =
      metricsResults.reduce((sum, m) => sum + m.accessibilityScore, 0) / totalTests;

    const minLoadTime = Math.min(...metricsResults.map((m) => m.loadTime));
    const maxLoadTime = Math.max(...metricsResults.map((m) => m.loadTime));
    const p95LoadTime = metricsResults.map((m) => m.loadTime).sort((a, b) => a - b)[
      Math.floor(totalTests * 0.95)
    ];

    const allErrors = metricsResults.flatMap((m) => m.errors);
    const allWarnings = metricsResults.flatMap((m) => m.warnings);
    const uniqueErrors = [...new Set(allErrors)];
    const uniqueWarnings = [...new Set(allWarnings)];

    const desktopTests = metricsResults.filter((m) => m.viewport === "desktop");
    const tabletTests = metricsResults.filter((m) => m.viewport === "tablet");
    const mobileTests = metricsResults.filter((m) => m.viewport === "mobile");

    console.log(`📊 Test Summary:`);
    console.log(`   Total Iterations: ${totalTests}`);
    console.log(`   Successful: ${successfulTests}/${totalTests} (${successRate.toFixed(1)}%)`);
    console.log(`   Failed: ${totalTests - successfulTests}\n`);

    console.log(`⏱️  Performance Metrics:`);
    console.log(`   Average Load Time: ${avgLoadTime.toFixed(0)}ms`);
    console.log(`   Min Load Time: ${minLoadTime}ms`);
    console.log(`   Max Load Time: ${maxLoadTime}ms`);
    console.log(`   P95 Load Time: ${p95LoadTime}ms`);
    console.log(`   Average LCP: ${avgLcpTime.toFixed(0)}ms`);
    console.log(`   Average CLS: ${avgClsScore.toFixed(3)}\n`);

    console.log(`♿ Accessibility:`);
    console.log(`   Average Score: ${avgA11yScore.toFixed(0)}/100`);
    console.log(`   Total Warnings: ${allWarnings.length}`);
    console.log(`   Unique Warnings: ${uniqueWarnings.length}\n`);

    console.log(`📱 Responsive Testing:`);
    console.log(`   Desktop (1920x1080): ${desktopTests.length} iterations`);
    console.log(`   Tablet (768x1024): ${tabletTests.length} iterations`);
    console.log(`   Mobile (375x812): ${mobileTests.length} iterations\n`);

    if (uniqueErrors.length > 0) {
      console.log(`❌ Errors Encountered:`);
      uniqueErrors.forEach((error, i) => {
        const count = allErrors.filter((e) => e === error).length;
        console.log(`   ${i + 1}. ${error} (${count} occurrences)`);
      });
      console.log();
    }

    if (uniqueWarnings.length > 0) {
      console.log(`⚠️  Warnings Encountered:`);
      uniqueWarnings.forEach((warning, i) => {
        const count = allWarnings.filter((w) => w === warning).length;
        console.log(`   ${i + 1}. ${warning} (${count} occurrences)`);
      });
      console.log();
    }

    // Core Web Vitals Assessment
    console.log(`🎯 Core Web Vitals Assessment:`);
    const lcpStatus =
      avgLcpTime < 2500 ? "✅ GOOD" : avgLcpTime < 4000 ? "⚠️  NEEDS IMPROVEMENT" : "❌ POOR";
    const clsStatus =
      avgClsScore < 0.1 ? "✅ GOOD" : avgClsScore < 0.25 ? "⚠️  NEEDS IMPROVEMENT" : "❌ POOR";
    console.log(`   LCP: ${avgLcpTime.toFixed(0)}ms — ${lcpStatus}`);
    console.log(`   CLS: ${avgClsScore.toFixed(3)} — ${clsStatus}`);
    console.log(
      `   Overall: ${lcpStatus === "✅ GOOD" && clsStatus === "✅ GOOD" ? "✅ PASS" : "⚠️  NEEDS IMPROVEMENT"}\n`,
    );

    // Ralph's Loop Quality Gate
    console.log(`🔄 Ralph's Loop Quality Gate:`);
    const qualityGatePass =
      successRate >= 95 && avgA11yScore >= 90 && avgLcpTime < 2500 && avgClsScore < 0.1;

    if (qualityGatePass) {
      console.log(`   ✅ ALL CHECKS PASSED`);
      console.log(`   - Success Rate: ${successRate.toFixed(1)}% (≥95% required)`);
      console.log(`   - Accessibility: ${avgA11yScore.toFixed(0)}/100 (≥90 required)`);
      console.log(`   - LCP: ${avgLcpTime.toFixed(0)}ms (<2500ms required)`);
      console.log(`   - CLS: ${avgClsScore.toFixed(3)} (<0.1 required)`);
    } else {
      console.log(`   ❌ QUALITY GATE FAILED`);
      if (successRate < 95)
        console.log(`   - Success Rate: ${successRate.toFixed(1)}% (≥95% required)`);
      if (avgA11yScore < 90)
        console.log(`   - Accessibility: ${avgA11yScore.toFixed(0)}/100 (≥90 required)`);
      if (avgLcpTime >= 2500)
        console.log(`   - LCP: ${avgLcpTime.toFixed(0)}ms (<2500ms required)`);
      if (avgClsScore >= 0.1) console.log(`   - CLS: ${avgClsScore.toFixed(3)} (<0.1 required)`);
    }

    console.log("\n📈 ======================================================================");
    console.log("📈 END OF REPORT");
    console.log("📈 ======================================================================\n");

    // Assert quality gate
    expect(successRate, "Success rate should be ≥95%").toBeGreaterThanOrEqual(95);
    expect(avgA11yScore, "Accessibility score should be ≥90").toBeGreaterThanOrEqual(90);
    expect(avgLcpTime, "LCP should be <2500ms").toBeLessThan(2500);
    expect(avgClsScore, "CLS should be <0.1").toBeLessThan(0.1);
  });
});
