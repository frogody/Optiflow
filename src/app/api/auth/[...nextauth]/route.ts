import NextAuth from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from '@/lib/auth';

// Enhanced error handling for Next Auth routes in Next.js 15
export async function GET(req, res) {
  try {
    // Use the NextAuth handler with our auth options
    const handler = NextAuth(authOptions);
    const response = await handler.GET(req, res);
    return response;
  } catch (error) {
    console.error('[NextAuth] Route error:', error);
    // Return empty session for auth errors to prevent client-side crashes
    return NextResponse.json(null, { status: 200 });
  }
}

export async function POST(req, res) {
  try {
    // Use the NextAuth handler with our auth options
    const handler = NextAuth(authOptions);
    const response = await handler.POST(req, res);
    return response;
  } catch (error) {
    console.error('[NextAuth] Route error:', error);
    // Return 500 for auth API errors
    return NextResponse.json(
      { error: "Authentication service error" }, 
      { status: 500 }
    );
  }
}
