import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Loader2 } from 'lucide-react';
import SecurityWrapper from './SecurityWrapper';

// Import PDF.js
import * as pdfjsLib from 'pdfjs-dist';

// Set worker path
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface SecurePDFViewerProps {
  url: string;
  title?: string;
}

const SecurePDFViewer = ({ url, title }: SecurePDFViewerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [scale, setScale] = useState(1.5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rendering, setRendering] = useState(false);

  // Load PDF document
  useEffect(() => {
    const loadPdf = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const loadingTask = pdfjsLib.getDocument({
          url,
          // Disable features that could leak content
          disableAutoFetch: false,
          disableStream: false,
        });
        
        const pdf = await loadingTask.promise;
        setPdfDoc(pdf);
        setTotalPages(pdf.numPages);
        setCurrentPage(1);
      } catch (err) {
        console.error('Error loading PDF:', err);
        setError('Failed to load PDF. The file may be corrupted or inaccessible.');
      } finally {
        setLoading(false);
      }
    };

    if (url) {
      loadPdf();
    }

    // Cleanup
    return () => {
      if (pdfDoc) {
        pdfDoc.destroy();
      }
    };
  }, [url]);

  // Render current page
  const renderPage = useCallback(async () => {
    if (!pdfDoc || !canvasRef.current || rendering) return;

    setRendering(true);
    
    try {
      const page = await pdfDoc.getPage(currentPage);
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (!context) return;

      const viewport = page.getViewport({ scale });
      
      // Set canvas dimensions
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      // Render page
      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      await page.render(renderContext).promise;
    } catch (err) {
      console.error('Error rendering page:', err);
      setError('Failed to render page');
    } finally {
      setRendering(false);
    }
  }, [pdfDoc, currentPage, scale, rendering]);

  // Re-render when page or scale changes
  useEffect(() => {
    renderPage();
  }, [renderPage]);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.25, 0.5));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading PDF...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="text-center">
          <p className="text-destructive mb-2">{error}</p>
          <p className="text-sm text-muted-foreground">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <SecurityWrapper className="h-full flex flex-col">
      {/* Controls */}
      <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b shrink-0">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrevPage}
            disabled={currentPage <= 1 || rendering}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm text-muted-foreground min-w-[80px] text-center">
            {currentPage} / {totalPages}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNextPage}
            disabled={currentPage >= totalPages || rendering}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={handleZoomOut} disabled={scale <= 0.5}>
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-sm text-muted-foreground min-w-[50px] text-center">
            {Math.round(scale * 100)}%
          </span>
          <Button variant="ghost" size="icon" onClick={handleZoomIn} disabled={scale >= 3}>
            <ZoomIn className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* PDF Canvas */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-auto flex items-start justify-center p-4 bg-muted/20"
      >
        <canvas
          ref={canvasRef}
          className="shadow-lg"
          style={{
            maxWidth: '100%',
            height: 'auto',
            pointerEvents: 'none', // Prevent interactions with canvas
          }}
        />
        {rendering && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        )}
      </div>
    </SecurityWrapper>
  );
};

export default SecurePDFViewer;
