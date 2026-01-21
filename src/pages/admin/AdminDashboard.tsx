import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useAdmin } from '@/hooks/useAdmin';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, BookOpen, FolderPlus, Users, LogOut, Loader2, Megaphone } from 'lucide-react';

const AdminDashboard = () => {
  const { user, signOut } = useAuth();
  const { isAdmin, loading } = useAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate('/admin/login');
    }
  }, [isAdmin, loading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b sticky top-0 z-10">
        <div className="container max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Admin Dashboard</h1>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container max-w-6xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Manage Courses */}
          <Link to="/admin/courses">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-2">
                  <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle>Manage Courses</CardTitle>
                <CardDescription>
                  Add, edit, or remove courses for each semester and branch
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="secondary" className="w-full">
                  Go to Courses
                </Button>
              </CardContent>
            </Card>
          </Link>

          {/* Manage Resources */}
          <Link to="/admin/resources">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-2">
                  <FolderPlus className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle>Manage Resources</CardTitle>
                <CardDescription>
                  Upload YouTube links, Drive files, notes, and study materials
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="secondary" className="w-full">
                  Go to Resources
                </Button>
              </CardContent>
            </Card>
          </Link>

          {/* Manage Announcements */}
          <Link to="/admin/announcements">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-2">
                  <Megaphone className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <CardTitle>Announcements</CardTitle>
                <CardDescription>
                  Post WhatsApp groups, meeting links, and important notices
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="secondary" className="w-full">
                  Go to Announcements
                </Button>
              </CardContent>
            </Card>
          </Link>

          {/* View Stats */}
          <Card className="h-full">
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-2">
                <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle>Platform Stats</CardTitle>
              <CardDescription>
                View user statistics and platform usage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="secondary" className="w-full" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
