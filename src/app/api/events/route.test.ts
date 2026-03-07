import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/events/route";

describe("POST /api/events", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
  });

  it("returns 400 for invalid payload", async () => {
    const req = new Request("http://localhost:3000/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event: "unknown" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns success for valid payload without posthog env", async () => {
    const req = new Request("http://localhost:3000/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: "service_cta_click",
        timestamp: new Date().toISOString(),
        session_id: "sess-1",
        page_path: "/",
        source: "test",
        locale: "ru",
        properties: { source: "test" },
      }),
    });

    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("forwards event to posthog when env configured", async () => {
    vi.stubEnv("POSTHOG_HOST", "https://posthog.local");
    vi.stubEnv("POSTHOG_API_KEY", "ph_test");

    fetchMock.mockResolvedValueOnce({ ok: true, json: async () => ({}) });

    const req = new Request("http://localhost:3000/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-forwarded-for": "1.2.3.4" },
      body: JSON.stringify({
        event: "lead_form_submit",
        timestamp: new Date().toISOString(),
        session_id: "sess-2",
        page_path: "/contacts",
        source: "form",
        locale: "ru",
        properties: { source: "form" },
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://posthog.local/capture/",
      expect.objectContaining({ method: "POST" }),
    );
  });
});
