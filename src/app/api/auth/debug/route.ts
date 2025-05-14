import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const authConfig = {
    nextAuthUrl: process.env.NEXTAUTH_URL,
    nextAuthSecret: process.env.NEXTAUTH_SECRET ? '[REDACTED]' : 'NOT SET',
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV,
    baseUrl: request.nextUrl.origin,
    headers: Object.fromEntries(request.headers.entries()),
    cookies: request.cookies.getAll().map(c => ({ 
      name: c.name, 
      value: c.name.includes('token') || c.name.includes('csrf') ? '[REDACTED]' : c.value
    })),
  };

  return NextResponse.json({ 
    success: true, 
    message: 'Auth debug info',
    config: authConfig,
    timestamp: new Date().toISOString()
  });
} 