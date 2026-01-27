import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";
import teamDino from "@/assets/team-dino.jpg";

export function LandingFooter() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <img 
              src={logo} 
              alt="JuicyFish Logo" 
              className="h-10 w-10 rounded-xl"
            />
            <div>
              <p className="font-bold text-foreground">JuicyFish</p>
              <p className="text-xs text-muted-foreground">v2.4 • Academic Portal</p>
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <Link 
              to="/calculator" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Calculator
            </Link>
            <Link 
              to="/admin/login" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Admin
            </Link>
            <a 
              href="/downloads/juicyfish.apk" 
              download="JuicyFish.apk"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Download
            </a>
          </div>

          {/* Team Attribution */}
          <div className="flex items-center gap-2 text-sm">
            <img 
              src={teamDino} 
              alt="Team Dino" 
              className="h-7 w-7 rounded-full object-cover"
            />
            <span className="text-muted-foreground">
              Made by <span className="font-semibold text-foreground">Team Dino</span>
            </span>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-border/50">
          <p className="text-xs text-muted-foreground text-center">
            © {new Date().getFullYear()} JuicyFish. Made by students, for students.
          </p>
        </div>
      </div>
    </footer>
  );
}
