import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Public paths that don't require authentication
const publicPaths = [
  '/login',
  '/signup',
  '/api/auth',
  '/api/health',
  '/api/pipedream/callback',
  '/api/oauth/callback',
  '/',
  '/features',
  '/pricing',
  '/enterprise',
  '/faq'
];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Allow public paths
  if (publicPaths.some(p => path.startsWith(p))) {
    return NextResponse.next();
  }

  const token = await getToken({ req: request });
  
  // Redirect to login if no token and trying to access protected route
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', request.url);
    return NextResponse.redirect(loginUrl);
  }

  const response = NextResponse.next();

  // CORS headers
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set('Access-Control-Allow-Origin', process.env.NEXTAUTH_URL || request.headers.get('origin') || '');
  response.headers.set('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT');
  response.headers.set('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Security headers
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');

  // Content Security Policy
  response.headers.set(
    'Content-Security-Policy',
    `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline' https://apis.google.com;
      style-src 'self' 'unsafe-inline';
      img-src 'self' blob: data: https://*.googleusercontent.com;
      font-src 'self';
      connect-src 'self' https://api.pipedream.com https://api.openai.com;
      frame-src 'self' https://accounts.google.com;
      frame-ancestors 'none';
    `.replace(/\s+/g, ' ').trim()
  );

  return response;
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}; 