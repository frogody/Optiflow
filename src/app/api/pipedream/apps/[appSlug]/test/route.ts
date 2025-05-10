import { NextResponse } from 'next/server';

// Removed import: import { getPipedreamConfig } from '../../../../../../lib/pipedream/config.js';
// import { मानव } from '@/lib/db.js'; // Assuming this is a placeholder/example - Commenting out due to missing export, or incorrect named import

// --- Inlined PipedreamConfig and getPipedreamConfig logic ---
interface PipedreamConfig { 
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scopes: string[];
  environment: string;
}

const baseUrl_inline = process.env['NEXT_PUBLIC_APP_URL'] || (process.env['NODE_ENV'] === 'production' 
  ? 'https://app.isyncso.com'
  : 'http://localhost:3000');

const getPipedreamConfig_inline = (): PipedreamConfig => { 
  return {
    clientId: process.env['NEXT_PUBLIC_PIPEDREAM_CLIENT_ID'] || '',
    clientSecret: process.env['PIPEDREAM_CLIENT_SECRET'] || '',
    redirectUri: `${baseUrl_inline}/api/pipedream/callback`,
    scopes: ['read_workflows', 'write_workflows'], 
    environment: process.env['PIPEDREAM_PROJECT_ENVIRONMENT'] || 'production'
  };
};
// --- End Inlined Logic ---

export async function POST(
  request: Request,
  { params }: { params: { appSlug: string     } }
) {
  try {
    const config = getPipedreamConfig_inline();
    const { appSlug } = params;
    const { actionId, actionConfig } = await request.json();

    const response = await fetch(`https://api.pipedream.com/v1/apps/${appSlug}/actions/${actionId}/test`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.clientSecret}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        config: actionConfig,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Connection test failed');
    }

    const result = await response.json();
    return NextResponse.json({ 
      success: true,
      message: 'Connection test successful',
      data: result,
    });
  } catch (error) {
    console.error('Error testing app connection:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to test app connection' 
      },
      { status: 500     }
    );
  }
} 