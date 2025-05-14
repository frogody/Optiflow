import NextAuth from "next-auth";
import { authOptions } from '@/lib/auth';

// Fix the NextAuth URL if needed - this addresses the issue with the URL in the environment
if (process.env.NODE_ENV === 'development' && process.env.NEXTAUTH_URL?.includes('isyncso.com')) {
  console.log('[NextAuth] Overriding NEXTAUTH_URL in development environment');
  process.env.NEXTAUTH_URL = 'http://localhost:3987';
}

console.log('[NextAuth] Configuration:', {
  url: process.env.NEXTAUTH_URL,
  hasSecret: !!process.env.NEXTAUTH_SECRET,
  environment: process.env.NODE_ENV,
  timestamp: new Date().toISOString()
});

// Create a single NextAuth handler with our options
const handler = NextAuth(authOptions);

// Export the handler as both GET and POST methods
export { handler as GET, handler as POST };
