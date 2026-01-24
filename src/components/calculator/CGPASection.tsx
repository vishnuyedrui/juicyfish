import { calculateCGPA, Course } from "@/types/calculator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TrendingUp, Calculator, ArrowRight, Download } from "lucide-react";
import { useState, useEffect } from "react";
import { exportResultsToPDF } from "@/utils/pdfExport";
import { calculateSGPA } from "@/types/calculator";

interface CGPASectionProps {
  currentSGPA: number;
  currentCredits: number;
  courses: Course[];
  onCGPACalculated?: (data: { cgpa: number; previousCGPA: number; previousCredits: number; newTotalCredits: number } | null) => void;
}

export function CGPASection({ currentSGPA, currentCredits, courses, onCGPACalculated }: CGPASectionProps) {
  const [previousCGPA, setPreviousCGPA] = useState<string>('');
  const [previousCredits, setPreviousCredits] = useState<string>('');
  const [showResult, setShowResult] = useState(false);

  const canCalculate = previousCGPA !== '' && previousCredits !== '' && 
    parseFloat(previousCGPA) >= 0 && parseFloat(previousCGPA) <= 10 &&
    parseInt(previousCredits) > 0;

  const result = canCalculate ? calculateCGPA(
    currentSGPA,
    currentCredits,
    parseFloat(previousCGPA),
    parseInt(previousCredits)
  ) : null;

  useEffect(() => {
    if (showResult && result) {
      onCGPACalculated?.({
        cgpa: result.cgpa,
        previousCGPA: parseFloat(previousCGPA),
        previousCredits: parseInt(previousCredits),
        newTotalCredits: result.totalCredits,
      });
    } else {
      onCGPACalculated?.(null);
    }
  }, [showResult, result, previousCGPA, previousCredits, onCGPACalculated]);

  const validCourses = courses.filter(c => c.finalGradePoint !== null && c.name.trim() !== '');
  const sgpaResult = calculateSGPA(validCourses);

  const handleDownloadPDF = () => {
    if (!result || !sgpaResult) return;
    
    exportResultsToPDF({
      courses: validCourses,
      sgpa: sgpaResult.sgpa,
      totalCredits: sgpaResult.totalCredits,
      cgpa: result.cgpa,
      previousCGPA: parseFloat(previousCGPA),
      previousCredits: parseInt(previousCredits),
      newTotalCredits: result.totalCredits,
    });
  };

  return (
    <Card className="animate-fade-in gradient-orange border-2 border-orange-300/50">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-base sm:text-lg">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
          </div>
          <span className="leading-tight">Step 4: New CGPA (Optional)</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6">
        <p className="text-muted-foreground text-xs sm:text-sm">
          Enter your previous academic record to calculate your updated cumulative GPA.
        </p>

        {/* Input Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="space-y-2">
            <Label htmlFor="prev-cgpa" className="text-sm">Previous CGPA</Label>
            <Input
              id="prev-cgpa"
              aria-label="Enter your previous CGPA"
              type="number"
              step={0.01}
              min={0}
              max={10}
              placeholder="e.g., 8.5"
              value={previousCGPA}
              onChange={(e) => {
                setPreviousCGPA(e.target.value);
                setShowResult(false);
              }}
              className="bg-card"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="prev-credits" className="text-sm">Previous Total Credits</Label>
            <Input
              id="prev-credits"
              aria-label="Enter your previous total credits"
              type="number"
              min={1}
              placeholder="e.g., 120"
              value={previousCredits}
              onChange={(e) => {
                setPreviousCredits(e.target.value);
                setShowResult(false);
              }}
              className="bg-card"
            />
          </div>
        </div>

        {/* Current Semester Info */}
        <div className="bg-card rounded-lg border p-3 sm:p-4">
          <h4 className="text-xs sm:text-sm font-medium mb-2">Current Semester</h4>
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
            <span>SGPA: <strong className="text-foreground">{currentSGPA.toFixed(2)}</strong></span>
            <span className="hidden sm:inline">•</span>
            <span>Credits: <strong className="text-foreground">{currentCredits}</strong></span>
          </div>
        </div>

        {/* Calculate Button */}
        {!showResult && (
          <div className="text-center">
            <Button 
              onClick={() => setShowResult(true)} 
              disabled={!canCalculate}
              className="bg-orange-500 hover:bg-orange-600 w-full sm:w-auto"
            >
              <Calculator className="w-4 h-4 mr-2" />
              Calculate New CGPA
            </Button>
          </div>
        )}

        {/* Result */}
        {showResult && result && (
          <div className="space-y-4 sm:space-y-6 animate-scale-in">
            {/* Formula */}
            <Card className="bg-muted/30 border-dashed">
              <CardHeader className="pb-2 px-3 sm:px-6">
                <CardTitle className="text-xs sm:text-sm flex items-center gap-2 text-orange-600">
                  <Calculator className="w-3 h-3 sm:w-4 sm:h-4" />
                  CGPA Formula
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 sm:space-y-3 text-xs sm:text-sm px-3 sm:px-6">
                <div className="font-mono bg-card p-2 sm:p-3 rounded border space-y-1 overflow-x-auto">
                  <div className="text-muted-foreground text-[10px] sm:text-xs whitespace-nowrap">
                    New CGPA = [(Prev CGPA × Prev Credits) + (SGPA × Credits)] ÷ Total Credits
                  </div>
                  <div className="text-muted-foreground whitespace-nowrap text-xs">
                    = [({previousCGPA} × {previousCredits}) + ({currentSGPA.toFixed(2)} × {currentCredits})] ÷ {result.totalCredits}
                  </div>
                  <div className="text-muted-foreground whitespace-nowrap text-xs">
                    = [{(parseFloat(previousCGPA) * parseInt(previousCredits)).toFixed(2)} + {(currentSGPA * currentCredits).toFixed(2)}] ÷ {result.totalCredits}
                  </div>
                  <div className="text-muted-foreground whitespace-nowrap text-xs">
                    = {result.totalGradePoints.toFixed(2)} ÷ {result.totalCredits}
                  </div>
                  <div className="text-foreground font-semibold text-base sm:text-lg">
                    New CGPA = <span className="text-orange-600">{result.cgpa.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* CGPA Comparison */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 p-4 sm:p-6 bg-card rounded-lg border">
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-muted-foreground">{previousCGPA}</div>
                <div className="text-[10px] sm:text-xs text-muted-foreground">Previous CGPA</div>
              </div>
              <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground rotate-90 sm:rotate-0" />
              <div className="text-center">
                <div className="text-4xl sm:text-5xl font-bold text-orange-600">{result.cgpa.toFixed(2)}</div>
                <div className="text-xs sm:text-sm text-muted-foreground mt-1">New CGPA</div>
              </div>
            </div>

            <div className="text-center text-xs sm:text-sm text-muted-foreground">
              Total Credits Completed: <strong className="text-foreground">{result.totalCredits}</strong>
            </div>

            {/* Download PDF Button */}
            <div className="text-center pt-2">
              <Button 
                onClick={handleDownloadPDF}
                size="lg"
                className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Complete Report (PDF)
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}