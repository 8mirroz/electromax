# ELECTROMAX

Modern web site foundation built with Next.js, TypeScript, and Tailwind CSS.

## Requirements

- Node.js 20 LTS
- pnpm

## Quick start

```bash
pnpm install
pnpm dev
```

## Vercel deploy

First Vercel release is expected to run in fallback mode without Payload CMS or PostgreSQL.

1. Set `NEXT_PUBLIC_SITE_URL` to your production URL.
2. Set `NEXT_PUBLIC_LEADS_MODE=mock`.
3. Keep `CMS_ENABLED=false` and `CMS_USE_PAYLOAD_LOCAL_API=false`.
4. Add analytics envs only if you need them for this deploy.

With this setup the marketing site, fallback content, and public routes work in Vercel without `DATABASE_URI`, `PAYLOAD_SECRET`, SMTP, or Telegram credentials.

## Scripts

- `pnpm dev` — local dev server
- `pnpm build` — production build
- `pnpm start` — run production server
- `pnpm lint` — lint codebase
- `pnpm format` — format codebase
- `pnpm test` — run unit tests
- `pnpm test:e2e` — run Playwright E2E tests
- `pnpm content:generate:drafts` — generate draft content from briefs
- `pnpm content:localize:drafts` — generate EN/KZ wave-2 drafts from RU source drafts
- `pnpm content:validate:drafts` — validate generated drafts
- `pnpm content:qa` — run promptfoo quality gate
- `pnpm cms:seed:fallback` — seed Payload collections from local fallback content
- `pnpm analytics:synthetic` — send synthetic analytics events for dashboard/alert smoke checks

## Docs

Store internal notes and specs in `docs/`.
