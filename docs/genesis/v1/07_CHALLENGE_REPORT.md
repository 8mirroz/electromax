# Electromax WEB System Challenge Report

> **Review Date**: 2026-02-28
> **Scope**: WEB System Design (`04_SYSTEM_DESIGN/WEB.md`), Audit Implementation Plan
> **Reviewer**: AI Challenger
> **Total Findings**: 4 Issues

---

## 🎯 Review Methodology

This review uses a 3-dimensional analysis framework to validate the implementation plan targeting the Electromax Audit 2026:

1. **System Design** - Architectural integrity, boundary clarity, consistency
2. **Runtime Simulation** - Temporal correctness, state synchronization, boundary conditions
3. **Engineering Implementation** - Testability, maintainability, performance, security

Each issue is described as:

- **Severity**: Critical / High / Medium / Low
- **Description**: Specific deficiency
- **Impact**: Impact on system
- **Recommendation**: Solution

---

## 📊 Statistics

| Severity  | Count | %        |
| --------- | ----- | -------- |
| Critical  | 1     | 25%      |
| High      | 2     | 50%      |
| Medium    | 1     | 25%      |
| Low       | 0     | 0%       |
| **Total** | **4** | **100%** |

| Dimension     | Count |
| ------------- | ----- |
| System Design | 1     |
| Runtime Sim   | 1     |
| Engineering   | 2     |

---

# Part 1: System Design Issues

## 🔴 Critical Level

### C1. CSP Strictness Breaking Third-Party Integrations

**Severity**: Critical
**Document**: `04_SYSTEM_DESIGN/WEB.md` - Security Considerations

**Description**:
The design mandates strict CSP execution at the edge (middleware.ts). Electromax relies heavily on `Turnstile` for captcha, Yandex Metrica/Google Analytics, and external widget scripts. A strict CSP initially deployed without a `report-only` baseline almost always blocks inline scripts required by Next.js hydration or third-party iframes (like Turnstile).

**Source of Evidence**:

- Pre-Mortem deduction: Production deployments of strict CSPs cause script breakage.

**Impact**:

- Captcha fails to load -> 100% block of lead submission.
- Analytics data lost.

**Recommendation**:

- Deploy CSP strictly in `Content-Security-Policy-Report-Only` header first for 1 week.
- Log violations via an endpoint to map all required domains.
- Whitelist specifically `https://challenges.cloudflare.com` and analytics domains.

---

# Part 2: Runtime Simulation Issues

## 🟠 High Level

### H1. Unhandled Rejections in Rate Limiter Dependency

**Severity**: High
**Document**: `04_SYSTEM_DESIGN/WEB.md` - Trade-offs

**Description**:
The system depends on Upstash Redis for Rate Limiting in `/api/leads`. What happens if the Redis network times out or fails (Runtime simulation of edge failure)? If the catch block throws an error to the user, the site blocks legitimate business leads entirely during a vendor outage.

**Source of Evidence**:

- Engineering deduction: Third-party dependencies fail.

**Impact**:

- Loss of genuine business inquiries if Upstash goes down.

**Recommendation**:

- Wrap ratelimit logic in a fail-open `try-catch`.
- Implementation logic must be: `try { checkRateLimit() } catch { allowRequest() }`. We prioritize lead capture over absolute spam prevention.

---

# Part 3: Engineering Implementation Issues

## 🟠 High Level

### H2. Hydration Mismatch with Client-Side Theme Parsing

**Severity**: High
**Document**: Audit Report (Theme Toggle missing)

**Description**:
Adding a "Dark Mode toggle" (Recommendation UX-007) via `next-themes` often produces a hydration mismatch error on the initial load because the server renders HTML based on a default (e.g., light tier), and the client evaluates `localStorage` or `prefers-color-scheme` immediately upon mount.

**Impact**:

- `Text content did not match. Server: "Light", Client: "Dark"` React error visible in development and impacts TTI (Time to Interactive).

**Recommendation**:

- Ensure `suppressHydrationWarning` is passed to the `<html>` root layout element when implementing next-themes to safely bypass React dev errors.

## 🟡 Medium Level

### M1. Dynamic Import Skeleton FOUC

**Severity**: Medium
**Document**: `04_SYSTEM_DESIGN/WEB.md` - Performance

**Description**:
Offloading heavy modals like `QuizModal` via `next/dynamic` works for bundle size, but currently, no loading fallback is specified in the implementation plan. When a user clicks "Под ключ", there will be a noticeable delay (1-2s on 3G) where nothing happens before the bundle loads.

**Recommendation**:

- Ensure the `next/dynamic` call specifies a `loading: () => <Skeleton />` state that renders an immediate visual spinner where the modal would appear.

---

# Summary & Recommendations

## 🎯 Core Findings

**Critical Issues**: Prematurely strict Content Security Policy.

**High Issues**: Hard failure dependency on Rate Limiter; React Hydration mismatches.

---

## 📋 Action Checklist

### P0 - Immediate (Blocking implementation)

1. CSP implementation MUST be `Report-Only` initially.
2. Rate-limiter code must be wrapped in a Fail-Open `try-catch` block.

### P1 - Near Term (Important)

1. Add `suppressHydrationWarning` to HTML tag.
2. Build skeleton loaders for all dynamically imported chunks.

---

## 🚦 Final Judgment

- [x] 🟡 Project can proceed, solve P0 first

**Judgment Basis**: The architecture is sound but requires robust failure modes (fail-open) and careful rollouts of security policies.

---

## 📚 Appendix

### Assumption Validation Results

| Assumption                      | Method        | Result                                                                  | Risk |
| ------------------------------- | ------------- | ----------------------------------------------------------------------- | :--: |
| Radix UI handles all A11y needs | Docs Check    | It handles focus/keyboard, but ARIA labels still depend on prop passing |  ⚠️  |
| Rate-Limiter at Edge is fast    | Industry Data | Upstash edge latency is <50ms globally                                  |  ✅  |
