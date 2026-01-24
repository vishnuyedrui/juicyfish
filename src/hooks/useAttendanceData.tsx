import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';
import { format, isWithinInterval, parseISO, startOfDay } from 'date-fns';

export interface DbSubject {
  id: string;
  name: string;
  is_lab: boolean;
}

export interface DbTimeSlot {
  id: string;
  start_time: string;
  end_time: string;
  slot_order: number;
}

export interface DbTimetableEntry {
  id: string;
  subject_id: string | null;
  time_slot_id: string;
  day_of_week: number;
}

export interface DbHoliday {
  id: string;
  start_date: string;
  end_date: string;
  reason: string | null;
}

export interface DbAttendanceRecord {
  id: string;
  subject_id: string;
  time_slot_id: string;
  date: string;
  status: 'present' | 'absent';
}

export interface TodayClass {
  timetableId: string;
  subjectId: string;
  subjectName: string;
  isLab: boolean;
  timeSlotId: string;
  startTime: string;
  endTime: string;
  attendanceStatus: 'present' | 'absent' | null;
  attendanceRecordId: string | null;
}

export const DEFAULT_TIME_SLOTS = [
  { start_time: '8:00', end_time: '8:50', slot_order: 0 },
  { start_time: '9:00', end_time: '9:50', slot_order: 1 },
  { start_time: '10:00', end_time: '10:50', slot_order: 2 },
  { start_time: '11:00', end_time: '11:50', slot_order: 3 },
  { start_time: '12:00', end_time: '12:50', slot_order: 4 },
  { start_time: '2:00', end_time: '2:50', slot_order: 5 },
  { start_time: '3:00', end_time: '3:50', slot_order: 6 },
  { start_time: '4:00', end_time: '4:50', slot_order: 7 },
];

const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export const useAttendanceData = () => {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState<DbSubject[]>([]);
  const [timeSlots, setTimeSlots] = useState<DbTimeSlot[]>([]);
  const [timetable, setTimetable] = useState<DbTimetableEntry[]>([]);
  const [holidays, setHolidays] = useState<DbHoliday[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<DbAttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const [subjectsRes, timeSlotsRes, timetableRes, holidaysRes, attendanceRes] = await Promise.all([
        supabase.from('subjects').select('*').eq('user_id', user.id).order('created_at'),
        supabase.from('time_slots').select('*').eq('user_id', user.id).order('slot_order'),
        supabase.from('timetable').select('*').eq('user_id', user.id),
        supabase.from('holidays').select('*').eq('user_id', user.id).order('start_date'),
        supabase.from('attendance_records').select('*').eq('user_id', user.id),
      ]);

      if (subjectsRes.data) setSubjects(subjectsRes.data);
      if (timeSlotsRes.data) setTimeSlots(timeSlotsRes.data);
      if (timetableRes.data) setTimetable(timetableRes.data);
      if (holidaysRes.data) setHolidays(holidaysRes.data);
      if (attendanceRes.data) setAttendanceRecords(attendanceRes.data as DbAttendanceRecord[]);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Subject operations
  const addSubject = async (name: string, isLab: boolean = false, totalClasses: number = 0, attendedClasses: number = 0) => {
    if (!user) return null;
    const { data, error } = await supabase
      .from('subjects')
      .insert({ user_id: user.id, name, is_lab: isLab })
      .select()
      .single();
    
    if (error) {
      toast.error('Failed to add subject');
      return null;
    }
    
    // If initial attendance data is provided, create attendance records
    if (totalClasses > 0) {
      const today = new Date();
      const records = [];
      
      // Create 'present' records for attended classes
      for (let i = 0; i < attendedClasses; i++) {
        records.push({
          user_id: user.id,
          subject_id: data.id,
          time_slot_id: timeSlots[0]?.id || 'placeholder',
          date: format(new Date(today.getTime() - (totalClasses - i) * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
          status: 'present',
        });
      }
      
      // Create 'absent' records for missed classes
      const absentClasses = totalClasses - attendedClasses;
      for (let i = 0; i < absentClasses; i++) {
        records.push({
          user_id: user.id,
          subject_id: data.id,
          time_slot_id: timeSlots[0]?.id || 'placeholder',
          date: format(new Date(today.getTime() - (absentClasses - i) * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
          status: 'absent',
        });
      }
      
      if (records.length > 0 && timeSlots.length > 0) {
        const { data: recordsData, error: recordsError } = await supabase
          .from('attendance_records')
          .insert(records)
          .select();
        
        if (!recordsError && recordsData) {
          setAttendanceRecords([...attendanceRecords, ...recordsData as DbAttendanceRecord[]]);
        }
      }
    }
    
    setSubjects([...subjects, data]);
    toast.success('Subject added');
    return data;
  };

  const updateSubject = async (id: string, name: string, isLab: boolean) => {
    const { error } = await supabase
      .from('subjects')
      .update({ name, is_lab: isLab })
      .eq('id', id);
    
    if (error) {
      toast.error('Failed to update subject');
      return;
    }
    setSubjects(subjects.map(s => s.id === id ? { ...s, name, is_lab: isLab } : s));
  };

  const updateSubjectAttendance = async (subjectId: string, newTotal: number, newAttended: number) => {
    if (!user) return;
    
    // Get current stats
    const currentStats = calculateSubjectStats(subjectId);
    const currentTotal = currentStats.total;
    const currentAttended = currentStats.attended;
    
    // Calculate the difference
    const totalDiff = newTotal - currentTotal;
    const attendedDiff = newAttended - currentAttended;
    
    if (totalDiff === 0 && attendedDiff === 0) return;
    
    // Validate
    if (newAttended > newTotal) {
      toast.error('Attended classes cannot exceed total classes');
      return;
    }
    
    const today = new Date();
    const recordsToAdd: { user_id: string; subject_id: string; time_slot_id: string; date: string; status: string }[] = [];
    const recordsToDelete: string[] = [];
    
    // Handle total classes change
    if (totalDiff > 0) {
      // Need to add more records
      const newPresent = Math.max(0, attendedDiff);
      const newAbsent = totalDiff - newPresent;
      
      // Add present records
      for (let i = 0; i < newPresent; i++) {
        recordsToAdd.push({
          user_id: user.id,
          subject_id: subjectId,
          time_slot_id: timeSlots[0]?.id || 'placeholder',
          date: format(new Date(today.getTime() - (i + 1) * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
          status: 'present',
        });
      }
      
      // Add absent records
      for (let i = 0; i < newAbsent; i++) {
        recordsToAdd.push({
          user_id: user.id,
          subject_id: subjectId,
          time_slot_id: timeSlots[0]?.id || 'placeholder',
          date: format(new Date(today.getTime() - (newPresent + i + 1) * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
          status: 'absent',
        });
      }
    } else if (totalDiff < 0) {
      // Need to remove records - delete from the end
      const subjectRecords = attendanceRecords.filter(r => r.subject_id === subjectId);
      const toRemove = Math.abs(totalDiff);
      
      // First try to remove absent records, then present if needed
      const absentRecords = subjectRecords.filter(r => r.status === 'absent');
      const presentRecords = subjectRecords.filter(r => r.status === 'present');
      
      let removed = 0;
      
      // Remove absent records first
      for (const record of absentRecords) {
        if (removed >= toRemove) break;
        recordsToDelete.push(record.id);
        removed++;
      }
      
      // If we still need to remove more, remove present records
      if (removed < toRemove) {
        for (const record of presentRecords) {
          if (removed >= toRemove) break;
          recordsToDelete.push(record.id);
          removed++;
        }
      }
    } else {
      // Total is same but attended changed - need to flip statuses
      const subjectRecords = attendanceRecords.filter(r => r.subject_id === subjectId);
      
      if (attendedDiff > 0) {
        // Need to convert absent to present
        const absentRecords = subjectRecords.filter(r => r.status === 'absent');
        for (let i = 0; i < Math.min(attendedDiff, absentRecords.length); i++) {
          const { error } = await supabase
            .from('attendance_records')
            .update({ status: 'present' })
            .eq('id', absentRecords[i].id);
          if (error) {
            toast.error('Failed to update attendance');
            return;
          }
        }
        setAttendanceRecords(
          attendanceRecords.map(r => {
            if (r.subject_id === subjectId && r.status === 'absent') {
              const idx = absentRecords.findIndex(ar => ar.id === r.id);
              if (idx >= 0 && idx < attendedDiff) {
                return { ...r, status: 'present' as const };
              }
            }
            return r;
          })
        );
        toast.success('Attendance updated');
        return;
      } else if (attendedDiff < 0) {
        // Need to convert present to absent
        const presentRecords = subjectRecords.filter(r => r.status === 'present');
        const toFlip = Math.abs(attendedDiff);
        for (let i = 0; i < Math.min(toFlip, presentRecords.length); i++) {
          const { error } = await supabase
            .from('attendance_records')
            .update({ status: 'absent' })
            .eq('id', presentRecords[i].id);
          if (error) {
            toast.error('Failed to update attendance');
            return;
          }
        }
        setAttendanceRecords(
          attendanceRecords.map(r => {
            if (r.subject_id === subjectId && r.status === 'present') {
              const idx = presentRecords.findIndex(pr => pr.id === r.id);
              if (idx >= 0 && idx < toFlip) {
                return { ...r, status: 'absent' as const };
              }
            }
            return r;
          })
        );
        toast.success('Attendance updated');
        return;
      }
    }
    
    // Execute deletions
    if (recordsToDelete.length > 0) {
      for (const id of recordsToDelete) {
        const { error } = await supabase.from('attendance_records').delete().eq('id', id);
        if (error) {
          toast.error('Failed to update attendance');
          return;
        }
      }
      setAttendanceRecords(attendanceRecords.filter(r => !recordsToDelete.includes(r.id)));
    }
    
    // Execute additions
    if (recordsToAdd.length > 0 && timeSlots.length > 0) {
      const { data, error } = await supabase
        .from('attendance_records')
        .insert(recordsToAdd)
        .select();
      
      if (error) {
        toast.error('Failed to update attendance');
        return;
      }
      
      if (data) {
        setAttendanceRecords([...attendanceRecords.filter(r => !recordsToDelete.includes(r.id)), ...data as DbAttendanceRecord[]]);
      }
    }
    
    toast.success('Attendance updated');
  };

  const deleteSubject = async (id: string) => {
    const { error } = await supabase.from('subjects').delete().eq('id', id);
    if (error) {
      toast.error('Failed to delete subject');
      return;
    }
    // Also remove related timetable entries from local state (CASCADE takes care of DB)
    setTimetable(prev => prev.filter(t => t.subject_id !== id));
    // Also remove related attendance records from local state
    setAttendanceRecords(prev => prev.filter(r => r.subject_id !== id));
    setSubjects(subjects.filter(s => s.id !== id));
    toast.success('Subject deleted');
  };

  // Time slot operations
  const initializeDefaultTimeSlots = async () => {
    if (!user || timeSlots.length > 0) return;
    
    const slotsToInsert = DEFAULT_TIME_SLOTS.map(slot => ({
      user_id: user.id,
      ...slot,
    }));

    const { data, error } = await supabase
      .from('time_slots')
      .insert(slotsToInsert)
      .select();
    
    if (error) {
      toast.error('Failed to initialize time slots');
      return;
    }
    setTimeSlots(data);
  };

  const addTimeSlot = async (startTime: string, endTime: string) => {
    if (!user) return;
    const slotOrder = timeSlots.length;
    const { data, error } = await supabase
      .from('time_slots')
      .insert({ user_id: user.id, start_time: startTime, end_time: endTime, slot_order: slotOrder })
      .select()
      .single();
    
    if (error) {
      toast.error('Failed to add time slot');
      return null;
    }
    setTimeSlots([...timeSlots, data]);
    return data;
  };

  const deleteTimeSlot = async (id: string) => {
    const { error } = await supabase.from('time_slots').delete().eq('id', id);
    if (error) {
      toast.error('Failed to delete time slot');
      return;
    }
    // Also remove related timetable entries from local state (CASCADE takes care of DB)
    setTimetable(prev => prev.filter(t => t.time_slot_id !== id));
    // Also remove related attendance records from local state
    setAttendanceRecords(prev => prev.filter(r => r.time_slot_id !== id));
    setTimeSlots(timeSlots.filter(s => s.id !== id));
    toast.success('Time slot deleted');
  };

  // Timetable operations
  const setTimetableEntry = async (timeSlotId: string, dayOfWeek: number, subjectId: string | null) => {
    if (!user) return;

    // Use current state to find existing entry
    const existing = timetable.find(t => t.time_slot_id === timeSlotId && t.day_of_week === dayOfWeek);
    
    if (existing) {
      if (subjectId === null) {
        // Delete entry
        const { error } = await supabase.from('timetable').delete().eq('id', existing.id);
        if (error) {
          toast.error('Failed to update timetable');
          return;
        }
        setTimetable(prev => prev.filter(t => t.id !== existing.id));
      } else {
        // Update entry
        const { error } = await supabase
          .from('timetable')
          .update({ subject_id: subjectId })
          .eq('id', existing.id);
        if (error) {
          toast.error('Failed to update timetable');
          return;
        }
        setTimetable(prev => prev.map(t => t.id === existing.id ? { ...t, subject_id: subjectId } : t));
      }
    } else if (subjectId !== null) {
      // Insert new entry - use upsert to handle potential duplicates
      const { data, error } = await supabase
        .from('timetable')
        .upsert(
          { user_id: user.id, time_slot_id: timeSlotId, day_of_week: dayOfWeek, subject_id: subjectId },
          { onConflict: 'user_id,time_slot_id,day_of_week' }
        )
        .select()
        .single();
      if (error) {
        console.error('Timetable insert error:', error);
        toast.error('Failed to update timetable');
        return;
      }
      // Update state - replace if exists or add new
      setTimetable(prev => {
        const existingIndex = prev.findIndex(t => t.time_slot_id === timeSlotId && t.day_of_week === dayOfWeek);
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = data;
          return updated;
        }
        return [...prev, data];
      });
    }
  };

  // Holiday operations
  const addHoliday = async (startDate: string, endDate: string, reason?: string) => {
    if (!user) return;
    const { data, error } = await supabase
      .from('holidays')
      .insert({ user_id: user.id, start_date: startDate, end_date: endDate, reason })
      .select()
      .single();
    
    if (error) {
      toast.error('Failed to add holiday');
      return null;
    }
    setHolidays([...holidays, data]);
    toast.success('Holiday added');
    return data;
  };

  const deleteHoliday = async (id: string) => {
    const { error } = await supabase.from('holidays').delete().eq('id', id);
    if (error) {
      toast.error('Failed to delete holiday');
      return;
    }
    setHolidays(holidays.filter(h => h.id !== id));
    toast.success('Holiday deleted');
  };

  // Check if a date is a holiday
  const isHoliday = (date: Date): boolean => {
    return holidays.some(h => {
      const start = startOfDay(parseISO(h.start_date));
      const end = startOfDay(parseISO(h.end_date));
      const checkDate = startOfDay(date);
      return isWithinInterval(checkDate, { start, end });
    });
  };

  // Get holiday reason if today is a holiday
  const getHolidayReason = (date: Date): string | null => {
    const holiday = holidays.find(h => {
      const start = startOfDay(parseISO(h.start_date));
      const end = startOfDay(parseISO(h.end_date));
      const checkDate = startOfDay(date);
      return isWithinInterval(checkDate, { start, end });
    });
    return holiday?.reason || null;
  };

  // Attendance operations
  const markAttendance = async (
    subjectId: string,
    timeSlotId: string,
    date: Date,
    status: 'present' | 'absent'
  ) => {
    if (!user) return;
    
    const dateStr = format(date, 'yyyy-MM-dd');
    const existing = attendanceRecords.find(
      r => r.subject_id === subjectId && r.time_slot_id === timeSlotId && r.date === dateStr
    );

    if (existing) {
      const { error } = await supabase
        .from('attendance_records')
        .update({ status })
        .eq('id', existing.id);
      if (error) {
        toast.error('Failed to update attendance');
        return;
      }
      setAttendanceRecords(
        attendanceRecords.map(r => r.id === existing.id ? { ...r, status } : r)
      );
    } else {
      const { data, error } = await supabase
        .from('attendance_records')
        .insert({ user_id: user.id, subject_id: subjectId, time_slot_id: timeSlotId, date: dateStr, status })
        .select()
        .single();
      if (error) {
        toast.error('Failed to mark attendance');
        return;
      }
      setAttendanceRecords([...attendanceRecords, data as DbAttendanceRecord]);
    }
    toast.success(`Marked as ${status}`);
  };

  // Get today's classes
  const getTodayClasses = (date: Date): TodayClass[] => {
    const dayOfWeek = date.getDay() - 1; // 0 = Monday, 4 = Friday
    if (dayOfWeek < 0 || dayOfWeek > 4) return []; // Weekend
    if (isHoliday(date)) return [];

    const dateStr = format(date, 'yyyy-MM-dd');
    const todayTimetable = timetable.filter(t => t.day_of_week === dayOfWeek && t.subject_id);

    return todayTimetable
      .map(entry => {
        const subject = subjects.find(s => s.id === entry.subject_id);
        const timeSlot = timeSlots.find(ts => ts.id === entry.time_slot_id);
        const attendance = attendanceRecords.find(
          r => r.subject_id === entry.subject_id && r.time_slot_id === entry.time_slot_id && r.date === dateStr
        );

        if (!subject || !timeSlot) return null;

        return {
          timetableId: entry.id,
          subjectId: subject.id,
          subjectName: subject.name,
          isLab: subject.is_lab,
          timeSlotId: timeSlot.id,
          startTime: timeSlot.start_time,
          endTime: timeSlot.end_time,
          attendanceStatus: attendance?.status || null,
          attendanceRecordId: attendance?.id || null,
        };
      })
      .filter(Boolean)
      .sort((a, b) => {
        const slotA = timeSlots.find(ts => ts.id === a!.timeSlotId);
        const slotB = timeSlots.find(ts => ts.id === b!.timeSlotId);
        return (slotA?.slot_order || 0) - (slotB?.slot_order || 0);
      }) as TodayClass[];
  };

  // Calculate attendance stats
  const calculateSubjectStats = (subjectId: string) => {
    // Get all working days with classes for this subject (excluding holidays)
    const subjectRecords = attendanceRecords.filter(r => r.subject_id === subjectId);
    
    // Count total scheduled classes from timetable (estimate based on records + future potential)
    const presentCount = subjectRecords.filter(r => r.status === 'present').length;
    const absentCount = subjectRecords.filter(r => r.status === 'absent').length;
    const totalClasses = presentCount + absentCount;
    
    const percentage = totalClasses > 0 ? (presentCount / totalClasses) * 100 : 0;
    
    return {
      total: totalClasses,
      attended: presentCount,
      absent: absentCount,
      percentage,
    };
  };

  const calculateOverallStats = () => {
    let totalClasses = 0;
    let totalAttended = 0;

    subjects.forEach(subject => {
      const stats = calculateSubjectStats(subject.id);
      totalClasses += stats.total;
      totalAttended += stats.attended;
    });

    const percentage = totalClasses > 0 ? (totalAttended / totalClasses) * 100 : 0;

    return {
      total: totalClasses,
      attended: totalAttended,
      percentage,
    };
  };

  const calculateClassesNeededFor75 = (attended: number, total: number): number => {
    const currentPercentage = total > 0 ? (attended / total) * 100 : 0;
    if (currentPercentage >= 75) return 0;
    
    // (attended + x) / (total + x) >= 0.75
    // attended + x >= 0.75 * total + 0.75 * x
    // 0.25 * x >= 0.75 * total - attended
    // x >= (0.75 * total - attended) / 0.25
    // x >= 3 * total - 4 * attended
    const classesNeeded = Math.ceil(3 * total - 4 * attended);
    return Math.max(0, classesNeeded);
  };

  return {
    subjects,
    timeSlots,
    timetable,
    holidays,
    attendanceRecords,
    loading,
    fetchData,
    addSubject,
    updateSubject,
    updateSubjectAttendance,
    deleteSubject,
    initializeDefaultTimeSlots,
    addTimeSlot,
    deleteTimeSlot,
    setTimetableEntry,
    addHoliday,
    deleteHoliday,
    isHoliday,
    getHolidayReason,
    markAttendance,
    getTodayClasses,
    calculateSubjectStats,
    calculateOverallStats,
    calculateClassesNeededFor75,
    DAY_NAMES,
  };
};
