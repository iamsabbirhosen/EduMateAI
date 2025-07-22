import { LoginForm } from '@/components/auth/login-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpenCheck } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md">
        <div className="mb-6 flex flex-col items-center text-center text-primary">
          <BookOpenCheck className="mb-4 h-16 w-16" />
          <h1 className="text-4xl font-bold font-headline">EduMate</h1>
        </div>
        <Card className="shadow-2xl">
          <CardHeader>
            <CardTitle className="text-center font-headline text-2xl">
              Welcome Back!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
