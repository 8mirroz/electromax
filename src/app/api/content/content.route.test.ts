import { beforeEach, describe, expect, it, vi } from "vitest";
import { GET as GETCollection } from "@/app/api/content/[collection]/route";
import { GET as GETBySlug } from "@/app/api/content/[collection]/[slug]/route";

describe("/api/content routes", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    vi.stubEnv("CMS_ENABLED", "false");
  });

  it("returns fallback list", async () => {
    const req = new Request("http://localhost:3000/api/content/articles?locale=ru&limit=5");
    const res = await GETCollection(req, { params: Promise.resolve({ collection: "articles" }) });
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.collection).toBe("articles");
    expect(body.count).toBeGreaterThan(0);
  });

  it("returns fallback item by slug", async () => {
    const req = new Request(
      "http://localhost:3000/api/content/articles/ru-1-kak-podgotovit-obekt-k-auditu-aps-i-soue?locale=ru",
    );
    const res = await GETBySlug(req, {
      params: Promise.resolve({
        collection: "articles",
        slug: "ru-1-kak-podgotovit-obekt-k-auditu-aps-i-soue",
      }),
    });
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.doc.slug).toBe("ru-1-kak-podgotovit-obekt-k-auditu-aps-i-soue");
  });

  it("returns 404 for unknown collection", async () => {
    const req = new Request("http://localhost:3000/api/content/unknown");
    const res = await GETCollection(req, { params: Promise.resolve({ collection: "unknown" }) });

    expect(res.status).toBe(404);
  });
});
