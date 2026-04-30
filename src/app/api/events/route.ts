import { createHash, randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { ANALYTICS_EVENT_NAMES, getMetrikaGoalByEvent } from "@/lib/analytics/events";

const scalarSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);

const eventSchema = z.object({
  event: z.enum(ANALYTICS_EVENT_NAMES),
  timestamp: z.string().datetime(),
  session_id: z.string().min(2),
  page_path: z.string().min(1),
  source: z.string().min(1),
  locale: z.string().min(2).max(10),
  properties: z.record(z.string(), scalarSchema).default({}),
});

function extractClientIp(req: Request) {
  const forwardedFor = req.headers.get("x-forwarded-for");
  return forwardedFor?.split(",")[0]?.trim() || "anonymous";
}

function hashIp(ip: string) {
  const salt = process.env.ANALYTICS_IP_HASH_SALT || "onedim-default-salt";
  return createHash("sha256").update(`${ip}:${salt}`).digest("hex");
}

function extractUtm(req: Request) {
  const referer = req.headers.get("referer");
  if (!referer) return null;

  try {
    const url = new URL(referer);
    const source = url.searchParams.get("utm_source");
    const medium = url.searchParams.get("utm_medium");
    const campaign = url.searchParams.get("utm_campaign");

    if (!source && !medium && !campaign) return null;

    return {
      utm_source: source,
      utm_medium: medium,
      utm_campaign: campaign,
    };
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  const eventId = randomUUID();
  const receivedAt = new Date().toISOString();

  try {
    const body = await req.json();
    const parsed = eventSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          eventId,
          receivedAt,
          error: "Invalid analytics payload",
          issues: parsed.error.issues,
        },
        { status: 400 },
      );
    }

    const payload = parsed.data;
    const ip = extractClientIp(req);
    const userAgent = req.headers.get("user-agent") || "unknown";
    const utm = extractUtm(req);

    const normalized = {
      ...payload,
      ip_hash: hashIp(ip),
      user_agent: userAgent,
      ...utm,
      event_id: eventId,
      received_at: receivedAt,
    };

    const posthogHost = process.env.POSTHOG_HOST || process.env.NEXT_PUBLIC_POSTHOG_HOST;
    const posthogKey = process.env.POSTHOG_API_KEY || process.env.NEXT_PUBLIC_POSTHOG_KEY;

    let forwardedToPosthog = false;
    if (posthogHost && posthogKey) {
      try {
        const response = await fetch(`${posthogHost.replace(/\/+$/, "")}/capture/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            api_key: posthogKey,
            event: normalized.event,
            distinct_id: normalized.session_id,
            properties: normalized,
            timestamp: normalized.timestamp,
          }),
        });

        forwardedToPosthog = response.ok;
      } catch {
        forwardedToPosthog = false;
      }
    }

    const metrikaGoal = getMetrikaGoalByEvent(payload.event);

    console.info("[ANALYTICS_EVENT]", {
      eventId,
      event: payload.event,
      pagePath: payload.page_path,
      source: payload.source,
      locale: payload.locale,
      forwardedToPosthog,
      metrikaGoal,
    });

    return NextResponse.json({
      success: true,
      eventId,
      receivedAt,
      forwarded: {
        posthog: forwardedToPosthog,
        metrikaGoal,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        eventId,
        receivedAt,
        error: error instanceof Error ? error.message : "Failed to process analytics event",
      },
      { status: 500 },
    );
  }
}
