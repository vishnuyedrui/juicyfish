-- Allow both admin and super_admin to manage files in the 'resources' storage bucket
-- (previous policies used has_role(..., 'admin') which blocks super_admin users)

DROP POLICY IF EXISTS "Admins can upload resource files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update resource files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete resource files" ON storage.objects;

CREATE POLICY "Admins can upload resource files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'resources'
  AND public.is_admin(auth.uid())
);

CREATE POLICY "Admins can update resource files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'resources'
  AND public.is_admin(auth.uid())
)
WITH CHECK (
  bucket_id = 'resources'
  AND public.is_admin(auth.uid())
);

CREATE POLICY "Admins can delete resource files"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'resources'
  AND public.is_admin(auth.uid())
);
