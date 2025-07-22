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

export const curriculumData: ClassLevel[] = [
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
            name_bn: 'নিউটনিয়ান বলবিদ্যা',
            topics: [
              {
                id: 'newtons-1st-law',
                name: "Newton's 1st Law",
                name_bn: 'নিউটনের ১ম সূত্র',
                pdfUrl: 'https://placehold.co/800x1100.pdf',
              },
              {
                id: 'newtons-2nd-law',
                name: "Newton's 2nd Law",
                name_bn: 'নিউটনের ২য় সূত্র',
                pdfUrl: 'https://placehold.co/800x1100.pdf',
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
                pdfUrl: 'https://placehold.co/800x1100.pdf',
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
                pdfUrl: 'https://placehold.co/800x1100.pdf',
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
                pdfUrl: 'https://placehold.co/800x1100.pdf',
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
                pdfUrl: 'https://placehold.co/800x1100.pdf',
              },
            ]
          }
        ]
      }
    ]
  },
  // Classes 8 and 9 can be added here with a similar structure
];

export const getTopicBySlug = (slug: string[]) => {
  if (slug.length !== 4) return null;
  const [classId, subjectId, chapterId, topicId] = slug;
  
  const classLevel = curriculumData.find((c) => c.id.toString() === classId);
  if (!classLevel) return null;

  const subject = classLevel.subjects.find((s) => s.id === subjectId);
  if (!subject) return null;

  const chapter = subject.chapters.find((ch) => ch.id === chapterId);
  if (!chapter) return null;

  const topic = chapter.topics.find((t) => t.id === topicId);
  if (!topic) return null;

  return { classLevel, subject, chapter, topic };
};
