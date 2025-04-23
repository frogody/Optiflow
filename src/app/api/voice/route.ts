import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ConversationService } from '@/services/ConversationService';
import { VoiceCommandResponse } from '@/types/voice';

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

    // Get or create voice interaction
    const voiceInteraction = await prisma.voiceInteraction.create({
      data: {
        userId: session.user.id,
        workflowId: workflowId,
        transcript: command,
        status: 'active',
      },
    });

    // Initialize conversation service with current workflow if provided
    const currentWorkflow = workflowId
      ? await prisma.workflow.findUnique({
          where: { id: workflowId },
        })
      : undefined;

    const conversationService = new ConversationService({
      currentWorkflow,
    });

    // Process the command
    const response = await conversationService.processCommand(command);

    // Save the conversation messages
    const context = conversationService.getContext();
    await prisma.conversationMessage.createMany({
      data: context.conversationHistory.map(message => ({
        voiceInteractionId: voiceInteraction.id,
        role: message.role,
        content: message.content,
        metadata: message.metadata,
      })),
    });

    // Update voice interaction status
    await prisma.voiceInteraction.update({
      where: { id: voiceInteraction.id },
      data: {
        status: 'completed',
        intent: response.success ? 'success' : 'error',
        entities: response.workflowUpdates || response.nodeUpdates || response.edgeUpdates
          ? {
              workflowUpdates: response.workflowUpdates,
              nodeUpdates: response.nodeUpdates,
              edgeUpdates: response.edgeUpdates,
            }
          : undefined,
      },
    });

    return NextResponse.json(response);
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

    const voiceInteractions = await prisma.voiceInteraction.findMany({
      where: {
        userId: session.user.id,
        ...(workflowId ? { workflowId } : {}),
      },
      include: {
        conversation: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    });

    return NextResponse.json(voiceInteractions);
  } catch (error) {
    console.error('Error fetching voice interactions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 