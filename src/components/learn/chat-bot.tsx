'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTranslation } from '@/hooks/use-translation';
import { useState } from 'react';
import { answerFollowUpQuestions } from '@/ai/flows/answer-follow-up-questions';
import { Loader2, Send, User, Bot } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { cn } from '@/lib/utils';

interface ChatBotProps {
  pdfContent: string;
}

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

export function ChatBot({ pdfContent }: ChatBotProps) {
  const { t, language } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const result = await answerFollowUpQuestions({
        pdfContent,
        question: input,
        language,
      });
      const botMessage: Message = {
        sender: 'bot',
        text:
          result.answer ||
          'I am a mock AI. This is a sample answer to your question.',
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Failed to get answer:', error);
      const errorMessage: Message = {
        sender: 'bot',
        text: 'Sorry, I encountered an error. This is a fallback response.',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-h-[500px]">
      <ScrollArea className="flex-1 p-4 border rounded-lg">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={cn(
                'flex items-start gap-3',
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {message.sender === 'bot' && (
                <Avatar>
                  <AvatarFallback><Bot /></AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn(
                  'max-w-xs md:max-w-md lg:max-w-lg rounded-lg px-4 py-2',
                  message.sender === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                )}
              >
                <p className="text-sm">{message.text}</p>
              </div>
              {message.sender === 'user' && (
                <Avatar>
                  <AvatarFallback><User /></AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-3 justify-start">
               <Avatar>
                  <AvatarFallback><Bot /></AvatarFallback>
                </Avatar>
                <div className="bg-muted rounded-lg px-4 py-2 flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="flex items-center gap-2 pt-4">
        <Input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={t('learn.chat.placeholder')}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          disabled={isLoading}
        />
        <Button onClick={handleSend} disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          <span className="sr-only">{t('learn.chat.send')}</span>
        </Button>
      </div>
    </div>
  );
}
