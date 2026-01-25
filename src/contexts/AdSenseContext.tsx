import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

interface AdSenseContextType {
  adsEnabled: boolean;
  isAdAllowedPage: boolean;
  isContentLoaded: boolean;
  setAdsEnabled: (enabled: boolean) => void;
  setContentLoaded: (loaded: boolean) => void;
}

const AdSenseContext = createContext<AdSenseContextType | undefined>(undefined);

// Routes where ads are NEVER allowed (login, admin, low-content pages)
const NO_ADS_ROUTES = [
  '/auth',
  '/admin',
  '/admin/login',
  '/admin/courses',
  '/admin/resources',
  '/admin/announcements',
  '/profile',
];

// Routes where ads ARE allowed (content-rich educational pages)
const ADS_ALLOWED_ROUTES = [
  '/',           // Grade Calculator - rich educational content
  '/courses',    // Course listing with content
  '/attendance', // Attendance tool with educational value
  '/dashboard',  // Student dashboard with announcements and content
];

// Check if a path matches any pattern (supports dynamic routes like /courses/:id)
const matchesRoute = (pathname: string, routes: string[]): boolean => {
  return routes.some(route => {
    if (route.includes(':')) {
      // Handle dynamic routes
      const routeParts = route.split('/');
      const pathParts = pathname.split('/');
      if (routeParts.length !== pathParts.length) return false;
      return routeParts.every((part, index) => 
        part.startsWith(':') || part === pathParts[index]
      );
    }
    // Exact match or starts with (for nested admin routes)
    return pathname === route || pathname.startsWith(route + '/');
  });
};

export const AdSenseProvider = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const [adsEnabled, setAdsEnabled] = useState(true);
  const [isContentLoaded, setContentLoaded] = useState(false);

  // Determine if current page allows ads
  const isAdAllowedPage = React.useMemo(() => {
    const pathname = location.pathname;
    
    // First check if explicitly blocked
    if (matchesRoute(pathname, NO_ADS_ROUTES)) {
      return false;
    }
    
    // Check if explicitly allowed or is a content page like /courses/:id
    if (matchesRoute(pathname, ADS_ALLOWED_ROUTES)) {
      return true;
    }
    
    // Allow ads on course detail pages (/courses/:id)
    if (pathname.match(/^\/courses\/[^/]+$/)) {
      return true;
    }
    
    // Default: don't show ads on unknown pages (404, etc.)
    return false;
  }, [location.pathname]);

  // Reset content loaded state on navigation
  useEffect(() => {
    setContentLoaded(false);
  }, [location.pathname]);

  return (
    <AdSenseContext.Provider value={{
      adsEnabled,
      isAdAllowedPage,
      isContentLoaded,
      setAdsEnabled,
      setContentLoaded,
    }}>
      {children}
    </AdSenseContext.Provider>
  );
};

export const useAdSense = () => {
  const context = useContext(AdSenseContext);
  if (context === undefined) {
    throw new Error('useAdSense must be used within an AdSenseProvider');
  }
  return context;
};
