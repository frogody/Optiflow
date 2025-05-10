import { createBackendClient } from '@pipedream/sdk/server';
import { getServerSession } from 'next-auth';
import { vi } from 'vitest';

import { POST } from '../route';

// Mock next-auth
vi.mock('next-auth', () => ({ getServerSession: vi.fn() }));

// Mock Pipedream SDK
vi.mock('@pipedream/sdk/server', () => ({ createBackendClient: vi.fn() }));

describe('Pipedream Connect API Route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.PIPEDREAM_CLIENT_ID = 'test-client-id';
    process.env.PIPEDREAM_CLIENT_SECRET = 'test-client-secret';
    process.env.PIPEDREAM_PROJECT_ID = 'test-project-id';
    process.env.PIPEDREAM_PROJECT_ENVIRONMENT = 'development';
  });

  it('returns 401 when user is not authenticated', async () => {
    (getServerSession as vi.Mock).mockResolvedValueOnce(null);

    const response = await POST(new Request('http://localhost'));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('You must be logged in to connect your account');
  });

  it('successfully generates a connect token', async () => {
    // Mock authenticated session
    (getServerSession as vi.Mock).mockResolvedValueOnce({
      user: { id: 'test-user-id' },
    });

    // Mock Pipedream client
    const mockCreateConnectToken = vi
      .fn()
      .mockResolvedValueOnce({
        token: 'test-token',
        expires_at: '2024-12-31T23:59:59Z',
        connect_link_url: 'https://connect.pipedream.com/test',
      });

    (createBackendClient as vi.Mock).mockReturnValueOnce({
      createConnectToken: mockCreateConnectToken,
    });

    const response = await POST(new Request('http://localhost'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({
      token: 'test-token',
      expires_at: '2024-12-31T23:59:59Z',
      connect_link_url: 'https://connect.pipedream.com/test',
    });

    expect(mockCreateConnectToken).toHaveBeenCalledWith({
      external_user_id: 'test-user-id',
    });
  });

  it('handles Pipedream API errors', async () => {
    // Mock authenticated session
    (getServerSession as vi.Mock).mockResolvedValueOnce({
      user: { id: 'test-user-id' },
    });

    // Mock Pipedream client error
    const mockCreateConnectToken = vi
      .fn()
      .mockRejectedValueOnce(new Error('Pipedream API error'));

    (createBackendClient as vi.Mock).mockReturnValueOnce({
      createConnectToken: mockCreateConnectToken,
    });

    const response = await POST(new Request('http://localhost'));
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Failed to generate Connect Token');
  });

  it('validates required environment variables', async () => {
    // Mock authenticated session
    (getServerSession as vi.Mock).mockResolvedValueOnce({
      user: { id: 'test-user-id' },
    });

    // Remove required environment variables
    delete process.env.PIPEDREAM_CLIENT_ID;
    delete process.env.PIPEDREAM_CLIENT_SECRET;
    delete process.env.PIPEDREAM_PROJECT_ID;

    const response = await POST(new Request('http://localhost'));
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Failed to generate Connect Token');
  });
});
