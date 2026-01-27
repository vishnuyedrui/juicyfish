import { useState } from "react";
import { ChevronDown } from "lucide-react";

const gradeData = [
  { grade: "O", points: "10", range: "90-100" },
  { grade: "A+", points: "9", range: "80-89" },
  { grade: "A", points: "8", range: "70-79" },
  { grade: "B+", points: "7", range: "60-69" },
  { grade: "B", points: "6", range: "50-59" },
  { grade: "C", points: "5", range: "45-49" },
  { grade: "P", points: "4", range: "40-44" },
  { grade: "F", points: "0", range: "<40" },
];

export function GradeReference() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="container mx-auto px-4 lg:px-8 py-12">
      <div className="max-w-2xl mx-auto">
        {/* Collapsible Header */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-4 rounded-xl bg-muted/50 border border-border hover:bg-muted transition-colors duration-200"
        >
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-muted-foreground">Quick Reference</span>
            <span className="font-bold text-foreground">Grade Point Scale</span>
          </div>
          <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Collapsible Content */}
        <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[500px] opacity-100 mt-3' : 'max-h-0 opacity-0'}`}>
          <div className="p-4 rounded-xl bg-card border border-border">
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div className="font-semibold text-muted-foreground pb-2 border-b border-border">Grade</div>
              <div className="font-semibold text-muted-foreground pb-2 border-b border-border text-center">Points</div>
              <div className="font-semibold text-muted-foreground pb-2 border-b border-border text-right">Marks</div>
              
              {gradeData.map((row) => (
                <>
                  <div key={`grade-${row.grade}`} className="py-2 font-bold text-foreground">{row.grade}</div>
                  <div key={`points-${row.grade}`} className="py-2 text-center text-muted-foreground">{row.points}</div>
                  <div key={`range-${row.grade}`} className="py-2 text-right text-muted-foreground">{row.range}%</div>
                </>
              ))}
            </div>

            {/* Formula */}
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-sm text-center text-muted-foreground">
                <span className="font-semibold text-foreground">SGPA</span> = Σ(Credit × Points) / Σ(Credits)
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
