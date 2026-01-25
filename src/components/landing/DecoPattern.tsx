const SunburstPattern = ({ className = "" }: { className?: string }) => (
  <svg
    className={`absolute inset-0 w-full h-full ${className}`}
    viewBox="0 0 1200 800"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="sunburstGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="hsl(42 85% 55%)" stopOpacity="0.08" />
        <stop offset="100%" stopColor="hsl(38 80% 45%)" stopOpacity="0.03" />
      </linearGradient>
    </defs>
    {/* Radiating lines from center-bottom */}
    <g stroke="url(#sunburstGold)" strokeWidth="1" fill="none">
      {Array.from({ length: 24 }).map((_, i) => {
        const angle = (i * 7.5) - 90;
        const x2 = 600 + Math.cos((angle * Math.PI) / 180) * 1000;
        const y2 = 900 + Math.sin((angle * Math.PI) / 180) * 1000;
        return <line key={i} x1="600" y1="900" x2={x2} y2={y2} />;
      })}
    </g>
    {/* Concentric arcs */}
    <g stroke="hsl(42 85% 55%)" strokeOpacity="0.06" strokeWidth="1" fill="none">
      <circle cx="600" cy="900" r="300" />
      <circle cx="600" cy="900" r="500" />
      <circle cx="600" cy="900" r="700" />
    </g>
  </svg>
);

const DiamondPattern = ({ className = "" }: { className?: string }) => (
  <svg
    className={`absolute inset-0 w-full h-full ${className}`}
    viewBox="0 0 100 100"
    preserveAspectRatio="none"
    aria-hidden="true"
  >
    <defs>
      <pattern id="diamondPattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
        <path
          d="M10 0 L20 10 L10 20 L0 10 Z"
          fill="none"
          stroke="hsl(42 85% 55%)"
          strokeOpacity="0.08"
          strokeWidth="0.5"
        />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#diamondPattern)" />
  </svg>
);

const ChevronBorder = ({ className = "" }: { className?: string }) => (
  <svg
    className={`w-full h-4 ${className}`}
    viewBox="0 0 1200 16"
    preserveAspectRatio="none"
    aria-hidden="true"
  >
    <defs>
      <pattern id="chevronPattern" x="0" y="0" width="24" height="16" patternUnits="userSpaceOnUse">
        <path
          d="M0 16 L12 0 L24 16"
          fill="none"
          stroke="hsl(42 85% 55%)"
          strokeWidth="1"
        />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#chevronPattern)" />
  </svg>
);

const FanCorner = ({ position = "top-left", className = "" }: { position?: string; className?: string }) => {
  const transforms: Record<string, string> = {
    "top-left": "",
    "top-right": "scale(-1, 1)",
    "bottom-left": "scale(1, -1)",
    "bottom-right": "scale(-1, -1)",
  };

  return (
    <svg
      className={`w-24 h-24 ${className}`}
      viewBox="0 0 100 100"
      style={{ transform: transforms[position] }}
      aria-hidden="true"
    >
      <g stroke="hsl(42 85% 55%)" strokeOpacity="0.3" strokeWidth="1" fill="none">
        <path d="M0 0 Q50 0 50 50" />
        <path d="M0 0 Q40 0 40 40" />
        <path d="M0 0 Q30 0 30 30" />
        <path d="M0 0 Q20 0 20 20" />
      </g>
    </svg>
  );
};

export { SunburstPattern, DiamondPattern, ChevronBorder, FanCorner };
