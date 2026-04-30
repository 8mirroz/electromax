import { createHash, randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import { isRateLimited } from "@/lib/server/rate-limit";

const schema = z.object({
  path: z.string().optional(),
  tag: z.string().optional(),
  secret: z.string(),
});

const REVALIDATE_WINDOW_MS = 60 * 1000;
const REVALIDATE_MAX_REQUESTS = 20;

function extractClientIp(req: Request) {
  const forwardedFor = req.headers.get("x-forwarded-for");
  return forwardedFor?.split(",")[0]?.trim() || "anonymous";
}

function hashIp(ip: string) {
  const salt = process.env.REVALIDATE_IP_HASH_SALT || "onedim-revalidate-salt";
  return createHash("sha256").update(`${ip}:${salt}`).digest("hex");
}

export async function POST(req: Request) {
  const requestId = randomUUID();
  const receivedAt = new Date().toISOString();
  const ip = extractClientIp(req);

  const limited = await isRateLimited(`revalidate_${ip}`, {
    maxRequests: REVALIDATE_MAX_REQUESTS,
    windowMs: REVALIDATE_WINDOW_MS,
  });

  if (limited) {
    return NextResponse.json(
      { revalidated: false, error: "Rate limited", requestId, receivedAt },
      { status: 429 },
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        revalidated: false,
        error: "Invalid body",
        issues: parsed.error.issues,
        requestId,
        receivedAt,
      },
      { status: 400 },
    );
  }

  const expected = process.env.REVALIDATE_SECRET;
  if (!expected || parsed.data.secret !== expected) {
    return NextResponse.json(
      { revalidated: false, error: "Unauthorized", requestId, receivedAt },
      { status: 401 },
    );
  }

  if (!parsed.data.path && !parsed.data.tag) {
    return NextResponse.json(
      { revalidated: false, error: "Either path or tag is required", requestId, receivedAt },
      { status: 400 },
    );
  }

  if (parsed.data.path) {
    revalidatePath(parsed.data.path);
  }

  if (parsed.data.tag) {
    revalidateTag(parsed.data.tag, "max");
  }

  console.info("[REVALIDATE_AUDIT]", {
    requestId,
    receivedAt,
    path: parsed.data.path || null,
    tag: parsed.data.tag || null,
    ipHash: hashIp(ip),
  });

  return NextResponse.json({
    revalidated: true,
    path: parsed.data.path || null,
    tag: parsed.data.tag || null,
    requestId,
    receivedAt,
  });
}
