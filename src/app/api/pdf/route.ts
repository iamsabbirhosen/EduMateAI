import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// Simple in-memory cache for PDF files
const pdfCache = new Map<string, { buffer: Buffer; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filePath = searchParams.get('path');
    
    if (!filePath) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Quick validation - only allow specific patterns
    if (filePath.includes('..') || 
        !filePath.startsWith('/materials/') || 
        !filePath.endsWith('/material.pdf')) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Simplified referer check (less strict for performance)
    const referer = request.headers.get('referer');
    if (!referer || !referer.includes('localhost:9002')) {
      return NextResponse.json({ error: 'Direct access not allowed' }, { status: 403 });
    }

    const fullPath = path.join(process.cwd(), 'public', filePath);
    
    // Check cache first
    const cached = pdfCache.get(fullPath);
    const now = Date.now();
    
    let fileBuffer: Buffer;
    
    if (cached && (now - cached.timestamp) < CACHE_DURATION) {
      // Use cached version
      fileBuffer = cached.buffer;
    } else {
      try {
        // Async file read for better performance
        fileBuffer = await fs.readFile(fullPath);
        // Cache the file
        pdfCache.set(fullPath, { buffer: fileBuffer, timestamp: now });
      } catch (error) {
        return NextResponse.json({ error: 'Content not found' }, { status: 404 });
      }
    }
    
    // Create response with optimized headers
    const response = new NextResponse(fileBuffer);
    
    response.headers.set('Content-Type', 'application/pdf');
    response.headers.set('Content-Disposition', 'inline; filename="protected.pdf"');
    response.headers.set('Cache-Control', 'private, max-age=300'); // 5 minutes cache
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'SAMEORIGIN');
    
    return response;
  } catch (error) {
    console.error('Error serving PDF:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
