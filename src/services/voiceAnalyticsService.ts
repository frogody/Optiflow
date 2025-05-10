import { prisma } from '@/lib/prisma';
import { VoiceCommand, VoiceCommandResponse, VoiceInteraction } from '@/types/voice';

interface VoiceMetrics {
  totalCommands: number;
  successfulCommands: number;
  failedCommands: number;
  averageProcessingTime: number;
  commonIntents: Array<{ intent: string; count: number }>;
  commonErrors: Array<{ error: string; count: number }>;
}

export class VoiceAnalyticsService {
  static async logVoiceInteraction(
    interaction: VoiceInteraction,
    response: VoiceCommandResponse,
    processingTime: number
  ) {
    try {
      // Log detailed analytics
      await prisma.voiceAnalytics.create({
        data: {
          interactionId: interaction.id,
          userId: interaction.userId,
          workflowId: interaction.workflowId,
          transcript: interaction.transcript,
          intent: interaction.intent || 'unknown',
          success: response.success,
          processingTime,
          errorMessage: !response.success ? response.message : null,
          metadata: {
            deepgramConfidence: interaction.metadata?.confidence,
            entities: interaction.entities,
            workflowUpdates: response.workflowUpdates ? true : false,
            nodeUpdates: response.nodeUpdates?.length || 0,
            edgeUpdates: response.edgeUpdates?.length || 0,
          },
        },
      });

      // Update aggregate metrics
      await this.updateAggregateMetrics(interaction.userId);
    } catch (error) { console.error('Error logging voice analytics:', error); }
  }

  static async getVoiceMetrics(userId: string, timeRange?: { start: Date; end: Date }): Promise<VoiceMetrics> {
    const whereClause = {
      userId,
      ...(timeRange && {
        createdAt: {
          gte: timeRange.start,
          lte: timeRange.end,
        },
      }),
    };

    const [
      totalCommands,
      successfulCommands,
      failedCommands,
      avgProcessingTime,
      intents,
      errors,
    ] = await Promise.all([
      prisma.voiceAnalytics.count({ where: whereClause }),
      prisma.voiceAnalytics.count({ where: { ...whereClause, success: true } }),
      prisma.voiceAnalytics.count({ where: { ...whereClause, success: false } }),
      prisma.voiceAnalytics.aggregate({
        where: whereClause,
        _avg: { processingTime: true },
      }),
      prisma.voiceAnalytics.groupBy({
        by: ['intent'],
        where: whereClause,
        _count: true,
        orderBy: { _count: { intent: 'desc' } },
        take: 10,
      }),
      prisma.voiceAnalytics.groupBy({
        by: ['errorMessage'],
        where: { ...whereClause, success: false },
        _count: true,
        orderBy: { _count: { errorMessage: 'desc' } },
        take: 10,
      }),
    ]);

    return {
      totalCommands,
      successfulCommands,
      failedCommands,
      averageProcessingTime: avgProcessingTime._avg.processingTime || 0,
      commonIntents: intents.map(i => ({ intent: i.intent, count: i._count.intent })),
      commonErrors: errors.map(e => ({ error: e.errorMessage || 'Unknown error', count: e._count.errorMessage })),
    };
  }

  private static async updateAggregateMetrics(userId: string) {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));

    await prisma.userVoiceMetrics.upsert({
      where: { userId_date: { userId, date: startOfDay } },
      create: { userId,
        date: startOfDay,
        totalCommands: 1,
        successfulCommands: 0,
        failedCommands: 0,
      },
      update: {
        totalCommands: { increment: 1 },
      },
    });
  }

  static async trackRecognitionAccuracy(
    transcript: string,
    confidence: number,
    correctedText?: string
  ) {
    if (correctedText) {
      await prisma.voiceRecognitionAccuracy.create({
        data: { transcript,
          confidence,
          correctedText,
          wasCorrect: transcript.toLowerCase() === correctedText.toLowerCase(),
        },
      });
    }
  }
} 