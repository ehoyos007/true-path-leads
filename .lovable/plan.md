

# Mobile PageSpeed Optimization Plan

## Current State Summary

After analyzing the codebase, several optimizations are already in place:
- Route-based code splitting with `React.lazy()`
- Lazy loading for below-the-fold sections and LeadFunnel modal
- Vite manual chunks configuration for vendor splitting
- Deferred Google Tag Manager loading (2s after page load)
- Critical font-face CSS inlined in `index.html`
- Non-blocking font loading strategy

However, the PageSpeed report indicates remaining issues with:
1. **Unused JavaScript** (~216 KB wasted, 59% of main bundle unused)
2. **Render-blocking resources** (~600ms from CSS and fonts)
3. **Largest Contentful Paint** (~5.4s estimated savings)

---

## Optimization Strategy

### Phase 1: Eliminate Dead Code and Unused CSS

**1.1 Remove Unused CSS File**
The file `src/App.css` contains legacy Vite template styles that are not used anywhere in the application (no import found). Removing it eliminates dead code.

**1.2 Tree-Shake Unused Radix UI Components**
The project installs 25+ Radix UI packages but the landing page only uses:
- `@radix-ui/react-slider` (DebtSlider)
- `@radix-ui/react-dialog` (potential modals)
- `@radix-ui/react-toast` (notifications)
- `@radix-ui/react-tooltip` (optional)
- `@radix-ui/react-checkbox` (funnel forms)
- `@radix-ui/react-radio-group` (funnel forms)
- `@radix-ui/react-progress` (FunnelProgress)
- `@radix-ui/react-label` (form labels)
- `@radix-ui/react-slot` (Button primitive)

Update the Vite chunk configuration to only include actively used Radix components.

**1.3 Remove Unused Dependencies from Bundle**
These packages are installed but not used on the landing page:
- `recharts` - Only included if using charts (not visible on landing)
- `react-day-picker` / `date-fns` - Calendar component not used
- `cmdk` - Command palette not used
- `react-resizable-panels` - Resizable panels not used

These will be tree-shaken if not imported, but verifying no accidental imports exist.

---

### Phase 2: Critical CSS Extraction

**2.1 Inline Critical Hero CSS**
Extract and inline the critical CSS needed for above-the-fold content (Header, Hero, TrustBadges) directly in `index.html`. This eliminates the 302ms render-blocking CSS request.

Key styles to inline:
- Hero gradient background
- Container/layout primitives
- Typography for hero headings
- Button styles for CTA
- Glass card effect

**2.2 Defer Non-Critical CSS**
Load the main CSS bundle asynchronously using the same pattern as fonts:
```html
<link rel="preload" as="style" href="[css-bundle]">
<link href="[css-bundle]" rel="stylesheet" media="print" onload="this.media='all'">
```

---

### Phase 3: Image Optimization

**3.1 Create Optimized WebP Logo**
Convert `TrueHorizon_Original.png` to WebP format with proper transparency. This provides ~60-80% size reduction while maintaining quality.

**3.2 Add Preload for LCP Image**
The logo in the Header is likely the LCP element. Add a preload hint:
```html
<link rel="preload" as="image" href="/assets/logo.webp" type="image/webp">
```

---

### Phase 4: Further JavaScript Optimization

**4.1 Preload Critical Chunks**
Add `modulepreload` hints for the Index page chunk to start loading immediately:
```html
<link rel="modulepreload" href="/assets/index-[hash].js">
```

**4.2 Optimize Lucide Icons Import**
Currently importing from `lucide-react` brings in tree-shakeable exports, but ensure only specific icons are imported (already done correctly in the codebase).

---

## Files to Modify

| File | Changes |
|------|---------|
| `index.html` | Add critical CSS inline, preload hints for LCP image, modulepreload for JS |
| `vite.config.ts` | Refine manualChunks to only include used Radix packages |
| `src/App.css` | Delete (unused legacy file) |
| `src/components/landing/Header.tsx` | Use WebP logo with `<picture>` fallback |
| `src/components/landing/Footer.tsx` | Use WebP logo with `<picture>` fallback |

## New Files

| File | Purpose |
|------|---------|
| `src/assets/TrueHorizon_Original.webp` | Optimized WebP version of the logo |

---

## Expected Impact

| Optimization | Estimated Improvement |
|-------------|----------------------|
| Remove unused App.css | -0.5 KB, cleaner build |
| Refine Radix chunks | Better cache efficiency |
| Inline critical CSS | -302 ms render-blocking |
| WebP logo conversion | -50-80% image size |
| Preload LCP image | Faster LCP timing |
| Modulepreload hints | Parallel JS loading |

**Target**: Improve mobile performance score from current level toward 80%+

---

## Technical Implementation Details

### Critical CSS to Inline

```css
/* Minimal critical styles for above-the-fold rendering */
:root {
  --primary: 217 91% 45%;
  --primary-foreground: 0 0% 100%;
  --accent: 16 85% 55%;
  --background: 210 33% 98%;
  --foreground: 222 47% 15%;
  --card: 0 0% 100%;
  --border: 214 32% 85%;
  --muted-foreground: 215 16% 47%;
  --success: 142 71% 45%;
  --hero-gradient-start: 217 91% 30%;
  --hero-gradient-end: 217 91% 50%;
}
body { margin: 0; font-family: 'Inter', system-ui, sans-serif; }
.hero-gradient { 
  background: linear-gradient(135deg, hsl(217 91% 30%) 0%, hsl(217 91% 50%) 100%); 
}
.container { max-width: 1400px; margin: 0 auto; padding: 0 2rem; }
```

### Updated Vite Config

```typescript
manualChunks: {
  'react-vendor': ['react', 'react-dom', 'react-router-dom'],
  'supabase': ['@supabase/supabase-js'],
  'query': ['@tanstack/react-query'],
  'radix-core': [
    '@radix-ui/react-slider',
    '@radix-ui/react-dialog',
    '@radix-ui/react-slot',
    '@radix-ui/react-label',
  ],
  'radix-form': [
    '@radix-ui/react-checkbox',
    '@radix-ui/react-radio-group',
    '@radix-ui/react-progress',
  ],
  'radix-feedback': [
    '@radix-ui/react-toast',
    '@radix-ui/react-tooltip',
  ],
}
```

### WebP Picture Element

```tsx
<picture>
  <source srcSet={logoWebP} type="image/webp" />
  <img src={logoPng} alt="True Horizon Financial" ... />
</picture>
```

---

## Verification Steps

After implementing these changes:

1. Run `npm run build` and check bundle sizes
2. Publish the changes
3. Re-run PageSpeed Insights on mobile
4. Verify:
   - Render-blocking resources reduced
   - Unused JavaScript decreased
   - LCP improved
   - No visual regressions
5. Test the lead funnel to ensure lazy loading works correctly

---

## Risks and Mitigations

| Risk | Mitigation |
|------|-----------|
| Flash of unstyled content from deferred CSS | Inline sufficient critical CSS for above-the-fold |
| Breaking changes from chunk reorganization | Test all interactive elements after build |
| WebP browser compatibility | Use `<picture>` with PNG fallback |

