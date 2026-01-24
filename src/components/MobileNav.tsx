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
        <Button variant="ghost" size="icon" className="sm:hidden" aria-label="Open menu">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[280px] sm:w-[350px]">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-4 mt-6">
          <Link 
            to="/admin/login" 
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors"
          >
            <Shield className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium">Admin Login</span>
          </Link>
          
          <a 
            href="/downloads/juicyfish.apk" 
            download="JuicyFish.apk"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors"
          >
            <Download className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium">Download App</span>
          </a>
          
          <Link 
            to="/auth" 
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors"
          >
            <LogIn className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium">Sign In</span>
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
