import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calculator, Calendar, BookOpen, ArrowRight, Users, TrendingUp } from "lucide-react";
import logo from "@/assets/logo.png";

export function BentoGrid() {
  return (
    <section className="container mx-auto px-4 lg:px-8 pt-28 pb-12">
      {/* Hero - Editorial Style */}
      <div className="max-w-3xl mb-16">
        <div className="flex items-center gap-3 mb-6">
          <img 
            src={logo} 
            alt="JuicyFish" 
            className="h-12 w-12 rounded-xl offset-shadow"
          />
          <span className="text-sm font-semibold text-muted-foreground tracking-wide uppercase">
            Student Portal
          </span>
        </div>
        
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-foreground mb-6">
          Your grades,
          <br />
          <span className="squiggle-underline">sorted.</span>
        </h1>
        
        <p className="text-lg text-muted-foreground max-w-xl mb-8 leading-relaxed">
          Calculate SGPA/CGPA, track attendance, and access study resources. 
          Built by students who actually use it.
        </p>
        
        <div className="flex flex-wrap gap-3">
          <Link to="/auth">
            <Button 
              size="lg" 
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold rounded-xl px-6 offset-shadow transition-all duration-200 hover:translate-x-[-2px] hover:translate-y-[-2px]"
            >
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link to="/calculator">
            <Button 
              size="lg" 
              variant="outline"
              className="font-semibold rounded-xl px-6 border-2 hover:bg-secondary/10 hover:border-secondary transition-all duration-200"
            >
              Try Calculator
            </Button>
          </Link>
        </div>
        
        {/* Social Proof - Inline */}
        <div className="flex items-center gap-6 mt-10 pt-6 border-t border-border">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-secondary" />
            <span className="font-bold text-foreground">5,000+</span>
            <span className="text-muted-foreground text-sm">students</span>
          </div>
          <div className="w-px h-4 bg-border" />
          <span className="text-sm text-muted-foreground">Made by Team Dino</span>
        </div>
      </div>

      {/* Feature Cards - Asymmetric Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 lg:gap-5">
        
        {/* Calculator - Wide Card */}
        <Link to="/calculator" className="md:col-span-7 group">
          <div className="h-full p-6 lg:p-8 rounded-2xl bg-card border border-border soft-shadow transition-all duration-200 hover:border-primary/30 hover:shadow-md">
            <div className="flex items-start justify-between mb-5">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
                <Calculator className="h-6 w-6 text-primary" />
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-200" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Grade Calculator</h3>
            <p className="text-muted-foreground leading-relaxed">
              Calculate your SGPA & CGPA instantly. No sign-up required for basic calculations.
            </p>
          </div>
        </Link>

        {/* Attendance - Tall Card */}
        <Link to="/auth" className="md:col-span-5 md:row-span-2 group">
          <div className="h-full p-6 lg:p-8 rounded-2xl bg-secondary/5 border border-secondary/20 transition-all duration-200 hover:border-secondary/40 hover:bg-secondary/10">
            <div className="flex items-start justify-between mb-5">
              <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
                <Calendar className="h-6 w-6 text-secondary" />
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-secondary group-hover:translate-x-1 transition-all duration-200" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Attendance Tracker</h3>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Know exactly how many classes you can skip while staying above the threshold.
            </p>
            
            {/* Visual element */}
            <div className="mt-auto pt-4 border-t border-secondary/20">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-secondary">75%</span>
                <span className="text-sm text-muted-foreground">minimum safe</span>
              </div>
              <div className="mt-3 h-2 rounded-full bg-secondary/20 overflow-hidden">
                <div className="h-full w-3/4 rounded-full bg-secondary" />
              </div>
            </div>
          </div>
        </Link>

        {/* Resources - Medium Card */}
        <Link to="/auth" className="md:col-span-4 group">
          <div className="h-full p-6 rounded-2xl bg-accent/5 border border-accent/20 transition-all duration-200 hover:border-accent/40 hover:bg-accent/10">
            <div className="flex items-start justify-between mb-4">
              <div className="w-11 h-11 rounded-xl bg-accent/20 flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
                <BookOpen className="h-5 w-5 text-accent-foreground" />
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-accent-foreground group-hover:translate-x-1 transition-all duration-200" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-1">Study Resources</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Notes, videos & past papers organized by course.
            </p>
          </div>
        </Link>

        {/* Progress - Small Card */}
        <div className="md:col-span-3">
          <div className="h-full p-5 rounded-2xl bg-lavender/10 border border-lavender/20">
            <TrendingUp className="h-5 w-5 text-lavender mb-3" />
            <p className="text-sm font-semibold text-foreground">Track Progress</p>
            <p className="text-xs text-muted-foreground mt-1">Semester by semester</p>
          </div>
        </div>

      </div>
    </section>
  );
}
