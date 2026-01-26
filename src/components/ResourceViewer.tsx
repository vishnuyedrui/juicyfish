import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, ZoomIn, ZoomOut, Maximize2, Minimize2 } from 'lucide-react';

interface ResourceViewerProps {
  isOpen: boolean;
  onClose: () => void;
  resource: {
    title: string;
    url: string | null;
    file_path: string | null;
    resource_type: string;
  } | null;
}

const ResourceViewer = ({ isOpen, onClose, resource }: ResourceViewerProps) => {
  const [zoom, setZoom] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!resource) return null;

  const resourceUrl = resource.url || resource.file_path || '';

  // Extract YouTube video ID
  const getYouTubeVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  // Check if it's a YouTube video
  const isYouTube = resource.resource_type === 'youtube_video' || 
    resourceUrl.includes('youtube.com') || 
    resourceUrl.includes('youtu.be');
  
  const youtubeId = isYouTube ? getYouTubeVideoId(resourceUrl) : null;

  // Check file type
  const isPDF = resourceUrl.toLowerCase().endsWith('.pdf') || resource.resource_type === 'document';
  const isOfficeDoc = /\.(pptx?|docx?|xlsx?)$/i.test(resourceUrl);
  const isViewableInGoogleDocs = isPDF || isOfficeDoc;
  const isImage = resource.resource_type === 'image' || 
    /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(resourceUrl);
  
  // Check if it's a Google Drive link
  const isDriveLink = resourceUrl.includes('drive.google.com');
  const getDriveEmbedUrl = (url: string) => {
    // Convert drive links to preview format
    const fileIdMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (fileIdMatch) {
      return `https://drive.google.com/file/d/${fileIdMatch[1]}/preview`;
    }
    return url;
  };

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 25, 50));
  const toggleFullscreen = () => setIsFullscreen((prev) => !prev);

  const dialogClass = isFullscreen 
    ? "max-w-[100vw] max-h-[100vh] w-screen h-screen m-0 rounded-none" 
    : "max-w-5xl w-full max-h-[90vh]";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className={`${dialogClass} p-0 overflow-hidden`}
        onContextMenu={(e) => e.preventDefault()}
      >
        <DialogHeader className="px-4 py-3 border-b flex-row items-center justify-between">
          <DialogTitle className="text-lg font-medium truncate pr-4">
            {resource.title}
          </DialogTitle>
          <div className="flex items-center gap-2">
            {(isImage || isViewableInGoogleDocs) && (
              <>
                <Button variant="ghost" size="icon" onClick={handleZoomOut}>
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <span className="text-sm text-muted-foreground w-12 text-center">{zoom}%</span>
                <Button variant="ghost" size="icon" onClick={handleZoomIn}>
                  <ZoomIn className="w-4 h-4" />
                </Button>
              </>
            )}
            <Button variant="ghost" size="icon" onClick={toggleFullscreen}>
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div 
          className="flex-1 overflow-auto bg-muted/30"
          style={{ height: isFullscreen ? 'calc(100vh - 60px)' : 'calc(90vh - 100px)' }}
        >
          {isYouTube && youtubeId ? (
            <div className="w-full h-full flex items-center justify-center p-4">
              <iframe
                src={`https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1`}
                className="w-full aspect-video max-w-4xl rounded-lg"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ border: 'none' }}
              />
            </div>
          ) : isDriveLink ? (
            <iframe
              src={getDriveEmbedUrl(resourceUrl)}
              className="w-full h-full"
              style={{ border: 'none' }}
              allow="autoplay"
            />
          ) : isViewableInGoogleDocs ? (
            <iframe
              src={`https://docs.google.com/viewer?url=${encodeURIComponent(resourceUrl)}&embedded=true`}
              className="w-full h-full"
              style={{ 
                border: 'none',
                transform: `scale(${zoom / 100})`,
                transformOrigin: 'top left',
                width: `${10000 / zoom}%`,
                height: `${10000 / zoom}%`,
              }}
            />
          ) : isImage ? (
            <div 
              className="w-full h-full flex items-center justify-center p-4 overflow-auto"
              onContextMenu={(e) => e.preventDefault()}
            >
              <img
                src={resourceUrl}
                alt={resource.title}
                className="max-w-full object-contain select-none"
                style={{ 
                  transform: `scale(${zoom / 100})`,
                  transformOrigin: 'center',
                }}
                draggable={false}
                onDragStart={(e) => e.preventDefault()}
              />
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center p-4">
              <iframe
                src={resourceUrl}
                className="w-full h-full rounded-lg"
                style={{ border: 'none' }}
              />
            </div>
          )}
        </div>

        {/* Overlay to prevent right-click saving */}
        <div 
          className="absolute inset-0 pointer-events-none" 
          style={{ userSelect: 'none' }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ResourceViewer;
