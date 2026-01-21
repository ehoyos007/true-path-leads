-- Add CRM reference ID column to leads table
ALTER TABLE public.leads
ADD COLUMN crm_id integer;