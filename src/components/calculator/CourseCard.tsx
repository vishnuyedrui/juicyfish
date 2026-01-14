// import { Course, Assessment, calculateWGP, getGradeFromWGP } from "@/types/calculator";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Trash2, BookOpen, Lock } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { GradeBadge } from "./GradeBadge";
// import { WGPFormula } from "./WGPFormula";

// interface CourseCardProps {
//   course: Course;
//   index: number;
//   onUpdate: (course: Course) => void;
//   onRemove: () => void;
//   canRemove: boolean;
// }

// export function CourseCard({ course, index, onUpdate, onRemove, canRemove }: CourseCardProps) {
//   const updateAssessment = (assessmentIndex: number, value: string) => {
//     const numValue = value === '' ? null : Math.min(10, Math.max(0, parseFloat(value) || 0));
//     const newAssessments = course.assessments.map((a, i) => 
//       i === assessmentIndex ? { ...a, gradePoint: numValue } : a
//     );
    
//     const wgp = calculateWGP(newAssessments);
//     let letterGrade = null;
//     let finalGradePoint = null;
    
//     if (wgp !== null) {
//       const grade = getGradeFromWGP(wgp);
//       letterGrade = grade.letter;
//       finalGradePoint = grade.point;
//     }
    
//     onUpdate({
//       ...course,
//       assessments: newAssessments,
//       wgp,
//       letterGrade,
//       finalGradePoint,
//     });
//   };

//   const gradientColors = [
//     "gradient-purple",
//     "gradient-blue",
//     "gradient-green",
//     "gradient-orange",
//   ];

//   return (
//     <Card className={cn(
//       "animate-fade-in border-2 transition-all duration-300 hover:shadow-lg",
//       gradientColors[index % gradientColors.length],
//       course.wgp !== null ? "border-accent/30" : "border-transparent"
//     )}>
//       <CardHeader className="pb-4">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
//               <BookOpen className="w-5 h-5 text-primary" />
//             </div>
//             <CardTitle className="text-lg">Course {index + 1}</CardTitle>
//           </div>
//           {canRemove && (
//             <Button
//               variant="ghost"
//               size="icon"
//               onClick={onRemove}
//               className="text-muted-foreground hover:text-destructive"
//             >
//               <Trash2 className="w-4 h-4" />
//             </Button>
//           )}
//         </div>
//       </CardHeader>
      
//       <CardContent className="space-y-6">
//         {/* Course Info */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//           <div className="space-y-2">
//             <Label htmlFor={`name-${course.id}`}>Course Name</Label>
//             <Input
//               id={`name-${course.id}`}
//               placeholder="e.g., Mathematics"
//               value={course.name}
//               onChange={(e) => onUpdate({ ...course, name: e.target.value })}
//               className="bg-card"
//             />
//           </div>
//           <div className="space-y-2">
//             <Label htmlFor={`credits-${course.id}`}>Credits</Label>
//             <Input
//               id={`credits-${course.id}`}
//               type="number"
//               min={1}
//               max={10}
//               value={course.credits}
//               onChange={(e) => onUpdate({ ...course, credits: parseInt(e.target.value)})}
//               className="bg-card"
//             />
//           </div>
//         </div>

//         {/* Assessments Table */}
//         <div className="space-y-3">
//           <h4 className="font-medium text-sm text-muted-foreground">Assessment Grades</h4>
//           <div className="bg-card rounded-lg border overflow-hidden">
//             <table className="w-full">
//               <thead>
//                 <tr className="border-b bg-muted/50">
//                   <th className="text-left p-3 text-sm font-medium">Assessment</th>
//                   <th className="text-center p-3 text-sm font-medium w-24">Weight</th>
//                   <th className="text-center p-3 text-sm font-medium w-32">Grade (0-10)</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {course.assessments.map((assessment, i) => (
//                   <tr key={assessment.name} className="border-b last:border-b-0">
//                     <td className="p-3 text-sm">{assessment.name}</td>
//                     <td className="p-3 text-center">
//                       <div className="inline-flex items-center gap-1 text-sm text-muted-foreground bg-muted px-2 py-1 rounded">
//                         <Lock className="w-3 h-3" />
//                         {(assessment.weight * 100).toFixed(0)}%
//                       </div>
//                     </td>
//                     <td className="p-3">
//                       <Input
//                         type="number"
//                         min={0}
//                         max={10}
//                         step={0.1}
//                         placeholder="0-10"
//                         value={assessment.gradePoint ?? ''}
//                         onChange={(e) => updateAssessment(i, e.target.value)}
//                         className="w-full text-center bg-background"
//                       />
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* WGP Result */}
//         {course.wgp !== null && (
//           <div className="animate-scale-in space-y-4">
//             <WGPFormula assessments={course.assessments} wgp={course.wgp} />
            
//             {/* Letter Grade */}
//             <div className="flex items-center justify-center gap-4 p-4 bg-card rounded-lg border">
//               <GradeBadge letter={course.letterGrade!} point={course.finalGradePoint!} />
//               <div className="text-sm text-muted-foreground">
//                 WGP of <span className="font-semibold text-foreground">{course.wgp.toFixed(2)}</span> → Grade <span className="font-semibold text-foreground">{course.letterGrade}</span>
//               </div>
//             </div>
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   );
// }







// import {
//   Course,
//   calculateWGP,
//   getGradeFromWGP,
//   calculateFinalGradePointWithLab,
// } from "@/types/calculator";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Trash2, BookOpen, Lock } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { GradeBadge } from "./GradeBadge";
// import { WGPFormula } from "./WGPFormula";

// interface CourseCardProps {
//   course: Course & {
//     hasLab?: boolean;
//     labMarks?: number | null;
//   };
//   index: number;
//   onUpdate: (course: Course) => void;
//   onRemove: () => void;
//   canRemove: boolean;
// }

// export function CourseCard({
//   course,
//   index,
//   onUpdate,
//   onRemove,
//   canRemove,
// }: CourseCardProps) {
//   const updateAssessment = (assessmentIndex: number, value: string) => {
//     const numValue =
//       value === "" ? null : Math.min(10, Math.max(0, parseFloat(value)));

//     const newAssessments = course.assessments.map((a, i) =>
//       i === assessmentIndex ? { ...a, gradePoint: numValue } : a
//     );

//     const wgp = calculateWGP(newAssessments);

//     let finalGradePoint = null;
//     let letterGrade = null;

//     if (wgp !== null) {
//       let effectiveGP = wgp;

//       if (course.hasLab && course.labMarks !== null) {
//         effectiveGP = calculateFinalGradePointWithLab(wgp, course.labMarks);
//       }

//       const grade = getGradeFromWGP(effectiveGP);
//       finalGradePoint = effectiveGP;
//       letterGrade = grade.letter;
//     }

//     onUpdate({
//       ...course,
//       assessments: newAssessments,
//       wgp,
//       finalGradePoint,
//       letterGrade,
//     });
//   };

//   const handleLabToggle = (checked: boolean) => {
//     onUpdate({
//       ...course,
//       hasLab: checked,
//       labMarks: checked ? course.labMarks ?? null : null,
//       finalGradePoint: checked ? course.finalGradePoint : course.wgp,
//     });
//   };

//   const handleLabMarksChange = (value: string) => {
//     const labMarks =
//       value === "" ? null : Math.min(100, Math.max(0, parseFloat(value)));

//     if (course.wgp !== null && labMarks !== null) {
//       const finalGP = calculateFinalGradePointWithLab(course.wgp, labMarks);
//       const grade = getGradeFromWGP(finalGP);

//       onUpdate({
//         ...course,
//         labMarks,
//         finalGradePoint: finalGP,
//         letterGrade: grade.letter,
//       });
//     } else {
//       onUpdate({ ...course, labMarks });
//     }
//   };

//   const gradientColors = [
//     "gradient-purple",
//     "gradient-blue",
//     "gradient-green",
//     "gradient-orange",
//   ];

//   return (
//     <Card
//       className={cn(
//         "animate-fade-in border-2 transition-all duration-300 hover:shadow-lg",
//         gradientColors[index % gradientColors.length],
//         course.wgp !== null ? "border-accent/30" : "border-transparent"
//       )}
//     >
//       <CardHeader className="pb-4">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
//               <BookOpen className="w-5 h-5 text-primary" />
//             </div>
//             <CardTitle className="text-lg">Course {index + 1}</CardTitle>
//           </div>
//           {canRemove && (
//             <Button
//               variant="ghost"
//               size="icon"
//               onClick={onRemove}
//               className="text-muted-foreground hover:text-destructive"
//             >
//               <Trash2 className="w-4 h-4" />
//             </Button>
//           )}
//         </div>
//       </CardHeader>

//       <CardContent className="space-y-6">
//         {/* Course Info */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//           {/* Course Name */}
//           <div className="space-y-2">
//             <Label>Course Name</Label>
//             <Input
//               value={course.name}
//               onChange={(e) =>
//                 onUpdate({ ...course, name: e.target.value })
//               }
//               className="bg-card"
//             />

//             {/* ✅ Lab checkbox UNDER course name input */}
//             <div className="flex items-center gap-2 mt-1">
//               <input
//                 type="checkbox"
//                 checked={course.hasLab || false}
//                 onChange={(e) => handleLabToggle(e.target.checked)}
//               />
//               <Label className="text-xs text-muted-foreground">
//                 This course has Lab
//               </Label>
//             </div>
//           </div>

//           {/* Credits */}
//           <div className="space-y-2">
//             <Label>Credits</Label>
//             <Input
//               type="number"
//               min={1}
//               max={10}
//               value={course.credits}
//               onChange={(e) =>
//                 onUpdate({
//                   ...course,
//                   credits: parseInt(e.target.value),
//                 })
//               }
//               className="bg-card"
//             />
//           </div>
//         </div>

//         {/* Assessments */}
//         <div className="space-y-3">
//           <h4 className="font-medium text-sm text-muted-foreground">
//             Assessment Grades
//           </h4>
//           <div className="bg-card rounded-lg border overflow-hidden">
//             <table className="w-full">
//               <thead>
//                 <tr className="border-b bg-muted/50">
//                   <th className="text-left p-3 text-sm font-medium">
//                     Assessment
//                   </th>
//                   <th className="text-center p-3 text-sm font-medium w-24">
//                     Weight
//                   </th>
//                   <th className="text-center p-3 text-sm font-medium w-32">
//                     Grade (0–10)
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {course.assessments.map((assessment, i) => (
//                   <tr key={assessment.name} className="border-b">
//                     <td className="p-3 text-sm">{assessment.name}</td>
//                     <td className="p-3 text-center">
//                       <div className="inline-flex items-center gap-1 text-sm text-muted-foreground bg-muted px-2 py-1 rounded">
//                         <Lock className="w-3 h-3" />
//                         {(assessment.weight * 100).toFixed(0)}%
//                       </div>
//                     </td>
//                     <td className="p-3">
//                       <Input
//                         type="number"
//                         min={0}
//                         max={10}
//                         step={0.1}
//                         value={assessment.gradePoint ?? ""}
//                         onChange={(e) =>
//                           updateAssessment(i, e.target.value)
//                         }
//                         className="w-full text-center bg-background"
//                       />
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Lab Marks */}
//         {course.hasLab && (
//           <div className="space-y-2">
//             <Label>Lab Marks (out of 100)</Label>
//             <Input
//               type="number"
//               min={0}
//               max={100}
//               value={course.labMarks ?? ""}
//               onChange={(e) => handleLabMarksChange(e.target.value)}
//               className="bg-card"
//             />
//           </div>
//         )}

//         {/* Results */}
//         {course.wgp !== null && (
//           <div className="animate-scale-in space-y-4">
//             {/* <WGPFormula assessments={course.assessments} wgp={course.wgp} /> */}
//             <WGPFormula
//               assessments={course.assessments}
//               wgp={course.wgp}
//               hasLab={course.hasLab}
//               labMarks={course.labMarks}
//               finalGradePoint={course.finalGradePoint}
//             />


//             {course.finalGradePoint !== null && course.letterGrade && (
//               <div className="flex items-center justify-center gap-4 p-4 bg-card rounded-lg border">
//                 <GradeBadge
//                   letter={course.letterGrade}
//                   point={course.finalGradePoint}
//                 />
//                 <div className="text-sm text-muted-foreground">
//                   Final Grade Point:{" "}
//                   <span className="font-semibold text-foreground">
//                     {course.finalGradePoint}
//                   </span>
//                 </div>
//               </div>
//             )}
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   );
// }




import {
  Course,
  Assessment,
  calculateWGP,
  getGradeFromWGP,
  calculateFinalGradePointWithLab,
  determineFinalGrade,
  requiresMarksInput,
  sessionalsNeedMarks,
  bothSessionalsHaveMarks,
  calculateTotalSessionalMarks,
  MARKS_REQUIRED_GRADES,
} from "@/types/calculator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, BookOpen, Lock, AlertTriangle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { GradeBadge } from "./GradeBadge";
import { WGPFormula } from "./WGPFormula";

// Grade options for Sessional 1 and Sessional 2
const SESSIONAL_GRADE_OPTIONS = [
  { label: "O", value: 10 },
  { label: "A+", value: 9 },
  { label: "A", value: 8 },
  { label: "B+", value: 7 },
  { label: "B", value: 6 },
  { label: "C", value: 5 },
  { label: "P", value: -1 },   // Requires marks input
  { label: "I", value: -1 },   // Requires marks input
  { label: "Ab/R", value: -1 }, // Requires marks input
];

// Grade options for Learning Engagement
const LE_GRADE_OPTIONS = [
  { label: "O", value: 10 },
  { label: "A+", value: 9 },
  { label: "A", value: 8 },
  { label: "B+", value: 7 },
  { label: "B", value: 6 },
  { label: "C", value: 5 },
  { label: "P", value: 4 },
  { label: "L/AB", value: 0 },
];

// CLAD grade options
const CLAD_GRADE_OPTIONS = [
  { label: "O", value: 10 },
  { label: "A+", value: 9 },
  { label: "A", value: 8 },
  { label: "B+", value: 7 },
  { label: "B", value: 6 },
  { label: "C", value: 5 },
  { label: "P", value: 4 },
  { label: "I", value: 4 },
];


interface CourseCardProps {
  course: Course;
  index: number;
  onUpdate: (course: Course) => void;
  onRemove: () => void;
  canRemove: boolean;
}

export function CourseCard({
  course,
  index,
  onUpdate,
  onRemove,
  canRemove,
}: CourseCardProps) {
  // ✅ CLAD detection (case-insensitive)
  const isCLAD = course.name.trim().toLowerCase() === "clad";

  // Helper to get grade options based on assessment type
  const getGradeOptions = (assessmentName: string) => {
    if (assessmentName === 'Learning Engagement') {
      return LE_GRADE_OPTIONS;
    }
    return SESSIONAL_GRADE_OPTIONS;
  };

  // Helper to recalculate and update course based on assessments
  const recalculateCourse = (newAssessments: Assessment[]) => {
    // Use the new unified grading logic
    const gradeResult = determineFinalGrade(newAssessments);
    
    // If special case is determined (F or I based on marks)
    if (gradeResult.isSpecialCase) {
      if (gradeResult.letterGrade === 'F') {
        // All assessments get 0 for WGP display purposes
        const zeroedAssessments = newAssessments.map(a => ({ ...a, gradePoint: 0 }));
        onUpdate({
          ...course,
          assessments: newAssessments,
          wgp: 0,
          finalGradePoint: 0,
          letterGrade: 'F',
        });
        return;
      }
      
      if (gradeResult.letterGrade === 'I') {
        // I grade with GP = 4
        const effectiveGP = course.hasLab && course.labMarks !== null
          ? calculateFinalGradePointWithLab(4, course.labMarks)
          : 4;
        
        // For WGP display, use GP 4 for the assessments that need marks
        const displayAssessments = newAssessments.map(a => {
          if (requiresMarksInput(a.gradeLabel ?? null)) {
            return { ...a, gradePoint: 4 };
          }
          return a;
        });
        
        onUpdate({
          ...course,
          assessments: displayAssessments,
          wgp: 4,
          finalGradePoint: effectiveGP,
          letterGrade: 'I',
        });
        return;
      }
    }
    
    // If waiting for marks input
    if (gradeResult.letterGrade === null && sessionalsNeedMarks(newAssessments) && !bothSessionalsHaveMarks(newAssessments)) {
      // Keep current state but update assessments
      onUpdate({
        ...course,
        assessments: newAssessments,
        wgp: null,
        finalGradePoint: null,
        letterGrade: null,
      });
      return;
    }
    
    // Normal calculation - all assessments must have valid grade points
    const rawWGP = calculateWGP(newAssessments);
    const wgp = rawWGP !== null ? Math.min(10, Math.ceil(rawWGP)) : null;

    let finalGradePoint = null;
    let letterGrade = null;

    if (wgp !== null) {
      let effectiveGP = wgp;

      if (course.hasLab && course.labMarks !== null) {
        effectiveGP = calculateFinalGradePointWithLab(wgp, course.labMarks);
      }

      const grade = getGradeFromWGP(effectiveGP);
      finalGradePoint = effectiveGP;
      letterGrade = grade.letter;
    }

    onUpdate({
      ...course,
      assessments: newAssessments,
      wgp,
      finalGradePoint,
      letterGrade,
    });
  };

  const updateAssessmentGrade = (assessmentIndex: number, gradeLabel: string) => {
    const gradeOptions = getGradeOptions(course.assessments[assessmentIndex].name);
    const selected = gradeOptions.find(g => g.label === gradeLabel);
    
    if (!selected) {
      // Clear the assessment
      const newAssessments = course.assessments.map((a, i) =>
        i === assessmentIndex ? { ...a, gradePoint: null, gradeLabel: null, marks: null } : a
      );
      recalculateCourse(newAssessments);
      return;
    }
    
    // Check if this grade requires marks input (P, I, Ab/R for sessionals)
    const isSessional = course.assessments[assessmentIndex].name === 'Sessional 1' || 
                        course.assessments[assessmentIndex].name === 'Sessional 2';
    
    if (isSessional && MARKS_REQUIRED_GRADES.includes(gradeLabel)) {
      // Set grade label but gradePoint null until marks are entered
      const newAssessments = course.assessments.map((a, i) =>
        i === assessmentIndex ? { ...a, gradePoint: null, gradeLabel: gradeLabel, marks: null } : a
      );
      recalculateCourse(newAssessments);
      return;
    }
    
    // For other grades, set the grade point directly
    const newAssessments = course.assessments.map((a, i) =>
      i === assessmentIndex ? { ...a, gradePoint: selected.value, gradeLabel: gradeLabel, marks: null } : a
    );
    recalculateCourse(newAssessments);
  };

  const updateAssessmentMarks = (assessmentIndex: number, marksValue: string) => {
    const marks = marksValue === "" ? null : Math.min(100, Math.max(0, parseFloat(marksValue)));
    
    const newAssessments = course.assessments.map((a, i) => {
      if (i !== assessmentIndex) return a;
      // Store the marks, gradePoint will be determined by the final grade logic
      return { ...a, marks };
    });
    
    recalculateCourse(newAssessments);
  };

  const handleLabToggle = (checked: boolean) => {
    onUpdate({
      ...course,
      hasLab: checked,
      labMarks: checked ? course.labMarks ?? null : null,
      finalGradePoint: checked ? course.finalGradePoint : course.wgp,
    });
  };

  const handleLabMarksChange = (value: string) => {
    const labMarks =
      value === "" ? null : Math.min(100, Math.max(0, parseFloat(value)));

    if (course.wgp !== null && labMarks !== null) {
      const finalGP = calculateFinalGradePointWithLab(course.wgp, labMarks);
      const grade = getGradeFromWGP(finalGP);

      onUpdate({
        ...course,
        labMarks,
        finalGradePoint: finalGP,
        letterGrade: grade.letter,
      });
    } else {
      onUpdate({ ...course, labMarks });
    }
  };

  const gradientColors = [
    "gradient-purple",
    "gradient-blue",
    "gradient-green",
    "gradient-orange",
  ];

  return (
    <Card
      className={cn(
        "animate-fade-in border-2 transition-all duration-300 hover:shadow-lg",
        gradientColors[index % gradientColors.length],
        course.wgp !== null || course.finalGradePoint !== null
          ? "border-accent/30"
          : "border-transparent"
      )}
    >
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
          {/* Course Name */}
          <div className="space-y-2">
            <Label>Course Name</Label>
            <Input
              value={course.name}
              onChange={(e) =>
                onUpdate({ ...course, name: e.target.value })
              }
              className="bg-card"
            />

            {/* CLAD note */}
            {isCLAD && (
              <p className="text-xs text-muted-foreground">
                CLAD course: Enter final grade point directly. Credits = 1.
              </p>
            )}

            {/* Lab option (NOT for CLAD) */}
            {!isCLAD && (
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="checkbox"
                  checked={course.hasLab || false}
                  onChange={(e) => handleLabToggle(e.target.checked)}
                />
                <Label className="text-xs text-muted-foreground">
                  This course has Lab
                </Label>
              </div>
            )}
          </div>

          {/* Credits */}
          <div className="space-y-2">
            <Label>Credits</Label>
            <Input
              type="number"
              min={1}
              max={10}
              value={isCLAD ? 1 : course.credits}
              disabled={isCLAD}
              onChange={(e) =>
                onUpdate({
                  ...course,
                  credits: parseInt(e.target.value),
                })
              }
              className="bg-card"
            />
          </div>
        </div>

        {/* CLAD: Direct Grade Point Input */}
       {/* CLAD: Grade Selection */}
        {isCLAD && (
          <div className="space-y-2">
            <Label>Final Grade</Label>
            <select
              className="w-full rounded-md border bg-card px-2 py-2 text-center"
              value={course.letterGrade ?? ""}
              onChange={(e) => {
                const selected = CLAD_GRADE_OPTIONS.find(
                  g => g.label === e.target.value
                );
        
                if (!selected) return;
        
                onUpdate({
                  ...course,
                  credits: 1,              // ✅ fixed
                  wgp: selected.value,     // ✅ GP
                  finalGradePoint: selected.value,
                  letterGrade: selected.label,
                  assessments: [],         // ✅ no theory
                  hasLab: false,
                  labMarks: null,
                });
              }}
            >
              <option value="">Select Grade</option>
              {CLAD_GRADE_OPTIONS.map((g) => (
                <option key={g.label} value={g.label}>
                  {g.label}
                </option>
              ))}
            </select>
          </div>
        )}


        {/* Assessments (hidden for CLAD) */}
        {!isCLAD && (
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground">
              Assessment Grades
            </h4>
            <div className="bg-card rounded-lg border overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-3 text-sm font-medium">
                      Assessment
                    </th>
                    <th className="text-center p-3 text-sm font-medium w-24">
                      Weight
                    </th>
                    <th className="text-center p-3 text-sm font-medium w-40">
                      Grade
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {course.assessments.map((assessment, i) => {
                    const gradeOptions = getGradeOptions(assessment.name);
                    const isIGrade = assessment.gradeLabel === 'I';
                    const isSessional = assessment.name === 'Sessional 1' || assessment.name === 'Sessional 2';
                    
                    return (
                      <tr key={assessment.name} className="border-b">
                        <td className="p-3 text-sm">{assessment.name}</td>
                        <td className="p-3 text-center">
                          <div className="inline-flex items-center gap-1 text-sm text-muted-foreground bg-muted px-2 py-1 rounded">
                            <Lock className="w-3 h-3" />
                            {(assessment.weight * 100).toFixed(0)}%
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="space-y-2">
                            <select
                              className="w-full rounded-md border bg-background px-2 py-1 text-center"
                              value={assessment.gradeLabel ?? ""}
                              onChange={(e) => updateAssessmentGrade(i, e.target.value)}
                            >
                              <option value="">Select</option>
                              {gradeOptions.map((g) => (
                                <option key={g.label} value={g.label}>
                                  {g.label}
                                </option>
                              ))}
                            </select>
                            
                            {/* Show marks input for P, I, Ab/R grades on sessionals */}
                            {isSessional && requiresMarksInput(assessment.gradeLabel ?? null) && (
                              <Input
                                type="number"
                                min={0}
                                max={100}
                                placeholder="Enter marks (0-100)"
                                value={assessment.marks ?? ""}
                                onChange={(e) => updateAssessmentMarks(i, e.target.value)}
                                className="w-full text-center bg-background text-sm"
                              />
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            {/* Show status messages for special conditions */}
            {sessionalsNeedMarks(course.assessments) && !bothSessionalsHaveMarks(course.assessments) && (
              <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 dark:bg-amber-950/30 p-2 rounded">
                <AlertTriangle className="w-4 h-4" />
                <span>Enter marks for both sessionals to calculate grade</span>
              </div>
            )}
            
            {course.letterGrade === 'F' && (
              <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-2 rounded">
                <AlertTriangle className="w-4 h-4" />
                <span>
                  {determineFinalGrade(course.assessments).reason === 'Total sessional marks < 25' && 'Total sessional marks < 25 - Grade: F'}
                  {determineFinalGrade(course.assessments).reason === 'Learning Engagement is L/AB' && 'Learning Engagement is L/AB - Grade: F'}
                </span>
              </div>
            )}
            
            {course.letterGrade === 'I' && (
              <div className="flex items-center gap-2 text-sm text-primary bg-primary/10 p-2 rounded">
                <CheckCircle className="w-4 h-4" />
                <span>Total sessional marks ≥ 25 - Grade: I (Grade Point: 4)</span>
              </div>
            )}
          </div>
        )}

        {/* Lab Marks */}
        {/* Lab Marks */}
        {!isCLAD && course.hasLab && (
          <div className="space-y-2">
            <Label>Lab Marks (out of 100)</Label>
            <Input
              type="number"
              min={0}
              max={100}
              placeholder="Enter lab marks"
              value={course.labMarks ?? ""}
              onChange={(e) => {
                const labMarks =
                  e.target.value === ""
                    ? null
                    : Math.min(100, Math.max(0, Number(e.target.value)));
        
                if (course.wgp !== null && labMarks !== null) {
                  const finalGP = calculateFinalGradePointWithLab(
                    course.wgp,
                    labMarks
                  );
                  const grade = getGradeFromWGP(finalGP);
        
                  onUpdate({
                    ...course,
                    labMarks,
                    finalGradePoint: finalGP,
                    letterGrade: grade.letter,
                  });
                } else {
                  onUpdate({ ...course, labMarks });
                }
              }}
              className="bg-card"
            />
          </div>
        )}


        {/* Results */}
        {(course.wgp !== null || course.finalGradePoint !== null) && (
          <div className="animate-scale-in space-y-4">
            {!isCLAD && course.wgp !== null && (
              <WGPFormula
                assessments={course.assessments}
                wgp={course.wgp}
                hasLab={course.hasLab}
                labMarks={course.labMarks}
                finalGradePoint={course.finalGradePoint}
              />
            )}

            {course.finalGradePoint !== null && course.letterGrade && (
              <div className="flex items-center justify-center gap-4 p-4 bg-card rounded-lg border">
                <GradeBadge
                  letter={course.letterGrade}
                  point={course.finalGradePoint}
                />
                <div className="text-sm text-muted-foreground">
                  Final Grade Point:{" "}
                  <span className="font-semibold text-foreground">
                    {course.finalGradePoint}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}



