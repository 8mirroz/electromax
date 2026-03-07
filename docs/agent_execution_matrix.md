# Agent Execution Matrix (Parallel, Conflict-Free)

## Branching model

- Each agent works in its own git worktree/branch.
- Only Codex merges to `main`.
- Shared contract files only: `content/briefs`, `content/drafts`, `content/qa`, `content/rules`.

## Agent 1 — Codex (Integration Lead)

### Owns

- `src/app/**`, `src/lib/**`, `src/types/**`, `.github/workflows/**`, `infra/**`, `docker/**`

### Must deliver

- Green `pnpm build`, `pnpm test`, critical Playwright
- API contracts: `/api/content/*`, `/api/events`, `/api/revalidate`
- Analytics and CMS wiring

## Agent 2 — Bonsai Opus (Quality/Governance)

### Owns

- `docs/governance/**`, `docs/qa/**`, `content/rules/**`, `promptfoo/**`

### Must deliver

- Formal quality rubric and threshold policy
- Promptfoo evaluation suite
- Reject/rewrite/quarantine policy with measurable pass/fail outputs

## Agent 3 — Gemini (SEO/Market Intelligence)

### Owns

- `content/seo/**`, `content/localization/**`, `docs/market/**`, `content/briefs/**`

### Must deliver

- RU/EN/KZ keyword clusters
- Topic map + internal link graph
- Brief packs for 20+ RU materials and wave-2 EN/KZ

## Agent 4 — Qwen (Content Generation)

### Owns

- `scripts/content-gen/**`, `content/drafts/**`, `n8n/workflows/**`

### Must deliver

- Draft generator from briefs
- Rewrite loop hooks and machine-readable outputs
- Batch drafts for RU first, then EN/KZ wave-2

## Integration rules

- Input contract: `content/briefs/*.json`
- Draft contract: `content/drafts/*.json`
- QA contract: `content/qa/*.json`
- No runtime changes outside owner scope without Codex sign-off
