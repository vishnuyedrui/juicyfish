import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";
import teamDino from "@/assets/team-dino.jpg";
import { Heart } from "lucide-react";

export function LandingFooter() {
  return (
    <footer 
      className="border-t border-white/10 py-12"
      style={{ backgroundColor: "#1a1a1a" }}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 group">
            <img 
              src={logo} 
              alt="JuicyFish Logo" 
              className="h-12 w-12 rounded-2xl transition-all duration-300 group-hover:scale-110"
            />
            <div>
              <p className="font-bold text-white/90 text-lg">JuicyFish 🐟</p>
              <p className="text-sm text-white/50">Academic Student Portal</p>
            </div>
          </div>

          {/* Team Attribution */}
          <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/5 border border-white/10">
            <img 
              src={teamDino} 
              alt="Team Dino" 
              className="h-12 w-12 rounded-full object-cover border-2 border-white/20"
            />
            <div className="text-sm">
              <p className="text-white/50 flex items-center gap-1">
                Made with <Heart className="h-4 w-4 text-pink-500 fill-pink-500" /> by
              </p>
              <p className="font-bold text-white/90">Team Dino 🦖</p>
            </div>
          </div>

          {/* Links */}
          <div className="flex items-center gap-3">
            <Link 
              to="/calculator" 
              className="px-4 py-2 rounded-full bg-white/10 text-white/80 font-medium transition-all duration-200 hover:bg-white/20 hover:text-white"
            >
              Calculator
            </Link>
            <Link 
              to="/auth" 
              className="px-4 py-2 rounded-full bg-white/10 text-white/80 font-medium transition-all duration-200 hover:bg-white/20 hover:text-white"
            >
              Sign In
            </Link>
            <a 
              href="/downloads/juicyfish.apk" 
              download="JuicyFish.apk"
              className="px-4 py-2 rounded-full bg-white/10 text-white/80 font-medium transition-all duration-200 hover:bg-white/20 hover:text-white"
            >
              Download
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <p className="text-sm text-white/40">
            © {new Date().getFullYear()} <span className="font-semibold text-white/60">JuicyFish</span>. All rights reserved. ✨
          </p>
        </div>
      </div>
    </footer>
  );
}
