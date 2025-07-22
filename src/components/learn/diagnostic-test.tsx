'use client';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/use-translation';
import { generateDiagnosticTest } from '@/ai/flows/generate-diagnostic-test';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { Card, CardContent } from '../ui/card';

interface DiagnosticTestProps {
  pdfContent: string;
}

export function DiagnosticTest({ pdfContent }: DiagnosticTestProps) {
  const { t, language } = useTranslation();
  const [questions, setQuestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleStartTest = async () => {
    setIsLoading(true);
    setScore(null);
    try {
      // In a real scenario, you'd extract real content.
      const result = await generateDiagnosticTest({
        pdfContent,
        language,
      });
      // For prototype, we use dummy questions if AI returns none
      setQuestions(
        result.questions.length > 0
          ? result.questions
          : [
              'What is the main concept of this topic?',
              'True or False: This is a sample question.',
              'Which of the following is correct? A, B, or C.',
            ]
      );
    } catch (error) {
      console.error('Failed to generate test:', error);
      // Fallback to dummy questions on error
      setQuestions([
        'What is the main concept of this topic? (Error Fallback)',
        'True or False: This is a sample question. (Error Fallback)',
        'Which of the following is correct? A, B, or C. (Error Fallback)',
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = () => {
    // Mock scoring logic
    const randomScore = Math.floor(Math.random() * (questions.length + 1));
    setScore(randomScore);
    setIsOpen(false);
  };

  return (
    <div>
      {score !== null ? (
        <Card className="bg-muted">
          <CardContent className="pt-6 text-center">
            <p className="text-lg font-medium">{t('learn.test.result.title')}</p>
            <p className="text-4xl font-bold text-primary">
              {score}
              <span className="text-2xl text-muted-foreground">/{questions.length}</span>
            </p>
            <Button onClick={handleStartTest} className="mt-4">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Retake Test
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="w-full" onClick={handleStartTest}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t('learn.start_test')}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{t('learn.test.title')}</DialogTitle>
            </DialogHeader>
            {isLoading ? (
              <div className="flex justify-center items-center h-48">
                <Loader2 className="h-8 w-8 animate-spin" />
                <p className="ml-4">{t('learn.test.generating')}</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[60vh] overflow-y-auto p-1">
                {questions.map((q, index) => (
                  <div key={index} className="space-y-2 rounded-md border p-4">
                    <p>
                      <strong>Q{index + 1}:</strong> {q}
                    </p>
                    <RadioGroup defaultValue="a" className="flex flex-col space-y-1">
                      {['A', 'B', 'C', 'D'].map(option => (
                        <div key={option} className="flex items-center space-x-3">
                           <RadioGroupItem value={option.toLowerCase()} id={`q${index}-${option}`} />
                           <Label htmlFor={`q${index}-${option}`}>Sample Option {option}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                ))}
              </div>
            )}
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleSubmit} disabled={isLoading || questions.length === 0}>
                {t('learn.test.submit')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
