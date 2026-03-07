#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-unused-vars */
/**
 * Ralph's Loop Test Runner — 100 Iterations
 *
 * Executes comprehensive test suite and generates detailed report
 * Based on Enterprise UI/UX Governance Framework v1.0
 */

const { chromium } = require("@playwright/test");
const fs = require("fs");
const path = require("path");

const TOTAL_ITERATIONS = 100;
const BASE_URL = "http://127.0.0.1:3000";
const REPORT_DIR = path.join(__dirname, "..", "docs", "genesis", "v1");

// Metrics storage
const metricsResults = [];

// Viewport configurations
const VIEWPORTS = {
  desktop: { width: 1920, height: 1080 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 375, height: 812 },
};

// Test pages
const TEST_PAGES = [
  { path: "/", name: "Home" },
  { path: "/about", name: "About" },
  { path: "/contacts", name: "Contacts" },
  { path: "/projects", name: "Projects" },
  { path: "/services", name: "Services" },
  { path: "/services/aps", name: "Service APS" },
  { path: "/services/skud", name: "Service SKUD" },
  { path: "/services/sot", name: "Service SOT" },
  { path: "/licenses", name: "Licenses" },
];

async function measurePageLoadMetrics(page) {
  const startTime = Date.now();

  try {
    await page.goto(BASE_URL, { waitUntil: "networkidle", timeout: 30000 });
  } catch (e) {
    console.warn("Page load timeout, continuing...");
  }

  const loadTime = Date.now() - startTime;

  // Measure LCP
  let lcpTime = 0;
  try {
    lcpTime = await page.evaluate(() => {
      return new Promise((resolve) => {
        let lcpValue = 0;
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          if (entries.length > 0) {
            lcpValue = entries[entries.length - 1].startTime;
          }
        });
        observer.observe({ entryTypes: ["largest-contentful-paint"] });

        setTimeout(() => {
          observer.disconnect();
          resolve(lcpValue);
        }, 3000);
      });
    });
  } catch (e) {
    lcpTime = 0;
  }

  // Measure CLS
  let clsScore = 0;
  try {
    clsScore = await page.evaluate(() => {
      return new Promise((resolve) => {
        let clsValue = 0;
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          }
        });
        observer.observe({ entryTypes: ["layout-shift"] });

        setTimeout(() => {
          observer.disconnect();
          resolve(clsValue);
        }, 3000);
      });
    });
  } catch (e) {
    clsScore = 0;
  }

  return { loadTime, lcpTime, clsScore };
}

async function checkAccessibility(page) {
  const violations = [];
  let score = 100;

  try {
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
    const inputs = await page.locator('input:not([type="hidden"]), textarea').count();
    const labeledInputs = await page
      .locator("input[aria-label], input[aria-labelledby], input[id]")
      .count();
    if (inputs > labeledInputs && inputs > 0) {
      violations.push(`${inputs - labeledInputs} form inputs missing labels`);
      score -= Math.min(15, (inputs - labeledInputs) * 3);
    }

    // Check touch targets on mobile
    const viewport = page.viewportSize();
    if (viewport && viewport.width <= 768) {
      const buttons = page.locator('button, a[role="button"]');
      const buttonCount = await buttons.count();
      for (let i = 0; i < Math.min(buttonCount, 5); i++) {
        const button = buttons.nth(i);
        const box = await button.boundingBox();
        if (box && (box.height < 44 || box.width < 44)) {
          violations.push(
            `Touch target too small: ${Math.round(box.width)}x${Math.round(box.height)}px`,
          );
          score -= 3;
        }
      }
    }
  } catch (e) {
    violations.push(`Accessibility check error: ${e.message}`);
    score -= 10;
  }

  return { score: Math.max(0, score), violations };
}

async function testNavigation(page) {
  const errors = [];
  const warnings = [];

  try {
    // Check navigation links
    const navLinks = page.locator('nav a[href^="/"]');
    const navCount = await navLinks.count();
    if (navCount === 0) {
      errors.push("No navigation links found");
    } else if (navCount < 3) {
      warnings.push(`Only ${navCount} navigation links found`);
    }

    // Check footer
    const footer = page.locator("footer");
    const footerVisible = await footer.isVisible().catch(() => false);
    if (!footerVisible) {
      warnings.push("Footer not visible");
    }

    // Check CTA buttons
    const ctaButtons = page.locator(
      'button:has-text("Получить"), button:has-text("Расчет"), a:has-text("Расчет")',
    );
    const ctaCount = await ctaButtons.count();
    if (ctaCount === 0) {
      warnings.push("No CTA buttons found");
    }
  } catch (e) {
    errors.push(`Navigation test error: ${e.message}`);
  }

  return { errors, warnings };
}

async function runIteration(browser, iteration) {
  const context = await browser.newContext();
  const page = await context.newPage();

  const metrics = {
    iteration,
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
    pagesTested: [],
  };

  try {
    // Determine viewport based on iteration
    let viewportName = "desktop";
    if (iteration > 60 && iteration <= 80) {
      viewportName = "tablet";
    } else if (iteration > 80) {
      viewportName = "mobile";
    }

    metrics.viewport = viewportName;
    await page.setViewportSize(VIEWPORTS[viewportName]);

    // Test multiple pages
    const pagesToTest = iteration % 10 === 0 ? TEST_PAGES : [TEST_PAGES[0]];

    for (const testPage of pagesToTest) {
      try {
        await page.goto(`${BASE_URL}${testPage.path}`, {
          waitUntil: "domcontentloaded",
          timeout: 15000,
        });

        // Measure load metrics on homepage only
        if (testPage.path === "/") {
          const loadMetrics = await measurePageLoadMetrics(page);
          metrics.loadTime = loadMetrics.loadTime;
          metrics.lcpTime = loadMetrics.lcpTime;
          metrics.clsScore = loadMetrics.clsScore;
        }

        // Check accessibility
        const a11y = await checkAccessibility(page);
        if (a11y.violations.length > 0) {
          metrics.warnings.push(...a11y.violations.map((v) => `[${testPage.name}] ${v}`));
        }
        metrics.accessibilityScore = Math.min(metrics.accessibilityScore, a11y.score);

        // Test navigation
        const navTest = await testNavigation(page);
        metrics.errors.push(...navTest.errors);
        metrics.warnings.push(...navTest.warnings);

        metrics.pagesTested.push(testPage.name);
      } catch (e) {
        metrics.errors.push(`Page ${testPage.name} error: ${e.message}`);
      }
    }

    // Test specific functionality based on iteration
    if (iteration % 5 === 0) {
      // Test service pages
      const services = ["aps", "skud", "sot", "soue", "sks"];
      const serviceIndex = Math.floor((iteration / 5) % services.length);
      try {
        await page.goto(`${BASE_URL}/services/${services[serviceIndex]}`, {
          waitUntil: "domcontentloaded",
          timeout: 10000,
        });
        const heading = page.locator("h1").first();
        const headingVisible = await heading.isVisible().catch(() => false);
        if (!headingVisible) {
          metrics.errors.push(`Service ${services[serviceIndex]} missing heading`);
        }
        metrics.pagesTested.push(`Service ${services[serviceIndex]}`);
      } catch (e) {
        metrics.warnings.push(`Service page test skipped: ${e.message}`);
      }
    }

    if (iteration % 7 === 0) {
      // Test projects filter
      try {
        await page.goto(`${BASE_URL}/projects`, {
          waitUntil: "domcontentloaded",
          timeout: 10000,
        });
        const filterButtons = page.locator("button[aria-pressed]");
        const filterCount = await filterButtons.count();
        if (filterCount > 0) {
          await filterButtons.first().click();
          await page.waitForTimeout(200);
        }
        metrics.pagesTested.push("Projects (with filter)");
      } catch (e) {
        metrics.warnings.push(`Projects filter test skipped: ${e.message}`);
      }
    }

    if (iteration % 10 === 0) {
      // Test contact form
      try {
        await page.goto(`${BASE_URL}/contacts`, {
          waitUntil: "domcontentloaded",
          timeout: 10000,
        });
        const form = page.locator("form");
        const formExists = (await form.count()) > 0;
        if (!formExists) {
          metrics.errors.push("Contact form not found");
        }
        const phoneInput = form.locator('input[type="tel"]');
        const phoneExists = (await phoneInput.count()) > 0;
        if (!phoneExists) {
          metrics.warnings.push("Phone input not found in contact form");
        }
        metrics.pagesTested.push("Contacts (form test)");
      } catch (e) {
        metrics.warnings.push(`Contact form test skipped: ${e.message}`);
      }
    }

    // Check for console errors
    page.on("console", (msg) => {
      if (msg.type() === "error" && !msg.text().includes("favicon")) {
        metrics.errors.push(`Console: ${msg.text().substring(0, 100)}`);
      }
    });

    // Determine success
    if (metrics.errors.length > 0) {
      metrics.success = false;
    }
  } catch (error) {
    metrics.errors.push(`Iteration error: ${error.message}`);
    metrics.success = false;
  } finally {
    await context.close();
  }

  return metrics;
}

function generateReport(results) {
  const totalTests = results.length;
  const successfulTests = results.filter((m) => m.success).length;
  const successRate = (successfulTests / totalTests) * 100;

  const avgLoadTime = results.reduce((sum, m) => sum + m.loadTime, 0) / totalTests;
  const avgLcpTime = results.reduce((sum, m) => sum + m.lcpTime, 0) / totalTests;
  const avgClsScore = results.reduce((sum, m) => sum + m.clsScore, 0) / totalTests;
  const avgA11yScore = results.reduce((sum, m) => sum + m.accessibilityScore, 0) / totalTests;

  const loadTimes = results.map((m) => m.loadTime).sort((a, b) => a - b);
  const minLoadTime = loadTimes[0];
  const maxLoadTime = loadTimes[loadTimes.length - 1];
  const p50LoadTime = loadTimes[Math.floor(totalTests * 0.5)];
  const p95LoadTime = loadTimes[Math.floor(totalTests * 0.95)];
  const p99LoadTime = loadTimes[Math.floor(totalTests * 0.99)];

  const allErrors = results.flatMap((m) => m.errors);
  const allWarnings = results.flatMap((m) => m.warnings);
  const uniqueErrors = [...new Set(allErrors)];
  const uniqueWarnings = [...new Set(allWarnings)];

  const desktopTests = results.filter((m) => m.viewport === "desktop");
  const tabletTests = results.filter((m) => m.viewport === "tablet");
  const mobileTests = results.filter((m) => m.viewport === "mobile");

  const errorCounts = {};
  allErrors.forEach((e) => {
    errorCounts[e] = (errorCounts[e] || 0) + 1;
  });

  const warningCounts = {};
  allWarnings.forEach((w) => {
    warningCounts[w] = (warningCounts[w] || 0) + 1;
  });

  const pagesTested = new Set(results.flatMap((m) => m.pagesTested));

  // Core Web Vitals Assessment
  const lcpStatus = avgLcpTime < 2500 ? "GOOD" : avgLcpTime < 4000 ? "NEEDS_IMPROVEMENT" : "POOR";
  const clsStatus = avgClsScore < 0.1 ? "GOOD" : avgClsScore < 0.25 ? "NEEDS_IMPROVEMENT" : "POOR";

  // Quality Gate
  const qualityGatePass =
    successRate >= 95 && avgA11yScore >= 90 && avgLcpTime < 2500 && avgClsScore < 0.1;

  const report = {
    summary: {
      totalIterations: totalTests,
      successfulIterations: successfulTests,
      failedIterations: totalTests - successfulTests,
      successRate: parseFloat(successRate.toFixed(2)),
      testDate: new Date().toISOString(),
      baseUrl: BASE_URL,
    },
    performance: {
      averageLoadTime: parseFloat(avgLoadTime.toFixed(0)),
      minLoadTime,
      maxLoadTime,
      p50LoadTime,
      p95LoadTime,
      p99LoadTime,
      averageLcp: parseFloat(avgLcpTime.toFixed(0)),
      averageCls: parseFloat(avgClsScore.toFixed(3)),
      lcpStatus,
      clsStatus,
      coreWebVitalsPass: lcpStatus === "GOOD" && clsStatus === "GOOD",
    },
    accessibility: {
      averageScore: parseFloat(avgA11yScore.toFixed(0)),
      totalWarnings: allWarnings.length,
      uniqueWarnings: uniqueWarnings.length,
    },
    responsiveTesting: {
      desktop: desktopTests.length,
      tablet: tabletTests.length,
      mobile: mobileTests.length,
    },
    errors: {
      total: allErrors.length,
      unique: uniqueErrors.length,
      byType: errorCounts,
    },
    warnings: {
      total: allWarnings.length,
      unique: uniqueWarnings.length,
      byType: warningCounts,
    },
    coverage: {
      pagesTested: Array.from(pagesTested),
      totalUniquePages: pagesTested.size,
    },
    qualityGate: {
      passed: qualityGatePass,
      criteria: {
        successRate: {
          required: 95,
          actual: parseFloat(successRate.toFixed(2)),
          passed: successRate >= 95,
        },
        accessibility: {
          required: 90,
          actual: parseFloat(avgA11yScore.toFixed(0)),
          passed: avgA11yScore >= 90,
        },
        lcp: {
          required: "<2500ms",
          actual: parseFloat(avgLcpTime.toFixed(0)),
          passed: avgLcpTime < 2500,
        },
        cls: {
          required: "<0.1",
          actual: parseFloat(avgClsScore.toFixed(3)),
          passed: avgClsScore < 0.1,
        },
      },
    },
    rawMetrics: results,
  };

  return report;
}

function generateMarkdownReport(report) {
  const { summary, performance, accessibility, responsiveTesting, errors, warnings, qualityGate } =
    report;

  const timestamp = new Date().toISOString().split("T")[0];

  return `# 🔄 Ralph's Loop Test Report — 100 Iterations

**Project**: Electromax  
**Test Date**: ${summary.testDate}  
**Report Generated**: ${new Date().toISOString()}  
**Total Iterations**: ${summary.totalIterations}  
**Base URL**: ${summary.baseUrl}

---

## 📊 Executive Summary

| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| **Success Rate** | ${summary.successRate}% | ≥95% | ${summary.successRate >= 95 ? "✅ PASS" : "❌ FAIL"} |
| **Avg Load Time** | ${performance.averageLoadTime}ms | <3000ms | ${performance.averageLoadTime < 3000 ? "✅ PASS" : "❌ FAIL"} |
| **Avg LCP** | ${performance.averageLcp}ms | <2500ms | ${performance.lcpStatus === "GOOD" ? "✅ PASS" : "⚠️ " + performance.lcpStatus} |
| **Avg CLS** | ${performance.averageCls} | <0.1 | ${performance.clsStatus === "GOOD" ? "✅ PASS" : "⚠️ " + performance.clsStatus} |
| **Accessibility** | ${accessibility.averageScore}/100 | ≥90 | ${accessibility.averageScore >= 90 ? "✅ PASS" : "❌ FAIL"} |
| **Quality Gate** | — | — | ${qualityGate.passed ? "✅ PASS" : "❌ FAIL"} |

---

## 📈 Performance Metrics

### Load Time Distribution

| Metric | Value |
|--------|-------|
| Minimum | ${performance.minLoadTime}ms |
| P50 (Median) | ${performance.p50LoadTime}ms |
| Average | ${performance.averageLoadTime}ms |
| P95 | ${performance.p95LoadTime}ms |
| P99 | ${performance.p99LoadTime}ms |
| Maximum | ${performance.maxLoadTime}ms |

### Core Web Vitals

| Metric | Value | Status | Target |
|--------|-------|--------|--------|
| LCP (Largest Contentful Paint) | ${performance.averageLcp}ms | ${performance.lcpStatus} | <2500ms |
| CLS (Cumulative Layout Shift) | ${performance.averageCls} | ${performance.clsStatus} | <0.1 |
| **Overall CWV** | — | ${performance.coreWebVitalsPass ? "✅ PASS" : "⚠️ NEEDS IMPROVEMENT"} | — |

---

## ♿ Accessibility

| Metric | Value |
|--------|-------|
| Average Score | ${accessibility.averageScore}/100 |
| Total Warnings | ${accessibility.totalWarnings} |
| Unique Warnings | ${accessibility.uniqueWarnings} |

### Top Accessibility Warnings

${
  Object.entries(warnings.byType)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([warning, count], i) => `${i + 1}. **${warning}** (${count} occurrences)`)
    .join("\n") || "No warnings recorded"
}

---

## 📱 Responsive Testing

| Viewport | Iterations | Percentage |
|----------|------------|------------|
| Desktop (1920×1080) | ${responsiveTesting.desktop} | ${((responsiveTesting.desktop / summary.totalIterations) * 100).toFixed(0)}% |
| Tablet (768×1024) | ${responsiveTesting.tablet} | ${((responsiveTesting.tablet / summary.totalIterations) * 100).toFixed(0)}% |
| Mobile (375×812) | ${responsiveTesting.mobile} | ${((responsiveTesting.mobile / summary.totalIterations) * 100).toFixed(0)}% |

---

## ❌ Errors

| Metric | Count |
|--------|-------|
| Total Errors | ${errors.total} |
| Unique Errors | ${errors.unique} |

### Error Breakdown

${
  Object.entries(errors.byType)
    .sort(([, a], [, b]) => b - a)
    .map(([error, count], i) => `${i + 1}. **${error}** (${count} occurrences)`)
    .join("\n") || "No errors recorded"
}

---

## 🎯 Quality Gate Results

${qualityGate.passed ? "### ✅ ALL CHECKS PASSED" : "### ❌ QUALITY GATE FAILED"}

| Criterion | Required | Actual | Status |
|-----------|----------|--------|--------|
| Success Rate | ≥95% | ${qualityGate.criteria.successRate.actual}% | ${qualityGate.criteria.successRate.passed ? "✅" : "❌"} |
| Accessibility | ≥90 | ${qualityGate.criteria.accessibility.actual} | ${qualityGate.criteria.accessibility.passed ? "✅" : "❌"} |
| LCP | <2500ms | ${qualityGate.criteria.lcp.actual}ms | ${qualityGate.criteria.lcp.passed ? "✅" : "❌"} |
| CLS | <0.1 | ${qualityGate.criteria.cls.actual} | ${qualityGate.criteria.cls.passed ? "✅" : "❌"} |

---

## 📋 Test Coverage

### Pages Tested

${report.coverage.pagesTested.map((page, i) => `${i + 1}. ${page}`).join("\n")}

**Total Unique Pages**: ${report.coverage.totalUniquePages}

---

## 🔍 Detailed Findings

### Strengths

${performance.averageLoadTime < 2000 ? "- ✅ Fast page load times (under 2s average)" : ""}
${performance.lcpStatus === "GOOD" ? "- ✅ Good LCP scores (under 2.5s)" : ""}
${performance.clsStatus === "GOOD" ? "- ✅ Stable layout (CLS under 0.1)" : ""}
${accessibility.averageScore >= 95 ? "- ✅ Excellent accessibility compliance" : ""}
${accessibility.averageScore >= 90 && accessibility.averageScore < 95 ? "- ✅ Good accessibility compliance" : ""}
${summary.successRate >= 98 ? "- ✅ Highly reliable test execution" : ""}
${summary.successRate >= 95 && summary.successRate < 98 ? "- ✅ Reliable test execution" : ""}

### Areas for Improvement

${performance.averageLoadTime >= 2000 ? "- ⚠️ Optimize page load times (target: <2s)" : ""}
${performance.lcpStatus !== "GOOD" ? "- ⚠️ Improve LCP (target: <2.5s)" : ""}
${performance.clsStatus !== "GOOD" ? "- ⚠️ Reduce layout shifts (target: <0.1)" : ""}
${accessibility.averageScore < 90 ? "- ⚠️ Address accessibility violations" : ""}
${errors.unique > 0 ? "- ⚠️ Investigate and fix recurring errors" : ""}
${warnings.unique > 5 ? "- ⚠️ Review and address common warnings" : ""}

---

## 📊 Methodology

### Test Configuration

- **Total Iterations**: ${TOTAL_ITERATIONS}
- **Viewports Tested**: Desktop (1920×1080), Tablet (768×1024), Mobile (375×812)
- **Distribution**: 60% Desktop, 20% Tablet, 20% Mobile
- **Pages Tested**: ${report.coverage.totalUniquePages} unique pages
- **Metrics Collected**: Load Time, LCP, CLS, Accessibility Score, Errors, Warnings

### Quality Gate Criteria

Based on Enterprise UI/UX Governance Framework v1.0 and 2026 Premium Website Standards:

1. **Success Rate ≥95%**: Tests must complete successfully in 95%+ of iterations
2. **Accessibility ≥90/100**: WCAG 2.2 AA compliance minimum
3. **LCP <2500ms**: Core Web Vitals "Good" threshold
4. **CLS <0.1**: Core Web Vitals "Good" threshold

---

## 🏁 Conclusion

${
  qualityGate.passed
    ? `The Electromax website **PASSES** the Ralph's Loop Quality Gate with ${summary.successRate.toFixed(1)}% success rate over ${TOTAL_ITERATIONS} iterations. The site demonstrates ${performance.averageLoadTime < 2000 ? "excellent" : "acceptable"} performance metrics and ${accessibility.averageScore >= 95 ? "excellent" : "good"} accessibility compliance.`
    : `The Electromax website **DOES NOT PASS** the Ralph's Loop Quality Gate. Key issues: ${!qualityGate.criteria.successRate.passed ? "success rate below 95%, " : ""}${!qualityGate.criteria.accessibility.passed ? "accessibility score below 90, " : ""}${!qualityGate.criteria.lcp.passed ? "LCP above 2.5s, " : ""}${!qualityGate.criteria.cls.passed ? "CLS above 0.1" : ""}. Remediation recommended before production deployment.`
}

---

**Report Generated by**: Ralph's Loop Test Runner v1.0  
**Framework**: Enterprise UI/UX Governance Framework v1.0  
**Standards**: WCAG 2.2 AA, Core Web Vitals 2026, Premium Website Standards 2026

---

## 📎 Appendix: Raw Data

Raw metrics data is available in \`ralphs-loop-raw-data.json\` for detailed analysis.
`;
}

async function main() {
  console.log("🔄 Starting Ralph's Loop Test Runner");
  console.log(`📊 Total Iterations: ${TOTAL_ITERATIONS}`);
  console.log(`🌐 Base URL: ${BASE_URL}`);
  console.log("");

  let browser;

  try {
    // Launch browser
    browser = await chromium.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    console.log("✅ Browser launched\n");

    // Run iterations
    for (let i = 1; i <= TOTAL_ITERATIONS; i++) {
      const metrics = await runIteration(browser, i);
      metricsResults.push(metrics);

      // Log progress every 10 iterations
      if (i % 10 === 0 || i === TOTAL_ITERATIONS) {
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
    }

    console.log("\n✅ All iterations completed\n");

    // Generate report
    console.log("📝 Generating report...");
    const report = generateReport(metricsResults);
    const markdownReport = generateMarkdownReport(report);

    // Save reports
    const reportPath = path.join(REPORT_DIR, "10_RALPHS_LOOP_TEST_REPORT_100_ITERATIONS.md");
    const rawDataPath = path.join(REPORT_DIR, "10_RALPHS_LOOP_RAW_DATA.json");

    fs.writeFileSync(reportPath, markdownReport, "utf-8");
    fs.writeFileSync(rawDataPath, JSON.stringify(report, null, 2), "utf-8");

    console.log(`✅ Report saved to: ${reportPath}`);
    console.log(`✅ Raw data saved to: ${rawDataPath}`);

    // Print summary
    console.log("\n");
    console.log("📈 ======================================================================");
    console.log("📈 RALPH'S LOOP — FINAL SUMMARY");
    console.log("📈 ======================================================================\n");
    console.log(`Total Iterations: ${report.summary.totalIterations}`);
    console.log(
      `Successful: ${report.summary.successfulIterations}/${report.summary.totalIterations} (${report.summary.successRate}%)`,
    );
    console.log(`Failed: ${report.summary.failedIterations}\n`);
    console.log(`Average Load Time: ${report.performance.averageLoadTime}ms`);
    console.log(
      `Average LCP: ${report.performance.averageLcp}ms (${report.performance.lcpStatus})`,
    );
    console.log(
      `Average CLS: ${report.performance.averageCls} (${report.performance.clsStatus})\n`,
    );
    console.log(`Accessibility Score: ${report.accessibility.averageScore}/100\n`);
    console.log(`Quality Gate: ${report.qualityGate.passed ? "✅ PASSED" : "❌ FAILED"}\n`);
    console.log("📈 ======================================================================\n");

    // Exit with appropriate code
    process.exit(report.qualityGate.passed ? 0 : 1);
  } catch (error) {
    console.error("❌ Test runner failed:", error);
    process.exit(1);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Run the test
main();
