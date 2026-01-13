import { useState } from 'react';
import { DbSubject } from '@/hooks/useAttendanceData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { BookOpen, Plus, Trash2, Edit2, Check, X, FlaskConical } from 'lucide-react';

interface SubjectManagerProps {
  subjects: DbSubject[];
  onAddSubject: (name: string, isLab: boolean, totalClasses: number, attendedClasses: number) => Promise<DbSubject | null>;
  onUpdateSubject: (id: string, name: string, isLab: boolean) => Promise<void>;
  onDeleteSubject: (id: string) => Promise<void>;
  getSubjectStats: (subjectId: string) => { total: number; attended: number; percentage: number };
}

export const SubjectManager = ({
  subjects,
  onAddSubject,
  onUpdateSubject,
  onDeleteSubject,
  getSubjectStats,
}: SubjectManagerProps) => {
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectIsLab, setNewSubjectIsLab] = useState(false);
  const [newTotalClasses, setNewTotalClasses] = useState('');
  const [newAttendedClasses, setNewAttendedClasses] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editIsLab, setEditIsLab] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = async () => {
    if (!newSubjectName.trim()) return;
    
    const total = parseInt(newTotalClasses) || 0;
    const attended = parseInt(newAttendedClasses) || 0;
    
    if (attended > total) {
      return;
    }
    
    setIsAdding(true);
    await onAddSubject(newSubjectName.trim(), newSubjectIsLab, total, attended);
    setNewSubjectName('');
    setNewSubjectIsLab(false);
    setNewTotalClasses('');
    setNewAttendedClasses('');
    setIsAdding(false);
  };

  const startEditing = (subject: DbSubject) => {
    setEditingId(subject.id);
    setEditName(subject.name);
    setEditIsLab(subject.is_lab);
  };

  const handleUpdate = async () => {
    if (!editingId || !editName.trim()) return;
    await onUpdateSubject(editingId, editName.trim(), editIsLab);
    setEditingId(null);
  };

  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 75) return 'text-green-600 bg-green-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <BookOpen className="w-5 h-5 text-primary" />
          Subjects
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add new subject */}
        <div className="space-y-3 p-4 border rounded-lg bg-muted/30">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1">
              <Label htmlFor="subject-name" className="text-xs text-muted-foreground mb-1 block">Subject Name</Label>
              <Input
                id="subject-name"
                placeholder="e.g., Mathematics"
                value={newSubjectName}
                onChange={(e) => setNewSubjectName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              />
            </div>
            <div className="flex items-end gap-2">
              <div className="flex items-center gap-2 h-10">
                <Checkbox
                  id="new-is-lab"
                  checked={newSubjectIsLab}
                  onCheckedChange={(checked) => setNewSubjectIsLab(checked === true)}
                />
                <Label htmlFor="new-is-lab" className="text-sm flex items-center gap-1 cursor-pointer">
                  <FlaskConical className="w-3 h-3" />
                  Lab
                </Label>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1">
              <Label htmlFor="total-classes" className="text-xs text-muted-foreground mb-1 block">Total Classes Conducted</Label>
              <Input
                id="total-classes"
                type="number"
                min="0"
                placeholder="e.g., 30"
                value={newTotalClasses}
                onChange={(e) => setNewTotalClasses(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="attended-classes" className="text-xs text-muted-foreground mb-1 block">Classes Attended</Label>
              <Input
                id="attended-classes"
                type="number"
                min="0"
                max={newTotalClasses || undefined}
                placeholder="e.g., 25"
                value={newAttendedClasses}
                onChange={(e) => setNewAttendedClasses(e.target.value)}
              />
            </div>
          </div>
          
          {newAttendedClasses && newTotalClasses && parseInt(newAttendedClasses) > parseInt(newTotalClasses) && (
            <p className="text-xs text-red-500">Attended classes cannot exceed total classes</p>
          )}
          
          <Button 
            onClick={handleAdd} 
            size="sm" 
            disabled={!newSubjectName.trim() || isAdding || (parseInt(newAttendedClasses) > parseInt(newTotalClasses))}
            className="w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Subject
          </Button>
        </div>

        {/* Subject list */}
        {subjects.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No subjects added yet. Add your first subject above.
          </p>
        ) : (
          <div className="space-y-2">
            {subjects.map((subject) => {
              const stats = getSubjectStats(subject.id);
              return (
                <div
                  key={subject.id}
                  className="flex flex-col sm:flex-row sm:items-center gap-2 p-3 bg-muted/50 rounded-lg"
                >
                  {editingId === subject.id ? (
                    <div className="flex flex-col sm:flex-row gap-2 flex-1">
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="flex-1"
                        autoFocus
                      />
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id={`edit-lab-${subject.id}`}
                          checked={editIsLab}
                          onCheckedChange={(checked) => setEditIsLab(checked === true)}
                        />
                        <Label htmlFor={`edit-lab-${subject.id}`} className="text-sm">Lab</Label>
                        <Button size="icon" variant="ghost" onClick={handleUpdate}>
                          <Check className="w-4 h-4 text-green-600" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => setEditingId(null)}>
                          <X className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-2">
                        <span className="font-medium">{subject.name}</span>
                        {subject.is_lab && (
                          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded flex items-center gap-1 w-fit">
                            <FlaskConical className="w-3 h-3" />
                            Lab
                          </span>
                        )}
                        {stats.total > 0 && (
                          <span className={`text-xs px-2 py-0.5 rounded ${getAttendanceColor(stats.percentage)}`}>
                            {stats.attended}/{stats.total} ({stats.percentage.toFixed(2)}%)
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Button size="icon" variant="ghost" onClick={() => startEditing(subject)}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => onDeleteSubject(subject.id)}>
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
