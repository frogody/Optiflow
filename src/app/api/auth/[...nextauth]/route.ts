import NextAuth from "next-auth";
import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Ensure required environment variables are set
const requiredEnvVars = [
  'NEXTAUTH_URL',
  'NEXTAUTH_SECRET',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET'
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    CredentialsProvider({
      name: "Admin Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        // Check for hardcoded admin credentials
        if (credentials.email === "demo@example.com" && credentials.password === "password123") {
          // Return a mock user object
          return {
            id: "admin-user",
            email: credentials.email,
            name: "Demo Admin",
          };
        }

        throw new Error("Invalid credentials");
      }
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Only allow internal redirects
      if (url.startsWith(baseUrl)) return url;
      // Allow relative URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      return baseUrl;
    }
  },
  pages: {
    signIn: '/login',
    error: '/login',
    signOut: '/login'
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'database',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'production' ? '__Secure-next-auth.session-token' : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      }
    }
  },
  debug: false
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 