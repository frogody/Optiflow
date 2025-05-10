import NextAuth from 'next-auth';

import { authOptions } from '../../../lib/auth.js';

// If NextAuth is an object with a default property due to ESM interop
const NextAuthDefault = (NextAuth as any).default || NextAuth;
const handler = NextAuthDefault(authOptions);

export { handler as GET, handler as POST };
