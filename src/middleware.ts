import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Public paths that don't require authentication
const publicPaths = [
  '/',
  '/login',
  '/signup',
  '/register',
  '/reset-password',
  '/forgot-password',
  '/features',
  '/integrations',
  '/enterprise',
  '/pricing',
  '/faq',
  '/favicon.ico',
  '/api/health',
  '/api/health/',
];

// Auth-related paths that should bypass middleware
const authPaths = [
  '/api/auth',
  '/api/auth/callback',
  '/api/auth/callback/google',
  '/api/auth/session',
  '/api/auth/signin',
  '/api/auth/signout',
  '/api/auth/providers',
  '/api/auth/csrf',
];

// Helper function to check if a path matches any of the patterns
function matchesPath(path: string, patterns: string[]): boolean {
  return patterns.some(pattern => {
    if (pattern === path) return true;
    if (pattern.endsWith('*') && path.startsWith(pattern.slice(0, -1))) return true;
    return path.startsWith(pattern);
  });
}

// Helper function to validate redirect URLs
function isValidRedirectUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;
    const allowedDomains = ['app.isyncso.com', 'localhost'];
    return allowedDomains.includes(hostname) && !urlObj.pathname.includes('/login');
  } catch {
    return !url.includes('/login');
  }
}

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  
  // Skip middleware for static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') ||
    matchesPath(pathname, authPaths)
  ) {
    return NextResponse.next();
  }

  // Skip middleware for public paths
  if (matchesPath(pathname, publicPaths)) {
    return NextResponse.next();
  }

  try {
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    });

    // If user is authenticated and trying to access login/signup pages
    if (token && (pathname === '/login' || pathname === '/signup')) {
      const response = NextResponse.redirect(new URL('/dashboard', request.url));
      if (token.raw && typeof token.raw === 'string') {
        response.cookies.set('next-auth.session-token', token.raw, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/'
        });
      }
      return response;
    }

    // If user is not authenticated and trying to access protected routes
    if (!token && !matchesPath(pathname, publicPaths)) {
      const loginUrl = new URL('/login', request.url);
      if (!pathname.startsWith('/login')) {
        const callbackUrl = `${pathname}${search}`;
        if (isValidRedirectUrl(callbackUrl)) {
          loginUrl.searchParams.set('callbackUrl', callbackUrl);
        }
      }
      return NextResponse.redirect(loginUrl);
    }

    // Add security headers
    const response = NextResponse.next();
    response.headers.set('X-DNS-Prefetch-Control', 'on');
    response.headers.set('Strict-Transport-Security', 'max-age=63072000');
    response.headers.set('X-Frame-Options', 'SAMEORIGIN');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
    
    // Set session cookie if token exists
    if (token?.raw && typeof token.raw === 'string') {
      response.cookies.set('next-auth.session-token', token.raw, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/'
      });
    }
    
    return response;
  } catch (error) {
    console.error('Middleware error:', error);
    // On error, proceed without redirection to prevent loops
    return NextResponse.next();
  }
}

export const config = {
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico|public/).*)'],
}; 