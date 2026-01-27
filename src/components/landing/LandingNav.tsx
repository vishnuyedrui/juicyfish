import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Menu, Calculator, Shield, Download, LogIn } from "lucide-react";
import logo from "@/assets/logo.png";

export function LandingNav() {
  const [open, setOpen] = useState(false);

  const navLinks = [
    { to: "/calculator", label: "Calculator", icon: Calculator },
    { to: "/admin/login", label: "Admin", icon: Shield },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <nav className="container mx-auto px-4 lg:px-8 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img 
            src={logo} 
            alt="JuicyFish Logo" 
            className="h-8 w-8 rounded-lg"
          />
          <span className="font-bold text-lg text-foreground">
            JuicyFish
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to}>
              <Button 
                variant="ghost" 
                size="sm"
                className="text-muted-foreground hover:text-foreground font-medium rounded-lg"
              >
                {link.label}
              </Button>
            </Link>
          ))}
          
          <a href="/downloads/juicyfish.apk" download="JuicyFish.apk">
            <Button 
              variant="ghost" 
              size="sm"
              className="text-muted-foreground hover:text-foreground font-medium rounded-lg"
            >
              <Download className="h-4 w-4 mr-1.5" />
              App
            </Button>
          </a>

          <div className="w-px h-5 bg-border mx-2" />

          <Link to="/auth">
            <Button 
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold rounded-lg px-4"
            >
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
              className="md:hidden" 
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px]">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2 text-left">
                <img src={logo} alt="JuicyFish" className="h-7 w-7 rounded-lg" />
                <span className="font-bold">JuicyFish</span>
              </SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-2 mt-6">
              {navLinks.map((link) => (
                <Link 
                  key={link.to}
                  to={link.to} 
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted transition-colors"
                >
                  <link.icon className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-foreground">{link.label}</span>
                </Link>
              ))}
              
              <a 
                href="/downloads/juicyfish.apk" 
                download="JuicyFish.apk"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted transition-colors"
              >
                <Download className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium text-foreground">Download App</span>
              </a>
              
              <div className="border-t border-border my-2" />
              
              <Link 
                to="/auth" 
                onClick={() => setOpen(false)}
              >
                <Button className="w-full bg-primary text-primary-foreground font-semibold rounded-lg">
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}
