import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Download, Sparkles, Star } from "lucide-react";

export function CTASection() {
  return (
    <section className="container mx-auto px-4 lg:px-8 py-16">
      <div className="relative rounded-3xl pop-gradient-cyan overflow-hidden border-[3px] border-foreground/20 pop-shadow-lg">
        {/* Abstract decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-pop-yellow/30 rounded-full blur-2xl" />
        <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-pop-pink/40 rounded-full blur-xl animate-pulse" />
        
        {/* Floating shapes */}
        <div className="absolute top-10 left-10 w-12 h-12 bg-white/30 rounded-xl rotate-12 animate-float" />
        <div className="absolute bottom-10 right-10 w-16 h-16 bg-white/20 rounded-full animate-float" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-20 w-8 h-8 bg-pop-yellow/50 rounded-lg rotate-45 animate-wiggle" />
        
        {/* Stars */}
        <Star className="absolute top-8 right-20 h-6 w-6 text-white/40 animate-pulse" />
        <Star className="absolute bottom-16 left-1/3 h-4 w-4 text-white/30 animate-pulse" style={{ animationDelay: "0.5s" }} />

        <div className="relative z-10 py-16 px-6 lg:px-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-white font-bold text-sm mb-6 animate-bounce-in">
            <Sparkles className="h-4 w-4" />
            Join 5,000+ Students
          </div>
          
          <h2 className="text-3xl lg:text-4xl font-black text-white tracking-tight mb-4">
            Ready to Simplify Your
            <br />
            <span className="text-pop-yellow drop-shadow-lg">Academic Journey?</span> 🚀
          </h2>
          <p className="text-white/80 text-lg max-w-lg mx-auto mb-8 font-medium">
            Join thousands of students who trust JuicyFish for their academic calculations and tracking!
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/auth">
              <Button size="lg" className="bg-white text-foreground hover:bg-pop-yellow font-black rounded-2xl px-8 pop-shadow transition-all duration-200 hover:scale-105">
                Sign In to Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <a href="/downloads/juicyfish.apk" download="JuicyFish.apk">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-[3px] border-white/50 text-white hover:bg-white/20 rounded-2xl px-8 font-bold transition-all duration-200 hover:scale-105"
              >
                <Download className="mr-2 h-4 w-4" />
                Download App
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
