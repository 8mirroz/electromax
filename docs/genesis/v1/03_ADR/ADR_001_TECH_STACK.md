# ADR-001: Technology Stack Selection

**Date**: 2026-02-24
**Status**: Accepted

## Context

The Electromax platform requires a robust, SEO-friendly, and highly performant frontend to capture incoming B2B leads. It must support complex interactive components (such as a dynamic cost calculator) while maintaining fast load times and excellent Core Web Vitals.

## Decision

We have selected the following technology stack for the MVP (v1):

1. **Framework:** Next.js (App Router) v16+
   - _Reason:_ Provides built-in Server-Side Rendering (SSR) and Static Site Generation (SSG) which are critical for SEO (marketing landing pages). The App Router simplifies nested layouts (useful for `/services/` sub-pages).
2. **UI Library:** React v19
   - _Reason:_ Industry standard, excellent ecosystem, required by Next.js.
3. **Styling:** Tailwind CSS v4 + PostCSS
   - _Reason:_ Enables rapid UI development using utility classes without maintaining a large custom CSS architecture. Ideal for building the component-driven design system required by the PRD.
4. **Language:** TypeScript
   - _Reason:_ Hardens the codebase with strict static typing, making the codebase more reliable and easier to refactor. Excellent developer experience.
5. **Testing:** Playwright (E2E) & Vitest (Unit)
   - _Reason:_ Playwright is the standard for testing user flows (like the calculator and form submission) across different browsers. Vitest provides fast, Jest-compatible unit testing for calculation formulas and utility functions.
6. **Package Manager:** pnpm
   - _Reason:_ Fast, disk-space efficient (via hard links), and strictly manages node_modules.

## Consequences

- **Positive:** Immediate productivity boost, extremely high performance out-of-the-box, excellent SEO capabilities, and a clearly defined testing strategy.
- **Negative:** Next.js App Router cache semantics require careful handling, especially if calculator data needs to be frequently updated from a CMS without rebuilding the whole site.

## Alternatives Considered

- _Vite + React SPA:_ Rejected due to inferior SEO performance compared to SSR/SSG.
- _Astro:_ Rejected because the project requires significant stateful interactivity (multi-step calculator, complex forms) where Next.js/React provides a more unified ecosystem.
