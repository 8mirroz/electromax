import { describe, expect, it } from "vitest";
import { getServicePageModel, getServicePageSlugs } from "@/lib/services-content";

describe("services-content adapter", () => {
  it("returns all 10 wave-1 service slugs", () => {
    expect(new Set(getServicePageSlugs())).toEqual(new Set([
      "aps",
      "asuz",
      "eom",
      "eo",
      "os",
      "sks",
      "skud",
      "sot",
      "soue",
      "to",
    ]));
  });

  it("builds page models for asuz and to with required blocks", () => {
    for (const slug of ["asuz", "to"] as const) {
      const model = getServicePageModel(slug);
      expect(model).not.toBeNull();
      expect(model?.hero.ctaLabel).toBeTruthy();
      expect(model?.stats.length).toBeGreaterThanOrEqual(3);
      expect(model?.solutionKits.length).toBeGreaterThanOrEqual(3);
      expect(model?.catalog[0]?.items.length).toBeGreaterThanOrEqual(10);
      expect(model?.process.length).toBeGreaterThanOrEqual(4);
      expect(model?.faq.length).toBeGreaterThanOrEqual(8);
    }
  });

  it("merges generated content from agent 2 into frontend model", () => {
    const aps = getServicePageModel("aps");
    expect(aps).not.toBeNull();
    expect(aps?.hero.ctaLabel).toBe("Заказать аудит объекта");
    expect(aps?.stats[0]?.value).toBe("500+");
    expect(aps?.catalog[0]?.items.length).toBeGreaterThan(0);
  });
});
