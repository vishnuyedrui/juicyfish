import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useSuperAdmin } from '@/hooks/useSuperAdmin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Crown, 
  Search, 
  UserPlus, 
  UserMinus, 
  ArrowLeft, 
  Loader2,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface UserProfile {
  user_id: string;
  email: string;
  full_name: string | null;
}

interface AdminUser {
  user_id: string;
  role: string;
  email: string;
  full_name: string | null;
}

const AdminManager = () => {
  const { signOut } = useAuth();
  const { isSuperAdmin, loading: superAdminLoading } = useSuperAdmin();
  const navigate = useNavigate();

  const [searchEmail, setSearchEmail] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [foundUser, setFoundUser] = useState<UserProfile | null>(null);
  const [foundUserRole, setFoundUserRole] = useState<string | null>(null);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [adminsLoading, setAdminsLoading] = useState(true);
  const [revokeDialogOpen, setRevokeDialogOpen] = useState(false);
  const [userToRevoke, setUserToRevoke] = useState<AdminUser | null>(null);

  useEffect(() => {
    if (!superAdminLoading && !isSuperAdmin) {
      navigate('/admin');
    }
  }, [isSuperAdmin, superAdminLoading, navigate]);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    setAdminsLoading(true);
    try {
      // First get all admin and super_admin roles
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('user_id, role')
        .in('role', ['admin', 'super_admin']);

      if (roleError) throw roleError;

      if (!roleData || roleData.length === 0) {
        setAdmins([]);
        return;
      }

      // Then get profile info for these users
      const userIds = roleData.map(r => r.user_id);
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('user_id, email, full_name')
        .in('user_id', userIds);

      if (profileError) throw profileError;

      // Combine the data
      const adminList: AdminUser[] = roleData.map(role => {
        const profile = profiles?.find(p => p.user_id === role.user_id);
        return {
          user_id: role.user_id,
          role: role.role,
          email: profile?.email || 'Unknown',
          full_name: profile?.full_name || null,
        };
      });

      setAdmins(adminList);
    } catch (error) {
      console.error('Error fetching admins:', error);
      toast.error('Failed to fetch admin list');
    } finally {
      setAdminsLoading(false);
    }
  };

  const searchUser = async () => {
    if (!searchEmail.trim()) {
      toast.error('Please enter an email address');
      return;
    }

    setSearchLoading(true);
    setFoundUser(null);
    setFoundUserRole(null);

    try {
      // Search for user in profiles
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('user_id, email, full_name')
        .eq('email', searchEmail.toLowerCase().trim())
        .maybeSingle();

      if (profileError) throw profileError;

      if (!profile) {
        toast.error('No user found with that email');
        return;
      }

      setFoundUser(profile);

      // Check their current role
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', profile.user_id)
        .maybeSingle();

      if (roleError) throw roleError;

      setFoundUserRole(roleData?.role || 'user');
    } catch (error) {
      console.error('Error searching user:', error);
      toast.error('Failed to search for user');
    } finally {
      setSearchLoading(false);
    }
  };

  const promoteToAdmin = async () => {
    if (!foundUser) return;

    try {
      // Update role to admin
      const { error } = await supabase
        .from('user_roles')
        .update({ role: 'admin' })
        .eq('user_id', foundUser.user_id);

      if (error) throw error;

      toast.success(`${foundUser.email} has been promoted to admin`);
      setFoundUserRole('admin');
      fetchAdmins();
    } catch (error) {
      console.error('Error promoting user:', error);
      toast.error('Failed to promote user to admin');
    }
  };

  const confirmRevoke = (admin: AdminUser) => {
    setUserToRevoke(admin);
    setRevokeDialogOpen(true);
  };

  const revokeAdminAccess = async () => {
    if (!userToRevoke) return;

    try {
      // Update role back to user
      const { error } = await supabase
        .from('user_roles')
        .update({ role: 'user' })
        .eq('user_id', userToRevoke.user_id);

      if (error) throw error;

      toast.success(`Admin access revoked for ${userToRevoke.email}`);
      setRevokeDialogOpen(false);
      setUserToRevoke(null);
      
      // If the revoked user was the found user, update their role display
      if (foundUser?.user_id === userToRevoke.user_id) {
        setFoundUserRole('user');
      }
      
      fetchAdmins();
    } catch (error) {
      console.error('Error revoking admin:', error);
      toast.error('Failed to revoke admin access');
    }
  };

  if (superAdminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isSuperAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b sticky top-0 z-10">
        <div className="container max-w-4xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => navigate('/admin')}
                className="flex-shrink-0"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-red-500 flex items-center justify-center flex-shrink-0">
                <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-bold">Admin Manager</h1>
                <p className="text-xs sm:text-sm text-muted-foreground">Manage sub-admin access</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container max-w-4xl mx-auto px-3 sm:px-4 py-6 sm:py-8 space-y-6">
        {/* Search User Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Find User by Email
            </CardTitle>
            <CardDescription>
              Search for a user to promote them to sub-admin
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter user email..."
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && searchUser()}
                className="flex-1"
              />
              <Button onClick={searchUser} disabled={searchLoading}>
                {searchLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
                <span className="ml-2 hidden sm:inline">Search</span>
              </Button>
            </div>

            {/* Search Result */}
            {foundUser && (
              <div className="p-4 rounded-lg border bg-muted/50">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{foundUser.full_name || 'No Name'}</p>
                      <Badge variant={
                        foundUserRole === 'super_admin' ? 'default' :
                        foundUserRole === 'admin' ? 'secondary' : 'outline'
                      }>
                        {foundUserRole === 'super_admin' && <Crown className="w-3 h-3 mr-1" />}
                        {foundUserRole === 'admin' && <Shield className="w-3 h-3 mr-1" />}
                        {foundUserRole}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{foundUser.email}</p>
                  </div>
                  
                  {foundUserRole === 'user' && (
                    <Button onClick={promoteToAdmin} size="sm">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Promote to Admin
                    </Button>
                  )}
                  
                  {foundUserRole === 'admin' && (
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      Already an admin
                    </div>
                  )}
                  
                  {foundUserRole === 'super_admin' && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <AlertCircle className="w-4 h-4" />
                      Super Admin (cannot modify)
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Current Admins Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Current Admins
            </CardTitle>
            <CardDescription>
              All users with admin or super-admin access
            </CardDescription>
          </CardHeader>
          <CardContent>
            {adminsLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : admins.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">No admins found</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {admins.map((admin) => (
                    <TableRow key={admin.user_id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{admin.full_name || 'No Name'}</p>
                          <p className="text-sm text-muted-foreground">{admin.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={admin.role === 'super_admin' ? 'default' : 'secondary'}>
                          {admin.role === 'super_admin' && <Crown className="w-3 h-3 mr-1" />}
                          {admin.role === 'admin' && <Shield className="w-3 h-3 mr-1" />}
                          {admin.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {admin.role === 'admin' ? (
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => confirmRevoke(admin)}
                          >
                            <UserMinus className="w-4 h-4 mr-2" />
                            Revoke
                          </Button>
                        ) : (
                          <span className="text-xs text-muted-foreground">Protected</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Revoke Confirmation Dialog */}
      <AlertDialog open={revokeDialogOpen} onOpenChange={setRevokeDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revoke Admin Access</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to revoke admin access for{' '}
              <span className="font-medium">{userToRevoke?.email}</span>?
              They will no longer be able to manage courses, resources, or announcements.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={revokeAdminAccess} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Revoke Access
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminManager;
