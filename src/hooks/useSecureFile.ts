import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface UseSecureFileOptions {
  filePath: string | null;
  resourceId?: string;
  autoRefresh?: boolean;
}

interface UseSecureFileResult {
  signedUrl: string | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  isAuthenticated: boolean;
}

export const useSecureFile = ({
  filePath,
  resourceId,
  autoRefresh = true,
}: UseSecureFileOptions): UseSecureFileResult => {
  const { user, loading: authLoading } = useAuth();
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<number | null>(null);

  const fetchSignedUrl = useCallback(async () => {
    if (!filePath || !user) {
      setSignedUrl(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;

      if (!token) {
        setError('Authentication required');
        setLoading(false);
        return;
      }

      const response = await supabase.functions.invoke('serve-file', {
        body: { filePath, resourceId },
      });

      if (response.error) {
        console.error('Serve file error:', response.error);
        setError(response.error.message || 'Failed to load file');
        setSignedUrl(null);
      } else if (response.data?.signedUrl) {
        setSignedUrl(response.data.signedUrl);
        // Set expiration time (with 10 second buffer)
        const expiresIn = response.data.expiresIn || 60;
        setExpiresAt(Date.now() + (expiresIn - 10) * 1000);
      } else {
        setError('Invalid response from server');
        setSignedUrl(null);
      }
    } catch (err) {
      console.error('Error fetching signed URL:', err);
      setError('Failed to load file');
      setSignedUrl(null);
    } finally {
      setLoading(false);
    }
  }, [filePath, resourceId, user]);

  // Initial fetch
  useEffect(() => {
    if (!authLoading) {
      fetchSignedUrl();
    }
  }, [fetchSignedUrl, authLoading]);

  // Auto-refresh before expiration
  useEffect(() => {
    if (!autoRefresh || !expiresAt || !signedUrl) return;

    const timeUntilRefresh = expiresAt - Date.now();
    if (timeUntilRefresh <= 0) {
      fetchSignedUrl();
      return;
    }

    const refreshTimer = setTimeout(() => {
      fetchSignedUrl();
    }, timeUntilRefresh);

    return () => clearTimeout(refreshTimer);
  }, [autoRefresh, expiresAt, signedUrl, fetchSignedUrl]);

  return {
    signedUrl,
    loading: loading || authLoading,
    error,
    refresh: fetchSignedUrl,
    isAuthenticated: !!user,
  };
};

// Helper to extract file path from Supabase storage URL
export const extractFilePathFromUrl = (url: string | null): string | null => {
  if (!url) return null;
  
  // Check if it's a Supabase storage URL
  if (url.includes('/storage/v1/object/public/resources/')) {
    const parts = url.split('/storage/v1/object/public/resources/');
    return parts[1] || null;
  }
  
  // Check for signed URLs
  if (url.includes('/storage/v1/object/sign/resources/')) {
    const parts = url.split('/storage/v1/object/sign/resources/');
    const pathWithToken = parts[1] || '';
    // Remove query params
    return pathWithToken.split('?')[0] || null;
  }
  
  return null;
};

// Check if URL is from Supabase storage
export const isSupabaseStorageUrl = (url: string | null): boolean => {
  if (!url) return false;
  return url.includes('/storage/v1/object/');
};
