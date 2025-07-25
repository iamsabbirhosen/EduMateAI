import { NextRequest } from 'next/server';

export function checkAdminAuth(request: NextRequest): boolean {
  // Simple auth check - in production, you'd want proper JWT validation
  const authHeader = request.headers.get('authorization');
  
  // Check for simple auth token or hardcoded admin access
  if (authHeader === 'Bearer admin-access-token') {
    return true;
  }
  
  // For development, allow requests from the same domain
  const referer = request.headers.get('referer');
  if (referer && referer.includes('localhost:9002/admin')) {
    return true;
  }
  
  return false;
}

export function createAuthResponse() {
  return new Response(JSON.stringify({ error: 'Unauthorized' }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' }
  });
}
