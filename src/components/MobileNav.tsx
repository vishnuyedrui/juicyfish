import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Menu, Shield, Download, LogIn } from "lucide-react";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="sm:hidden text-white hover:bg-white/20 rounded-full" 
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[350px] pop-gradient-pink border-l-4 border-foreground/20">
        <SheetHeader>
          <SheetTitle className="text-white text-xl font-bold">✨ Menu</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-3 mt-6">
          <Link 
            to="/admin/login" 
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-4 rounded-2xl bg-white/20 hover:bg-white/30 transition-all duration-200 hover:scale-[1.02] pop-shadow"
          >
            <div className="w-10 h-10 rounded-full bg-pop-purple flex items-center justify-center">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-white">Admin Login</span>
          </Link>
          
          <a 
            href="/downloads/juicyfish.apk" 
            download="JuicyFish.apk"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-4 rounded-2xl bg-white/20 hover:bg-white/30 transition-all duration-200 hover:scale-[1.02] pop-shadow"
          >
            <div className="w-10 h-10 rounded-full bg-pop-cyan flex items-center justify-center">
              <Download className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-white">Download App</span>
          </a>
          
          <Link 
            to="/auth" 
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-4 rounded-2xl bg-pop-yellow hover:bg-pop-yellow/90 transition-all duration-200 hover:scale-[1.02] pop-shadow"
          >
            <div className="w-10 h-10 rounded-full bg-foreground/20 flex items-center justify-center">
              <LogIn className="h-5 w-5 text-foreground" />
            </div>
            <span className="font-bold text-foreground">Sign In</span>
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
