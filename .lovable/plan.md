

# 5 Admin Dashboard Improvements

Based on the screenshot, here are five targeted improvements:

## 1. Expandable Row Details

Currently the "Types" column is truncated ("Credit Cards, P..."). Add an expandable row or a click-to-view detail panel that shows all lead fields including employment status, payment status, timeline goal, SMS opt-in, and notes -- without cluttering the table.

## 2. "Retry All" Bulk Action

With 13/13 leads not synced, clicking "Retry" one-by-one is tedious. Add a "Retry All Failed" button in the header area that batch-processes all unsynced leads, with a progress indicator showing how many succeeded/failed.

## 3. CRM Error Details on Failed Sync

The toast at the bottom shows "CRM Sync Failed - Duplicate lead" but disappears quickly. Display the last sync error persistently in the table row itself (e.g., a small red text under the "Not Synced" badge saying "Duplicate lead") so agents can see why each lead failed without retrying.

## 4. Sortable Columns

Add click-to-sort on Date, Name, and Debt Amount columns. Date should default to newest-first (already is), but agents should be able to sort by debt amount to prioritize high-value leads or sort alphabetically by name.

## 5. Lead Notes / Status Field

Add an inline editable "Notes" column or a slide-out panel where agents can add notes to individual leads (e.g., "Called back", "Wrong number", "Scheduled follow-up"). This would persist via the existing `notes` field in the database and help agents coordinate without external tools.

---

## Technical Summary

| Improvement | Files Modified |
|---|---|
| Expandable row details | `src/pages/Admin.tsx` |
| Retry All bulk action | `src/pages/Admin.tsx`, `supabase/functions/admin-leads/index.ts` |
| Persistent CRM error display | `src/pages/Admin.tsx`, DB migration (add `crm_error` column to leads) |
| Sortable columns | `src/pages/Admin.tsx` |
| Lead notes editing | `src/pages/Admin.tsx`, `supabase/functions/admin-leads/index.ts` |

All changes stay within the lazy-loaded Admin page, so zero PageSpeed impact on the public site.

