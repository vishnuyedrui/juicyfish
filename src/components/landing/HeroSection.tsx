import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogIn, Calculator, ChevronDown } from "lucide-react";
import { SunburstPattern, FanCorner } from "./DecoPattern";

const HeroSection = () => {
  const scrollToFeatures = () => {
    const featuresSection = document.getElementById("features");
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden deco-gradient-navy pt-16">
      {/* Background Pattern */}
      <SunburstPattern className="opacity-60" />
      
      {/* Corner Decorations */}
      <div className="absolute top-20 left-4 opacity-40">
        <FanCorner position="top-left" />
      </div>
      <div className="absolute top-20 right-4 opacity-40">
        <FanCorner position="top-right" />
      </div>

      {/* Content */}
      <div className="relative z-10 container max-w-4xl mx-auto px-4 lg:px-8 text-center">
        {/* Decorative Line */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-deco-gold/60" />
          <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
            <path d="M6 0 L12 6 L6 12 L0 6 Z" fill="hsl(42 85% 55%)" fillOpacity="0.8" />
          </svg>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-deco-gold/60" />
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 leading-tight tracking-tight">
          Your Academic Progress,
          <span className="block text-accent">Perfected</span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg sm:text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto leading-relaxed">
          Calculate SGPA & CGPA, track attendance, and access study resources — 
          all in one refined academic platform designed for focused students.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link to="/auth">
            <Button
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8 py-6 text-lg gap-2 deco-shadow transition-all hover:scale-105"
              aria-label="Sign In to Get Started"
            >
              <LogIn className="w-5 h-5" aria-hidden="true" />
              Sign In to Get Started
            </Button>
          </Link>
          <a href="#calculator">
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 font-semibold px-8 py-6 text-lg gap-2 transition-all hover:border-primary-foreground/50"
              aria-label="Try Calculator"
            >
              <Calculator className="w-5 h-5" aria-hidden="true" />
              Try Calculator
            </Button>
          </a>
        </div>

        {/* Scroll Indicator */}
        <button
          onClick={scrollToFeatures}
          className="inline-flex flex-col items-center text-primary-foreground/60 hover:text-primary-foreground/80 transition-colors animate-fade-in"
          aria-label="Scroll to learn more"
        >
          <span className="text-sm tracking-wider uppercase mb-2">Discover More</span>
          <ChevronDown className="w-6 h-6 animate-bounce" aria-hidden="true" />
        </button>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          className="w-full h-16 sm:h-24"
          viewBox="0 0 1200 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0 50 Q300 0 600 50 T1200 50 L1200 100 L0 100 Z"
            fill="hsl(45 30% 97%)"
          />
        </svg>
      </div>
    </section>
  );
};

export { HeroSection };
