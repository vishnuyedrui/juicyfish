import { Course, calculateSGPA } from "@/types/calculator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calculator, TrendingUp, Award, Download } from "lucide-react";
import { useState } from "react";
import { GradeBadge } from "./GradeBadge";
import { exportResultsToPDF } from "@/utils/pdfExport";

interface SGPASectionProps {
  courses: Course[];
  onShowCGPA: () => void;
  cgpaData?: {
    cgpa: number;
    previousCGPA: number;
    previousCredits: number;
    newTotalCredits: number;
  };
}

export function SGPASection({ courses, onShowCGPA, cgpaData }: SGPASectionProps) {
  const [showResult, setShowResult] = useState(false);
  
  const validCourses = courses.filter(c => c.finalGradePoint !== null && c.name.trim() !== '');
  const canCalculate = validCourses.length > 0;
  const result = calculateSGPA(validCourses);

  const handleDownloadPDF = () => {
    if (!result) return;
    
    exportResultsToPDF({
      courses: validCourses,
      sgpa: result.sgpa,
      totalCredits: result.totalCredits,
      ...(cgpaData && {
        cgpa: cgpaData.cgpa,
        previousCGPA: cgpaData.previousCGPA,
        previousCredits: cgpaData.previousCredits,
        newTotalCredits: cgpaData.newTotalCredits,
      }),
    });
  };

  if (!canCalculate) {
    return (
      <Card className="border-dashed border-2 border-muted animate-fade-in">
        <CardContent className="py-8 text-center">
          <Calculator className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-sm sm:text-base">
            Complete at least one course to calculate SGPA
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="animate-fade-in gradient-green border-2 border-accent/30">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-base sm:text-lg">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
            <Calculator className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
          </div>
          <span className="leading-tight">Step 3: SGPA Calculation</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6">
        {!showResult ? (
          <div className="text-center py-4">
            <p className="text-muted-foreground mb-4 text-sm sm:text-base">
              You have <span className="font-semibold text-foreground">{validCourses.length}</span> course(s) ready for SGPA calculation.
            </p>
            <Button 
              onClick={() => setShowResult(true)} 
              size="lg"
              className="bg-accent hover:bg-accent/90 w-full sm:w-auto"
            >
              <Calculator className="w-4 h-4 mr-2" />
              Calculate SGPA
            </Button>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6 animate-scale-in">
            {/* Course Summary Table - Mobile Responsive */}
            <div className="bg-card rounded-lg border overflow-x-auto">
              <table className="w-full min-w-[320px]">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-2 sm:p-3 text-xs sm:text-sm font-medium">Course</th>
                    <th className="text-center p-2 sm:p-3 text-xs sm:text-sm font-medium">Credits</th>
                    <th className="text-center p-2 sm:p-3 text-xs sm:text-sm font-medium">Grade</th>
                    <th className="text-center p-2 sm:p-3 text-xs sm:text-sm font-medium whitespace-nowrap">Cr × GP</th>
                  </tr>
                </thead>
                <tbody>
                  {validCourses.map((course, i) => (
                    <tr key={course.id} className="border-b last:border-b-0">
                      <td className="p-2 sm:p-3 text-xs sm:text-sm truncate max-w-[100px] sm:max-w-none">
                        {course.name || `Course ${i + 1}`}
                      </td>
                      <td className="p-2 sm:p-3 text-center text-xs sm:text-sm">{course.credits}</td>
                      <td className="p-2 sm:p-3 text-center">
                        <GradeBadge letter={course.letterGrade!} point={course.finalGradePoint!} size="sm" />
                      </td>
                      <td className="p-2 sm:p-3 text-center font-mono text-xs sm:text-sm">
                        <span className="hidden sm:inline">{course.credits} × {course.finalGradePoint} = </span>
                        <span className="font-semibold">{(course.credits * course.finalGradePoint!).toFixed(0)}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Formula */}
            <Card className="bg-muted/30 border-dashed">
              <CardHeader className="pb-2 px-3 sm:px-6">
                <CardTitle className="text-xs sm:text-sm flex items-center gap-2 text-accent">
                  <Award className="w-3 h-3 sm:w-4 sm:h-4" />
                  SGPA Formula
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 sm:space-y-3 text-xs sm:text-sm px-3 sm:px-6">
                <div className="font-mono bg-card p-2 sm:p-3 rounded border space-y-1 overflow-x-auto">
                  <div className="text-muted-foreground text-xs whitespace-nowrap">
                    SGPA = Σ(Credits × Grade Point) ÷ Σ(Total Credits)
                  </div>
                  <div className="text-muted-foreground whitespace-nowrap">
                    SGPA = {result?.totalGradePoints.toFixed(0)} ÷ {result?.totalCredits}
                  </div>
                  <div className="text-foreground font-semibold text-base sm:text-lg">
                    SGPA = <span className="text-accent">{result?.sgpa.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* SGPA Result Display */}
            <div className="flex flex-col items-center gap-3 sm:gap-4 p-4 sm:p-6 bg-card rounded-lg border">
              <div className="text-center">
                <div className="text-4xl sm:text-6xl font-bold text-accent">{result?.sgpa.toFixed(2)}</div>
                <div className="text-muted-foreground mt-2 text-sm">Your SGPA for this semester</div>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                <span>Total Credits: <strong className="text-foreground">{result?.totalCredits}</strong></span>
                <span className="hidden sm:inline">•</span>
                <span>Total Grade Points: <strong className="text-foreground">{result?.totalGradePoints.toFixed(0)}</strong></span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2 sm:pt-4">
              <Button 
                variant="outline" 
                onClick={onShowCGPA} 
                size="lg"
                className="w-full sm:w-auto sm:flex-1"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Calculate CGPA (Optional)
              </Button>
              <Button 
                onClick={handleDownloadPDF}
                size="lg"
                className="w-full sm:w-auto sm:flex-1 bg-primary hover:bg-primary/90"
              >
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}