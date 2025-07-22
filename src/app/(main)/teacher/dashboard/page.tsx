'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { School } from 'lucide-react';

export default function TeacherDashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user?.role !== 'teacher') {
      router.replace('/dashboard');
    }
  }, [user, loading, router]);

  if (loading || user?.role !== 'teacher') {
    return <div className="flex h-full items-center justify-center">Loading...</div>;
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold font-headline mb-6">Teacher Dashboard</h1>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <School className="h-6 w-6 text-primary" />
            Welcome, {user.name}!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            This is a placeholder for the teacher dashboard. Future features will include:
          </p>
          <ul className="list-disc list-inside mt-4 space-y-2">
            <li>Viewing student progress</li>
            <li>Assigning tasks and quizzes</li>
            <li>Managing curriculum content</li>
            <li>Communication tools</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
