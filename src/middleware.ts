import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const pathname = request.nextUrl.pathname;

  // Fast path: Block direct PDF access
  if (pathname.startsWith('/materials/') && pathname.endsWith('.pdf')) {
    return new NextResponse('Access denied', { status: 403 });
  }

  // Optimized security headers for PDF API only
  if (pathname.startsWith('/api/pdf')) {
    response.headers.set('X-Frame-Options', 'SAMEORIGIN');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Cache-Control', 'private, max-age=300');
  }

  return response;
}

export const config = {
  matcher: [
    '/api/pdf/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
