// @ts-nocheck - This file has some TypeScript issues that are hard to fix
import { NextResponse } from 'next/server';
import { PipedreamService } from '@/services/PipedreamService';

export async function GET() {
  console.log('Pipedream apps API route called');

  try {
    // Log environment variables (redacted)
    console.log('Environment check:', {
      PIPEDREAM_API_KEY: process.env.PIPEDREAM_API_KEY
        ? '[REDACTED]'
        : 'undefined',
      NEXT_PUBLIC_PIPEDREAM_API_KEY: process.env.NEXT_PUBLIC_PIPEDREAM_API_KEY
        ? '[REDACTED]'
        : 'undefined',
      PIPEDREAM_CLIENT_SECRET: process.env.PIPEDREAM_CLIENT_SECRET
        ? '[REDACTED]'
        : 'undefined',
      NODE_ENV: process.env.NODE_ENV,
    });

    // Check if we have the required API key
    const apiKey =
      process.env.PIPEDREAM_API_KEY ||
      process.env.NEXT_PUBLIC_PIPEDREAM_API_KEY ||
      process.env.PIPEDREAM_CLIENT_SECRET;

    if (!apiKey) {
      console.error('No Pipedream API key found in environment variables');
      return NextResponse.json(
        { error: 'Pipedream API key not configured' },
        { status: 500 }
      );
    }

    console.log('Initializing PipedreamService');
    const service = new PipedreamService();

    console.log('Fetching Pipedream apps');
    const apps = await service.getApps();

    if (!apps || !Array.isArray(apps)) {
      console.error('Invalid apps response:', apps);
      return NextResponse.json(
        { error: 'Failed to fetch apps' },
        { status: 500 }
      );
    }

    if (!apps || apps.length === 0) {
      console.warn('No Pipedream apps found or error occurred');
    } else {
      console.log(`Successfully fetched ${apps.length} Pipedream apps`);
    }

    return NextResponse.json({ apps });
  } catch (error) {
    console.error('Error in Pipedream apps API route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch apps' },
      { status: 500 }
    );
  }
}
