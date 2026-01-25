import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface BentoCardProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "featured" | "accent" | "navy" | "pink" | "cyan" | "yellow" | "green";
  hover?: boolean;
}

export function BentoCard({ 
  children, 
  className, 
  variant = "default",
  hover = true 
}: BentoCardProps) {
  const variants = {
    default: "bg-card border-[3px] border-foreground/10",
    featured: "bg-gradient-to-br from-pop-pink/10 to-pop-purple/10 border-[3px] border-pop-pink/30",
    accent: "bg-gradient-to-br from-pop-yellow/20 to-pop-orange/20 border-[3px] border-pop-yellow/40",
    navy: "pop-gradient-pink text-white border-[3px] border-foreground/20",
    pink: "bg-pop-pink/10 border-[3px] border-pop-pink/30",
    cyan: "bg-pop-cyan/10 border-[3px] border-pop-cyan/30",
    yellow: "bg-pop-yellow/10 border-[3px] border-pop-yellow/30",
    green: "bg-pop-green/10 border-[3px] border-pop-green/30",
  };

  return (
    <div 
      className={cn(
        "rounded-3xl p-6 lg:p-8 pop-shadow transition-all duration-300",
        variants[variant],
        hover && "hover:pop-shadow-lg hover:scale-[1.02] hover:translate-x-[-2px] hover:translate-y-[-2px]",
        className
      )}
    >
      {children}
    </div>
  );
}
