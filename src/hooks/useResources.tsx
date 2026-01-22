import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Branch {
  id: string;
  name: string;
  code: string;
}

interface Semester {
  id: string;
  number: number;
  name: string;
}

interface Course {
  id: string;
  name: string;
  code: string;
  semester_id: string;
  branch_id: string;
}

interface Chapter {
  id: string;
  course_id: string;
  chapter_number: number;
  title: string;
}

interface Resource {
  id: string;
  course_id: string;
  chapter_id: string | null;
  resource_type: 'youtube_video' | 'drive_link' | 'previous_paper' | 'syllabus' | 'notes' | 'document' | 'image';
  title: string;
  description: string | null;
  url: string | null;
  file_path: string | null;
  created_at: string;
}

export const useBranches = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBranches = async () => {
      const { data, error } = await supabase
        .from('branches')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching branches:', error);
      } else {
        setBranches(data || []);
      }
      setLoading(false);
    };

    fetchBranches();
  }, []);

  return { branches, loading };
};

export const useSemesters = () => {
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSemesters = async () => {
      const { data, error } = await supabase
        .from('semesters')
        .select('*')
        .order('number');

      if (error) {
        console.error('Error fetching semesters:', error);
      } else {
        setSemesters(data || []);
      }
      setLoading(false);
    };

    fetchSemesters();
  }, []);

  return { semesters, loading };
};

export const useCourses = (semesterId?: string, branchId?: string) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      let query = supabase.from('courses').select('*');

      if (semesterId) {
        query = query.eq('semester_id', semesterId);
      }
      if (branchId) {
        query = query.eq('branch_id', branchId);
      }

      const { data, error } = await query.order('name');

      if (error) {
        console.error('Error fetching courses:', error);
      } else {
        setCourses(data || []);
      }
      setLoading(false);
    };

    fetchCourses();
  }, [semesterId, branchId]);

  return { courses, loading, setCourses };
};

export const useChapters = (courseId?: string) => {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChapters = async () => {
      if (!courseId) {
        setChapters([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('chapters')
        .select('*')
        .eq('course_id', courseId)
        .order('chapter_number');

      if (error) {
        console.error('Error fetching chapters:', error);
      } else {
        setChapters(data || []);
      }
      setLoading(false);
    };

    fetchChapters();
  }, [courseId]);

  return { chapters, loading, setChapters };
};

export const useResources = (courseId?: string, chapterId?: string, resourceType?: string) => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      if (!courseId) {
        setResources([]);
        setLoading(false);
        return;
      }

      let query = supabase
        .from('resources')
        .select('*')
        .eq('course_id', courseId);

      if (chapterId) {
        query = query.eq('chapter_id', chapterId);
      }

      if (resourceType) {
        query = query.eq('resource_type', resourceType as any);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching resources:', error);
      } else {
        setResources(data || []);
      }
      setLoading(false);
    };

    fetchResources();
  }, [courseId, chapterId, resourceType]);

  return { resources, loading, setResources };
};

export const useUserProfile = () => {
  const [profile, setProfile] = useState<{
    semester_id: string | null;
    branch_id: string | null;
    full_name: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('semester_id, branch_id, full_name')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
    } else {
      setProfile(data);
    }
    setLoading(false);
  };

  const updateProfile = async (userId: string, updates: { semester_id?: string; branch_id?: string }) => {
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('user_id', userId);

    if (error) {
      throw error;
    }
  };

  return { profile, loading, fetchProfile, updateProfile, setProfile };
};
