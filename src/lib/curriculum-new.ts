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

// Cache for curriculum data
let curriculumCache: ClassLevel[] | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 30000; // 30 seconds

// Function to fetch curriculum data from API
async function fetchCurriculumData(): Promise<ClassLevel[]> {
  try {
    const response = await fetch('/api/curriculum', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    if (result.success) {
      return result.data;
    } else {
      throw new Error(result.error || 'Failed to fetch curriculum');
    }
  } catch (error) {
    console.error('Error fetching curriculum:', error);
    return getFallbackCurriculum();
  }
}

// Function to get curriculum data with caching
export async function getCurriculumData(): Promise<ClassLevel[]> {
  const now = Date.now();
  
  // Check if we have cached data and it's still fresh
  if (curriculumCache && (now - lastFetchTime) < CACHE_DURATION) {
    return curriculumCache;
  }

  // Fetch fresh data
  curriculumCache = await fetchCurriculumData();
  lastFetchTime = now;
  
  return curriculumCache;
}

// Synchronous version for backward compatibility (uses cache if available)
export const curriculumData: ClassLevel[] = [];

// Function to refresh curriculum data
export async function refreshCurriculumData(): Promise<ClassLevel[]> {
  curriculumCache = null;
  return await getCurriculumData();
}

// Fallback curriculum data in case API fails
function getFallbackCurriculum(): ClassLevel[] {
  return [
    {
      id: 12,
      name: 'Class 12',
      name_bn: 'দ্বাদশ শ্রেণী',
      subjects: [
        {
          id: 'physics',
          name: 'Physics',
          name_bn: 'পদার্থবিজ্ঞান',
          chapters: [
            {
              id: 'newtonian-mechanics',
              name: 'Newtonian Mechanics',
              name_bn: 'নিউটনিয়ান বলবিদ্যা',
              topics: [
                {
                  id: 'newtons-1st-law',
                  name: "Newton's 1st Law",
                  name_bn: 'নিউটনের ১ম সূত্র',
                  pdfUrl: '/materials/12/physics/newtonian-mechanics/newtons-1st-law/material.pdf',
                },
                {
                  id: 'newtons-2nd-law',
                  name: "Newton's 2nd Law",
                  name_bn: 'নিউটনের ২য় সূত্র',
                  pdfUrl: '/materials/12/physics/newtonian-mechanics/newtons-2nd-law/material.pdf',
                },
              ],
            },
            {
              id: 'thermodynamics',
              name: 'Thermodynamics',
              name_bn: 'তাপগতিবিদ্যা',
              topics: [
                {
                  id: 'zeroth-law',
                  name: "Zeroth Law of Thermodynamics",
                  name_bn: 'তাপগতিবিদ্যার শূন্যতম সূত্র',
                  pdfUrl: '/materials/12/physics/thermodynamics/zeroth-law/material.pdf',
                },
              ]
            }
          ],
        },
        {
          id: 'math',
          name: 'Math',
          name_bn: 'গণিত',
          chapters: [
            {
              id: 'calculus',
              name: 'Calculus',
              name_bn: 'ক্যালকুলাস',
              topics: [
                {
                  id: 'differentiation',
                  name: "Differentiation",
                  name_bn: 'অন্তরীকরণ',
                  pdfUrl: '/materials/12/math/calculus/differentiation/material.pdf',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 11,
      name: 'Class 11',
      name_bn: 'একাদশ শ্রেণী',
      subjects: [
        {
          id: 'chemistry',
          name: 'Chemistry',
          name_bn: 'রসায়ন',
          chapters: [
            {
              id: 'periodic-table',
              name: 'Periodic Table',
              name_bn: 'পর্যায় সারণী',
              topics: [
                {
                  id: 'periodic-trends',
                  name: 'Periodic Trends',
                  name_bn: 'পর্যায়বৃত্ত ধর্ম',
                  pdfUrl: '/materials/11/chemistry/periodic-table/periodic-trends/material.pdf',
                },
              ]
            }
          ]
        }
      ]
    },
    {
      id: 10,
      name: 'Class 10',
      name_bn: 'দশম শ্রেণী',
      subjects: [
        {
          id: 'bangla',
          name: 'Bangla',
          name_bn: 'বাংলা',
          chapters: [
            {
              id: 'literature',
              name: 'Literature',
              name_bn: 'সাহিত্য',
              topics: [
                {
                  id: 'kazi-nazrul-islam',
                  name: 'Kazi Nazrul Islam',
                  name_bn: 'কাজী নজরুল ইসলাম',
                  pdfUrl: '/materials/10/bangla/literature/kazi-nazrul-islam/material.pdf',
                },
              ]
            }
          ]
        }
      ]
    }
  ];
}

// Updated getTopicBySlug function that works with async curriculum data
export async function getTopicBySlug(slug: string[]) {
  if (slug.length !== 4) return null;
  const [classId, subjectId, chapterId, topicId] = slug;
  
  const curriculum = await getCurriculumData();
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

// Synchronous version for backward compatibility (uses fallback if no cache)
export function getTopicBySlugSync(slug: string[]) {
  if (slug.length !== 4) return null;
  const [classId, subjectId, chapterId, topicId] = slug;
  
  const curriculum = curriculumCache || getFallbackCurriculum();
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
