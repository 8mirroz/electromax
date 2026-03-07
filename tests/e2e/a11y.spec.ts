import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const coreRoutes = ["/", "/services", "/contacts", "/about"];

for (const route of coreRoutes) {
  test(`a11y: no critical violations on ${route}`, async ({ page }) => {
    await page.goto(route, { waitUntil: "domcontentloaded" });

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag22aa"])
      .analyze();

    const critical = results.violations.filter(
      (v) => v.impact === "critical" || v.impact === "serious",
    );

    if (critical.length > 0) {
      const summary = critical.map(
        (v) => `[${v.impact}] ${v.id}: ${v.description} (${v.nodes.length} nodes)`,
      );
      expect(critical, `A11Y violations on ${route}:\n${summary.join("\n")}`).toHaveLength(0);
    }
  });
}
