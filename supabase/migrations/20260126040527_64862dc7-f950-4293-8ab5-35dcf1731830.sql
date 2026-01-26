-- Fix the overly permissive insert policy - restrict to authenticated users inserting for themselves
DROP POLICY IF EXISTS "System can insert access logs" ON public.file_access_logs;

CREATE POLICY "Users can insert their own access logs"
ON public.file_access_logs FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);