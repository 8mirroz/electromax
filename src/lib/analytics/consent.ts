export type AnalyticsConsentState = "unknown" | "granted" | "denied";

const CONSENT_STORAGE_KEY = "onedim.analytics.consent.v1";
const CONSENT_VERSION = "v1";
const CONSENT_EVENT = "onedim:analytics-consent-changed";

function safeWindow() {
  return typeof window !== "undefined" ? window : undefined;
}

export function isConsentFirstMode() {
  const mode = process.env.NEXT_PUBLIC_ANALYTICS_CONSENT_MODE || "consent-first";
  return mode === "consent-first";
}

export function getAnalyticsConsentState(): AnalyticsConsentState {
  if (!isConsentFirstMode()) return "granted";

  const win = safeWindow();
  if (!win) return "unknown";

  try {
    const raw = win.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return "unknown";
    const parsed = JSON.parse(raw) as { value?: AnalyticsConsentState; version?: string };
    if (parsed.version !== CONSENT_VERSION) return "unknown";
    if (parsed.value === "granted" || parsed.value === "denied") return parsed.value;
    return "unknown";
  } catch {
    return "unknown";
  }
}

export function hasAnalyticsConsent() {
  const state = getAnalyticsConsentState();
  return state === "granted";
}

export function setAnalyticsConsent(value: Exclude<AnalyticsConsentState, "unknown">) {
  const win = safeWindow();
  if (!win) return;

  const payload = JSON.stringify({
    value,
    version: CONSENT_VERSION,
    updatedAt: new Date().toISOString(),
  });
  win.localStorage.setItem(CONSENT_STORAGE_KEY, payload);
  win.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: { value } }));
}

export function clearAnalyticsConsent() {
  const win = safeWindow();
  if (!win) return;
  win.localStorage.removeItem(CONSENT_STORAGE_KEY);
  win.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: { value: "unknown" } }));
}

export function onAnalyticsConsentChange(callback: () => void) {
  const win = safeWindow();
  if (!win) return () => {};

  const handler = () => callback();
  win.addEventListener(CONSENT_EVENT, handler);
  win.addEventListener("storage", handler);

  return () => {
    win.removeEventListener(CONSENT_EVENT, handler);
    win.removeEventListener("storage", handler);
  };
}
