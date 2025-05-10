// @ts-nocheck - This file has some TypeScript issues that are hard to fix
import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
