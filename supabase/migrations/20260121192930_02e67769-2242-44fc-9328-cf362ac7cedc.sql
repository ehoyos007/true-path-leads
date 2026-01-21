-- Drop the incorrectly configured restrictive policy
DROP POLICY IF EXISTS "Anyone can submit leads" ON public.leads;

-- Recreate as a PERMISSIVE policy (the default)
CREATE POLICY "Anyone can submit leads"
ON public.leads
FOR INSERT
TO public
WITH CHECK (true);