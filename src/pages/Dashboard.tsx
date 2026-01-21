import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile, useCourses, useSemesters, useBranches } from '@/hooks/useResources';
import { useAnnouncements } from '@/hooks/useAnnouncements';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, BookOpen, CalendarCheck, User, LogOut, Loader2, Megaphone, MessageCircle, Video, Send, Link as LinkIcon, ExternalLink } from 'lucide-react';

const Dashboard = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { profile, loading: profileLoading, fetchProfile } = useUserProfile();
  const { semesters } = useSemesters();
  const { branches } = useBranches();
  const { courses } = useCourses(profile?.semester_id || undefined, profile?.branch_id || undefined);
  const { announcements } = useAnnouncements(profile?.semester_id, profile?.branch_id);

  const [semesterName, setSemesterName] = useState('');

  const getAnnouncementIcon = (linkType: string) => {
    switch (linkType) {
      case 'whatsapp':
        return MessageCircle;
      case 'meeting':
        return Video;
      case 'telegram':
        return Send;
      default:
        return LinkIcon;
    }
  };
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

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b sticky top-0 z-10">
        <div className="container max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Welcome, {profile?.full_name || 'Student'}!</h1>
                <p className="text-sm text-muted-foreground">
                  {semesterName} • {branchName}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link to="/profile">
                <Button variant="ghost" size="icon">
                  <User className="w-5 h-5" />
                </Button>
              </Link>
              <Button variant="outline" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container max-w-6xl mx-auto px-4 py-8">
        {/* Announcements Section */}
        {announcements.length > 0 && (
          <Card className="mb-8 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 border-orange-200 dark:border-orange-800">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Megaphone className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                Announcements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {announcements.map((ann) => {
                  const Icon = getAnnouncementIcon(ann.link_type);
                  return (
                    <div key={ann.id} className="flex items-center justify-between gap-4 p-3 bg-background/80 rounded-lg">
                      <div className="flex items-center gap-3 min-w-0">
                        <Icon className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="font-medium truncate">{ann.title}</p>
                          {ann.description && (
                            <p className="text-sm text-muted-foreground truncate">{ann.description}</p>
                          )}
                        </div>
                      </div>
                      <a href={ann.link_url} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" className="gap-2 bg-orange-600 hover:bg-orange-700 text-white">
                          {ann.link_label}
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      </a>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Links */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link to="/courses">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-2">
                  <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle>View Courses</CardTitle>
                <CardDescription>
                  Access study materials, notes, and resources for your subjects
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {courses.length} courses available
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/attendance">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-2">
                  <CalendarCheck className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle>Attendance Calculator</CardTitle>
                <CardDescription>
                  Track and calculate your attendance percentage
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Manage your attendance records
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-2">
                  <GraduationCap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle>Grade Calculator</CardTitle>
                <CardDescription>
                  Calculate your SGPA and CGPA
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  WGP, SGPA & CGPA calculations
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Your Courses */}
        <Card>
          <CardHeader>
            <CardTitle>Your Courses</CardTitle>
            <CardDescription>Courses for {semesterName} - {branchName}</CardDescription>
          </CardHeader>
          <CardContent>
            {courses.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No courses available for your semester and branch yet.</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Please check back later or update your profile settings.
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {courses.map((course) => (
                  <Link key={course.id} to={`/courses/${course.id}`}>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="pt-6">
                        <h3 className="font-semibold">{course.name}</h3>
                        <p className="text-sm text-muted-foreground">{course.code}</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
