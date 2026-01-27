import { CheckCircle, Zap, Shield, Smartphone } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Instant Calculations",
    description: "Get accurate SGPA and CGPA results in seconds with our optimized calculator.",
    color: "bg-pop-yellow",
    emoji: "⚡",
  },
  {
    icon: CheckCircle,
    title: "Attendance Insights",
    description: "Know exactly how many classes you can miss while staying above the threshold.",
    color: "bg-pop-green",
    emoji: "✅",
  },
  {
    icon: Shield,
    title: "Reliable & Secure",
    description: "Your data is protected with modern security practices. No unnecessary tracking.",
    color: "bg-pop-purple",
    emoji: "🛡️",
  },
  {
    icon: Smartphone,
    title: "Works Everywhere",
    description: "Access from any device. Download our Android app for on-the-go calculations.",
    color: "bg-pop-cyan",
    emoji: "📱",
  },
];

export function FeatureSection() {
  return (
    <section className="container mx-auto px-4 lg:px-8 py-16">
      {/* Section Header */}
      <div className="text-center mb-12">
        <span className="inline-block px-4 py-2 rounded-full bg-pop-pink/10 text-pop-pink font-black text-sm mb-4 animate-bounce-in">
          Why JuicyFish? 🐟
        </span>
        <h2 className="text-3xl lg:text-4xl font-black text-foreground tracking-tight">
          Built for <span className="text-pop-pink">Student Success</span>
        </h2>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        {features.map((feature, index) => (
          <div 
            key={feature.title}
            className="text-center p-6 rounded-3xl bg-card border-[3px] border-foreground/10 pop-shadow transition-all duration-300 hover:scale-105 hover:translate-y-[-4px] hover:pop-shadow-lg"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl ${feature.color} flex items-center justify-center pop-shadow transition-transform duration-300 hover:rotate-6`}>
              <feature.icon className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-black text-foreground mb-2">
              {feature.title} {feature.emoji}
            </h3>
            <p className="text-muted-foreground font-medium text-sm leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
