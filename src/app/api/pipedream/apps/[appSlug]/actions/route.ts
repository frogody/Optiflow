import { NextResponse } from 'next/server';

import { getPipedreamConfig } from '../../../../../lib/pipedream/config.js';

export async function GET(
  request: Request,
  { params }: { params: { appSlug: string } }
) {
  try {
    const config = getPipedreamConfig();
    const { appSlug } = params;

    // Fetch app actions from Pipedream API
    const response = await fetch(
      `https://api.pipedream.com/v1/apps/${appSlug}/actions`,
      {
        headers: {
          Authorization: `Bearer ${config.clientSecret}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch app actions: ${response.statusText}`);
    }

    const actions = await response.json();

    // Transform the response to include only necessary data
    const transformedActions = actions.map((action: any) => ({
      id: action.id,
      name: action.name,
      description: action.description,
      input_schema: action.input_schema || {},
      output_schema: action.output_schema || {},
    }));

    return NextResponse.json(transformedActions);
  } catch (error) {
    console.error('Error fetching app actions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch app actions' },
      { status: 500 }
    );
  }
}
