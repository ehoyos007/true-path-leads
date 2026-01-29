
# Fix CORS Configuration for Custom Domain

## Problem Identified
The lead form submission is being blocked because your custom domain `https://thfinancial.org` is not in the allowed origins list of the `sync-to-crm` backend function. The browser's CORS security policy prevents the request from completing.

## Solution
Add your custom domain to the allowed origins list in the backend function.

## Changes Required

### 1. Update Backend Function
**File:** `supabase/functions/sync-to-crm/index.ts`

Add `https://thfinancial.org` to the `ALLOWED_ORIGINS` array:

```javascript
const ALLOWED_ORIGINS = [
  "https://true-path-leads.lovable.app",
  "https://id-preview--55cc102a-7149-4f38-9a53-c0d5518a34ce.lovable.app",
  "https://thfinancial.org",  // <-- Add this line
  "http://localhost:5173",
  "http://localhost:8080",
];
```

### 2. Update CORS Headers
Also update the `Access-Control-Allow-Headers` to include all headers that may be sent by the client:

```javascript
"Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
```

---

## Technical Details

| Item | Details |
|------|---------|
| Root Cause | Custom domain `thfinancial.org` missing from CORS whitelist |
| File to Edit | `supabase/functions/sync-to-crm/index.ts` |
| Lines Affected | 4-9 (ALLOWED_ORIGINS array), 17 (headers) |
| Deployment | Automatic after code update |

## Post-Fix Verification
After the fix is deployed, test the lead form end-to-end from `https://thfinancial.org` to confirm submissions work correctly.
