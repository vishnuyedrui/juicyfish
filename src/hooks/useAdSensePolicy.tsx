import { useLocation } from 'react-router-dom';
import { useMemo } from 'react';

interface AdPolicyResult {
  canShowAds: boolean;
  pageType: 'content' | 'auth' | 'admin' | 'settings' | 'error' | 'loading';
  reason: string;
}

// Routes categorized by content level
const PAGE_CATEGORIES = {
  // High content pages - ads allowed
  content: [
    '/',           // Grade Calculator with educational content
    '/courses',    // Course listing
    '/attendance', // Attendance tracker with stats
    '/dashboard',  // Dashboard with announcements
  ],
  // Auth pages - no ads
  auth: ['/auth'],
  // Admin pages - no ads
  admin: [
    '/admin',
    '/admin/login',
    '/admin/courses',
    '/admin/resources',
    '/admin/announcements',
  ],
  // Settings/profile pages - no ads
  settings: ['/profile'],
};

export const useAdSensePolicy = (): AdPolicyResult => {
  const location = useLocation();

  return useMemo(() => {
    const pathname = location.pathname;

    // Check auth pages
    if (PAGE_CATEGORIES.auth.some(route => pathname === route)) {
      return {
        canShowAds: false,
        pageType: 'auth',
        reason: 'Login and signup pages cannot display ads',
      };
    }

    // Check admin pages (includes nested routes)
    if (PAGE_CATEGORIES.admin.some(route => 
      pathname === route || pathname.startsWith(route + '/')
    )) {
      return {
        canShowAds: false,
        pageType: 'admin',
        reason: 'Admin pages are not public-facing and cannot display ads',
      };
    }

    // Check settings pages
    if (PAGE_CATEGORIES.settings.some(route => pathname === route)) {
      return {
        canShowAds: false,
        pageType: 'settings',
        reason: 'Profile/settings pages have minimal content',
      };
    }

    // Check content pages
    if (PAGE_CATEGORIES.content.some(route => pathname === route)) {
      return {
        canShowAds: true,
        pageType: 'content',
        reason: 'Page has meaningful educational content',
      };
    }

    // Check dynamic course detail pages (/courses/:id)
    if (pathname.match(/^\/courses\/[^/]+$/)) {
      return {
        canShowAds: true,
        pageType: 'content',
        reason: 'Course detail page with educational resources',
      };
    }

    // Default: treat as error/unknown page - no ads
    return {
      canShowAds: false,
      pageType: 'error',
      reason: 'Unknown or error page - no ads allowed',
    };
  }, [location.pathname]);
};
