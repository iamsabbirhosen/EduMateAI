'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { getCurriculumData, refreshCurriculumData, type ClassLevel } from '@/lib/curriculum';

interface CurriculumContextType {
  curriculum: ClassLevel[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const CurriculumContext = createContext<CurriculumContextType | undefined>(undefined);

export function CurriculumProvider({ children }: { children: React.ReactNode }) {
  const [curriculum, setCurriculum] = useState<ClassLevel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCurriculum = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCurriculumData();
      setCurriculum(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load curriculum';
      setError(errorMessage);
      console.error('Error fetching curriculum:', err);
    } finally {
      setLoading(false);
    }
  };

  const refetch = async () => {
    try {
      setError(null);
      const data = await refreshCurriculumData();
      setCurriculum(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to refresh curriculum';
      setError(errorMessage);
      console.error('Error refreshing curriculum:', err);
    }
  };

  // Auto-refresh curriculum every 5 minutes and on first visit
  useEffect(() => {
    // Always fetch curriculum on mount (this handles first visit)
    fetchCurriculum();
    
    // Set up automatic refresh every 5 minutes to detect folder changes
    const interval = setInterval(() => {
      refetch();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, []);

  const value = {
    curriculum,
    loading,
    error,
    refetch,
  };

  return (
    <CurriculumContext.Provider value={value}>
      {children}
    </CurriculumContext.Provider>
  );
}

export function useCurriculumContext() {
  const context = useContext(CurriculumContext);
  if (context === undefined) {
    throw new Error('useCurriculumContext must be used within a CurriculumProvider');
  }
  return context;
}
