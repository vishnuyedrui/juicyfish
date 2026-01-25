-- Update branches RLS policy to allow both admin and super_admin roles

DROP POLICY IF EXISTS "Admins can manage branches" ON public.branches;

CREATE POLICY "Admins can manage branches"
ON public.branches
FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));