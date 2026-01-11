import { Subject, calculateAttendancePercentage, calculateOverallAttendance, calculateClassesNeededFor75 } from "@/types/attendance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart3, AlertTriangle, CheckCircle } from "lucide-react";

interface AttendanceDisplayProps {
  subjects: Subject[];
}

export const AttendanceDisplay = ({ subjects }: AttendanceDisplayProps) => {
  const validSubjects = subjects.filter(
    s => s.name.trim() !== ''
  );
  const overall = calculateOverallAttendance(validSubjects);

  if (validSubjects.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Add subjects with classes to see attendance statistics
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Overall Attendance Card */}
      <Card className={overall.percentage >= 75 ? 'border-green-300 bg-green-50/50' : 'border-red-300 bg-red-50/50'}>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <BarChart3 className="w-5 h-5 text-primary" />
            Overall Attendance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl sm:text-3xl font-bold">
              {overall.percentage.toFixed(1)}%
            </span>
            <span className="text-sm text-muted-foreground">
              {overall.attended} / {overall.total} classes
            </span>
          </div>
          <Progress 
            value={overall.percentage} 
            className={`h-3 ${overall.percentage >= 75 ? '[&>div]:bg-green-500' : '[&>div]:bg-red-500'}`}
          />
          {overall.percentage < 75 && (
            <div className="mt-3 flex items-center gap-2 text-sm text-red-600">
              <AlertTriangle className="w-4 h-4" />
              <span>
                Attend {calculateClassesNeededFor75(overall.attended, overall.total)} more classes to reach 75%
              </span>
            </div>
          )}
          {overall.percentage >= 75 && (
            <div className="mt-3 flex items-center gap-2 text-sm text-green-600">
              <CheckCircle className="w-4 h-4" />
              <span>You're on track! Attendance is above 75%</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Subject-wise Cards */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg">Subject-wise Attendance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {validSubjects.map((subject) => {
            const percentage = calculateAttendancePercentage(subject.attendedClasses, subject.totalClasses);
            const isSafe = percentage >= 75;
            const classesNeeded = calculateClassesNeededFor75(subject.attendedClasses, subject.totalClasses);
            
            return (
              <div 
                key={subject.id}
                className={`p-3 rounded-lg border ${isSafe ? 'border-green-200 bg-green-50/30' : 'border-red-200 bg-red-50/30'}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm sm:text-base">{subject.name}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-lg font-bold ${isSafe ? 'text-green-600' : 'text-red-600'}`}>
                      {percentage.toFixed(1)}%
                    </span>
                    {isSafe ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                </div>
                <Progress 
                  value={percentage} 
                  className={`h-2 ${isSafe ? '[&>div]:bg-green-500' : '[&>div]:bg-red-500'}`}
                />
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-muted-foreground">
                    {subject.attendedClasses} / {subject.totalClasses} classes
                  </span>
                  {!isSafe && (
                    <span className="text-xs text-red-600">
                      Need {classesNeeded} more
                    </span>
                  )}
                </div>
                <span className="text-xs text-muted-foreground mt-1 block">
                  Miss 1 class →{" "}
                  {calculateAttendancePercentage(
                    subject.attendedClasses,
                    subject.totalClasses + 1
                  ).toFixed(1)}
                  %
                </span>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};
