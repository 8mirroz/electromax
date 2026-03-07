#!/usr/bin/env node

const baseUrl = process.env.SYNTHETIC_EVENTS_BASE_URL || "http://127.0.0.1:3000";

const events = [
  "service_cta_click",
  "lead_form_submit",
  "project_tray_open",
  "project_tray_submit",
  "content_download",
  "video_play_25_50_75_100",
];

function payload(event, index) {
  return {
    event,
    timestamp: new Date().toISOString(),
    session_id: `synthetic-${Date.now()}-${index}`,
    page_path: "/synthetic",
    source: "synthetic-smoke",
    locale: "ru",
    properties: {
      source: "synthetic-smoke",
      scenario: "alert-smoke",
      index,
    },
  };
}

async function run() {
  for (let i = 0; i < events.length; i += 1) {
    const event = events[i];
    const response = await fetch(`${baseUrl}/api/events`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload(event, i)),
    });

    const body = await response.json().catch(() => ({}));
    console.log(`[synthetic] ${event}: status=${response.status}`, body);
  }
}

run().catch((error) => {
  console.error("[synthetic] failed", error);
  process.exit(1);
});
