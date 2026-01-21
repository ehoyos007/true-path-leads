import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
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

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: SyncRequest = await req.json();
    console.log("Received sync request for lead:", body.leadId);

    // Validate required fields
    if (!body.leadId || !body.name || !body.email || !body.phone) {
      console.error("Missing required fields");
      return new Response(
        JSON.stringify({ success: false, errors: ["Missing required fields"] }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Transform name: split on first space
    const nameParts = body.name.trim().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "Unknown";

    // Transform phone: strip all non-numeric characters
    const phoneNumber = body.phone.replace(/\D/g, "");
    
    if (phoneNumber.length !== 10) {
      console.error("Phone number must be exactly 10 digits, got:", phoneNumber.length);
      return new Response(
        JSON.stringify({ success: false, errors: ["Phone number must be exactly 10 digits"] }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build CRM payload
    const crmPayload = {
      Token: Deno.env.get("CRM_API_TOKEN"),
      FirstName: firstName,
      LastName: lastName,
      PhoneNumber: phoneNumber,
      Email: body.email,
      DebtAmount: body.debtAmount,
      AllowDuplicate: "N",
      Tags: [
        { Key: "Debt Types", Value: body.debtTypes.join(", ") },
        { Key: "Employment Status", Value: body.employmentStatus || "" },
        { Key: "Behind On Payments", Value: body.behindOnPayments || "" },
        { Key: "Timeline Goal", Value: body.timelineGoal || "" },
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
    console.log("CRM API response:", crmData);

    if (!crmResponse.ok || crmData.Errors?.length > 0) {
      console.error("CRM API returned errors:", crmData.Errors);
      return new Response(
        JSON.stringify({ success: false, errors: crmData.Errors }),
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
        console.error("Failed to update lead with CRM ID:", updateError);
      } else {
        console.log("Updated lead with CRM ID:", crmData.Data.PrimeCrmId);
      }
    }

    return new Response(
      JSON.stringify({ success: true, crmId: crmData.Data?.PrimeCrmId }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in sync-to-crm:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ success: false, errors: [errorMessage] }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
