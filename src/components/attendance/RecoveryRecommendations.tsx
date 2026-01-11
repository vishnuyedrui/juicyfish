import { Subject, RecoveryInfo, calculateAttendancePercentage, calculateClassesNeededFor75 } from "@/types/attendance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, TrendingUp } from "lucide-react";
import { useEffect } from "react";

interface RecoveryRecommendationsProps {
  subjects: Subject[];
  onRecoveryInfoChange: (infos: RecoveryInfo[]) => void;
}

export const RecoveryRecommendations = ({ subjects, onRecoveryInfoChange }: RecoveryRecommendationsProps) => {
  const validSubjects = subjects.filter(s => s.name.trim() !== '' && s.totalClasses > 0);
  
  const subjectsBelow75 = validSubjects.filter(s => {
    const percentage = calculateAttendancePercentage(s.attendedClasses, s.totalClasses);
    return percentage < 75;
  });

  const recoveryInfos: RecoveryInfo[] = subjectsBelow75.map(s => ({
    subjectId: s.id,
    subjectName: s.name,
    currentPercentage: calculateAttendancePercentage(s.attendedClasses, s.totalClasses),
    classesNeeded: calculateClassesNeededFor75(s.attendedClasses, s.totalClasses),
  }));

  // Update parent with recovery info
  useEffect(() => {
    if (recoveryInfos.length > 0) {
      onRecoveryInfoChange(recoveryInfos);
    }
  }, [recoveryInfos, onRecoveryInfoChange]);

  if (subjectsBelow75.length === 0) {
    return null;
  }

  return (
    <Card className="border-amber-300 bg-amber-50/50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg text-amber-800">
          <Target className="w-5 h-5" />
          Recovery Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-amber-700">
          The following subjects need attention to reach 75% attendance:
        </p>
        
        {recoveryInfos.map((info) => (
          <div 
            key={info.subjectId}
            className="p-3 bg-white rounded-lg border border-amber-200 shadow-sm"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="font-medium text-sm">{info.subjectName}</h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Current: {info.currentPercentage.toFixed(1)}%
                </p>
              </div>
              <div className="flex items-center gap-1 bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                <TrendingUp className="w-3 h-3" />
                <span className="text-xs font-medium">+{info.classesNeeded} classes</span>
              </div>
            </div>
            <p className="text-xs text-amber-700 mt-2 flex items-center gap-1">
              <span>📚</span>
              Attend next {info.classesNeeded} consecutive classes to reach 75%
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
