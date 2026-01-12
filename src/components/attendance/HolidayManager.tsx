import { useState } from 'react';
import { DbHoliday } from '@/hooks/useAttendanceData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarOff, Plus, Trash2, Calendar as CalendarIcon } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';

interface HolidayManagerProps {
  holidays: DbHoliday[];
  onAddHoliday: (startDate: string, endDate: string, reason?: string) => Promise<DbHoliday | null>;
  onDeleteHoliday: (id: string) => Promise<void>;
}

export const HolidayManager = ({
  holidays,
  onAddHoliday,
  onDeleteHoliday,
}: HolidayManagerProps) => {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [reason, setReason] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = async () => {
    if (!startDate || !endDate) return;
    setIsAdding(true);
    await onAddHoliday(
      format(startDate, 'yyyy-MM-dd'),
      format(endDate, 'yyyy-MM-dd'),
      reason || undefined
    );
    setStartDate(undefined);
    setEndDate(undefined);
    setReason('');
    setIsAdding(false);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <CalendarOff className="w-5 h-5 text-primary" />
          Holidays
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add new holiday */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1">
              <Label className="text-xs text-muted-foreground">From</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !startDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, 'PPP') : 'Select date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex-1">
              <Label className="text-xs text-muted-foreground">To</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !endDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, 'PPP') : 'Select date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Reason (optional)"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleAdd} size="sm" disabled={!startDate || !endDate || isAdding}>
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </div>
        </div>

        {/* Holiday list */}
        {holidays.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No holidays added. Holidays are excluded from attendance calculations.
          </p>
        ) : (
          <div className="space-y-2">
            {holidays.map((holiday) => (
              <div
                key={holiday.id}
                className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg"
              >
                <div className="flex-1">
                  <div className="font-medium text-sm">
                    {format(parseISO(holiday.start_date), 'MMM d, yyyy')}
                    {holiday.start_date !== holiday.end_date && (
                      <> - {format(parseISO(holiday.end_date), 'MMM d, yyyy')}</>
                    )}
                  </div>
                  {holiday.reason && (
                    <div className="text-xs text-muted-foreground">{holiday.reason}</div>
                  )}
                </div>
                <Button size="icon" variant="ghost" onClick={() => onDeleteHoliday(holiday.id)}>
                  <Trash2 className="w-4 h-4 text-red-600" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
