import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock fetch for API calls
global.fetch = vi.fn();

// Mock Mem0 and Pipedream services
vi.mock('../../src/services/Mem0MemoryService', () => ({
  Mem0MemoryService: vi.fn().mockImplementation(() => ({
    add: vi.fn().mockResolvedValue(undefined),
    getAll: vi.fn().mockResolvedValue([]),
  })),
}));
vi.mock('../../src/services/PipedreamAccountService', () => ({
  getPipedreamAccountId: vi.fn().mockResolvedValue('mock-account-id'),
}));
vi.mock('../../src/services/PipedreamProxyService', () => ({
  callPipedreamProxy: vi.fn().mockResolvedValue('Email sent!'),
}));

describe('Orchestrator Endpoint', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should handle a send_email intent and return a response', async () => {
    // Import the handler dynamically to use the mocks
    const { POST } = await import('../../src/app/api/agent/orchestrate/route');
    const req = {
      json: async () => ({
        userId: 'user-123',
        message: 'Send an email to bart@example.com',
      }),
    };
    // @ts-ignore
    const res = await POST(req);
    const data = await res.json();
    expect(data.response).toContain('Email sent');
  });

  it('should return an error if userId or message is missing', async () => {
    const { POST } = await import('../../src/app/api/agent/orchestrate/route');
    const req = { json: async () => ({ userId: '', message: '' }) };
    // @ts-ignore
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
}); 