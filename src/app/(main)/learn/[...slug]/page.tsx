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
import { VideoPlayer } from '@/components/learn/video-player';
import { DiagnosticTest } from '@/components/learn/diagnostic-test';
import { AiExplanation } from '@/components/learn/ai-explanation';
import { ChatBot } from '@/components/learn/chat-bot';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Book, Youtube, HelpCircle, Bot, MessageSquare } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function LearnPage({ params }: { params: { slug: string[] } }) {
  const { slug } = params;
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Tabs defaultValue="materials" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="materials">
                <Book className="mr-2 h-4 w-4" />
                {t('learn.study_materials')}
              </TabsTrigger>
              <TabsTrigger value="videos">
                <Youtube className="mr-2 h-4 w-4" />
                {t('learn.youtube_videos')}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="materials">
              <Card>
                <CardContent className="p-2 md:p-4">
                  <PdfViewer pdfUrl={topic.pdfUrl} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="videos">
              <Card>
                <CardContent className="p-4">
                  <VideoPlayer topicTitle={topic.name} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6 lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="text-primary" /> {t('learn.diagnostic_test')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DiagnosticTest pdfContent={mockPdfContent} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="text-primary" /> {t('learn.ai_explanation')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AiExplanation topicContent={mockPdfContent} />
            </CardContent>
          </Card>
        </div>
      </div>
       <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="text-primary" /> {t('learn.chat.title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChatBot pdfContent={mockPdfContent} />
          </CardContent>
        </Card>
    </div>
  );
}
