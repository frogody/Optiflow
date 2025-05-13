import NextAuth from "next-auth";
import { authOptions } from '@/lib/auth';

// Create a single NextAuth handler with our options
const handler = NextAuth(authOptions);

// Export the handler as both GET and POST methods
export { handler as GET, handler as POST };
