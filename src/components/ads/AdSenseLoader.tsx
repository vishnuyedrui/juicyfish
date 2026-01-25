import { useEffect } from 'react';
import { useAdSensePolicy } from '@/hooks/useAdSensePolicy';

/**
 * AdSenseLoader - Conditionally loads the AdSense script only on pages with content
 * 
 * This component ensures AdSense is only loaded on pages that:
 * 1. Have meaningful, original content
 * 2. Are not login/auth pages
 * 3. Are not admin pages
 * 4. Are not error or loading screens
 */
export const AdSenseLoader = () => {
  const { canShowAds, pageType, reason } = useAdSensePolicy();

  useEffect(() => {
    // Only load AdSense on content-rich pages
    if (!canShowAds) {
      console.log(`[AdSenseLoader] Skipping AdSense load: ${reason} (page type: ${pageType})`);
      return;
    }

    // Check if script is already loaded
    const existingScript = document.querySelector('script[src*="adsbygoogle"]');
    if (existingScript) {
      console.log('[AdSenseLoader] AdSense script already loaded');
      return;
    }

    // Delay loading to prioritize main content (4 second delay as per original implementation)
    const loadTimeout = setTimeout(() => {
      // Double-check content exists before loading ads
      const mainContent = document.querySelector('main');
      const hasContent = mainContent && mainContent.textContent && mainContent.textContent.trim().length > 100;
      
      if (!hasContent) {
        console.log('[AdSenseLoader] Insufficient content, skipping AdSense load');
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3849772039813147';
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.id = 'adsense-script';
      
      script.onerror = () => {
        console.error('[AdSenseLoader] Failed to load AdSense script');
      };
      
      script.onload = () => {
        console.log('[AdSenseLoader] AdSense script loaded successfully');
      };

      document.head.appendChild(script);
    }, 4000);

    return () => {
      clearTimeout(loadTimeout);
    };
  }, [canShowAds, pageType, reason]);

  // This component doesn't render anything
  return null;
};
