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
    'রসায়ন': 'chemistry',
    'পদার্থবিজ্ঞান': 'physics', 
    'গণিত': 'mathematics',
    'জীববিজ্ঞান': 'biology',
    'ইংরেজি': 'english',
    'বাংলা': 'bangla',
    'ইতিহাস': 'history',
    'ভূগোল': 'geography',
    'সামাজিক বিজ্ঞান': 'social-science',
    'সাধারণ বিজ্ঞান': 'general-science',
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
    const { classId, name, name_bn } = await request.json();

    if (!classId || !name || !name_bn) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Convert Bengali name to English folder name
    const subjectId = transliterateBengali(name_bn);

    // Create subject directory
    const subjectPath = path.join(process.cwd(), 'public', 'materials', classId.toString(), subjectId);
    
    try {
      await fs.access(subjectPath);
      return NextResponse.json({ error: 'Subject already exists' }, { status: 409 });
    } catch {
      // Directory doesn't exist, create it
      await fs.mkdir(subjectPath, { recursive: true });
    }

    // Create metadata file
    const metadataPath = path.join(subjectPath, '.metadata.json');
    const metadata = {
      id: subjectId,
      name,
      name_bn,
      classId,
      created: new Date().toISOString()
    };
    
    await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2));

    return NextResponse.json({ 
      success: true, 
      message: 'Subject created successfully',
      data: { subjectId, name, name_bn, classId }
    });

  } catch (error) {
    console.error('Error creating subject:', error);
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
    const subjectId = url.pathname.split('/').pop();
    const { classId } = await request.json();

    if (!subjectId || !classId) {
      return NextResponse.json({ error: 'Subject ID and Class ID are required' }, { status: 400 });
    }

    const subjectPath = path.join(process.cwd(), 'public', 'materials', classId.toString(), subjectId);
    
    try {
      await fs.access(subjectPath);
      await fs.rm(subjectPath, { recursive: true });
      
      return NextResponse.json({ 
        success: true, 
        message: 'Subject deleted successfully' 
      });
    } catch {
      return NextResponse.json({ error: 'Subject not found' }, { status: 404 });
    }

  } catch (error) {
    console.error('Error deleting subject:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
