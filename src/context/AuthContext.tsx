'use client';

import { DUMMY_USERS, type User } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string) => Promise<void>;
  logout: () => void;
  updateUserLanguage: (language: 'Bangla' | 'English') => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('edumate-user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Failed to parse user from localStorage', error);
      localStorage.removeItem('edumate-user');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string) => {
    setLoading(true);
    const foundUser = DUMMY_USERS.find(u => u.email === email);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('edumate-user', JSON.stringify(foundUser));
      router.push('/dashboard');
    } else {
      // In a real app, you'd show an error.
      console.error('User not found');
    }
    setLoading(false);
  }, [router]);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('edumate-user');
    router.push('/login');
  }, [router]);

  const updateUserLanguage = useCallback((language: 'Bangla' | 'English') => {
    if (user) {
      const updatedUser = { ...user, language };
      setUser(updatedUser);
      localStorage.setItem('edumate-user', JSON.stringify(updatedUser));
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUserLanguage }}>
      {children}
    </AuthContext.Provider>
  );
}
