-- Drop the restrictive check constraint that only allows chapter_number 1-5
ALTER TABLE public.chapters DROP CONSTRAINT chapters_chapter_number_check;

-- Drop the unique constraint on course_id + chapter_number since we'll use sort_order for ordering
ALTER TABLE public.chapters DROP CONSTRAINT chapters_course_id_chapter_number_key;

-- Add a new unique constraint on course_id + sort_order to prevent duplicates
ALTER TABLE public.chapters ADD CONSTRAINT chapters_course_id_sort_order_key UNIQUE (course_id, sort_order);