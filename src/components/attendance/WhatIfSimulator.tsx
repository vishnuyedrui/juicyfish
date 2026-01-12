import { useState } from 'react';
import { DbSubject } from '@/hooks/useAttendanceData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lightbulb, TrendingDown, TrendingUp, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WhatIfSimulatorProps {
  subjects: DbSubject[];
  calculateSubjectStats: (subjectId: string) => {
    total: number;
    attended: number;
    percentage: number;
  };
  calculateOverallStats: () => {
    total: number;
    attended: number;
    percentage: number;
  };
}

interface SimulationResult {
  subjectName: string;
  originalPercentage: number;
  newPercentage: number;
  change: number;
}

export const WhatIfSimulator = ({
  subjects,
  calculateSubjectStats,
  calculateOverallStats,
}: WhatIfSimulatorProps) => {
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [missedClasses, setMissedClasses] = useState<number>(1);
  const [attendedClasses, setAttendedClasses] = useState<number>(1);
  const [results, setResults] = useState<{
    subject: SimulationResult | null;
    overall: { original: number; new: number; change: number } | null;
  }>({ subject: null, overall: null });

  const simulateMissing = () => {
    if (!selectedSubject) return;
    
    const subject = subjects.find(s => s.id === selectedSubject);
    if (!subject) return;

    const stats = calculateSubjectStats(selectedSubject);
    const overallStats = calculateOverallStats();

    // Calculate new percentages after missing classes
    const newTotal = stats.total + missedClasses;
    const newPercentage = newTotal > 0 ? (stats.attended / newTotal) * 100 : 0;

    const newOverallTotal = overallStats.total + missedClasses;
    const newOverallPercentage = newOverallTotal > 0 ? (overallStats.attended / newOverallTotal) * 100 : 0;

    setResults({
      subject: {
        subjectName: subject.name,
        originalPercentage: stats.percentage,
        newPercentage,
        change: newPercentage - stats.percentage,
      },
      overall: {
        original: overallStats.percentage,
        new: newOverallPercentage,
        change: newOverallPercentage - overallStats.percentage,
      },
    });
  };

  const simulateAttending = () => {
    if (!selectedSubject) return;
    
    const subject = subjects.find(s => s.id === selectedSubject);
    if (!subject) return;

    const stats = calculateSubjectStats(selectedSubject);
    const overallStats = calculateOverallStats();

    // Calculate new percentages after attending classes
    const newTotal = stats.total + attendedClasses;
    const newAttended = stats.attended + attendedClasses;
    const newPercentage = newTotal > 0 ? (newAttended / newTotal) * 100 : 0;

    const newOverallTotal = overallStats.total + attendedClasses;
    const newOverallAttended = overallStats.attended + attendedClasses;
    const newOverallPercentage = newOverallTotal > 0 ? (newOverallAttended / newOverallTotal) * 100 : 0;

    setResults({
      subject: {
        subjectName: subject.name,
        originalPercentage: stats.percentage,
        newPercentage,
        change: newPercentage - stats.percentage,
      },
      overall: {
        original: overallStats.percentage,
        new: newOverallPercentage,
        change: newOverallPercentage - overallStats.percentage,
      },
    });
  };

  const clearResults = () => {
    setResults({ subject: null, overall: null });
  };

  if (subjects.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <Lightbulb className="w-5 h-5 text-primary" />
          What-If Scenarios
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Miss Classes Scenario */}
          <div className="p-4 border rounded-lg space-y-3">
            <h4 className="font-medium text-sm flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-red-500" />
              If I Miss Classes
            </h4>
            <div className="space-y-2">
              <Label className="text-xs">Subject</Label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Number of classes</Label>
              <Input
                type="number"
                min={1}
                max={10}
                value={missedClasses}
                onChange={(e) => setMissedClasses(Math.max(1, parseInt(e.target.value) || 1))}
              />
            </div>
            <Button 
              onClick={simulateMissing} 
              size="sm" 
              variant="outline" 
              className="w-full"
              disabled={!selectedSubject}
            >
              Calculate Impact
            </Button>
          </div>

          {/* Attend Classes Scenario */}
          <div className="p-4 border rounded-lg space-y-3">
            <h4 className="font-medium text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              If I Attend Classes
            </h4>
            <div className="space-y-2">
              <Label className="text-xs">Subject</Label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Number of classes</Label>
              <Input
                type="number"
                min={1}
                max={10}
                value={attendedClasses}
                onChange={(e) => setAttendedClasses(Math.max(1, parseInt(e.target.value) || 1))}
              />
            </div>
            <Button 
              onClick={simulateAttending} 
              size="sm" 
              variant="outline" 
              className="w-full"
              disabled={!selectedSubject}
            >
              Calculate Improvement
            </Button>
          </div>
        </div>

        {/* Results */}
        {results.subject && results.overall && (
          <div className="p-4 bg-muted/50 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Simulation Results</h4>
              <Button size="sm" variant="ghost" onClick={clearResults}>Clear</Button>
            </div>
            
            {/* Subject Result */}
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">{results.subject.subjectName}:</span>
              <span>{results.subject.originalPercentage.toFixed(1)}%</span>
              <ArrowRight className="w-4 h-4" />
              <span className={cn(
                'font-bold',
                results.subject.change >= 0 ? 'text-green-600' : 'text-red-600'
              )}>
                {results.subject.newPercentage.toFixed(1)}%
              </span>
              <span className={cn(
                'text-xs',
                results.subject.change >= 0 ? 'text-green-600' : 'text-red-600'
              )}>
                ({results.subject.change >= 0 ? '+' : ''}{results.subject.change.toFixed(1)}%)
              </span>
            </div>

            {/* Overall Result */}
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">Overall:</span>
              <span>{results.overall.original.toFixed(1)}%</span>
              <ArrowRight className="w-4 h-4" />
              <span className={cn(
                'font-bold',
                results.overall.change >= 0 ? 'text-green-600' : 'text-red-600'
              )}>
                {results.overall.new.toFixed(1)}%
              </span>
              <span className={cn(
                'text-xs',
                results.overall.change >= 0 ? 'text-green-600' : 'text-red-600'
              )}>
                ({results.overall.change >= 0 ? '+' : ''}{results.overall.change.toFixed(1)}%)
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
