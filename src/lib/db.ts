import { Prisma, PrismaClient } from '@prisma/client';

import { prisma } from './prisma';

export { prisma };

// Helper function to handle database errors
export function handleDatabaseError(error: unknown): never {
  console.error('Database error:', error);

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      throw new Error('A unique constraint violation occurred');
    }

    if (error.code === 'P2025') {
      throw new Error('Record not found');
    }
  }

  throw new Error('An unexpected database error occurred');
}

// Helper function to execute database transactions
export async function executeTransaction<T>(
  callback: (
    prisma: Omit<
      PrismaClient,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
    >
  ) => Promise<T>
): Promise<T> {
  try {
    return await prisma.$transaction(callback);
  } catch (error) {
    return handleDatabaseError(error);
  }
}

// Helper function to check database connection
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Database connection error:', error);
    return false;
  }
}
