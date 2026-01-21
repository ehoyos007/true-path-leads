import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Allowed origins for CORS - restrict to known domains
const ALLOWED_ORIGINS = [
  "https://true-path-leads.lovable.app",
  "https://id-preview--55cc102a-7149-4f38-9a53-c0d5518a34ce.lovable.app",
  "http://localhost:5173",
  "http://localhost:8080",
];

function getCorsHeaders(origin: string | null): Record<string, string> {
  const isAllowed = origin && ALLOWED_ORIGINS.some(allowed => origin.startsWith(allowed.replace(/\/$/, '')));
  
  return {
    "Access-Control-Allow-Origin": isAllowed && origin ? origin : ALLOWED_ORIGINS[0],
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
}

// Safe error messages that don't expose internal details
const SAFE_ERRORS = {
  missing_fields: "Please provide all required information.",
  invalid_phone: "Please provide a valid 10-digit phone number.",
  invalid_email: "Please provide a valid email address.",
  invalid_name: "Please provide a valid name.",
  invalid_debt: "Please provide a valid debt amount.",
  invalid_lead: "Unable to process your request.",
  crm_error: "We are experiencing technical difficulties. Please try again later.",
  server_error: "An error occurred. Please try again or contact support.",
};

interface SyncRequest {
  leadId: string;
  name: string;
  email: string;
  phone: string;
  debtAmount: number;
  debtTypes: string[];
  employmentStatus: string;
  behindOnPayments: string;
  timelineGoal: string;
}

interface CrmResponse {
  Data: { PrimeCrmId: number } | null;
  Message: string;
  Errors: string[];
}

// Validation functions
function isValidUUID(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
}

function isValidName(name: string): boolean {
  // Allow letters, spaces, hyphens, apostrophes
  const nameRegex = /^[a-zA-Z\s'-]+$/;
  return nameRegex.test(name) && name.length >= 2 && name.length <= 100;
}

function isValidDebtAmount(amount: number): boolean {
  return typeof amount === 'number' && amount >= 0 && amount <= 10000000;
}

function sanitizeString(str: string, maxLength: number = 100): string {
  return str.trim().slice(0, maxLength);
}

function validateRequest(body: SyncRequest): { valid: boolean; error: string } {
  // Check required fields exist
  if (!body.leadId || !body.name || !body.email || !body.phone) {
    return { valid: false, error: SAFE_ERRORS.missing_fields };
  }

  // Validate leadId format
  if (!isValidUUID(body.leadId)) {
    return { valid: false, error: SAFE_ERRORS.invalid_lead };
  }

  // Validate name
  const trimmedName = body.name.trim();
  if (!isValidName(trimmedName)) {
    return { valid: false, error: SAFE_ERRORS.invalid_name };
  }

  // Validate email
  if (!isValidEmail(body.email.trim())) {
    return { valid: false, error: SAFE_ERRORS.invalid_email };
  }

  // Validate phone (after stripping non-digits)
  const phoneDigits = body.phone.replace(/\D/g, "");
  if (phoneDigits.length !== 10) {
    return { valid: false, error: SAFE_ERRORS.invalid_phone };
  }

  // Validate debt amount
  if (!isValidDebtAmount(body.debtAmount)) {
    return { valid: false, error: SAFE_ERRORS.invalid_debt };
  }

  return { valid: true, error: "" };
}

Deno.serve(async (req) => {
  const origin = req.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: SyncRequest = await req.json();
    console.log("Received sync request for lead:", body.leadId);

    // Comprehensive validation
    const validation = validateRequest(body);
    if (!validation.valid) {
      console.error("Validation failed for lead:", body.leadId);
      return new Response(
        JSON.stringify({ success: false, error: validation.error }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Transform and sanitize name: split on first space
    const sanitizedName = sanitizeString(body.name.trim(), 100);
    const nameParts = sanitizedName.split(" ");
    const firstName = sanitizeString(nameParts[0] || "", 50);
    const lastName = nameParts.length > 1 ? sanitizeString(nameParts.slice(1).join(" "), 50) : "Unknown";

    // Transform phone: strip all non-numeric characters
    const phoneNumber = body.phone.replace(/\D/g, "").slice(0, 10);

    // Sanitize other fields
    const sanitizedEmail = sanitizeString(body.email.trim(), 255);
    const sanitizedDebtTypes = (body.debtTypes || []).map(t => sanitizeString(String(t), 50)).slice(0, 10);
    const sanitizedEmployment = sanitizeString(body.employmentStatus || "", 50);
    const sanitizedPayments = sanitizeString(body.behindOnPayments || "", 50);
    const sanitizedTimeline = sanitizeString(body.timelineGoal || "", 100);

    // Build CRM payload
    const crmPayload = {
      Token: Deno.env.get("CRM_API_TOKEN"),
      FirstName: firstName,
      LastName: lastName,
      PhoneNumber: phoneNumber,
      Email: sanitizedEmail,
      DebtAmount: Math.min(Math.max(body.debtAmount, 0), 10000000),
      AllowDuplicate: "N",
      Tags: [
        { Key: "Debt Types", Value: sanitizedDebtTypes.join(", ") },
        { Key: "Employment Status", Value: sanitizedEmployment },
        { Key: "Behind On Payments", Value: sanitizedPayments },
        { Key: "Timeline Goal", Value: sanitizedTimeline },
      ],
    };

    console.log("Sending to CRM API:", {
      ...crmPayload,
      Token: "[REDACTED]",
    });

    // Call CRM API
    const crmResponse = await fetch("https://api.globalholdings.app/api/LeadDataUpload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(crmPayload),
    });

    const crmData: CrmResponse = await crmResponse.json();
    console.log("CRM API response status:", crmResponse.status, "Message:", crmData.Message);

    if (!crmResponse.ok || crmData.Errors?.length > 0) {
      // Log detailed error server-side, return generic message to client
      console.error("CRM API returned errors:", crmData.Errors);
      return new Response(
        JSON.stringify({ success: false, error: SAFE_ERRORS.crm_error }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Update lead with CRM ID if successful
    if (crmData.Data?.PrimeCrmId) {
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const supabase = createClient(supabaseUrl, supabaseServiceKey);

      const { error: updateError } = await supabase
        .from("leads")
        .update({ crm_id: crmData.Data.PrimeCrmId })
        .eq("id", body.leadId);

      if (updateError) {
        // Log error but don't expose to client
        console.error("Failed to update lead with CRM ID:", updateError.message);
      } else {
        console.log("Updated lead with CRM ID:", crmData.Data.PrimeCrmId);
      }
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    // Log full error server-side
    console.error("Error in sync-to-crm:", error instanceof Error ? error.message : "Unknown error");
    
    // Return generic error to client
    return new Response(
      JSON.stringify({ success: false, error: SAFE_ERRORS.server_error }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
