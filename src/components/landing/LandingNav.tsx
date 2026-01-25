import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Menu, Calculator, Shield, Download, LogIn, Sparkles } from "lucide-react";
import logo from "@/assets/logo.png";

export function LandingNav() {
  const [open, setOpen] = useState(false);

  const navLinks = [
    { to: "/calculator", label: "Grade Calculator", icon: Calculator, color: "bg-pop-pink" },
    { to: "/admin/login", label: "Admin Login", icon: Shield, color: "bg-pop-purple" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b-[3px] border-foreground/10">
      <nav className="container mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative">
            <img 
              src={logo} 
              alt="JuicyFish Logo" 
              className="h-10 w-10 rounded-2xl pop-shadow transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
            />
            <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-pop-yellow animate-pulse" />
          </div>
          <span className="font-black text-xl text-foreground tracking-tight">
            JuicyFish
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to}>
              <Button 
                variant="ghost" 
                className="text-foreground hover:text-primary hover:bg-primary/10 font-bold rounded-xl transition-all duration-200 hover:scale-105"
              >
                <link.icon className="h-4 w-4 mr-2" />
                {link.label}
              </Button>
            </Link>
          ))}
          
          <a href="/downloads/juicyfish.apk" download="JuicyFish.apk">
            <Button 
              variant="ghost" 
              className="text-foreground hover:text-accent hover:bg-accent/10 font-bold rounded-xl transition-all duration-200 hover:scale-105"
            >
              <Download className="h-4 w-4 mr-2" />
              Download App
            </Button>
          </a>

          <Link to="/auth">
            <Button className="ml-2 pop-gradient-pink text-white font-bold rounded-xl px-6 pop-shadow transition-all duration-200 hover:scale-105 hover:translate-x-[-2px] hover:translate-y-[-2px]">
              <LogIn className="h-4 w-4 mr-2" />
              Sign In
            </Button>
          </Link>
        </div>

        {/* Mobile Navigation */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden text-foreground hover:bg-primary/10 rounded-xl" 
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] pop-gradient-pink border-l-[3px] border-foreground/20">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2 text-white">
                <img src={logo} alt="JuicyFish" className="h-8 w-8 rounded-xl" />
                <span className="font-black">Menu</span>
              </SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-3 mt-6">
              {navLinks.map((link) => (
                <Link 
                  key={link.to}
                  to={link.to} 
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/20 hover:bg-white/30 transition-all duration-200 hover:scale-[1.02] pop-shadow"
                >
                  <div className={`w-10 h-10 rounded-xl ${link.color} flex items-center justify-center`}>
                    <link.icon className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-bold text-white">{link.label}</span>
                </Link>
              ))}
              
              <a 
                href="/downloads/juicyfish.apk" 
                download="JuicyFish.apk"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/20 hover:bg-white/30 transition-all duration-200 hover:scale-[1.02] pop-shadow"
              >
                <div className="w-10 h-10 rounded-xl bg-pop-green flex items-center justify-center">
                  <Download className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold text-white">Download App</span>
              </a>
              
              <Link 
                to="/auth" 
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-4 rounded-2xl bg-white text-foreground mt-2 pop-shadow transition-all duration-200 hover:scale-[1.02]"
              >
                <div className="w-10 h-10 rounded-xl bg-pop-yellow flex items-center justify-center">
                  <LogIn className="h-5 w-5 text-foreground" />
                </div>
                <span className="font-black">Sign In</span>
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}
