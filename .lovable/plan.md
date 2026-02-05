

# Mobile Performance Optimization Plan

## Current State Analysis

After exploring the codebase, I identified several areas affecting the 69% mobile performance score:

### Key Issues Found

1. **Large Bundle Size**: All landing page components load synchronously on initial page load, including the LeadFunnel (modal) which is only shown when user clicks a button
2. **Heavy Dependencies**: The project includes libraries that aren't used on the main landing page (recharts, react-day-picker, cmdk, react-resizable-panels)
3. **No Route-Based Code Splitting**: PrivacyPolicy and NotFound pages are bundled with the main entry point
4. **Logo Images**: Still using PNG format instead of optimized WebP
5. **Above-the-fold Content**: Some optimizations can be made to prioritize critical rendering

---

## Optimization Strategy

### Phase 1: Code Splitting and Lazy Loading (High Impact)

**1.1 Lazy Load the LeadFunnel Modal**
The entire funnel (7 step components + form libraries) only loads when user clicks "Get Started". This should be lazy loaded.

```text
Before: LeadFunnel imported at top of Index.tsx
After:  const LeadFunnel = lazy(() => import("..."))
```

**1.2 Route-Based Code Splitting**
Split PrivacyPolicy and NotFound into separate chunks:

```text
Before: import PrivacyPolicy from "./pages/PrivacyPolicy"
After:  const PrivacyPolicy = lazy(() => import(...))
```

**1.3 Lazy Load Below-the-Fold Sections**
Components like Testimonials (uses embla-carousel), Services, and FinalCTA can be lazy loaded since they're below the fold.

### Phase 2: Image Optimization

**2.1 Convert Logo to WebP Format**
- Create optimized WebP versions of the logo
- Use `<picture>` element with WebP as primary and PNG as fallback
- Expected savings: ~74KB based on earlier audits

### Phase 3: Vite Build Optimization

**3.1 Configure Manual Chunks**
Split vendor libraries into separate cacheable chunks:

```text
manualChunks: {
  'react-vendor': ['react', 'react-dom', 'react-router-dom'],
  'radix': ['@radix-ui/react-slider', '@radix-ui/react-dialog', ...],
  'supabase': ['@supabase/supabase-js']
}
```

### Phase 4: Critical CSS and Resource Hints

**4.1 Preload Critical Assets**
Add preload hints for the hero section's most important assets:

```html
<link rel="preload" as="image" href="/logo.webp" />
```

**4.2 Defer Non-Critical JavaScript**
Ensure Google Tag Manager doesn't block the main thread (already async, but verify implementation).

---

## Implementation Details

### Files to Modify

| File | Changes |
|------|---------|
| `src/App.tsx` | Add lazy loading for routes with Suspense |
| `src/pages/Index.tsx` | Lazy load LeadFunnel and below-fold sections |
| `vite.config.ts` | Add build optimization with manual chunks |
| `src/components/landing/Header.tsx` | Use WebP logo with picture fallback |
| `src/components/landing/Footer.tsx` | Use WebP logo with picture fallback |

### New Files to Create

| File | Purpose |
|------|---------|
| `src/assets/TrueHorizonLogo.webp` | Optimized header logo |

---

## Expected Impact

| Optimization | Est. Improvement |
|-------------|------------------|
| Lazy load LeadFunnel | -50-80KB initial JS |
| Route code splitting | -10-20KB initial JS |
| Lazy load below-fold sections | -30-50KB initial JS |
| WebP logo conversion | -74KB transfer size |
| Vendor chunk splitting | Better caching |

**Target**: Improve mobile performance score from 69% to 80%+

---

## Technical Implementation

### 1. App.tsx - Route Code Splitting

```tsx
import { Suspense, lazy } from "react";

const Index = lazy(() => import("./pages/Index"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Wrap routes in Suspense with minimal fallback
<Suspense fallback={<div className="min-h-screen" />}>
  <Routes>...</Routes>
</Suspense>
```

### 2. Index.tsx - Lazy Load Modal and Sections

```tsx
import { lazy, Suspense } from "react";

// Critical above-fold components load immediately
import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import TrustBadges from "@/components/landing/TrustBadges";

// Below-fold sections lazy loaded
const DebtTypes = lazy(() => import("@/components/landing/DebtTypes"));
const HowItWorks = lazy(() => import("@/components/landing/HowItWorks"));
// ... etc

// Modal lazy loaded (only when user clicks CTA)
const LeadFunnel = lazy(() => import("@/components/landing/LeadFunnel"));
```

### 3. Vite Config - Build Optimization

```ts
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'react-vendor': ['react', 'react-dom', 'react-router-dom'],
        'ui-vendor': ['@radix-ui/react-slider', '@radix-ui/react-tooltip', ...]
      }
    }
  }
}
```

### 4. Logo Component with WebP

```tsx
<picture>
  <source srcSet={logoWebP} type="image/webp" />
  <img src={logoPng} alt="True Horizon Financial" ... />
</picture>
```

---

## Risks and Mitigations

| Risk | Mitigation |
|------|-----------|
| Flash of unstyled content | Use minimal skeleton/placeholder in Suspense fallback |
| Delayed modal loading | Preload LeadFunnel on hover/focus of CTA button |
| Browser compatibility | Picture element has excellent support, PNG fallback included |

---

## Verification Steps

After implementation:
1. Run Lighthouse audit on mobile
2. Verify all sections render correctly
3. Test LeadFunnel opens without noticeable delay
4. Confirm no visual regressions
5. Check bundle analyzer for chunk sizes

