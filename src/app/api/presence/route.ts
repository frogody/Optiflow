import { NextResponse } from 'next/server';
import Redis from 'ioredis';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export const redis = new Redis(process.env.REDIS_URL!);

const RATE_LIMIT = 60; // requests
const RATE_LIMIT_WINDOW = 60; // seconds

async function checkRateLimit(userId: string) {
  const key = `ratelimit:presence:${userId}`;
  const count = await redis.incr(key);
  if (count === 1) {
    await redis.expire(key, RATE_LIMIT_WINDOW);
  }
  return count > RATE_LIMIT;
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { userId, inactive } = await req.json();
    if (!userId || userId !== session.user.id) {
      return NextResponse.json({ error: 'Invalid userId' }, { status: 401 });
    }
    // Rate limiting
    const limited = await checkRateLimit(userId);
    if (limited) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }
    const key = `user:${userId}:presence`;
    await redis.hmset(key, {
      lastActive: Date.now().toString(),
      inactive: inactive ? '1' : '0',
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update presence' }, { status: 500 });
  }
} 