import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Allowed origins for CORS - restrict to known domains
const ALLOWED_ORIGINS = [
  "https://true-path-leads.lovable.app",
  "https://id-preview--55cc102a-7149-4f38-9a53-c0d5518a34ce.lovable.app",
  "https://thfinancial.org",
  "http://localhost:5173",
  "http://localhost:8080",
];

function isAllowedOrigin(origin: string): boolean {
  // Check exact matches
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  // Allow any *.lovableproject.com or *.lovable.app subdomain
  if (/^https:\/\/.*\.lovableproject\.com$/.test(origin)) return true;
  if (/^https:\/\/.*\.lovable\.app$/.test(origin)) return true;
  return false;
}

function getCorsHeaders(origin: string | null): Record<string, string> {
  const allowed = origin && isAllowedOrigin(origin);
  
  return {
    "Access-Control-Allow-Origin": allowed && origin ? origin : ALLOWED_ORIGINS[0],
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
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
  rate_limited: "Too many requests. Please try again in a minute.",
  db_error: "Unable to save your information. Please try again.",
};

// Rate limiting: in-memory store (resets on cold start, but provides basic protection)
const requestCounts = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string, maxRequests = 10, windowMs = 60000): boolean {
  const now = Date.now();
  const record = requestCounts.get(ip);
  
  // Clean old entries periodically
  if (requestCounts.size > 10000) {
    for (const [key, value] of requestCounts.entries()) {
      if (now > value.resetTime) {
        requestCounts.delete(key);
      }
    }
  }
  
  if (!record || now > record.resetTime) {
    requestCounts.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (record.count >= maxRequests) {
    return false;
  }
  
  record.count++;
  return true;
}

function getClientIP(req: Request): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 
         req.headers.get('cf-connecting-ip') || 
         req.headers.get('x-real-ip') ||
         'unknown';
}

interface LeadSubmission {
  name: string;
  email: string;
  phone: string;
  debtAmount: number;
  debtTypes: string[];
  employmentStatus: string;
  behindOnPayments: string;
  timelineGoal: string;
  smsOptIn?: boolean;
}

interface CrmResponseData {
  PrimeCrmId?: number;
  ZenithCrmId?: number;
  [key: string]: unknown;
}

interface CrmResponse {
  Data: CrmResponseData | null;
  Message: string;
  Errors: string[];
}

// Validation functions
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
}

function isValidName(name: string): boolean {
  const nameRegex = /^[a-zA-Z\s'-]+$/;
  return nameRegex.test(name) && name.length >= 2 && name.length <= 100;
}

function isValidDebtAmount(amount: number): boolean {
  return typeof amount === 'number' && amount >= 0 && amount <= 10000000;
}

function sanitizeString(str: string, maxLength: number = 100): string {
  return str.trim().slice(0, maxLength);
}

function validateRequest(body: LeadSubmission): { valid: boolean; error: string } {
  if (!body.name || !body.email || !body.phone) {
    return { valid: false, error: SAFE_ERRORS.missing_fields };
  }

  const trimmedName = body.name.trim();
  if (!isValidName(trimmedName)) {
    return { valid: false, error: SAFE_ERRORS.invalid_name };
  }

  if (!isValidEmail(body.email.trim())) {
    return { valid: false, error: SAFE_ERRORS.invalid_email };
  }

  const phoneDigits = body.phone.replace(/\D/g, "");
  if (phoneDigits.length !== 10) {
    return { valid: false, error: SAFE_ERRORS.invalid_phone };
  }

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

  // Only allow POST
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ success: false, error: "Method not allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    // Rate limiting by IP
    const clientIP = getClientIP(req);
    if (!checkRateLimit(clientIP)) {
      console.warn(`Rate limit exceeded for IP: ${clientIP}`);
      return new Response(
        JSON.stringify({ success: false, error: SAFE_ERRORS.rate_limited }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body: LeadSubmission = await req.json();
    console.log("Received lead submission from IP:", clientIP);

    // Comprehensive validation
    const validation = validateRequest(body);
    if (!validation.valid) {
      console.error("Validation failed:", validation.error);
      return new Response(
        JSON.stringify({ success: false, error: validation.error }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Initialize Supabase client with service role for database operations
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Sanitize all input fields
    const sanitizedName = sanitizeString(body.name.trim(), 100);
    const sanitizedEmail = sanitizeString(body.email.trim().toLowerCase(), 255);
    const sanitizedPhone = body.phone.replace(/\D/g, "").slice(0, 10);
    const sanitizedDebtTypes = (body.debtTypes || []).map(t => sanitizeString(String(t), 50)).slice(0, 10);
    const sanitizedEmployment = sanitizeString(body.employmentStatus || "", 50);
    const sanitizedPayments = sanitizeString(body.behindOnPayments || "", 50);
    const sanitizedTimeline = sanitizeString(body.timelineGoal || "", 100);
    const sanitizedDebtAmount = Math.min(Math.max(body.debtAmount || 0, 0), 10000000);

    // Step 1: Insert lead into database (using service role key)
    const { data: insertedLead, error: insertError } = await supabase
      .from("leads")
      .insert({
        name: sanitizedName,
        email: sanitizedEmail,
        phone: sanitizedPhone,
        debt_amount: sanitizedDebtAmount,
        debt_types: sanitizedDebtTypes,
        employment_status: sanitizedEmployment || null,
        behind_on_payments: sanitizedPayments || null,
        timeline_goal: sanitizedTimeline || null,
        sms_opt_in: body.smsOptIn === true,
      })
      .select('id')
      .single();

    if (insertError) {
      console.error("Failed to insert lead:", insertError.message);
      return new Response(
        JSON.stringify({ success: false, error: SAFE_ERRORS.db_error }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Lead inserted with ID:", insertedLead.id);

    // Step 2: Transform name for CRM (split on first space)
    const nameParts = sanitizedName.split(" ");
    const firstName = sanitizeString(nameParts[0] || "", 50);
    const lastName = nameParts.length > 1 ? sanitizeString(nameParts.slice(1).join(" "), 50) : "Unknown";

    // Step 3: Build CRM payload
    const crmPayload = {
      Token: Deno.env.get("CRM_API_TOKEN"),
      FirstName: firstName,
      LastName: lastName,
      PhoneNumber: sanitizedPhone,
      Email: sanitizedEmail,
      DebtAmount: sanitizedDebtAmount,
      AllowDuplicate: "N",
      Tags: [
        { Key: "Debt Types", Value: sanitizedDebtTypes.join(", ") },
        { Key: "Employment Status", Value: sanitizedEmployment },
        { Key: "Behind On Payments", Value: sanitizedPayments },
        { Key: "Timeline Goal", Value: sanitizedTimeline },
        { Key: "SMS Consent", Value: body.smsOptIn === true ? "Yes" : "No" },
      ],
    };

    console.log("Sending to CRM API:", {
      ...crmPayload,
      Token: "[REDACTED]",
    });

    // Step 4: Call CRM API
    const crmResponse = await fetch("https://api.globalholdings.app/api/LeadDataUpload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(crmPayload),
    });

    const crmData: CrmResponse = await crmResponse.json();
    console.log("CRM API response status:", crmResponse.status);
    console.log("CRM API full response:", JSON.stringify(crmData));

    if (!crmResponse.ok || crmData.Errors?.length > 0) {
      const errorMsg = crmData.Errors?.join(", ") || "Unknown CRM error";
      console.error("CRM API returned errors:", errorMsg);
      // Store the error on the lead
      await supabase
        .from("leads")
        .update({ crm_error: errorMsg })
        .eq("id", insertedLead.id);
      return new Response(
        JSON.stringify({ success: true, leadId: insertedLead.id, crmSynced: false }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Step 5: Update lead with CRM ID if successful
    // Try multiple response shapes for safety
    const crmId = crmData.Data?.PrimeCrmId ?? crmData.Data?.ZenithCrmId ?? (crmData as any).PrimeCrmId ?? (crmData as any).ZenithCrmId;
    console.log("Extracted crmId:", crmId, "from Data:", JSON.stringify(crmData.Data));
    
    if (crmId) {
      const { error: updateError } = await supabase
        .from("leads")
        .update({ crm_id: crmId })
        .eq("id", insertedLead.id);

      if (updateError) {
        console.error("Failed to update lead with CRM ID:", updateError.message);
      } else {
        console.log("Updated lead with CRM ID:", crmId);
      }
    } else {
      console.warn("CRM response successful but no PrimeCrmId found in response");
    }

    return new Response(
      JSON.stringify({ success: true, leadId: insertedLead.id, crmSynced: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in sync-to-crm:", error instanceof Error ? error.message : "Unknown error");
    
    return new Response(
      JSON.stringify({ success: false, error: SAFE_ERRORS.server_error }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
