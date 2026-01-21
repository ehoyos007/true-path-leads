-- Remove the public insert policy since all leads now go through the edge function
-- which handles rate limiting, validation, and uses service role key for insertion
DROP POLICY IF EXISTS "Anyone can submit leads" ON public.leads;