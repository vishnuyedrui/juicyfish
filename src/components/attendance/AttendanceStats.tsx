import { DbSubject } from '@/hooks/useAttendanceData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BarChart3, AlertTriangle, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AttendanceStatsProps {
  subjects: DbSubject[];
  calculateSubjectStats: (subjectId: string) => {
    total: number;
    attended: number;
    absent: number;
    percentage: number;
  };
  calculateOverallStats: () => {
    total: number;
    attended: number;
    percentage: number;
  };
  calculateClassesNeededFor75: (attended: number, total: number) => number;
}

export const AttendanceStats = ({
  subjects,
  calculateSubjectStats,
  calculateOverallStats,
  calculateClassesNeededFor75,
}: AttendanceStatsProps) => {
  const overallStats = calculateOverallStats();

  if (subjects.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <BarChart3 className="w-5 h-5 text-primary" />
            Attendance Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            Add subjects and mark attendance to see insights.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <BarChart3 className="w-5 h-5 text-primary" />
          Attendance Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Stats */}
        <div className="p-4 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold">Overall Attendance</span>
            <span className={cn(
              'text-2xl font-bold',
              overallStats.percentage >= 75 ? 'text-green-600' : 'text-red-600'
            )}>
              {overallStats.percentage.toFixed(2)}%
            </span>
          </div>
          <Progress 
            value={overallStats.percentage} 
            className={cn(
              'h-3',
              overallStats.percentage >= 75 ? '[&>div]:bg-green-600' : '[&>div]:bg-red-600'
            )}
          />
          <div className="flex justify-between text-sm text-muted-foreground mt-2">
            <span>{overallStats.attended} / {overallStats.total} classes attended</span>
            {overallStats.percentage < 75 && overallStats.total > 0 && (
              <span className="text-red-600 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                Below 75%
              </span>
            )}
          </div>
          {overallStats.percentage < 75 && overallStats.total > 0 && (
            <div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-950/20 rounded text-sm text-yellow-700 dark:text-yellow-400 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Attend next {calculateClassesNeededFor75(overallStats.attended, overallStats.total)} classes to reach 75%
            </div>
          )}
        </div>

        {/* Subject-wise Stats */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm text-muted-foreground">Subject-wise Breakdown</h4>
          {subjects.map((subject) => {
            const stats = calculateSubjectStats(subject.id);
            const classesNeeded = calculateClassesNeededFor75(stats.attended, stats.total);
            
            return (
              <div key={subject.id} className="p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{subject.name}</span>
                  <span className={cn(
                    'font-bold',
                    stats.percentage >= 75 ? 'text-green-600' : 'text-red-600'
                  )}>
                    {stats.total > 0 ? `${stats.percentage.toFixed(2)}%` : 'N/A'}
                  </span>
                </div>
                {stats.total > 0 && (
                  <>
                    <Progress 
                      value={stats.percentage} 
                      className={cn(
                        'h-2',
                        stats.percentage >= 75 ? '[&>div]:bg-green-600' : '[&>div]:bg-red-600'
                      )}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>{stats.attended} present / {stats.absent} absent</span>
                      {stats.percentage < 75 && (
                        <span className="text-yellow-600">Need {classesNeeded} more</span>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
