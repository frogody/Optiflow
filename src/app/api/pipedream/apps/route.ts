import { NextResponse } from 'next/server';
import { getPipedreamConfig } from '@/lib/pipedream/config';

export async function GET() {
  try {
    const config = getPipedreamConfig();
    
    // Fetch apps from Pipedream API
    const response = await fetch('https://api.pipedream.com/v1/apps', {
      headers: {
        'Authorization': `Bearer ${config.clientSecret}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch apps: ${response.statusText}`);
    }

    const apps = await response.json();
    
    // Transform the response to include only necessary data
    const transformedApps = apps.map((app: any) => ({
      slug: app.slug,
      name: app.name,
      description: app.description,
      logo: app.logo,
    }));

    return NextResponse.json(transformedApps);
  } catch (error) {
    console.error('Error fetching Pipedream apps:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Pipedream apps' },
      { status: 500 }
    );
  }
} 