import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// Simple admin auth check
function isAdminRequest(request: NextRequest): boolean {
  const referer = request.headers.get('referer');
  return !!(referer && referer.includes('localhost:9002/admin'));
}

// Helper function to convert Bengali/English text to URL-safe folder name
function toKebabCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

// Helper function to transliterate Bengali to English (basic)
function transliterateBengali(bengaliText: string): string {
  const bengaliToEnglish: { [key: string]: string } = {
    'রসায়ন': 'chemistry',
    'পদার্থবিজ্ঞান': 'physics', 
    'গণিত': 'mathematics',
    'জীববিজ্ঞান': 'biology',
    'ইংরেজি': 'english',
    'বাংলা': 'bangla',
    'জৈব রসায়ন': 'organic-chemistry',
    'অজৈব রসায়ন': 'inorganic-chemistry',
    'পদার্থের অবস্থা': 'states-of-matter',
    'পদার্থ ও পদার্থের অবস্থা': 'matter-and-states',
    'অ্যাসিড ও ক্ষার': 'acids-and-bases',
    // Add more mappings as needed
  };

  // Check for exact matches first
  if (bengaliToEnglish[bengaliText]) {
    return bengaliToEnglish[bengaliText];
  }

  // Fallback: convert to kebab case
  return toKebabCase(bengaliText);
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

    // Create class directory
    const classPath = path.join(process.cwd(), 'public', 'materials', classId.toString());
    
    try {
      await fs.access(classPath);
      return NextResponse.json({ error: 'Class already exists' }, { status: 409 });
    } catch {
      // Directory doesn't exist, create it
      await fs.mkdir(classPath, { recursive: true });
    }

    // Create a metadata file to store Bengali names
    const metadataPath = path.join(classPath, '.metadata.json');
    const metadata = {
      id: classId,
      name,
      name_bn,
      created: new Date().toISOString()
    };
    
    await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2));

    return NextResponse.json({ 
      success: true, 
      message: 'Class created successfully',
      data: { classId, name, name_bn }
    });

  } catch (error) {
    console.error('Error creating class:', error);
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
    const classId = url.pathname.split('/').pop();

    if (!classId) {
      return NextResponse.json({ error: 'Class ID is required' }, { status: 400 });
    }

    const classPath = path.join(process.cwd(), 'public', 'materials', classId);
    
    try {
      await fs.access(classPath);
      await fs.rm(classPath, { recursive: true });
      
      return NextResponse.json({ 
        success: true, 
        message: 'Class deleted successfully' 
      });
    } catch {
      return NextResponse.json({ error: 'Class not found' }, { status: 404 });
    }

  } catch (error) {
    console.error('Error deleting class:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
