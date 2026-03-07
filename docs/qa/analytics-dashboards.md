# Analytics Dashboards and Alerts (Stage 2)

## Dashboard: Electromax Funnel

### Insight 1: Lead Conversion Funnel
- Type: Funnel
- Steps:
  1. `service_cta_click`
  2. `lead_form_submit`
  3. `project_tray_submit`
- Breakdown: `source`, `page_path`
- Window: last 24h / 7d

### Insight 2: Event Delivery Quality
- Type: Trends
- Events:
  - all tracked events count
  - `/api/events` 5xx count (server logs / APM)
- Breakdown: `locale`

### Insight 3: Content Engagement
- Type: Trends
- Events:
  - `content_download`
  - `video_play_25_50_75_100`
- Breakdown: `source`, `page_path`

## Yandex Metrika Goals
- `lead_form_submitted`
- `calculator_complete`
- `service_cta_click`
- `project_tray_open`
- `project_tray_submit`
- `content_download`
- `video_play_progress`

## Alert Rules
1. No events in 15 minutes.
2. `/api/events` 5xx error rate > 2% over 15 minutes.
3. Funnel step-1 to step-2 conversion drops > 30% vs previous day.

## Smoke Procedure
1. Run synthetic event script.
2. Verify event appears in PostHog live events.
3. Verify Metrika goal hit in debug mode.
4. Confirm alert test channel receives test notification.
