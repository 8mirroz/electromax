import { hasAnalyticsConsent, isConsentFirstMode } from "@/lib/analytics/consent";

export const ANALYTICS_EVENT_NAMES = [
  "lead_form_submit",
  "calculator_complete",
  "service_cta_click",
  "project_tray_open",
  "project_tray_submit",
  "content_download",
  "video_play_25_50_75_100",
] as const;

export type AnalyticsEventName = (typeof ANALYTICS_EVENT_NAMES)[number];

export type AnalyticsScalarValue = string | number | boolean | null;
export type AnalyticsEventPayload = Record<string, AnalyticsScalarValue | undefined>;

export interface AnalyticsEventEnvelope {
  event: AnalyticsEventName;
  timestamp: string;
  session_id: string;
  page_path: string;
  source: string;
  locale: string;
  properties: Record<string, AnalyticsScalarValue>;
}

const METRIKA_GOAL_BY_EVENT: Record<AnalyticsEventName, string> = {
  lead_form_submit: process.env.NEXT_PUBLIC_YANDEX_METRIKA_GOAL_LEAD_FORM || "lead_form_submitted",
  calculator_complete: "calculator_complete",
  service_cta_click: "service_cta_click",
  project_tray_open: "project_tray_open",
  project_tray_submit: "project_tray_submit",
  content_download: "content_download",
  video_play_25_50_75_100: "video_play_progress",
};

const SESSION_KEY = "onedim.analytics.session-id";

function safeWindow() {
  return typeof window !== "undefined" ? window : undefined;
}

function sanitizeProperties(
  properties: AnalyticsEventPayload,
): Record<string, AnalyticsScalarValue> {
  return Object.fromEntries(
    Object.entries(properties).filter(([, value]) => value !== undefined),
  ) as Record<string, AnalyticsScalarValue>;
}

function getSessionId(win: Window): string {
  try {
    const existing = win.sessionStorage.getItem(SESSION_KEY);
    if (existing) return existing;

    const created =
      win.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    win.sessionStorage.setItem(SESSION_KEY, created);
    return created;
  } catch {
    return "session-unavailable";
  }
}

function resolvePagePath(win: Window) {
  return `${win.location.pathname}${win.location.search}`;
}

function resolveLocale(win: Window) {
  return win.document?.documentElement?.lang || "ru";
}

function resolveSource(properties: Record<string, AnalyticsScalarValue>) {
  const source = properties.source;
  if (typeof source === "string" && source.length > 0) return source;
  return "web";
}

export function getMetrikaGoalByEvent(name: AnalyticsEventName) {
  return METRIKA_GOAL_BY_EVENT[name];
}

export function buildAnalyticsEnvelope(
  name: AnalyticsEventName,
  properties: AnalyticsEventPayload,
  win: Window,
): AnalyticsEventEnvelope {
  const sanitized = sanitizeProperties(properties);

  return {
    event: name,
    timestamp: new Date().toISOString(),
    session_id: getSessionId(win),
    page_path: resolvePagePath(win),
    source: resolveSource(sanitized),
    locale: resolveLocale(win),
    properties: sanitized,
  };
}

export async function trackClientEvent(
  name: AnalyticsEventName,
  properties: AnalyticsEventPayload = {},
) {
  const win = safeWindow();
  if (!win) return;

  if (isConsentFirstMode() && !hasAnalyticsConsent()) {
    return;
  }

  const envelope = buildAnalyticsEnvelope(name, properties, win);
  const ymIdRaw = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID;
  const ymId = ymIdRaw ? Number(ymIdRaw) : undefined;

  if (ymId && typeof win.ym === "function") {
    const goal = METRIKA_GOAL_BY_EVENT[name];
    win.ym(ymId, "reachGoal", goal, envelope.properties);
  }

  if (win.posthog && typeof win.posthog.capture === "function") {
    win.posthog.capture(name, {
      ...envelope.properties,
      session_id: envelope.session_id,
      page_path: envelope.page_path,
      source: envelope.source,
      locale: envelope.locale,
      timestamp: envelope.timestamp,
    });
  }

  try {
    await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(envelope),
      keepalive: true,
    });
  } catch {
    // Best-effort analytics dispatch should not break user flow.
  }
}

declare global {
  interface Window {
    ym?: (
      id: number,
      action: string,
      goal: string,
      params?: Record<string, AnalyticsScalarValue>,
    ) => void;
    posthog?: {
      capture?: (event: string, properties?: Record<string, AnalyticsScalarValue>) => void;
    };
  }
}
