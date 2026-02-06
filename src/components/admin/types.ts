export interface Lead {
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
  crm_error: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  notes: string | null;
  manually_imported: boolean;
  manually_imported_at: string | null;
}

export type SortField = "created_at" | "name" | "debt_amount";
export type SortDir = "asc" | "desc";
export type StatusFilter = "all" | "synced" | "failed" | "manually_imported";
