-- Fix 1: Remove email from profiles table (it's already in auth.users)
-- Create a view that excludes email for public access
ALTER TABLE public.profiles DROP COLUMN IF EXISTS email;

-- Fix 2: Restrict file_access_logs INSERT to only allow system/edge function inserts
-- Drop existing INSERT policy that allows any authenticated user
DROP POLICY IF EXISTS "Users can insert their own access logs" ON public.file_access_logs;

-- Create a more restrictive INSERT policy that only allows via service role
-- (Edge functions use service role, so they can still insert)
-- Note: This effectively disables direct client-side INSERT
CREATE POLICY "Only system can insert access logs"
  ON public.file_access_logs
  FOR INSERT
  WITH CHECK (false);

-- Fix 3: The resources_public is a VIEW (not a table), so we need to ensure 
-- it uses security_invoker to respect the base table's RLS
-- First, let's drop and recreate with security_invoker
DROP VIEW IF EXISTS public.resources_public;

CREATE VIEW public.resources_public
WITH (security_invoker = on) AS
  SELECT 
    id,
    course_id,
    chapter_id,
    resource_type,
    created_at,
    updated_at,
    file_path,
    title,
    description,
    url
  FROM public.resources;