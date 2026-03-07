import { beforeEach, describe, expect, it, vi } from "vitest";

const revalidatePathMock = vi.fn();
const revalidateTagMock = vi.fn();
const isRateLimitedMock = vi.fn(async () => false);

vi.mock("next/cache", () => ({
  revalidatePath: (path: string) => revalidatePathMock(path),
  revalidateTag: (tag: string, profile: string) => revalidateTagMock(tag, profile),
}));

vi.mock("@/lib/server/rate-limit", () => ({
  isRateLimited: (...args: unknown[]) => isRateLimitedMock(...args),
}));

import { POST } from "@/app/api/revalidate/route";

describe("POST /api/revalidate", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
    revalidatePathMock.mockReset();
    revalidateTagMock.mockReset();
    isRateLimitedMock.mockReset();
    isRateLimitedMock.mockResolvedValue(false);
    vi.stubEnv("REVALIDATE_SECRET", "test-secret");
  });

  it("returns 401 for invalid secret", async () => {
    const req = new Request("http://localhost:3000/api/revalidate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret: "wrong", path: "/knowledge" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it("revalidates path", async () => {
    const req = new Request("http://localhost:3000/api/revalidate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret: "test-secret", path: "/knowledge" }),
    });

    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.revalidated).toBe(true);
    expect(revalidatePathMock).toHaveBeenCalledWith("/knowledge");
    expect(body.requestId).toBeTruthy();
    expect(body.receivedAt).toBeTruthy();
  });

  it("revalidates tag", async () => {
    const req = new Request("http://localhost:3000/api/revalidate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret: "test-secret", tag: "cms:articles" }),
    });

    const res = await POST(req);

    expect(res.status).toBe(200);
    expect(revalidateTagMock).toHaveBeenCalledWith("cms:articles", "max");
  });

  it("returns 429 when rate limit is exceeded", async () => {
    isRateLimitedMock.mockResolvedValueOnce(true);
    const req = new Request("http://localhost:3000/api/revalidate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret: "test-secret", path: "/knowledge" }),
    });

    const res = await POST(req);
    const body = await res.json();
    expect(res.status).toBe(429);
    expect(body.revalidated).toBe(false);
    expect(body.error).toBe("Rate limited");
  });
});
