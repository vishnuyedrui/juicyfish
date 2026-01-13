import { useState, useMemo, useCallback } from 'react';
import { DbSubject } from '@/hooks/useAttendanceData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Lightbulb, TrendingDown, TrendingUp, ArrowRight, RotateCcw, BarChart } from 'lucide-react';
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

interface SubjectScenario {
  subjectId: string;
  selected: boolean;
  missedClasses: number;
  attendedClasses: number;
}

interface SimulationResult {
  subjectId: string;
  subjectName: string;
  originalPercentage: number;
  newPercentage: number;
  change: number;
  missedClasses: number;
  attendedClasses: number;
}

export const WhatIfSimulator = ({
  subjects,
  calculateSubjectStats,
  calculateOverallStats,
}: WhatIfSimulatorProps) => {
  // Initialize scenarios for all subjects
  const [scenarios, setScenarios] = useState<SubjectScenario[]>(() =>
    subjects.map(s => ({
      subjectId: s.id,
      selected: false,
      missedClasses: 0,
      attendedClasses: 0,
    }))
  );

  // Sync scenarios when subjects change
  useMemo(() => {
    setScenarios(prev => {
      const newScenarios = subjects.map(s => {
        const existing = prev.find(p => p.subjectId === s.id);
        return existing || {
          subjectId: s.id,
          selected: false,
          missedClasses: 0,
          attendedClasses: 0,
        };
      });
      return newScenarios;
    });
  }, [subjects]);

  // Calculate results in real-time
  const results = useMemo(() => {
    const subjectResults: SimulationResult[] = [];
    const originalOverall = calculateOverallStats();
    
    let newOverallTotal = originalOverall.total;
    let newOverallAttended = originalOverall.attended;

    subjects.forEach(subject => {
      const scenario = scenarios.find(s => s.subjectId === subject.id);
      if (!scenario || !scenario.selected) return;
      
      const { missedClasses, attendedClasses } = scenario;
      if (missedClasses === 0 && attendedClasses === 0) return;

      const stats = calculateSubjectStats(subject.id);
      
      // Calculate new stats for this subject
      const additionalTotal = missedClasses + attendedClasses;
      const additionalAttended = attendedClasses;
      
      const newTotal = stats.total + additionalTotal;
      const newAttended = stats.attended + additionalAttended;
      const newPercentage = newTotal > 0 ? (newAttended / newTotal) * 100 : 0;
      
      subjectResults.push({
        subjectId: subject.id,
        subjectName: subject.name,
        originalPercentage: stats.percentage,
        newPercentage,
        change: newPercentage - stats.percentage,
        missedClasses,
        attendedClasses,
      });

      // Update overall totals
      newOverallTotal += additionalTotal;
      newOverallAttended += additionalAttended;
    });

    const newOverallPercentage = newOverallTotal > 0 ? (newOverallAttended / newOverallTotal) * 100 : 0;
    
    return {
      subjects: subjectResults,
      overall: {
        original: originalOverall.percentage,
        new: newOverallPercentage,
        change: newOverallPercentage - originalOverall.percentage,
        hasChanges: subjectResults.length > 0,
      },
    };
  }, [scenarios, subjects, calculateSubjectStats, calculateOverallStats]);

  const updateScenario = useCallback((subjectId: string, updates: Partial<SubjectScenario>) => {
    setScenarios(prev => 
      prev.map(s => s.subjectId === subjectId ? { ...s, ...updates } : s)
    );
  }, []);

  const toggleSubject = useCallback((subjectId: string, selected: boolean) => {
    updateScenario(subjectId, { selected });
  }, [updateScenario]);

  const resetAll = useCallback(() => {
    setScenarios(subjects.map(s => ({
      subjectId: s.id,
      selected: false,
      missedClasses: 0,
      attendedClasses: 0,
    })));
  }, [subjects]);

  const selectAll = useCallback(() => {
    setScenarios(prev => prev.map(s => ({ ...s, selected: true })));
  }, []);

  const deselectAll = useCallback(() => {
    setScenarios(prev => prev.map(s => ({ ...s, selected: false })));
  }, []);

  if (subjects.length === 0) {
    return null;
  }

  const selectedCount = scenarios.filter(s => s.selected).length;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Lightbulb className="w-5 h-5 text-primary" />
            What-If Scenarios
          </CardTitle>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={selectedCount === subjects.length ? deselectAll : selectAll}
              className="text-xs"
            >
              {selectedCount === subjects.length ? 'Deselect All' : 'Select All'}
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={resetAll}
              className="text-xs gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </Button>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Select subjects and adjust classes to see real-time attendance impact
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Subject Scenarios Grid */}
        <div className="space-y-3">
          {subjects.map(subject => {
            const scenario = scenarios.find(s => s.subjectId === subject.id);
            const stats = calculateSubjectStats(subject.id);
            const result = results.subjects.find(r => r.subjectId === subject.id);
            
            if (!scenario) return null;

            return (
              <div 
                key={subject.id} 
                className={cn(
                  "p-3 rounded-lg border transition-colors",
                  scenario.selected ? "bg-muted/50 border-primary/30" : "bg-background"
                )}
              >
                <div className="flex items-start gap-3">
                  <Checkbox
                    id={`select-${subject.id}`}
                    checked={scenario.selected}
                    onCheckedChange={(checked) => toggleSubject(subject.id, checked as boolean)}
                    className="mt-1"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <Label 
                        htmlFor={`select-${subject.id}`}
                        className="font-medium cursor-pointer truncate"
                      >
                        {subject.name}
                      </Label>
                      <span className={cn(
                        "text-sm font-semibold",
                        stats.percentage >= 75 ? "text-green-600" : "text-red-600"
                      )}>
                        {stats.percentage.toFixed(2)}%
                      </span>
                    </div>
                    
                    {scenario.selected && (
                      <div className="grid grid-cols-2 gap-3 mt-3">
                        <div className="space-y-1">
                          <Label className="text-xs flex items-center gap-1 text-red-600">
                            <TrendingDown className="w-3 h-3" />
                            Miss Classes
                          </Label>
                          <Input
                            type="number"
                            min={0}
                            max={50}
                            value={scenario.missedClasses}
                            onChange={(e) => updateScenario(subject.id, { 
                              missedClasses: Math.max(0, parseInt(e.target.value) || 0) 
                            })}
                            className="h-8 text-sm"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs flex items-center gap-1 text-green-600">
                            <TrendingUp className="w-3 h-3" />
                            Attend Classes
                          </Label>
                          <Input
                            type="number"
                            min={0}
                            max={50}
                            value={scenario.attendedClasses}
                            onChange={(e) => updateScenario(subject.id, { 
                              attendedClasses: Math.max(0, parseInt(e.target.value) || 0) 
                            })}
                            className="h-8 text-sm"
                          />
                        </div>
                      </div>
                    )}

                    {/* Live Result for this subject */}
                    {result && (
                      <div className="mt-3 p-2 rounded bg-muted/80 flex items-center gap-2 text-sm flex-wrap">
                        <span className="text-muted-foreground">New:</span>
                        <span>{result.originalPercentage.toFixed(2)}%</span>
                        <ArrowRight className="w-3 h-3" />
                        <span className={cn(
                          'font-bold',
                          result.change >= 0 ? 'text-green-600' : 'text-red-600'
                        )}>
                          {result.newPercentage.toFixed(2)}%
                        </span>
                        <span className={cn(
                          'text-xs px-1.5 py-0.5 rounded',
                          result.change >= 0 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        )}>
                          {result.change >= 0 ? '+' : ''}{result.change.toFixed(2)}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Overall Results */}
        {results.overall.hasChanges && (
          <div className="p-4 bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <BarChart className="w-4 h-4" />
              Overall Impact
            </h4>
            
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Current:</span>
                <span className="text-lg font-semibold">{results.overall.original.toFixed(2)}%</span>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">After:</span>
                <span className={cn(
                  'text-lg font-bold',
                  results.overall.change >= 0 ? 'text-green-600' : 'text-red-600'
                )}>
                  {results.overall.new.toFixed(2)}%
                </span>
              </div>
              <span className={cn(
                'text-sm px-2 py-1 rounded font-medium',
                results.overall.change >= 0 
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                  : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              )}>
                {results.overall.change >= 0 ? '+' : ''}{results.overall.change.toFixed(2)}%
              </span>
            </div>

            {results.overall.new < 75 && results.overall.original >= 75 && (
              <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                <TrendingDown className="w-4 h-4" />
                Warning: This will drop your attendance below 75%!
              </p>
            )}
            {results.overall.new >= 75 && results.overall.original < 75 && (
              <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                Great! This will bring your attendance above 75%!
              </p>
            )}
          </div>
        )}

        {/* Summary of selected scenarios */}
        {results.subjects.length > 0 && (
          <div className="text-xs text-muted-foreground border-t pt-3">
            <strong>Summary:</strong>{' '}
            {results.subjects.map((r, i) => (
              <span key={r.subjectId}>
                {i > 0 && ', '}
                {r.subjectName} ({r.missedClasses > 0 ? `-${r.missedClasses} missed` : ''}{r.missedClasses > 0 && r.attendedClasses > 0 ? ', ' : ''}{r.attendedClasses > 0 ? `+${r.attendedClasses} attended` : ''})
              </span>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
