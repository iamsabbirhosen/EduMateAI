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
  FolderOpen,
  Save,
  X
} from 'lucide-react';
import { useCurriculumContext } from '@/context/CurriculumContext';

interface Chapter {
  id: string;
  name: string;
  name_bn: string;
  classId: number;
  subjectId: string;
}

export function ChapterManagement() {
  const { curriculum, refetch } = useCurriculumContext();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newChapter, setNewChapter] = useState({
    classId: '',
    subjectId: '',
    name: '',
    name_bn: ''
  });

  useEffect(() => {
    const chapterData: Chapter[] = [];
    curriculum.forEach(cls => {
      cls.subjects.forEach(subject => {
        subject.chapters.forEach(chapter => {
          chapterData.push({
            id: chapter.id,
            name: chapter.name,
            name_bn: chapter.name_bn,
            classId: cls.id,
            subjectId: subject.id
          });
        });
      });
    });
    setChapters(chapterData);
  }, [curriculum]);

  const handleAddChapter = async () => {
    try {
      const response = await fetch('/api/admin/chapters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          classId: parseInt(newChapter.classId),
          subjectId: newChapter.subjectId,
          name: newChapter.name,
          name_bn: newChapter.name_bn
        }),
      });

      if (response.ok) {
        setNewChapter({ classId: '', subjectId: '', name: '', name_bn: '' });
        setIsAdding(false);
        await refetch();
      }
    } catch (error) {
      console.error('Error adding chapter:', error);
    }
  };

  const handleDeleteChapter = async (chapterId: string, classId: number, subjectId: string) => {
    if (confirm('Are you sure you want to delete this chapter? This will remove all topics.')) {
      try {
        const response = await fetch(`/api/admin/chapters/${chapterId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ classId, subjectId }),
        });

        if (response.ok) {
          await refetch();
        }
      } catch (error) {
        console.error('Error deleting chapter:', error);
      }
    }
  };

  const getClassAndSubjectName = (classId: number, subjectId: string) => {
    const cls = curriculum.find(c => c.id === classId);
    const subject = cls?.subjects.find(s => s.id === subjectId);
    return {
      className: cls ? cls.name : `Class ${classId}`,
      subjectName: subject ? subject.name : subjectId
    };
  };

  const getSubjectsForClass = (classId: string) => {
    const cls = curriculum.find(c => c.id.toString() === classId);
    return cls ? cls.subjects : [];
  };

  const hasSubjects = curriculum.some(cls => cls.subjects.length > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <FolderOpen className="mr-2 h-5 w-5" />
            Chapter Management
          </div>
          <Button 
            onClick={() => setIsAdding(true)} 
            disabled={isAdding || !hasSubjects}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Chapter
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!hasSubjects && (
          <div className="text-center py-8 text-yellow-600 bg-yellow-50 rounded-lg">
            Please create at least one subject before adding chapters.
          </div>
        )}

        {isAdding && hasSubjects && (
          <div className="p-4 border border-dashed border-gray-300 rounded-lg space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="chapterClass">Select Class</Label>
                <Select value={newChapter.classId} onValueChange={(value) => {
                  setNewChapter({ ...newChapter, classId: value, subjectId: '' });
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose class" />
                  </SelectTrigger>
                  <SelectContent>
                    {curriculum.filter(cls => cls.subjects.length > 0).map((cls) => (
                      <SelectItem key={cls.id} value={cls.id.toString()}>
                        {cls.name} ({cls.name_bn})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="chapterSubject">Select Subject</Label>
                <Select 
                  value={newChapter.subjectId} 
                  onValueChange={(value) => setNewChapter({ ...newChapter, subjectId: value })}
                  disabled={!newChapter.classId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {getSubjectsForClass(newChapter.classId).map((subject) => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.name} ({subject.name_bn})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="chapterName">English Name</Label>
                <Input
                  id="chapterName"
                  placeholder="e.g., Organic Chemistry"
                  value={newChapter.name}
                  onChange={(e) => setNewChapter({ ...newChapter, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="chapterNameBn">Bengali Name</Label>
                <Input
                  id="chapterNameBn"
                  placeholder="e.g., জৈব রসায়ন"
                  value={newChapter.name_bn}
                  onChange={(e) => setNewChapter({ ...newChapter, name_bn: e.target.value })}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddChapter} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save Chapter
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsAdding(false);
                  setNewChapter({ classId: '', subjectId: '', name: '', name_bn: '' });
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
          {chapters.map((chapter) => {
            const { className, subjectName } = getClassAndSubjectName(chapter.classId, chapter.subjectId);
            return (
              <div key={`${chapter.classId}-${chapter.subjectId}-${chapter.id}`} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex flex-col gap-1">
                    <Badge variant="secondary">{className}</Badge>
                    <Badge variant="outline">{subjectName}</Badge>
                  </div>
                  <div>
                    <div className="font-medium">{chapter.name}</div>
                    <div className="text-sm text-gray-600">{chapter.name_bn}</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingId(`${chapter.classId}-${chapter.subjectId}-${chapter.id}`)}
                    className="flex items-center gap-1"
                  >
                    <Edit className="h-3 w-3" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteChapter(chapter.id, chapter.classId, chapter.subjectId)}
                    className="flex items-center gap-1"
                  >
                    <Trash2 className="h-3 w-3" />
                    Delete
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {chapters.length === 0 && hasSubjects && (
          <div className="text-center py-8 text-gray-500">
            No chapters found. Add your first chapter to get started.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
