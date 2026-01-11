import { useState } from "react";
import { Subject, TimetableEntry, WhatIfResult, simulateAbsence, simulateAttendance, simulateNextNAbsences, calculateOverallAttendance, calculateAttendancePercentage } from "@/types/attendance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FlaskConical, TrendingDown, TrendingUp, ArrowRight } from "lucide-react";

interface WhatIfScenariosProps {
  subjects: Subject[];
  timetable: TimetableEntry[];
  onResultsChange: (results: WhatIfResult[], description: string) => void;
}

export const WhatIfScenarios = ({ subjects, timetable, onResultsChange }: WhatIfScenariosProps) => {
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [missedClasses, setMissedClasses] = useState(2);
  const [attendedClasses, setAttendedClasses] = useState(2);
  const [nextAbsences, setNextAbsences] = useState(3);
  const [results, setResults] = useState<WhatIfResult[]>([]);
  const [activeTab, setActiveTab] = useState('absent');

  const validSubjects = subjects.filter(s => s.name.trim() !== '' && s.totalClasses > 0);

  const calculateAbsenceImpact = () => {
    if (!selectedSubject) return;
    const result = simulateAbsence(subjects, selectedSubject, missedClasses);
    setResults([result]);
    onResultsChange([result], `If absent for ${missedClasses} classes of ${result.subjectName}`);
  };

  const calculateAttendanceImpact = () => {
    if (!selectedSubject) return;
    const result = simulateAttendance(subjects, selectedSubject, attendedClasses);
    setResults([result]);
    onResultsChange([result], `If attending ${attendedClasses} more classes of ${result.subjectName}`);
  };

  const calculateNextAbsencesImpact = () => {
    const newResults = simulateNextNAbsences(subjects, timetable, nextAbsences);
    setResults(newResults);
    onResultsChange(newResults, `If absent for next ${nextAbsences} classes in your timetable`);
  };

  const getOverallChange = () => {
    if (results.length === 0) return null;
    
    const originalOverall = calculateOverallAttendance(subjects);
    
    // Calculate modified subjects
    const modifiedSubjects = subjects.map(s => {
      const result = results.find(r => r.subjectId === s.id);
      if (!result) return s;
      
      if (activeTab === 'attend') {
        return {
          ...s,
          totalClasses: s.totalClasses + attendedClasses,
          attendedClasses: s.attendedClasses + attendedClasses,
        };
      } else {
        const additionalClasses = activeTab === 'absent' ? missedClasses : 
          results.filter(r => r.subjectId === s.id).length;
        return {
          ...s,
          totalClasses: s.totalClasses + additionalClasses,
        };
      }
    });
    
    const newOverall = calculateOverallAttendance(modifiedSubjects);
    return {
      original: originalOverall.percentage,
      new: newOverall.percentage,
      change: newOverall.percentage - originalOverall.percentage,
    };
  };

  const overallChange = getOverallChange();

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <FlaskConical className="w-5 h-5 text-primary" />
          What-If Scenarios
        </CardTitle>
      </CardHeader>
      <CardContent>
        {validSubjects.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Add subjects first to run simulations
          </p>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="absent" className="text-xs sm:text-sm">If Absent</TabsTrigger>
              <TabsTrigger value="attend" className="text-xs sm:text-sm">If Attend</TabsTrigger>
              <TabsTrigger value="next" className="text-xs sm:text-sm">Next Classes</TabsTrigger>
            </TabsList>
            
            <TabsContent value="absent" className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Select Subject</Label>
                  <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Choose subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {validSubjects.map((s) => (
                        <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Classes to Miss</Label>
                  <Input
                    type="number"
                    min={1}
                    value={missedClasses}
                    onChange={(e) => setMissedClasses(parseInt(e.target.value) || 1)}
                    className="mt-1"
                  />
                </div>
              </div>
              <Button onClick={calculateAbsenceImpact} disabled={!selectedSubject} className="w-full">
                <TrendingDown className="w-4 h-4 mr-2" />
                Calculate Impact
              </Button>
            </TabsContent>
            
            <TabsContent value="attend" className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Select Subject</Label>
                  <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Choose subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {validSubjects.map((s) => (
                        <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Classes to Attend</Label>
                  <Input
                    type="number"
                    min={1}
                    value={attendedClasses}
                    onChange={(e) => setAttendedClasses(parseInt(e.target.value) || 1)}
                    className="mt-1"
                  />
                </div>
              </div>
              <Button onClick={calculateAttendanceImpact} disabled={!selectedSubject} className="w-full">
                <TrendingUp className="w-4 h-4 mr-2" />
                Calculate Impact
              </Button>
            </TabsContent>
            
            <TabsContent value="next" className="space-y-4">
              <div>
                <Label className="text-xs">Number of Next Classes to Miss</Label>
                <Input
                  type="number"
                  min={1}
                  max={30}
                  value={nextAbsences}
                  onChange={(e) => setNextAbsences(parseInt(e.target.value) || 1)}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Uses your timetable to identify which subjects are affected
                </p>
              </div>
              <Button onClick={calculateNextAbsencesImpact} className="w-full">
                <TrendingDown className="w-4 h-4 mr-2" />
                Calculate Impact
              </Button>
            </TabsContent>
          </Tabs>
        )}
        
        {/* Results */}
        {results.length > 0 && (
          <div className="mt-4 space-y-3">
            <div className="border-t pt-4">
              <h4 className="font-medium text-sm mb-3">Simulation Results</h4>
              
              {results.map((result) => (
                <div key={result.subjectId} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg mb-2">
                  <span className="font-medium text-sm">{result.subjectName}</span>
                  <div className="flex items-center gap-2 text-sm">
                    <span>{result.originalPercentage.toFixed(1)}%</span>
                    <ArrowRight className="w-4 h-4" />
                    <span className={result.change >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {result.newPercentage.toFixed(1)}%
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded ${result.change >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {result.change >= 0 ? '+' : ''}{result.change.toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
              
              {overallChange && (
                <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg border border-primary/20">
                  <span className="font-medium text-sm">Overall Attendance</span>
                  <div className="flex items-center gap-2 text-sm">
                    <span>{overallChange.original.toFixed(1)}%</span>
                    <ArrowRight className="w-4 h-4" />
                    <span className={overallChange.change >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {overallChange.new.toFixed(1)}%
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded ${overallChange.change >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {overallChange.change >= 0 ? '+' : ''}{overallChange.change.toFixed(1)}%
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
