# Content Quality Governance (Auto-Publish)

## Policy

- Auto-publish is enabled only after automated gates pass.
- Max rewrite loop: 3 iterations.
- Failed content goes to quarantine (`content/qa`).

## Gates

- Schema validation
- SEO lint
- Brand/legal lint
- Promptfoo rubric evaluation
- Link/media checks

## Ownership

- Codex: integration and CI gates
- Bonsai Opus: rubric and thresholds
- Gemini: SEO briefs and keyword map
- Qwen: high-volume draft generation
