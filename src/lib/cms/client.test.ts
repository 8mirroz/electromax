import { beforeEach, describe, expect, it, vi } from "vitest";
import { getCmsItemBySlug, listCmsCollection } from "@/lib/cms/client";

describe("cms client fallback", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    vi.stubEnv("CMS_ENABLED", "false");
    vi.stubEnv("CMS_BASE_URL", "");
  });

  it("returns fallback articles when CMS is disabled", async () => {
    const docs = await listCmsCollection("articles", { locale: "ru" });
    expect(docs.length).toBeGreaterThanOrEqual(20);
  });

  it("returns item by slug from fallback collection", async () => {
    const item = await getCmsItemBySlug("articles", "ru-1-kak-podgotovit-obekt-k-auditu-aps-i-soue", {
      locale: "ru",
    });
    expect(item).not.toBeNull();
    expect(item?.slug).toBe("ru-1-kak-podgotovit-obekt-k-auditu-aps-i-soue");
  });
});
