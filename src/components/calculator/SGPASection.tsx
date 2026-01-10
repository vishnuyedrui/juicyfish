import { Course, calculateSGPA } from "@/types/calculator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calculator, TrendingUp, Award } from "lucide-react";
import { useState } from "react";
import { GradeBadge } from "./GradeBadge";
import { getGradeFromWGP } from "@/types/calculator";

interface SGPASectionProps {
  courses: Course[];
  onShowCGPA: () => void;
}

export function SGPASection({ courses, onShowCGPA }: SGPASectionProps) {
  const [showResult, setShowResult] = useState(false);
  
  const validCourses = courses.filter(c => c.finalGradePoint !== null && c.name.trim() !== '');
  const canCalculate = validCourses.length > 0;
  const result = calculateSGPA(validCourses);

  if (!canCalculate) {
    return (
      <Card className="border-dashed border-2 border-muted animate-fade-in">
        <CardContent className="py-8 text-center">
          <Calculator className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            Complete at least one course to calculate SGPA
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="animate-fade-in gradient-green border-2 border-accent/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
            <Calculator className="w-5 h-5 text-accent" />
          </div>
          Step 3: SGPA Calculation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {!showResult ? (
          <div className="text-center py-4">
            <p className="text-muted-foreground mb-4">
              You have <span className="font-semibold text-foreground">{validCourses.length}</span> course(s) ready for SGPA calculation.
            </p>
            <Button 
              onClick={() => setShowResult(true)} 
              size="lg"
              className="bg-accent hover:bg-accent/90"
            >
              <Calculator className="w-4 h-4 mr-2" />
              Calculate SGPA
            </Button>
          </div>
        ) : (
          <div className="space-y-6 animate-scale-in">
            {/* Course Summary Table */}
            <div className="bg-card rounded-lg border overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-3 text-sm font-medium">Course</th>
                    <th className="text-center p-3 text-sm font-medium">Credits</th>
                    <th className="text-center p-3 text-sm font-medium">Grade</th>
                    <th className="text-center p-3 text-sm font-medium">Credits × GP</th>
                  </tr>
                </thead>
                <tbody>
                  {validCourses.map((course, i) => (
                    <tr key={course.id} className="border-b last:border-b-0">
                      <td className="p-3 text-sm">{course.name || `Course ${i + 1}`}</td>
                      <td className="p-3 text-center">{course.credits}</td>
                      <td className="p-3 text-center">
                        <GradeBadge letter={course.letterGrade!} point={course.finalGradePoint!} size="sm" />
                      </td>
                      <td className="p-3 text-center font-mono">
                        {course.credits} × {course.finalGradePoint} = {(course.credits * course.finalGradePoint!).toFixed(0)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Formula */}
            <Card className="bg-muted/30 border-dashed">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2 text-accent">
                  <Award className="w-4 h-4" />
                  SGPA Formula
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="font-mono bg-card p-3 rounded border space-y-1">
                  <div className="text-muted-foreground">SGPA = Σ(Credits × Grade Point) ÷ Σ(Total Credits)</div>
                  <div className="text-muted-foreground">
                    SGPA = {result?.totalGradePoints.toFixed(0)} ÷ {result?.totalCredits}
                  </div>
                  <div className="text-foreground font-semibold text-lg">
                    SGPA = <span className="text-accent">{result?.sgpa.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* SGPA Result Display */}
            <div className="flex flex-col items-center gap-4 p-6 bg-card rounded-lg border">
              <div className="text-center">
                <div className="text-6xl font-bold text-accent">{result?.sgpa.toFixed(2)}</div>
                <div className="text-muted-foreground mt-2">Your SGPA for this semester</div>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>Total Credits: <strong className="text-foreground">{result?.totalCredits}</strong></span>
                <span>•</span>
                <span>Total Grade Points: <strong className="text-foreground">{result?.totalGradePoints.toFixed(0)}</strong></span>
              </div>
            </div>

            {/* CGPA Button */}
            <div className="text-center pt-4">
              <Button variant="outline" onClick={onShowCGPA} size="lg">
                <TrendingUp className="w-4 h-4 mr-2" />
                Calculate New CGPA (Optional)
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}