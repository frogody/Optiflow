import NextAuth from "next-auth";
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

// Define a type that extends the default User type with password
type UserWithPassword = {
  id: string;
  email: string | null;
  name: string | null;
  password: string | null;
};

// Create a single PrismaClient instance and reuse it
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
    console.error(`Missing required environment variable: ${envVar}`);
  }
}

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Email/Password",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "Enter your email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email en wachtwoord zijn verplicht");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        }) as UserWithPassword | null;

        if (!user || !user.password) {
          throw new Error("Ongeldige email of wachtwoord");
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);

        if (!isValid) {
          throw new Error("Ongeldige email of wachtwoord");
        }

        return {
          id: user.id,
          email: user.email || "",
          name: user.name
        };
      }
    }),
  ],
  pages: {
    signIn: '/login',
    error: '/login',
    signOut: '/login'
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
      }
      if (account) {
        token.provider = account.provider;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        // @ts-expect-error - This is needed because the type definitions for NextAuth are not complete
        session.user.provider = token.provider;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Handle empty URL - redirect to dashboard
      if (!url) {
        return `${baseUrl}/dashboard`;
      }
      
      // Handle login callback redirects
      if (url.includes('/api/auth/callback') || url.includes('callback')) {
        return `${baseUrl}/dashboard`;
      }
      
      // Allow relative URLs
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }
      
      // Allow URLs from the same origin
      try {
        const urlObj = new URL(url);
        if (urlObj.origin === baseUrl) {
          return url;
        }
      } catch (e) {
        // If URL parsing fails, redirect to dashboard
        return `${baseUrl}/dashboard`;
      }
      
      // Default to dashboard for all other cases
      return `${baseUrl}/dashboard`;
    }
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);
// @ts-expect-error - This is needed because the type definitions for NextAuth are not complete
export { handler as GET, handler as POST }; 