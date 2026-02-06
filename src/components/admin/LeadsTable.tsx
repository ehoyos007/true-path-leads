import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { ChevronDown, ChevronUp, ChevronsUpDown, ClipboardCopy, CheckCircle2 } from "lucide-react";
import { LeadDetailRow } from "./LeadDetailRow";
import { formatPhone, formatDate, formatCurrency } from "./utils";
import type { Lead, SortField, SortDir } from "./types";

interface LeadsTableProps {
  leads: Lead[];
  loading: boolean;
  retrying: string | null;
  sortField: SortField;
  sortDir: SortDir;
  onSort: (field: SortField) => void;
  onRetryCrm: (leadId: string) => void;
  onSaveNotes: (leadId: string, notes: string) => Promise<void>;
  onCopyContact: (lead: Lead) => void;
}

function SortIcon({ field, activeField, dir }: { field: SortField; activeField: SortField; dir: SortDir }) {
  if (field !== activeField) return <ChevronsUpDown className="inline h-3.5 w-3.5 ml-1 opacity-40" />;
  return dir === "asc"
    ? <ChevronUp className="inline h-3.5 w-3.5 ml-1" />
    : <ChevronDown className="inline h-3.5 w-3.5 ml-1" />;
}

export function LeadsTable({ leads, loading, retrying, sortField, sortDir, onSort, onRetryCrm, onSaveNotes, onCopyContact }: LeadsTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer select-none" onClick={() => onSort("created_at")}>
                Date <SortIcon field="created_at" activeField={sortField} dir={sortDir} />
              </TableHead>
              <TableHead className="cursor-pointer select-none" onClick={() => onSort("name")}>
                Name <SortIcon field="name" activeField={sortField} dir={sortDir} />
              </TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead className="cursor-pointer select-none" onClick={() => onSort("debt_amount")}>
                Debt <SortIcon field="debt_amount" activeField={sortField} dir={sortDir} />
              </TableHead>
              <TableHead>Types</TableHead>
              <TableHead>CRM</TableHead>
              <TableHead>Import</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                  {loading ? "Loading..." : "No leads found"}
                </TableCell>
              </TableRow>
            ) : (
              leads.map((lead) => (
                <>
                  <TableRow
                    key={lead.id}
                    className="cursor-pointer"
                    onClick={() => setExpandedId(expandedId === lead.id ? null : lead.id)}
                  >
                    <TableCell className="whitespace-nowrap text-sm">{formatDate(lead.created_at)}</TableCell>
                    <TableCell className="font-medium">{lead.name}</TableCell>
                    <TableCell className="text-sm">{lead.email}</TableCell>
                    <TableCell className="text-sm whitespace-nowrap">{formatPhone(lead.phone)}</TableCell>
                    <TableCell className="font-medium">{formatCurrency(lead.debt_amount)}</TableCell>
                    <TableCell className="text-sm max-w-[150px] truncate">
                      {(lead.debt_types || []).join(", ")}
                    </TableCell>
                    <TableCell>
                      {lead.crm_id ? (
                        <Badge className="bg-primary hover:bg-primary/90 text-primary-foreground">
                          ID: {lead.crm_id}
                        </Badge>
                      ) : (
                        <div>
                          <Badge variant="destructive">Not Synced</Badge>
                          {lead.crm_error && (
                            <p className="text-xs text-destructive mt-1 max-w-[140px] truncate" title={lead.crm_error}>
                              {lead.crm_error}
                            </p>
                          )}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {lead.manually_imported ? (
                        <div className="flex items-center gap-1">
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                          <span className="text-xs text-primary">
                            {lead.manually_imported_at ? formatDate(lead.manually_imported_at) : "Copied"}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant={lead.manually_imported ? "ghost" : "outline"}
                          onClick={(e) => { e.stopPropagation(); onCopyContact(lead); }}
                          title="Copy Name, Email, Phone to clipboard"
                        >
                          <ClipboardCopy className="h-3.5 w-3.5 mr-1" />
                          {lead.manually_imported ? "Re-copy" : "Copy"}
                        </Button>
                        {!lead.crm_id && (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={retrying === lead.id}
                            onClick={(e) => { e.stopPropagation(); onRetryCrm(lead.id); }}
                          >
                            {retrying === lead.id ? "Syncing..." : "Retry"}
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                  {expandedId === lead.id && (
                    <LeadDetailRow key={`detail-${lead.id}`} lead={lead} onSaveNotes={onSaveNotes} />
                  )}
                </>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
