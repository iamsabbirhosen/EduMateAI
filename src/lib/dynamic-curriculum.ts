import fs from 'fs';
import path from 'path';

export interface Topic {
  id: string;
  name: string;
  name_bn: string;
  pdfUrl: string;
}

export interface Chapter {
  id: string;
  name: string;
  name_bn: string;
  topics: Topic[];
}

export interface Subject {
  id: string;
  name: string;
  name_bn: string;
  chapters: Chapter[];
}

export interface ClassLevel {
  id: number;
  name: string;
  name_bn: string;
  subjects: Subject[];
}

// Helper function to convert kebab-case to title case
function kebabToTitle(str: string): string {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Helper function to convert title case to Bengali (placeholder - you'll need proper translations)
function titleToBengali(str: string): string {
  const translations: { [key: string]: string } = {
    'Physics': 'পদার্থবিজ্ঞান',
    'Math': 'গণিত',
    'Chemistry': 'রসায়ন',
    'Bangla': 'বাংলা',
    'Newtonian Mechanics': 'নিউটনিয়ান বলবিদ্যা',
    'Thermodynamics': 'তাপগতিবিদ্যা',
    'Calculus': 'ক্যালকুলাস',
    'Periodic Table': 'পর্যায় সারণী',
    'Literature': 'সাহিত্য',
    "Newton's 1st Law": 'নিউটনের ১ম সূত্র',
    "Newton's 2nd Law": 'নিউটনের ২য় সূত্র',
    "Newtons 1st Law": 'নিউটনের ১ম সূত্র',
    "Newtons 2nd Law": 'নিউটনের ২য় সূত্র',
    'Zeroth Law': 'শূন্যতম সূত্র',
    'Differentiation': 'অন্তরীকরণ',
    'Periodic Trends': 'পর্যায়বৃত্ত ধর্ম',
    'Kazi Nazrul Islam': 'কাজী নজরুল ইসলাম',
    'Zeroth Law Of Thermodynamics': 'তাপগতিবিদ্যার শূন্যতম সূত্র',
  };
  
  return translations[str] || str;
}

// Function to scan the materials directory and generate curriculum data
export function generateCurriculumFromFileSystem(): ClassLevel[] {
  const materialsPath = path.join(process.cwd(), 'public', 'materials');
  
  if (!fs.existsSync(materialsPath)) {
    console.warn('Materials directory not found');
    return [];
  }

  const curriculum: ClassLevel[] = [];
  
  try {
    // Read class directories (should be numeric: 10, 11, 12, etc.)
    const classDirs = fs.readdirSync(materialsPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)
      .filter(name => /^\d+$/.test(name)) // Only numeric directories
      .sort((a, b) => parseInt(a) - parseInt(b));

    for (const classDir of classDirs) {
      const classPath = path.join(materialsPath, classDir);
      const classId = parseInt(classDir);
      
      const subjects: Subject[] = [];
      
      // Read subject directories
      const subjectDirs = fs.readdirSync(classPath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

      for (const subjectDir of subjectDirs) {
        const subjectPath = path.join(classPath, subjectDir);
        const subjectName = kebabToTitle(subjectDir);
        
        const chapters: Chapter[] = [];
        
        // Read chapter directories
        const chapterDirs = fs.readdirSync(subjectPath, { withFileTypes: true })
          .filter(dirent => dirent.isDirectory())
          .map(dirent => dirent.name);

        for (const chapterDir of chapterDirs) {
          const chapterPath = path.join(subjectPath, chapterDir);
          const chapterName = kebabToTitle(chapterDir);
          
          const topics: Topic[] = [];
          
          // Read topic directories
          const topicDirs = fs.readdirSync(chapterPath, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);

          for (const topicDir of topicDirs) {
            const topicPath = path.join(chapterPath, topicDir);
            const topicName = kebabToTitle(topicDir);
            
            // Check if material.pdf exists
            const pdfPath = path.join(topicPath, 'material.pdf');
            if (fs.existsSync(pdfPath)) {
              const topic: Topic = {
                id: topicDir,
                name: topicName,
                name_bn: titleToBengali(topicName),
                pdfUrl: `/materials/${classDir}/${subjectDir}/${chapterDir}/${topicDir}/material.pdf`
              };
              topics.push(topic);
            }
          }
          
          if (topics.length > 0) {
            const chapter: Chapter = {
              id: chapterDir,
              name: chapterName,
              name_bn: titleToBengali(chapterName),
              topics
            };
            chapters.push(chapter);
          }
        }
        
        if (chapters.length > 0) {
          const subject: Subject = {
            id: subjectDir,
            name: subjectName,
            name_bn: titleToBengali(subjectName),
            chapters
          };
          subjects.push(subject);
        }
      }
      
      if (subjects.length > 0) {
        const classLevel: ClassLevel = {
          id: classId,
          name: `Class ${classId}`,
          name_bn: getClassNameBengali(classId),
          subjects
        };
        curriculum.push(classLevel);
      }
    }
  } catch (error) {
    console.error('Error generating curriculum from file system:', error);
  }
  
  return curriculum.sort((a, b) => b.id - a.id); // Sort descending (12, 11, 10)
}

function getClassNameBengali(classId: number): string {
  const bengaliNumbers: { [key: number]: string } = {
    8: 'অষ্টম শ্রেণী',
    9: 'নবম শ্রেণী',
    10: 'দশম শ্রেণী',
    11: 'একাদশ শ্রেণী',
    12: 'দ্বাদশ শ্রেণী',
  };
  
  return bengaliNumbers[classId] || `${classId} শ্রেণী`;
}

// Function to get topic by slug (same logic as before)
export function getTopicBySlug(slug: string[], curriculum: ClassLevel[]) {
  if (slug.length !== 4) return null;
  const [classId, subjectId, chapterId, topicId] = slug;
  
  const classLevel = curriculum.find((c) => c.id.toString() === classId);
  if (!classLevel) return null;

  const subject = classLevel.subjects.find((s) => s.id === subjectId);
  if (!subject) return null;

  const chapter = subject.chapters.find((ch) => ch.id === chapterId);
  if (!chapter) return null;

  const topic = chapter.topics.find((t) => t.id === topicId);
  if (!topic) return null;

  return { classLevel, subject, chapter, topic };
}
