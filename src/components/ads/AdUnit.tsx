import { useEffect, useRef } from 'react';
import { useAdSensePolicy } from '@/hooks/useAdSensePolicy';

interface AdUnitProps {
  slot?: string;
  format?: 'auto' | 'horizontal' | 'vertical' | 'rectangle';
  className?: string;
  minContentHeight?: number; // Minimum content height before showing ad
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export const AdUnit = ({ 
  slot = '', 
  format = 'auto', 
  className = '',
  minContentHeight = 200,
}: AdUnitProps) => {
  const adRef = useRef<HTMLModElement>(null);
  const { canShowAds, reason } = useAdSensePolicy();

  useEffect(() => {
    // Only initialize ad if:
    // 1. Ads are allowed on this page
    // 2. AdSense script is loaded
    // 3. Page has sufficient content
    if (!canShowAds) {
      console.log(`[AdSense] Ads blocked on this page: ${reason}`);
      return;
    }

    // Check if document has sufficient content
    const mainContent = document.querySelector('main');
    if (mainContent && mainContent.scrollHeight < minContentHeight) {
      console.log('[AdSense] Insufficient content height, skipping ad');
      return;
    }

    try {
      if (window.adsbygoogle && adRef.current) {
        // Check if ad is already initialized
        if (!adRef.current.dataset.adStatus) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          console.log('[AdSense] Ad unit initialized');
        }
      }
    } catch (error) {
      console.error('[AdSense] Error initializing ad:', error);
    }
  }, [canShowAds, reason, minContentHeight]);

  // Don't render anything if ads are not allowed
  if (!canShowAds) {
    return null;
  }

  return (
    <div className={`ad-container my-4 ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-3849772039813147"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
};
