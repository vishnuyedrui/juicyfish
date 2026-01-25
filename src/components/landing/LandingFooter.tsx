import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";
import teamDino from "@/assets/team-dino.jpg";
import { Heart, Sparkles } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="border-t-[3px] border-foreground/10 bg-card">
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 group">
            <div className="relative">
              <img 
                src={logo} 
                alt="JuicyFish Logo" 
                className="h-12 w-12 rounded-2xl pop-shadow transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
              />
              <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-pop-yellow animate-pulse" />
            </div>
            <div>
              <p className="font-black text-foreground text-lg">JuicyFish 🐟</p>
              <p className="text-sm text-muted-foreground font-medium">Academic Student Portal</p>
            </div>
          </div>

          {/* Team Attribution */}
          <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-pop-purple/10 border-[3px] border-pop-purple/30 pop-shadow">
            <img 
              src={teamDino} 
              alt="Team Dino" 
              className="h-12 w-12 rounded-full object-cover border-[3px] border-pop-purple/40"
            />
            <div className="text-sm">
              <p className="text-muted-foreground font-medium flex items-center gap-1">
                Made with <Heart className="h-4 w-4 text-pop-pink fill-pop-pink animate-pulse" /> by
              </p>
              <p className="font-black text-foreground">Team Dino 🦖</p>
            </div>
          </div>

          {/* Links */}
          <div className="flex items-center gap-4">
            <Link 
              to="/calculator" 
              className="px-4 py-2 rounded-xl bg-pop-pink/10 text-pop-pink font-bold transition-all duration-200 hover:bg-pop-pink hover:text-white hover:scale-105"
            >
              Calculator
            </Link>
            <Link 
              to="/admin/login" 
              className="px-4 py-2 rounded-xl bg-pop-purple/10 text-pop-purple font-bold transition-all duration-200 hover:bg-pop-purple hover:text-white hover:scale-105"
            >
              Admin
            </Link>
            <a 
              href="/downloads/juicyfish.apk" 
              download="JuicyFish.apk"
              className="px-4 py-2 rounded-xl bg-pop-green/10 text-pop-green font-bold transition-all duration-200 hover:bg-pop-green hover:text-white hover:scale-105"
            >
              Download
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t-2 border-foreground/5 text-center">
          <p className="text-sm text-muted-foreground font-medium">
            © {new Date().getFullYear()} <span className="font-bold text-pop-pink">JuicyFish</span>. All rights reserved. ✨
          </p>
        </div>
      </div>
    </footer>
  );
}
