interface DecoDividerProps {
  className?: string;
  variant?: "diamond" | "line" | "chevron";
}

const DecoDivider = ({ className = "", variant = "diamond" }: DecoDividerProps) => {
  if (variant === "line") {
    return (
      <div className={`flex items-center justify-center py-8 ${className}`}>
        <div className="h-px w-24 bg-gradient-to-r from-transparent via-deco-gold to-transparent" />
      </div>
    );
  }

  if (variant === "chevron") {
    return (
      <div className={`flex items-center justify-center py-6 ${className}`}>
        <svg width="60" height="20" viewBox="0 0 60 20" aria-hidden="true">
          <path
            d="M0 10 L30 0 L60 10 L30 20 Z"
            fill="none"
            stroke="hsl(42 85% 55%)"
            strokeWidth="1"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center gap-4 py-8 ${className}`}>
      <div className="h-px flex-1 max-w-32 bg-gradient-to-r from-transparent to-deco-gold/40" />
      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
        <path
          d="M8 0 L16 8 L8 16 L0 8 Z"
          fill="hsl(42 85% 55%)"
          fillOpacity="0.8"
        />
      </svg>
      <div className="h-px flex-1 max-w-32 bg-gradient-to-l from-transparent to-deco-gold/40" />
    </div>
  );
};

export { DecoDivider };
