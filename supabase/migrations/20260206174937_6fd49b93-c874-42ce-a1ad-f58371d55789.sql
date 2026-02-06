
ALTER TABLE public.leads ADD COLUMN manually_imported boolean NOT NULL DEFAULT false;
ALTER TABLE public.leads ADD COLUMN manually_imported_at timestamptz;
