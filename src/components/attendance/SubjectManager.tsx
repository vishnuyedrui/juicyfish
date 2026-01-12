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
  onAddSubject: (name: string, isLab: boolean) => Promise<DbSubject | null>;
  onUpdateSubject: (id: string, name: string, isLab: boolean) => Promise<void>;
  onDeleteSubject: (id: string) => Promise<void>;
}

export const SubjectManager = ({
  subjects,
  onAddSubject,
  onUpdateSubject,
  onDeleteSubject,
}: SubjectManagerProps) => {
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectIsLab, setNewSubjectIsLab] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editIsLab, setEditIsLab] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = async () => {
    if (!newSubjectName.trim()) return;
    setIsAdding(true);
    await onAddSubject(newSubjectName.trim(), newSubjectIsLab);
    setNewSubjectName('');
    setNewSubjectIsLab(false);
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
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1">
            <Input
              placeholder="Subject name (e.g., Mathematics)"
              value={newSubjectName}
              onChange={(e) => setNewSubjectName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Checkbox
                id="new-is-lab"
                checked={newSubjectIsLab}
                onCheckedChange={(checked) => setNewSubjectIsLab(checked === true)}
              />
              <Label htmlFor="new-is-lab" className="text-sm flex items-center gap-1">
                <FlaskConical className="w-3 h-3" />
                Lab
              </Label>
            </div>
            <Button onClick={handleAdd} size="sm" disabled={!newSubjectName.trim() || isAdding}>
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </div>
        </div>

        {/* Subject list */}
        {subjects.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No subjects added yet. Add your first subject above.
          </p>
        ) : (
          <div className="space-y-2">
            {subjects.map((subject) => (
              <div
                key={subject.id}
                className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg"
              >
                {editingId === subject.id ? (
                  <>
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
                    </div>
                    <Button size="icon" variant="ghost" onClick={handleUpdate}>
                      <Check className="w-4 h-4 text-green-600" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => setEditingId(null)}>
                      <X className="w-4 h-4 text-red-600" />
                    </Button>
                  </>
                ) : (
                  <>
                    <span className="flex-1 font-medium">{subject.name}</span>
                    {subject.is_lab && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded flex items-center gap-1">
                        <FlaskConical className="w-3 h-3" />
                        Lab
                      </span>
                    )}
                    <Button size="icon" variant="ghost" onClick={() => startEditing(subject)}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => onDeleteSubject(subject.id)}>
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
