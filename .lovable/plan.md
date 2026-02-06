

# Manual CRM Import Tracking via Copy-to-Clipboard

## What This Does

Adds a "Copy Contact" button to each lead row that copies the Name, Email, and Phone to the clipboard in one click. Once all three fields are copied, the lead is marked as "Manually Imported" with a visual indicator and a timestamp. This lets agents track which leads they have already handled outside of the automatic CRM sync.

## How It Works

1. Agent clicks a "Copy" button on a lead row
2. Name, Email, and Phone are copied to clipboard as formatted text
3. The lead is flagged as `manually_imported = true` with a `manually_imported_at` timestamp in the database
4. A clipboard/checkmark icon and "Copied" badge appear on that row going forward
5. The stats bar and filters are updated to include a "Manually Imported" count and filter option

## Changes Required

### Database Migration
Add two columns to the `leads` table:
- `manually_imported` (boolean, default false) -- whether contact info was copied
- `manually_imported_at` (timestamptz, nullable) -- when it was copied

### Backend: `supabase/functions/admin-leads/index.ts`
Add a new action `mark-manually-imported` that sets both fields on a given lead.

### Frontend Changes

**`src/components/admin/types.ts`**
- Add `manually_imported` and `manually_imported_at` fields to the `Lead` interface
- Add `"manually_imported"` to the `StatusFilter` union type

**`src/components/admin/LeadsTable.tsx`**
- Add a "Copy" button in the Actions column that copies Name, Email, Phone to clipboard and calls the backend to mark the lead
- Show a checkmark icon or "Copied" badge on leads already marked

**`src/components/admin/AdminStats.tsx`**
- Add a 4th stat card showing count of manually imported leads

**`src/components/admin/AdminFilters.tsx`**
- Add a "Manually Imported" filter button

**`src/pages/Admin.tsx`**
- Add `handleMarkManuallyImported` function
- Update stats calculation to include manually imported count
- Update filter logic to handle the new filter value

## Clipboard Format

When copied, the text will look like:
```
John Smith
john@email.com
5551234567
```

This makes it easy to paste into any external CRM or spreadsheet.

## Visual Indicators

- Leads NOT yet copied: show a clipboard icon button labeled "Copy Contact"
- Leads already copied: show a green checkmark badge with "Copied" and the date/time
- The copy button remains available to re-copy, but the visual stays green

## Technical Details

| File | Change |
|------|--------|
| DB migration | Add `manually_imported` (bool) and `manually_imported_at` (timestamptz) columns |
| `supabase/functions/admin-leads/index.ts` | Add `mark-manually-imported` action handler |
| `src/components/admin/types.ts` | Extend `Lead` interface and `StatusFilter` type |
| `src/components/admin/LeadsTable.tsx` | Add copy button, visual indicator, pass handler |
| `src/components/admin/AdminStats.tsx` | Add 4th "Manually Imported" stat card |
| `src/components/admin/AdminFilters.tsx` | Add "Manually Imported" filter button |
| `src/pages/Admin.tsx` | Add handler, update stats/filter logic |
