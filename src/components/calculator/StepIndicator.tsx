import { cn } from "@/lib/utils";
import { Check, BookOpen, Award, Calculator, TrendingUp } from "lucide-react";

interface StepIndicatorProps {
  currentStep: number;
  completedSteps: number[];
}

const steps = [
  { id: 1, name: "Course & WGP", shortName: "WGP", icon: BookOpen },
  { id: 2, name: "Letter Grade", shortName: "Grade", icon: Award },
  { id: 3, name: "SGPA", shortName: "SGPA", icon: Calculator },
  { id: 4, name: "CGPA", shortName: "CGPA", icon: TrendingUp },
];

export function StepIndicator({ currentStep, completedSteps }: StepIndicatorProps) {
  return (
    <div className="w-full py-4 sm:py-6">
      <div className="flex items-center justify-between max-w-2xl mx-auto px-2 sm:px-4">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(step.id);
          const isCurrent = currentStep === step.id;
          const Icon = step.icon;
          
          return (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-8 h-8 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-300",
                    isCompleted
                      ? "bg-accent text-accent-foreground"
                      : isCurrent
                      ? "bg-primary text-primary-foreground ring-2 sm:ring-4 ring-primary/20"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 sm:w-6 sm:h-6" />
                  ) : (
                    <Icon className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
                  )}
                </div>
                <span
                  className={cn(
                    "mt-1 sm:mt-2 text-[10px] sm:text-xs font-medium text-center max-w-[50px] sm:max-w-none",
                    isCurrent ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  <span className="hidden sm:inline">{step.name}</span>
                  <span className="sm:hidden">{step.shortName}</span>
                </span>
              </div>
              
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "w-4 sm:w-12 md:w-20 h-0.5 sm:h-1 mx-1 sm:mx-2 rounded-full transition-all duration-300",
                    completedSteps.includes(step.id) ? "bg-accent" : "bg-muted"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}