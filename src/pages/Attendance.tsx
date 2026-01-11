import { useState, useEffect } from "react";
import { Subject, TimetableEntry, WhatIfResult, RecoveryInfo, DAYS, PERIODS_PER_DAY, createNewSubject } from "@/types/attendance";
import { SubjectSetup } from "@/components/attendance/SubjectSetup";
import { TimetableSetup } from "@/components/attendance/TimetableSetup";
import { AttendanceDisplay } from "@/components/attendance/AttendanceDisplay";
import { WhatIfScenarios } from "@/components/attendance/WhatIfScenarios";
import { RecoveryRecommendations } from "@/components/attendance/RecoveryRecommendations";
import { exportAttendanceToPDF } from "@/utils/attendancePdfExport";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarCheck, Download, GraduationCap, Calculator } from "lucide-react";
import { Link } from "react-router-dom";

const createEmptyTimetable = (): TimetableEntry[] => {
  return DAYS.map(day => ({
    day,
    periods: Array(PERIODS_PER_DAY).fill(''),
  }));
};

const Attendance = () => {
  const [subjects, setSubjects] = useState<Subject[]>([createNewSubject()]);
  const [timetable, setTimetable] = useState<TimetableEntry[]>(createEmptyTimetable());
  const [whatIfResults, setWhatIfResults] = useState<WhatIfResult[]>([]);
  const [scenarioDescription, setScenarioDescription] = useState('');
  const [recoveryInfos, setRecoveryInfos] = useState<RecoveryInfo[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleWhatIfResultsChange = (results: WhatIfResult[], description: string) => {
    setWhatIfResults(results);
    setScenarioDescription(description);
  };

  const handleDownloadPDF = () => {
    exportAttendanceToPDF({
      subjects,
      whatIfResults: whatIfResults.length > 0 ? whatIfResults : undefined,
      recoveryInfos: recoveryInfos.length > 0 ? recoveryInfos : undefined,
      scenarioDescription: scenarioDescription || undefined,
    });
  };

  const validSubjects = subjects.filter(s => s.name.trim() !== '' && s.totalClasses > 0);
  const canCalculate = validSubjects.length > 0;

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
                <h1 className="text-lg sm:text-xl font-bold truncate">Attendance Calculator</h1>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">Smart predictions & tracking</p>
              </div>
            </div>
            <Button
              onClick={() => setShowResults(true)}
              disabled={!canCalculate}
              className="gap-2"
              size="sm"
            >
              <Calculator className="w-4 h-4" />
              <span className="hidden sm:inline">Calculate</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <div className="container max-w-4xl mx-auto px-3 sm:px-4 py-3">
        <Link to="/">
          <Button variant="outline" size="sm" className="gap-2">
            <GraduationCap className="w-4 h-4" />
            Grade Calculator
          </Button>
        </Link>
      </div>

      <main className="container max-w-4xl mx-auto px-3 sm:px-4 space-y-6">
        {!showResults ? (
          /* Setup View */
          <Tabs defaultValue="subjects" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="subjects">Subjects</TabsTrigger>
              <TabsTrigger value="timetable">Timetable</TabsTrigger>
            </TabsList>
            
            <TabsContent value="subjects">
              <SubjectSetup 
                subjects={subjects} 
                onSubjectsChange={setSubjects} 
              />
            </TabsContent>
            
            <TabsContent value="timetable">
              <TimetableSetup 
                subjects={subjects}
                timetable={timetable}
                onTimetableChange={setTimetable}
              />
            </TabsContent>
          </Tabs>
        ) : (
          /* Results View */
          <>
            <div className="flex items-center justify-between">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowResults(false)}
              >
                ← Edit Setup
              </Button>
              <Button 
                onClick={handleDownloadPDF}
                size="sm"
                className="gap-2"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </Button>
            </div>

            <AttendanceDisplay subjects={subjects} />
            
            <RecoveryRecommendations 
              subjects={subjects}
              onRecoveryInfoChange={setRecoveryInfos}
            />
            
            <WhatIfScenarios 
              subjects={subjects}
              timetable={timetable}
              onResultsChange={handleWhatIfResultsChange}
            />
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-8 sm:mt-12 text-center text-xs sm:text-sm text-muted-foreground px-4">
        <p>Built with ❤️ for students @ TEAMDINO teamdino.in</p>
      </footer>
    </div>
  );
};

export default Attendance;
