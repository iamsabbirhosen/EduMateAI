'use client';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/use-translation';
import { generateAiExplanation } from '@/ai/flows/generate-ai-explanation';
import { useState } from 'react';
import { Loader2, PlayCircle, StopCircle } from 'lucide-react';
import { Card, CardContent } from '../ui/card';

interface AiExplanationProps {
  topicContent: string;
}

export function AiExplanation({ topicContent }: AiExplanationProps) {
  const { t, language } = useTranslation();
  const [explanation, setExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleGetExplanation = async () => {
    setIsLoading(true);
    setExplanation('');
    try {
      const result = await generateAiExplanation({
        topicContent,
        language,
      });
      setExplanation(
        result.explanation || 'This is a mock explanation from the AI.'
      );
    } catch (error) {
      console.error('Failed to generate explanation:', error);
      setExplanation(
        'Sorry, an error occurred while generating the explanation. This is a fallback message.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleSpeech = () => {
    // This is a mock function
    if (isSpeaking) {
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      setTimeout(() => setIsSpeaking(false), 5000); // Simulate speech for 5s
    }
  };

  return (
    <div className="space-y-4">
      <Button
        className="w-full"
        onClick={handleGetExplanation}
        disabled={isLoading}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {t('learn.get_explanation')}
      </Button>

      {isLoading && (
        <div className="flex justify-center items-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <p className="ml-2 text-muted-foreground">{t('learn.explanation.generating')}</p>
        </div>
      )}

      {explanation && (
        <Card className="bg-muted">
          <CardContent className="pt-6 space-y-4">
            <p className="text-sm leading-relaxed">{explanation}</p>
            <Button
              variant="outline"
              onClick={handleToggleSpeech}
              disabled={isLoading}
            >
              {isSpeaking ? (
                <>
                  <StopCircle className="mr-2 h-4 w-4" />
                  Stop
                </>
              ) : (
                <>
                  <PlayCircle className="mr-2 h-4 w-4" />
                  {t('learn.explanation.play_audio')}
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
