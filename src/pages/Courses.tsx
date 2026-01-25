import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile, useCourses, useSemesters, useBranches } from '@/hooks/useResources';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, BookOpen, Loader2, Sparkles } from 'lucide-react';

const Courses = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { profile, loading: profileLoading, fetchProfile } = useUserProfile();
  const { semesters } = useSemesters();
  const { branches } = useBranches();
  const { courses, loading: coursesLoading } = useCourses(profile?.semester_id || undefined, profile?.branch_id || undefined);

  const [semesterName, setSemesterName] = useState('');
  const [branchName, setBranchName] = useState('');

  useEffect(() => {
    if (user) {
      fetchProfile(user.id);
    }
  }, [user]);

  useEffect(() => {
    if (profile?.semester_id) {
      const semester = semesters.find((s) => s.id === profile.semester_id);
      setSemesterName(semester?.name || '');
    }
    if (profile?.branch_id) {
      const branch = branches.find((b) => b.id === profile.branch_id);
      setBranchName(branch?.name || '');
    }
  }, [profile, semesters, branches]);

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-pop-cyan flex items-center justify-center pop-shadow animate-bounce">
            <Loader2 className="w-8 h-8 animate-spin text-white" />
          </div>
          <p className="font-bold text-muted-foreground">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden pb-12">
      {/* Abstract background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 right-0 w-72 h-72 bg-pop-cyan/15 rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-0 w-96 h-96 bg-pop-pink/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-pop-yellow/15 rounded-full blur-3xl" />
      </div>

      {/* Header - Pop Art Style */}
      <header className="pop-gradient-cyan border-b-4 border-foreground/20 sticky top-0 z-10">
        <div className="container max-w-6xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/dashboard')}
              className="bg-white/20 hover:bg-white hover:text-foreground text-white rounded-xl transition-all hover:scale-105"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="relative">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white flex items-center justify-center pop-shadow">
                <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-pop-cyan" />
              </div>
              <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-pop-yellow animate-pulse" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-black text-white drop-shadow-md">Courses 📚</h1>
              <p className="text-xs sm:text-sm text-white/80 truncate font-medium">
                {semesterName} • {branchName}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container max-w-6xl mx-auto px-3 sm:px-4 py-6 sm:py-8 relative z-10">
        {coursesLoading ? (
          <div className="flex flex-col items-center justify-center py-10 sm:py-12 gap-4">
            <div className="w-16 h-16 rounded-2xl bg-pop-cyan flex items-center justify-center pop-shadow animate-bounce">
              <Loader2 className="w-8 h-8 animate-spin text-white" />
            </div>
            <p className="font-bold text-muted-foreground">Loading courses...</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-10 sm:py-12">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-pop-cyan/10 flex items-center justify-center pop-shadow mb-4">
              <BookOpen className="w-10 h-10 text-pop-cyan" />
            </div>
            <h2 className="text-lg sm:text-xl font-black mb-2">No Courses Available 😢</h2>
            <p className="text-sm sm:text-base text-muted-foreground mb-4 font-medium">
              There are no courses added for your semester and branch yet.
            </p>
            <Link to="/profile">
              <Button className="bg-pop-cyan hover:bg-pop-cyan/90 text-white font-bold rounded-xl pop-shadow transition-all hover:scale-105">
                Update Profile
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course, index) => (
              <Link 
                key={course.id} 
                to={`/courses/${course.id}`}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 75}ms`, animationFillMode: 'both' }}
              >
                <Card className="hover:pop-shadow-lg transition-all cursor-pointer h-full border-[3px] border-pop-cyan/30 bg-pop-cyan/5 pop-shadow hover:scale-[1.02] hover:translate-y-[-4px] group">
                  <CardContent className="pt-4 sm:pt-6">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-pop-cyan flex items-center justify-center mb-3 sm:mb-4 pop-shadow transition-all group-hover:rotate-6 group-hover:scale-110">
                      <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                    </div>
                    <h3 className="font-black text-base sm:text-lg mb-1 group-hover:text-pop-cyan transition-colors">{course.name}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground font-medium">{course.code}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* Footer - Pop Art Style */}
      <footer className="mt-8 sm:mt-12 relative z-10">
        <div className="pop-gradient-pink py-4">
          <p className="text-center text-sm font-bold text-white drop-shadow-sm">
            Built with <span className="text-2xl animate-pulse">❤️</span> for students @ TEAMDINO teamdino.in
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Courses;
