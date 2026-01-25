import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogIn, Download, ArrowRight } from "lucide-react";
import { SunburstPattern } from "./DecoPattern";

const CTASection = () => {
  return (
    <section className="relative py-24 overflow-hidden deco-gradient-navy">
      {/* Background Pattern */}
      <SunburstPattern className="opacity-50" />

      {/* Content */}
      <div className="relative z-10 container max-w-3xl mx-auto px-4 lg:px-8 text-center">
        {/* Decorative Line */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-deco-gold/60" />
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M8 0 L16 8 L8 16 L0 8 Z" fill="hsl(42 85% 55%)" fillOpacity="0.8" />
          </svg>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-deco-gold/60" />
        </div>

        {/* Headline */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
          Ready to Take Control of Your
          <span className="block text-accent">Academic Journey?</span>
        </h2>

        {/* Subtext */}
        <p className="text-lg text-primary-foreground/80 mb-10 max-w-xl mx-auto">
          Join thousands of students who've simplified their academic life with JuicyFish. 
          It's free, fast, and built for success.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/auth">
            <Button
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8 py-6 text-lg gap-2 deco-shadow transition-all hover:scale-105 group"
              aria-label="Sign In to Get Started"
            >
              <LogIn className="w-5 h-5" aria-hidden="true" />
              Sign In to Get Started
              <ArrowRight className="w-4 h-4 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" aria-hidden="true" />
            </Button>
          </Link>
          <a href="/downloads/juicyfish.apk" download="JuicyFish.apk">
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 font-semibold px-8 py-6 text-lg gap-2 transition-all hover:border-primary-foreground/50"
              aria-label="Download Android App"
            >
              <Download className="w-5 h-5" aria-hidden="true" />
              Download App
            </Button>
          </a>
        </div>

        {/* Trust Note */}
        <p className="mt-8 text-sm text-primary-foreground/60">
          No credit card required • Free forever • Built with ❤️ by students
        </p>
      </div>
    </section>
  );
};

export { CTASection };
