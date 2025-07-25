'use client';
import { useState, useEffect } from 'react';
import { getTopicBySlug, ClassLevel, Subject, Chapter, Topic } from '@/lib/curriculum';

interface TopicData {
  classLevel: ClassLevel;
  subject: Subject;
  chapter: Chapter;
  topic: Topic;
}

interface UseTopicReturn {
  topicData: TopicData | null;
  loading: boolean;
  error: string | null;
}

export function useTopic(slug: string[]): UseTopicReturn {
  const [topicData, setTopicData] = useState<TopicData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug.length === 0) {
      setLoading(false);
      return;
    }

    const loadTopicData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getTopicBySlug(slug);
        setTopicData(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load topic';
        setError(errorMessage);
        console.error('Error loading topic data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadTopicData();
  }, [slug.join('/')]);

  return {
    topicData,
    loading,
    error,
  };
}
