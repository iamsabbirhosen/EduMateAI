'use client';
import { CurriculumBrowser } from '@/components/curriculum/curriculum-browser';
import { useAuth } from '@/hooks/use-auth';
import { useTranslation } from '@/hooks/use-translation';
import { useCurriculumContext } from '@/context/CurriculumContext';
import { type ClassLevel } from '@/lib/curriculum';
import { useMemo } from 'react';

export default function SubjectsPage() {
  const { user } = useAuth();
  const { t, language } = useTranslation();
  const { curriculum, loading, error } = useCurriculumContext();
  const isBangla = language === 'Bangla';

  const userClass: ClassLevel | undefined = useMemo(() => 
    curriculum.find(c => c.id === user?.class),
    [curriculum, user?.class]
  );

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

  if (error) {
    return (
      <div className="container mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold font-headline">{t('subjects.title')}</h1>
          <p className="text-muted-foreground">{t('subjects.subtitle')}</p>
        </div>
        <div className="flex items-center justify-center h-48 text-red-500">
          <div>Error loading curriculum: {error}</div>
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
