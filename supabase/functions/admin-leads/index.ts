import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-admin-password",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function verifyPassword(req: Request): boolean {
  const pw = req.headers.get("x-admin-password");
  const expected = Deno.env.get("ADMIN_PASSWORD");
  if (!pw || !expected) return false;
  // Constant-time-ish comparison
  if (pw.length !== expected.length) return false;
  let result = 0;
  for (let i = 0; i < pw.length; i++) {
    result |= pw.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return result === 0;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (!verifyPassword(req)) {
    return jsonResponse({ error: "Unauthorized" }, 401);
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // GET: Fetch all leads
  if (req.method === "GET") {
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching leads:", error.message);
      return jsonResponse({ error: "Failed to fetch leads" }, 500);
    }
    return jsonResponse({ leads: data });
  }

  // POST: Actions
  if (req.method === "POST") {
    const body = await req.json();
    const { action, leadId } = body;

    if (action === "retry-crm") {
      if (!leadId) return jsonResponse({ error: "leadId required" }, 400);

      // Fetch lead
      const { data: lead, error: fetchErr } = await supabase
        .from("leads")
        .select("*")
        .eq("id", leadId)
        .single();

      if (fetchErr || !lead) {
        return jsonResponse({ error: "Lead not found" }, 404);
      }

      // Split name
      const nameParts = lead.name.split(" ");
      const firstName = nameParts[0] || "";
      const lastName =
        nameParts.length > 1 ? nameParts.slice(1).join(" ") : "Unknown";

      const crmPayload = {
        Token: Deno.env.get("CRM_API_TOKEN"),
        FirstName: firstName,
        LastName: lastName,
        PhoneNumber: lead.phone,
        Email: lead.email,
        DebtAmount: lead.debt_amount,
        AllowDuplicate: "N",
        Tags: [
          {
            Key: "Debt Types",
            Value: (lead.debt_types || []).join(", "),
          },
          {
            Key: "Employment Status",
            Value: lead.employment_status || "",
          },
          {
            Key: "Behind On Payments",
            Value: lead.behind_on_payments || "",
          },
          { Key: "Timeline Goal", Value: lead.timeline_goal || "" },
          {
            Key: "SMS Consent",
            Value: lead.sms_opt_in ? "Yes" : "No",
          },
        ],
      };

      console.log("Retrying CRM sync for lead:", leadId);

      try {
        const crmRes = await fetch(
          "https://api.globalholdings.app/api/LeadDataUpload",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(crmPayload),
          }
        );

        const crmData = await crmRes.json();
        console.log("CRM response:", crmRes.status, crmData.Message);

        if (!crmRes.ok || crmData.Errors?.length > 0) {
          console.error("CRM errors:", crmData.Errors);
          return jsonResponse({
            success: false,
            errors: crmData.Errors || ["CRM returned an error"],
          });
        }

        if (crmData.Data?.PrimeCrmId) {
          await supabase
            .from("leads")
            .update({ crm_id: crmData.Data.PrimeCrmId })
            .eq("id", leadId);

          console.log("Lead synced with CRM ID:", crmData.Data.PrimeCrmId);
        }

        return jsonResponse({
          success: true,
          crmId: crmData.Data?.PrimeCrmId,
        });
      } catch (err) {
        console.error("CRM fetch error:", err);
        return jsonResponse({ success: false, error: "CRM API unreachable" }, 502);
      }
    }

    return jsonResponse({ error: "Unknown action" }, 400);
  }

  return jsonResponse({ error: "Method not allowed" }, 405);
});
