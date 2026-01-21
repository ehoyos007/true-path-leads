-- Improve RLS policies with explicit auth checks as fallback
-- This adds defense-in-depth by not relying solely on is_admin()

-- Drop existing policies to recreate with improved security
DROP POLICY IF EXISTS "Admins can view all leads" ON public.leads;
DROP POLICY IF EXISTS "Admins can update leads" ON public.leads;
DROP POLICY IF EXISTS "Admins can delete leads" ON public.leads;
DROP POLICY IF EXISTS "Admins can insert leads" ON public.leads;

-- Recreate policies with explicit auth.uid() checks alongside is_admin()
-- This ensures policies work even if is_admin() function has issues

CREATE POLICY "Admins can view all leads"
ON public.leads
FOR SELECT
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND public.is_admin()
);

CREATE POLICY "Admins can update leads"
ON public.leads
FOR UPDATE
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND public.is_admin()
)
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND public.is_admin()
);

CREATE POLICY "Admins can delete leads"
ON public.leads
FOR DELETE
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND public.is_admin()
);

-- For admin inserts (separate from public lead submission)
CREATE POLICY "Admins can insert leads"
ON public.leads
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND public.is_admin()
);

-- Improve user_roles policies similarly
DROP POLICY IF EXISTS "Only admins can manage roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;

CREATE POLICY "Only admins can manage roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND public.is_admin()
)
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND public.is_admin()
);

CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND (user_id = auth.uid() OR public.is_admin())
);