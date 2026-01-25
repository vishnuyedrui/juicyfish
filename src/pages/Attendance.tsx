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
import { CalendarCheck, GraduationCap, LogOut, Loader2, ArrowLeft, Sparkles } from 'lucide-react';
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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-pop-green flex items-center justify-center pop-shadow animate-bounce">
            <Loader2 className="w-8 h-8 animate-spin text-white" />
          </div>
          <p className="font-bold text-muted-foreground">Loading attendance data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-12 relative overflow-hidden">
      {/* Abstract background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-pop-green/15 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-0 w-96 h-96 bg-pop-cyan/15 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-pop-yellow/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-pop-pink/15 rounded-full blur-3xl" />
      </div>

      {/* Header - Pop Art Style */}
      <header className="pop-gradient-green border-b-4 border-foreground/20 sticky top-0 z-10">
        <div className="container max-w-4xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(-1)}
                className="flex-shrink-0 bg-white/20 hover:bg-white hover:text-foreground text-white rounded-xl transition-all hover:scale-105"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="relative">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white flex items-center justify-center pop-shadow">
                  <CalendarCheck className="w-5 h-5 sm:w-6 sm:h-6 text-pop-green" />
                </div>
                <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-pop-yellow animate-pulse" />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-black text-white drop-shadow-md">Smart Attendance 📊</h1>
                <p className="text-xs sm:text-sm text-white/80 truncate font-medium">{user?.email}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link to="/calculator">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-2 bg-white/20 border-white/30 text-white hover:bg-white hover:text-foreground rounded-xl font-bold transition-all hover:scale-105"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span className="hidden sm:inline">Grades</span>
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleSignOut}
                className="bg-white/20 hover:bg-white hover:text-foreground text-white rounded-xl transition-all hover:scale-105"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container max-w-4xl mx-auto px-3 sm:px-4 py-4 space-y-6 relative z-10">
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
          <TabsList className="grid w-full grid-cols-4 mb-4 bg-card border-[3px] border-foreground/10 rounded-2xl p-1 pop-shadow">
            <TabsTrigger value="subjects" className="text-xs sm:text-sm font-bold rounded-xl data-[state=active]:bg-pop-pink data-[state=active]:text-white">Subjects</TabsTrigger>
            <TabsTrigger value="slots" className="text-xs sm:text-sm font-bold rounded-xl data-[state=active]:bg-pop-cyan data-[state=active]:text-white">Time Slots</TabsTrigger>
            <TabsTrigger value="timetable" className="text-xs sm:text-sm font-bold rounded-xl data-[state=active]:bg-pop-purple data-[state=active]:text-white">Timetable</TabsTrigger>
            <TabsTrigger value="holidays" className="text-xs sm:text-sm font-bold rounded-xl data-[state=active]:bg-pop-orange data-[state=active]:text-white">Holidays</TabsTrigger>
          </TabsList>
          
          <TabsContent value="subjects">
            <SubjectManager
              subjects={subjects}
              onAddSubject={addSubject}
              onUpdateSubject={updateSubject}
              onUpdateSubjectAttendance={updateSubjectAttendance}
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

      {/* Footer - Pop Art Style */}
      <footer className="mt-8 sm:mt-12 relative z-10">
        <div className="pop-gradient-yellow py-4">
          <p className="text-center text-sm font-bold text-foreground drop-shadow-sm">
            Built with <span className="text-2xl animate-pulse">❤️</span> for students @ TEAMDINO teamdino.in
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Attendance;
