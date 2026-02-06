import { useState, useCallback, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  debt_amount: number;
  debt_types: string[];
  employment_status: string | null;
  behind_on_payments: string | null;
  timeline_goal: string | null;
  sms_opt_in: boolean;
  crm_id: number | null;
  status: string;
  created_at: string;
  updated_at: string;
  notes: string | null;
}

function formatPhone(phone: string) {
  if (phone.length === 10) {
    return `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6)}`;
  }
  return phone;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function Admin() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [sessionPw, setSessionPw] = useState("");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "synced" | "failed">("all");
  const [retrying, setRetrying] = useState<string | null>(null);
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
      toast({
        title: "Error",
        description: err.message || "Failed to fetch leads",
        variant: "destructive",
      });
      if (err.message === "Invalid password") {
        setAuthenticated(false);
        setSessionPw("");
      }
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
      toast({
        title: "Access Denied",
        description: "Invalid password. Please try again.",
        variant: "destructive",
      });
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
        toast({
          title: "CRM Sync Failed",
          description: data?.errors?.join(", ") || data?.error || "Unknown error",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to retry CRM sync",
        variant: "destructive",
      });
    } finally {
      setRetrying(null);
    }
  };

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesSearch =
        !search ||
        lead.name.toLowerCase().includes(search.toLowerCase()) ||
        lead.email.toLowerCase().includes(search.toLowerCase()) ||
        lead.phone.includes(search);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "synced" && lead.crm_id !== null) ||
        (statusFilter === "failed" && lead.crm_id === null);

      return matchesSearch && matchesStatus;
    });
  }, [leads, search, statusFilter]);

  const stats = useMemo(() => ({
    total: leads.length,
    synced: leads.filter((l) => l.crm_id !== null).length,
    failed: leads.filter((l) => l.crm_id === null).length,
  }), [leads]);

  const exportCsv = () => {
    const headers = [
      "Date",
      "Name",
      "Email",
      "Phone",
      "Debt Amount",
      "Debt Types",
      "Employment",
      "Behind on Payments",
      "Timeline Goal",
      "SMS Opt-In",
      "CRM ID",
      "Status",
    ];
    const rows = filteredLeads.map((l) => [
      formatDate(l.created_at),
      l.name,
      l.email,
      formatPhone(l.phone),
      l.debt_amount,
      (l.debt_types || []).join("; "),
      l.employment_status || "",
      l.behind_on_payments || "",
      l.timeline_goal || "",
      l.sms_opt_in ? "Yes" : "No",
      l.crm_id || "N/A",
      l.crm_id ? "Synced" : "Not Synced",
    ]);

    const csv =
      [headers.join(","), ...rows.map((r) => r.map((v) => `"${v}"`).join(","))].join(
        "\n"
      );
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-export-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Login gate
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-center">Admin Access</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleLogin();
              }}
              className="space-y-4"
            >
              <Input
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
              />
              <Button className="w-full" disabled={loading || !password.trim()}>
                {loading ? "Verifying..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold text-foreground">Lead Dashboard</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={exportCsv}>
              Export CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchLeads(sessionPw)}
              disabled={loading}
            >
              {loading ? "Refreshing..." : "Refresh"}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setAuthenticated(false);
                setSessionPw("");
                setLeads([]);
              }}
            >
              Logout
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-foreground">{stats.total}</p>
              <p className="text-sm text-muted-foreground">Total Leads</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold" style={{ color: "hsl(142, 71%, 45%)" }}>{stats.synced}</p>
              <p className="text-sm text-muted-foreground">CRM Synced</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-destructive">{stats.failed}</p>
              <p className="text-sm text-muted-foreground">Not Synced</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            placeholder="Search by name, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="sm:max-w-xs"
          />
          <div className="flex gap-2">
            {(["all", "synced", "failed"] as const).map((s) => (
              <Button
                key={s}
                variant={statusFilter === s ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter(s)}
              >
                {s === "all" ? "All" : s === "synced" ? "Synced" : "Not Synced"}
              </Button>
            ))}
          </div>
        </div>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Debt</TableHead>
                  <TableHead>Types</TableHead>
                  <TableHead>CRM</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      {loading ? "Loading..." : "No leads found"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLeads.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell className="whitespace-nowrap text-sm">
                        {formatDate(lead.created_at)}
                      </TableCell>
                      <TableCell className="font-medium">{lead.name}</TableCell>
                      <TableCell className="text-sm">{lead.email}</TableCell>
                      <TableCell className="text-sm whitespace-nowrap">
                        {formatPhone(lead.phone)}
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(lead.debt_amount)}
                      </TableCell>
                      <TableCell className="text-sm max-w-[150px] truncate">
                        {(lead.debt_types || []).join(", ")}
                      </TableCell>
                      <TableCell>
                        {lead.crm_id ? (
                          <Badge className="bg-primary hover:bg-primary/90 text-primary-foreground">
                            ID: {lead.crm_id}
                          </Badge>
                        ) : (
                          <Badge variant="destructive">Not Synced</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {!lead.crm_id && (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={retrying === lead.id}
                            onClick={() => handleRetryCrm(lead.id)}
                          >
                            {retrying === lead.id ? "Syncing..." : "Retry"}
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
