# Content Briefs

Each brief is a single JSON object used by `scripts/content-gen/generate-drafts.mjs`.

Required fields:

- `slug`
- `locale`
- `type` (`article` | `guide` | `checklist` | `case_study`)
- `title`
- `intent`
- `targetKeyword`
- `cta`

Output drafts are written to `content/drafts/<slug>.json`.
