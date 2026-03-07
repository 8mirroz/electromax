import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/leads/route";

const { sendMailMock, createTransportMock } = vi.hoisted(() => {
  const sendMail = vi.fn();
  const createTransport = vi.fn(() => ({
    sendMail,
  }));

  return {
    sendMailMock: sendMail,
    createTransportMock: createTransport,
  };
});

vi.mock("nodemailer", () => ({
  default: {
    createTransport: createTransportMock,
  },
}));

describe("POST /api/leads", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
    vi.stubEnv("NEXT_PUBLIC_LEADS_MODE", "live");
    sendMailMock.mockReset();
    createTransportMock.mockClear();
  });

  it("returns validation_error when required fields are missing", async () => {
    const req = new Request("http://localhost:3000/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        objectType: "office",
        areaSquareMeters: 100,
        complexityCoef: 1,
        estimatedPrice: 45000,
      }),
    });

    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.code).toBe("validation_error");
  });

  it("returns captcha_failed when turnstile secret exists and token is missing", async () => {
    vi.stubEnv("TURNSTILE_SECRET_KEY", "secret");

    const req = new Request("http://localhost:3000/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        objectType: "office",
        areaSquareMeters: 100,
        complexityCoef: 1,
        estimatedPrice: 45000,
        contactPhone: "+7 (999) 123-45-67",
      }),
    });

    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.code).toBe("captcha_failed");
  });

  it("returns success in mock mode without delivery channels", async () => {
    vi.stubEnv("NEXT_PUBLIC_LEADS_MODE", "mock");

    const req = new Request("http://localhost:3000/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        objectType: "office",
        areaSquareMeters: 100,
        complexityCoef: 1,
        estimatedPrice: 45000,
        contactPhone: "+7 (999) 123-45-67",
      }),
    });

    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.mode).toBe("mock");
    expect(sendMailMock).not.toHaveBeenCalled();
    expect(createTransportMock).not.toHaveBeenCalled();
  });

  it("returns upstream_error when no delivery channels are configured", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => undefined);

    const req = new Request("http://localhost:3000/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        objectType: "office",
        areaSquareMeters: 100,
        complexityCoef: 1,
        estimatedPrice: 45000,
        contactPhone: "+7 (999) 123-45-67",
      }),
    });

    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(503);
    expect(body.success).toBe(false);
    expect(body.code).toBe("upstream_error");
    expect(body.mode).toBe("live");
    expect(sendMailMock).not.toHaveBeenCalled();
    expect(createTransportMock).not.toHaveBeenCalled();
    expect(warnSpy).toHaveBeenCalled();
  });
});
