import { Link } from "react-router-dom";
import { DecoDivider } from "./DecoDivider";
import logo from "@/assets/logo.png";

const DecoFooter = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <DecoDivider variant="line" className="py-0" />
      
      <div className="container max-w-6xl mx-auto px-4 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo and Attribution */}
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="JuicyFish Logo"
              className="w-8 h-8 rounded-lg object-contain bg-white/95 p-1"
            />
            <div className="text-center md:text-left">
              <p className="font-semibold">JuicyFish</p>
              <p className="text-sm text-primary-foreground/70">
                Built with ❤️ by{" "}
                <a
                  href="https://teamdino.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  Team Dino
                </a>
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-6 text-sm">
            <Link
              to="/admin/login"
              className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
            >
              Admin
            </Link>
            <a
              href="/downloads/juicyfish.apk"
              download="JuicyFish.apk"
              className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
            >
              Download App
            </a>
            <Link
              to="/auth"
              className="text-accent hover:text-accent/80 font-medium transition-colors"
            >
              Sign In
            </Link>
          </nav>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-primary-foreground/10 text-center">
          <p className="text-sm text-primary-foreground/50">
            © {new Date().getFullYear()} JuicyFish. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export { DecoFooter };
