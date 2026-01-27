import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Download } from "lucide-react";

export function CTASection() {
  return (
    <section className="container mx-auto px-4 lg:px-8 py-16">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-2xl lg:text-3xl font-bold text-foreground tracking-tight mb-4">
          Ready to simplify your academic life?
        </h2>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          Join thousands of students who trust JuicyFish for their academic calculations.
        </p>
        
        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/auth">
            <Button 
              size="lg" 
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold rounded-xl px-8 offset-shadow transition-all duration-200 hover:translate-x-[-2px] hover:translate-y-[-2px]"
            >
              Sign In
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <a href="/downloads/juicyfish.apk" download="JuicyFish.apk">
            <Button 
              size="lg" 
              variant="outline"
              className="font-semibold rounded-xl px-8 border-2 hover:bg-accent/10 transition-all duration-200"
            >
              <Download className="mr-2 h-4 w-4" />
              Download App
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
