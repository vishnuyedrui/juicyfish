import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useAttendanceData } from '@/hooks/useAttendanceData';
import { SubjectManager } from '@/components/attendance/SubjectManager';
import { TimeSlotManager } from '@/components/attendance/TimeSlotManager';
import { TimetableGrid } from '@/components/attendance/TimetableGrid';
import { HolidayManager } from '@/components/attendance/HolidayManager';
import { TodayClasses } from '@/components/attendance/TodayClasses';
import { AttendanceStats } from '@/components/attendance/AttendanceStats';
import { WhatIfSimulator } from '@/components/attendance/WhatIfSimulator';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarCheck, GraduationCap, LogOut, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Attendance = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const {
    subjects,
    timeSlots,
    timetable,
    holidays,
    loading,
    addSubject,
    updateSubject,
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
  } = useAttendanceData();

  const today = new Date();
  const todayClasses = getTodayClasses(today);
  const isTodayHoliday = isHoliday(today);
  const holidayReason = getHolidayReason(today);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const handleMarkAttendance = async (subjectId: string, timeSlotId: string, status: 'present' | 'absent') => {
    await markAttendance(subjectId, timeSlotId, today, status);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Header */}
      <header className="bg-card border-b sticky top-0 z-10">
        <div className="container max-w-4xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                <CalendarCheck className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-bold truncate">Smart Attendance</h1>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">{user?.email}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link to="/">
                <Button variant="outline" size="sm" className="gap-2">
                  <GraduationCap className="w-4 h-4" />
                  <span className="hidden sm:inline">Grades</span>
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container max-w-4xl mx-auto px-3 sm:px-4 py-4 space-y-6">
        {/* Today's Classes */}
        <TodayClasses
          date={today}
          classes={todayClasses}
          isHoliday={isTodayHoliday}
          holidayReason={holidayReason}
          onMarkAttendance={handleMarkAttendance}
        />

        {/* Attendance Stats */}
        <AttendanceStats
          subjects={subjects}
          calculateSubjectStats={calculateSubjectStats}
          calculateOverallStats={calculateOverallStats}
          calculateClassesNeededFor75={calculateClassesNeededFor75}
        />

        {/* What-If Simulator */}
        <WhatIfSimulator
          subjects={subjects}
          calculateSubjectStats={calculateSubjectStats}
          calculateOverallStats={calculateOverallStats}
        />

        {/* Setup Tabs */}
        <Tabs defaultValue="subjects" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="subjects" className="text-xs sm:text-sm">Subjects</TabsTrigger>
            <TabsTrigger value="slots" className="text-xs sm:text-sm">Time Slots</TabsTrigger>
            <TabsTrigger value="timetable" className="text-xs sm:text-sm">Timetable</TabsTrigger>
            <TabsTrigger value="holidays" className="text-xs sm:text-sm">Holidays</TabsTrigger>
          </TabsList>
          
          <TabsContent value="subjects">
            <SubjectManager
              subjects={subjects}
              onAddSubject={addSubject}
              onUpdateSubject={updateSubject}
              onDeleteSubject={deleteSubject}
              getSubjectStats={calculateSubjectStats}
            />
          </TabsContent>
          
          <TabsContent value="slots">
            <TimeSlotManager
              timeSlots={timeSlots}
              onAddTimeSlot={addTimeSlot}
              onDeleteTimeSlot={deleteTimeSlot}
              onInitializeDefaults={initializeDefaultTimeSlots}
            />
          </TabsContent>
          
          <TabsContent value="timetable">
            <TimetableGrid
              subjects={subjects}
              timeSlots={timeSlots}
              timetable={timetable}
              onSetEntry={setTimetableEntry}
              dayNames={DAY_NAMES}
            />
          </TabsContent>
          
          <TabsContent value="holidays">
            <HolidayManager
              holidays={holidays}
              onAddHoliday={addHoliday}
              onDeleteHoliday={deleteHoliday}
            />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="mt-8 sm:mt-12 text-center text-xs sm:text-sm text-muted-foreground px-4">
        <p>Built with ❤️ for students @ TEAMDINO teamdino.in</p>
      </footer>
    </div>
  );
};

export default Attendance;
