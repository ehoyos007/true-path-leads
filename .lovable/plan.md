

# Add SMS Opt-In Consent Checkbox to Lead Form

## Current State

The lead capture form (`ContactStep.tsx`) does **not** have an SMS opt-in consent checkbox. The form only collects:
- Full Name
- Email
- Phone

No TCPA-compliant SMS consent language is present.

## Changes Required

### 1. Update Contact Form Component

**File:** `src/components/landing/funnel/ContactStep.tsx`

Add the following:

- Import the Checkbox component and Link from react-router-dom
- Add `smsOptIn` field to the Zod schema (boolean, required, must be true)
- Add a checkbox field below the phone number input with the consent language
- Make "Privacy Policy" a link to `/privacy`
- Style the checkbox and label with smaller, muted text

**Consent Language:**
> "I agree to receive text messages from True Horizon Financial LLC regarding my financial consultation. Message frequency varies. Message and data rates may apply. Reply STOP to opt out at any time. View our Privacy Policy."

### 2. Update Data Flow

**File:** `src/components/landing/LeadFunnel.tsx`

- Add `smsOptIn: true` to the form submission payload sent to the backend function

### 3. Update Backend Function

**File:** `supabase/functions/sync-to-crm/index.ts`

- Add `smsOptIn` to the `LeadSubmission` interface
- Include `sms_opt_in` in the database insert
- Add an "SMS Consent" tag to the CRM payload for tracking

### 4. Add Database Column

Create a migration to add the `sms_opt_in` column to the `leads` table:

```sql
ALTER TABLE public.leads 
ADD COLUMN sms_opt_in boolean NOT NULL DEFAULT false;
```

## Technical Details

| Component | Change |
|-----------|--------|
| `ContactStep.tsx` | Add checkbox field with Zod validation, consent text, and Privacy Policy link |
| `LeadFunnel.tsx` | Pass `smsOptIn: true` in API call body |
| `sync-to-crm/index.ts` | Accept and store `sms_opt_in`, send to CRM as tag |
| Database | Add `sms_opt_in` boolean column |

## Compliance Checklist

The consent language meets TCPA requirements by clearly stating:

| Requirement | Addressed |
|-------------|-----------|
| Who is sending messages | True Horizon Financial LLC |
| What messages are about | Financial consultation |
| Data rates may apply | Yes |
| How to opt out | Reply STOP |
| Link to Privacy Policy | Yes (/privacy) |
| Required before submission | Yes (checkbox must be checked) |

## Visual Design

- Checkbox and label will use `text-xs` (12px) font size
- Text color will be `text-muted-foreground` for subtle appearance
- Checkbox will use standard primary color when checked
- Privacy Policy link will be styled as an underlined link
- Positioned directly below the Phone field

