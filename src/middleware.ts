import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Public paths that don't require authentication
const publicPaths = [
  '/',
  '/login',
  '/signup',
  '/features',
  '/integrations',
  '/enterprise',
  '/pricing',
  '/faq',
  '/api/auth/callback',
  '/api/auth/session',
  '/api/auth/signin',
  '/api/auth/signout',
  '/api/auth/providers',
  '/api/auth/csrf',
  '/api/health',
  '/api/health/',
];

// Helper function to check if a path matches any of the public paths
function matchesPath(path: string, patterns: string[]): boolean {
  return patterns.some(pattern => {
    // Exact match
    if (pattern === path) return true;
    // Pattern ends with wildcard
    if (pattern.endsWith('*') && path.startsWith(pattern.slice(0, -1))) return true;
    return false;
  });
}

// Helper function to sanitize URL for safe redirection
function getSafeRedirectUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    // Only allow redirects to our own domain
    if (urlObj.hostname !== 'app.isyncso.com' && urlObj.hostname !== 'localhost') {
      return '/dashboard';
    }
    // Don't allow redirects to login or auth pages
    if (urlObj.pathname.includes('/login') || urlObj.pathname.includes('/auth')) {
      return '/dashboard';
    }
    return url;
  } catch (e) {
    return '/dashboard';
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for Next.js internal routes, static files, and auth endpoints
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/api/health')
  ) {
    return NextResponse.next();
  }

  // Allow public paths without token check
  if (matchesPath(pathname, publicPaths)) {
    return NextResponse.next();
  }

  try {
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    });
    
    // Redirect to login if no token and trying to access protected route
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      
      // Only set callbackUrl for safe URLs that aren't login/auth related
      if (!pathname.startsWith('/login') && !pathname.startsWith('/auth')) {
        const safeRedirectUrl = getSafeRedirectUrl(request.url);
        if (safeRedirectUrl !== '/dashboard') {
          loginUrl.searchParams.set('callbackUrl', safeRedirectUrl);
        }
      }
      
      return NextResponse.redirect(loginUrl);
    }

    const response = NextResponse.next();

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
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}; 