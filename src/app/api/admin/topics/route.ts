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
    // Physics topics
    'নিউটনের প্রথম সূত্র': 'newtons-1st-law',
    'নিউটনের দ্বিতীয় সূত্র': 'newtons-2nd-law',
    'নিউটনের তৃতীয় সূত্র': 'newtons-3rd-law',
    'তাপের শূন্যতম সূত্র': 'zeroth-law',
    'তাপের প্রথম সূত্র': 'first-law',
    'তাপের দ্বিতীয় সূত্র': 'second-law',
    
    // Chemistry topics
    'পর্যায়বৃত্ত প্রবণতা': 'periodic-trends',
    'ইলেকট্রন বিন্যাস': 'electron-configuration',
    'পারমাণবিক গঠন': 'atomic-structure',
    'রাসায়নিক বিক্রিয়া': 'chemical-reactions',
    
    // Math topics
    'অন্তরকরণ': 'differentiation',
    'সমাকলন': 'integration',
    'সীমা': 'limits',
    'ধারাবাহিকতা': 'continuity',
    'বহুপদী সমীকরণ': 'polynomial-equations',
    
    // Bengali literature topics
    'সাহিত্যিক পরিচয়': 'literary-introduction',
    'কবিতা বিশ্লেষণ': 'poetry-analysis',
    'গল্প পর্যালোচনা': 'story-review',
    'চরিত্র বিশ্লেষণ': 'character-analysis',
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
    const formData = await request.formData();
    const classId = formData.get('classId') as string;
    const subjectId = formData.get('subjectId') as string;
    const chapterId = formData.get('chapterId') as string;
    const name = formData.get('name') as string;
    const name_bn = formData.get('name_bn') as string;
    const pdfFile = formData.get('pdf') as File | null;

    if (!classId || !subjectId || !chapterId || !name || !name_bn) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Convert Bengali name to English folder name
    const topicId = transliterateBengali(name_bn);

    // Create topic directory
    const topicPath = path.join(process.cwd(), 'public', 'materials', classId, subjectId, chapterId, topicId);
    
    try {
      await fs.access(topicPath);
      return NextResponse.json({ error: 'Topic already exists' }, { status: 409 });
    } catch {
      // Directory doesn't exist, create it
      await fs.mkdir(topicPath, { recursive: true });
    }

    // Handle PDF file upload if provided
    if (pdfFile && pdfFile.size > 0) {
      const pdfPath = path.join(topicPath, 'material.pdf');
      const buffer = Buffer.from(await pdfFile.arrayBuffer());
      await fs.writeFile(pdfPath, buffer);
    }

    // Create metadata file
    const metadataPath = path.join(topicPath, '.metadata.json');
    const metadata = {
      id: topicId,
      name,
      name_bn,
      classId,
      subjectId,
      chapterId,
      hasPdf: !!pdfFile && pdfFile.size > 0,
      created: new Date().toISOString()
    };
    
    await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2));

    return NextResponse.json({ 
      success: true, 
      message: 'Topic created successfully',
      data: { topicId, name, name_bn, classId, subjectId, chapterId, hasPdf: metadata.hasPdf }
    });

  } catch (error) {
    console.error('Error creating topic:', error);
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
    const topicId = url.pathname.split('/').pop();
    const { classId, subjectId, chapterId } = await request.json();

    if (!topicId || !classId || !subjectId || !chapterId) {
      return NextResponse.json({ error: 'Topic ID, Chapter ID, Subject ID, and Class ID are required' }, { status: 400 });
    }

    const topicPath = path.join(process.cwd(), 'public', 'materials', classId, subjectId, chapterId, topicId);
    
    try {
      await fs.access(topicPath);
      await fs.rm(topicPath, { recursive: true });
      
      return NextResponse.json({ 
        success: true, 
        message: 'Topic deleted successfully' 
      });
    } catch {
      return NextResponse.json({ error: 'Topic not found' }, { status: 404 });
    }

  } catch (error) {
    console.error('Error deleting topic:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  // Check admin authentication
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const topicId = formData.get('topicId') as string;
    const classId = formData.get('classId') as string;
    const subjectId = formData.get('subjectId') as string;
    const chapterId = formData.get('chapterId') as string;
    const pdfFile = formData.get('pdf') as File | null;

    if (!topicId || !classId || !subjectId || !chapterId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const topicPath = path.join(process.cwd(), 'public', 'materials', classId, subjectId, chapterId, topicId);
    
    try {
      await fs.access(topicPath);
    } catch {
      return NextResponse.json({ error: 'Topic not found' }, { status: 404 });
    }

    // Update PDF file if provided
    if (pdfFile && pdfFile.size > 0) {
      const pdfPath = path.join(topicPath, 'material.pdf');
      const buffer = Buffer.from(await pdfFile.arrayBuffer());
      await fs.writeFile(pdfPath, buffer);

      // Update metadata
      const metadataPath = path.join(topicPath, '.metadata.json');
      try {
        const metadataContent = await fs.readFile(metadataPath, 'utf-8');
        const metadata = JSON.parse(metadataContent);
        metadata.hasPdf = true;
        metadata.updated = new Date().toISOString();
        await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2));
      } catch {
        // If metadata doesn't exist, create it
        const metadata = {
          id: topicId,
          classId,
          subjectId,
          chapterId,
          hasPdf: true,
          updated: new Date().toISOString()
        };
        await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2));
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Topic updated successfully'
    });

  } catch (error) {
    console.error('Error updating topic:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
