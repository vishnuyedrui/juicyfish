import { useEffect, ReactNode } from 'react';

interface SecurityWrapperProps {
  children: ReactNode;
  className?: string;
}

const SecurityWrapper = ({ children, className = '' }: SecurityWrapperProps) => {
  useEffect(() => {
    // Block keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // Block Ctrl+S (Save), Ctrl+P (Print), Ctrl+U (View Source)
      if (e.ctrlKey && ['s', 'p', 'u'].includes(e.key.toLowerCase())) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
      
      // Block Ctrl+Shift+I (DevTools)
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'i') {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
      
      // Block F12 (DevTools)
      if (e.key === 'F12') {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
      
      // Block Ctrl+Shift+C (Inspect element)
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    // Block context menu (right-click)
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // Block drag start
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
      return false;
    };

    // Block copy
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      return false;
    };

    // Add event listeners
    document.addEventListener('keydown', handleKeyDown, true);
    document.addEventListener('contextmenu', handleContextMenu, true);
    document.addEventListener('dragstart', handleDragStart, true);
    document.addEventListener('copy', handleCopy, true);

    return () => {
      // Cleanup event listeners
      document.removeEventListener('keydown', handleKeyDown, true);
      document.removeEventListener('contextmenu', handleContextMenu, true);
      document.removeEventListener('dragstart', handleDragStart, true);
      document.removeEventListener('copy', handleCopy, true);
    };
  }, []);

  return (
    <div 
      className={`secure-viewer-wrapper ${className}`}
      onContextMenu={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
      style={{
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
        WebkitTouchCallout: 'none',
      }}
    >
      {children}
    </div>
  );
};

export default SecurityWrapper;
