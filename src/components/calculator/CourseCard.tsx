import { Course, Assessment, calculateWGP, getGradeFromWGP } from "@/types/calculator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, BookOpen, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { GradeBadge } from "./GradeBadge";
import { WGPFormula } from "./WGPFormula";

interface CourseCardProps {
  course: Course;
  index: number;
  onUpdate: (course: Course) => void;
  onRemove: () => void;
  canRemove: boolean;
}

export function CourseCard({ course, index, onUpdate, onRemove, canRemove }: CourseCardProps) {
  const updateAssessment = (assessmentIndex: number, value: string) => {
    const numValue = value === '' ? null : Math.min(10, Math.max(0, parseFloat(value) || 0));
    const newAssessments = course.assessments.map((a, i) => 
      i === assessmentIndex ? { ...a, gradePoint: numValue } : a
    );
    
    const wgp = calculateWGP(newAssessments);
    let letterGrade = null;
    let finalGradePoint = null;
    
    if (wgp !== null) {
      const grade = getGradeFromWGP(wgp);
      letterGrade = grade.letter;
      finalGradePoint = grade.point;
    }
    
    onUpdate({
      ...course,
      assessments: newAssessments,
      wgp,
      letterGrade,
      finalGradePoint,
    });
  };

  const gradientColors = [
    "gradient-purple",
    "gradient-blue",
    "gradient-green",
    "gradient-orange",
  ];

  return (
    <Card className={cn(
      "animate-fade-in border-2 transition-all duration-300 hover:shadow-lg",
      gradientColors[index % gradientColors.length],
      course.wgp !== null ? "border-accent/30" : "border-transparent"
    )}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <CardTitle className="text-lg">Course {index + 1}</CardTitle>
          </div>
          {canRemove && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onRemove}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Course Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`name-${course.id}`}>Course Name</Label>
            <Input
              id={`name-${course.id}`}
              placeholder="e.g., Mathematics"
              value={course.name}
              onChange={(e) => onUpdate({ ...course, name: e.target.value })}
              className="bg-card"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`credits-${course.id}`}>Credits</Label>
            <Input
              id={`credits-${course.id}`}
              type="number"
              min={1}
              max={10}
              value={course.credits}
              onChange={(e) => onUpdate({ ...course, credits: parseInt(e.target.value)})}
              className="bg-card"
            />
          </div>
        </div>

        {/* Assessments Table */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm text-muted-foreground">Assessment Grades</h4>
          <div className="bg-card rounded-lg border overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 text-sm font-medium">Assessment</th>
                  <th className="text-center p-3 text-sm font-medium w-24">Weight</th>
                  <th className="text-center p-3 text-sm font-medium w-32">Grade (0-10)</th>
                </tr>
              </thead>
              <tbody>
                {course.assessments.map((assessment, i) => (
                  <tr key={assessment.name} className="border-b last:border-b-0">
                    <td className="p-3 text-sm">{assessment.name}</td>
                    <td className="p-3 text-center">
                      <div className="inline-flex items-center gap-1 text-sm text-muted-foreground bg-muted px-2 py-1 rounded">
                        <Lock className="w-3 h-3" />
                        {(assessment.weight * 100).toFixed(0)}%
                      </div>
                    </td>
                    <td className="p-3">
                      <Input
                        type="number"
                        min={0}
                        max={10}
                        step={0.1}
                        placeholder="0-10"
                        value={assessment.gradePoint ?? ''}
                        onChange={(e) => updateAssessment(i, e.target.value)}
                        className="w-full text-center bg-background"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* WGP Result */}
        {course.wgp !== null && (
          <div className="animate-scale-in space-y-4">
            <WGPFormula assessments={course.assessments} wgp={course.wgp} />
            
            {/* Letter Grade */}
            <div className="flex items-center justify-center gap-4 p-4 bg-card rounded-lg border">
              <GradeBadge letter={course.letterGrade!} point={course.finalGradePoint!} />
              <div className="text-sm text-muted-foreground">
                WGP of <span className="font-semibold text-foreground">{course.wgp.toFixed(2)}</span> → Grade <span className="font-semibold text-foreground">{course.letterGrade}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
