import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Maximize2, Minimize2, Loader2, LogIn } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useSecureFile, isSupabaseStorageUrl, extractFilePathFromUrl } from '@/hooks/useSecureFile';
import { useNavigate } from 'react-router-dom';
import SecurePDFViewer from './viewers/SecurePDFViewer';
import SecureImageViewer from './viewers/SecureImageViewer';
import SecureVideoViewer from './viewers/SecureVideoViewer';
import SecurityWrapper from './viewers/SecurityWrapper';

interface ResourceViewerProps {
  isOpen: boolean;
  onClose: () => void;
  resource: {
    id?: string;
    title: string;
    url: string | null;
    file_path: string | null;
    resource_type: string;
  } | null;
}

const ResourceViewer = ({ isOpen, onClose, resource }: ResourceViewerProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Determine if this is a storage file that needs secure access
  const rawUrl = resource?.url || resource?.file_path || '';
  const isStorageFile = isSupabaseStorageUrl(rawUrl);
  const filePath = isStorageFile ? extractFilePathFromUrl(rawUrl) : null;

  // Use secure file hook for storage files
  const { 
    signedUrl, 
    loading: fileLoading, 
    error: fileError,
    isAuthenticated 
  } = useSecureFile({
    filePath: isOpen && isStorageFile ? filePath : null,
    resourceId: resource?.id,
  });

  // Reset fullscreen when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setIsFullscreen(false);
    }
  }, [isOpen]);

  if (!resource) return null;

  // For storage files, use signed URL; for external URLs, use directly
  const resourceUrl = isStorageFile ? signedUrl : rawUrl;

  // Extract YouTube video ID
  const getYouTubeVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  // Check if it's a YouTube video
  const isYouTube = resource.resource_type === 'youtube_video' || 
    rawUrl.includes('youtube.com') || 
    rawUrl.includes('youtu.be');
  
  const youtubeId = isYouTube ? getYouTubeVideoId(rawUrl) : null;

  // Check file type
  const isPDF = rawUrl.toLowerCase().endsWith('.pdf') || resource.resource_type === 'document';
  const isOfficeDoc = /\.(pptx?|docx?|xlsx?)$/i.test(rawUrl);
  const isImage = resource.resource_type === 'image' || 
    /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(rawUrl);
  const isVideo = /\.(mp4|webm|ogg|mov)$/i.test(rawUrl);
  
  // Check if it's a Google Drive link
  const isDriveLink = rawUrl.includes('drive.google.com');
  const getDriveEmbedUrl = (url: string) => {
    const fileIdMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (fileIdMatch) {
      return `https://drive.google.com/file/d/${fileIdMatch[1]}/preview`;
    }
    return url;
  };

  const toggleFullscreen = () => setIsFullscreen((prev) => !prev);

  const dialogClass = isFullscreen 
    ? "max-w-[100vw] max-h-[100vh] w-screen h-screen m-0 rounded-none" 
    : "max-w-5xl w-full max-h-[90vh]";

  const handleLoginRedirect = () => {
    onClose();
    navigate('/auth');
  };

  // Show loading state
  const isLoading = authLoading || (isStorageFile && fileLoading);

  // Render content based on authentication and file type
  const renderContent = () => {
    // Check if authentication is required for storage files
    if (isStorageFile && !authLoading && !isAuthenticated) {
      return (
        <div className="flex items-center justify-center h-full min-h-[400px]">
          <div className="text-center space-y-4">
            <LogIn className="w-12 h-12 mx-auto text-muted-foreground" />
            <div>
              <h3 className="font-semibold text-lg">Sign in required</h3>
              <p className="text-muted-foreground mt-1">
                Please sign in to view this resource
              </p>
            </div>
            <Button onClick={handleLoginRedirect}>
              Sign In
            </Button>
          </div>
        </div>
      );
    }

    // Show loading spinner
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-full min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading resource...</p>
          </div>
        </div>
      );
    }

    // Show error if file access failed
    if (isStorageFile && fileError) {
      return (
        <div className="flex items-center justify-center h-full min-h-[400px]">
          <div className="text-center">
            <p className="text-destructive mb-2">{fileError}</p>
            <p className="text-sm text-muted-foreground">
              Please try again or contact support
            </p>
          </div>
        </div>
      );
    }

    // No URL available
    if (!resourceUrl) {
      return (
        <div className="flex items-center justify-center h-full min-h-[400px]">
          <p className="text-muted-foreground">Resource not available</p>
        </div>
      );
    }

    // Render appropriate viewer based on type
    if (isYouTube && youtubeId) {
      return (
        <SecurityWrapper className="w-full h-full flex items-center justify-center p-4">
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1`}
            className="w-full aspect-video max-w-4xl rounded-lg"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ border: 'none' }}
          />
        </SecurityWrapper>
      );
    }

    if (isDriveLink) {
      return (
        <SecurityWrapper className="w-full h-full">
          <iframe
            src={getDriveEmbedUrl(rawUrl)}
            className="w-full h-full"
            style={{ border: 'none' }}
            allow="autoplay"
          />
        </SecurityWrapper>
      );
    }

    // For storage files, use secure viewers
    if (isStorageFile && resourceUrl) {
      if (isPDF) {
        return <SecurePDFViewer url={resourceUrl} title={resource.title} />;
      }

      if (isImage) {
        return <SecureImageViewer url={resourceUrl} title={resource.title} />;
      }

      if (isVideo) {
        return <SecureVideoViewer url={resourceUrl} title={resource.title} />;
      }
    }

    // For external Office docs, use Google Docs viewer
    if (isOfficeDoc && !isStorageFile) {
      return (
        <SecurityWrapper className="w-full h-full">
          <iframe
            src={`https://docs.google.com/viewer?url=${encodeURIComponent(rawUrl)}&embedded=true`}
            className="w-full h-full"
            style={{ border: 'none' }}
          />
        </SecurityWrapper>
      );
    }

    // Fallback for other external content
    return (
      <SecurityWrapper className="w-full h-full flex items-center justify-center p-4">
        <iframe
          src={resourceUrl}
          className="w-full h-full rounded-lg"
          style={{ border: 'none' }}
        />
      </SecurityWrapper>
    );
  };

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
          {renderContent()}
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
