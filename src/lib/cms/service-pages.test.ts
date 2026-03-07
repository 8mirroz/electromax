import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  getAllServicePageModelsFromCms,
  getServicePageModelFromCms,
  getServicePageSlugsFromCms,
} from "@/lib/cms/service-pages";

describe("cms service pages", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    vi.stubEnv("CMS_ENABLED", "false");
    vi.stubEnv("CMS_BASE_URL", "");
  });

  it("returns service page model with fallback content", async () => {
    const model = await getServicePageModelFromCms("aps", { locale: "ru" });

    expect(model).not.toBeNull();
    expect(model?.slug).toBe("aps");
    expect(model?.title).toContain("пожар");
  });

  it("returns union slugs from legacy content and cms fallback", async () => {
    const slugs = await getServicePageSlugsFromCms({ locale: "ru" });

    expect(slugs).toContain("aps");
    expect(slugs).toContain("skud");
    expect(slugs.length).toBeGreaterThanOrEqual(10);
  });

  it("returns multiple service models", async () => {
    const models = await getAllServicePageModelsFromCms({ locale: "ru", limit: 5 });

    expect(models.length).toBe(5);
    expect(models[0]).toHaveProperty("catalog");
    expect(models[0]).toHaveProperty("faq");
  });
});
