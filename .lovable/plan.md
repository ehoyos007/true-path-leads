

# Fix PageSpeed Regression - Root Cause and Recovery Plan

## What Went Wrong

The PageSpeed score improved in some areas but **LCP got significantly worse** due to one critical mistake:

### The Problem: Bloated WebP Image (1,004 KiB!)

The AI-generated WebP file `TrueHorizon_Original.webp` is **over 1 MB** - this is catastrophically large for a logo that displays at only 179x70 pixels. This single image accounts for:

- **70% of total page weight** (1,004 KiB out of 1,432 KiB)
- **LCP increased to 7.3 seconds** (the image is the LCP element)
- **Element render delay: 2,300ms** just waiting for this image

The original PNG file was likely ~74 KB (based on earlier audit), so the WebP conversion made it **14x larger** instead of smaller.

---

## Current vs Previous Metrics

| Metric | Before Changes | After Changes | Change |
|--------|---------------|---------------|--------|
| Performance Score | Unknown | 67 | - |
| LCP | ~5.4s | 7.3s | Worse |
| FCP | - | 2.1s | - |
| CLS | - | 0 | Good |
| TBT | - | 80ms | Good |

---

## Recovery Plan

### Phase 1: Remove Bloated WebP Files (Immediate Fix)

**1.1 Delete the problematic WebP files**

Remove the AI-generated WebP files that are larger than the originals:
- `src/assets/TrueHorizon_Original.webp` (1 MB - delete)
- `src/assets/TrueHorizonLogoLight.webp` (unknown size - delete)

**1.2 Revert Header.tsx to use PNG only**

```tsx
// Before (broken)
import logoPng from "@/assets/TrueHorizon_Original.png";
import logoWebp from "@/assets/TrueHorizon_Original.webp";
...
<picture>
  <source srcSet={logoWebp} type="image/webp" />
  <img src={logoPng} ... />
</picture>

// After (fixed)
import logoPng from "@/assets/TrueHorizon_Original.png";
...
<img src={logoPng} ... />
```

**1.3 Revert Footer.tsx to use PNG only**

Same pattern - remove WebP import and `<picture>` element, use direct `<img>` with PNG.

---

### Phase 2: Properly Size the Logo Image

The PageSpeed report shows:
- **Current image dimensions**: 1632x640 pixels
- **Displayed dimensions**: 179x70 pixels  
- **Estimated savings**: 991.4 KiB

The logo image is 9x larger than needed. The fix is to create a properly sized version.

**2.1 Create a resized logo (manual step required)**

The user should resize `TrueHorizon_Original.png` to approximately:
- Width: 360px (2x display size for retina)
- Height: auto (maintain aspect ratio)
- Format: PNG with transparency (or properly compressed WebP)

This alone should reduce the image from ~74 KB to ~5-10 KB.

**2.2 Alternative: Use CSS to constrain and add responsive images**

If the user cannot resize the image, we can use `srcset` with the original image but add proper sizing hints:

```tsx
<img 
  src={logoPng} 
  alt="True Horizon Financial" 
  className="h-10 md:h-12 w-auto"
  width={111}
  height={40}
  fetchPriority="high"
  decoding="async"
/>
```

---

### Phase 3: Retain Good Optimizations

The following changes from the previous plan were beneficial and should be kept:

1. Vite chunk splitting (radix-core, radix-form, radix-feedback) - improves caching
2. Deferred Google Tag Manager (2s after load)
3. Inlined critical font-face CSS
4. Deleted unused `src/App.css`

---

## Files to Modify

| File | Action |
|------|--------|
| `src/assets/TrueHorizon_Original.webp` | Delete |
| `src/assets/TrueHorizonLogoLight.webp` | Delete |
| `src/components/landing/Header.tsx` | Remove WebP, use PNG only |
| `src/components/landing/Footer.tsx` | Remove WebP, use PNG only |

---

## Expected Impact After Fix

| Metric | Current | Expected After Fix |
|--------|---------|-------------------|
| Total Page Weight | 1,432 KiB | ~400 KiB |
| Logo Image Size | 1,004 KiB | ~74 KiB (original) |
| LCP | 7.3s | ~3-4s |
| Performance Score | 67 | 75-85+ |

---

## Future Recommendation (Manual Step)

For the best performance, the user should:

1. Use a tool like [Squoosh.app](https://squoosh.app) to:
   - Resize the logo to 360x~130px (2x retina)
   - Export as WebP with quality 80-85%
   - This should result in a ~5-15 KB file

2. Replace the original PNG with the optimized version
3. Re-implement the WebP with `<picture>` element

---

## Risks and Mitigations

| Risk | Mitigation |
|------|-----------|
| Removing WebP loses potential optimization | Using original PNG is still far better than 1MB WebP |
| Original PNG still larger than ideal | Works now, can optimize later with manual resize |
| Visual regression | Using same PNG as before the broken changes |

