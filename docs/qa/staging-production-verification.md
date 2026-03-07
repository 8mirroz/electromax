# Stage 1+2 Verification Checklist

## Staging
1. `docker compose -f infra/docker-compose.app.yml --env-file .env.app up -d --build`
2. `docker compose -f infra/docker-compose.analytics.yml --env-file .env.analytics up -d`
3. Wait for healthy status at least 30 minutes.
4. Run `pnpm cms:seed:fallback`.
5. Run `pnpm test && pnpm build`.
6. Run `pnpm test:e2e tests/e2e/smoke-tests.spec.ts` against staging base URL.
7. Run contract/API verification:
   - `VERIFY_BASE_URL=https://<staging-domain> VERIFY_REVALIDATE_SECRET=<secret> pnpm ops:verify:stage12`
8. Trigger n8n webhook and verify content revalidation.
9. Run `pnpm analytics:synthetic` (or `VERIFY_RUN_SYNTHETIC=true pnpm ops:verify:stage12`).
10. Confirm PostHog live events and Metrika goal hits.
11. Execute backup + restore drill in staging.

## Production Cutover
1. Freeze content updates for cutover window.
2. Apply same compose/env versions as staging.
3. Bring up app-plane and verify health checks.
4. Bring up analytics-plane and verify ingestion endpoint.
5. Run smoke suite, then:
   - `VERIFY_BASE_URL=https://<prod-domain> VERIFY_REVALIDATE_SECRET=<secret> pnpm ops:verify:stage12`
   - `SYNTHETIC_EVENTS_BASE_URL=https://<prod-domain> pnpm analytics:synthetic`
6. Enable n8n workflow active mode.
7. Unfreeze content updates.

## Success Criteria
- `/api/content/*`, `/api/events`, `/api/revalidate` healthy.
- Consent-first behavior confirmed.
- Event ingestion visible in dashboards.
- Alerts validated with synthetic test.
