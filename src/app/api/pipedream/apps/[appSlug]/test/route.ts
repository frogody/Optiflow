import { NextResponse } from 'next/server';

import { getPipedreamConfig } from '../../../../../../lib/pipedream/config.js';
// import { मानव } from '@/lib/db.js'; // Assuming this is a placeholder/example - Commenting out due to missing export, or incorrect named import

export async function POST(
  request: Request,
  { params }: { params: { appSlug: string     } }
) {
  try {
    const config = getPipedreamConfig();
    const { appSlug } = params;
    const { actionId, actionConfig } = await request.json();

    // Test the connection using Pipedream's test endpoint
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
      const error = await response.json();
      throw new Error(error.message || 'Connection test failed');
    }

    const result = await response.json();
    return NextResponse.json({ success: true,
      message: 'Connection test successful',
      data: result,
        });
  } catch (error) {
    console.error('Error testing app connection:', error);
    return NextResponse.json(
      { success: false,
        error: error instanceof Error ? error.message : 'Failed to test app connection'
          },
      { status: 500     }
    );
  }
} 