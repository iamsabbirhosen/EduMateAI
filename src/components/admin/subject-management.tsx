'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, 
  Trash2, 
  Edit, 
  BookOpen,
  Save,
  X
} from 'lucide-react';
import { useCurriculumContext } from '@/context/CurriculumContext';

interface Subject {
  id: string;
  name: string;
  name_bn: string;
  classId: number;
}

export function SubjectManagement() {
  const { curriculum, refetch } = useCurriculumContext();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newSubject, setNewSubject] = useState({
    classId: '',
    name: '',
    name_bn: ''
  });

  useEffect(() => {
    const subjectData: Subject[] = [];
    curriculum.forEach(cls => {
      cls.subjects.forEach(subject => {
        subjectData.push({
          id: subject.id,
          name: subject.name,
          name_bn: subject.name_bn,
          classId: cls.id
        });
      });
    });
    setSubjects(subjectData);
  }, [curriculum]);

  const handleAddSubject = async () => {
    try {
      const response = await fetch('/api/admin/subjects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          classId: parseInt(newSubject.classId),
          name: newSubject.name,
          name_bn: newSubject.name_bn
        }),
      });

      if (response.ok) {
        setNewSubject({ classId: '', name: '', name_bn: '' });
        setIsAdding(false);
        await refetch();
      }
    } catch (error) {
      console.error('Error adding subject:', error);
    }
  };

  const handleDeleteSubject = async (subjectId: string, classId: number) => {
    if (confirm('Are you sure you want to delete this subject? This will remove all chapters and topics.')) {
      try {
        const response = await fetch(`/api/admin/subjects/${subjectId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ classId }),
        });

        if (response.ok) {
          await refetch();
        }
      } catch (error) {
        console.error('Error deleting subject:', error);
      }
    }
  };

  const getClassName = (classId: number) => {
    const cls = curriculum.find(c => c.id === classId);
    return cls ? cls.name : `Class ${classId}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <BookOpen className="mr-2 h-5 w-5" />
            Subject Management
          </div>
          <Button 
            onClick={() => setIsAdding(true)} 
            disabled={isAdding || curriculum.length === 0}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Subject
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {curriculum.length === 0 && (
          <div className="text-center py-8 text-yellow-600 bg-yellow-50 rounded-lg">
            Please create at least one class before adding subjects.
          </div>
        )}

        {isAdding && curriculum.length > 0 && (
          <div className="p-4 border border-dashed border-gray-300 rounded-lg space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="subjectClass">Select Class</Label>
                <Select value={newSubject.classId} onValueChange={(value) => setNewSubject({ ...newSubject, classId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose class" />
                  </SelectTrigger>
                  <SelectContent>
                    {curriculum.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id.toString()}>
                        {cls.name} ({cls.name_bn})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="subjectName">English Name</Label>
                <Input
                  id="subjectName"
                  placeholder="e.g., Chemistry"
                  value={newSubject.name}
                  onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="subjectNameBn">Bengali Name</Label>
                <Input
                  id="subjectNameBn"
                  placeholder="e.g., রসায়ন"
                  value={newSubject.name_bn}
                  onChange={(e) => setNewSubject({ ...newSubject, name_bn: e.target.value })}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddSubject} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save Subject
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsAdding(false);
                  setNewSubject({ classId: '', name: '', name_bn: '' });
                }}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {subjects.map((subject) => (
            <div key={`${subject.classId}-${subject.id}`} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <Badge variant="secondary">{getClassName(subject.classId)}</Badge>
                <div>
                  <div className="font-medium">{subject.name}</div>
                  <div className="text-sm text-gray-600">{subject.name_bn}</div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingId(`${subject.classId}-${subject.id}`)}
                  className="flex items-center gap-1"
                >
                  <Edit className="h-3 w-3" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteSubject(subject.id, subject.classId)}
                  className="flex items-center gap-1"
                >
                  <Trash2 className="h-3 w-3" />
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>

        {subjects.length === 0 && curriculum.length > 0 && (
          <div className="text-center py-8 text-gray-500">
            No subjects found. Add your first subject to get started.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
