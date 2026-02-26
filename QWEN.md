# Electromax - Project Context

## Project Overview

Electromax is a **Next.js 16** web application for a Russian security systems integrator company. The site showcases engineering services including fire alarm systems (АПС), access control (СКУД), video surveillance (СОТ), structured cabling (СКС), and electrical installations (ЭОМ).

### Tech Stack

| Category            | Technology                                    |
| ------------------- | --------------------------------------------- |
| **Framework**       | Next.js 16.1.6 (App Router)                   |
| **Language**        | TypeScript 5                                  |
| **UI Library**      | React 19                                      |
| **Styling**         | Tailwind CSS 4                                |
| **Animations**      | Framer Motion 12                              |
| **Components**      | Radix UI, Lucide Icons, Material Icons        |
| **Forms**           | Custom form components with Turnstile CAPTCHA |
| **Testing**         | Vitest (unit), Playwright (E2E)               |
| **Linting**         | ESLint 9 + Prettier                           |
| **Package Manager** | pnpm                                          |
| **Node Version**    | 20 LTS (`.nvmrc`)                             |

### Architecture

```
src/
├── app/              # Next.js App Router pages & API routes
│   ├── api/          # API endpoints (e.g., /api/leads)
│   ├── layout.tsx    # Root layout with fonts & metadata
│   └── page.tsx      # Home page
├── components/       # React components
│   ├── forms/        # Form components
│   ├── sections/     # Page sections (Footer, etc.)
│   ├── ui/           # Reusable UI components (Button, Hero, etc.)
│   └── Analytics.tsx # Analytics tracking component
├── data/             # Static data & configuration
│   └── services.ts   # Service catalog with pricing & content
├── lib/              # Utility functions
│   └── utils.ts      # cn() helper for class merging
├── sections/         # Landing page sections
├── styles/           # Global styles
├── test/             # Test utilities
│   └── setup.tsx     # Vitest setup with mocks
└── types/            # TypeScript type definitions
```

## Building and Running

### Prerequisites

```bash
# Install Node.js 20 LTS
nvm install  # reads .nvmrc
```

### Installation

```bash
pnpm install
```

### Development

```bash
pnpm dev              # Start local dev server at http://127.0.0.1:3000
```

### Production

```bash
pnpm build            # Create production build
pnpm start            # Run production server
```

### Testing

```bash
pnpm test             # Run Vitest unit tests (single run)
pnpm test:unit        # Run Vitest in watch mode
pnpm test:e2e         # Run Playwright E2E tests
```

### Code Quality

```bash
pnpm lint             # Run ESLint
pnpm format           # Format code with Prettier
```

## Development Conventions

### Code Style

- **TypeScript**: Strict mode enabled, `tsconfig.json` configures path aliases (`@/*` → `./src/*`)
- **Prettier**: Double quotes, semicolons, trailing commas, 100 char line width
- **ESLint**: Next.js recommended config + TypeScript + Prettier
- **Git Hooks**: Husky runs `lint-staged` on pre-commit (auto-fixes ESLint + Prettier)

### Component Patterns

- **UI Components**: Located in `src/components/ui/`, use `cn()` utility for conditional classes
- **Class Merging**: Use `cn()` from `@/lib/utils` for Tailwind class composition
- **Icons**: Material Icons Outlined (Google Fonts) + Lucide React icons
- **Styling**: Tailwind CSS with CSS variables for theme colors (`--background`, `--foreground`, `--font-*`)

### Testing Practices

- **Unit Tests**: Vitest with `jsdom` environment, Testing Library for React
- **E2E Tests**: Playwright configured in `tests/e2e/`
- **Test Files**: Named `*.test.ts` or `*.spec.ts` in `src/**`
- **Mocks**: Next.js `Image` component mocked in test setup

### Project Structure Conventions

- **Path Alias**: Use `@/` instead of relative imports (`@/components/ui/button`)
- **Service Data**: All service configurations in `src/data/services.ts` with type `ServiceConfig`
- **API Routes**: Next.js App Router API in `src/app/api/`

## Key Configuration Files

| File                   | Purpose                                      |
| ---------------------- | -------------------------------------------- |
| `next.config.ts`       | Next.js configuration                        |
| `tailwind.config.ts`   | Tailwind theme customization (colors, fonts) |
| `tsconfig.json`        | TypeScript config with path aliases          |
| `vitest.config.ts`     | Vitest test configuration                    |
| `playwright.config.ts` | Playwright E2E configuration                 |
| `eslint.config.mjs`    | ESLint flat config                           |
| `.prettierrc`          | Prettier formatting rules                    |
| `pnpm-workspace.yaml`  | pnpm workspace configuration                 |

## Documentation

Internal documentation is stored in `docs/`:

- **Service Specs**: `APS.md`, `SKUD.md`, `SOT.md`, `EOM.md`, etc.
- **Marketing**: Source research and strategy documents
- **Reports**: Technical reports and implementation guides

## Notes

- Site content is in **Russian** (lang attribute set to `ru`)
- Uses Cloudflare Turnstile for form protection (`@marsidev/react-turnstile`)
- Email functionality via `nodemailer` for lead submissions
- Framer Motion used for page transitions and animations
