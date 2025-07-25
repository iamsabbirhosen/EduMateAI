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
  FileText,
  Save,
  X,
  Upload
} from 'lucide-react';
import { useCurriculumContext } from '@/context/CurriculumContext';

interface Topic {
  id: string;
  name: string;
  name_bn: string;
  classId: number;
  subjectId: string;
  chapterId: string;
  pdfUrl?: string;
}

export function TopicManagement() {
  const { curriculum, refetch } = useCurriculumContext();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTopic, setNewTopic] = useState({
    classId: '',
    subjectId: '',
    chapterId: '',
    name: '',
    name_bn: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    const topicData: Topic[] = [];
    curriculum.forEach(cls => {
      cls.subjects.forEach(subject => {
        subject.chapters.forEach(chapter => {
          chapter.topics.forEach(topic => {
            topicData.push({
              id: topic.id,
              name: topic.name,
              name_bn: topic.name_bn,
              classId: cls.id,
              subjectId: subject.id,
              chapterId: chapter.id,
              pdfUrl: topic.pdfUrl
            });
          });
        });
      });
    });
    setTopics(topicData);
  }, [curriculum]);

  const handleAddTopic = async () => {
    console.log('Adding topic:', newTopic);
    console.log('Selected file:', selectedFile);
    
    try {
      const formData = new FormData();
      formData.append('classId', newTopic.classId);
      formData.append('subjectId', newTopic.subjectId);
      formData.append('chapterId', newTopic.chapterId);
      formData.append('name', newTopic.name);
      formData.append('name_bn', newTopic.name_bn);
      
      if (selectedFile) {
        formData.append('pdf', selectedFile);
      }

      console.log('Sending request to /api/admin/topics');
      const response = await fetch('/api/admin/topics', {
        method: 'POST',
        body: formData,
      });

      console.log('Response status:', response.status);
      const responseData = await response.json();
      console.log('Response data:', responseData);

      if (response.ok) {
        console.log('Topic created successfully');
        setNewTopic({ classId: '', subjectId: '', chapterId: '', name: '', name_bn: '' });
        setSelectedFile(null);
        setIsAdding(false);
        await refetch();
      } else {
        console.error('Error response:', responseData);
        alert(`Error: ${responseData.error || 'Failed to create topic'}`);
      }
    } catch (error) {
      console.error('Error adding topic:', error);
      alert(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleDeleteTopic = async (topicId: string, classId: number, subjectId: string, chapterId: string) => {
    if (confirm('Are you sure you want to delete this topic and its PDF file?')) {
      try {
        const response = await fetch(`/api/admin/topics/${topicId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ classId, subjectId, chapterId }),
        });

        if (response.ok) {
          await refetch();
        }
      } catch (error) {
        console.error('Error deleting topic:', error);
      }
    }
  };

  const getFullPath = (classId: number, subjectId: string, chapterId: string) => {
    const cls = curriculum.find(c => c.id === classId);
    const subject = cls?.subjects.find(s => s.id === subjectId);
    const chapter = subject?.chapters.find(ch => ch.id === chapterId);
    return {
      className: cls ? cls.name : `Class ${classId}`,
      subjectName: subject ? subject.name : subjectId,
      chapterName: chapter ? chapter.name : chapterId
    };
  };

  const getSubjectsForClass = (classId: string) => {
    const cls = curriculum.find(c => c.id.toString() === classId);
    return cls ? cls.subjects : [];
  };

  const getChaptersForSubject = (classId: string, subjectId: string) => {
    const cls = curriculum.find(c => c.id.toString() === classId);
    const subject = cls?.subjects.find(s => s.id === subjectId);
    return subject ? subject.chapters : [];
  };

  const hasChapters = curriculum.some(cls => 
    cls.subjects.some(subject => subject.chapters.length > 0)
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            Topic Management
          </div>
          <Button 
            onClick={() => setIsAdding(true)} 
            disabled={isAdding || !hasChapters}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Topic
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!hasChapters && (
          <div className="text-center py-8 text-yellow-600 bg-yellow-50 rounded-lg">
            Please create at least one chapter before adding topics.
          </div>
        )}

        {isAdding && hasChapters && (
          <div className="p-4 border border-dashed border-gray-300 rounded-lg space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="topicClass">Select Class</Label>
                <Select value={newTopic.classId} onValueChange={(value) => {
                  setNewTopic({ ...newTopic, classId: value, subjectId: '', chapterId: '' });
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose class" />
                  </SelectTrigger>
                  <SelectContent>
                    {curriculum.filter(cls => cls.subjects.some(s => s.chapters.length > 0)).map((cls) => (
                      <SelectItem key={cls.id} value={cls.id.toString()}>
                        {cls.name} ({cls.name_bn})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="topicSubject">Select Subject</Label>
                <Select 
                  value={newTopic.subjectId} 
                  onValueChange={(value) => setNewTopic({ ...newTopic, subjectId: value, chapterId: '' })}
                  disabled={!newTopic.classId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {getSubjectsForClass(newTopic.classId).filter(s => s.chapters.length > 0).map((subject) => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.name} ({subject.name_bn})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="topicChapter">Select Chapter</Label>
                <Select 
                  value={newTopic.chapterId} 
                  onValueChange={(value) => setNewTopic({ ...newTopic, chapterId: value })}
                  disabled={!newTopic.subjectId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose chapter" />
                  </SelectTrigger>
                  <SelectContent>
                    {getChaptersForSubject(newTopic.classId, newTopic.subjectId).map((chapter) => (
                      <SelectItem key={chapter.id} value={chapter.id}>
                        {chapter.name} ({chapter.name_bn})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="topicName">English Name</Label>
                <Input
                  id="topicName"
                  placeholder="e.g., Acids and Bases"
                  value={newTopic.name}
                  onChange={(e) => setNewTopic({ ...newTopic, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="topicNameBn">Bengali Name</Label>
                <Input
                  id="topicNameBn"
                  placeholder="e.g., অ্যাসিড ও ক্ষার"
                  value={newTopic.name_bn}
                  onChange={(e) => setNewTopic({ ...newTopic, name_bn: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="pdfFile">PDF Material</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="pdfFile"
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                />
                {selectedFile && (
                  <Badge variant="secondary">{selectedFile.name}</Badge>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddTopic} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save Topic
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsAdding(false);
                  setNewTopic({ classId: '', subjectId: '', chapterId: '', name: '', name_bn: '' });
                  setSelectedFile(null);
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
          {topics.map((topic) => {
            const { className, subjectName, chapterName } = getFullPath(topic.classId, topic.subjectId, topic.chapterId);
            return (
              <div key={`${topic.classId}-${topic.subjectId}-${topic.chapterId}-${topic.id}`} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex flex-col gap-1">
                    <Badge variant="secondary">{className}</Badge>
                    <Badge variant="outline">{subjectName}</Badge>
                    <Badge variant="outline">{chapterName}</Badge>
                  </div>
                  <div>
                    <div className="font-medium">{topic.name}</div>
                    <div className="text-sm text-gray-600">{topic.name_bn}</div>
                    {topic.pdfUrl && (
                      <div className="text-xs text-green-600 flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        PDF Available
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingId(`${topic.classId}-${topic.subjectId}-${topic.chapterId}-${topic.id}`)}
                    className="flex items-center gap-1"
                  >
                    <Edit className="h-3 w-3" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteTopic(topic.id, topic.classId, topic.subjectId, topic.chapterId)}
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

        {topics.length === 0 && hasChapters && (
          <div className="text-center py-8 text-gray-500">
            No topics found. Add your first topic to get started.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
