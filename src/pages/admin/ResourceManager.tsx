import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '@/hooks/useAdmin';
import { useBranches, useSemesters, useCourses, useChapters, useResources } from '@/hooks/useResources';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Upload, Link as LinkIcon, Trash2, Loader2, FolderPlus, Youtube, FileText, Image, File } from 'lucide-react';

const RESOURCE_TYPES = [
  { value: 'youtube_video', label: 'YouTube Video', icon: Youtube },
  { value: 'drive_link', label: 'Google Drive', icon: LinkIcon },
  { value: 'previous_paper', label: 'Previous Paper', icon: FileText },
  { value: 'syllabus', label: 'Syllabus', icon: FileText },
  { value: 'notes', label: 'Notes', icon: FileText },
  { value: 'document', label: 'Document', icon: File },
  { value: 'image', label: 'Image', icon: Image },
];

const ResourceManager = () => {
  const { isAdmin, loading: adminLoading } = useAdmin();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { branches } = useBranches();
  const { semesters } = useSemesters();
  const [selectedSemester, setSelectedSemester] = useState<string>('');
  const [selectedBranch, setSelectedBranch] = useState<string>('');
  const { courses } = useCourses(selectedSemester, selectedBranch);
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const { chapters } = useChapters(selectedCourse);
  const [selectedChapter, setSelectedChapter] = useState<string>('');
  const { resources, setResources } = useResources(selectedCourse);

  const [newResource, setNewResource] = useState({
    title: '',
    description: '',
    url: '',
    resource_type: 'youtube_video' as string,
  });
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      navigate('/admin/login');
    }
  }, [isAdmin, adminLoading, navigate]);

  useEffect(() => {
    setSelectedCourse('');
    setSelectedChapter('');
  }, [selectedSemester, selectedBranch]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setUploadedFile(file);
      if (!newResource.title) {
        setNewResource((prev) => ({ ...prev, title: file.name.split('.')[0] }));
      }
    }
  }, [newResource.title]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      if (!newResource.title) {
        setNewResource((prev) => ({ ...prev, title: file.name.split('.')[0] }));
      }
    }
  };

  const uploadFile = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${selectedCourse}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('resources')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from('resources').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleAddResource = async () => {
    if (!selectedCourse || !newResource.title) {
      toast({
        title: 'Missing Information',
        description: 'Please select a course and enter a title',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);
    try {
      let fileUrl = newResource.url;

      if (uploadedFile) {
        fileUrl = await uploadFile(uploadedFile);
      }

      const { data, error } = await supabase
        .from('resources')
        .insert({
          course_id: selectedCourse,
          chapter_id: selectedChapter || null,
          resource_type: newResource.resource_type as any,
          title: newResource.title,
          description: newResource.description || null,
          url: fileUrl || null,
          file_path: uploadedFile ? fileUrl : null,
        })
        .select()
        .single();

      if (error) throw error;

      setResources([data, ...resources]);
      setNewResource({ title: '', description: '', url: '', resource_type: 'youtube_video' });
      setUploadedFile(null);
      toast({ title: 'Success', description: 'Resource added successfully' });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteResource = async (resourceId: string, filePath?: string | null) => {
    try {
      if (filePath) {
        const path = filePath.split('/resources/')[1];
        if (path) {
          await supabase.storage.from('resources').remove([path]);
        }
      }

      const { error } = await supabase.from('resources').delete().eq('id', resourceId);
      if (error) throw error;

      setResources(resources.filter((r) => r.id !== resourceId));
      toast({ title: 'Success', description: 'Resource deleted' });
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
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <FolderPlus className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400" />
              </div>
              <h1 className="text-lg sm:text-xl font-bold">Resource Manager</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container max-w-6xl mx-auto px-3 sm:px-4 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Filter Section */}
        <Card>
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="text-base sm:text-lg">Select Course</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
                      {branch.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Course</Label>
              <Select value={selectedCourse} onValueChange={setSelectedCourse} disabled={courses.length === 0}>
                <SelectTrigger>
                  <SelectValue placeholder={courses.length === 0 ? 'No courses' : 'Select course'} />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Section</Label>
              <Select value={selectedChapter || "all"} onValueChange={(v) => setSelectedChapter(v === "all" ? "" : v)} disabled={!selectedCourse}>
                <SelectTrigger>
                  <SelectValue placeholder={chapters.length === 0 ? 'No sections' : 'All sections'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sections</SelectItem>
                  {[...chapters]
                    .sort((a, b) => ((a as any).sort_order ?? a.chapter_number) - ((b as any).sort_order ?? b.chapter_number))
                    .map((chapter) => (
                      <SelectItem key={chapter.id} value={chapter.id}>
                        {chapter.title}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Add Resource Section */}
        {selectedCourse && (
          <Card>
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="text-base sm:text-lg">Add New Resource</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="link" className="space-y-3 sm:space-y-4">
                <TabsList className="grid w-full grid-cols-2 h-9 sm:h-10">
                  <TabsTrigger value="link">Add Link</TabsTrigger>
                  <TabsTrigger value="upload">Upload File</TabsTrigger>
                </TabsList>

                <TabsContent value="link" className="space-y-3 sm:space-y-4">
                  <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Resource Type</Label>
                      <Select
                        value={newResource.resource_type}
                        onValueChange={(v) => setNewResource({ ...newResource, resource_type: v })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {RESOURCE_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input
                        placeholder="e.g., Introduction Lecture"
                        value={newResource.title}
                        onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>URL (YouTube/Drive Link)</Label>
                    <Input
                      placeholder="https://..."
                      value={newResource.url}
                      onChange={(e) => setNewResource({ ...newResource, url: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description (Optional)</Label>
                    <Textarea
                      placeholder="Brief description of the resource..."
                      value={newResource.description}
                      onChange={(e) => setNewResource({ ...newResource, description: e.target.value })}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="upload" className="space-y-3 sm:space-y-4">
                  <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Resource Type</Label>
                      <Select
                        value={newResource.resource_type}
                        onValueChange={(v) => setNewResource({ ...newResource, resource_type: v })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {RESOURCE_TYPES.filter((t) => !['youtube_video', 'drive_link'].includes(t.value)).map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input
                        placeholder="e.g., Chapter 1 Notes"
                        value={newResource.title}
                        onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Drag and Drop Zone */}
                  <div
                    className={`border-2 border-dashed rounded-lg p-4 sm:p-8 text-center transition-colors ${
                      isDragOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
                    }`}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragOver(true);
                    }}
                    onDragLeave={() => setIsDragOver(false)}
                    onDrop={handleDrop}
                  >
                    {uploadedFile ? (
                      <div className="space-y-2">
                        <File className="w-12 h-12 mx-auto text-primary" />
                        <p className="font-medium">{uploadedFile.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        <Button variant="outline" size="sm" onClick={() => setUploadedFile(null)}>
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
                        <p className="text-muted-foreground">Drag and drop a file here, or click to select</p>
                        <input
                          type="file"
                          className="hidden"
                          id="file-upload"
                          onChange={handleFileSelect}
                          accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.png,.jpg,.jpeg,.gif"
                        />
                        <Button variant="outline" onClick={() => document.getElementById('file-upload')?.click()}>
                          Select File
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Description (Optional)</Label>
                    <Textarea
                      placeholder="Brief description of the resource..."
                      value={newResource.description}
                      onChange={(e) => setNewResource({ ...newResource, description: e.target.value })}
                    />
                  </div>
                </TabsContent>
              </Tabs>

              <Button onClick={handleAddResource} disabled={uploading} className="mt-4">
                {uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                {uploading ? 'Uploading...' : 'Add Resource'}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Existing Resources */}
        {selectedCourse && (
          <Card>
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="text-base sm:text-lg">Existing Resources ({resources.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {resources.length === 0 ? (
                <p className="text-muted-foreground text-center py-6 sm:py-8 text-sm sm:text-base">No resources found. Add your first resource above.</p>
              ) : (
                <div className="space-y-2 sm:space-y-3">
                  {resources.map((resource) => {
                    const TypeIcon = RESOURCE_TYPES.find((t) => t.value === resource.resource_type)?.icon || File;
                    return (
                      <div key={resource.id} className="flex items-center justify-between p-3 sm:p-4 rounded-lg border gap-2">
                        <div className="flex items-center gap-3">
                          <TypeIcon className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{resource.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {RESOURCE_TYPES.find((t) => t.value === resource.resource_type)?.label}
                              {resource.description && ` • ${resource.description}`}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {resource.url && (
                            <Button variant="ghost" size="sm" asChild>
                              <a href={resource.url} target="_blank" rel="noopener noreferrer">
                                Open
                              </a>
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive"
                            onClick={() => handleDeleteResource(resource.id, resource.file_path)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default ResourceManager;
