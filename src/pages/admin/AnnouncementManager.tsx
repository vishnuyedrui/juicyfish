import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '@/hooks/useAdmin';
import { useBranches, useSemesters } from '@/hooks/useResources';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Plus, Trash2, Loader2, Megaphone, MessageCircle, Video, Send, Link as LinkIcon, ExternalLink } from 'lucide-react';

interface Announcement {
  id: string;
  title: string;
  description: string | null;
  link_url: string;
  link_label: string;
  link_type: string;
  is_active: boolean;
  semester_id: string | null;
  branch_id: string | null;
  created_at: string;
}

const LINK_TYPES = [
  { value: 'whatsapp', label: 'WhatsApp Group', icon: MessageCircle },
  { value: 'meeting', label: 'Meeting Link', icon: Video },
  { value: 'telegram', label: 'Telegram', icon: Send },
  { value: 'general', label: 'Other Link', icon: LinkIcon },
];

const AnnouncementManager = () => {
  const { isAdmin, loading: adminLoading } = useAdmin();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { branches } = useBranches();
  const { semesters } = useSemesters();

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    description: '',
    link_url: '',
    link_label: '',
    link_type: 'whatsapp',
    semester_id: '',
    branch_id: '',
  });

  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      navigate('/admin/login');
    }
  }, [isAdmin, adminLoading, navigate]);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching announcements:', error);
    } else {
      setAnnouncements(data || []);
    }
    setLoading(false);
  };

  const handleAddAnnouncement = async () => {
    if (!newAnnouncement.title || !newAnnouncement.link_url || !newAnnouncement.link_label) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in title, link URL, and button label',
        variant: 'destructive',
      });
      return;
    }

    setAdding(true);
    try {
      const { data, error } = await supabase
        .from('announcements')
        .insert({
          title: newAnnouncement.title,
          description: newAnnouncement.description || null,
          link_url: newAnnouncement.link_url,
          link_label: newAnnouncement.link_label,
          link_type: newAnnouncement.link_type,
          semester_id: newAnnouncement.semester_id || null,
          branch_id: newAnnouncement.branch_id || null,
          is_active: true,
        })
        .select()
        .single();

      if (error) throw error;

      setAnnouncements([data, ...announcements]);
      setNewAnnouncement({
        title: '',
        description: '',
        link_url: '',
        link_label: '',
        link_type: 'whatsapp',
        semester_id: '',
        branch_id: '',
      });
      toast({ title: 'Success', description: 'Announcement added successfully' });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setAdding(false);
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('announcements')
        .update({ is_active: isActive })
        .eq('id', id);

      if (error) throw error;

      setAnnouncements(announcements.map((a) => (a.id === id ? { ...a, is_active: isActive } : a)));
      toast({ title: 'Success', description: `Announcement ${isActive ? 'activated' : 'deactivated'}` });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    try {
      const { error } = await supabase.from('announcements').delete().eq('id', id);
      if (error) throw error;

      setAnnouncements(announcements.filter((a) => a.id !== id));
      toast({ title: 'Success', description: 'Announcement deleted' });
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
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <Megaphone className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <h1 className="text-lg sm:text-xl font-bold">Announcements</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container max-w-6xl mx-auto px-3 sm:px-4 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Add Announcement */}
        <Card>
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="text-base sm:text-lg">Add New Announcement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  placeholder="e.g., Join our WhatsApp Group"
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Link Type</Label>
                <Select
                  value={newAnnouncement.link_type}
                  onValueChange={(v) => setNewAnnouncement({ ...newAnnouncement, link_type: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LINK_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-sm">Link URL</Label>
                <Input
                  placeholder="https://..."
                  value={newAnnouncement.link_url}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, link_url: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Button Label</Label>
                <Input
                  placeholder="e.g., Join Now"
                  value={newAnnouncement.link_label}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, link_label: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description (Optional)</Label>
              <Textarea
                placeholder="Brief description of the announcement..."
                value={newAnnouncement.description}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, description: e.target.value })}
              />
            </div>

            <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-sm">Target Semester (Optional)</Label>
                <Select
                  value={newAnnouncement.semester_id || "all"}
                  onValueChange={(v) => setNewAnnouncement({ ...newAnnouncement, semester_id: v === "all" ? "" : v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All semesters" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Semesters</SelectItem>
                    {semesters.map((sem) => (
                      <SelectItem key={sem.id} value={sem.id}>
                        {sem.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Target Branch (Optional)</Label>
                <Select
                  value={newAnnouncement.branch_id || "all"}
                  onValueChange={(v) => setNewAnnouncement({ ...newAnnouncement, branch_id: v === "all" ? "" : v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All branches" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Branches</SelectItem>
                    {branches.map((branch) => (
                      <SelectItem key={branch.id} value={branch.id}>
                        {branch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button onClick={handleAddAnnouncement} disabled={adding}>
              {adding ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
              Add Announcement
            </Button>
          </CardContent>
        </Card>

        {/* Existing Announcements */}
        <Card>
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="text-base sm:text-lg">Existing Announcements ({announcements.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-6 sm:py-8">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ) : announcements.length === 0 ? (
              <p className="text-muted-foreground text-center py-6 sm:py-8 text-sm sm:text-base">No announcements yet. Add your first announcement above.</p>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {announcements.map((announcement) => {
                  const typeInfo = LINK_TYPES.find((t) => t.value === announcement.link_type);
                  const Icon = typeInfo?.icon || LinkIcon;
                  return (
                    <div
                      key={announcement.id}
                      className={`p-3 sm:p-4 rounded-lg border ${announcement.is_active ? 'bg-card' : 'bg-muted/50 opacity-60'}`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
                        <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
                          <Icon className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 text-primary flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-sm sm:text-base">{announcement.title}</h3>
                            {announcement.description && (
                              <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-2">{announcement.description}</p>
                            )}
                            <div className="flex flex-wrap items-center gap-2 mt-2">
                              <a
                                href={announcement.link_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs sm:text-sm text-primary hover:underline flex items-center gap-1"
                              >
                                {announcement.link_label}
                                <ExternalLink className="w-3 h-3" />
                              </a>
                              <span className="text-xs text-muted-foreground">
                                • {typeInfo?.label}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3 self-end sm:self-auto">
                          <div className="flex items-center gap-2">
                            <Label htmlFor={`active-${announcement.id}`} className="text-xs sm:text-sm">
                              Active
                            </Label>
                            <Switch
                              id={`active-${announcement.id}`}
                              checked={announcement.is_active}
                              onCheckedChange={(checked) => handleToggleActive(announcement.id, checked)}
                            />
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive h-8 w-8"
                            onClick={() => handleDeleteAnnouncement(announcement.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AnnouncementManager;
