import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, RotateCw, Loader2 } from 'lucide-react';
import SecurityWrapper from './SecurityWrapper';

interface SecureImageViewerProps {
  url: string;
  title?: string;
}

const SecureImageViewer = ({ url, title }: SecureImageViewerProps) => {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 25, 300));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 25, 25));
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);

  const handleImageLoad = () => {
    setLoading(false);
    setError(false);
  };

  const handleImageError = () => {
    setLoading(false);
    setError(true);
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="text-center">
          <p className="text-destructive mb-2">Failed to load image</p>
          <p className="text-sm text-muted-foreground">
            The image may have expired or is inaccessible
          </p>
        </div>
      </div>
    );
  }

  return (
    <SecurityWrapper className="h-full flex flex-col">
      {/* Controls */}
      <div className="flex items-center justify-center gap-2 px-4 py-2 bg-muted/50 border-b shrink-0">
        <Button variant="ghost" size="icon" onClick={handleZoomOut} disabled={zoom <= 25}>
          <ZoomOut className="w-4 h-4" />
        </Button>
        <span className="text-sm text-muted-foreground min-w-[50px] text-center">
          {zoom}%
        </span>
        <Button variant="ghost" size="icon" onClick={handleZoomIn} disabled={zoom >= 300}>
          <ZoomIn className="w-4 h-4" />
        </Button>
        <div className="w-px h-4 bg-border mx-2" />
        <Button variant="ghost" size="icon" onClick={handleRotate}>
          <RotateCw className="w-4 h-4" />
        </Button>
      </div>

      {/* Image Container */}
      <div className="flex-1 overflow-auto flex items-center justify-center p-4 bg-muted/20 relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Loading image...</p>
            </div>
          </div>
        )}
        
        <img
          src={url}
          alt={title || 'Secure image'}
          className="max-w-full object-contain select-none transition-transform duration-200"
          style={{
            transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
            transformOrigin: 'center',
            pointerEvents: 'none',
          }}
          onLoad={handleImageLoad}
          onError={handleImageError}
          draggable={false}
          onDragStart={(e) => e.preventDefault()}
          onContextMenu={(e) => e.preventDefault()}
        />
      </div>
    </SecurityWrapper>
  );
};

export default SecureImageViewer;
