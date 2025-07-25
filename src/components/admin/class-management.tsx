'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Trash2, 
  Edit, 
  GraduationCap,
  Save,
  X
} from 'lucide-react';
import { useCurriculumContext } from '@/context/CurriculumContext';

interface Class {
  id: number;
  name: string;
  name_bn: string;
}

export function ClassManagement() {
  const { curriculum, refetch } = useCurriculumContext();
  const [classes, setClasses] = useState<Class[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newClass, setNewClass] = useState({
    id: '',
    name: '',
    name_bn: ''
  });

  useEffect(() => {
    const classData = curriculum.map(c => ({
      id: c.id,
      name: c.name,
      name_bn: c.name_bn
    }));
    setClasses(classData);
  }, [curriculum]);

  const handleAddClass = async () => {
    try {
      const response = await fetch('/api/admin/classes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: parseInt(newClass.id),
          name: newClass.name,
          name_bn: newClass.name_bn
        }),
      });

      if (response.ok) {
        setNewClass({ id: '', name: '', name_bn: '' });
        setIsAdding(false);
        await refetch();
      }
    } catch (error) {
      console.error('Error adding class:', error);
    }
  };

  const handleDeleteClass = async (classId: number) => {
    if (confirm('Are you sure you want to delete this class? This will remove all subjects, chapters, and topics.')) {
      try {
        const response = await fetch(`/api/admin/classes/${classId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          await refetch();
        }
      } catch (error) {
        console.error('Error deleting class:', error);
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <GraduationCap className="mr-2 h-5 w-5" />
            Class Management
          </div>
          <Button 
            onClick={() => setIsAdding(true)} 
            disabled={isAdding}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Class
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isAdding && (
          <div className="p-4 border border-dashed border-gray-300 rounded-lg space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="classId">Class Number</Label>
                <Input
                  id="classId"
                  type="number"
                  placeholder="e.g., 10"
                  value={newClass.id}
                  onChange={(e) => setNewClass({ ...newClass, id: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="className">English Name</Label>
                <Input
                  id="className"
                  placeholder="e.g., Class 10"
                  value={newClass.name}
                  onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="classNameBn">Bengali Name</Label>
                <Input
                  id="classNameBn"
                  placeholder="e.g., দশম শ্রেণী"
                  value={newClass.name_bn}
                  onChange={(e) => setNewClass({ ...newClass, name_bn: e.target.value })}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddClass} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save Class
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsAdding(false);
                  setNewClass({ id: '', name: '', name_bn: '' });
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
          {classes.map((cls) => (
            <div key={cls.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <Badge variant="secondary">Class {cls.id}</Badge>
                <div>
                  <div className="font-medium">{cls.name}</div>
                  <div className="text-sm text-gray-600">{cls.name_bn}</div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingId(cls.id)}
                  className="flex items-center gap-1"
                >
                  <Edit className="h-3 w-3" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteClass(cls.id)}
                  className="flex items-center gap-1"
                >
                  <Trash2 className="h-3 w-3" />
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>

        {classes.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No classes found. Add your first class to get started.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
