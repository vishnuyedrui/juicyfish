import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface BentoCardProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "primary" | "secondary" | "accent";
  hover?: boolean;
}

export function BentoCard({ 
  children, 
  className, 
  variant = "default",
  hover = true 
}: BentoCardProps) {
  const variants = {
    default: "bg-card border border-border",
    primary: "bg-primary/5 border border-primary/20",
    secondary: "bg-secondary/5 border border-secondary/20",
    accent: "bg-accent/5 border border-accent/20",
  };

  return (
    <div 
      className={cn(
        "rounded-2xl p-6 transition-all duration-200",
        variants[variant],
        hover && "hover:shadow-md hover:border-primary/20",
        className
      )}
    >
      {children}
    </div>
  );
}
