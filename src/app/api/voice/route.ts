import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';
// import { prisma } from '@/lib/prisma';
// import { ConversationService } from '@/services/ConversationService';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { command, workflowId } = await req.json();

    if (!command) {
      return NextResponse.json(
        { error: 'Command is required' },
        { status: 400 }
      );
    }

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
      }),
    });
    const orchestrateData = await orchestrateRes.json();

    return NextResponse.json(orchestrateData);
  } catch (error) {
    console.error('Error processing voice command:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const workflowId = searchParams.get('workflowId');

    // (Optional: fetch from orchestrator API if you want unified history)
    // For now, keep legacy logic for history fetch
    return NextResponse.json([]);
  } catch (error) {
    console.error('Error fetching voice interactions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 