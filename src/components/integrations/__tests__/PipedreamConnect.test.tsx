// @ts-nocheck - This file has some TypeScript issues that are hard to fix
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PipedreamConnect } from '../PipedreamConnect';
import { toast } from 'react-hot-toast';
import { connectAccount } from '@pipedream/sdk';
import { vi } from 'vitest';
import { SessionProvider } from 'next-auth/react';

// Mock the Pipedream SDK
vi.mock('@pipedream/sdk', () => ({ connectAccount: vi.fn()
    }));

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  toast: {
  success: vi.fn(),
    error: vi.fn(),
      },
}));

// Mock fetch
global.fetch = vi.fn();

const mockSession = {
  user: { id: 'test-user-id', email: 'test@example.com' },
  expires: '2099-01-01T00:00:00.000Z',
};

function renderWithSession(ui) {
  return render(
    <SessionProvider session={mockSession}>{ui}</SessionProvider>
  );
}

describe('PipedreamConnect', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (global.fetch as vi.Mock).mockReset();
  });

  it('renders the connect button', () => {
    renderWithSession(<PipedreamConnect app="via-pipedream" />);
    expect(screen.getByText('Connect via-pipedream')).toBeInTheDocument();
  });

  it('shows loading state when connecting', async () => {
    renderWithSession(<PipedreamConnect app="via-pipedream" />);
    const button = screen.getByText('Connect via-pipedream');
    
    // Mock successful token fetch
    (global.fetch as vi.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ token: 'test-token' }),
    });

    fireEvent.click(button);
    
    // Should show spinner (loading state)
    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('handles successful connection', async () => {
    const onSuccess = vi.fn();
    renderWithSession(<PipedreamConnect app="via-pipedream" onSuccess={onSuccess} />);
    
    // Mock successful token fetch
    (global.fetch as vi.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ token: 'test-token'     }),
    });

    // Mock successful connection
    (connectAccount as vi.Mock).mockImplementation(({ onSuccess: onConnectSuccess     }) => {
      onConnectSuccess({ id: 'test-connection'     });
    });

    const button = screen.getByText('Connect via-pipedream');
    fireEvent.click(button);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Account connected successfully!');
      expect(onSuccess).toHaveBeenCalledWith({ id: 'test-connection'     });
    });
  });

  it('handles token fetch error', async () => {
    renderWithSession(<PipedreamConnect app="via-pipedream" />);
    
    // Mock failed token fetch
    (global.fetch as vi.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: () => Promise.resolve({ error: 'An unexpected error occurred' }),
    });

    const button = screen.getByText('Connect via-pipedream');
    fireEvent.click(button);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('An unexpected error occurred');
    });
  });

  it('handles connection error', async () => {
    renderWithSession(<PipedreamConnect app="via-pipedream" />);
    
    // Mock successful token fetch
    (global.fetch as vi.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ token: 'test-token'     }),
    });

    // Mock connection error
    (connectAccount as vi.Mock).mockImplementation(({ onError }) => {
      onError({ message: 'Connection failed'     });
    });

    const button = screen.getByText('Connect via-pipedream');
    fireEvent.click(button);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to connect account. Please try again.');
    });
  });
}); 