'use client';

import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/context/AuthContext';
import { CurriculumProvider } from '@/context/CurriculumContext';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="system" storageKey="edumate-theme">
      <AuthProvider>
        <CurriculumProvider>
          {children}
        </CurriculumProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
