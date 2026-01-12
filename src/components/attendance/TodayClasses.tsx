import { TodayClass } from '@/hooks/useAttendanceData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarCheck, Check, X, FlaskConical, Clock, PartyPopper } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface TodayClassesProps {
  date: Date;
  classes: TodayClass[];
  isHoliday: boolean;
  holidayReason: string | null;
  onMarkAttendance: (subjectId: string, timeSlotId: string, status: 'present' | 'absent') => Promise<void>;
}

export const TodayClasses = ({
  date,
  classes,
  isHoliday,
  holidayReason,
  onMarkAttendance,
}: TodayClassesProps) => {
  const dayOfWeek = date.getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <CalendarCheck className="w-5 h-5 text-primary" />
          Today's Classes
          <span className="text-sm font-normal text-muted-foreground ml-auto">
            {format(date, 'EEEE, MMM d')}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isHoliday ? (
          <div className="text-center py-8">
            <PartyPopper className="w-12 h-12 mx-auto text-yellow-500 mb-3" />
            <h3 className="text-lg font-semibold">Today is a Holiday!</h3>
            {holidayReason && (
              <p className="text-muted-foreground mt-1">{holidayReason}</p>
            )}
            <p className="text-sm text-muted-foreground mt-2">
              No classes scheduled. Enjoy your day off!
            </p>
          </div>
        ) : isWeekend ? (
          <div className="text-center py-8">
            <PartyPopper className="w-12 h-12 mx-auto text-blue-500 mb-3" />
            <h3 className="text-lg font-semibold">It's the Weekend!</h3>
            <p className="text-sm text-muted-foreground mt-2">
              No classes on {format(date, 'EEEE')}. Enjoy your break!
            </p>
          </div>
        ) : classes.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <h3 className="text-lg font-semibold">No Classes Today</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Set up your timetable to see today's classes.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {classes.map((classItem) => (
              <div
                key={`${classItem.timeSlotId}-${classItem.subjectId}`}
                className={cn(
                  'p-4 rounded-lg border transition-colors',
                  classItem.attendanceStatus === 'present' && 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-900',
                  classItem.attendanceStatus === 'absent' && 'bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-900',
                  !classItem.attendanceStatus && 'bg-muted/50'
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{classItem.subjectName}</span>
                      {classItem.isLab && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded flex items-center gap-1">
                          <FlaskConical className="w-3 h-3" />
                          Lab
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {classItem.startTime} - {classItem.endTime}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={classItem.attendanceStatus === 'present' ? 'default' : 'outline'}
                      className={cn(
                        classItem.attendanceStatus === 'present' && 'bg-green-600 hover:bg-green-700'
                      )}
                      onClick={() => onMarkAttendance(classItem.subjectId, classItem.timeSlotId, 'present')}
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Present
                    </Button>
                    <Button
                      size="sm"
                      variant={classItem.attendanceStatus === 'absent' ? 'default' : 'outline'}
                      className={cn(
                        classItem.attendanceStatus === 'absent' && 'bg-red-600 hover:bg-red-700'
                      )}
                      onClick={() => onMarkAttendance(classItem.subjectId, classItem.timeSlotId, 'absent')}
                    >
                      <X className="w-4 h-4 mr-1" />
                      Absent
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
