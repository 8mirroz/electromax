import { beforeEach, describe, expect, it, vi } from "vitest";
import { buildAnalyticsEnvelope, trackClientEvent } from "@/lib/analytics/events";
import { clearAnalyticsConsent, setAnalyticsConsent } from "@/lib/analytics/consent";

describe("analytics events", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
    vi.stubEnv("NEXT_PUBLIC_ANALYTICS_CONSENT_MODE", "consent-first");
    vi.stubGlobal("fetch", fetchMock);
    fetchMock.mockReset();
    window.localStorage.clear();
    window.sessionStorage.clear();
    clearAnalyticsConsent();
    window.ym = vi.fn();
    window.posthog = { capture: vi.fn() };
  });

  it("builds event envelope with normalized metadata", () => {
    window.history.pushState({}, "", "/services/aps?ref=qa");

    const envelope = buildAnalyticsEnvelope("service_cta_click", { source: "hero", foo: "bar" }, window);

    expect(envelope.event).toBe("service_cta_click");
    expect(envelope.page_path).toContain("/services/aps");
    expect(envelope.source).toBe("hero");
    expect(envelope.timestamp).toBeTruthy();
    expect(envelope.session_id).toBeTruthy();
  });

  it("does not emit events without consent in consent-first mode", async () => {
    vi.stubEnv("NEXT_PUBLIC_YANDEX_METRIKA_ID", "12345");

    await trackClientEvent("service_cta_click", { source: "hero" });

    expect(window.ym).not.toHaveBeenCalled();
    expect(window.posthog?.capture).not.toHaveBeenCalled();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("emits events after consent is granted", async () => {
    vi.stubEnv("NEXT_PUBLIC_YANDEX_METRIKA_ID", "12345");
    setAnalyticsConsent("granted");
    fetchMock.mockResolvedValueOnce({ ok: true, json: async () => ({ success: true }) });

    await trackClientEvent("lead_form_submit", { source: "calculator" });

    expect(window.ym).toHaveBeenCalled();
    expect(window.posthog?.capture).toHaveBeenCalled();
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/events",
      expect.objectContaining({ method: "POST" }),
    );
  });
});
