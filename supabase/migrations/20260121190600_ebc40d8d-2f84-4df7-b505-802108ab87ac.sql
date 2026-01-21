-- Add new columns for enhanced lead funnel
ALTER TABLE public.leads
ADD COLUMN employment_status text,
ADD COLUMN behind_on_payments text,
ADD COLUMN timeline_goal text;