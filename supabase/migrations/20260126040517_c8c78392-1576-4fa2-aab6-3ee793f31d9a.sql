-- Create file access logs table for monitoring
CREATE TABLE public.file_access_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  resource_id uuid REFERENCES public.resources(id) ON DELETE SET NULL,
  file_path text NOT NULL,
  access_type text NOT NULL DEFAULT 'view',
  ip_address text,
  user_agent text,
  referrer text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Create index for efficient querying
CREATE INDEX idx_file_access_logs_user_id ON public.file_access_logs(user_id);
CREATE INDEX idx_file_access_logs_created_at ON public.file_access_logs(created_at DESC);

-- Enable RLS (only admins can read logs)
ALTER TABLE public.file_access_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view access logs"
ON public.file_access_logs FOR SELECT
TO authenticated
USING (is_admin(auth.uid()));

CREATE POLICY "System can insert access logs"
ON public.file_access_logs FOR INSERT
TO authenticated
WITH CHECK (true);

-- Create rate limits table
CREATE TABLE public.rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  action_type text NOT NULL DEFAULT 'file_access',
  window_start timestamptz NOT NULL DEFAULT date_trunc('minute', now()),
  request_count integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, action_type, window_start)
);

-- Create index for rate limit lookups
CREATE INDEX idx_rate_limits_lookup ON public.rate_limits(user_id, action_type, window_start);

-- Enable RLS
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Users can only see/manage their own rate limits (edge function uses service role)
CREATE POLICY "Users can view own rate limits"
ON public.rate_limits FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Make resources storage bucket private
UPDATE storage.buckets SET public = false WHERE id = 'resources';

-- Drop existing public policy if exists
DROP POLICY IF EXISTS "Anyone can view resource files" ON storage.objects;
DROP POLICY IF EXISTS "Public Access" ON storage.objects;

-- Create policy for authenticated users only
CREATE POLICY "Authenticated users can view resource files"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'resources');