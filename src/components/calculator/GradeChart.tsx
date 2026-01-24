// import { GRADE_MAPPINGS } from "@/types/calculator";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Info } from "lucide-react";

// export function GradeChart() {
//   const gradeColorMap: Record<string, string> = {
//     'grade-o': 'bg-grade-o',
//     'grade-a-plus': 'bg-grade-a-plus',
//     'grade-a': 'bg-grade-a',
//     'grade-b-plus': 'bg-grade-b-plus',
//     'grade-b': 'bg-grade-b',
//     'grade-c': 'bg-grade-c',
//     'grade-p': 'bg-grade-p',
//     'grade-f': 'bg-grade-f',
//   };

//   return (
//     <Card className="bg-card/50">
//       <CardHeader className="pb-2">
//         <CardTitle className="text-sm flex items-center gap-2 text-muted-foreground">
//           <Info className="w-4 h-4" />
//           Grade Conversion Chart
//         </CardTitle>
//       </CardHeader>
//       <CardContent>
//         <div className="flex flex-wrap gap-2">
//           {GRADE_MAPPINGS.map((grade) => (
//             <div
//               key={grade.letter}
//               className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted text-xs"
//             >
//               <div className={`w-3 h-3 rounded-full ${gradeColorMap[grade.color]}`} />
//               <span className="font-semibold">{grade.letter}</span>
//               <span className="text-muted-foreground">
//                 {grade.letter === 'F' ? '< 4.00' : grade.letter === 'P' ? '= 4.00' : `> ${grade.min.toFixed(2)}`}
//               </span>
//             </div>
//           ))}
//         </div>
//       </CardContent>
//     </Card>
//   );
// }




import { GRADE_MAPPINGS } from "@/types/calculator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";

export function GradeChart() {
  const gradeColorMap: Record<string, string> = {
    "grade-o": "bg-grade-o",
    "grade-a-plus": "bg-grade-a-plus",
    "grade-a": "bg-grade-a",
    "grade-b-plus": "bg-grade-b-plus",
    "grade-b": "bg-grade-b",
    "grade-c": "bg-grade-c",
    "grade-p": "bg-grade-p",
    "grade-f": "bg-grade-f",
  };

  // Additional grades that are not in GRADE_MAPPINGS
  const additionalGrades = [
    { letter: 'I', description: 'Incomplete (GP: 4 if both sessionals ≥ 25)', color: 'bg-grade-p' },
    { letter: 'Ab/R', description: 'Absent/Repeat (GP: 0)', color: 'bg-grade-f' },
    { letter: 'L/AB', description: 'LE Absent (GP: 0, Final: F)', color: 'bg-grade-f' },
  ];

  return (
    <Card className="bg-card/50">
      <CardHeader className="pb-2 px-3 sm:px-6">
        <h2 className="text-xs sm:text-sm flex items-center gap-2 text-foreground/70 font-semibold">
          <Info className="w-3 h-3 sm:w-4 sm:h-4" aria-hidden="true" />
          Grade Conversion Chart
        </h2>
      </CardHeader>

      <CardContent className="space-y-3 sm:space-y-4 px-3 sm:px-6">
        {/* Grade Conversion Chart */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {GRADE_MAPPINGS.map((grade) => (
            <div
              key={grade.letter}
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-muted text-[10px] sm:text-xs"
            >
              <div
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${gradeColorMap[grade.color]}`}
              />
              <span className="font-semibold">{grade.letter}</span>
              <span className="text-muted-foreground hidden sm:inline">
                {grade.letter === "F"
                  ? "< 4.00"
                  : grade.letter === "P"
                  ? "= 4.00"
                  : `> ${grade.min.toFixed(2)}`}
              </span>
            </div>
          ))}
        </div>
        
        {/* Additional Special Grades */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {additionalGrades.map((grade) => (
            <div
              key={grade.letter}
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-muted text-[10px] sm:text-xs"
            >
              <div
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${grade.color}`}
              />
              <span className="font-semibold">{grade.letter}</span>
              <span className="text-muted-foreground hidden sm:inline">
                {grade.description}
              </span>
            </div>
          ))}
        </div>

        {/* Image Below Grade Conversion Chart */}
        <div className="flex flex-col items-center pt-2 sm:pt-4">
          <img
            src="/grade-conversion.webp"
            width="630"
            height="352"
            fetchPriority="high"
            decoding="async"
            alt="Grade points and symbols in relative grading"
            className="max-w-full w-full sm:w-[600px] rounded-lg border shadow-md"
          />
          <p className="text-[10px] sm:text-xs text-muted-foreground mt-2 text-center">
            Grade points and symbols in relative grading
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
