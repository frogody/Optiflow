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

// Helper function to validate and sanitize URLs
function isValidRedirectUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;
    
    // Only allow our domains and localhost
    const allowedDomains = ['app.isyncso.com', 'localhost'];
    if (!allowedDomains.includes(hostname)) {
      return false;
    }

    // Don't allow auth-related paths
    const blockedPaths = ['/login', '/auth', '/signin', '/signout'];
    return !blockedPaths.some(path => urlObj.pathname.includes(path));
  } catch {
    // For relative URLs, just check the path
    return !url.includes('/login') && !url.includes('/auth');
  }
}

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  
  // Skip middleware for static assets and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/api/health')
  ) {
    return NextResponse.next();
  }

  // Allow public paths without authentication
  if (matchesPath(pathname, publicPaths)) {
    // Prevent redirect loops on public paths
    if (pathname === '/login' || pathname === '/signup') {
      const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
      if (token) {
        // If already authenticated, redirect to dashboard
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }
    return NextResponse.next();
  }

  try {
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    });

    if (!token) {
      const loginUrl = new URL('/login', request.url);
      
      // Only set callbackUrl for valid redirect URLs
      const currentUrl = `${pathname}${search}`;
      if (isValidRedirectUrl(currentUrl)) {
        loginUrl.searchParams.set('callbackUrl', currentUrl);
      }

      // Set a session cookie to track redirect attempts
      const response = NextResponse.redirect(loginUrl);
      const redirectCount = parseInt(request.cookies.get('redirectCount')?.value || '0');
      
      if (redirectCount > 5) {
        // Too many redirects, reset and go to dashboard
        response.cookies.set('redirectCount', '0');
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
      
      response.cookies.set('redirectCount', (redirectCount + 1).toString());
      return response;
    }

    // Reset redirect count on successful auth
    const response = NextResponse.next();
    response.cookies.set('redirectCount', '0');

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
    // On error, redirect to login without any callback URL
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