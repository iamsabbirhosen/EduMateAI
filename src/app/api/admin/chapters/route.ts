import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// Simple admin auth check
function isAdminRequest(request: NextRequest): boolean {
  const referer = request.headers.get('referer');
  return !!(referer && referer.includes('localhost:9002/admin'));
}

// Helper function to transliterate Bengali to English
function transliterateBengali(bengaliText: string): string {
  const bengaliToEnglish: { [key: string]: string } = {
    // Chemistry chapters
    'পর্যায় সারণি': 'periodic-table',
    'রাসায়নিক বন্ধন': 'chemical-bonding',
    'রাসায়নিক গতিবিদ্যা': 'chemical-kinetics',
    'তড়িৎ রসায়ন': 'electrochemistry',
    'জৈব রসায়ন': 'organic-chemistry',
    
    // Physics chapters
    'নিউটনের গতিবিদ্যা': 'newtonian-mechanics',
    'তাপগতিবিদ্যা': 'thermodynamics',
    'আলোকবিজ্ঞান': 'optics',
    'তড়িৎবিজ্ঞান': 'electricity',
    'চুম্বকত্ব': 'magnetism',
    
    // Math chapters
    'ক্যালকুলাস': 'calculus',
    'বীজগণিত': 'algebra',
    'জ্যামিতি': 'geometry',
    'ত্রিকোণমিতি': 'trigonometry',
    'পরিসংখ্যান': 'statistics',
    
    // Bengali literature
    'কবিতা': 'poetry',
    'গল্প': 'stories',
    'উপন্যাস': 'novels',
    'নাটক': 'drama',
    'কাজী নজরুল ইসলাম': 'kazi-nazrul-islam',
    'রবীন্দ্রনাথ ঠাকুর': 'rabindranath-tagore',
  };

  if (bengaliToEnglish[bengaliText]) {
    return bengaliToEnglish[bengaliText];
  }

  // Fallback: convert to kebab case
  return bengaliText
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function POST(request: NextRequest) {
  // Check admin authentication
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { classId, subjectId, name, name_bn } = await request.json();

    if (!classId || !subjectId || !name || !name_bn) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Convert Bengali name to English folder name
    const chapterId = transliterateBengali(name_bn);

    // Create chapter directory
    const chapterPath = path.join(process.cwd(), 'public', 'materials', classId.toString(), subjectId, chapterId);
    
    try {
      await fs.access(chapterPath);
      return NextResponse.json({ error: 'Chapter already exists' }, { status: 409 });
    } catch {
      // Directory doesn't exist, create it
      await fs.mkdir(chapterPath, { recursive: true });
    }

    // Create metadata file
    const metadataPath = path.join(chapterPath, '.metadata.json');
    const metadata = {
      id: chapterId,
      name,
      name_bn,
      classId,
      subjectId,
      created: new Date().toISOString()
    };
    
    await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2));

    return NextResponse.json({ 
      success: true, 
      message: 'Chapter created successfully',
      data: { chapterId, name, name_bn, classId, subjectId }
    });

  } catch (error) {
    console.error('Error creating chapter:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  // Check admin authentication
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const url = new URL(request.url);
    const chapterId = url.pathname.split('/').pop();
    const { classId, subjectId } = await request.json();

    if (!chapterId || !classId || !subjectId) {
      return NextResponse.json({ error: 'Chapter ID, Subject ID, and Class ID are required' }, { status: 400 });
    }

    const chapterPath = path.join(process.cwd(), 'public', 'materials', classId.toString(), subjectId, chapterId);
    
    try {
      await fs.access(chapterPath);
      await fs.rm(chapterPath, { recursive: true });
      
      return NextResponse.json({ 
        success: true, 
        message: 'Chapter deleted successfully' 
      });
    } catch {
      return NextResponse.json({ error: 'Chapter not found' }, { status: 404 });
    }

  } catch (error) {
    console.error('Error deleting chapter:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
