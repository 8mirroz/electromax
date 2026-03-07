# Content QA Playbook

## Commands

- `pnpm content:generate:drafts`
- `pnpm content:localize:drafts`
- `pnpm content:validate:drafts`
- `pnpm content:qa`

## Pass Criteria

- No schema errors
- Promptfoo threshold pass
- No broken links
- Required CTA and risk disclaimers present

## Quarantine Policy

- On failure, item is marked rejected and moved to `content/qa` report.
- Automatic rewrite attempts up to 3 times.
