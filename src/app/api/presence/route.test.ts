import { getServerSession } from 'next-auth/next';
import { createMocks } from 'node-mocks-http';
import request from 'supertest';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';

import { redis } from '@/lib/upstash';
import checkHandler from './check/route';
import handler from './route';

jest.mock('next-auth/next');

const mockUserId = 'test-user-1';
const mockSession = { user: { id: mockUserId } };

describe('/api/presence endpoints', () => {
  beforeEach(async () => {
    await redis.del(`user:${mockUserId}:presence`);
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
  });

  afterAll(async () => {
    await redis.quit();
  });

  it('should update presence for authenticated user', async () => {
    const req = { json: async () => ({ userId: mockUserId, inactive: false }) } as any;
    const res = await handler(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    const stored = await redis.hgetall(`user:${mockUserId}:presence`);
    expect(stored.inactive).toBe('0');
  });

  it('should reject presence update for unauthenticated user', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null);
    const req = { json: async () => ({ userId: mockUserId, inactive: false }) } as any;
    const res = await handler(req);
    expect(res.status).toBe(401);
  });

  it('should reject presence update for mismatched userId', async () => {
    const req = { json: async () => ({ userId: 'other-user', inactive: false }) } as any;
    const res = await handler(req);
    expect(res.status).toBe(401);
  });

  it('should check presence for authenticated user', async () => {
    // Set presence first
    await redis.hmset(`user:${mockUserId}:presence`, { lastActive: Date.now().toString(), inactive: '0' });
    const req = { json: async () => ({ userId: mockUserId }) } as any;
    const res = await checkHandler(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.inactive).toBe(false);
  });

  it('should reject presence check for unauthenticated user', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null);
    const req = { json: async () => ({ userId: mockUserId }) } as any;
    const res = await checkHandler(req);
    expect(res.status).toBe(401);
  });

  it('should reject presence check for mismatched userId', async () => {
    const req = { json: async () => ({ userId: 'other-user' }) } as any;
    const res = await checkHandler(req);
    expect(res.status).toBe(401);
  });
}); 