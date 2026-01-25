import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile, useCourses, useSemesters, useBranches } from '@/hooks/useResources';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, BookOpen, Loader2 } from 'lucide-react';

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
            <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-bold">Courses</h1>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">
                {semesterName} • {branchName}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container max-w-6xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        {coursesLoading ? (
          <div className="flex justify-center py-10 sm:py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-10 sm:py-12">
            <BookOpen className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-muted-foreground mb-3 sm:mb-4" />
            <h2 className="text-lg sm:text-xl font-semibold mb-2">No Courses Available</h2>
            <p className="text-sm sm:text-base text-muted-foreground mb-4">
              There are no courses added for your semester and branch yet.
            </p>
            <Link to="/profile">
              <Button variant="outline" size="sm">Update Profile</Button>
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
                <Card className="hover:shadow-lg transition-all cursor-pointer h-full group">
                  <CardContent className="pt-4 sm:pt-6">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-primary/20 transition-colors">
                      <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-base sm:text-lg mb-1">{course.name}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">{course.code}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Courses;
