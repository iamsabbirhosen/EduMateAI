'use client';
import { CurriculumBrowser } from '@/components/curriculum/curriculum-browser';
import { useAuth } from '@/hooks/use-auth';
import { useTranslation } from '@/hooks/use-translation';
import { curriculumData, type ClassLevel } from '@/lib/curriculum';

export default function SubjectsPage() {
  const { user } = useAuth();
  const { t, language } = useTranslation();
  const isBangla = language === 'Bangla';

  const userClass: ClassLevel | undefined = curriculumData.find(
    c => c.id === user?.class
  );

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
        <p>{t('subjects.no_class_assigned', 'No class assigned to your profile.')}</p>
      )}
    </div>
  );
}
