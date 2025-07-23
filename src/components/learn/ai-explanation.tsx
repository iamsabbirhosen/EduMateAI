'use client';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/use-translation';
import { generateAiExplanation } from '@/ai/flows/generate-ai-explanation';
import { useState } from 'react';
import { Loader2, PlayCircle, StopCircle, Bot, Zap, BrainCircuit } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

interface AiExplanationProps {
  topicContent: string;
}

type ExplanationMode = 'teacher' | 'fun' | 'simple';

export function AiExplanation({ topicContent }: AiExplanationProps) {
  const { t, language } = useTranslation();
  const [explanation, setExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [mode, setMode] = useState<ExplanationMode>('teacher');

  const handleGetExplanation = async (selectedMode: ExplanationMode) => {
    setIsLoading(true);
    setExplanation('');
    try {
      const result = await generateAiExplanation({
        topicContent,
        language,
        mode: selectedMode,
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
  
  const onModeChange = (value: ExplanationMode) => {
    setMode(value);
    if(explanation){
        handleGetExplanation(value);
    }
  }

  return (
    <div className="space-y-4">
       <div className="flex flex-col sm:flex-row gap-4">
        <Select onValueChange={onModeChange} defaultValue={mode}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={t('learn.explanation.select_mode')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="teacher">
                <div className="flex items-center gap-2">
                    <Bot /> {t('learn.explanation.mode.teacher')}
                </div>
            </SelectItem>
            <SelectItem value="fun">
                 <div className="flex items-center gap-2">
                    <Zap /> {t('learn.explanation.mode.fun')}
                </div>
            </SelectItem>
            <SelectItem value="simple">
                 <div className="flex items-center gap-2">
                    <BrainCircuit /> {t('learn.explanation.mode.simple')}
                </div>
            </SelectItem>
          </SelectContent>
        </Select>
        <Button
            className="w-full"
            onClick={() => handleGetExplanation(mode)}
            disabled={isLoading}
        >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {explanation ? t('learn.regenerate_explanation') : t('learn.get_explanation')}
        </Button>
      </div>


      {isLoading && (
        <div className="flex justify-center items-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <p className="ml-2 text-muted-foreground">{t('learn.explanation.generating')}</p>
        </div>
      )}

      {explanation && !isLoading && (
        <Card className="bg-muted">
          <CardContent className="pt-6 space-y-4">
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{explanation}</p>
            <Button
              variant="outline"
              onClick={handleToggleSpeech}
              disabled={isSpeaking}
            >
              {isSpeaking ? (
                <>
                  <StopCircle className="mr-2 h-4 w-4" />
                  {t('learn.explanation.stop_audio')}
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
