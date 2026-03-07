# CMS Contract v2 (Payload-Compatible)

## Collections

- services
- articles
- caseStudies
- testimonials
- videos
- faqs
- siteSettings
- authors
- industries

## API Endpoints

- `GET /api/content/:collection`
- `GET /api/content/:collection/:slug`
- `POST /api/revalidate`
- `POST /api/events`

## Feature flags

- `CMS_ENABLED=true|false`
- `CMS_BASE_URL=http://...`

When `CMS_ENABLED=false`, runtime reads fallback content from `src/lib/cms/fallback-content.ts`.
