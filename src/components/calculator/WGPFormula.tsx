// import { Assessment } from "@/types/calculator";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Calculator } from "lucide-react";

// interface WGPFormulaProps {
//   assessments: Assessment[];
//   wgp: number;
// }

// export function WGPFormula({ assessments, wgp }: WGPFormulaProps) {
//   return (
//     <Card className="bg-muted/30 border-dashed">
//       <CardHeader className="pb-2">
//         <CardTitle className="text-sm flex items-center gap-2 text-primary">
//           <Calculator className="w-4 h-4" />
//           Step-by-Step Calculation
//         </CardTitle>
//       </CardHeader>
//       <CardContent className="space-y-3 text-sm">
//         <div className="font-mono bg-card p-3 rounded border space-y-1">
//           <div className="text-muted-foreground">WGP = (S1 × 0.30) + (S2 × 0.45) + (LE × 0.25)</div>
//           <div className="text-muted-foreground">
//             WGP = ({assessments[0].gradePoint?.toFixed(1)} × 0.30) + ({assessments[1].gradePoint?.toFixed(1)} × 0.45) + ({assessments[2].gradePoint?.toFixed(1)} × 0.25)
//           </div>
//           <div className="text-muted-foreground">
//             WGP = {(assessments[0].gradePoint! * 0.30).toFixed(2)} + {(assessments[1].gradePoint! * 0.45).toFixed(2)} + {(assessments[2].gradePoint! * 0.25).toFixed(2)}
//           </div>
//           <div className="text-foreground font-semibold">
//             WGP = <span className="text-primary">{wgp.toFixed(2)}</span>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }




import { Assessment } from "@/types/calculator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, FlaskConical } from "lucide-react";

interface WGPFormulaProps {
  assessments: Assessment[];
  wgp: number;

  // 👇 NEW (optional props for lab)
  hasLab?: boolean;
  labMarks?: number | null;
  finalGradePoint?: number | null;
}

export function WGPFormula({
  assessments,
  wgp,
  hasLab = false,
  labMarks = null,
  finalGradePoint = null,
}: WGPFormulaProps) {
  // Lab calculations (only if lab exists)
  const theoryContribution = (wgp / 10) * 100 * 0.70;
  const labContribution =
    labMarks !== null ? labMarks * 0.30 : null;
  const finalPercentage =
    labContribution !== null
      ? theoryContribution + labContribution
      : null;
    // 👇 ONLY FOR DISPLAY (no logic change)
  const rawWGP = assessments.reduce(
    (sum, a) => sum + a.gradePoint! * a.weight,
    0
  );

  const ceiledWGP = Math.min(10, Math.ceil(rawWGP));


  return (
    <Card className="bg-muted/30 border-dashed">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2 text-primary">
          <Calculator className="w-4 h-4" />
          Step-by-Step Calculation
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 text-sm">
        {/* ---------------- WGP CALCULATION ---------------- */}
        <div className="font-mono bg-card p-3 rounded border space-y-1">
          <div className="text-muted-foreground">
            WGP = (S1 × 0.30) + (S2 × 0.45) + (LE × 0.25)
          </div>

          <div className="text-muted-foreground">
            WGP = ({assessments[0].gradePoint?.toFixed(1)} × 0.30) + (
            {assessments[1].gradePoint?.toFixed(1)} × 0.45) + (
            {assessments[2].gradePoint?.toFixed(1)} × 0.25)
          </div>

          <div className="text-muted-foreground">
            WGP = {(assessments[0].gradePoint! * 0.30).toFixed(2)} +{" "}
            {(assessments[1].gradePoint! * 0.45).toFixed(2)} +{" "}
            {(assessments[2].gradePoint! * 0.25).toFixed(2)}
          </div>

          <div className="text-muted-foreground">
            WGP = {rawWGP.toFixed(2)}
          </div>
          
          <div className="text-muted-foreground">
            WGP = ceil({rawWGP.toFixed(2)})
          </div>
          
          <div className="text-foreground font-semibold">
            WGP = <span className="text-primary">{ceiledWGP.toFixed(2)}</span>
          </div>


        </div>

        {/* ---------------- LAB + THEORY CALCULATION ---------------- */}
        {hasLab && labMarks !== null && finalGradePoint !== null && (
          <div className="font-mono bg-card p-3 rounded border space-y-1">
            <div className="flex items-center gap-2 text-primary font-medium">
              <FlaskConical className="w-4 h-4" />
              Lab + Theory Calculation
            </div>

            <div className="text-muted-foreground">
              Final GP = [(WGP ÷ 10 × 100 × 0.70) + (Lab × 0.30)] ÷ 10
            </div>

            <div className="text-muted-foreground">
              Theory = ({wgp.toFixed(2)} ÷ 10) × 100 × 0.70 ={" "}
              {theoryContribution.toFixed(2)}
            </div>

            <div className="text-muted-foreground">
              Lab = {labMarks} × 0.30 ={" "}
              {labContribution?.toFixed(2)}
            </div>

            <div className="text-muted-foreground">
              Final % = {theoryContribution.toFixed(2)} +{" "}
              {labContribution?.toFixed(2)} ={" "}
              {finalPercentage?.toFixed(2)}
            </div>

            <div className="text-foreground font-semibold">
              Final Grade Point ={" "}
              <span className="text-primary">
                {finalGradePoint.toFixed(2)}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
