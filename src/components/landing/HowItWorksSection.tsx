import { LogIn, Calendar, Calculator, BookOpen } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const steps = [
  {
    icon: LogIn,
    number: "01",
    title: "Login Once",
    description: "Quick sign-in to your secure GradeGuru account",
  },
  {
    icon: Calendar,
    number: "02",
    title: "Track Attendance",
    description: "Mark your daily attendance in just seconds",
  },
  {
    icon: Calculator,
    number: "03",
    title: "Calculate SGPA & CGPA",
    description: "Get instant, accurate grade calculations",
  },
  {
    icon: BookOpen,
    number: "04",
    title: "Access Resources",
    description: "Browse study materials and join live classes",
  },
];

const HowItWorksSection = () => {
  const [visibleSteps, setVisibleSteps] = useState<number[]>([]);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute("data-step") || "0");
            setTimeout(() => {
              setVisibleSteps((prev) => [...new Set([...prev, index])]);
            }, index * 200);
          }
        });
      },
      { threshold: 0.3 }
    );

    const stepElements = sectionRef.current?.querySelectorAll("[data-step]");
    stepElements?.forEach((step) => observer.observe(step));

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="py-24 bg-landing-card relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(142_76%_36%/0.05),transparent_50%)]" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-landing-accent/10 border border-landing-accent/20 mb-6">
            <span className="text-landing-accent text-sm font-medium">
              🚀 Simple Steps
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-landing-text mb-6">
            How <span className="text-landing-accent">GradeGuru</span> Works
          </h2>
          <p className="text-landing-muted text-lg">
            Get started in minutes and take control of your academic journey
          </p>
        </div>

        {/* Steps Container */}
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Connection Line (Desktop) */}
            <div className="hidden lg:block absolute top-14 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-landing-accent via-landing-accent-light to-landing-accent opacity-20" />

            {steps.map((step, index) => (
              <div
                key={index}
                data-step={index}
                className={`relative transition-all duration-700 ${
                  visibleSteps.includes(index)
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
              >
                {/* Step Card */}
                <div className="flex flex-col items-center text-center">
                  {/* Icon Circle */}
                  <div className="relative mb-6">
                    <div
                      className={`w-28 h-28 rounded-full bg-landing-dark border-2 border-landing-accent/30 flex items-center justify-center transition-all duration-500 ${
                        visibleSteps.includes(index)
                          ? "scale-100 shadow-lg shadow-landing-accent/20"
                          : "scale-90"
                      }`}
                    >
                      <step.icon className="w-12 h-12 text-landing-accent" />
                    </div>

                    {/* Step Number */}
                    <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-landing-accent flex items-center justify-center">
                      <span className="text-landing-dark font-bold text-sm">
                        {step.number}
                      </span>
                    </div>

                    {/* Pulse Effect */}
                    <div
                      className={`absolute inset-0 rounded-full border-2 border-landing-accent/50 ${
                        visibleSteps.includes(index) ? "animate-ping-slow" : ""
                      }`}
                    />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-landing-text mb-2">
                    {step.title}
                  </h3>
                  <p className="text-landing-muted text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Arrow (Mobile/Tablet) */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden flex justify-center my-4">
                    <div className="w-0.5 h-8 bg-gradient-to-b from-landing-accent to-transparent" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
