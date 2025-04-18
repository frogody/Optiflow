import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Check database connection
    await prisma.$connect();
    await prisma.user.count();
    await prisma.$disconnect();

    // Check environment variables
    const requiredEnvVars = [
      'NEXTAUTH_URL',
      'NEXTAUTH_SECRET',
      'DATABASE_URL',
      'GOOGLE_CLIENT_ID',
      'GOOGLE_CLIENT_SECRET'
    ];

    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

    if (missingVars.length > 0) {
      throw new Error(`Missing environment variables: ${missingVars.join(', ')}`);
    }

    // Return health status
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
      environment: process.env.NODE_ENV,
      database: 'connected',
      uptime: process.uptime()
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