import { useState, useCallback, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { AdminStats } from "@/components/admin/AdminStats";
import { AdminFilters } from "@/components/admin/AdminFilters";
import { LeadsTable } from "@/components/admin/LeadsTable";
import { formatPhone, formatDate } from "@/components/admin/utils";
import type { Lead, SortField, SortDir, StatusFilter } from "@/components/admin/types";

export default function Admin() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [sessionPw, setSessionPw] = useState("");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [retrying, setRetrying] = useState<string | null>(null);
  const [retryingAll, setRetryingAll] = useState(false);
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const { toast } = useToast();

  const fetchLeads = useCallback(async (pw: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("admin-leads", {
        method: "GET",
        headers: { "x-admin-password": pw },
      });
      if (error) throw error;
      if (data?.error === "Unauthorized") throw new Error("Invalid password");
      setLeads(data?.leads || []);
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to fetch leads", variant: "destructive" });
      if (err.message === "Invalid password") { setAuthenticated(false); setSessionPw(""); }
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const handleLogin = async () => {
    if (!password.trim()) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("admin-leads", {
        method: "GET",
        headers: { "x-admin-password": password },
      });
      if (error) throw error;
      if (data?.error === "Unauthorized") throw new Error("Invalid password");
      setAuthenticated(true);
      setSessionPw(password);
      setLeads(data?.leads || []);
      setPassword("");
    } catch {
      toast({ title: "Access Denied", description: "Invalid password.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleRetryCrm = async (leadId: string) => {
    setRetrying(leadId);
    try {
      const { data, error } = await supabase.functions.invoke("admin-leads", {
        method: "POST",
        headers: { "x-admin-password": sessionPw },
        body: { action: "retry-crm", leadId },
      });
      if (error) throw error;
      if (data?.success) {
        toast({ title: "Success", description: `Lead synced to CRM (ID: ${data.crmId})` });
        fetchLeads(sessionPw);
      } else {
        toast({ title: "CRM Sync Failed", description: data?.errors?.join(", ") || "Unknown error", variant: "destructive" });
        fetchLeads(sessionPw);
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to retry CRM sync", variant: "destructive" });
    } finally {
      setRetrying(null);
    }
  };

  const handleRetryAll = async () => {
    setRetryingAll(true);
    try {
      const { data, error } = await supabase.functions.invoke("admin-leads", {
        method: "POST",
        headers: { "x-admin-password": sessionPw },
        body: { action: "retry-all" },
      });
      if (error) throw error;
      toast({
        title: "Bulk Retry Complete",
        description: `${data.succeeded} synced, ${data.failed} failed out of ${(data.results || []).length} leads`,
      });
      fetchLeads(sessionPw);
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to retry all", variant: "destructive" });
    } finally {
      setRetryingAll(false);
    }
  };

  const handleMarkManuallyImported = useCallback(async (lead: Lead) => {
    const text = `${lead.name}\n${lead.email}\n${lead.phone}`;
    try {
      await navigator.clipboard.writeText(text);
      toast({ title: "Copied!", description: "Contact info copied to clipboard" });
    } catch {
      toast({ title: "Copy failed", description: "Could not access clipboard", variant: "destructive" });
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke("admin-leads", {
        method: "POST",
        headers: { "x-admin-password": sessionPw },
        body: { action: "mark-manually-imported", leadId: lead.id },
      });
      if (error) throw error;
      if (data?.success) {
        setLeads((prev) => prev.map((l) => l.id === lead.id ? { ...l, manually_imported: true, manually_imported_at: new Date().toISOString() } : l));
      }
    } catch (err: any) {
      toast({ title: "Error", description: "Failed to mark as imported", variant: "destructive" });
    }
  }, [sessionPw, toast]);

  const handleSaveNotes = useCallback(async (leadId: string, notes: string) => {
    try {
      const { data, error } = await supabase.functions.invoke("admin-leads", {
        method: "POST",
        headers: { "x-admin-password": sessionPw },
        body: { action: "update-notes", leadId, notes },
      });
      if (error) throw error;
      if (data?.success) {
        setLeads((prev) => prev.map((l) => l.id === leadId ? { ...l, notes } : l));
        toast({ title: "Notes saved" });
      }
    } catch (err: any) {
      toast({ title: "Error", description: "Failed to save notes", variant: "destructive" });
    }
  }, [sessionPw, toast]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir(field === "name" ? "asc" : "desc");
    }
  };

  const filteredAndSortedLeads = useMemo(() => {
    const filtered = leads.filter((lead) => {
      const matchesSearch = !search ||
        lead.name.toLowerCase().includes(search.toLowerCase()) ||
        lead.email.toLowerCase().includes(search.toLowerCase()) ||
        lead.phone.includes(search);
      const matchesStatus = statusFilter === "all" ||
        (statusFilter === "synced" && lead.crm_id !== null) ||
        (statusFilter === "failed" && lead.crm_id === null) ||
        (statusFilter === "manually_imported" && lead.manually_imported);
      return matchesSearch && matchesStatus;
    });

    return [...filtered].sort((a, b) => {
      let cmp = 0;
      if (sortField === "created_at") cmp = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      else if (sortField === "name") cmp = a.name.localeCompare(b.name);
      else if (sortField === "debt_amount") cmp = a.debt_amount - b.debt_amount;
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [leads, search, statusFilter, sortField, sortDir]);

  const stats = useMemo(() => ({
    total: leads.length,
    synced: leads.filter((l) => l.crm_id !== null).length,
    failed: leads.filter((l) => l.crm_id === null).length,
    manuallyImported: leads.filter((l) => l.manually_imported).length,
  }), [leads]);

  const exportCsv = () => {
    const headers = ["Date", "Name", "Email", "Phone", "Debt Amount", "Debt Types", "Employment", "Behind on Payments", "Timeline Goal", "SMS Opt-In", "CRM ID", "Status", "Notes"];
    const rows = filteredAndSortedLeads.map((l) => [
      formatDate(l.created_at), l.name, l.email, formatPhone(l.phone), l.debt_amount,
      (l.debt_types || []).join("; "), l.employment_status || "", l.behind_on_payments || "",
      l.timeline_goal || "", l.sms_opt_in ? "Yes" : "No", l.crm_id || "N/A",
      l.crm_id ? "Synced" : "Not Synced", l.notes || "",
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.map((v) => `"${v}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-export-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-sm">
          <CardHeader><CardTitle className="text-center">Admin Access</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="space-y-4">
              <Input type="password" placeholder="Enter admin password" value={password} onChange={(e) => setPassword(e.target.value)} autoFocus />
              <Button className="w-full" disabled={loading || !password.trim()}>{loading ? "Verifying..." : "Sign In"}</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold text-foreground">Lead Dashboard</h1>
          <div className="flex gap-2 flex-wrap">
            {stats.failed > 0 && (
              <Button variant="destructive" size="sm" onClick={handleRetryAll} disabled={retryingAll}>
                {retryingAll ? "Retrying All..." : `Retry All (${stats.failed})`}
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={exportCsv}>Export CSV</Button>
            <Button variant="outline" size="sm" onClick={() => fetchLeads(sessionPw)} disabled={loading}>
              {loading ? "Refreshing..." : "Refresh"}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => { setAuthenticated(false); setSessionPw(""); setLeads([]); }}>
              Logout
            </Button>
          </div>
        </div>

        <AdminStats total={stats.total} synced={stats.synced} failed={stats.failed} manuallyImported={stats.manuallyImported} />
        <AdminFilters search={search} onSearchChange={setSearch} statusFilter={statusFilter} onStatusFilterChange={setStatusFilter} />
        <LeadsTable
          leads={filteredAndSortedLeads}
          loading={loading}
          retrying={retrying}
          sortField={sortField}
          sortDir={sortDir}
          onSort={handleSort}
          onRetryCrm={handleRetryCrm}
          onSaveNotes={handleSaveNotes}
          onCopyContact={handleMarkManuallyImported}
        />
      </div>
    </div>
  );
}
