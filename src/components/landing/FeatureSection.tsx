import { Zap, Shield, Smartphone } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Instant Results",
    description: "Get accurate SGPA and CGPA in seconds. Our calculator handles the math so you don't have to.",
  },
  {
    icon: Shield,
    title: "Private & Secure",
    description: "Your data stays on your device for basic calculations. No tracking, no unnecessary accounts.",
  },
  {
    icon: Smartphone,
    title: "Works Everywhere",
    description: "Use on any device. Download our Android app for offline access when you need it.",
  },
];

export function FeatureSection() {
  return (
    <section className="container mx-auto px-4 lg:px-8 py-20">
      {/* Section Header */}
      <div className="max-w-xl mb-12">
        <h2 className="text-2xl lg:text-3xl font-bold text-foreground tracking-tight mb-3">
          Built for students, by students
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          We built JuicyFish because we needed it ourselves. No corporate fluff, just tools that work.
        </p>
      </div>

      {/* Features - Offset Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {features.map((feature, index) => (
          <div 
            key={feature.title}
            className={`p-6 rounded-2xl bg-card border border-border transition-all duration-200 hover:border-primary/20 hover:shadow-sm ${
              index === 1 ? 'md:translate-y-4' : ''
            }`}
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <feature.icon className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">
              {feature.title}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
