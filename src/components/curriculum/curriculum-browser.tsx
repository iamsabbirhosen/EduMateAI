'use client';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import type { ClassLevel } from '@/lib/curriculum';
import { useTranslation } from '@/hooks/use-translation';
import { ArrowRight, BookText } from 'lucide-react';
import Link from 'next/link';

interface CurriculumBrowserProps {
  classLevel: ClassLevel;
}

export function CurriculumBrowser({ classLevel }: CurriculumBrowserProps) {
  const { language } = useTranslation();
  const isBangla = language === 'Bangla';

  return (
    <Accordion type="multiple" className="w-full space-y-4">
      {classLevel.subjects.map(subject => (
        <AccordionItem key={subject.id} value={subject.id} className="rounded-lg border bg-card px-4">
          <AccordionTrigger className="text-xl font-semibold font-headline hover:no-underline">
            {isBangla ? subject.name_bn : subject.name}
          </AccordionTrigger>
          <AccordionContent>
            <Accordion type="multiple" className="w-full space-y-2">
              {subject.chapters.map(chapter => (
                <AccordionItem key={chapter.id} value={chapter.id} className="rounded-lg border border-border bg-muted/50 px-4">
                  <AccordionTrigger className="font-medium hover:no-underline">
                    {isBangla ? chapter.name_bn : chapter.name}
                  </AccordionTrigger>
                  <AccordionContent className="pt-2">
                    <ul className="space-y-2">
                      {chapter.topics.map(topic => (
                        <li key={topic.id}>
                          <Link
                            href={`/learn/${classLevel.id}/${subject.id}/${chapter.id}/${topic.id}`}
                            className="flex items-center justify-between rounded-md p-3 transition-colors hover:bg-primary/5"
                          >
                            <div className='flex items-center gap-3'>
                              <BookText className="h-5 w-5 text-primary" />
                              <span className="font-medium">
                                {isBangla ? topic.name_bn : topic.name}
                              </span>
                            </div>
                            <ArrowRight className="h-5 w-5 text-muted-foreground" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
