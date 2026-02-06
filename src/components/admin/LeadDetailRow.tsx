import { useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { Lead } from "./types";

interface LeadDetailRowProps {
  lead: Lead;
  onSaveNotes: (leadId: string, notes: string) => Promise<void>;
}

export function LeadDetailRow({ lead, onSaveNotes }: LeadDetailRowProps) {
  const [notes, setNotes] = useState(lead.notes || "");
  const [saving, setSaving] = useState(false);
  const dirty = notes !== (lead.notes || "");

  const handleSave = async () => {
    setSaving(true);
    await onSaveNotes(lead.id, notes);
    setSaving(false);
  };

  return (
    <TableRow className="bg-muted/30 hover:bg-muted/40">
      <TableCell colSpan={8} className="py-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="space-y-2">
            <p><span className="font-medium text-muted-foreground">Debt Types:</span> {(lead.debt_types || []).join(", ") || "N/A"}</p>
            <p><span className="font-medium text-muted-foreground">Employment:</span> {lead.employment_status || "N/A"}</p>
            <p><span className="font-medium text-muted-foreground">Behind on Payments:</span> {lead.behind_on_payments || "N/A"}</p>
          </div>
          <div className="space-y-2">
            <p><span className="font-medium text-muted-foreground">Timeline Goal:</span> {lead.timeline_goal || "N/A"}</p>
            <p><span className="font-medium text-muted-foreground">SMS Opt-In:</span>{" "}
              <Badge variant={lead.sms_opt_in ? "default" : "secondary"} className="text-xs">
                {lead.sms_opt_in ? "Yes" : "No"}
              </Badge>
            </p>
            <p><span className="font-medium text-muted-foreground">Status:</span> {lead.status}</p>
          </div>
          <div className="space-y-2">
            <p className="font-medium text-muted-foreground">Notes:</p>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about this lead..."
              className="min-h-[60px] text-sm"
            />
            {dirty && (
              <Button size="sm" onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save Notes"}
              </Button>
            )}
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
}
