# Enterprise UI/UX Overhaul Plan — Electromax

## Executive Summary

This document outlines the detailed execution plan for the UI/UX overhaul of the Electromax project. The overhaul is divided into 4 parallel agents, each with specific responsibilities, files, and deliverables.

---

## Current Project State Analysis

### ✅ Already Implemented (Locked)

1. **Typography Stack**: Inter Variable (body), Suisse Int'l/General Sans/Clash Display (display)
2. **Design Tokens**: Complete CSS custom properties in `globals.css`
3. **Motion Tokens**: Duration and easing tokens defined
4. **Footer**: 2-column services with Cyrillic abbreviations (АПС, СКУД, СОТ, etc.)
5. **Audit Block**: Right-side Telegram CTA with specific hover animation
6. **Service Cards**: Colored top stripes, large abbreviation tags

### ⚠️ Areas Needing Attention

1. Tailwind config tokens vs CSS variables alignment
2. Button/Tabs/RainbowButton variant consistency
3. Fluid typography in landing sections
4. Integration verification and regression testing

---

## Agent 1: Foundation (Tokens + Typography + Global Motion)

### Zone of Control

- `src/styles/globals.css`
- `src/app/layout.tsx`
- `tailwind.config.ts`

### Tasks

#### 1.1 Design Tokens Alignment

| Token Type    | Current State          | Target State  | Action              |
| ------------- | ---------------------- | ------------- | ------------------- |
| Colors        | 40+ text colors in CSS | Semantic 8-10 | Consolidate         |
| Shadows       | 3 levels               | Keep          | Validate usage      |
| Border radius | 3 tokens               | Keep          | —                   |
| Spacing       | Tailwind default       | Keep          | Add fluid if needed |

#### 1.2 Typography Verification

- [ ] Confirm `Inter Variable` is correctly loaded in `layout.tsx`
- [ ] Verify `font-display` stack falls back to Inter properly
- [ ] Check h1-h6 styles use CSS variables for font-family
- [ ] Ensure heading weight is `700` (bold)

#### 1.3 Motion Tokens Validation

- [ ] Validate `--duration-*` tokens (180ms, 220ms, 300ms, 500ms)
- [ ] Verify `--ease-*` curves are correct
- [ ] Check `prefers-reduced-motion` support in globals.css

#### 1.4 Tailwind Config Cleanup

- [ ] Remove redundant color definitions that duplicate CSS variables
- [ ] Keep only semantic mappings
- [ ] Ensure no breaking changes to existing className usage

#### 1.5 Mobile Tap Targets

- [ ] Verify 44px minimum in media queries
- [ ] Ensure focus-visible styles are consistent

### Deliverables

1. Patch to `globals.css`, `tailwind.config.ts`, `layout.tsx`
2. List of changed tokens
3. List of visual zones that may be affected (for QA)

### Restrictions

- ❌ Do NOT touch `src/app/page.tsx`
- ❌ Do NOT modify UI primitives (except compile breaks with comments)

---

## Agent 2: UI Primitives & Shared Components

### Zone of Control

- `src/components/ui/button.tsx`
- `src/components/ui/RainbowButton.tsx`
- `src/components/ui/Tabs.tsx`
- `src/components/sections/Footer.tsx`
- New helpers in `src/components/ui/*`

### Tasks

#### 2.1 Button Variants Unification

| Variant     | Current            | Target | Notes            |
| ----------- | ------------------ | ------ | ---------------- |
| default     | bg-primary         | Keep   | Use motion token |
| destructive | bg-red-500         | Keep   | —                |
| outline     | border-input       | Keep   | —                |
| secondary   | bg-secondary       | Keep   | —                |
| ghost       | hover:bg-accent/20 | Keep   | —                |
| link        | text-primary       | Keep   | —                |

**Checkpoints:**

- [ ] All buttons use `--duration-normal` (220ms) for transitions
- [ ] Focus states use `ring-primary` consistently
- [ ] Border radius matches `--radius-xl` or `--radius-2xl`

#### 2.2 RainbowButton Polish

- [ ] Keep props API compatible with existing calls
- [ ] Ensure motion uses CSS variables
- [ ] Validate hover/active states use token durations

#### 2.3 Tabs Component

- [ ] Verify props API: `tabs`, `activeTabId`, `onChange`, `className`, `tabClassName`
- [ ] Check `type="button"` on tab buttons
- [ ] Validate motion uses token durations

#### 2.4 Footer UX Compliance

- [ ] Services displayed in 2 columns (grid-cols-2)
- [ ] Cyrillic abbreviations: АПС, АСУЗ, ЭО, ЭОМ, ОС, СКС, СКУД, СОТ, СОУЭ, ТО
- [ ] Contacts in 2 lines format (phone + hours, email + note)
- [ ] Verify focus-visible on all links

#### 2.5 Type Safety

- [ ] Ensure `type="button"` where needed in forms
- [ ] Verify no implicit any in component props

### Deliverables

1. Patch to UI components
2. Before/after table for variants (no breaking changes)
3. List of visual changes by component

### Restrictions

- ❌ Do NOT change business data in Footer
- ❌ Do NOT modify `src/app/page.tsx`

---

## Agent 3: Landing / Section Composition Refactor

### Zone of Control

- `src/app/page.tsx`
- Section components in `src/components/sections/*` (if needed)
- Cannot touch UI primitives directly, only use their APIs

### Tasks

#### 3.1 Fluid Typography Implementation

- [ ] Apply `clamp()` for hero title (already done: `clamp(1.9rem,4.1vw,3.35rem)`)
- [ ] Check other section headings for fluid improvements
- [ ] Remove hard breakpoint jumps where possible

#### 3.2 Service Cards Enhancement

- [ ] Verify colored stripes (top 5px → hover 6px)
- [ ] Confirm large abbreviation tags (11px, bold, tracking)
- [ ] Validate hover elevation (translate-y -1.5)
- [ ] Ensure no regression from current state

#### 3.3 KPI Cards

- [ ] Check border radius (28px)
- [ ] Verify shadow consistency
- [ ] Validate responsive grid behavior

#### 3.4 Audit Block (CRITICAL)

- [ ] Left side: triggers + description
- [ ] Right side: outputs + "Что дальше после клика" + 2 CTAs
- [ ] **Telegram button**: hover animation ONLY on button, NOT card
- [ ] Verify the specific hover implementation:
  ```tsx
  // Current: hover slide-in from left on Telegram button
  className = "... translate-x-[-100%] group-hover:translate-x-0";
  ```
- [ ] Ensure alignment is correct

#### 3.5 Micro-interactions

- [ ] Add hover elevation to cards where appropriate
- [ ] Keep icon motion subtle
- [ ] Avoid "excessive" animations

#### 3.6 Layout Polish

- [ ] Check container max-width (7xl = 1280px)
- [ ] Verify responsive breakpoints
- [ ] Ensure no CLS in hero and cards

### Visual Zones to Check

1. Hero section (1280px+)
2. KPI cards row
3. Services cards grid (mobile/tablet/desktop)
4. Audit CTA section
5. Footer

### Deliverables

1. Patch to `page.tsx` and section components
2. List of visual diffs by section
3. List of local exceptions (if any)

### Restrictions

- ❌ Do NOT change global tokens (use Agent 1's work)
- ❌ Do NOT modify button internals (use Agent 2's work)
- ❌ Do NOT change approved UX (Telegram hover, audit layout)

---

## Agent 4: Verification, Accessibility, Motion Governance

### Zone of Control

- Integration branch after Agent 1-3 merge
- Can make regression fixes only

### Tasks

#### 4.1 Automated Checks

```bash
# Lint
pnpm lint

# E2E Tests
pnpm exec playwright test tests/e2e/qa_test_suite.spec.ts

# Unit Tests (if needed)
pnpm test
```

#### 4.2 Motion Governance

- [ ] `prefers-reduced-motion`: verify no animation jumps
- [ ] No hover leakage between cards
- [ ] No layout shifts (CLS) in hero

#### 4.3 Accessibility

| Check         | Method       | Criteria            |
| ------------- | ------------ | ------------------- |
| Focus visible | Manual       | Ring appears on tab |
| Tap targets   | Manual       | ≥44px on mobile     |
| Contrast      | Manual/Audit | 4.5:1 minimum       |
| ARIA          | Code review  | Labels on CTAs      |

#### 4.4 Regression Fixes

- [ ] Fix any visual regressions from Agent 1-3
- [ ] Fix any integration conflicts
- [ ] Document all changes with reasons

#### 4.5 QA Report Generation

| Section  | Desktop | Tablet | Mobile | Status    |
| -------- | ------- | ------ | ------ | --------- |
| Hero     | ✓       | —      | —      | Pass/Fail |
| KPI      | ✓       | —      | —      | Pass/Fail |
| Services | ✓       | ✓      | ✓      | Pass/Fail |
| Audit    | ✓       | —      | —      | Pass/Fail |
| Footer   | ✓       | ✓      | ✓      | Pass/Fail |

### Deliverables

1. Integration patch (only regression fixes)
2. QA report with checklist
3. List of residual risks (if any)

### Restrictions

- ❌ Do NOT change approved content without necessity
- ❌ Do NOT make visual changes except regression fixes

---

## Execution Order

```
Agent 1 (Foundation) ──┬──> Agent 3 (Landing) ──> Agent 4 (Verification)
Agent 2 (UI Primitives) ┘              ▲
                                       │
                              (uses Agent 2 components)
                                       │
                              (integration branch)
                                       ▼
                              Agent 4 (Verification)
```

### Parallel Start

- Agent 1 and Agent 2 start simultaneously

### Sequential Dependencies

- Agent 3 starts after Agent 1 completes (needs tokens)
- Agent 3 can use Agent 2's components before Agent 2 completes (draft mode)
- Agent 3 final polish after Agent 2 merge
- Agent 4 starts only after Agents 1-3 merged

---

## Acceptance Criteria

### Automated

- [ ] `pnpm lint` passes
- [ ] `pnpm exec playwright test tests/e2e/qa_test_suite.spec.ts` passes
- [ ] No TypeScript errors

### Manual (Desktop 1280px+)

- [ ] Hero visible with gradient background
- [ ] KPI cards in 4-column grid
- [ ] Service cards with colored stripes and abbreviations
- [ ] Audit block with Telegram CTA (hover works only on button)
- [ ] Footer with 2-column services and Cyrillic abbreviations

### Manual (Tablet 768-1024px)

- [ ] Grid transitions to 2 columns smoothly
- [ ] No broken layouts

### Manual (Mobile 360-430px)

- [ ] Tap targets ≥44px
- [ ] Buttons don't break to new lines
- [ ] Footer readable

### Accessibility

- [ ] Focus ring visible on all interactive elements
- [ ] Sufficient contrast on CTA/labels
- [ ] Reduced motion works without jumps

---

## Key UX Constraints (DO NOT BREAK)

### Audit Block

- Right button "Обсудить с инженером" → Telegram
- Hover animation ONLY on the button itself
- "Что дальше после клика" in bottom of CTA zone

### Footer

- Services in 2 columns
- Cyrillic abbreviations: АПС, АСУЗ, ЭО, ЭОМ, ОС, СКС, СКУД, СОТ, СОУЭ, ТО
- Contacts in 2 lines each

### Typography

- Body: Inter Variable
- Display: Suisse Int'l / General Sans / Clah Display → Inter fallback
- Headings: weight 700 (bold)

### Service Cards

- Colored stripe at top (5px → 6px on hover)
- Large abbreviation tags (11px, bold)
- Current card hierarchy maintained
