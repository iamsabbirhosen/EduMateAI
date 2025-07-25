'use client';
import { useState, useEffect } from 'react';
import { getCurriculumData, type ClassLevel } from '@/lib/curriculum';

interface UseCurriculumReturn {
  curriculum: ClassLevel[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useCurriculum(): UseCurriculumReturn {
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
    await fetchCurriculum();
  };

  useEffect(() => {
    fetchCurriculum();
  }, []);

  return {
    curriculum,
    loading,
    error,
    refetch,
  };
}
