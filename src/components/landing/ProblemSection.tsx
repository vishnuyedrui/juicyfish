import { Calculator, FolderOpen, Calendar } from "lucide-react";
import { DecoDivider } from "./DecoDivider";

const problems = [
  {
    icon: Calculator,
    title: "Manual Calculations",
    description: "Spreadsheets, calculators, and endless formulas that often lead to errors and frustration.",
  },
  {
    icon: FolderOpen,
    title: "Scattered Resources",
    description: "Notes, PDFs, and study materials spread across drives, emails, and countless folders.",
  },
  {
    icon: Calendar,
    title: "Attendance Anxiety",
    description: "Constant uncertainty about how many classes you can miss without falling below requirements.",
  },
];

const ProblemSection = () => {
  return (
    <section className="py-20 bg-background relative overflow-hidden">
      {/* Subtle pattern background */}
      <div className="absolute inset-0 deco-pattern-lines opacity-30" aria-hidden="true" />

      <div className="relative z-10 container max-w-6xl mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-accent uppercase tracking-widest mb-3">
            The Challenge
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Academic Life Shouldn't Be This Hard
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Every student faces these struggles. We built JuicyFish to solve them once and for all.
          </p>
        </div>

        {/* Problem Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {problems.map((problem, index) => (
            <article
              key={problem.title}
              className="group relative bg-card rounded-lg p-8 deco-shadow border border-border hover:border-accent/30 transition-all duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Number Badge */}
              <div className="absolute -top-3 -right-3 w-8 h-8 bg-accent text-accent-foreground rounded-full flex items-center justify-center font-bold text-sm">
                {index + 1}
              </div>

              {/* Icon */}
              <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-accent/10 transition-colors">
                <problem.icon className="w-7 h-7 text-primary group-hover:text-accent transition-colors" aria-hidden="true" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {problem.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {problem.description}
              </p>
            </article>
          ))}
        </div>

        <DecoDivider className="mt-16" />
      </div>
    </section>
  );
};

export { ProblemSection };
