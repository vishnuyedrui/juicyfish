import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Menu, Calculator, Download, LogIn, Info } from "lucide-react";
import logo from "@/assets/logo.png";

export function LandingNav() {
  const [open, setOpen] = useState(false);

  const navLinks = [
    { to: "/calculator", label: "Grade Calculator", icon: Calculator },
    { to: "#about", label: "About", icon: Info, isAnchor: true },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#1a1a1a]/80 backdrop-blur-md border-b border-white/10">
      <nav className="container mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <img 
            src={logo} 
            alt="JuicyFish Logo" 
            className="h-10 w-10 rounded-2xl transition-all duration-300 group-hover:scale-110"
          />
          <span className="font-bold text-xl text-white/90 tracking-tight">
            JuicyFish
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => (
            link.isAnchor ? (
              <a key={link.to} href={link.to}>
                <Button 
                  variant="ghost" 
                  className="text-white/70 hover:text-white hover:bg-white/10 font-medium rounded-full transition-all duration-200"
                >
                  <link.icon className="h-4 w-4 mr-2" />
                  {link.label}
                </Button>
              </a>
            ) : (
              <Link key={link.to} to={link.to}>
                <Button 
                  variant="ghost" 
                  className="text-white/70 hover:text-white hover:bg-white/10 font-medium rounded-full transition-all duration-200"
                >
                  <link.icon className="h-4 w-4 mr-2" />
                  {link.label}
                </Button>
              </Link>
            )
          ))}
          
          <a href="/downloads/juicyfish.apk" download="JuicyFish.apk">
            <Button 
              variant="ghost" 
              className="text-white/70 hover:text-white hover:bg-white/10 font-medium rounded-full transition-all duration-200"
            >
              <Download className="h-4 w-4 mr-2" />
              Download App
            </Button>
          </a>

          <Link to="/auth">
            <Button className="ml-2 bg-white text-[#1a1a1a] hover:bg-white/90 font-semibold rounded-full px-6 transition-all duration-200">
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
              className="md:hidden text-white/80 hover:text-white hover:bg-white/10 rounded-xl" 
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] bg-[#1a1a1a] border-l border-white/10">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2 text-white/90">
                <img src={logo} alt="JuicyFish" className="h-8 w-8 rounded-xl" />
                <span className="font-bold">Menu</span>
              </SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-3 mt-6">
              {navLinks.map((link) => (
                link.isAnchor ? (
                  <a 
                    key={link.to}
                    href={link.to}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200"
                  >
                    <link.icon className="h-5 w-5 text-white/60" />
                    <span className="font-medium text-white/80">{link.label}</span>
                  </a>
                ) : (
                  <Link 
                    key={link.to}
                    to={link.to} 
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200"
                  >
                    <link.icon className="h-5 w-5 text-white/60" />
                    <span className="font-medium text-white/80">{link.label}</span>
                  </Link>
                )
              ))}
              
              <a 
                href="/downloads/juicyfish.apk" 
                download="JuicyFish.apk"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200"
              >
                <Download className="h-5 w-5 text-white/60" />
                <span className="font-medium text-white/80">Download App</span>
              </a>
              
              <Link 
                to="/auth" 
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-4 rounded-xl bg-white text-[#1a1a1a] mt-2 transition-all duration-200"
              >
                <LogIn className="h-5 w-5" />
                <span className="font-bold">Sign In</span>
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}
