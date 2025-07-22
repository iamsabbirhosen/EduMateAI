'use client';

import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/context/AuthContext';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="system" storageKey="edumate-theme">
      <AuthProvider>{children}</AuthProvider>
    </ThemeProvider>
  );
}
