'use client';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { DUMMY_USERS } from '@/lib/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { useTranslation } from '@/hooks/use-translation';

const formSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

export function LoginForm() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { t, language } = useTranslation();
  const { updateUserLanguage } = useAuth();


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    await login(values.email);
    // No need to set isLoading to false as the page will redirect
  }

  const handleDemoLogin = async (email: string) => {
    form.setValue('email', email);
    form.setValue('password', 'password123'); // Dummy password
    await onSubmit({ email, password: 'password123' });
  };
  
  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('login.email')}</FormLabel>
                <FormControl>
                  <Input
                    placeholder="student@email.com"
                    {...field}
                    autoComplete="email"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('login.password')}</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    {...field}
                    autoComplete="current-password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center space-x-2">
            <FormLabel>{t('login.language')}</FormLabel>
            <Select
              onValueChange={(value: 'Bangla' | 'English') =>
                updateUserLanguage(value)
              }
              defaultValue={language}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t('login.language')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="English">English</SelectItem>
                <SelectItem value="Bangla">বাংলা</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t('login.button')}
          </Button>
        </form>
      </Form>
      <div className="relative">
        <Separator />
        <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-sm text-muted-foreground">
          OR
        </p>
      </div>
      <div className="space-y-2">
        <p className="text-center text-sm font-medium text-muted-foreground">
          {t('login.demo.title')}
        </p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {DUMMY_USERS.map(user => (
            <Button
              key={user.id}
              variant="outline"
              onClick={() => handleDemoLogin(user.email)}
              disabled={isLoading}
            >
              {user.name}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
