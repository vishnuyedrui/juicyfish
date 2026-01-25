import { BentoCard } from "./BentoCard";

const gradeData = [
  { grade: "O", points: "10", range: "90-100", color: "bg-grade-o", textColor: "text-grade-o" },
  { grade: "A+", points: "9", range: "80-89", color: "bg-grade-a-plus", textColor: "text-grade-a-plus" },
  { grade: "A", points: "8", range: "70-79", color: "bg-grade-a", textColor: "text-grade-a" },
  { grade: "B+", points: "7", range: "60-69", color: "bg-grade-b-plus", textColor: "text-grade-b-plus" },
  { grade: "B", points: "6", range: "50-59", color: "bg-grade-b", textColor: "text-grade-b" },
  { grade: "C", points: "5", range: "45-49", color: "bg-grade-c", textColor: "text-grade-c" },
  { grade: "P", points: "4", range: "40-44", color: "bg-grade-p", textColor: "text-grade-p" },
  { grade: "F", points: "0", range: "<40", color: "bg-grade-f", textColor: "text-grade-f" },
];

export function GradeReference() {
  return (
    <section className="container mx-auto px-4 lg:px-8 py-16">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-8">
          <span className="inline-block px-4 py-2 rounded-full bg-pop-cyan/10 text-pop-cyan font-black text-sm mb-4">
            Quick Reference 📊
          </span>
          <h2 className="text-3xl lg:text-4xl font-black text-foreground tracking-tight">
            Grade <span className="text-pop-cyan">Point Scale</span>
          </h2>
        </div>

        {/* Grade Table */}
        <BentoCard className="overflow-hidden" hover={false}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-[3px] border-foreground/10">
                  <th className="text-left py-4 px-4 font-black text-foreground">Grade</th>
                  <th className="text-center py-4 px-4 font-black text-foreground">Points</th>
                  <th className="text-right py-4 px-4 font-black text-foreground">Marks</th>
                </tr>
              </thead>
              <tbody>
                {gradeData.map((row, index) => (
                  <tr 
                    key={row.grade} 
                    className={`transition-all duration-200 hover:bg-muted/50 ${index !== gradeData.length - 1 ? "border-b-2 border-foreground/5" : ""}`}
                  >
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${row.color} text-white font-black text-lg pop-shadow`}>
                        {row.grade}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`font-black text-lg ${row.textColor}`}>{row.points}</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-muted-foreground font-bold">{row.range}%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </BentoCard>

        {/* Formula Note */}
        <div className="text-center mt-6">
          <div className="inline-block px-6 py-3 rounded-2xl bg-pop-purple/10 border-[3px] border-pop-purple/30">
            <p className="text-foreground font-bold">
              SGPA = <span className="text-pop-purple">Σ(Credit × Grade Points)</span> / <span className="text-pop-pink">Σ(Credits)</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
