import { cn } from "@/lib/utils";

interface GradeBadgeProps {
  letter: string;
  point: number;
  size?: "sm" | "md" | "lg";
}

const gradeColors: Record<string, string> = {
  'O': 'bg-grade-o',
  'A+': 'bg-grade-a-plus',
  'A': 'bg-grade-a',
  'B+': 'bg-grade-b-plus',
  'B': 'bg-grade-b',
  'C': 'bg-grade-c',
  'P': 'bg-grade-p',
  'I': 'bg-grade-p', // I grade uses same color as P (grade point 4)
  'F': 'bg-grade-f',
  'Ab/R': 'bg-grade-f',
  'L/AB': 'bg-grade-f',
};

export function GradeBadge({ letter, point, size = "md" }: GradeBadgeProps) {
  const sizeClasses = {
    sm: "w-10 h-10 text-sm",
    md: "w-14 h-14 text-lg",
    lg: "w-20 h-20 text-2xl",
  };

  return (
    <div
      className={cn(
        "rounded-full flex flex-col items-center justify-center text-white font-bold shadow-lg",
        gradeColors[letter] || 'bg-muted',
        sizeClasses[size]
      )}
    >
      <span>{letter}</span>
      {size !== "sm" && (
        <span className="text-xs opacity-80">({point})</span>
      )}
    </div>
  );
}