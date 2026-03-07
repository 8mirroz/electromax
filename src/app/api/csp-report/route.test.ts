import { describe, expect, it } from "vitest";
import { GET, POST } from "@/app/api/csp-report/route";

describe("/api/csp-report", () => {
  it("responds to GET health check", async () => {
    const res = await GET();
    expect(res.status).toBe(200);
  });

  it("accepts valid CSP report", async () => {
    const req = new Request("http://localhost:3000/api/csp-report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        "csp-report": {
          "document-uri": "http://localhost:3000",
          "violated-directive": "script-src",
          "blocked-uri": "https://evil.example",
        },
      }),
    });

    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
  });

  it("rejects malformed CSP report", async () => {
    const req = new Request("http://localhost:3000/api/csp-report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ "csp-report": "bad" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
