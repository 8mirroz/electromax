# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Electromax — a Russian-language (lang="ru") Next.js website for a Moscow-based engineering/security systems company. Built with Next.js 16 (App Router), React 19, TypeScript (strict), Tailwind CSS v4, and pnpm.

## Commands

| Command                  | Purpose                                                    |
| ------------------------ | ---------------------------------------------------------- |
| `pnpm dev`               | Dev server                                                 |
| `pnpm build`             | Production build                                           |
| `pnpm lint`              | ESLint (flat config)                                       |
| `pnpm format`            | Prettier                                                   |
| `pnpm test`              | Vitest unit tests (single run)                             |
| `pnpm test:unit`         | Vitest unit tests (watch mode)                             |
| `pnpm test:e2e`          | Playwright E2E (Chromium, auto-starts dev server on :3000) |
| `pnpm content:sync`      | Import services from XLSX                                  |
| `pnpm content:qa`        | Promptfoo content quality gate                             |
| `pnpm cms:seed:fallback` | Seed Payload CMS from fallback data                        |

Run a single unit test: `pnpm vitest run src/path/to/file.test.ts`

## Architecture

**App Router structure:** Pages under `src/app/` — services, projects, industries, knowledge, testimonials, videos, contacts, about, solutions, licenses, privacy, terms. Root layout (`src/app/layout.tsx`) wraps everything with Navbar, Footer, and GlobalProjectTray.

**Payload CMS (3.x):** Embedded in the Next.js app via `withPayload()` in `next.config.ts`. PostgreSQL backend. Admin UI at `src/app/(payload)/`. Collections defined in `src/collections/`. Toggled via `CMS_ENABLED` env var — when off, falls back to hardcoded content in `src/lib/services-content.ts`.

**API routes** (`src/app/api/`):

- `leads/` — form submissions dispatched to Telegram + SMTP
- `content/` — content API
- `revalidate/` — ISR revalidation
- `events/` — analytics events
- `csp-report/` — CSP violation reports

**Component patterns:**

- UI primitives in `src/components/ui/` follow shadcn-ui conventions (class-variance-authority + tailwind-merge)
- Page sections in `src/components/sections/`, service components in `src/components/services/`
- `AdaptiveProvider` (`src/components/AdaptiveProvider.tsx`) enables performance-adaptive rendering
- Animations use Framer Motion + GSAP

**Content pipeline:** XLSX import → AI draft generation → localization (RU/EN/KZ) → promptfoo validation. Scripts in `scripts/content-gen/` and `scripts/content/`.

## Key Config

- **Path alias:** `@/*` → `./src/*`
- **Fonts:** Inter + Montserrat (Latin + Cyrillic subsets)
- **Colors:** CSS variable-based (`--background`, `--foreground`), primary blue `#2563eb`
- **Remote images:** Unsplash allowed in `next.config.ts`
- **Rate limiting:** Upstash Redis
- **CAPTCHA:** Cloudflare Turnstile
- **Pre-commit:** Husky + lint-staged (ESLint fix + Prettier)

## Testing

- **Unit:** Vitest + jsdom + @testing-library/react. Setup file: `src/test/setup.tsx`. Tests colocated as `*.test.{ts,tsx}`.
- **E2E:** Playwright (Chromium only). Tests in `tests/e2e/`. Retries 2x on CI.

## Environment Variables

See `.env.example` for required vars: Telegram bot, SMTP, Turnstile CAPTCHA, site URL, revalidation secret, `CMS_ENABLED`, PostHog analytics, database URL.
