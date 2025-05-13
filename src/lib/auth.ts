import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { z } from "zod";

import { prisma } from "./prisma";


// User schema for validation
const userSchema = z.object({ 
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().optional(),
});

const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
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
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log('[Auth] Missing credentials');
          return null;
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email }
          });

          if (!user || !user.passwordHash) { 
            console.log('[Auth] User not found or no password:', credentials.email);
            return null;
          }

          const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
          
          if (!isValid) { 
            console.log('[Auth] Invalid password for user:', credentials.email);
            return null;
          }

          console.log('[Auth] Authentication successful:', { 
            email: user.email, 
            id: user.id 
          });
          
          return { 
            id: user.id,
            email: user.email,
            name: user.name
          };
        } catch (error) { 
          console.error('[Auth] Authentication error:', error);
          return null;
        }
      }
    }),
    GoogleProvider({ 
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    })
  ],
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
          accountType: account?.type,
          expires: token?.exp,
          issued: token?.iat,
          timestamp: new Date().toISOString()
        });
        
        // Only update the token if we have user data (during sign-in)
        if (user && typeof user === 'object') {
          token.id = user.id;
          token.email = user.email;
          token.name = user.name;
        }
        return token;
      } catch (error) {
        console.error('[Auth] JWT callback error:', error);
        return token;
      }
    },
    async session({ session, token, trigger }) {
      try {
        console.log('[Auth] Session Callback:', { 
          event: trigger,
          sessionUserId: session?.user?.id, 
          tokenId: token?.id,
          sessionExpiry: session?.expires,
          tokenExpiry: token?.exp,
          timestamp: new Date().toISOString()
        });
        
        // Only update session if we have token data and session.user exists
        if (token && typeof token === 'object' && session) {
          // Initialize the user object if it doesn't exist
          if (!session.user) session.user = {};
          
          // Safely assign properties from token to session.user
          if (token.id) session.user.id = token.id as string;
          if (token.email) session.user.email = token.email as string;
          if (token.name) session.user.name = token.name as string;
        }
        return session;
      } catch (error) {
        console.error('[Auth] Session callback error:', error);
        // Return a valid empty session object instead of the incomplete one
        return {
          expires: new Date(Date.now() + 86400000).toISOString(),
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
  secret: process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET,
};

// Export authOptions as default and named export
export { authOptions };
export default authOptions;

export type UserCredentials = z.infer<typeof userSchema>;

// Social login types
export type SocialProvider = 'github' | 'gmail';

export interface SocialLoginCredentials {
  provider: SocialProvider;
  providerToken: string;
}

interface RegisterUserParams {
  email: string;
  password: string;
  name?: string;
}

export async function registerUser({ email, password, name }: RegisterUserParams) {
  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash: hashedPassword,
      name,
      organizations: {
        create: {
          organization: {
            create: {
              name: `${name || email}'s Organization`,
              plan: 'free',
            }
          },
          role: 'OWNER',
        }
      }
    },
    select: {
      id: true,
      email: true,
      name: true,
    }
  });

  return user;
}

export async function verifyPassword(hashedPassword: string, password: string) {
  return bcrypt.compare(password, hashedPassword);
}

export async function authenticateUser(email: string, password: string) {
  console.log('Starting authentication for email:', email);
  
  try {
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user || !user.passwordHash) { console.log('User not found:', email);
      throw new Error('Invalid credentials');
        }

    console.log('Found user:', { email: user.email, id: user.id     });
    
    const isValid = await bcrypt.compare(password, user.passwordHash);
    console.log('Password validation result:', isValid);
    
    if (!isValid) { console.log('Invalid password for user:', email);
      throw new Error('Invalid credentials');
        }

    // Return user without password
    const { passwordHash, ...userWithoutPassword } = user;
    console.log('Authentication successful:', { email: userWithoutPassword.email, id: userWithoutPassword.id     });
    return userWithoutPassword;
  } catch (error) { console.error('Authentication error:', error);
    throw error;
      }
}

export async function getUserById(id: string) {
  const user = await prisma.user.findUnique({
    where: { id }
  });

  if (!user) {
    return null;
  }

  const { passwordHash, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

export async function authenticateWithSocialProvider(provider: SocialProvider, code: string) {
  // For GitHub, we continue to use the mock implementation for now
  if (provider === 'github') {
    // Use the mock profile for GitHub
    const profile = { id: 'github-123456',
      email: 'github-user@example.com',
      name: 'GitHub User',
        };
    
    // Check if user already exists
    const users = getUsers();
    let user = null;
    
    // Look for existing user with this provider ID or email
    for (const existingUser of Array.from(users.values())) {
      if (existingUser.email === profile.email) {
        user = existingUser;
        break;
      }
    }
    
    // If user doesn't exist, create a new one
    if (!user) {
      const userId = `${provider}-${btoa(profile.email).slice(0, 16)}`;
      user = { id: userId,
        email: profile.email,
        name: profile.name,
        provider: provider,
        providerId: profile.id,
          };
      
      users.set(profile.email, user);
      saveUsers(users);
    }
    
    // Return user
    return { id: user.id,
      email: user.email,
      name: user.name,
        };
  }
  
  // For Gmail (Google), implement proper OAuth flow
  if (provider === 'gmail') {
    // Validate the authorization code
    if (!code || code.startsWith('mock-auth-code')) {
      throw new Error('Invalid authorization code. Please authenticate with Google.');
    }
    
    try {
      // In a real implementation, exchange the code for tokens with Google's OAuth endpoint
      // This would be a server-side operation for security
      
      // For now, we'll simulate a failure if the code doesn't look like a real Google auth code
      // This prevents the automatic access that was happening before
      if (!code.includes('google') && !code.includes('oauth')) {
        throw new Error('Invalid Google authentication. Please sign in with your Google account.');
      }
      
      // Simulate fetching the user profile from Google
      // In a real implementation, we would use the access token to get user info from Google
      const email = code.includes('@') ? code.split('@')[0] + '@gmail.com' : 'user@gmail.com';
      const profile = {
        id: `google-${Date.now()}`,
        email: email,
        name: email.split('@')[0],
      };
      
      // Check if user already exists
      const users = getUsers();
      let user = null;
      
      // Look for existing user with this email
      for (const existingUser of Array.from(users.values())) {
        if (existingUser.email === profile.email) {
          user = existingUser;
          break;
        }
      }
      
      // If user doesn't exist, create a new one
      if (!user) {
        const userId = `${provider}-${btoa(profile.email).slice(0, 16)}`;
        user = { id: userId,
          email: profile.email,
          name: profile.name,
          provider: provider,
          providerId: profile.id,
            };
        
        users.set(profile.email, user);
        saveUsers(users);
      }
      
      // Return user
      return { id: user.id,
        email: user.email,
        name: user.name,
          };
    } catch (error) { console.error('Google authentication error:', error);
      throw new Error('Failed to authenticate with Google. Please try again.');
        }
  }
  
  throw new Error(`Unsupported provider: ${provider}`);
}

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