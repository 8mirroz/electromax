# System Design: WEB (Frontend System)

**System ID**: `WEB`
**Project**: Electromax
**Architecture Base**: Next.js App Router (React 19, Tailwind CSS 4)

---

## 1. Overview

The WEB system is responsible for rendering the full user interface, managing client-side interactions, and securely submitting data to the API system. It serves as the primary touchpoint for users and search engines, thus holding strict requirements for Performance (Core Web Vitals), Accessibility (WCAG 2.2 AA), and Security.

## 2. Goals & Non-Goals

**Goals**:

- Deliver rapid Largest Contentful Paint (LCP < 2.5s)
- Ensure full keyboard predictability and screen reader compatibility.
- Ensure type-safe client-side logic using strict TypeScript.
- Provide secure form submissions with visual feedback.

**Non-Goals**:

- Processing logic (Delegated to API).
- Storing user state across long sessions without explicitly required local storage.
- A fully decoupled CSR SPA (Next.js is the chosen SSR mechanism).

## 3. Background & Context

Based on the `COMPREHENSIVE_AUDIT_REPORT_2026.md` and subsequent `/task-blueprint-selection` execution, the application currently suffers from 66 compliance violations impacting performance, security, and accessibility.

**Key constraints inherited**:

- Next.js 16 + React 19 + Tailwind CSS + Typescript.
- Must eliminate FOIT/FOUT.
- Must provide content security (CSP).

## 4. Architecture

### Pattern

The system employs the **App Router Architecture** natively supported by Next.js, leveraging Server Components (RSC) for initial HTML payload and Client Components ( `"use client"` directives) selectively for user interactions and state tracking.

### Core Components

1. **Edge Middleware (`middleware.ts`)**: Injects CSP Headers, strict transport security, and configures cache-control dynamically.
2. **Server Root Layout (`layout.tsx`)**: Sets up structural HTML, configures `next/font/google`, and initializes context or providers.
3. **Optimized Presentational Components (`Image`, `Link`)**: Next.js provided primitives to handle priority fetching and asynchronous hydration.
4. **Interactive Primitives (`QuizModal.tsx`, `ProjectsGallery`)**: Stateful modules bound to UI state (Zustand/useState) managing User Inputs and focus traps.

## 5. Interface Design

- **Input**: User actions (click, tab, scroll), query params, API responses.
- **Output**: Rendered HTML/CSS fragments, Client-side transitions, structured logs.
- **Dependencies Interface**: The client calls `/api/leads` and expects `{ success: boolean, message: string }`.

## 6. Technology Stack

- **Framework**: Next.js 16, React 19
- **Styling**: Tailwind CSS 4
- **State**: React hooks built-in (Jotai or Zustand recommended for cross-component state)
- **Validation**: Zod (for client-side form validation before API dispatch)
- **Accessibility Engine**: Radix UI Primitives (Optional but highly recommended)

## 7. Trade-offs & Alternatives

### Trade-off 1: `next/image` vs Native `<img>`

- **Current problem**: `<img>` tags load synchronously, blocking rendering, or do not resize.
- **Decision**: Wrap all images with `next/image`.
- **Trade-off**: Requires strictly defining `width` and `height`, which makes responsive design slightly more verbose, but significantly helps CLS and LCP metrics.

### Trade-off 2: Headless Custom UI vs Pure Custom UI

- **Current problem**: Building A11Y compatible components from scratch causes numerous issues.
- **Decision**: Adopt Radix UI for complex interactive widgets (e.g. Modals).
- **Trade-off**: Increases bundle size slightly vs raw HTML, but guarantees WCAG 2.2 AA compliance natively (focus-traps, keyboard nav).

### Trade-off 3: Client vs Server Rendering (App Router)

- **Decision**: Render content as deeply as possible on the server.
- **Trade-off**: Harder to implement complex reactive data flows but vastly superior for fast Time to First Byte (TTFB) and SEO. Only nodes starting with `use client` should be stateful.

## 8. Security Considerations

- **Content Security Policy (CSP)**: Handled at Edge in `middleware.ts`.
- **Form Abuse**: Rate-limiter (Upstash) should block repeated requests at the server level.
- **Data Exposure**: Strict enforcement to never leak sensitive variables (`process.env.SECRET` instead of `NEXT_PUBLIC_SECRET`).

## 9. Performance Considerations

- Use `loading="lazy"` on below-the-fold components and images.
- Refactor large client bundles (e.g., `QuizModal`) using `next/dynamic`.
- Centralize fonts via `next/font`.

## 10. Testing Strategy

- Unit Tests (Vitest) for complex pure functions.
- Accessibility Audits (Axe-core) via CLI to prevent regressions.
- Visual Regression (Chromatic).
