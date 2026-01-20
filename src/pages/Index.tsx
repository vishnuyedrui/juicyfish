import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Course, createNewCourse, calculateSGPA } from "@/types/calculator";
import { CourseCard } from "@/components/calculator/CourseCard";
import { StepIndicator } from "@/components/calculator/StepIndicator";
import { SGPASection } from "@/components/calculator/SGPASection";
import { CGPASection } from "@/components/calculator/CGPASection";
import { GradeChart } from "@/components/calculator/GradeChart";
import { Button } from "@/components/ui/button";
import { PlusCircle, GraduationCap, Sparkles, LogIn } from "lucide-react";
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
    <div className="min-h-screen bg-background pb-12">
      {/* Header - Mobile Responsive */}
      <header className="bg-card border-b sticky top-0 z-10">
        <div className="container max-w-4xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
                <GraduationCap className="w-5 h-5 sm:w-7 sm:h-7 text-primary-foreground" />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-bold truncate">Academic Grade Calculator</h1>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">Step-by-step WGP, SGPA & CGPA</p>
              </div>
            </div>
            <Link to="/auth">
              <Button variant="outline" size="sm" className="gap-2">
                <LogIn className="w-4 h-4" />
                <span className="hidden sm:inline">Sign In</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Step Indicator */}
      <StepIndicator currentStep={currentStep} completedSteps={completedSteps} />

      <main className="container max-w-4xl mx-auto px-3 sm:px-4 space-y-6 sm:space-y-8">
        {/* Grade Chart Reference */}
        <GradeChart />

        {/* Step 1 & 2: Course Cards */}
        <section className="space-y-3 sm:space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            <h2 className="text-base sm:text-lg font-semibold">Step 1 & 2: Courses & Grades</h2>
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

          <Button onClick={addCourse} variant="outline" className="w-full border-dashed">
            <PlusCircle className="w-4 h-4 mr-2" />
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

      {/* Footer */}
      <footer className="mt-8 sm:mt-12 text-center text-xs sm:text-sm text-muted-foreground px-4">
        <p>Built with ❤️ for students @ TEAMDINO teamdino.in</p>
      </footer>
    </div>
  );
};

export default Index;
