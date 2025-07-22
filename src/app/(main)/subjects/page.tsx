'use client';
import { CurriculumBrowser } from '@/components/curriculum/curriculum-browser';
import { useAuth } from '@/hooks/use-auth';
import { useTranslation } from '@/hooks/use-translation';
import { curriculumData, type ClassLevel } from '@/lib/curriculum';
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function SubjectsPage() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [selectedClass, setSelectedClass] = useState<ClassLevel | undefined>(
    curriculumData.find(c => c.id === user?.class)
  );

  const handleClassChange = (classId: string) => {
    const newClass = curriculumData.find(c => c.id.toString() === classId);
    setSelectedClass(newClass);
  };

  return (
    <div className="container mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">{t('subjects.title')}</h1>
        <p className="text-muted-foreground">{t('subjects.subtitle')}</p>
      </div>

      <div className="flex items-center gap-4">
        <label htmlFor="class-select" className="font-medium">
          {t('subjects.select_class')}:
        </label>
        <Select
          value={selectedClass?.id.toString()}
          onValueChange={handleClassChange}
        >
          <SelectTrigger id="class-select" className="w-[180px]">
            <SelectValue placeholder="Select a class" />
          </SelectTrigger>
          <SelectContent>
            {curriculumData.map(c => (
              <SelectItem key={c.id} value={c.id.toString()}>
                {user?.language === 'Bangla' ? c.name_bn : c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedClass && (
        <section>
          <CurriculumBrowser classLevel={selectedClass} />
        </section>
      )}
    </div>
  );
}
