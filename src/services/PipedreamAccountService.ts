import { prisma } from '@/lib/prisma';

export async function getPipedreamAccountId(userId: string, service: string): Promise<string | null> {
  const connection = await prisma.pipedreamConnection.findUnique({
    where: { userId_service: { userId, service } },
  });
  return connection?.accountId || null;
} 