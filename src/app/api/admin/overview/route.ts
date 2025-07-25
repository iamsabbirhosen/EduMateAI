import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

interface Topic {
  id: string;
  name: string;
  name_bn: string;
  hasPdf: boolean;
  created: string | null;
  updated: string | null;
}

interface Chapter {
  id: string;
  name: string;
  name_bn: string;
  topics: Topic[];
}

interface Subject {
  id: string;
  name: string;
  name_bn: string;
  chapters: Chapter[];
}

interface Class {
  id: string;
  name: string;
  name_bn: string;
  subjects: Subject[];
}

// Helper function to get curriculum data with metadata
async function getCurriculumData(): Promise<Class[]> {
  const materialsPath = path.join(process.cwd(), 'public', 'materials');
  
  try {
    const classes = await fs.readdir(materialsPath, { withFileTypes: true });
    const curriculum: Class[] = [];

    for (const classDir of classes) {
      if (!classDir.isDirectory()) continue;

      const classPath = path.join(materialsPath, classDir.name);
      const subjects = await fs.readdir(classPath, { withFileTypes: true });
      
      const classData: Class = {
        id: classDir.name,
        name: `Class ${classDir.name}`,
        name_bn: `শ্রেণি ${classDir.name}`,
        subjects: []
      };

      for (const subjectDir of subjects) {
        if (!subjectDir.isDirectory()) continue;

        const subjectPath = path.join(classPath, subjectDir.name);
        let subjectMetadata = null;
        
        try {
          const metadataPath = path.join(subjectPath, '.metadata.json');
          const metadataContent = await fs.readFile(metadataPath, 'utf-8');
          subjectMetadata = JSON.parse(metadataContent);
        } catch {
          // No metadata file, use default names
        }

        const chapters = await fs.readdir(subjectPath, { withFileTypes: true });
        const subjectData: Subject = {
          id: subjectDir.name,
          name: subjectMetadata?.name || subjectDir.name,
          name_bn: subjectMetadata?.name_bn || subjectDir.name,
          chapters: []
        };

        for (const chapterDir of chapters) {
          if (!chapterDir.isDirectory()) continue;

          const chapterPath = path.join(subjectPath, chapterDir.name);
          let chapterMetadata = null;
          
          try {
            const metadataPath = path.join(chapterPath, '.metadata.json');
            const metadataContent = await fs.readFile(metadataPath, 'utf-8');
            chapterMetadata = JSON.parse(metadataContent);
          } catch {
            // No metadata file, use default names
          }

          const topics = await fs.readdir(chapterPath, { withFileTypes: true });
          const chapterData: Chapter = {
            id: chapterDir.name,
            name: chapterMetadata?.name || chapterDir.name,
            name_bn: chapterMetadata?.name_bn || chapterDir.name,
            topics: []
          };

          for (const topicDir of topics) {
            if (!topicDir.isDirectory()) continue;

            const topicPath = path.join(chapterPath, topicDir.name);
            let topicMetadata = null;
            
            try {
              const metadataPath = path.join(topicPath, '.metadata.json');
              const metadataContent = await fs.readFile(metadataPath, 'utf-8');
              topicMetadata = JSON.parse(metadataContent);
            } catch {
              // No metadata file, use default names
            }

            // Check if PDF exists
            let hasPdf = false;
            try {
              await fs.access(path.join(topicPath, 'material.pdf'));
              hasPdf = true;
            } catch {
              // No PDF file
            }

            const topicData: Topic = {
              id: topicDir.name,
              name: topicMetadata?.name || topicDir.name,
              name_bn: topicMetadata?.name_bn || topicDir.name,
              hasPdf,
              created: topicMetadata?.created || null,
              updated: topicMetadata?.updated || null
            };

            chapterData.topics.push(topicData);
          }

          subjectData.chapters.push(chapterData);
        }

        classData.subjects.push(subjectData);
      }

      curriculum.push(classData);
    }

    return curriculum;
  } catch (error) {
    console.error('Error reading curriculum:', error);
    return [];
  }
}

// Helper function to get statistics
async function getCurriculumStats() {
  const curriculum = await getCurriculumData();
  
  let totalClasses = 0;
  let totalSubjects = 0;
  let totalChapters = 0;
  let totalTopics = 0;
  let totalPdfs = 0;

  curriculum.forEach(classItem => {
    totalClasses++;
    classItem.subjects.forEach(subject => {
      totalSubjects++;
      subject.chapters.forEach(chapter => {
        totalChapters++;
        chapter.topics.forEach(topic => {
          totalTopics++;
          if (topic.hasPdf) totalPdfs++;
        });
      });
    });
  });

  return {
    totalClasses,
    totalSubjects,
    totalChapters,
    totalTopics,
    totalPdfs
  };
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const type = url.searchParams.get('type');

    if (type === 'stats') {
      const stats = await getCurriculumStats();
      return NextResponse.json(stats);
    } else if (type === 'full') {
      const curriculum = await getCurriculumData();
      return NextResponse.json(curriculum);
    } else {
      // Default: return basic structure
      const curriculum = await getCurriculumData();
      const stats = await getCurriculumStats();
      
      return NextResponse.json({
        stats,
        curriculum: curriculum.map(classItem => ({
          ...classItem,
          subjects: classItem.subjects.map(subject => ({
            ...subject,
            chapterCount: subject.chapters.length,
            topicCount: subject.chapters.reduce((total, chapter) => total + chapter.topics.length, 0)
          }))
        }))
      });
    }

  } catch (error) {
    console.error('Error fetching overview:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
