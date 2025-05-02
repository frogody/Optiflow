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
  const requestHeaders = new Headers(request.headers);
  const pathname = request.nextUrl.pathname;
  const origin = request.headers.get('origin') || request.nextUrl.origin;
  const host = request.headers.get('host');

  // Debug logging
  console.log('[Middleware Debug]', {
    timestamp: new Date().toISOString(),
    pathname,
    origin,
    host,
    fullUrl: request.nextUrl.toString(),
    method: request.method,
    searchParams: Object.fromEntries(request.nextUrl.searchParams),
    headers: Object.fromEntries(request.headers),
    cookies: request.cookies.getAll(),
    nextAuthUrl: process.env.NEXTAUTH_URL,
    nodeEnv: process.env.NODE_ENV,
    referrer: request.headers.get('referer'),
  });

  // Track potential redirect loops
  const redirectCount = parseInt(request.headers.get('x-redirect-count') || '0');
  if (redirectCount > 3) {
    console.error('[Middleware] Potential redirect loop detected:', {
      pathname,
      redirectCount,
      referrer: request.headers.get('referer')
    });
    // Return to home page with error if loop detected
    return NextResponse.redirect(new URL('/?error=redirect_loop', request.nextUrl.origin));
  }
  
  // Skip middleware for static files, API routes, and public paths
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') ||
    matchesPath(pathname, [...authPaths, ...publicPaths])
  ) {
    return NextResponse.next();
  }

  try {
    // Get the token with consistent cookie settings
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
      secureCookie: true, // Always use secure cookies
      cookieName: process.env.NODE_ENV === 'production' 
        ? '__Secure-next-auth.session-token' 
        : 'next-auth.session-token'
    });

    // Debug logging
    console.log('[Middleware] Auth Check:', { 
      pathname, 
      hasToken: !!token,
      cookieHeader: request.headers.get('cookie'),
      tokenData: token ? { 
        id: token.id,
        email: token.email,
        expires: token.exp,
        issued: token.iat
      } : null
    });

    // If user is authenticated and trying to access login/signup pages
    if (token && (pathname === '/login' || pathname === '/signup')) {
      console.log('[Middleware] Redirecting authenticated user:', { 
        from: pathname,
        to: request.cookies.get('next-auth.callback-url')?.value || '/dashboard',
        tokenExp: token.exp,
        redirectCount
      });
      
      // Get the callback URL from cookie, defaulting to dashboard
      const callbackUrl = request.cookies.get('next-auth.callback-url')?.value || '/dashboard';
      const response = NextResponse.redirect(new URL(callbackUrl, request.nextUrl.origin));
      response.headers.set('x-redirect-count', (redirectCount + 1).toString());
      
      // Ensure cookies are set with proper security
      response.cookies.set({
        name: process.env.NODE_ENV === 'production' 
          ? '__Secure-next-auth.session-token' 
          : 'next-auth.session-token',
        value: request.cookies.get(process.env.NODE_ENV === 'production' 
          ? '__Secure-next-auth.session-token' 
          : 'next-auth.session-token')?.value || '',
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/'
      });
      return response;
    }

    // If user is not authenticated and trying to access protected routes
    if (!token) {
      console.log('[Middleware] Redirecting unauthenticated user:', {
        from: pathname,
        to: '/login',
        redirectCount,
        hasSessionCookie: request.cookies.has(
          process.env.NODE_ENV === 'production' 
            ? '__Secure-next-auth.session-token' 
            : 'next-auth.session-token'
        )
      });
      const loginUrl = new URL('/login', request.nextUrl.origin);
      // Store the original path as callback URL
      loginUrl.searchParams.set('callbackUrl', pathname);
      const response = NextResponse.redirect(loginUrl);
      response.headers.set('x-redirect-count', (redirectCount + 1).toString());
      return response;
    }

    // Add security headers
    const response = NextResponse.next();
    response.headers.set('X-DNS-Prefetch-Control', 'on');
    response.headers.set('Strict-Transport-Security', 'max-age=63072000');
    response.headers.set('X-Frame-Options', 'SAMEORIGIN');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
    
    return response;
  } catch (error) {
    console.error('[Middleware] Error:', {
      error,
      pathname,
      redirectCount,
      stack: error instanceof Error ? error.stack : undefined
    });
    // On error, redirect to login with more context
    const loginUrl = new URL('/login', request.nextUrl.origin);
    loginUrl.searchParams.set('error', 'AuthError');
    loginUrl.searchParams.set('errorDetail', error instanceof Error ? error.message : 'Unknown error');
    const response = NextResponse.redirect(loginUrl);
    response.headers.set('x-redirect-count', (redirectCount + 1).toString());
    return response;
  }
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    '/api/auth/:path*',
    '/api/livekit/:path*',
    '/login',
    '/voice-agent',
    '/dashboard',
  ],
}; 