import { Subject, createNewSubject } from "@/types/attendance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Trash2, BookOpen } from "lucide-react";

interface SubjectSetupProps {
  subjects: Subject[];
  onSubjectsChange: (subjects: Subject[]) => void;
}

export const SubjectSetup = ({ subjects, onSubjectsChange }: SubjectSetupProps) => {
  const updateSubject = (index: number, field: keyof Subject, value: string | number) => {
    const updated = [...subjects];
    updated[index] = { ...updated[index], [field]: value };
    onSubjectsChange(updated);
  };

  const addSubject = () => {
    onSubjectsChange([...subjects, createNewSubject()]);
  };

  const removeSubject = (index: number) => {
    if (subjects.length > 1) {
      onSubjectsChange(subjects.filter((_, i) => i !== index));
    }
  };

  const gradientColors = [
    'from-purple-500/10 to-pink-500/10 border-purple-200',
    'from-blue-500/10 to-cyan-500/10 border-blue-200',
    'from-green-500/10 to-emerald-500/10 border-green-200',
    'from-orange-500/10 to-yellow-500/10 border-orange-200',
    'from-rose-500/10 to-red-500/10 border-rose-200',
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <BookOpen className="w-5 h-5 text-primary" />
          Subject Setup
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {subjects.map((subject, index) => (
          <div
            key={subject.id}
            className={`p-3 sm:p-4 rounded-lg bg-gradient-to-r ${gradientColors[index % gradientColors.length]} border animate-fade-in`}
          >
            <div className="flex items-start justify-between gap-2 mb-3">
              <span className="text-xs font-medium text-muted-foreground">
                Subject {index + 1}
              </span>
              {subjects.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-destructive hover:text-destructive"
                  onClick={() => removeSubject(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-1">
                <Label className="text-xs">Subject Name</Label>
                <Input
                  placeholder="e.g., Mathematics"
                  value={subject.name}
                  onChange={(e) => updateSubject(index, 'name', e.target.value)}
                  className="mt-1 h-9 text-sm"
                />
              </div>
              <div>
                <Label className="text-xs">Total Classes</Label>
                <Input
                  type="number"
                  min={0}
                  placeholder="0"
                  value={subject.totalClasses || ''}
                  onChange={(e) => updateSubject(index, 'totalClasses', parseInt(e.target.value) || 0)}
                  className="mt-1 h-9 text-sm"
                />
              </div>
              <div>
                <Label className="text-xs">Classes Attended</Label>
                <Input
                  type="number"
                  min={0}
                  max={subject.totalClasses}
                  placeholder="0"
                  value={subject.attendedClasses || ''}
                  onChange={(e) => updateSubject(index, 'attendedClasses', Math.min(parseInt(e.target.value) || 0, subject.totalClasses))}
                  className="mt-1 h-9 text-sm"
                />
              </div>
            </div>
          </div>
        ))}
        
        <Button onClick={addSubject} variant="outline" className="w-full border-dashed">
          <PlusCircle className="w-4 h-4 mr-2" />
          Add Another Subject
        </Button>
      </CardContent>
    </Card>
  );
};
