-- Create announcements table for admin to post links (WhatsApp, meeting links, etc.)
CREATE TABLE public.announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    link_url TEXT NOT NULL,
    link_label TEXT NOT NULL,
    link_type TEXT DEFAULT 'general',
    is_active BOOLEAN DEFAULT true,
    semester_id UUID REFERENCES public.semesters(id) ON DELETE SET NULL,
    branch_id UUID REFERENCES public.branches(id) ON DELETE SET NULL,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on announcements
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- RLS: Anyone can view active announcements
CREATE POLICY "Anyone can view active announcements" ON public.announcements
  FOR SELECT USING (is_active = true);

-- RLS: Admins can manage all announcements
CREATE POLICY "Admins can manage announcements" ON public.announcements
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Add section_type and sort_order columns to chapters table
ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS section_type TEXT DEFAULT 'chapter';
ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

-- Update existing chapters to have proper sort_order based on chapter_number
UPDATE public.chapters SET sort_order = chapter_number + 1 WHERE sort_order = 0;