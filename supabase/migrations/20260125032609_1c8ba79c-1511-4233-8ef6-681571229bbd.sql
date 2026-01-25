-- Allow super admins to view all profiles for admin management
CREATE POLICY "Super admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  public.is_super_admin(auth.uid())
);