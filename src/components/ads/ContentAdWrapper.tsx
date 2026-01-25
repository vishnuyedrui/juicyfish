import { ReactNode } from 'react';
import { AdUnit } from './AdUnit';
import { useAdSensePolicy } from '@/hooks/useAdSensePolicy';

interface ContentAdWrapperProps {
  children: ReactNode;
  showAdAfter?: boolean;
  showAdBefore?: boolean;
  adSlot?: string;
  className?: string;
}

/**
 * ContentAdWrapper - Ensures ads are always surrounded by meaningful content
 * 
 * This wrapper:
 * 1. Validates that content exists before showing ads
 * 2. Places ads in appropriate positions relative to content
 * 3. Ensures proper spacing and visual separation
 */
export const ContentAdWrapper = ({
  children,
  showAdAfter = true,
  showAdBefore = false,
  adSlot = '',
  className = '',
}: ContentAdWrapperProps) => {
  const { canShowAds } = useAdSensePolicy();

  return (
    <div className={`content-ad-wrapper ${className}`}>
      {/* Ad before content (if enabled and allowed) */}
      {showAdBefore && canShowAds && (
        <div className="ad-placement ad-before-content mb-6">
          <AdUnit slot={adSlot} format="horizontal" />
        </div>
      )}

      {/* Main content - always rendered */}
      <div className="main-content">
        {children}
      </div>

      {/* Ad after content (if enabled and allowed) */}
      {showAdAfter && canShowAds && (
        <div className="ad-placement ad-after-content mt-6">
          <AdUnit slot={adSlot} format="horizontal" />
        </div>
      )}
    </div>
  );
};
