import { Heart } from "lucide-react";

const LandingFooter = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="py-12 bg-landing-card border-t border-landing-accent/10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-6">
          {/* Mascot */}
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-landing-accent to-landing-accent-light flex items-center justify-center text-4xl animate-bounce-gentle shadow-lg shadow-landing-accent/20">
              🦕
            </div>
            {/* Waving hand */}
            <div className="absolute -right-2 -top-2 text-2xl animate-wave">
              👋
            </div>
          </div>

          {/* Logo Text */}
          <div className="text-center">
            <h3 className="text-2xl font-bold text-landing-text mb-2">
              GradeGuru <span className="text-landing-accent">by TeamDino</span>
            </h3>
            <p className="text-landing-muted flex items-center justify-center gap-2">
              Built with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> for students, by students
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-6 text-landing-muted text-sm">
            <a href="#features" className="hover:text-landing-accent transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-landing-accent transition-colors">
              How It Works
            </a>
            <a href="/auth" className="hover:text-landing-accent transition-colors">
              Login
            </a>
          </div>

          {/* Back to Top */}
          <button
            onClick={scrollToTop}
            className="mt-4 px-6 py-2 rounded-full bg-landing-accent/10 border border-landing-accent/20 text-landing-accent text-sm font-medium hover:bg-landing-accent/20 transition-all duration-300 hover:scale-105"
          >
            ↑ Back to Top
          </button>

          {/* Copyright */}
          <div className="text-landing-muted/50 text-xs mt-4">
            © {new Date().getFullYear()} TeamDino. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
