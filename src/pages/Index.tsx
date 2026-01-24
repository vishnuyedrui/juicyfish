import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Course, createNewCourse, calculateSGPA } from "@/types/calculator";
import { CourseCard } from "@/components/calculator/CourseCard";
import { StepIndicator } from "@/components/calculator/StepIndicator";
import { SGPASection } from "@/components/calculator/SGPASection";
import { CGPASection } from "@/components/calculator/CGPASection";
import { GradeChart } from "@/components/calculator/GradeChart";
import { Button } from "@/components/ui/button";
import { PlusCircle, Sparkles, LogIn, Shield, Download } from "lucide-react";
import { MobileNav } from "@/components/MobileNav";
import logo from "@/assets/logo.png";

const Index = () => {
  const [courses, setCourses] = useState<Course[]>([createNewCourse()]);
  const [showCGPA, setShowCGPA] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [cgpaData, setCgpaData] = useState<{
    cgpa: number;
    previousCGPA: number;
    previousCredits: number;
    newTotalCredits: number;
  } | null>(null);

  const updateCourse = (index: number, updatedCourse: Course) => {
    const newCourses = [...courses];
    newCourses[index] = updatedCourse;
    setCourses(newCourses);

    // Auto advance step when WGP is calculated
    if (updatedCourse.wgp !== null && currentStep < 2) {
      setCurrentStep(2);
    }
  };

  const addCourse = () => {
    setCourses([...courses, createNewCourse()]);
  };

  const removeCourse = (index: number) => {
    if (courses.length > 1) {
      setCourses(courses.filter((_, i) => i !== index));
    }
  };

  const completedCourses = courses.filter((c) => c.finalGradePoint !== null);
  const sgpaResult = calculateSGPA(completedCourses);

  const completedSteps = [
    completedCourses.length > 0 ? 1 : 0,
    completedCourses.length > 0 ? 2 : 0,
    sgpaResult ? 3 : 0,
    showCGPA ? 4 : 0,
  ].filter(Boolean);

  const handleShowCGPA = () => {
    setShowCGPA(true);
    setCurrentStep(4);
  };

  const handleCGPACalculated = useCallback((data: typeof cgpaData) => {
    setCgpaData(data);
  }, []);

  return (
    <div className="min-h-screen bg-background pb-12 relative overflow-hidden">
      {/* Abstract background decorations */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-pop-pink/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-pop-cyan/10 rounded-full blur-3xl translate-x-1/2" />
      <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-pop-yellow/10 rounded-full blur-3xl -translate-x-1/3" />
      
      {/* Header - Pop Art Style */}
      <header className="relative z-10 pop-gradient-pink border-b-4 border-foreground/20">
        <div className="container max-w-4xl mx-auto px-3 sm:px-4 py-4">
          <div className="flex items-center justify-between gap-2">
            {/* Logo and Title */}
            <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
              <div className="relative">
                <img 
                  src={logo} 
                  alt="JuicyFish Logo" 
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex-shrink-0 object-contain pop-shadow border-2 border-white/50 bg-white"
                />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-2xl font-extrabold text-white drop-shadow-md truncate tracking-tight">
                  Grade Calculator
                </h1>
                <p className="text-[11px] sm:text-sm text-white/80 truncate font-medium">
                  ✨ WGP • SGPA • CGPA
                </p>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden sm:flex items-center gap-2">
              <Link to="/admin/login" aria-label="Admin Login">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="gap-2 text-white/90 hover:text-white hover:bg-white/20 rounded-full font-semibold transition-all duration-200 hover:scale-105"
                  aria-label="Admin Login"
                >
                  <Shield className="w-4 h-4" aria-hidden="true" />
                  <span>Admin</span>
                </Button>
              </Link>
              <a href="/downloads/juicyfish.apk" download="JuicyFish.apk" aria-label="Download App">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-2 bg-white text-primary hover:bg-white/90 border-2 border-white rounded-full font-semibold pop-shadow transition-all duration-200 hover:scale-105 hover:-translate-y-0.5"
                  aria-label="Download App"
                >
                  <Download className="w-4 h-4" aria-hidden="true" />
                  <span>Download</span>
                </Button>
              </a>
              <Link to="/auth" aria-label="Sign In">
                <Button 
                  size="sm" 
                  className="gap-2 bg-pop-yellow text-foreground hover:bg-pop-yellow/90 border-2 border-foreground/20 rounded-full font-semibold pop-shadow transition-all duration-200 hover:scale-105 hover:-translate-y-0.5"
                  aria-label="Sign In"
                >
                  <LogIn className="w-4 h-4" aria-hidden="true" />
                  <span>Sign In</span>
                </Button>
              </Link>
            </div>

            {/* Mobile Navigation */}
            <MobileNav />
          </div>
        </div>
        {/* Wavy bottom edge */}
        <svg className="absolute -bottom-1 left-0 w-full h-4" viewBox="0 0 1200 24" preserveAspectRatio="none">
          <path 
            d="M0,24 C300,0 600,24 900,12 C1050,6 1150,18 1200,12 L1200,24 L0,24 Z" 
            fill="hsl(var(--background))"
          />
        </svg>
      </header>

      {/* Step Indicator */}
      <div className="relative z-10">
        <StepIndicator currentStep={currentStep} completedSteps={completedSteps} />
      </div>

      <main className="container max-w-4xl mx-auto px-3 sm:px-4 space-y-6 sm:space-y-8 relative z-10">
        {/* Grade Chart Reference */}
        <GradeChart />

        {/* Step 1 & 2: Course Cards */}
        <section className="space-y-3 sm:space-y-4">
          <div className="flex items-center gap-2 bg-card rounded-2xl px-4 py-3 pop-shadow border-2 border-foreground/10">
            <div className="w-8 h-8 rounded-full bg-pop-purple flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-base sm:text-lg font-bold">Step 1 & 2: Courses & Grades</h2>
          </div>

          <div className="space-y-4 sm:space-y-6">
            {courses.map((course, index) => (
              <CourseCard
                key={course.id}
                course={course}
                index={index}
                onUpdate={(updated) => updateCourse(index, updated)}
                onRemove={() => removeCourse(index)}
                canRemove={courses.length > 1}
              />
            ))}
          </div>

          <Button 
            onClick={addCourse} 
            variant="outline" 
            className="w-full border-dashed border-2 border-primary/50 hover:border-primary hover:bg-primary/5 rounded-2xl py-6 text-primary font-semibold transition-all duration-200 hover:scale-[1.01]"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Add Another Course
          </Button>
        </section>

        {/* Step 3: SGPA */}
        <section className="space-y-3 sm:space-y-4">
          <SGPASection 
            courses={courses} 
            onShowCGPA={handleShowCGPA} 
            cgpaData={cgpaData || undefined}
          />
        </section>

        {/* Step 4: CGPA (Optional) */}
        {showCGPA && sgpaResult && (
          <section className="space-y-3 sm:space-y-4">
            <CGPASection 
              currentSGPA={sgpaResult.sgpa} 
              currentCredits={sgpaResult.totalCredits}
              courses={courses}
              onCGPACalculated={handleCGPACalculated}
            />
          </section>
        )}
      </main>

      {/* Footer - Pop Art Style */}
      <footer className="mt-8 sm:mt-12 relative z-10">
        <div className="pop-gradient-cyan py-4">
          <p className="text-center text-sm font-semibold text-white drop-shadow-sm">
            Built with <span className="text-2xl animate-pulse">❤️</span> for students @ TEAMDINO teamdino.in
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
