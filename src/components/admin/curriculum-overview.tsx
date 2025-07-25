'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCurriculumContext } from '@/context/CurriculumContext';
import { 
  GraduationCap, 
  BookOpen, 
  FolderOpen, 
  FileText,
  BarChart3
} from 'lucide-react';

export function CurriculumOverview() {
  const { curriculum, loading, error } = useCurriculumContext();

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading curriculum overview...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-500">Error loading curriculum: {error}</div>
        </CardContent>
      </Card>
    );
  }

  const stats = {
    totalClasses: curriculum.length,
    totalSubjects: curriculum.reduce((acc, cls) => acc + cls.subjects.length, 0),
    totalChapters: curriculum.reduce((acc, cls) => 
      acc + cls.subjects.reduce((subAcc, subject) => subAcc + subject.chapters.length, 0), 0),
    totalTopics: curriculum.reduce((acc, cls) => 
      acc + cls.subjects.reduce((subAcc, subject) => 
        subAcc + subject.chapters.reduce((chAcc, chapter) => chAcc + chapter.topics.length, 0), 0), 0)
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <GraduationCap className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.totalClasses}</div>
                <div className="text-sm text-gray-600">Classes</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <BookOpen className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.totalSubjects}</div>
                <div className="text-sm text-gray-600">Subjects</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <FolderOpen className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.totalChapters}</div>
                <div className="text-sm text-gray-600">Chapters</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.totalTopics}</div>
                <div className="text-sm text-gray-600">Topics</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Curriculum Structure */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="mr-2 h-5 w-5" />
            Curriculum Structure
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {curriculum.map((cls) => (
              <div key={cls.id} className="border rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <Badge variant="secondary" className="px-3 py-1">
                    {cls.name}
                  </Badge>
                  <span className="text-sm text-gray-600">{cls.name_bn}</span>
                  <Badge variant="outline">
                    {cls.subjects.length} subjects
                  </Badge>
                </div>
                
                <div className="space-y-2 ml-4">
                  {cls.subjects.map((subject) => (
                    <div key={subject.id} className="border-l-2 border-gray-200 pl-4">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="font-medium">{subject.name}</span>
                        <span className="text-sm text-gray-600">({subject.name_bn})</span>
                        <Badge variant="outline">
                          {subject.chapters.length} chapters
                        </Badge>
                      </div>
                      
                      <div className="space-y-1 ml-4">
                        {subject.chapters.map((chapter) => (
                          <div key={chapter.id} className="flex items-center space-x-3">
                            <span className="text-sm">{chapter.name}</span>
                            <span className="text-xs text-gray-500">({chapter.name_bn})</span>
                            <Badge variant="outline">
                              {chapter.topics.length} topics
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {cls.subjects.length === 0 && (
                  <div className="text-center py-4 text-gray-500 italic">
                    No subjects added yet
                  </div>
                )}
              </div>
            ))}
          </div>

          {curriculum.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No classes found. Start by creating your first class.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-800">1. Create Classes</h4>
              <p className="text-blue-700 text-sm">
                Start by creating classes (e.g., Class 10, Class 11). You can use Bengali names.
              </p>
            </div>
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-semibold text-green-800">2. Add Subjects</h4>
              <p className="text-green-700 text-sm">
                Add subjects like Chemistry (রসায়ন), Physics (পদার্থবিজ্ঞান) for each class.
              </p>
            </div>
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-semibold text-yellow-800">3. Create Chapters</h4>
              <p className="text-yellow-700 text-sm">
                Organize content into chapters like Organic Chemistry (জৈব রসায়ন).
              </p>
            </div>
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <h4 className="font-semibold text-purple-800">4. Add Topics with PDFs</h4>
              <p className="text-purple-700 text-sm">
                Create topics and upload PDF materials. The system will automatically create folder structures.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
