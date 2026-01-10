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
    'grade-o': 'bg-grade-o',
    'grade-a-plus': 'bg-grade-a-plus',
    'grade-a': 'bg-grade-a',
    'grade-b-plus': 'bg-grade-b-plus',
    'grade-b': 'bg-grade-b',
    'grade-c': 'bg-grade-c',
    'grade-p': 'bg-grade-p',
    'grade-f': 'bg-grade-f',
  };

  return (
    <Card className="bg-card/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2 text-muted-foreground">
          <Info className="w-4 h-4" />
          Grade Conversion Chart
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Grade Conversion Chart */}
        <div className="flex flex-wrap gap-2">
          {GRADE_MAPPINGS.map((grade) => (
            <div
              key={grade.letter}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted text-xs"
            >
              <div className={`w-3 h-3 rounded-full ${gradeColorMap[grade.color]}`} />
              <span className="font-semibold">{grade.letter}</span>
              <span className="text-muted-foreground">
                {grade.letter === "F"
                  ? "< 4.00"
                  : grade.letter === "P"
                  ? "= 4.00"
                  : `> ${grade.min.toFixed(2)}`}
              </span>
            </div>
          ))}
        </div>

        {/* Image BELOW the chart */}
        <div className="flex flex-col items-center pt-4">
          <img
            src="/58f79853-ae7d-4df4-8b5e-bcb0bcc0ef69.png"
            alt="Grade points and symbols in relative grading"
            className="max-w-full w-[600px] rounded-lg border shadow-md"
          />
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Grade points and symbols in relative grading
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
