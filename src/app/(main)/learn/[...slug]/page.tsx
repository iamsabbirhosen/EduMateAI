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
import React from 'react';

export default function LearnPage({ params }: { params: { slug: string[] } }) {
  const { slug } = React.use(params);
  const topicData = getTopicBySlug(slug);
  const { t, language } = useTranslation();
  const isBangla = language === 'Bangla';

  if (!topicData) {
    notFound();
  }

  const { classLevel, subject, chapter, topic } = topicData;
  const topicName = isBangla ? topic.name_bn : topic.name;
  const mockPdfContent = `Content from PDF for topic: ${topic.name}. This text is used to simulate content extraction for AI processing.`;

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
      
      <Tabs defaultValue="materials" className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-4">
          <TabsTrigger value="materials">
            <Book className="mr-2 h-4 w-4" />
            {t('learn.study_materials')}
          </TabsTrigger>
          <TabsTrigger value="test">
             <TestTubeDiagonal className="mr-2 h-4 w-4" />
            {t('learn.diagnostic_test')}
          </TabsTrigger>
          <TabsTrigger value="ai-explanation">
            <Bot className="mr-2 h-4 w-4" />
            {t('learn.ai_explanation')}
          </TabsTrigger>
          <TabsTrigger value="chat">
            <MessageSquare className="mr-2 h-4 w-4" />
             {t('learn.chat.title')}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="materials">
          <Card>
            <CardContent className="p-2 md:p-4">
              <PdfViewer pdfUrl={topic.pdfUrl} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="test">
          <Card>
             <CardContent className="p-4 md:p-6 flex justify-center">
              <div className='w-full max-w-2xl'>
                <DiagnosticTest pdfContent={mockPdfContent} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="ai-explanation">
          <Card>
             <CardContent className="p-4 md:p-6">
              <AiExplanation topicContent={mockPdfContent} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="chat">
          <Card>
             <CardContent className="p-4 md:p-6">
               <ChatBot pdfContent={mockPdfContent} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
