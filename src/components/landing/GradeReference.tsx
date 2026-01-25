import { DecoDivider } from "./DecoDivider";

const grades = [
  { grade: "O", range: "> 9.00", points: "10", color: "bg-grade-o" },
  { grade: "A+", range: "8.00 - 9.00", points: "9", color: "bg-grade-a-plus" },
  { grade: "A", range: "7.00 - 8.00", points: "8", color: "bg-grade-a" },
  { grade: "B+", range: "6.00 - 7.00", points: "7", color: "bg-grade-b-plus" },
  { grade: "B", range: "5.00 - 6.00", points: "6", color: "bg-grade-b" },
  { grade: "C", range: "4.00 - 5.00", points: "5", color: "bg-grade-c" },
  { grade: "P", range: "4.00", points: "4", color: "bg-grade-p" },
  { grade: "F", range: "< 4.00", points: "0", color: "bg-grade-f" },
];

const GradeReference = () => {
  return (
    <section className="py-20 bg-background relative">
      <div className="container max-w-4xl mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-accent uppercase tracking-widest mb-3">
            Quick Reference
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Grade Conversion Chart
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Standard Indian university 10-point grading scale used for SGPA and CGPA calculations.
          </p>
        </div>

        {/* Grade Table */}
        <div className="bg-card rounded-lg deco-shadow border border-border overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-3 bg-primary text-primary-foreground font-semibold text-center">
            <div className="py-4 px-4 border-r border-primary-foreground/20">Grade</div>
            <div className="py-4 px-4 border-r border-primary-foreground/20">Score Range</div>
            <div className="py-4 px-4">Grade Points</div>
          </div>

          {/* Table Body */}
          {grades.map((item, index) => (
            <div
              key={item.grade}
              className={`grid grid-cols-3 text-center ${
                index % 2 === 0 ? "bg-card" : "bg-muted/30"
              } border-t border-border`}
            >
              <div className="py-4 px-4 border-r border-border flex items-center justify-center gap-2">
                <span
                  className={`w-3 h-3 rounded-full ${item.color}`}
                  aria-hidden="true"
                />
                <span className="font-semibold text-foreground">{item.grade}</span>
              </div>
              <div className="py-4 px-4 border-r border-border text-muted-foreground">
                {item.range}
              </div>
              <div className="py-4 px-4 font-medium text-foreground">{item.points}</div>
            </div>
          ))}
        </div>

        {/* Note */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          Special cases: <span className="font-medium">I</span> (Incomplete), <span className="font-medium">Ab/R</span> (Absent/Reappear = 0 points), <span className="font-medium">L/AB</span> (Learning Engagement Absent = Grade F)
        </p>

        <DecoDivider className="mt-12" />
      </div>
    </section>
  );
};

export { GradeReference };
