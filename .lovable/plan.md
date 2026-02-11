

# n8n Webhook Integration for Lead Submissions

## Overview

Add an n8n webhook call to the existing `sync-to-crm` backend function so that every time a lead form is submitted, n8n receives a payload with lead details. This enables you to build automations in n8n (e.g., SMS notifications to agents, Slack alerts, follow-up sequences).

## Recommended Webhook Payload

Beyond the fields you requested (timestamp, name, email, phone), here are additional fields I recommend including to give your agents maximum context when reaching out via SMS:

| Field | Why Include It |
|---|---|
| `timestamp` | When the lead came in -- urgency/speed-to-lead |
| `name` | Who to address |
| `email` | Alternate contact method |
| `phone` | Primary contact for SMS |
| `debt_amount` | Lets agents tailor the conversation to the lead's situation |
| `debt_types` | "Credit Cards, Medical Bills" -- agents know what to discuss |
| `employment_status` | Qualification signal (employed vs. unemployed) |
| `behind_on_payments` | Urgency indicator -- behind leads need faster outreach |
| `timeline_goal` | What the lead wants (e.g., "debt-free in 2 years") |
| `sms_opt_in` | Compliance -- agents must confirm consent before texting |
| `lead_id` | Internal reference ID for CRM cross-referencing |
| `crm_synced` | Whether the CRM sync succeeded (agents know if CRM has the lead) |

## Implementation Steps

### Step 1: Store the n8n Webhook URL as a Secret

You will need to provide your n8n webhook URL (e.g., `https://your-instance.app.n8n.cloud/webhook/abc123`). This will be stored securely as `N8N_WEBHOOK_URL` so it is never exposed in client-side code.

### Step 2: Update the `sync-to-crm` Backend Function

After the lead is saved to the database and the CRM sync completes, add a new step that fires a POST request to the n8n webhook:

- The webhook call will be non-blocking ("fire and forget") so it does not slow down the form submission or cause failures if n8n is unreachable.
- Errors from the webhook call will be logged but will NOT fail the lead submission.
- The payload will use the sanitized data already prepared in the function.

The webhook call will be placed after both the database insert and CRM sync, so the payload can include `crm_synced` status.

### Step 3: Set Up the n8n Workflow

On the n8n side (you do this in your n8n dashboard):

1. Create a new workflow
2. Add a **Webhook** trigger node (choose "POST" method)
3. Copy the webhook URL it generates
4. Provide that URL to Lovable so it can be stored as a secret
5. Add downstream nodes (e.g., an SMS node to text agents with lead details)
6. Activate the workflow

### What Will NOT Change

- The lead form UI stays the same
- The database insert logic stays the same
- The CRM sync logic stays the same
- If the n8n webhook fails, leads still save and sync to CRM normally

## Technical Details

The webhook POST request added to the backend function will look like:

```text
POST {N8N_WEBHOOK_URL}
Content-Type: application/json

{
  "timestamp": "2026-02-11T15:30:00.000Z",
  "lead_id": "uuid-here",
  "name": "John Smith",
  "email": "john@email.com",
  "phone": "5551234567",
  "debt_amount": 25000,
  "debt_types": ["Credit Cards", "Medical Bills"],
  "employment_status": "Full-Time",
  "behind_on_payments": "Yes",
  "timeline_goal": "Debt-free in 2 years",
  "sms_opt_in": true,
  "crm_synced": true
}
```

The call will be wrapped in a try/catch so failures are logged but never block the response to the user.

