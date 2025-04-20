import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Check database connection
    let dbStatus = 'connected';
    try {
      await prisma.$connect();
      await prisma.user.count();
      await prisma.$disconnect();
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      dbStatus = 'error';
    }

    // Check environment variables
    const requiredEnvVars = [
      'NEXTAUTH_URL',
      'NEXTAUTH_SECRET',
      'DATABASE_URL',
      'GOOGLE_CLIENT_ID',
      'GOOGLE_CLIENT_SECRET'
    ];

    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

    // Return health status
    return NextResponse.json({
      status: missingVars.length > 0 || dbStatus === 'error' ? 'unhealthy' : 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
      environment: process.env.NODE_ENV,
      uptime: process.uptime(),
      auth: {
        nextAuthUrl: process.env.NEXTAUTH_URL,
        googleClientId: process.env.GOOGLE_CLIENT_ID ? 'configured' : 'missing',
        googleClientSecret: process.env.GOOGLE_CLIENT_SECRET ? 'configured' : 'missing',
      },
      database: {
        status: dbStatus,
        url: process.env.DATABASE_URL ? 'configured' : 'missing',
        type: process.env.DATABASE_URL?.includes('postgresql') ? 'postgresql' : 'sqlite',
        missingVars: missingVars.length > 0 ? missingVars : undefined
      }
    });
  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json(
      {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
} 