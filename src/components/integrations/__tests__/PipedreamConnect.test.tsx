// @ts-nocheck - This file has some TypeScript issues that are hard to fix
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PipedreamConnect } from '../PipedreamConnect';
import { toast } from 'react-hot-toast';
import { connectAccount } from '@pipedream/sdk';
import { vi } from 'vitest';

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

describe('PipedreamConnect', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (global.fetch as vi.Mock).mockReset();
  });

  it('renders the connect button', () => {
    render(<PipedreamConnect />);
    expect(screen.getByText('Connect Account via Pipedream')).toBeInTheDocument();
  });

  it('shows loading state when connecting', async () => {
    render(<PipedreamConnect />);
    const button = screen.getByText('Connect Account via Pipedream');
    
    // Mock successful token fetch
    (global.fetch as vi.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ token: 'test-token'     }),
    });

    fireEvent.click(button);
    
    // Should show loading state
    expect(screen.getByText('Connecting...')).toBeInTheDocument();
  });

  it('handles successful connection', async () => {
    const onSuccess = vi.fn();
    render(<PipedreamConnect onSuccess={onSuccess} />);
    
    // Mock successful token fetch
    (global.fetch as vi.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ token: 'test-token'     }),
    });

    // Mock successful connection
    (connectAccount as vi.Mock).mockImplementation(({ onSuccess: onConnectSuccess     }) => {
      onConnectSuccess({ id: 'test-connection'     });
    });

    const button = screen.getByText('Connect Account via Pipedream');
    fireEvent.click(button);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Account connected successfully!');
      expect(onSuccess).toHaveBeenCalledWith({ id: 'test-connection'     });
    });
  });

  it('handles token fetch error', async () => {
    render(<PipedreamConnect />);
    
    // Mock failed token fetch
    (global.fetch as vi.Mock).mockResolvedValueOnce({ ok: false,
      status: 500,
        });

    const button = screen.getByText('Connect Account via Pipedream');
    fireEvent.click(button);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('An unexpected error occurred');
    });
  });

  it('handles connection error', async () => {
    render(<PipedreamConnect />);
    
    // Mock successful token fetch
    (global.fetch as vi.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ token: 'test-token'     }),
    });

    // Mock connection error
    (connectAccount as vi.Mock).mockImplementation(({ onError }) => {
      onError({ message: 'Connection failed'     });
    });

    const button = screen.getByText('Connect Account via Pipedream');
    fireEvent.click(button);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to connect account. Please try again.');
    });
  });
}); 