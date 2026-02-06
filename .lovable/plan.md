

# Admin Dashboard + CRM Fix Plan

## Two Problems to Solve

### Problem 1: CRM Sync is Broken
Every lead in the database has `crm_id: null` -- the CRM API is never receiving data. The root cause: `supabase/config.toml` is missing the edge function configuration. Without `verify_jwt = false`, the function rejects all unauthenticated requests (form submissions) before the code even runs.

The lead data IS being saved to the database (the edge function inserts it before calling the CRM), which means the function is executing. However, looking more closely, the fact that there are **zero edge function logs** suggests the function calls may be failing silently at the client level, and the leads are actually being inserted via a different path -- or the logging system isn't capturing them. Either way, the `config.toml` fix is essential.

### Problem 2: Admin Dashboard Needed
You need a simple, password-protected page for agents to view and manage leads without affecting PageSpeed scores.

---

## Implementation Plan

### Step 1: Fix the CRM Sync (config.toml)

Update `supabase/config.toml` to register the edge function with JWT verification disabled (since form submissions are unauthenticated):

```toml
project_id = "jxbjunvyoynbcenbmslo"

[functions.sync-to-crm]
verify_jwt = false
```

This single change should fix the CRM sync for all future submissions.

### Step 2: Create an Edge Function for Admin Access

Create a new edge function `admin-leads` that:
- Accepts a static password in the request header
- The password will be stored as a secret (`ADMIN_PASSWORD`) -- never hardcoded
- Fetches all leads from the database using the service role key
- Supports marking leads as "exported to CRM"
- Supports manually re-triggering CRM sync for failed leads

Endpoints:
- `GET` with password header -- returns all leads
- `POST` with `action: "retry-crm"` -- re-sends a specific lead to the CRM API
- `POST` with `action: "mark-exported"` -- updates a lead's status

### Step 3: Create the Admin Page (`/admin`)

A lazy-loaded page at `/admin` that:
- Shows a password prompt (stored in session only, never localStorage)
- Once authenticated, displays a table of all leads
- Columns: Date, Name, Email, Phone, Debt Amount, Debt Types, CRM Status, Actions
- CRM Status shows: synced (has `crm_id`), failed (no `crm_id`), or pending
- "Retry CRM Sync" button for failed leads
- "Export CSV" button for downloading leads
- Search/filter by name, email, date range
- Color coding: green for synced, red for failed

PageSpeed protection:
- The page is lazy-loaded (code-split), so none of its code is included in the main bundle
- No link to `/admin` from any public page (agents access it by typing the URL directly)
- The admin route uses `React.lazy()` just like other routes
- No additional CSS or assets loaded on the landing page

### Step 4: Add the ADMIN_PASSWORD Secret

You will be prompted to set a password that your agents will use to access the admin panel.

---

## Files to Create

| File | Purpose |
|------|---------|
| `src/pages/Admin.tsx` | Admin dashboard page with password gate, leads table, filters, CSV export |
| `supabase/functions/admin-leads/index.ts` | Backend function for secure lead retrieval and CRM retry |

## Files to Modify

| File | Changes |
|------|---------|
| `supabase/config.toml` | Add `sync-to-crm` and `admin-leads` function configs |
| `src/App.tsx` | Add lazy-loaded `/admin` route |

---

## Security Approach

- Static password verified server-side in the edge function (not client-side)
- Password stored as a backend secret, never in code
- Session-only storage (cleared when browser tab closes)
- No link to admin page from public site (no SEO or PageSpeed impact)
- Service role key used only in edge functions, never exposed to client
- Rate limiting on password attempts to prevent brute force

---

## Admin Dashboard Features

1. **Leads Table**: Sortable columns for all lead fields
2. **CRM Status Indicator**: Visual badge showing synced/failed/new
3. **Retry CRM Sync**: Button to re-push failed leads to the CRM
4. **CSV Export**: Download filtered leads as a spreadsheet
5. **Search and Filter**: By name, email, status, date range
6. **Lead Count Summary**: Total leads, synced count, failed count

