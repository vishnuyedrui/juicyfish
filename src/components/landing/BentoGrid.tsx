import { Link } from "react-router-dom";
import { BentoCard } from "./BentoCard";
import { Button } from "@/components/ui/button";
import { Calculator, Calendar, BookOpen, ArrowRight, Sparkles, Users, TrendingUp } from "lucide-react";
import confetti from "canvas-confetti";
import { useCallback, useRef } from "react";

export function BentoGrid() {
  const hasTriggeredConfetti = useRef(false);

  const triggerConfetti = useCallback(() => {
    if (hasTriggeredConfetti.current) return;
    hasTriggeredConfetti.current = true;

    // Playful pop art confetti colors
    const popColors = ['#ff3399', '#00e5ff', '#ffeb3b', '#aa66ff', '#ff9100', '#4caf50'];

    // Center burst
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
      colors: popColors,
      shapes: ['circle', 'square'],
      scalar: 1.2,
    });

    // Side bursts with delay
    setTimeout(() => {
      confetti({
        particleCount: 30,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        colors: popColors,
      });
      confetti({
        particleCount: 30,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
        colors: popColors,
      });
    }, 150);

    // Reset after 3 seconds to allow re-trigger
    setTimeout(() => {
      hasTriggeredConfetti.current = false;
    }, 3000);
  }, []);

  return (
    <section className="container mx-auto px-4 lg:px-8 pt-24 pb-16">
      {/* Abstract background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-pop-pink/20 rounded-full blur-3xl animate-float" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-pop-cyan/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-40 left-1/3 w-80 h-80 bg-pop-yellow/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-pop-purple/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "0.5s" }} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 lg:gap-6">
        
        {/* Hero Card - Large */}
        <BentoCard 
          variant="navy" 
          className="lg:col-span-7 lg:row-span-2 min-h-[320px] lg:min-h-[420px] flex flex-col justify-between relative overflow-hidden"
          hover={false}
        >
          {/* Abstract decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-pop-yellow/30 rounded-full blur-xl" />
          <div className="absolute top-1/2 right-10 w-20 h-20 bg-pop-cyan/40 rounded-full blur-lg animate-pulse" />
          
          {/* Geometric pattern */}
          <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 100 100" preserveAspectRatio="none">
            <circle cx="80" cy="20" r="15" fill="white" />
            <circle cx="20" cy="80" r="10" fill="white" />
            <rect x="60" y="60" width="20" height="20" rx="4" fill="white" transform="rotate(15 70 70)" />
          </svg>
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-white font-bold text-sm mb-4 animate-bounce-in">
              <Sparkles className="h-4 w-4 text-pop-yellow" />
              Academic Excellence Made Fun!
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Your Academic
              <br />
              <span className="text-pop-yellow drop-shadow-lg">Journey</span>, Simplified
            </h1>
          </div>
          
          <div className="relative z-10">
            <p className="text-white/80 text-lg mb-6 max-w-md font-medium">
              Calculate SGPA/CGPA, track attendance, and access study resources — all in one colorful platform! 🎨
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/auth">
                <Button 
                  size="lg" 
                  className="bg-white text-foreground hover:bg-pop-yellow font-black rounded-2xl px-6 pop-shadow transition-all duration-200 hover:scale-105"
                  onMouseEnter={triggerConfetti}
                >
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/calculator">
                <Button size="lg" className="bg-pop-cyan text-white hover:bg-pop-cyan/90 font-black rounded-2xl px-6 pop-shadow transition-all duration-200 hover:scale-105">
                  Try Calculator
                </Button>
              </Link>
            </div>
          </div>
        </BentoCard>

        {/* Calculator Card */}
        <Link to="/calculator" className="lg:col-span-5 contents lg:block">
          <BentoCard variant="pink" className="lg:col-span-5 group cursor-pointer">
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl bg-pop-pink flex items-center justify-center pop-shadow transition-all duration-300 group-hover:rotate-6 group-hover:scale-110">
                <Calculator className="h-7 w-7 text-white" />
              </div>
              <ArrowRight className="h-5 w-5 text-pop-pink group-hover:translate-x-2 transition-all duration-300" />
            </div>
            <h3 className="text-xl font-black text-foreground mb-2">Grade Calculator</h3>
            <p className="text-muted-foreground font-medium">
              Calculate your <span className="text-pop-pink font-bold">SGPA & CGPA</span> instantly with our precision calculator.
            </p>
          </BentoCard>
        </Link>

        {/* Stats Card */}
        <BentoCard variant="yellow" className="lg:col-span-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-pop-yellow flex items-center justify-center pop-shadow animate-wiggle">
              <Users className="h-7 w-7 text-foreground" />
            </div>
            <div>
              <p className="text-3xl font-black text-foreground">5,000+</p>
              <p className="text-muted-foreground font-bold">Students trust JuicyFish 🐟</p>
            </div>
          </div>
        </BentoCard>

        {/* Attendance Card */}
        <Link to="/auth" className="lg:col-span-4 contents lg:block">
          <BentoCard variant="cyan" className="lg:col-span-4 group cursor-pointer">
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl bg-pop-cyan flex items-center justify-center pop-shadow transition-all duration-300 group-hover:rotate-6 group-hover:scale-110">
                <Calendar className="h-7 w-7 text-white" />
              </div>
              <ArrowRight className="h-5 w-5 text-pop-cyan group-hover:translate-x-2 transition-all duration-300" />
            </div>
            <h3 className="text-xl font-black text-foreground mb-2">Attendance Tracker</h3>
            <p className="text-muted-foreground font-medium">
              Never miss a class. Know exactly <span className="text-pop-cyan font-bold">how many you can skip</span>. 😎
            </p>
          </BentoCard>
        </Link>

        {/* Resources Card */}
        <Link to="/auth" className="lg:col-span-4 contents lg:block">
          <BentoCard variant="green" className="lg:col-span-4 group cursor-pointer">
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl bg-pop-green flex items-center justify-center pop-shadow transition-all duration-300 group-hover:rotate-6 group-hover:scale-110">
                <BookOpen className="h-7 w-7 text-white" />
              </div>
              <ArrowRight className="h-5 w-5 text-pop-green group-hover:translate-x-2 transition-all duration-300" />
            </div>
            <h3 className="text-xl font-black text-foreground mb-2">Study Resources</h3>
            <p className="text-muted-foreground font-medium">
              Access organized <span className="text-pop-green font-bold">notes, videos & papers</span> in one place. 📚
            </p>
          </BentoCard>
        </Link>

        {/* Progress Card */}
        <BentoCard variant="featured" className="lg:col-span-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-pop-purple flex items-center justify-center pop-shadow animate-pop">
              <TrendingUp className="h-7 w-7 text-white" />
            </div>
            <div>
              <p className="text-3xl font-black text-foreground">Track</p>
              <p className="text-muted-foreground font-bold">Your academic progress ✨</p>
            </div>
          </div>
        </BentoCard>

      </div>
    </section>
  );
}
