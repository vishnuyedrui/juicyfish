import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

interface AdSenseProps {
  slot: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal' | 'vertical';
  responsive?: boolean;
  className?: string;
}

const AdSense = ({ 
  slot, 
  format = 'auto', 
  responsive = true, 
  className = '' 
}: AdSenseProps) => {
  const adRef = useRef<HTMLModElement>(null);
  const isAdPushed = useRef(false);

  useEffect(() => {
    if (adRef.current && !isAdPushed.current) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        isAdPushed.current = true;
      } catch (err) {
        console.error('AdSense error:', err);
      }
    }
  }, []);

  return (
    <div className={`ad-container my-4 sm:my-6 ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-3849772039813147"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
};

// Horizontal banner ad - good for between sections
export const HorizontalAd = ({ slot, className = '' }: { slot: string; className?: string }) => (
  <AdSense slot={slot} format="horizontal" className={className} />
);

// In-article ad - good for content flow
export const InArticleAd = ({ slot, className = '' }: { slot: string; className?: string }) => (
  <AdSense slot={slot} format="fluid" className={className} />
);

// Responsive ad - auto-adjusts to container
export const ResponsiveAd = ({ slot, className = '' }: { slot: string; className?: string }) => (
  <AdSense slot={slot} format="auto" responsive={true} className={className} />
);

export default AdSense;
