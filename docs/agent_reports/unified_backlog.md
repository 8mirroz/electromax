# Unified Backlog — Electromax UI/UX (Implementation-Ready)

### UB-001

backlog_id: UB-001
title: Fix hero input data loss and pass value into QuizModal
source_agents: Opus, Gemini
priority: P0
severity: critical
domains: conversion, ux
target_routes/components: / (Hero), QuizModal
recommended_owner: frontend-ui
effort: M
dependencies: QuizModal accepts initial input state
acceptance_criteria: Hero input value is preserved and injected into QuizModal OR input is converted to non-editable CTA without data loss risk.

### UB-002

backlog_id: UB-002
title: Token drift cleanup for raw colors and non-tokenized gradients
source_agents: Opus, Gemini, Kimi
priority: P1
severity: major
domains: design-system, governance
target_routes/components: src/app/page.tsx, src/components/ui/RainbowButton.tsx, src/components/ui/Tabs.tsx, src/components/sections/Footer.tsx
recommended_owner: frontend-platform
effort: M
dependencies: tailwind.config.ts, src/styles/globals.css token mapping
acceptance_criteria: Raw HEX color usage and non-tokenized gradients are removed from target components; service accent colors remain tokenized; any justified motion-only inline styles are documented exceptions.

### UB-003

backlog_id: UB-003
title: Motion token compliance across UI components (150-400ms)
source_agents: Opus, Gemini, Kimi
priority: P1
severity: major
domains: motion, performance
target_routes/components: src/app/page.tsx, src/components/ui/RainbowButton.tsx, src/components/ui/Tabs.tsx, src/components/ui/button.tsx, src/components/sections/Footer.tsx
recommended_owner: frontend-ui
effort: S
dependencies: src/styles/globals.css motion tokens
acceptance_criteria: All non-exempt transitions/animations use --duration-\* tokens or are within 150-400ms; no duration >400ms remains without approved exception.

### UB-004

backlog_id: UB-004
title: Reduced-motion compliance for JS-driven motion components
source_agents: Opus, Kimi
priority: P1
severity: major
domains: accessibility, motion
target_routes/components: src/app/page.tsx, src/components/ui/MobileNav.tsx, src/components/sections/Footer.tsx, src/components/ui/Tabs.tsx
recommended_owner: frontend-ui
effort: S
dependencies: None
acceptance_criteria: Non-essential motion sequences respect prefers-reduced-motion using MotionConfig/useReducedMotion or equivalent logic.

### UB-005

backlog_id: UB-005
title: CTA consolidation and casing alignment
source_agents: Opus, Gemini, Kimi
priority: P1
severity: major
domains: conversion, content
target_routes/components: src/app/page.tsx, src/components/ui/MobileNav.tsx
recommended_owner: content
effort: S
dependencies: Marketing/brand copy approval
acceptance_criteria: Equivalent user intents map to 1-2 standardized CTA labels with consistent casing policy.

### UB-006

backlog_id: UB-006
title: Button sizing alignment (RainbowButton vs Button variants)
source_agents: Kimi
priority: P2
severity: minor
domains: visual, design-system
target_routes/components: src/components/ui/RainbowButton.tsx, src/components/ui/button.tsx
recommended_owner: frontend-ui
effort: S
dependencies: None
acceptance_criteria: Button size scale is defined and consistent where button variants appear together.

### UB-007

backlog_id: UB-007
title: Typography and spacing tokenization for badges and small labels
source_agents: Kimi
priority: P2
severity: minor
domains: design-system, typography
target_routes/components: src/app/page.tsx (hero pill, service badges), src/components/sections/Footer.tsx
recommended_owner: frontend-ui
effort: S
dependencies: Token definitions in globals.css
acceptance_criteria: Arbitrary typography/spacing values in target micro-elements are replaced with tokens or documented locked exceptions.

### UB-008

backlog_id: UB-008
title: Hero placeholder contrast verification and correction
source_agents: Kimi
priority: P2
severity: minor
domains: accessibility
target_routes/components: src/app/page.tsx (hero input)
recommended_owner: qa
effort: XS
dependencies: None
acceptance_criteria: Placeholder contrast ratio is verified on actual hero background and meets 4.5:1, or style is adjusted.

### UB-009

backlog_id: UB-009
title: Language consistency for section labels
source_agents: Kimi
priority: P2
severity: minor
domains: content
target_routes/components: src/app/page.tsx (#services label)
recommended_owner: content
effort: XS
dependencies: Brand language decision
acceptance_criteria: Section labels use a single primary language (Russian) except approved brand terms.

### UB-010

backlog_id: UB-010
title: Extract Telegram CTA into reusable component without changing locked hover UX
source_agents: Gemini
priority: P2
severity: minor
domains: code-quality, design-system
target_routes/components: src/app/page.tsx (Audit CTA block)
recommended_owner: frontend-ui
effort: M
dependencies: Locked hover animation must be preserved
acceptance_criteria: Telegram CTA is refactored to a reusable component with identical hover animation and layout behavior.

### UB-011

backlog_id: UB-011
title: Fix homepage service card slug integrity to prevent 404s
source_agents: Opus
priority: P0
severity: critical
domains: navigation, routing, conversion
target_routes/components: src/app/page.tsx, src/generated/services-index.ts, src/lib/services-content.ts, src/app/services/[slug]/page.tsx
recommended_owner: frontend-platform
effort: M
dependencies: Service slug source-of-truth alignment and index regeneration
acceptance_criteria: Every service link rendered on homepage resolves to a valid service page model and does not trigger notFound().

### UB-012

backlog_id: UB-012
title: Restore Footer to locked UX constraints (2-column services + approved abbreviations)
source_agents: Opus
priority: P1
severity: major
domains: governance, ux
target_routes/components: src/components/sections/Footer.tsx, plans/ui_ux_overhaul_plan.md
recommended_owner: frontend-ui
effort: M
dependencies: Locked footer abbreviations list from overhaul plan
acceptance_criteria: Footer services are rendered in 2 columns and match the locked abbreviation set (АПС, АСУЗ, ЭО, ЭОМ, ОС, СКС, СКУД, СОТ, СОУЭ, ТО).

### UB-013

backlog_id: UB-013
title: Add focus trap and focus return to MobileNav drawer dialog
source_agents: Opus
priority: P1
severity: major
domains: accessibility, mobile
target_routes/components: src/components/ui/MobileNav.tsx
recommended_owner: frontend-ui
effort: S
dependencies: Reuse `focus-trap-react` pattern from QuizModal or equivalent dialog focus management
acceptance_criteria: Tab navigation is trapped inside the drawer while open, initial focus is set, and focus returns to hamburger on close.

### UB-014

backlog_id: UB-014
title: Eliminate unbounded decorative animation loops and enforce loop budget
source_agents: Opus
priority: P1
severity: major
domains: motion, performance, accessibility
target_routes/components: src/app/page.tsx, src/components/sections/Footer.tsx
recommended_owner: frontend-ui
effort: M
dependencies: UB-003, UB-004
acceptance_criteria: Decorative infinite loops are removed or explicitly approved; concurrent always-on loops <=2; reduced-motion path disables non-essential loops.

### UB-015

backlog_id: UB-015
title: Fix AnimatedTabs controlled/uncontrolled API desynchronization
source_agents: Opus
priority: P2
severity: major
domains: component-api, frontend-quality
target_routes/components: src/components/ui/Tabs.tsx
recommended_owner: frontend-ui
effort: S
dependencies: Audit current consumers of AnimatedTabs
acceptance_criteria: `activeTabId` prop updates from parent reliably change active tab, or component API is explicitly simplified to uncontrolled mode.
