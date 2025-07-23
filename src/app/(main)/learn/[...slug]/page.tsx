'use client';
import { getTopicBySlug } from '@/lib/curriculum';
import { notFound } from 'next/navigation';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import Link from 'next/link';
import { useTranslation } from '@/hooks/use-translation';
import { PdfViewer } from '@/components/learn/pdf-viewer';
import { DiagnosticTest } from '@/components/learn/diagnostic-test';
import { AiExplanation } from '@/components/learn/ai-explanation';
import { ChatBot } from '@/components/learn/chat-bot';
import { Card, CardContent } from '@/components/ui/card';
import { Book, Bot, MessageSquare, TestTubeDiagonal } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import React, { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type View = 'materials' | 'test' | 'ai-explanation' | 'chat';

export default function LearnPage({ params }: { params: { slug: string[] } }) {
  const slug = React.use(params).slug;
  const topicData = getTopicBySlug(slug);
  const { t, language } = useTranslation();
  const isBangla = language === 'Bangla';
  const isMobile = useIsMobile();
  const [activeView, setActiveView] = useState<View>('materials');

  if (!topicData) {
    notFound();
  }

  const { classLevel, subject, chapter, topic } = topicData;
  const topicName = isBangla ? topic.name_bn : topic.name;
  const mockPdfContent = `Content from PDF for topic: ${topic.name}. This text is used to simulate content extraction for AI processing.`;
  
  const views = [
    { id: 'materials', label: t('learn.study_materials'), icon: Book },
    { id: 'test', label: t('learn.diagnostic_test'), icon: TestTubeDiagonal },
    { id: 'ai-explanation', label: t('learn.ai_explanation'), icon: Bot },
    { id: 'chat', label: t('learn.chat.title'), icon: MessageSquare },
  ];

  const renderContent = () => {
    switch (activeView) {
      case 'materials':
        return (
          <Card>
            <CardContent className="p-2 md:p-4">
              <PdfViewer pdfUrl={topic.pdfUrl} />
            </CardContent>
          </Card>
        );
      case 'test':
        return (
          <Card>
            <CardContent className="p-4 md:p-6 flex justify-center">
              <div className='w-full max-w-2xl'>
                <DiagnosticTest pdfContent={mockPdfContent} />
              </div>
            </CardContent>
          </Card>
        );
      case 'ai-explanation':
        return (
          <Card>
            <CardContent className="p-4 md:p-6">
              <AiExplanation topicContent={mockPdfContent} />
            </CardContent>
          </Card>
        );
      case 'chat':
        return (
          <Card>
            <CardContent className="p-4 md:p-6">
              <ChatBot pdfContent={mockPdfContent} />
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/subjects">{isBangla ? classLevel.name_bn : classLevel.name}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/subjects">{isBangla ? subject.name_bn : subject.name}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/subjects">{isBangla ? chapter.name_bn : chapter.name}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{topicName}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h1 className="text-4xl font-bold font-headline">{topicName}</h1>
      
      {isMobile ? (
        <Select value={activeView} onValueChange={(value) => setActiveView(value as View)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a section" />
          </SelectTrigger>
          <SelectContent>
            {views.map(view => (
              <SelectItem key={view.id} value={view.id}>
                <div className='flex items-center gap-2'>
                  <view.icon className="h-4 w-4" />
                  {view.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <Tabs value={activeView} onValueChange={(value) => setActiveView(value as View)} className="w-full">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-4">
            {views.map(view => (
              <TabsTrigger key={view.id} value={view.id}>
                <view.icon className="mr-2 h-4 w-4" />
                {view.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      )}

      <div className="mt-4">{renderContent()}</div>
    </div>
  );
}
