import { Calendar, Calculator, FileArchive, FolderOpen, Video } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const features = [
  {
    icon: Calendar,
    title: "Attendance Tracker",
    description:
      "Track your daily attendance across all subjects with smart reminders and analytics.",
    gradient: "from-landing-accent/20 to-landing-accent-light/10",
  },
  {
    icon: Calculator,
    title: "Grade Calculator",
    description:
      "Calculate SGPA & CGPA instantly with our step-by-step grade calculator.",
    gradient: "from-landing-accent-light/20 to-landing-accent/10",
  },
  {
    icon: FileArchive,
    title: "Previous Question Papers",
    description:
      "Access past exam papers organized by subject and year for better preparation.",
    gradient: "from-landing-accent/20 to-landing-accent-light/10",
  },
  {
    icon: FolderOpen,
    title: "Subject Resources",
    description:
      "Find PPTs, PDFs, textbooks, and study materials organized by subject.",
    gradient: "from-landing-accent-light/20 to-landing-accent/10",
  },
  {
    icon: Video,
    title: "Live Classes",
    description:
      "Join live lectures online and never miss an important class again.",
    gradient: "from-landing-accent/20 to-landing-accent-light/10",
    isLive: true,
  },
];

const FeaturesSection = () => {
  const [visibleCards, setVisibleCards] = useState<number[]>([]);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute("data-index") || "0");
            setVisibleCards((prev) => [...new Set([...prev, index])]);
          }
        });
      },
      { threshold: 0.2 }
    );

    const cards = sectionRef.current?.querySelectorAll("[data-index]");
    cards?.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="features"
      ref={sectionRef}
      className="py-24 bg-landing-dark relative overflow-hidden"
    >
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-landing-accent/30 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(142_76%_36%/0.05),transparent_50%)]" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-landing-accent/10 border border-landing-accent/20 mb-6">
            <span className="text-landing-accent text-sm font-medium">
              ✨ Powerful Features
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-landing-text mb-6">
            Everything You Need to{" "}
            <span className="text-landing-accent">Succeed</span>
          </h2>
          <p className="text-landing-muted text-lg">
            GradeGuru combines all the essential tools for college success in
            one beautiful, easy-to-use platform.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              data-index={index}
              className={`group relative bg-landing-card rounded-2xl p-6 border border-landing-accent/10 transition-all duration-500 hover:border-landing-accent/30 hover:shadow-xl hover:shadow-landing-accent/10 hover:-translate-y-2 ${
                visibleCards.includes(index)
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Gradient Background */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              />

              <div className="relative z-10">
                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-landing-accent/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-7 h-7 text-landing-accent" />
                  {feature.isLive && (
                    <div className="absolute -top-1 -right-1 flex items-center gap-1 bg-red-500/90 rounded-full px-2 py-0.5">
                      <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse-live" />
                      <span className="text-white text-[10px] font-bold">
                        LIVE
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-landing-text mb-3 group-hover:text-landing-accent transition-colors">
                  {feature.title}
                </h3>
                <p className="text-landing-muted leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Hover Arrow */}
              <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                <span className="text-landing-accent text-xl">→</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
