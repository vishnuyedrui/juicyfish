import { Subject, TimetableEntry, DAYS, PERIODS_PER_DAY } from "@/types/attendance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "lucide-react";

interface TimetableSetupProps {
  subjects: Subject[];
  timetable: TimetableEntry[];
  onTimetableChange: (timetable: TimetableEntry[]) => void;
}

export const TimetableSetup = ({ subjects, timetable, onTimetableChange }: TimetableSetupProps) => {
  const updatePeriod = (dayIndex: number, periodIndex: number, subjectId: string) => {
    const updated = [...timetable];
    updated[dayIndex] = {
      ...updated[dayIndex],
      periods: updated[dayIndex].periods.map((p, i) => 
        i === periodIndex ? subjectId : p
      ),
    };
    onTimetableChange(updated);
  };

  const validSubjects = subjects.filter(s => s.name.trim() !== '');

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <Calendar className="w-5 h-5 text-primary" />
          Weekly Timetable
        </CardTitle>
      </CardHeader>
      <CardContent>
        {validSubjects.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Add subjects with names first to set up your timetable
          </p>
        ) : (
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="min-w-[600px] px-4 sm:px-0">
              {/* Header */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                <div className="text-xs font-medium text-muted-foreground p-2">Day</div>
                {Array.from({ length: PERIODS_PER_DAY }).map((_, i) => (
                  <div key={i} className="text-xs font-medium text-muted-foreground p-2 text-center">
                    P{i + 1}
                  </div>
                ))}
              </div>
              
              {/* Days */}
              {timetable.map((entry, dayIndex) => (
                <div 
                  key={entry.day} 
                  className="grid grid-cols-7 gap-1 mb-1"
                >
                  <div className="text-xs font-medium p-2 bg-muted rounded flex items-center">
                    {entry.day.slice(0, 3)}
                  </div>
                  {entry.periods.map((subjectId, periodIndex) => (
                    <Select
                      key={periodIndex}
                      value={subjectId || 'none'}
                      onValueChange={(value) => updatePeriod(dayIndex, periodIndex, value === 'none' ? '' : value)}
                    >
                      <SelectTrigger className="h-8 text-xs px-1">
                        <SelectValue placeholder="-" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">-</SelectItem>
                        {validSubjects.map((subject) => (
                          <SelectItem key={subject.id} value={subject.id}>
                            {subject.name.length > 8 ? subject.name.slice(0, 8) + '...' : subject.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
