import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '@/hooks/useAdmin';
import { useBranches, useSemesters, useCourses, useChapters } from '@/hooks/useResources';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Plus, Trash2, Loader2, BookOpen, RefreshCw } from 'lucide-react';

const CourseManager = () => {
  const { isAdmin, loading: adminLoading } = useAdmin();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { branches } = useBranches();
  const { semesters } = useSemesters();
  const [selectedSemester, setSelectedSemester] = useState<string>('');
  const [selectedBranch, setSelectedBranch] = useState<string>('');
  const { courses, loading: coursesLoading, setCourses } = useCourses(selectedSemester, selectedBranch);

  const [newCourse, setNewCourse] = useState({ name: '', code: '' });
  const [addingCourse, setAddingCourse] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const { chapters, setChapters } = useChapters(selectedCourse);
  const [newChapter, setNewChapter] = useState({ number: 1, title: '' });
  const [addingChapter, setAddingChapter] = useState(false);

  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      navigate('/admin/login');
    }
  }, [isAdmin, adminLoading, navigate]);

  const handleAddCourse = async () => {
    if (!selectedSemester || !selectedBranch || !newCourse.name || !newCourse.code) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    setAddingCourse(true);
    try {
      const { data, error } = await supabase
        .from('courses')
        .insert({
          name: newCourse.name,
          code: newCourse.code,
          semester_id: selectedSemester,
          branch_id: selectedBranch,
        })
        .select()
        .single();

      if (error) throw error;

      // Auto-create default sections for the new course
      const defaultSections = [
        { title: 'Syllabus', section_type: 'syllabus', chapter_number: 0, sort_order: 1 },
        { title: 'Chapter 1', section_type: 'chapter', chapter_number: 1, sort_order: 2 },
        { title: 'Chapter 2', section_type: 'chapter', chapter_number: 2, sort_order: 3 },
        { title: 'Chapter 3', section_type: 'chapter', chapter_number: 3, sort_order: 4 },
        { title: 'Chapter 4', section_type: 'chapter', chapter_number: 4, sort_order: 5 },
        { title: 'Chapter 5', section_type: 'chapter', chapter_number: 5, sort_order: 6 },
        { title: 'Additional Resources', section_type: 'additional_resources', chapter_number: 0, sort_order: 7 },
        { title: 'PYQs', section_type: 'pyq', chapter_number: 0, sort_order: 8 },
      ];

      const { error: sectionsError } = await supabase
        .from('chapters')
        .insert(defaultSections.map((s) => ({ ...s, course_id: data.id })));

      if (sectionsError) {
        console.error('Error creating sections:', sectionsError);
      }

      setCourses([...courses, data]);
      setNewCourse({ name: '', code: '' });
      toast({ title: 'Success', description: 'Course added with default sections (Syllabus, Ch 1-5, Additional Resources, PYQs)' });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setAddingCourse(false);
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    try {
      const { error } = await supabase.from('courses').delete().eq('id', courseId);
      if (error) throw error;

      setCourses(courses.filter((c) => c.id !== courseId));
      if (selectedCourse === courseId) setSelectedCourse('');
      toast({ title: 'Success', description: 'Course deleted' });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleSyncSections = async (courseId: string) => {
    try {
      // Check if sections already exist
      const { data: existingSections, error: checkError } = await supabase
        .from('chapters')
        .select('id')
        .eq('course_id', courseId);

      if (checkError) throw checkError;

      if (existingSections && existingSections.length > 0) {
        toast({
          title: 'Sections Already Exist',
          description: `This course already has ${existingSections.length} sections`,
        });
        return;
      }

      // Create default sections
      const defaultSections = [
        { title: 'Syllabus', section_type: 'syllabus', chapter_number: 0, sort_order: 1 },
        { title: 'Chapter 1', section_type: 'chapter', chapter_number: 1, sort_order: 2 },
        { title: 'Chapter 2', section_type: 'chapter', chapter_number: 2, sort_order: 3 },
        { title: 'Chapter 3', section_type: 'chapter', chapter_number: 3, sort_order: 4 },
        { title: 'Chapter 4', section_type: 'chapter', chapter_number: 4, sort_order: 5 },
        { title: 'Chapter 5', section_type: 'chapter', chapter_number: 5, sort_order: 6 },
        { title: 'Additional Resources', section_type: 'additional_resources', chapter_number: 0, sort_order: 7 },
        { title: 'PYQs', section_type: 'pyq', chapter_number: 0, sort_order: 8 },
      ];

      const { error: insertError } = await supabase
        .from('chapters')
        .insert(defaultSections.map((s) => ({ ...s, course_id: courseId })));

      if (insertError) throw insertError;

      toast({
        title: 'Success',
        description: 'Default sections added (Syllabus, Ch 1-5, Additional Resources, PYQs)',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleAddChapter = async () => {
    if (!selectedCourse || !newChapter.title) {
      toast({
        title: 'Missing Information',
        description: 'Please select a course and enter chapter title',
        variant: 'destructive',
      });
      return;
    }

    setAddingChapter(true);
    try {
      const { data, error } = await supabase
        .from('chapters')
        .insert({
          course_id: selectedCourse,
          chapter_number: newChapter.number,
          title: newChapter.title,
        })
        .select()
        .single();

      if (error) throw error;

      setChapters([...chapters, data]);
      setNewChapter({ number: chapters.length + 2, title: '' });
      toast({ title: 'Success', description: 'Chapter added successfully' });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setAddingChapter(false);
    }
  };

  const handleDeleteChapter = async (chapterId: string) => {
    try {
      const { error } = await supabase.from('chapters').delete().eq('id', chapterId);
      if (error) throw error;

      setChapters(chapters.filter((c) => c.id !== chapterId));
      toast({ title: 'Success', description: 'Chapter deleted' });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  if (adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b sticky top-0 z-10">
        <div className="container max-w-6xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/admin')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h1 className="text-lg sm:text-xl font-bold">Course Manager</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container max-w-6xl mx-auto px-3 sm:px-4 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Filter Section */}
        <Card>
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="text-base sm:text-lg">Select Semester & Branch</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Semester</Label>
              <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                <SelectTrigger>
                  <SelectValue placeholder="Select semester" />
                </SelectTrigger>
                <SelectContent>
                  {semesters.map((sem) => (
                    <SelectItem key={sem.id} value={sem.id}>
                      {sem.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Branch</Label>
              <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                <SelectTrigger>
                  <SelectValue placeholder="Select branch" />
                </SelectTrigger>
                <SelectContent>
                  {branches.map((branch) => (
                    <SelectItem key={branch.id} value={branch.id}>
                      {branch.name} ({branch.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Add Course Section */}
        {selectedSemester && selectedBranch && (
          <Card>
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="text-base sm:text-lg">Add New Course</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Course Name</Label>
                  <Input
                    placeholder="e.g., Data Structures"
                    value={newCourse.name}
                    onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Course Code</Label>
                  <Input
                    placeholder="e.g., CS201"
                    value={newCourse.code}
                    onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value })}
                  />
                </div>
              </div>
              <Button onClick={handleAddCourse} disabled={addingCourse}>
                {addingCourse ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                Add Course
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Existing Courses */}
        {selectedSemester && selectedBranch && (
          <Card>
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="text-base sm:text-lg">Existing Courses ({courses.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {coursesLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              ) : courses.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No courses found. Add your first course above.</p>
              ) : (
                <div className="space-y-2 sm:space-y-3">
                  {courses.map((course) => (
                    <div
                      key={course.id}
                      className={`flex items-center justify-between p-3 sm:p-4 rounded-lg border cursor-pointer transition-colors ${
                        selectedCourse === course.id ? 'bg-primary/10 border-primary' : 'hover:bg-muted/50'
                      }`}
                      onClick={() => setSelectedCourse(course.id)}
                    >
                      <div className="min-w-0 flex-1 mr-2">
                        <p className="font-medium text-sm sm:text-base truncate">{course.name}</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">{course.code}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Sync default sections"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSyncSections(course.id);
                          }}
                        >
                          <RefreshCw className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCourse(course.id);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Chapter Management */}
        {selectedCourse && (
          <Card>
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="text-base sm:text-lg">Manage Chapters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="grid gap-3 sm:gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label>Chapter Number</Label>
                  <Select
                    value={newChapter.number.toString()}
                    onValueChange={(v) => setNewChapter({ ...newChapter, number: parseInt(v) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <SelectItem key={n} value={n.toString()}>
                          Chapter {n}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label className="text-sm">Chapter Title</Label>
                  <Input
                    placeholder="e.g., Introduction to Arrays"
                    value={newChapter.title}
                    onChange={(e) => setNewChapter({ ...newChapter, title: e.target.value })}
                  />
                </div>
              </div>
              <Button onClick={handleAddChapter} disabled={addingChapter}>
                {addingChapter ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                Add Chapter
              </Button>

              {chapters.length > 0 && (
                <div className="mt-3 sm:mt-4 space-y-2">
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Existing Chapters</p>
                  {chapters.map((chapter) => (
                    <div key={chapter.id} className="flex items-center justify-between p-2 sm:p-3 rounded-lg border gap-2">
                      <span className="text-sm sm:text-base truncate">
                        Chapter {chapter.chapter_number}: {chapter.title}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => handleDeleteChapter(chapter.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default CourseManager;
