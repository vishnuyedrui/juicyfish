import { Users, Calculator, BookOpen } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: "1000+",
    label: "Active Students",
  },
  {
    icon: Calculator,
    value: "50K+",
    label: "Calculations Done",
  },
  {
    icon: BookOpen,
    value: "500+",
    label: "Study Resources",
  },
];

const TrustSection = () => {
  return (
    <section className="py-20 bg-muted/30 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-accent/5 rounded-full blur-3xl" aria-hidden="true" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" aria-hidden="true" />

      <div className="relative z-10 container max-w-4xl mx-auto px-4 lg:px-8 text-center">
        {/* Header */}
        <p className="text-sm font-semibold text-accent uppercase tracking-widest mb-3">
          Trusted by Students
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
          Built for Students, By Students
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto mb-12">
          JuicyFish was created by Team Dino to solve the exact problems we faced as engineering students. 
          Every feature is designed with real student needs in mind.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-accent/10 mb-3">
                <stat.icon className="w-6 h-6 text-accent" aria-hidden="true" />
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Team Attribution */}
        <div className="mt-16 pt-8 border-t border-border/50">
          <p className="text-muted-foreground">
            A product of{" "}
            <a
              href="https://teamdino.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent font-semibold hover:underline"
            >
              Team Dino
            </a>
            {" "}— Building tools that matter for students who care.
          </p>
        </div>
      </div>
    </section>
  );
};

export { TrustSection };
