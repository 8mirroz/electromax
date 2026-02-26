# KI: UI Performance — Canvas vs. AI-Generated Image

## Context

During the implementation of the `PremiumHero` component (Phase 6), a high-complexity HTML5 Canvas animation with beams and noise was implemented to provide a "quiet luxury" aesthetic.

## Symptom

User reported UI lag and performance drops (FPS lag) on the hero section, especially on machines with lower GPU acceleration or thermal throttling.

## Root Cause

- **Complex Loop**: Re-drawing ~24 semi-transparent gradients with blur filters `ctx.filter = "blur(...)"` on every frame (60fps) is extremely expensive for the CPU/GPU.
- **Noise Generation**: Generating pixel-level noise via `putImageData` on every frame further increased processing load.

## Resolution / Fix

1.  **Elimination of Canvas**: Completely removed the `useEffect` animation loop and canvas refs.
2.  **AI Image Generation (NanoBanana)**: Generated a photorealistic server-room background with blue accents matching the brand.
3.  **Static Layering**: Used Next.js `<Image />` component with `priority`, `fill`, and CSS gradients for decorative depth.
4.  **Optimized Motion**: Retained simple CSS/Framer Motion text transitions (low overhead) while removing pixel-heavy background rendering.

## Verification

- **Build**: Successful.
- **Manual Verification**: No FPS drops, smooth scroll, zero CPU spikes on hero load.
- **Tests**: Playwright E2E passed.

## Reusable Pattern

- **Pattern**: If high-res background animation impacts UX, replace it with a high-quality AI-generated static image + lightweight CSS overlays (gradients/noise textures).
- **Rule of Thumb**: Blur filters in Canvas `2DContext` are performance killers; prefer CSS `backdrop-filter` or static assets.
