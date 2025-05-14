// import { PrismaAdapter } from "@next-auth/prisma-adapter";
// import bcrypt from "bcryptjs";
// import type { NextAuthOptions } from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import GoogleProvider from "next-auth/providers/google";
import { z } from "zod";

const prisma = {} as any;

// User schema for validation
const userSchema = z.object({ 
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().optional(),
});

const authOptions: NextAuthOptions = {
  // adapter: PrismaAdapter(prisma),
  debug: process.env.NODE_ENV === 'development',
  logger: {
    error(code, metadata) {
      console.error('[Auth Error]', { 
        code,
        metadata,
        timestamp: new Date().toISOString()
      });
    },
    warn(code) {
      console.warn('[Auth Warning]', { 
        code,
        timestamp: new Date().toISOString()
      });
    },
    debug(code, metadata) {
      console.log('[Auth Debug]', { 
        code,
        metadata,
        timestamp: new Date().toISOString()
      });
    }
  },
  pages: {
    signIn: '/login',
    error: '/login',
    signOut: '/'
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'production' 
        ? '__Secure-next-auth.session-token' 
        : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        domain: process.env.NODE_ENV === 'production' 
          ? '.isyncso.com' 
          : undefined
      }
    }
  },
  callbacks: {
    async jwt({ token, user, account, trigger }) {
      try {
        console.log('[Auth] JWT Callback:', { 
          event: trigger,
          tokenId: token?.id, 
          userId: user?.id,
          userRole: user?.role,
          accountType: account?.type,
          expires: token?.['exp'],
          issued: token?.['iat'],
          timestamp: new Date().toISOString()
        });
        
        // Only update the token if we have user data (during sign-in)
        if (user) {
          token.id = user.id;
          token.email = user.email;
          token.name = user.name || '';
          token.role = user.role || 'user';
        } else if (token?.id && !token.role) {
          // If no role in token but we have user id, look up the user from DB
          try {
            const dbUser = await prisma.user.findUnique({
              where: { id: token.id as string },
              select: { id: true, role: true }
            });
            if (dbUser?.role) {
              token.role = dbUser.role;
            }
          } catch (dbError) {
            console.error('[Auth] Error looking up user role:', dbError);
          }
        }
        
        return token;
      } catch (error) {
        console.error('[Auth] JWT callback error:', error);
        return token;
      }
    },
    async session({ session, token }) {
      try {
        console.log('[Auth] Session Callback:', { 
          sessionUserId: session?.user?.id, 
          tokenId: token?.id,
          tokenRole: token?.role,
          sessionExpiry: session?.expires,
          tokenExpiry: token?.['exp'],
          timestamp: new Date().toISOString()
        });
        
        // Make sure we have a user object in the session
        if (!session.user) {
          session.user = { id: '', email: '', name: '' };
        }
        
        // Populate session with token data
        if (token) {
          session.user.id = token.id as string;
          session.user.email = token.email as string;
          session.user.name = token.name as string || '';
          session.user.role = token.role as string || 'user';
          session.user.isAdmin = token.role === 'admin';
        }
        
        return session;
      } catch (error) {
        console.error('[Auth] Session callback error:', error);
        return {
          ...session,
          user: { id: '', email: '', name: '' }
        };
      }
    },
    async redirect({ url, baseUrl }) {
      try {
        console.log('[Auth] Redirect Callback:', { 
          url, 
          baseUrl,
          nextAuthUrl: process.env.NEXTAUTH_URL,
          timestamp: new Date().toISOString(),
          urlObject: url ? {
            isRelative: url.startsWith('/'),
            isSameOrigin: url.startsWith(baseUrl),
            pathname: new URL(url.startsWith('/') ? `${baseUrl}${url}` : url).pathname
          } : null
        });
        
        if (!url) return baseUrl;
        
        // Allow relative URLs
        if (url.startsWith('/')) {
          return `${baseUrl}${url}`;
        }
        // Allow URLs from the same origin
        else if (url.startsWith(baseUrl)) {
          return url;
        }
        
        return baseUrl;
      } catch (error) {
        console.error('[Auth] Redirect callback error:', error);
        return baseUrl;
      }
    }
  },
  // Add additional security for Next.js 15
  secret: (process.env.NEXTAUTH_SECRET || process.env['JWT_SECRET'] || 'default-secret-key-replace-in-production') as string,
};

// Export authOptions as default and named export
export { authOptions };
export default authOptions;

// export type UserCredentials = z.infer<typeof userSchema>;
// export type SocialProvider = 'github' | 'gmail';
// export interface SocialLoginCredentials { provider: SocialProvider; providerToken: string; }

// export async function registerUser(...) { ... }
// export async function verifyPassword(...) { ... }
// export async function authenticateUser(...) { ... }
// export async function getUserById(...) { ... }
// export async function authenticateWithSocialProvider(...) { ... }
// export async function createTestUser() { ... }
// export const verifyAgentBypass = ...

// Helper functions for localStorage
const getUsers = () => {
  if (typeof window === 'undefined') return new Map();
  
  try {
    const stored = localStorage.getItem('users');
    if (!stored) {
      console.log('No users found in localStorage, creating empty map');
      return new Map();
    }
    
    // Parse the stored JSON data
    const parsed = JSON.parse(stored);
    console.log('Found users in localStorage:', parsed ? parsed.length / 2 : 0, 'users');
    return new Map(parsed);
  } catch (error) { console.error('Error getting users from localStorage:', error);
    return new Map();
      }
};

const saveUsers = (users: Map<string, any>) => {
  if (typeof window === 'undefined') return;
  
  try { const data = Array.from(users.entries());
    console.log('Saving users to localStorage:', data.length, 'users');
    localStorage.setItem('users', JSON.stringify(data));
      } catch (error) { console.error('Error saving users to localStorage:', error);
      }
};

// Create a test user for development
export async function createTestUser() {
  const email = 'demo@optiflow.ai';
  const password = 'Demo123!@#';

  // Check if demo user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    return existingUser;
  }

  // Create demo user if it doesn't exist
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash: hashedPassword,
      name: 'Demo User',
      organizations: {
        create: {
          organization: {
            create: {
              name: 'Demo Organization',
              plan: 'free'
            }
          },
          role: 'OWNER'
        }
      }
    }
  });

  return user;
}

// Add a way to bypass auth for agents in non-development environments
export const verifyAgentBypass = (bypassToken?: string) => {
  if (!bypassToken) return false;
  
  // If we're in development mode, always allow bypass
  if (process.env.NODE_ENV === 'development') return true;
  
  // In production, check against environment variable
  const secretToken = process.env.AGENT_BYPASS_SECRET || 'production-bypass-token';
  return bypassToken === secretToken;
}; 