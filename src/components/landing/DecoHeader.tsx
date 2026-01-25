import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Download, LogIn, Menu, X } from "lucide-react";
import { useState } from "react";
import logo from "@/assets/logo.png";

const DecoHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-primary/95 backdrop-blur-sm border-b border-deco-gold/20">
      <div className="container max-w-6xl mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <img
                src={logo}
                alt="JuicyFish Logo"
                className="w-10 h-10 rounded-lg object-contain bg-white/95 p-1 transition-transform group-hover:scale-105"
              />
            </div>
            <span className="text-lg font-bold text-primary-foreground tracking-wide hidden sm:block">
              JuicyFish
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            <Link to="/admin/login">
              <Button
                variant="ghost"
                size="sm"
                className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10 gap-2"
                aria-label="Admin Login"
              >
                <Shield className="w-4 h-4" aria-hidden="true" />
                <span>Admin</span>
              </Button>
            </Link>
            <a href="/downloads/juicyfish.apk" download="JuicyFish.apk">
              <Button
                variant="ghost"
                size="sm"
                className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10 gap-2"
                aria-label="Download App"
              >
                <Download className="w-4 h-4" aria-hidden="true" />
                <span>Download</span>
              </Button>
            </a>
            <Link to="/auth">
              <Button
                size="sm"
                className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2 font-semibold ml-2"
                aria-label="Sign In"
              >
                <LogIn className="w-4 h-4" aria-hidden="true" />
                <span>Sign In</span>
              </Button>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-primary-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" aria-hidden="true" />
            ) : (
              <Menu className="w-6 h-6" aria-hidden="true" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-deco-gold/20 animate-fade-in">
            <div className="flex flex-col gap-2">
              <Link
                to="/admin/login"
                className="flex items-center gap-3 px-4 py-3 text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Shield className="w-5 h-5" aria-hidden="true" />
                <span>Admin Login</span>
              </Link>
              <a
                href="/downloads/juicyfish.apk"
                download="JuicyFish.apk"
                className="flex items-center gap-3 px-4 py-3 text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Download className="w-5 h-5" aria-hidden="true" />
                <span>Download App</span>
              </a>
              <Link
                to="/auth"
                className="flex items-center gap-3 px-4 py-3 bg-accent text-accent-foreground rounded-lg font-semibold"
                onClick={() => setMobileMenuOpen(false)}
              >
                <LogIn className="w-5 h-5" aria-hidden="true" />
                <span>Sign In</span>
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export { DecoHeader };
