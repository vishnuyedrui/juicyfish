import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Announcement {
  id: string;
  title: string;
  description: string | null;
  link_url: string;
  link_label: string;
  link_type: string;
  is_active: boolean;
  semester_id: string | null;
  branch_id: string | null;
  created_at: string;
}

export const useAnnouncements = (semesterId?: string | null, branchId?: string | null) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      // Fetch all active announcements
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching announcements:', error);
        setAnnouncements([]);
      } else {
        // Filter announcements based on semester/branch
        // Show announcements that match the user's semester/branch OR are global (null values)
        const filtered = (data || []).filter((ann) => {
          const semesterMatch = !ann.semester_id || ann.semester_id === semesterId;
          const branchMatch = !ann.branch_id || ann.branch_id === branchId;
          return semesterMatch && branchMatch;
        });
        setAnnouncements(filtered);
      }
      setLoading(false);
    };

    fetchAnnouncements();
  }, [semesterId, branchId]);

  return { announcements, loading };
};
