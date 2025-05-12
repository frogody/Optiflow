import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';
// import { prisma } from '@/lib/prisma';
// import { processVoiceCommand } from '@/services/voiceService';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { command, workflowId, context } = await req.json();

    // Route orchestration through the new orchestrator API
    const orchestrateRes = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || ''}/api/agent/orchestrate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: session.user.id,
        teamId: session.user.teamId || '',
        orgId: session.user.orgId || '',
        message: command,
        workflowId,
        context,
      }),
    });
    const orchestrateData = await orchestrateRes.json();

    return NextResponse.json(orchestrateData);
  } catch (error) {
    console.error('Error processing voice command:', error);
    return NextResponse.json(
      { error: 'Failed to process voice command' },
      { status: 500 }
    );
  }
} 