'use client';
import { CurriculumBrowser } from '@/components/curriculum/curriculum-browser';
import { useAuth } from '@/hooks/use-auth';
import { useTranslation } from '@/hooks/use-translation';
import { getCurriculumData, type ClassLevel } from '@/lib/curriculum';
import { useEffect, useState } from 'react';

export default function SubjectsPage() {
  const { user } = useAuth();
  const { t, language } = useTranslation();
  const isBangla = language === 'Bangla';
  const [userClass, setUserClass] = useState<ClassLevel | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCurriculum = async () => {
      try {
        const curriculumData = await getCurriculumData();
        const foundClass = curriculumData.find(c => c.id === user?.class);
        setUserClass(foundClass);
      } catch (error) {
        console.error('Error loading curriculum:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.class) {
      loadCurriculum();
    } else {
      setLoading(false);
    }
  }, [user?.class]);

  if (loading) {
    return (
      <div className="container mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold font-headline">{t('subjects.title')}</h1>
          <p className="text-muted-foreground">{t('subjects.subtitle')}</p>
        </div>
        <div className="flex items-center justify-center h-48">
          <div className="text-muted-foreground">Loading curriculum...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">{t('subjects.title')}</h1>
        <p className="text-muted-foreground">{t('subjects.subtitle')}</p>
      </div>

      {userClass ? (
        <section>
          <h2 className="mb-4 text-2xl font-semibold">
            {isBangla ? userClass.name_bn : userClass.name}
          </h2>
          <CurriculumBrowser classLevel={userClass} />
        </section>
      ) : (
        <p>{t('subjects.no_class_assigned')}</p>
      )}
    </div>
  );
}
