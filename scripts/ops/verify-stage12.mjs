#!/usr/bin/env node

const baseUrl = (process.env.VERIFY_BASE_URL || "http://127.0.0.1:3000").replace(/\/+$/, "");
const revalidateSecret = process.env.VERIFY_REVALIDATE_SECRET || process.env.REVALIDATE_SECRET;
const runSynthetic = process.env.VERIFY_RUN_SYNTHETIC === "true";

function fail(message, details) {
  console.error(`[FAIL] ${message}`);
  if (details !== undefined) {
    console.error(details);
  }
  process.exitCode = 1;
}

function pass(message) {
  console.log(`[OK] ${message}`);
}

async function getJson(path) {
  const response = await fetch(`${baseUrl}${path}`);
  let body;

  try {
    body = await response.json();
  } catch {
    body = null;
  }

  return { response, body };
}

async function postJson(path, payload) {
  const response = await fetch(`${baseUrl}${path}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });

  let body;
  try {
    body = await response.json();
  } catch {
    body = null;
  }

  return { response, body };
}

async function verifyContentApis() {
  const collections = ["services", "articles"];

  for (const collection of collections) {
    const { response, body } = await getJson(`/api/content/${collection}?limit=1`);

    if (!response.ok || !body || !Array.isArray(body.items)) {
      fail(`GET /api/content/${collection}?limit=1 failed`, { status: response.status, body });
      return null;
    }

    pass(`GET /api/content/${collection}?limit=1`);

    if (collection === "articles" && body.items.length > 0) {
      const candidate = body.items[0];
      const slug = candidate?.slug;
      if (typeof slug === "string" && slug.length > 0) {
        const article = await getJson(`/api/content/articles/${encodeURIComponent(slug)}`);
        if (!article.response.ok || !article.body || article.body.slug !== slug) {
          fail(`GET /api/content/articles/${slug} failed`, { status: article.response.status, body: article.body });
          return null;
        }
        pass(`GET /api/content/articles/${slug}`);
      }
    }
  }

  return true;
}

async function verifyRevalidate() {
  if (!revalidateSecret) {
    fail("VERIFY_REVALIDATE_SECRET or REVALIDATE_SECRET is required for /api/revalidate checks");
    return false;
  }

  const payload = {
    path: "/knowledge",
    secret: revalidateSecret,
  };

  const { response, body } = await postJson("/api/revalidate", payload);

  if (!response.ok || !body || body.revalidated !== true) {
    fail("POST /api/revalidate failed", { status: response.status, body });
    return false;
  }

  pass("POST /api/revalidate (path)");
  return true;
}

async function verifyEvents() {
  const payload = {
    event: "service_cta_click",
    timestamp: new Date().toISOString(),
    session_id: `verify-${Date.now()}`,
    page_path: "/ops/verify-stage12",
    source: "ops-verification",
    locale: "ru",
    properties: {
      source: "ops-verification",
      stage: "stage12",
      runSynthetic,
    },
  };

  const { response, body } = await postJson("/api/events", payload);

  if (!response.ok || !body || body.success !== true) {
    fail("POST /api/events failed", { status: response.status, body });
    return false;
  }

  pass("POST /api/events");
  if (body.forwarded) {
    console.log("[INFO] Forwarding result:", body.forwarded);
  }

  return true;
}

async function runSyntheticBatch() {
  if (!runSynthetic) return true;

  const events = [
    "service_cta_click",
    "lead_form_submit",
    "project_tray_open",
    "project_tray_submit",
    "content_download",
    "video_play_25_50_75_100",
  ];

  for (let i = 0; i < events.length; i += 1) {
    const event = events[i];
    const { response, body } = await postJson("/api/events", {
      event,
      timestamp: new Date().toISOString(),
      session_id: `verify-synth-${Date.now()}-${i}`,
      page_path: "/ops/verify-stage12",
      source: "ops-verification-synthetic",
      locale: "ru",
      properties: {
        source: "ops-verification-synthetic",
        index: i,
      },
    });

    if (!response.ok || !body || body.success !== true) {
      fail(`Synthetic event ${event} failed`, { status: response.status, body });
      return false;
    }
  }

  pass("Synthetic event batch");
  return true;
}

async function main() {
  console.log(`Running Stage 1 -> 2 verification against: ${baseUrl}`);

  const okContent = await verifyContentApis();
  const okRevalidate = await verifyRevalidate();
  const okEvents = await verifyEvents();
  const okSynthetic = await runSyntheticBatch();

  const allGood = Boolean(okContent && okRevalidate && okEvents && okSynthetic);

  if (!allGood) {
    console.error("\nStage 1 -> 2 verification finished with failures.");
    process.exit(1);
  }

  console.log("\nStage 1 -> 2 verification passed.");
}

main().catch((error) => {
  fail("Unhandled verification error", error);
  process.exit(1);
});
