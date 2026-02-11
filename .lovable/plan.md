

# Terms and Conditions Page

## Overview

Create a new `/terms` page for True Horizon Financial LLC that matches the style and layout of the existing Privacy Policy page. The page will be linked from the footer (which already has a "Terms of Service" link pointing to `/terms`).

## What the Page Will Include

1. **Introduction** -- Defines the agreement, the company (True Horizon Financial LLC, Miami, FL), and that using the site constitutes acceptance of terms.

2. **Eligibility** -- Users must be 18 years or older to use the service.

3. **Description of Services** -- Consultative/referral service only. Explicitly states the company is NOT a lender, broker, debt settlement company, law firm, or credit repair organization. Matches the disclaimer language already used on the site.

4. **No Guarantees Disclaimer** -- Results such as debt reduction, savings, or approval are not guaranteed. Outcomes depend on individual circumstances, creditor participation, and third-party providers.

5. **TCPA / SMS Consent Disclosure** -- By submitting the form and opting in to SMS, users consent to receive calls and text messages from True Horizon Financial LLC at the phone number provided. Includes standard TCPA language: message frequency varies, message and data rates may apply, reply STOP to opt out.

6. **User Responsibilities** -- Users agree to provide accurate information and understand data will be shared with third-party service providers.

7. **Third-Party Services** -- The company refers users to independent licensed providers and is not responsible for their services, terms, or outcomes.

8. **Limitation of Liability** -- Standard limitation of liability clause.

9. **Arbitration Clause** -- All disputes will be resolved through binding individual arbitration rather than in court. Users waive the right to participate in class actions.

10. **Changes to Terms** -- The company reserves the right to modify the terms at any time.

11. **Contact Information** -- Same contact details as the Privacy Policy (notifications@thfinancial.org, Miami, FL).

## Technical Implementation

### New file: `src/pages/TermsOfService.tsx`
- Follows the exact same layout pattern as `src/pages/PrivacyPolicy.tsx` (Header, main content, Footer)
- Same styling: container, max-w-4xl, section headings, spaced paragraphs
- Effective date: February 11, 2026

### Updated file: `src/App.tsx`
- Add a lazy-loaded route for `/terms` pointing to the new `TermsOfService` page

### No other changes needed
- The Footer already has a link to `/terms` -- it will start working automatically once the route exists
- No form changes since you chose "just link in footer"

