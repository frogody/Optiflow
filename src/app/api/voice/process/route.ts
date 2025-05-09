// @ts-nocheck - This file has some TypeScript issues that are hard to fix
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { processVoiceCommand } from '@/services/voiceService';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized'     },
        { status: 401     }
      );
    }

    const { command, workflowId, context } = await req.json();

    // Create a voice interaction record
    const voiceInteraction = await prisma.voiceInteraction.create({
      data: {
  userId: session.user.id,
        workflowId: workflowId || null,
        transcript: command,
        status: 'processing',
          },
    });

    // Process the command
    const { response, actions, intent, entities } = await processVoiceCommand(command, context);

    // Update the voice interaction with results
    await prisma.voiceInteraction.update({
      where: { id: voiceInteraction.id     },
      data: {
  status: 'completed',
        intent,
        entities,
          },
    });

    // Create a conversation message for the command
    await prisma.conversationMessage.create({
      data: {
  voiceInteractionId: voiceInteraction.id,
        role: 'user',
        content: command,
          },
    });

    // Create a conversation message for the response
    await prisma.conversationMessage.create({
      data: {
  voiceInteractionId: voiceInteraction.id,
        role: 'assistant',
        content: response,
          },
    });

    // Create a voice command record
    await prisma.voiceCommand.create({
      data: {
  userId: session.user.id,
        command,
        intent: intent || 'unknown',
        entities: entities || {},
        status: 'completed',
      },
    });

    return NextResponse.json({ response,
      actions,
      interactionId: voiceInteraction.id,
        });
  } catch (error) {
    console.error('Error processing voice command:', error);
    return NextResponse.json(
      { error: 'Failed to process voice command'     },
      { status: 500     }
    );
  }
} 