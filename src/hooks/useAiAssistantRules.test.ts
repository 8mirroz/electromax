import { describe, expect, it } from "vitest";
import { createEmptyProjectTrayState, touchState } from "@/lib/project-tray";
import { evaluateAiAssistantRules } from "@/hooks/useAiAssistantRules";
import type { ServicePageModel } from "@/types";

const model: ServicePageModel = {
  slug: "aps",
  title: "АПС",
  shortName: "АПС",
  description: "desc",
  theme: { accent: "#f00", accentSoft: "#fee", accentStrong: "#900" },
  hero: { title: "АПС", subtitle: "desc", ctaLabel: "CTA", trustItems: [] },
  stats: [],
  solutionKits: [],
  catalog: [],
  process: [],
  aiRules: [
    { id: "r1", triggerType: "tray_empty", messageText: "Начните с аудита", priority: 100 },
    { id: "r2", triggerType: "missing_category", triggerValue: "Этапы проекта", messageText: "Добавьте этап", priority: 90 },
    { id: "r3", triggerType: "service_open", triggerValue: "to", recommendServiceSlug: "to", messageText: "Проверьте ТО", priority: 50 },
  ],
  seo: { title: "seo", paragraphs: [], relatedServiceSlugs: [] },
  faq: [],
  benchmarks: [],
  relatedServiceSlugs: ["to"],
};

describe("evaluateAiAssistantRules", () => {
  it("returns sorted recommendations for empty tray", () => {
    const tray = touchState(createEmptyProjectTrayState("aps"));
    const recommendations = evaluateAiAssistantRules({ serviceSlug: model.slug, tray, rules: model.aiRules });

    expect(recommendations).toHaveLength(3);
    expect(recommendations[0].message).toContain("аудита");
    expect(recommendations[1].message).toContain("этап");
  });

  it("suppresses tray_empty when tray has items", () => {
    const tray = touchState({
      ...createEmptyProjectTrayState("aps"),
      items: [
        {
          id: "1",
          serviceSlug: "aps",
          itemCode: "APS-AUDIT",
          itemName: "Аудит",
          unit: "выезд",
          qty: 1,
          priceType: "from",
          priceMin: 10000,
          currency: "RUB",
          category: "Этапы проекта",
          sourceKind: "catalog",
          sourceId: "1",
        },
      ],
    });

    const recommendations = evaluateAiAssistantRules({ serviceSlug: model.slug, tray, rules: model.aiRules });
    expect(recommendations.find((item) => item.id === "r1")).toBeUndefined();
  });
});
