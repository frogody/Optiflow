import { POST } from '../route';
import { createBackendClient } from '@pipedream/sdk/server';
import { getServerSession } from 'next-auth';

// Mock next-auth
jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

// Mock Pipedream SDK
jest.mock('@pipedream/sdk/server', () => ({
  createBackendClient: jest.fn(),
}));

describe('Pipedream Connect API Route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.PIPEDREAM_CLIENT_ID = 'test-client-id';
    process.env.PIPEDREAM_CLIENT_SECRET = 'test-client-secret';
    process.env.PIPEDREAM_PROJECT_ID = 'test-project-id';
    process.env.PIPEDREAM_PROJECT_ENVIRONMENT = 'development';
  });

  it('returns 401 when user is not authenticated', async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce(null);

    const response = await POST(new Request('http://localhost'));
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Unauthorized');
  });

  it('successfully generates a connect token', async () => {
    // Mock authenticated session
    (getServerSession as jest.Mock).mockResolvedValueOnce({
      user: { id: 'test-user-id' },
    });

    // Mock Pipedream client
    const mockCreateConnectToken = jest.fn().mockResolvedValueOnce({
      token: 'test-token',
      expires_at: '2024-12-31T23:59:59Z',
      connect_link_url: 'https://connect.pipedream.com/test',
    });

    (createBackendClient as jest.Mock).mockReturnValueOnce({
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
    (getServerSession as jest.Mock).mockResolvedValueOnce({
      user: { id: 'test-user-id' },
    });

    // Mock Pipedream client error
    const mockCreateConnectToken = jest.fn().mockRejectedValueOnce(
      new Error('Pipedream API error')
    );

    (createBackendClient as jest.Mock).mockReturnValueOnce({
      createConnectToken: mockCreateConnectToken,
    });

    const response = await POST(new Request('http://localhost'));
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Failed to generate Connect Token');
  });

  it('validates required environment variables', async () => {
    // Mock authenticated session
    (getServerSession as jest.Mock).mockResolvedValueOnce({
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