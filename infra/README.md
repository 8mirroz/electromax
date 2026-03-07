# Electromax Infra (Staging -> Production)

## 1. App Plane (VPS-A)

Required files:
- `.env`
- `.env.app` (copy from `.env.app.example`)

Bring up:
```bash
docker compose -f infra/docker-compose.app.yml --env-file .env.app up -d --build
```

Services:
- `app` (Next.js + Payload)
- `postgres`
- `redis`
- `n8n`
- `proxy` (Caddy TLS reverse proxy)

Health check:
```bash
docker compose -f infra/docker-compose.app.yml ps
```
All services must be `healthy` for at least 30 minutes before go/no-go.

## 2. Analytics Plane (VPS-B)

Required file:
- `.env.analytics` (copy from `.env.analytics.example`)

Bring up:
```bash
docker compose -f infra/docker-compose.analytics.yml --env-file .env.analytics up -d
```

Topology:
- `posthog-web`
- `posthog-worker`
- `posthog-plugins`
- `posthog-postgres`
- `posthog-redis`
- `posthog-clickhouse`
- `posthog-kafka`
- `posthog-zookeeper`
- `analytics-proxy` (Caddy TLS)

Only proxy ports must be exposed externally.

## 3. Content Seed + Revalidate

After app plane is healthy:
```bash
pnpm cms:seed:fallback
```

Then trigger webhook (n8n):
```bash
curl -X POST https://n8n.<domain>/webhook/content-publish \
  -H 'content-type: application/json' \
  -d '{"path":"/knowledge","source":"manual-smoke"}'
```

## 4. Backup / Restore

Daily backup job:
```bash
infra/scripts/backup-postgres.sh
```

Restore drill (staging):
```bash
infra/scripts/restore-postgres.sh app ./backups/app-YYYYMMDD-HHMMSS.sql.gz
infra/scripts/restore-postgres.sh posthog ./backups/posthog-YYYYMMDD-HHMMSS.sql.gz
```

## 5. Acceptance Gates

Must be green before production cutover:
- `pnpm test`
- `pnpm build`
- `pnpm test:e2e tests/e2e/smoke-tests.spec.ts`
- `VERIFY_BASE_URL=https://<staging-domain> VERIFY_REVALIDATE_SECRET=<secret> pnpm ops:verify:stage12`
- Optional synthetic batch: `VERIFY_BASE_URL=https://<staging-domain> VERIFY_REVALIDATE_SECRET=<secret> VERIFY_RUN_SYNTHETIC=true pnpm ops:verify:stage12`
- `GET /api/content/services`
- `GET /api/content/articles`
- `POST /api/revalidate` with valid secret
- PostHog UI available via HTTPS
