import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// List of paths that require authentication
const authRequiredPaths = [
  '/dashboard',
  '/connections',
  '/workflows',
  '/tools',
  '/analytics',
]

// Paths that should be accessible without authentication
const publicPaths = [
  '/',
  '/login',
  '/api/auth',
]

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  
  // Check if path requires authentication
  const isAuthRequired = authRequiredPaths.some(p => path.startsWith(p))
  const isPublic = publicPaths.some(p => path.startsWith(p)) || path.includes('.')
  
  if (!isAuthRequired || isPublic) {
    return NextResponse.next()
  }

  // Get the JWT token from the request
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  })

  // If no token and auth is required, redirect to login
  if (!token && isAuthRequired) {
    const loginUrl = new URL('/login', request.nextUrl.origin)
    loginUrl.searchParams.set('callbackUrl', request.nextUrl.toString())
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (API routes for authentication)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
}
