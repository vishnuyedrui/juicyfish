export interface Assessment {
  name: string;
  weight: number;
  gradePoint: number | null;
  // For "I" grade, store the actual marks entered
  marks?: number | null;
  // Store the selected grade label (e.g., "I", "L/AB", "Ab/R")
  gradeLabel?: string | null;
}

export interface Course {
  id: string;
  name: string;
  credits: number;
  assessments: Assessment[];
  wgp: number | null;
  letterGrade: string | null;
  finalGradePoint: number | null;
  hasLab?: boolean;
  labMarks?: number | null;
}

export interface GradeMapping {
  min: number;
  max: number;
  letter: string;
  point: number;
  color: string;
}

export const GRADE_MAPPINGS: GradeMapping[] = [
  { min: 9.01, max: 10, letter: 'O', point: 10, color: 'grade-o' },
  { min: 8.01, max: 9.0, letter: 'A+', point: 9, color: 'grade-a-plus' },
  { min: 7.01, max: 8.0, letter: 'A', point: 8, color: 'grade-a' },
  { min: 6.01, max: 7.0, letter: 'B+', point: 7, color: 'grade-b-plus' },
  { min: 5.01, max: 6.0, letter: 'B', point: 6, color: 'grade-b' },
  { min: 4.01, max: 5.0, letter: 'C', point: 5, color: 'grade-c' },
  { min: 4.0, max: 4.0, letter: 'P', point: 4, color: 'grade-p' },
  { min: 0, max: 3.99, letter: 'F', point: 0, color: 'grade-f' },
];

export const DEFAULT_ASSESSMENTS: Assessment[] = [
  { name: 'Sessional 1', weight: 0.30, gradePoint: null, marks: null, gradeLabel: null },
  { name: 'Sessional 2', weight: 0.45, gradePoint: null, marks: null, gradeLabel: null },
  { name: 'Learning Engagement', weight: 0.25, gradePoint: null, marks: null, gradeLabel: null },
];

export function createNewCourse(): Course {
  return {
    id: crypto.randomUUID(),
    name: '',
    credits: 3,
    assessments: DEFAULT_ASSESSMENTS.map(a => ({ ...a, marks: null, gradeLabel: null })),
    wgp: null,
    letterGrade: null,
    finalGradePoint: null,
  };
}

// Grades that require marks input: P, I, Ab/R
export const MARKS_REQUIRED_GRADES = ['P', 'I', 'Ab/R'];

// Check if a sessional requires marks input
export function requiresMarksInput(gradeLabel: string | null): boolean {
  return gradeLabel !== null && MARKS_REQUIRED_GRADES.includes(gradeLabel);
}

// Check if either sessional has a grade that requires marks
export function sessionalsNeedMarks(assessments: Assessment[]): boolean {
  const sessional1 = assessments.find(a => a.name === 'Sessional 1');
  const sessional2 = assessments.find(a => a.name === 'Sessional 2');
  
  return (
    requiresMarksInput(sessional1?.gradeLabel ?? null) ||
    requiresMarksInput(sessional2?.gradeLabel ?? null)
  );
}

// Check if both sessionals have marks entered (when marks are required)
export function bothSessionalsHaveMarks(assessments: Assessment[]): boolean {
  const sessional1 = assessments.find(a => a.name === 'Sessional 1');
  const sessional2 = assessments.find(a => a.name === 'Sessional 2');
  
  // If either requires marks input, both must have marks
  const s1NeedsMarks = requiresMarksInput(sessional1?.gradeLabel ?? null);
  const s2NeedsMarks = requiresMarksInput(sessional2?.gradeLabel ?? null);
  
  if (s1NeedsMarks || s2NeedsMarks) {
    return (sessional1?.marks !== null && sessional1?.marks !== undefined) &&
           (sessional2?.marks !== null && sessional2?.marks !== undefined);
  }
  
  return true; // No marks required
}

// Calculate total sessional marks
export function calculateTotalSessionalMarks(assessments: Assessment[]): number {
  const sessional1 = assessments.find(a => a.name === 'Sessional 1');
  const sessional2 = assessments.find(a => a.name === 'Sessional 2');
  
  let total = 0;
  if (sessional1?.marks !== null && sessional1?.marks !== undefined) {
    total += sessional1.marks;
  }
  if (sessional2?.marks !== null && sessional2?.marks !== undefined) {
    total += sessional2.marks;
  }
  
  return total;
}

// CRITICAL GRADING LOGIC - Marks-based final grade determination
export function determineFinalGrade(assessments: Assessment[]): { 
  letterGrade: string | null; 
  gradePoint: number | null;
  reason: string;
  isSpecialCase: boolean;
} {
  const le = assessments.find(a => a.name === 'Learning Engagement');
  
  // Rule 7: If LE = L/AB → Final Grade = F immediately
  if (le?.gradeLabel === 'L/AB') {
    return { letterGrade: 'F', gradePoint: 0, reason: 'Learning Engagement is L/AB', isSpecialCase: true };
  }
  
  // Check if sessionals need marks input
  if (sessionalsNeedMarks(assessments)) {
    // Rule 1: Both sessionals must have marks if either has P, I, or Ab/R
    if (!bothSessionalsHaveMarks(assessments)) {
      // Waiting for marks input
      return { letterGrade: null, gradePoint: null, reason: 'Enter marks for both sessionals', isSpecialCase: false };
    }
    
    // Rule 2: Calculate total sessional marks
    const totalMarks = calculateTotalSessionalMarks(assessments);
    
    // Rule 4: If totalSessionalMarks < 25 → Final Grade = F
    if (totalMarks < 25) {
      return { letterGrade: 'F', gradePoint: 0, reason: 'Total sessional marks < 25', isSpecialCase: true };
    }
    
    // Rule 3: If totalSessionalMarks >= 25 → I grade with GP = 4
    return { letterGrade: 'I', gradePoint: 4, reason: 'Total sessional marks ≥ 25', isSpecialCase: true };
  }
  
  // No special case - use normal WGP calculation
  return { letterGrade: null, gradePoint: null, reason: '', isSpecialCase: false };
}

// DEPRECATED - Keep for backward compatibility but use determineFinalGrade instead
export function checkForIGrade(assessments: Assessment[]): boolean {
  const result = determineFinalGrade(assessments);
  return result.letterGrade === 'I';
}

// DEPRECATED - Keep for backward compatibility but use determineFinalGrade instead  
export function checkForFGrade(assessments: Assessment[]): { isF: boolean; reason: string } {
  const result = determineFinalGrade(assessments);
  return { isF: result.letterGrade === 'F', reason: result.reason };
}

export function calculateWGP(assessments: Assessment[]): number | null {
  // Rule 6: WGP calculation must never break - all grade points must be valid
  const allFilled = assessments.every(
    a => a.gradePoint !== null && a.gradePoint >= 0
  );
  if (!allFilled) return null;

  const rawWGP = assessments.reduce(
    (sum, a) => sum + (a.gradePoint! * a.weight),
    0
  );

  // CEIL THE WGP
  return Math.min(10, Math.ceil(rawWGP));
}

// Calculate WGP with special grade handling - ensures valid grade points for calculation
export function calculateWGPWithSpecialGrades(assessments: Assessment[]): { wgp: number; effectiveAssessments: Assessment[] } | null {
  // For special cases, we need to ensure all assessments have valid grade points
  const effectiveAssessments = assessments.map(a => {
    // If gradePoint is already set and valid, use it
    if (a.gradePoint !== null && a.gradePoint >= 0) {
      return a;
    }
    
    // For marks-based grades (P, I, Ab/R), use 4 as the grade point for WGP calculation
    // This is the "I" grade point value
    if (requiresMarksInput(a.gradeLabel ?? null)) {
      return { ...a, gradePoint: 4 };
    }
    
    return a;
  });
  
  const allFilled = effectiveAssessments.every(
    a => a.gradePoint !== null && a.gradePoint >= 0
  );
  
  if (!allFilled) return null;
  
  const rawWGP = effectiveAssessments.reduce(
    (sum, a) => sum + (a.gradePoint! * a.weight),
    0
  );
  
  return { wgp: Math.min(10, Math.ceil(rawWGP)), effectiveAssessments };
}


export function getGradeFromWGP(wgp: number): { letter: string; point: number; color: string } {
  if (wgp > 9.0) return { letter: 'O', point: 10, color: 'grade-o' };
  if (wgp > 8.0) return { letter: 'A+', point: 9, color: 'grade-a-plus' };
  if (wgp > 7.0) return { letter: 'A', point: 8, color: 'grade-a' };
  if (wgp > 6.0) return { letter: 'B+', point: 7, color: 'grade-b-plus' };
  if (wgp > 5.0) return { letter: 'B', point: 6, color: 'grade-b' };
  if (wgp > 4.0) return { letter: 'C', point: 5, color: 'grade-c' };
  if (wgp === 4.0) return { letter: 'P', point: 4, color: 'grade-p' };
  return { letter: 'F', point: 0, color: 'grade-f' };
}

export function calculateSGPA(courses: Course[]): { sgpa: number; totalCredits: number; totalGradePoints: number } | null {
  const validCourses = courses.filter(c => c.finalGradePoint !== null && c.credits > 0);
  if (validCourses.length === 0) return null;
  
  const totalCredits = validCourses.reduce((sum, c) => sum + c.credits, 0);
  const totalGradePoints = validCourses.reduce((sum, c) => sum + (c.credits * c.finalGradePoint!), 0);
  const sgpa = totalGradePoints / totalCredits;
  
  return { sgpa, totalCredits, totalGradePoints };
}

export function calculateCGPA(
  currentSGPA: number,
  currentCredits: number,
  previousCGPA: number,
  previousCredits: number
): { cgpa: number; totalCredits: number; totalGradePoints: number } {
  const previousGradePoints = previousCGPA * previousCredits;
  const currentGradePoints = currentSGPA * currentCredits;
  const totalCredits = previousCredits + currentCredits;
  const totalGradePoints = previousGradePoints + currentGradePoints;
  const cgpa = totalGradePoints / totalCredits;
  
  return { cgpa, totalCredits, totalGradePoints };
}

export function calculateFinalGradePointWithLab(
  wgp: number,
  labMarks: number
): number {
  const safeWGP = Math.min(10, Math.max(0, wgp));
  const safeLabMarks = Math.min(100, Math.max(0, labMarks));

  const theoryContribution = (safeWGP / 10) * 100 * 0.70;
  const labContribution = safeLabMarks * 0.30;

  const finalPercentage = theoryContribution + labContribution;
  return parseFloat((finalPercentage / 10).toFixed(2));
}
