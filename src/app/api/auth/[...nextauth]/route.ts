import NextAuth from "next-auth";

import { authOptions } from '@/lib/auth';

// Use the handlers object for Next.js 15 compatibility
export const { GET, POST } = NextAuth(authOptions);
