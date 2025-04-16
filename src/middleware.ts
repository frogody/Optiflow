import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Define public paths that don't require authentication
  const isPublicPath = 
    path === '/' || 
    path === '/login' || 
    path === '/signup' || 
    path === '/home' ||
    path === '/pricing' ||
    path === '/faq' ||
    path.startsWith('/public/') ||
    path.startsWith('/_next/');

  // Authentication protected paths only
  const requiresAuth = 
    path.startsWith('/dashboard') || 
    path.startsWith('/connections') ||
    path.startsWith('/settings') ||
    path.startsWith('/account') ||
    path.startsWith('/workflows') ||
    path.startsWith('/orchestrators') ||
    path.startsWith('/api/protected');

  // Check if user is authenticated (we'll use a cookie in production)
  const isAuthenticated = request.cookies.has('user-token');
  
  // Log authentication status for debugging (only in development)
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[Middleware] Path: ${path}, RequiresAuth: ${requiresAuth}, IsAuthenticated: ${isAuthenticated}`);
    if (isAuthenticated) {
      const tokenValue = request.cookies.get('user-token')?.value;
      console.log(`[Middleware] Token exists: ${tokenValue ? tokenValue.substring(0, 8) + '...' : 'null'}`);
    } else {
      console.log('[Middleware] No authentication token found');
      console.log('[Middleware] Available cookies:', Array.from(request.cookies.getAll()).map(c => c.name).join(', '));
    }
  }

  // Redirect authenticated users away from login page
  if ((path === '/login' || path === '/signup') && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Only redirect unauthenticated users from auth-required paths
  if (requiresAuth && !isAuthenticated) {
    // Store the original URL to redirect back after login
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', request.url);
    return NextResponse.redirect(url);
  }

  // Allow access to the landing page for everyone
  if (path === '/') {
    return NextResponse.next();
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: ['/((?!api/public|_next/static|_next/image|favicon.ico).*)'],
}; 