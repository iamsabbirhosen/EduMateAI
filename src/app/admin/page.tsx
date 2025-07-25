'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/hooks/use-translation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ClassManagement } from '@/components/admin/class-management';
import { SubjectManagement } from '@/components/admin/subject-management';
import { ChapterManagement } from '@/components/admin/chapter-management';
import { TopicManagement } from '@/components/admin/topic-management';
import { CurriculumOverview } from '@/components/admin/curriculum-overview';
import { 
  GraduationCap, 
  BookOpen, 
  FileText, 
  FolderOpen, 
  Settings,
  BarChart3,
  LogOut,
  Shield
} from 'lucide-react';

export default function AdminPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  // Hardcoded authentication check
  useEffect(() => {
    const authStatus = localStorage.getItem('admin-authenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    } else {
      // Auto-fill credentials for easy access
      setUsername('admin');
      setPassword('EduMateAdmin2024!');
    }
  }, []);

  const handleAutoLogin = () => {
    console.log('Auto login triggered');
    setUsername('admin');
    setPassword('EduMateAdmin2024!');
    localStorage.setItem('admin-authenticated', 'true');
    setError('');
    
    // Force state update with a small delay to ensure localStorage is set
    setTimeout(() => {
      console.log('Setting authenticated to true');
      setIsAuthenticated(true);
    }, 50);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login submitted with:', username, password);
    
    // Hardcoded credentials
    if (username === 'admin' && password === 'EduMateAdmin2024!') {
      console.log('Credentials match, logging in...');
      localStorage.setItem('admin-authenticated', 'true');
      setError('');
      
      // Force immediate UI update
      setTimeout(() => {
        console.log('Setting authenticated to true');
        setIsAuthenticated(true);
      }, 50);
    } else {
      console.log('Invalid credentials');
      setError('Invalid credentials. Use admin / EduMateAdmin2024!');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin-authenticated');
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
  };

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <Card className="w-full max-w-md mx-4">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <CardTitle className="text-2xl font-bold">Admin Access</CardTitle>
            <p className="text-sm text-muted-foreground">
              Enter credentials to access the admin dashboard
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded">
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                />
              </div>
              
              <Button type="submit" className="w-full">
                Access Dashboard
              </Button>
              
              <Button 
                type="button" 
                onClick={handleAutoLogin}
                variant="outline" 
                className="w-full mt-2"
              >
                Quick Access (Auto Login)
              </Button>
            </form>
            
            <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
              <p>Credentials (Auto-filled):</p>
              <p className="font-mono text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded mt-2">
                Username: admin<br />
                Password: EduMateAdmin2024!
              </p>
              <p className="mt-2 text-xs text-blue-600">
                Click "Quick Access" for instant login!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-headline flex items-center">
            <Settings className="mr-3 h-8 w-8 text-blue-600" />
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage classes, subjects, chapters, and topics in Bengali and English
          </p>
        </div>
        <Button 
          onClick={handleLogout}
          variant="outline"
          className="flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="classes" className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            Classes
          </TabsTrigger>
          <TabsTrigger value="subjects" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Subjects
          </TabsTrigger>
          <TabsTrigger value="chapters" className="flex items-center gap-2">
            <FolderOpen className="h-4 w-4" />
            Chapters
          </TabsTrigger>
          <TabsTrigger value="topics" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Topics
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <CurriculumOverview />
        </TabsContent>

        <TabsContent value="classes" className="space-y-6">
          <ClassManagement />
        </TabsContent>

        <TabsContent value="subjects" className="space-y-6">
          <SubjectManagement />
        </TabsContent>

        <TabsContent value="chapters" className="space-y-6">
          <ChapterManagement />
        </TabsContent>

        <TabsContent value="topics" className="space-y-6">
          <TopicManagement />
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h3 className="font-semibold text-yellow-800">Bengali Support</h3>
                  <p className="text-yellow-700">
                    All content can be created in Bengali. The system automatically converts 
                    Bengali names to URL-safe English IDs for folder structure.
                  </p>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="font-semibold text-blue-800">Auto-Sync</h3>
                  <p className="text-blue-700">
                    Changes made through this admin panel automatically create the proper 
                    folder structure and update the curriculum in real-time.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
