import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile, useCourses, useSemesters, useBranches } from '@/hooks/useResources';
import { useAnnouncements } from '@/hooks/useAnnouncements';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, CalendarCheck, LogOut, Loader2, Megaphone, MessageCircle, Video, Send, Link as LinkIcon, ExternalLink, Sparkles } from 'lucide-react';
import coursesIcon from '@/assets/courses-icon.jpg';
import profileAvatar from '@/assets/profile-avatar.jpg';
import teamDinoIcon from '@/assets/team-dino.jpg';
import gradeCalculatorIcon from '@/assets/grade-calculator-icon.jpg';
import attendanceIcon from '@/assets/attendance-icon.jpg';

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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-pop-pink flex items-center justify-center pop-shadow animate-bounce">
            <Loader2 className="w-8 h-8 animate-spin text-white" />
          </div>
          <p className="font-bold text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Abstract background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 left-0 w-72 h-72 bg-pop-pink/15 rounded-full blur-3xl" />
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-pop-cyan/15 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-pop-yellow/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-pop-purple/15 rounded-full blur-3xl" />
      </div>

      {/* Header - Pop Art Style */}
      <header className="pop-gradient-pink border-b-4 border-foreground/20 sticky top-0 z-10">
        <div className="container max-w-6xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="relative">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white flex items-center justify-center pop-shadow">
                  <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-pop-pink" />
                </div>
                <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-pop-yellow animate-pulse" />
              </div>
              <div className="min-w-0">
                <h1 className="text-base sm:text-xl font-black text-white truncate drop-shadow-md">
                  Welcome, {profile?.full_name || 'Student'}! 👋
                </h1>
                <p className="text-xs sm:text-sm text-white/80 truncate font-medium">
                  {semesterName} • {branchName}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              <Link to="/profile">
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full overflow-hidden border-[3px] border-white/50 hover:border-pop-yellow transition-all cursor-pointer pop-shadow hover:scale-105">
                  <img src={profileAvatar} alt="Profile" className="w-full h-full object-cover" />
                </div>
              </Link>
              <Button 
                variant="outline" 
                onClick={handleSignOut} 
                size="sm" 
                className="h-8 sm:h-10 bg-white/20 border-white/30 text-white hover:bg-white hover:text-foreground rounded-xl font-bold transition-all hover:scale-105"
              >
                <LogOut className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container max-w-6xl mx-auto px-3 sm:px-4 py-6 sm:py-8 relative z-10">
        {/* Announcements Section */}
        {announcements.length > 0 && (
          <Card className="mb-6 sm:mb-8 pop-shadow border-[3px] border-pop-orange/40 bg-gradient-to-r from-pop-orange/10 to-pop-yellow/10">
            <CardHeader className="pb-2 sm:pb-3">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg font-black">
                <div className="w-8 h-8 rounded-xl bg-pop-orange flex items-center justify-center">
                  <Megaphone className="w-4 h-4 text-white" />
                </div>
                Announcements 📢
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2 sm:space-y-3">
                {announcements.map((ann) => {
                  const Icon = getAnnouncementIcon(ann.link_type);
                  return (
                    <div key={ann.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 p-3 bg-card rounded-2xl border-2 border-foreground/10 pop-shadow">
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-xl bg-pop-orange/20 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-4 h-4 text-pop-orange" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-sm sm:text-base truncate">{ann.title}</p>
                          {ann.description && (
                            <p className="text-xs sm:text-sm text-muted-foreground truncate">{ann.description}</p>
                          )}
                        </div>
                      </div>
                      <a href={ann.link_url} target="_blank" rel="noopener noreferrer" className="self-end sm:self-auto">
                        <Button size="sm" className="gap-1 sm:gap-2 bg-pop-orange hover:bg-pop-orange/90 text-white text-xs sm:text-sm h-8 rounded-xl font-bold pop-shadow transition-all hover:scale-105">
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
        <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-6 sm:mb-8">
          <Link to="/courses" className="animate-fade-in" style={{ animationDelay: '0ms', animationFillMode: 'both' }}>
            <Card className="hover:pop-shadow-lg transition-all cursor-pointer h-full border-[3px] border-pop-pink/30 bg-pop-pink/5 pop-shadow hover:scale-[1.02] hover:translate-y-[-4px] group">
              <CardHeader>
                <div className="w-14 h-14 rounded-2xl overflow-hidden mb-2 pop-shadow transition-transform group-hover:rotate-3 group-hover:scale-110">
                  <img src={coursesIcon} alt="Courses" className="w-full h-full object-cover" />
                </div>
                <CardTitle className="font-black">View Courses 📚</CardTitle>
                <CardDescription className="font-medium">
                  Access study materials, notes, and resources
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground font-bold">
                  {courses.length} courses available
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/attendance" className="animate-fade-in" style={{ animationDelay: '75ms', animationFillMode: 'both' }}>
            <Card className="hover:pop-shadow-lg transition-all cursor-pointer h-full border-[3px] border-pop-cyan/30 bg-pop-cyan/5 pop-shadow hover:scale-[1.02] hover:translate-y-[-4px] group">
              <CardHeader>
                <div className="w-14 h-14 rounded-2xl overflow-hidden mb-2 pop-shadow transition-transform group-hover:rotate-3 group-hover:scale-110">
                  <img src={attendanceIcon} alt="Attendance Calculator" className="w-full h-full object-cover" />
                </div>
                <CardTitle className="font-black">Attendance Calculator 📊</CardTitle>
                <CardDescription className="font-medium">
                  Track and calculate your attendance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground font-bold">
                  Manage your attendance records
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/calculator" className="animate-fade-in" style={{ animationDelay: '150ms', animationFillMode: 'both' }}>
            <Card className="hover:pop-shadow-lg transition-all cursor-pointer h-full border-[3px] border-pop-purple/30 bg-pop-purple/5 pop-shadow hover:scale-[1.02] hover:translate-y-[-4px] group">
              <CardHeader>
                <div className="w-14 h-14 rounded-2xl overflow-hidden mb-2 pop-shadow transition-transform group-hover:rotate-3 group-hover:scale-110">
                  <img src={gradeCalculatorIcon} alt="Grade Calculator" className="w-full h-full object-cover" />
                </div>
                <CardTitle className="font-black">Grade Calculator 🎯</CardTitle>
                <CardDescription className="font-medium">
                  Calculate your SGPA and CGPA
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground font-bold">
                  WGP, SGPA & CGPA calculations
                </p>
              </CardContent>
            </Card>
          </Link>

          <a href="https://teamdino.in" target="_blank" rel="noopener noreferrer" className="animate-fade-in" style={{ animationDelay: '225ms', animationFillMode: 'both' }}>
            <Card className="hover:pop-shadow-lg transition-all cursor-pointer h-full border-[3px] border-pop-green/30 bg-pop-green/5 pop-shadow hover:scale-[1.02] hover:translate-y-[-4px] group">
              <CardHeader>
                <div className="w-14 h-14 rounded-2xl overflow-hidden mb-2 pop-shadow transition-transform group-hover:rotate-3 group-hover:scale-110">
                  <img src={teamDinoIcon} alt="Team Dino" className="w-full h-full object-cover" />
                </div>
                <CardTitle className="font-black">TEAM DINO 🦖</CardTitle>
                <CardDescription className="font-medium">
                  External resources and materials
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground font-bold">
                  For more resources, visit TeamDino
                </p>
              </CardContent>
            </Card>
          </a>
        </div>

        {/* Your Courses */}
        <Card className="pop-shadow border-[3px] border-foreground/10">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-pop-yellow flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-foreground" />
              </div>
              <div>
                <CardTitle className="font-black">Your Courses</CardTitle>
                <CardDescription className="font-medium">{semesterName} - {branchName}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {courses.length === 0 ? (
              <div className="text-center py-6 sm:py-8">
                <div className="w-16 h-16 mx-auto rounded-2xl overflow-hidden pop-shadow mb-4">
                  <img src={coursesIcon} alt="No courses" className="w-full h-full object-cover" />
                </div>
                <p className="text-sm sm:text-base text-muted-foreground font-medium">No courses available for your semester and branch yet.</p>
                <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                  Please check back later or update your profile settings.
                </p>
              </div>
            ) : (
              <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {courses.map((course, index) => (
                  <Link 
                    key={course.id} 
                    to={`/courses/${course.id}`}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 75}ms`, animationFillMode: 'both' }}
                  >
                    <Card className="hover:pop-shadow-lg transition-all cursor-pointer border-2 border-foreground/10 hover:border-pop-pink/40 hover:scale-[1.02] group">
                      <CardContent className="pt-6">
                        <h3 className="font-bold group-hover:text-pop-pink transition-colors">{course.name}</h3>
                        <p className="text-sm text-muted-foreground font-medium">{course.code}</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Footer - Pop Art Style */}
      <footer className="mt-8 sm:mt-12 relative z-10">
        <div className="pop-gradient-cyan py-4">
          <p className="text-center text-sm font-bold text-white drop-shadow-sm">
            Built with <span className="text-2xl animate-pulse">❤️</span> for students @ TEAMDINO teamdino.in
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
