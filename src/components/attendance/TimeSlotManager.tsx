import { useState } from 'react';
import { DbTimeSlot, DEFAULT_TIME_SLOTS } from '@/hooks/useAttendanceData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Clock, Plus, Trash2, RotateCcw } from 'lucide-react';

interface TimeSlotManagerProps {
  timeSlots: DbTimeSlot[];
  onAddTimeSlot: (startTime: string, endTime: string) => Promise<DbTimeSlot | null>;
  onDeleteTimeSlot: (id: string) => Promise<void>;
  onInitializeDefaults: () => Promise<void>;
}

export const TimeSlotManager = ({
  timeSlots,
  onAddTimeSlot,
  onDeleteTimeSlot,
  onInitializeDefaults,
}: TimeSlotManagerProps) => {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = async () => {
    if (!startTime || !endTime) return;
    setIsAdding(true);
    await onAddTimeSlot(startTime, endTime);
    setStartTime('');
    setEndTime('');
    setIsAdding(false);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base sm:text-lg">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Time Slots
          </div>
          {timeSlots.length === 0 && (
            <Button variant="outline" size="sm" onClick={onInitializeDefaults}>
              <RotateCcw className="w-4 h-4 mr-1" />
              Use Defaults
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add new time slot */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex gap-2 flex-1">
            <Input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              placeholder="Start"
              className="flex-1"
            />
            <span className="flex items-center text-muted-foreground">to</span>
            <Input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              placeholder="End"
              className="flex-1"
            />
          </div>
          <Button onClick={handleAdd} size="sm" disabled={!startTime || !endTime || isAdding}>
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>

        {/* Time slots list */}
        {timeSlots.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No time slots added. Click "Use Defaults" for standard college timings or add custom slots.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {timeSlots
              .sort((a, b) => a.slot_order - b.slot_order)
              .map((slot) => (
                <div
                  key={slot.id}
                  className="flex items-center justify-between p-2 bg-muted/50 rounded-lg text-sm"
                >
                  <span className="font-medium">
                    {slot.start_time} - {slot.end_time}
                  </span>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6"
                    onClick={() => onDeleteTimeSlot(slot.id)}
                  >
                    <Trash2 className="w-3 h-3 text-red-600" />
                  </Button>
                </div>
              ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
