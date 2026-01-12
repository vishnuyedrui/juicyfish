import { DbSubject, DbTimeSlot, DbTimetableEntry } from '@/hooks/useAttendanceData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from 'lucide-react';

interface TimetableGridProps {
  subjects: DbSubject[];
  timeSlots: DbTimeSlot[];
  timetable: DbTimetableEntry[];
  onSetEntry: (timeSlotId: string, dayOfWeek: number, subjectId: string | null) => Promise<void>;
  dayNames: string[];
}

export const TimetableGrid = ({
  subjects,
  timeSlots,
  timetable,
  onSetEntry,
  dayNames,
}: TimetableGridProps) => {
  const getSubjectForSlot = (timeSlotId: string, dayOfWeek: number): string | null => {
    const entry = timetable.find(t => t.time_slot_id === timeSlotId && t.day_of_week === dayOfWeek);
    return entry?.subject_id || null;
  };

  const sortedTimeSlots = [...timeSlots].sort((a, b) => a.slot_order - b.slot_order);

  if (subjects.length === 0 || timeSlots.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Calendar className="w-5 h-5 text-primary" />
            Weekly Timetable
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            Add subjects and time slots first to set up your timetable
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <Calendar className="w-5 h-5 text-primary" />
          Weekly Timetable
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="min-w-[600px] px-4 sm:px-0">
            {/* Header */}
            <div className="grid gap-1 mb-2" style={{ gridTemplateColumns: `100px repeat(${dayNames.length}, 1fr)` }}>
              <div className="text-xs font-medium text-muted-foreground p-2">Time</div>
              {dayNames.map((day) => (
                <div key={day} className="text-xs font-medium text-muted-foreground p-2 text-center">
                  {day.slice(0, 3)}
                </div>
              ))}
            </div>
            
            {/* Rows */}
            {sortedTimeSlots.map((slot) => (
              <div
                key={slot.id}
                className="grid gap-1 mb-1"
                style={{ gridTemplateColumns: `100px repeat(${dayNames.length}, 1fr)` }}
              >
                <div className="text-xs font-medium p-2 bg-muted rounded flex items-center">
                  {slot.start_time}
                </div>
                {dayNames.map((_, dayIndex) => {
                  const selectedSubjectId = getSubjectForSlot(slot.id, dayIndex);
                  return (
                    <Select
                      key={dayIndex}
                      value={selectedSubjectId || 'none'}
                      onValueChange={(value) => 
                        onSetEntry(slot.id, dayIndex, value === 'none' ? null : value)
                      }
                    >
                      <SelectTrigger className="h-8 text-xs px-1">
                        <SelectValue placeholder="-" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">-</SelectItem>
                        {subjects.map((subject) => (
                          <SelectItem key={subject.id} value={subject.id}>
                            {subject.name.length > 10 ? subject.name.slice(0, 10) + '...' : subject.name}
                            {subject.is_lab && ' (Lab)'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
