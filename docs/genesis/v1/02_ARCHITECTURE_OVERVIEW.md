# Architecture Overview - Electromax v1

## 1. System Decomposition

The Electromax system is a Server-Side Rendered (SSR) B2B marketing platform built on Next.js. It integrates deeply with external CRM and communication services.

### 1.1 Core Systems

| System ID               | Responsibility                                                                                       | Boundary                            | Dependencies                               |
| :---------------------- | :--------------------------------------------------------------------------------------------------- | :---------------------------------- | :----------------------------------------- |
| **WEB (Frontend)**      | Rendering the UI, routing, and user interaction (Service Pages, Lead Forms).                         | Next.js App Router (`src/app/`)     | React 19, Tailwind CSS 4                   |
| **UI (Components)**     | Reusable design system components (Hero, Calculator, Cards).                                         | `src/components/`                   | Tailwind CSS 4, React                      |
| **API (Backend Route)** | Handling form submissions, calculating server-side estimates, and routing Leads to external systems. | Next.js API Routes (`src/app/api/`) | Telegram API, SMTP/Email, external CRM API |
| **DATA (Content)**      | Storing static configuration for pricing, service descriptions, and cases.                           | `src/data/` or Headless CMS         | Local JSON/MD files or external DB         |

## 2. Physical Code Structure

```text
/Users/user/projects/electromax/
├── docs/
│   ├── genesis/v1/         # Architecture & Requirements Documentation
├── public/                 # Static assets (images, fonts, robots.txt)
├── src/
│   ├── app/                # Next.js App Router pages and layouts
│   │   ├── (marketing)/    # Main landing pages route group
│   │   ├── services/       # Dynamic routes for individual services (e.g., [slug])
│   │   └── api/            # API endpoints (leads, calculator logic)
│   ├── components/
│   │   ├── ui/             # Generic atomic components (Buttons, Inputs, Modals)
│   │   ├── sections/       # Complex sections (HeroBanner, StepForm, ProblemCards)
│   │   └── forms/          # Form logic and validation
│   ├── lib/                # Shared utilities, API clients, helpers
│   ├── data/               # Static pricing tables, service configuration
│   └── styles/             # Global CSS, Tailwind entry point
├── tests/
│   ├── e2e/                # Playwright End-to-End tests
│   └── unit/               # Vitest Unit tests
├── next.config.ts
├── tailwind.config.ts
└── package.json
```

## 3. Communication Patterns

- **Client to Server:** Next.js Server Actions or API routes via Fetch. Form submissions (`/api/leads`) send JSON payloads.
- **Server to External:** The API route validates the payload, formats a message, and makes HTTPS requests to the Telegram Bot API and the company's CRM Webhook.
