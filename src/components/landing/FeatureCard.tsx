import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  icon: LucideIcon;
  highlights: string[];
  reversed?: boolean;
}

const FeatureCard = ({
  number,
  title,
  subtitle,
  description,
  icon: Icon,
  highlights,
  reversed = false,
}: FeatureCardProps) => {
  return (
    <div
      className={`flex flex-col ${reversed ? "lg:flex-row-reverse" : "lg:flex-row"} items-center gap-8 lg:gap-16`}
    >
      {/* Content */}
      <div className="flex-1 text-center lg:text-left">
        {/* Number Badge */}
        <div className="inline-flex items-center gap-3 mb-4">
          <span className="text-5xl font-bold text-accent/20">{number}</span>
          <div className="h-px w-12 bg-accent/40" />
        </div>

        {/* Title */}
        <p className="text-sm font-semibold text-accent uppercase tracking-widest mb-2">
          {subtitle}
        </p>
        <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
          {title}
        </h3>
        <p className="text-muted-foreground leading-relaxed mb-6">
          {description}
        </p>

        {/* Highlights */}
        <ul className="space-y-3">
          {highlights.map((highlight, index) => (
            <li key={index} className="flex items-center gap-3 text-foreground/80">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                className="flex-shrink-0"
                aria-hidden="true"
              >
                <path
                  d="M8 0 L16 8 L8 16 L0 8 Z"
                  fill="hsl(42 85% 55%)"
                />
              </svg>
              <span>{highlight}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Visual */}
      <div className="flex-1 w-full max-w-md">
        <div className="relative bg-card rounded-lg p-8 deco-shadow border border-border">
          {/* Decorative corner */}
          <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 -translate-y-1/2 translate-x-1/2 bg-accent/10 rounded-full" />
          </div>

          {/* Icon Display */}
          <div className="relative z-10 flex flex-col items-center justify-center py-8">
            <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mb-4 deco-shadow">
              <Icon className="w-12 h-12 text-primary-foreground" aria-hidden="true" />
            </div>
            <p className="text-lg font-semibold text-foreground">{title}</p>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>

          {/* Bottom decoration */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent/40" />
            <div className="w-3 h-3 rounded-full bg-accent/60" />
            <div className="w-2 h-2 rounded-full bg-accent/40" />
          </div>
        </div>
      </div>
    </div>
  );
};

export { FeatureCard };
