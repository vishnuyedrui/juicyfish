export interface Subject {
  id: string;
  name: string;
  totalClasses: number;
  attendedClasses: number;
}

export interface TimetableEntry {
  day: string;
  periods: string[]; // Array of subject IDs
}

export interface AttendanceData {
  subjects: Subject[];
  timetable: TimetableEntry[];
}

export interface WhatIfResult {
  subjectId: string;
  subjectName: string;
  originalPercentage: number;
  newPercentage: number;
  change: number;
}

export interface RecoveryInfo {
  subjectId: string;
  subjectName: string;
  currentPercentage: number;
  classesNeeded: number;
}

export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const;
export const PERIODS_PER_DAY = 6;

export const createNewSubject = (): Subject => ({
  id: crypto.randomUUID(),
  name: '',
  totalClasses: 0,
  attendedClasses: 0,
});

export const calculateAttendancePercentage = (attended: number, total: number): number => {
  if (total === 0) return 0;
  return (attended / total) * 100;
};

export const calculateOverallAttendance = (subjects: Subject[]): { attended: number; total: number; percentage: number } => {
  const total = subjects.reduce((sum, s) => sum + s.totalClasses, 0);
  const attended = subjects.reduce((sum, s) => sum + s.attendedClasses, 0);
  return {
    total,
    attended,
    percentage: calculateAttendancePercentage(attended, total),
  };
};

export const calculateClassesNeededFor75 = (attended: number, total: number): number => {
  // Formula: (attended + x) / (total + x) >= 0.75
  // attended + x >= 0.75 * (total + x)
  // attended + x >= 0.75 * total + 0.75 * x
  // 0.25 * x >= 0.75 * total - attended
  // x >= (0.75 * total - attended) / 0.25
  // x >= 3 * total - 4 * attended
  const currentPercentage = calculateAttendancePercentage(attended, total);
  if (currentPercentage >= 75) return 0;
  
  const classesNeeded = Math.ceil(3 * total - 4 * attended);
  return Math.max(0, classesNeeded);
};

export const simulateAbsence = (
  subjects: Subject[],
  subjectId: string,
  missedClasses: number
): WhatIfResult => {
  const subject = subjects.find(s => s.id === subjectId);
  if (!subject) throw new Error('Subject not found');
  
  const originalPercentage = calculateAttendancePercentage(subject.attendedClasses, subject.totalClasses);
  const newTotal = subject.totalClasses + missedClasses;
  const newPercentage = calculateAttendancePercentage(subject.attendedClasses, newTotal);
  
  return {
    subjectId,
    subjectName: subject.name,
    originalPercentage,
    newPercentage,
    change: newPercentage - originalPercentage,
  };
};

export const simulateAttendance = (
  subjects: Subject[],
  subjectId: string,
  attendedClasses: number
): WhatIfResult => {
  const subject = subjects.find(s => s.id === subjectId);
  if (!subject) throw new Error('Subject not found');
  
  const originalPercentage = calculateAttendancePercentage(subject.attendedClasses, subject.totalClasses);
  const newTotal = subject.totalClasses + attendedClasses;
  const newAttended = subject.attendedClasses + attendedClasses;
  const newPercentage = calculateAttendancePercentage(newAttended, newTotal);
  
  return {
    subjectId,
    subjectName: subject.name,
    originalPercentage,
    newPercentage,
    change: newPercentage - originalPercentage,
  };
};

export const getNextNClasses = (
  timetable: TimetableEntry[],
  n: number
): { subjectId: string; day: string }[] => {
  const classes: { subjectId: string; day: string }[] = [];
  
  for (const entry of timetable) {
    for (const subjectId of entry.periods) {
      if (subjectId && classes.length < n) {
        classes.push({ subjectId, day: entry.day });
      }
    }
  }
  
  return classes;
};

export const simulateNextNAbsences = (
  subjects: Subject[],
  timetable: TimetableEntry[],
  n: number
): WhatIfResult[] => {
  const nextClasses = getNextNClasses(timetable, n);
  const absenceCount: Record<string, number> = {};
  
  nextClasses.forEach(({ subjectId }) => {
    absenceCount[subjectId] = (absenceCount[subjectId] || 0) + 1;
  });
  
  return Object.entries(absenceCount).map(([subjectId, count]) => 
    simulateAbsence(subjects, subjectId, count)
  );
};
