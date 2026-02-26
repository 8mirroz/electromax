# SCOUT RISK REPORT: ELECTROMAX v1

## 1. Executive Summary

**Status**: 🟢 GO (Low-Medium Risk)
The project is in a healthy, early-growth phase. Core modules are modular following Next.js App Router patterns. Major risks are centered around data-to-UI coupling and third-party API reliability.

## 2. Top 3 Critical Risks

1.  **Data Coupling (High Churn)**: `src/data/services.ts` is the single source of truth for pricing and UI content across multiple pages. Any typo or schema change here breaks the Calculator and Service Detail pages simultaneously.
2.  **API Integration (Medium Impact)**: The lead capture system (`api/leads`) relies on Telegram and SMTP. These have no fallback mechanisms currently; if the bot is down, leads are lost.
3.  **UI Performance (Mitigated)**: Canvas animation was identified as a performance blocker and has been replaced with static AI-generated imagery.

## 3. Hotspot Map

| File Path                                 | Churn (Commits) | Complexity | Risk Level |
| :---------------------------------------- | :-------------- | :--------- | :--------- |
| `src/app/page.tsx`                        | High            | Moderate   | Medium     |
| `src/components/forms/CalculatorForm.tsx` | High            | High       | High       |
| `src/data/services.ts`                    | Medium          | Low        | Medium     |

## 4. Coupling Analysis

- **Temporal Coupling**: Changes to `types/index.ts` (ServiceConfig) require immediate updates to `data/services.ts`, `[slug]/page.tsx`, and `CalculatorForm.tsx`.
- **Styling Coupling**: `globals.css` (Tailwind v4) tokens are heavily utilized in ad-hoc components (`PremiumHero`). Changing primary colors requires a sweep of manually defined HSL values in Canvas/Tailwind layers.

## 5. Team Knowledge Risk (Bus Factor)

- **Primary Architect**: AI/Agent (100% contribution)
- **Risk**: Low, as technical debt is actively managed through ADRs and systematic refactoring (e.g., PremiumHero optimization).

## 6. Recommendations

- **Refactor**: Move pricing logic from `CalculatorForm.tsx` into a standalone utility helper to make it testable via unit tests.
- **Implement**: Basic error logging or retry queue for Lead Capture API.
- **Documentation**: Maintain `docs/ki/` for design tokens and pricing schema.
