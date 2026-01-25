import { Calculator, CalendarCheck, BookOpen } from "lucide-react";
import { FeatureCard } from "./FeatureCard";
import { DecoDivider } from "./DecoDivider";

const features = [
  {
    number: "01",
    title: "SGPA & CGPA Calculator",
    subtitle: "Precision at Your Fingertips",
    description:
      "Calculate your Semester and Cumulative Grade Point Average with pinpoint accuracy. Our calculator understands Indian university grading systems and provides instant, reliable results.",
    icon: Calculator,
    highlights: [
      "Weighted Grade Point calculations",
      "Support for multiple courses",
      "Instant SGPA to CGPA conversion",
      "Export results as PDF",
    ],
  },
  {
    number: "02",
    title: "Attendance Tracker",
    subtitle: "Never Miss a Deadline",
    description:
      "Know exactly where you stand with your attendance. Track each subject, see projections, and understand how many classes you can safely miss while staying above requirements.",
    icon: CalendarCheck,
    highlights: [
      "Subject-wise tracking",
      "What-if scenario simulations",
      "Holiday management",
      "Visual attendance insights",
    ],
  },
  {
    number: "03",
    title: "Study Resources Hub",
    subtitle: "Everything in One Place",
    description:
      "Access organized study materials, previous year papers, notes, and video lectures — all curated by branch and semester. No more hunting through scattered files and folders.",
    icon: BookOpen,
    highlights: [
      "Branch & semester organization",
      "Chapter-wise resources",
      "YouTube video integration",
      "Direct Drive link access",
    ],
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 bg-muted/30 relative overflow-hidden">
      {/* Subtle pattern */}
      <div className="absolute inset-0 deco-pattern-chevron opacity-20" aria-hidden="true" />

      <div className="relative z-10 container max-w-6xl mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-accent uppercase tracking-widest mb-3">
            Powerful Tools
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Everything You Need to Succeed
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Three essential tools designed to streamline your academic journey and help you focus on what matters — learning.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="space-y-20">
          {features.map((feature, index) => (
            <div key={feature.title}>
              <FeatureCard {...feature} reversed={index % 2 === 1} />
              {index < features.length - 1 && <DecoDivider variant="line" className="mt-20" />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export { FeaturesSection };
