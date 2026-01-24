import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useChapters, useResources } from '@/hooks/useResources';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowLeft, BookOpen, Youtube, FileText, Link as LinkIcon, Image, File, Loader2, Play, Eye } from 'lucide-react';
import ResourceViewer from '@/components/ResourceViewer';

const RESOURCE_TYPE_INFO = {
  youtube_video: { label: 'YouTube Videos', icon: Youtube, color: 'text-red-500' },
  drive_link: { label: 'Drive Links', icon: LinkIcon, color: 'text-blue-500' },
  previous_paper: { label: 'Previous Papers', icon: FileText, color: 'text-orange-500' },
  syllabus: { label: 'Syllabus', icon: FileText, color: 'text-green-500' },
  notes: { label: 'Notes', icon: FileText, color: 'text-purple-500' },
  document: { label: 'Documents', icon: File, color: 'text-gray-500' },
  image: { label: 'Images', icon: Image, color: 'text-pink-500' },
};

const SECTION_TYPE_INFO: Record<string, { label: string; icon: React.ComponentType<any>; color: string }> = {
  syllabus: { label: 'Syllabus', icon: FileText, color: 'text-green-500' },
  chapter: { label: 'Chapter', icon: BookOpen, color: 'text-blue-500' },
  additional_resources: { label: 'Additional Resources', icon: File, color: 'text-purple-500' },
  pyq: { label: 'Previous Year Questions', icon: FileText, color: 'text-orange-500' },
};

interface Course {
  id: string;
  name: string;
  code: string;
}

interface Chapter {
  id: string;
  course_id: string;
  chapter_number: number;
  title: string;
  section_type?: string;
  sort_order?: number;
}

const CourseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const { chapters, loading: chaptersLoading } = useChapters(id);
  const { resources, loading: resourcesLoading } = useResources(id);
  const [activeTab, setActiveTab] = useState('chapters');
  
  // Resource viewer state
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<{
    title: string;
    url: string | null;
    file_path: string | null;
    resource_type: string;
  } | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      if (!id) return;

      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching course:', error);
        navigate('/courses');
        return;
      }

      setCourse(data);
      setLoading(false);
    };

    fetchCourse();
  }, [id, navigate]);

  // Sort chapters by sort_order (Syllabus -> Ch1-5 -> Additional -> PYQs)
  const sortedChapters = [...chapters].sort((a, b) => {
    const orderA = (a as Chapter).sort_order ?? a.chapter_number;
    const orderB = (b as Chapter).sort_order ?? b.chapter_number;
    return orderA - orderB;
  });

  const getResourcesByType = (type: string) => {
    return resources.filter((r) => r.resource_type === type);
  };

  const getResourcesByChapter = (chapterId: string) => {
    return resources.filter((r) => r.chapter_id === chapterId);
  };

  const getCourseWideResources = () => {
    return resources.filter((r) => !r.chapter_id);
  };

  const handleViewResource = (resource: {
    title: string;
    url: string | null;
    file_path: string | null;
    resource_type: string;
  }) => {
    setSelectedResource(resource);
    setViewerOpen(true);
  };

  const getSectionIcon = (chapter: Chapter) => {
    const sectionType = (chapter as any).section_type || 'chapter';
    const info = SECTION_TYPE_INFO[sectionType];
    return info?.icon || BookOpen;
  };

  const getSectionLabel = (chapter: Chapter) => {
    const sectionType = (chapter as any).section_type || 'chapter';
    if (sectionType === 'chapter') {
      return `Chapter ${chapter.chapter_number}`;
    }
    return chapter.title;
  };

  if (loading || chaptersLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!course) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b sticky top-0 z-10">
        <div className="container max-w-6xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/courses')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              </div>
              <div className="min-w-0">
                <h1 className="text-base sm:text-xl font-bold truncate">{course.name}</h1>
                <p className="text-xs sm:text-sm text-muted-foreground">{course.code}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container max-w-6xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-4 sm:mb-6 h-9 sm:h-10">
            <TabsTrigger value="chapters">Sections</TabsTrigger>
            <TabsTrigger value="resources">All Resources</TabsTrigger>
          </TabsList>

          <TabsContent value="chapters" className="space-y-4 sm:space-y-6">
            {sortedChapters.length === 0 ? (
              <Card>
                <CardContent className="py-8 sm:py-12 text-center">
                  <BookOpen className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-muted-foreground mb-3 sm:mb-4" />
                  <p className="text-sm sm:text-base text-muted-foreground">No sections available yet.</p>
                </CardContent>
              </Card>
            ) : (
              <Accordion type="single" collapsible className="space-y-3 sm:space-y-4">
                {sortedChapters.map((chapter) => {
                  const chapterResources = getResourcesByChapter(chapter.id);
                  const SectionIcon = getSectionIcon(chapter as Chapter);
                  const sectionType = (chapter as any).section_type || 'chapter';
                  
                  return (
                    <AccordionItem key={chapter.id} value={chapter.id} className="border rounded-lg px-3 sm:px-4">
                      <AccordionTrigger className="hover:no-underline py-3 sm:py-4">
                        <div className="flex items-center gap-2 sm:gap-3 text-left">
                          <span className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            sectionType === 'syllabus' ? 'bg-green-100 dark:bg-green-900/30' :
                            sectionType === 'pyq' ? 'bg-orange-100 dark:bg-orange-900/30' :
                            sectionType === 'additional_resources' ? 'bg-purple-100 dark:bg-purple-900/30' :
                            'bg-primary/10'
                          }`}>
                            {sectionType === 'chapter' ? (
                              <span className="text-xs sm:text-sm font-medium text-primary">{chapter.chapter_number}</span>
                            ) : (
                              <SectionIcon className={`w-3 h-3 sm:w-4 sm:h-4 ${SECTION_TYPE_INFO[sectionType]?.color || 'text-primary'}`} />
                            )}
                          </span>
                          <span className="font-medium text-sm sm:text-base">{chapter.title}</span>
                          <span className="text-xs sm:text-sm text-muted-foreground hidden sm:inline">
                            ({chapterResources.length} resources)
                          </span>
                          <span className="text-xs text-muted-foreground sm:hidden">
                            ({chapterResources.length})
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pt-2 sm:pt-4 pb-4 sm:pb-6">
                        {chapterResources.length === 0 ? (
                          <p className="text-xs sm:text-sm text-muted-foreground text-center py-3 sm:py-4">
                            No resources available for this section.
                          </p>
                        ) : (
                          <div className="grid gap-2 sm:gap-3">
                            {chapterResources.map((resource) => {
                              const typeInfo = RESOURCE_TYPE_INFO[resource.resource_type as keyof typeof RESOURCE_TYPE_INFO];
                              const Icon = typeInfo?.icon || File;
                              
                              return (
                                <div
                                  key={resource.id}
                                  className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border hover:bg-muted/50 transition-colors group cursor-pointer"
                                  onClick={() => handleViewResource(resource)}
                                >
                                  <Icon className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 ${typeInfo?.color || 'text-muted-foreground'}`} />
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm sm:text-base truncate">{resource.title}</p>
                                    {resource.description && (
                                      <p className="text-xs sm:text-sm text-muted-foreground truncate hidden sm:block">{resource.description}</p>
                                    )}
                                  </div>
                                  <Button variant="ghost" size="sm" className="gap-1 h-7 sm:h-8 px-2 sm:px-3 text-xs sm:text-sm">
                                    {resource.resource_type === 'youtube_video' ? (
                                      <>
                                        <Play className="w-3 h-3 sm:w-4 sm:h-4" />
                                        <span className="hidden sm:inline">Watch</span>
                                      </>
                                    ) : (
                                      <>
                                        <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                                        <span className="hidden sm:inline">View</span>
                                      </>
                                    )}
                                  </Button>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            )}

            {/* Course-wide resources */}
            {getCourseWideResources().length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">General Resources</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-3">
                  {getCourseWideResources().map((resource) => {
                    const typeInfo = RESOURCE_TYPE_INFO[resource.resource_type as keyof typeof RESOURCE_TYPE_INFO];
                    const Icon = typeInfo?.icon || File;
                    return (
                      <div
                        key={resource.id}
                        className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors group cursor-pointer"
                        onClick={() => handleViewResource(resource)}
                      >
                        <Icon className={`w-5 h-5 ${typeInfo?.color || 'text-muted-foreground'}`} />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{resource.title}</p>
                          {resource.description && (
                            <p className="text-sm text-muted-foreground truncate">{resource.description}</p>
                          )}
                        </div>
                        <Button variant="ghost" size="sm" className="gap-1">
                          <Eye className="w-4 h-4" />
                          View
                        </Button>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            {resourcesLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ) : resources.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No resources available yet.</p>
                </CardContent>
              </Card>
            ) : (
              Object.entries(RESOURCE_TYPE_INFO).map(([type, info]) => {
                const typeResources = getResourcesByType(type);
                if (typeResources.length === 0) return null;

                const Icon = info.icon;
                return (
                  <Card key={type}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Icon className={`w-5 h-5 ${info.color}`} />
                        {info.label} ({typeResources.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-3">
                      {typeResources.map((resource) => (
                        <div
                          key={resource.id}
                          className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors group cursor-pointer"
                          onClick={() => handleViewResource(resource)}
                        >
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{resource.title}</p>
                            {resource.description && (
                              <p className="text-sm text-muted-foreground truncate">{resource.description}</p>
                            )}
                          </div>
                          <Button variant="ghost" size="sm" className="gap-1">
                            <Eye className="w-4 h-4" />
                            View
                          </Button>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                );
              })
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Resource Viewer Modal */}
      <ResourceViewer
        isOpen={viewerOpen}
        onClose={() => setViewerOpen(false)}
        resource={selectedResource}
      />
    </div>
  );
};

export default CourseDetail;
