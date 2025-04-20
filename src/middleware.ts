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
  '/api/auth',
  '/api/auth/callback',
  '/api/auth/callback/google',
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
    // Check if path starts with any public path pattern
    if (path.startsWith(pattern)) return true;
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

// Helper function to check if a path is auth-related
function isAuthRelatedPath(path: string): boolean {
  return path === '/login' || path === '/signup' || path.startsWith('/api/auth/');
}

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  
  // Skip middleware for static assets, API routes and health checks
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/api/health')
  ) {
    return NextResponse.next();
  }

  // Also skip for these specific paths to prevent loops
  if (matchesPath(pathname, publicPaths)) {
    return NextResponse.next();
  }

  try {
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    });

    // If the user is authenticated and trying to access auth pages, redirect to dashboard
    if (token && isAuthRelatedPath(pathname)) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // If the user is not authenticated and trying to access protected routes
    if (!token && !matchesPath(pathname, publicPaths)) {
      // Create login URL with callback
      const loginUrl = new URL('/login', request.url);
      
      // Only set callbackUrl if it's not an auth-related path and it's not already a login page
      if (!isAuthRelatedPath(pathname) && pathname !== '/login') {
        const fullPath = `${pathname}${search}`;
        loginUrl.searchParams.set('callbackUrl', fullPath);
      }
      
      return NextResponse.redirect(loginUrl);
    }

    // User is either authenticated accessing protected routes
    // or unauthenticated accessing public routes
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
    // In case of error, allow the request to proceed
    return NextResponse.next();
  }
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|public/).*)',
  ],
}; 