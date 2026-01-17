import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LandingNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-landing-dark/95 backdrop-blur-md shadow-lg shadow-landing-accent/5"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-landing-accent to-landing-accent-light flex items-center justify-center animate-float-slow">
              <span className="text-xl">🦕</span>
            </div>
            <span className="text-xl font-bold text-landing-text">
              GradeGuru <span className="text-landing-accent">by TeamDino</span>
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection("hero")}
              className="text-landing-muted hover:text-landing-text transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection("features")}
              className="text-landing-muted hover:text-landing-text transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("how-it-works")}
              className="text-landing-muted hover:text-landing-text transition-colors"
            >
              How It Works
            </button>
            <Button
              onClick={() => navigate("/auth")}
              className="bg-landing-accent hover:bg-landing-accent-light text-landing-dark font-semibold px-6 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-landing-accent/30"
            >
              Login
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-landing-text"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-landing-dark/95 backdrop-blur-md border-t border-landing-card animate-fade-in">
            <div className="flex flex-col p-4 gap-4">
              <button
                onClick={() => scrollToSection("hero")}
                className="text-landing-muted hover:text-landing-text transition-colors text-left py-2"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection("features")}
                className="text-landing-muted hover:text-landing-text transition-colors text-left py-2"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("how-it-works")}
                className="text-landing-muted hover:text-landing-text transition-colors text-left py-2"
              >
                How It Works
              </button>
              <Button
                onClick={() => navigate("/auth")}
                className="bg-landing-accent hover:bg-landing-accent-light text-landing-dark font-semibold w-full"
              >
                Login
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default LandingNavbar;
