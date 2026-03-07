# Payload CMS Integration Guide

This project uses **Payload CMS v3** for content management. 

## Strategy
- **Local API First**: We use Payload's `getPayload` local API to fetch data directly in Next.js Server Components. This is much faster and more reliable than fetching via HTTP.
- **Fallback Layer**: Every CMS call has a fallback to the static `data/` directory or `lib/cms/fallback-content.ts`. This ensures the site works even if the database is down or empty.
- **Incremental Migration**: Use the `CMS_MIGRATION_ACTIVE` flag in `.env.local` to toggle between static data and CMS data.

## Accessing Content
Use the helper functions in `src/lib/cms/client.ts`:

```typescript
import { listCmsCollection, getCmsItemBySlug } from "@/lib/cms/client";

// Fetch articles
const articles = await listCmsCollection("articles", { locale: "ru", limit: 10 });

// Fetch a specific service
const service = await getCmsItemBySlug("services", "aps", { locale: "ru" });
```

## Collections
Current active collections:
- `Users`: Admin access and auth.
- `Services`: Core engineering services data.
- `Articles`: Knowledge hub content.
- `Authors`: Article authors.
- `CaseStudies`: Portfolio/Portfolio items.
- `Testimonials`: Customer reviews.
- `Videos`: Video content.
- `Faqs`: Common questions.
- `Industries`: Industry-specific solutions.

## Database Setup
The CMS requires a PostgreSQL database.
1. Start the database: `docker compose up -d`
2. Run migrations/initial seed: `pnpm db:seed`

## Feature Flags
Toggle CMS behavior in `.env.local`:
- `CMS_ENABLED="true"`: Enables fetching from the database (via local API).
- `NEXT_PUBLIC_CMS_MIGRATION_ACTIVE="true"`: Switches the high-level `CMSAdapter` to use Payload.

## Admin UI
Access the admin interface at `/admin`.
Default dev credentials:
- URL: `http://localhost:3000/admin`
- User: `admin@electromax.ru`
- Pass: `admin` (seeded via `db:seed`)
