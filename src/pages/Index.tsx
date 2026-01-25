import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Course, createNewCourse, calculateSGPA } from "@/types/calculator";
import { CourseCard } from "@/components/calculator/CourseCard";
import { StepIndicator } from "@/components/calculator/StepIndicator";
import { SGPASection } from "@/components/calculator/SGPASection";
import { CGPASection } from "@/components/calculator/CGPASection";
import { GradeChart } from "@/components/calculator/GradeChart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Sparkles, LogIn, Shield, Download, GraduationCap, Calculator, Target, BookOpen, ArrowLeft } from "lucide-react";
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
      {/* Subtle background decorations */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-accent/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 will-change-transform" />
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl translate-x-1/2 will-change-transform" />
      <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl -translate-x-1/3 will-change-transform" />
      
      {/* Header - Art Deco Style */}
      <header className="relative z-10 deco-gradient-navy border-b-2 border-accent/20">
        <div className="container max-w-6xl mx-auto px-3 sm:px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-2">
            {/* Back Button and Logo */}
            <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
              <Link to="/" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                <ArrowLeft className="w-5 h-5" aria-hidden="true" />
                <span className="sr-only">Back to Home</span>
              </Link>
              <div className="relative">
                <img 
                  src={logo} 
                  alt="JuicyFish Logo" 
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex-shrink-0 object-contain deco-shadow border border-accent/30 bg-white p-0.5"
                />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-bold text-primary-foreground truncate tracking-wide">
                  Grade Calculator
                </h1>
                <p className="text-[11px] sm:text-xs text-primary-foreground/70 truncate">
                  WGP • SGPA • CGPA
                </p>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden sm:flex items-center gap-2">
              <Link to="/admin/login" aria-label="Admin Login">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="gap-2 text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10 font-medium transition-colors"
                  aria-label="Admin Login"
                >
                  <Shield className="w-4 h-4" aria-hidden="true" />
                  <span>Admin</span>
                </Button>
              </Link>
              <a href="/downloads/juicyfish.apk" download="JuicyFish.apk" aria-label="Download App">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="gap-2 text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10 font-medium transition-colors"
                  aria-label="Download App"
                >
                  <Download className="w-4 h-4" aria-hidden="true" />
                  <span>Download</span>
                </Button>
              </a>
              <Link to="/auth" aria-label="Sign In">
                <Button 
                  size="sm" 
                  className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold deco-shadow transition-all hover:scale-105"
                  aria-label="Sign In"
                >
                  <LogIn className="w-4 h-4" aria-hidden="true" />
                  <span>Sign In</span>
                </Button>
              </Link>
            </div>

            {/* Mobile Sign In */}
            <Link to="/auth" className="sm:hidden" aria-label="Sign In">
              <Button 
                size="sm" 
                className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
                aria-label="Sign In"
              >
                <LogIn className="w-4 h-4" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Step Indicator */}
      <div className="relative z-10">
        <StepIndicator currentStep={currentStep} completedSteps={completedSteps} />
      </div>

      {/* Step Indicator */}
      <div className="relative z-10">
        <StepIndicator currentStep={currentStep} completedSteps={completedSteps} />
      </div>

      <main className="container max-w-6xl mx-auto px-3 sm:px-4 lg:px-8 space-y-6 sm:space-y-8 relative z-10 mt-6">
        {/* Educational Introduction Section */}
        <section className="space-y-4">
          <Card className="deco-shadow border border-border bg-card">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-primary-foreground" />
                </div>
                <CardTitle className="text-lg sm:text-xl">Understanding Your Grade Point Average</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-sm sm:text-base text-muted-foreground">
              <p>
                <strong className="text-foreground">Grade Point Average (GPA)</strong> is the standard way universities measure 
                academic performance. In India, most universities use a <strong className="text-foreground">10-point grading system</strong> where 
                grades are converted to grade points ranging from 0 to 10.
              </p>
              <div className="grid sm:grid-cols-3 gap-3 mt-4">
                <div className="flex items-start gap-2 p-3 bg-accent/10 rounded-lg border border-accent/20">
                  <Calculator className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground text-sm">SGPA</p>
                    <p className="text-xs">Semester Grade Point Average - your GPA for one semester</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-3 bg-secondary/10 rounded-lg border border-secondary/20">
                  <Target className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground text-sm">CGPA</p>
                    <p className="text-xs">Cumulative GPA - your overall average across all semesters</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-3 bg-primary/10 rounded-lg border border-primary/20">
                  <BookOpen className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground text-sm">WGP</p>
                    <p className="text-xs">Weighted Grade Points - credits × grade point for each course</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Grade Chart Reference */}
        <GradeChart />

        {/* Step 1 & 2: Course Cards */}
        <section className="space-y-3 sm:space-y-4">
          <div className="flex items-center gap-2 bg-card rounded-lg px-4 py-3 deco-shadow border border-border">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
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
            className="w-full border-dashed border-2 border-accent/50 hover:border-accent hover:bg-accent/5 rounded-lg py-6 text-accent font-semibold transition-all duration-200 hover:scale-[1.01]"
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

        {/* Educational Tips Section */}
        <section className="space-y-4">
          <Card className="deco-shadow border border-border bg-gradient-to-br from-secondary/5 to-accent/5">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                  <Target className="w-5 h-5 text-secondary-foreground" />
                </div>
                <CardTitle className="text-lg sm:text-xl">Tips for Academic Success</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="font-semibold text-foreground">📚 How SGPA is Calculated</p>
                  <p>
                    SGPA = Sum of (Credit × Grade Point) / Total Credits. For example, if you have 
                    3 courses with 4, 3, and 3 credits earning grade points of 9, 8, and 7 respectively:
                    SGPA = (4×9 + 3×8 + 3×7) / (4+3+3) = 81/10 = 8.1
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-foreground">🎯 Setting GPA Goals</p>
                  <p>
                    Aim for consistent improvement each semester. A CGPA above 8.0 is considered 
                    excellent for placements, while 9.0+ opens doors to top graduate programs and 
                    competitive opportunities.
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-foreground">📈 Improving Your GPA</p>
                  <p>
                    Focus on high-credit courses as they impact your GPA more significantly. 
                    Consistent study habits and regular attendance typically correlate with 
                    better grades.
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-foreground">🔄 CGPA vs Percentage</p>
                  <p>
                    Many universities use the formula: Percentage = CGPA × 9.5 (or a similar multiplier). 
                    Check your university's specific conversion formula for accurate results.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* Footer - Art Deco Style */}
      <footer className="mt-8 sm:mt-12 relative z-10">
        <div className="deco-gradient-navy py-4 border-t border-accent/20">
          <p className="text-center text-sm font-medium text-primary-foreground/80">
            Built with <span className="text-accent">❤️</span> for students @ <a href="https://teamdino.in" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">TEAMDINO</a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
