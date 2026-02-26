# Lite Mode Fixes and Optimizations

## Problem

When lite mode (perf-lite) was enabled, UI elements were displaying incorrectly due to:

1. Missing background fallbacks when CSS patterns were disabled
2. Glass morphism effects losing their backdrop-filter without proper solid color fallbacks
3. Animations not being properly disabled in React components
4. Service cards and expanded overlays having transparency issues

## Fixes Applied

### 1. CSS Overrides (`src/styles/globals.css`)

**Enhanced `.perf-lite` selector with comprehensive fallbacks:**

```css
/* Glass effect fallback - solid background with border */
html.perf-lite .glass {
  backdrop-filter: none !important;
  background-color: var(--color-card) !important;
  border: 1px solid var(--color-border) !important;
  box-shadow: var(--shadow-soft) !important;
}

/* Service cards lite mode - solid backgrounds */
html.perf-lite .service-card {
  background: var(--color-card) !important;
  backdrop-filter: none !important;
  border: 1px solid var(--color-border) !important;
  box-shadow: var(--shadow-soft) !important;
}

/* Expanded overlay lite mode */
html.perf-lite .expanded-overlay {
  background: rgba(0, 0, 0, 0.75) !important;
  backdrop-filter: none !important;
}

html.perf-lite .expanded-card {
  background: var(--color-card) !important;
  backdrop-filter: none !important;
  border: 1px solid var(--color-border) !important;
  box-shadow: var(--shadow-hard) !important;
}
```

**Key improvements:**

- All glass elements now have solid `var(--color-card)` backgrounds
- Proper borders added for visual separation
- Appropriate shadows for depth without blur effects
- Disabled transforms on hover for better performance

### 2. Service Card Components

**`src/components/smart-cards/ServiceCard.tsx`:**

- Added `usePerformanceTier()` hook
- Disabled `whileHover` and `whileTap` animations in lite mode
- Set `transition.duration` to `0` in lite mode

**`src/components/smart-cards/ExpandedCard.tsx`:**

- Added `usePerformanceTier()` hook
- All motion transitions respect `isLite` flag
- Stagger animations disabled in lite mode
- Button hover effects disabled in lite mode

**`src/components/smart-cards/ServiceCardsSection.tsx`:**

- Added `usePerformanceTier()` hook
- GSAP Flip animations disabled in lite mode
- Background blur effects on other cards skipped in lite mode
- Filter buttons use solid backgrounds instead of transparency

### 3. Section Components

**`src/components/sections/ProblemSection.tsx`:**

- Added `usePerformanceTier()` hook
- Motion transitions respect `isLite` flag
- Removed scale transform on glass icon (handled by CSS)

**`src/components/sections/EquipmentList.tsx`:**

- Added `usePerformanceTier()` hook
- Motion transitions respect `isLite` flag

## Testing

### Manual Testing

1. **Force lite mode via URL parameter:**

   ```
   http://localhost:3000/?perf=lite
   ```

2. **Force lite mode via localStorage:**

   ```javascript
   localStorage.setItem("electromax_perf_tier", "lite");
   ```

3. **Check the following:**
   - ✅ Service cards have solid white backgrounds (not transparent)
   - ✅ Expanded card overlay has proper contrast
   - ✅ Config blocks are visible with solid backgrounds
   - ✅ Filter buttons have proper borders
   - ✅ No animations or transitions occur
   - ✅ All text is readable with proper contrast

### Automated Testing

Run existing E2E tests:

```bash
pnpm test:e2e --grep "Lite Mode"
```

## Optimization Recommendations

### 1. **Component-Level Optimizations**

#### A. Add `will-change` hints for lite mode

```css
html.perf-lite .service-card {
  will-change: auto !important;
}
```

#### B. Reduce DOM complexity in lite mode

Create lite-specific component variants:

```tsx
function ServiceCardLite({ item, isActive, onClick }: ServiceCardProps) {
  return (
    <div className="service-card" onClick={onClick}>
      {/* Simplified content without motion wrappers */}
    </div>
  );
}
```

### 2. **Image Optimization**

Add lazy loading and lite mode image placeholders:

```tsx
<Image src={src} alt={alt} loading="lazy" className={isLite ? "grayscale" : ""} />
```

### 3. **Font Loading**

Consider `font-display: optional` for lite mode:

```css
html.perf-lite {
  font-display: optional;
}
```

### 4. **Network Optimization**

Add data saver detection for additional optimizations:

```tsx
const isDataSaver = navigator.connection?.saveData;

// Skip loading heavy assets
useEffect(() => {
  if (isLite || isDataSaver) {
    // Don't load video backgrounds, complex shaders, etc.
  }
}, [isLite, isDataSaver]);
```

### 5. **Shadow DOM Optimization**

For heavily nested components, consider flattening the DOM structure in lite mode:

```tsx
{
  isLite ? (
    <div className="simplified-structure">...</div>
  ) : (
    <motion.div className="complex-structure">...</motion.div>
  );
}
```

### 6. **Event Listener Optimization**

Reduce event listener overhead in lite mode:

```tsx
// Only add complex gesture handlers in full mode
useEffect(() => {
  if (isLite) return;

  // Add gesture listeners, parallax calculations, etc.
  return () => cleanup();
}, [isLite]);
```

### 7. **CSS Containment**

Add CSS containment for better performance:

```css
html.perf-lite .service-card {
  contain: layout style paint;
}
```

### 8. **Reduce Reflows**

Batch DOM updates in lite mode:

```tsx
const updateMultipleValues = () => {
  if (isLite) {
    // Use requestAnimationFrame to batch updates
    requestAnimationFrame(() => {
      setState({ a: 1, b: 2, c: 3 });
    });
  } else {
    // Normal updates
  }
};
```

## Performance Monitoring

Add performance metrics tracking:

```tsx
useEffect(() => {
  if (isLite) {
    // Track lite mode performance
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        console.log("Lite mode performance:", entry);
      });
    });
    observer.observe({ entryTypes: ["paint", "layout-shift"] });
  }
}, [isLite]);
```

## Browser-Specific Optimizations

### Chrome/Edge

```css
html.perf-lite {
  content-visibility: auto;
}
```

### Firefox

```css
html.perf-lite * {
  -moz-appearance: none !important;
}
```

### Safari

```css
html.perf-lite {
  -webkit-font-smoothing: subpixel-antialiased;
}
```

## Future Enhancements

1. **Progressive Enhancement**: Start with lite mode as baseline, enhance for capable devices
2. **Adaptive Images**: Serve WebP/AVIF based on device capabilities
3. **Code Splitting**: Split heavy animation libraries into separate chunks
4. **Service Worker**: Cache lite mode assets separately for offline support
5. **User Preference API**: Respect `prefers-reduced-motion` and `save-data` headers

## Governance

When adding new components:

- ✅ Always check lite mode compatibility
- ✅ Add `usePerformanceTier()` hook to animated components
- ✅ Provide solid background fallbacks for glass effects
- ✅ Test with `?perf=lite` URL parameter
- ✅ Document lite mode behavior in component README

## Related Documentation

- [Adaptive Mode Architecture](./ki/ADAPTIVE_MODE.md)
- [Performance Governance](./ki/PERFORMANCE_GOVERNANCE.md)
- [Component Guidelines](./ki/COMPONENT_GUIDELINES.md)
