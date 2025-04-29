import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PipedreamConnect } from '../PipedreamConnect';
import { toast } from 'react-hot-toast';
import { connectAccount } from '@pipedream/sdk';

// Mock the Pipedream SDK
jest.mock('@pipedream/sdk', () => ({
  connectAccount: jest.fn(),
}));

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock fetch
global.fetch = jest.fn();

describe('PipedreamConnect', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockReset();
  });

  it('renders the connect button', () => {
    render(<PipedreamConnect />);
    expect(screen.getByText('Connect Account via Pipedream')).toBeInTheDocument();
  });

  it('shows loading state when connecting', async () => {
    render(<PipedreamConnect />);
    const button = screen.getByText('Connect Account via Pipedream');
    
    // Mock successful token fetch
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ token: 'test-token' }),
    });

    fireEvent.click(button);
    
    // Should show loading state
    expect(screen.getByText('Connecting...')).toBeInTheDocument();
  });

  it('handles successful connection', async () => {
    const onSuccess = jest.fn();
    render(<PipedreamConnect onSuccess={onSuccess} />);
    
    // Mock successful token fetch
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ token: 'test-token' }),
    });

    // Mock successful connection
    (connectAccount as jest.Mock).mockImplementation(({ onSuccess: onConnectSuccess }) => {
      onConnectSuccess({ id: 'test-connection' });
    });

    const button = screen.getByText('Connect Account via Pipedream');
    fireEvent.click(button);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Account connected successfully!');
      expect(onSuccess).toHaveBeenCalledWith({ id: 'test-connection' });
    });
  });

  it('handles token fetch error', async () => {
    render(<PipedreamConnect />);
    
    // Mock failed token fetch
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
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
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ token: 'test-token' }),
    });

    // Mock connection error
    (connectAccount as jest.Mock).mockImplementation(({ onError }) => {
      onError({ message: 'Connection failed' });
    });

    const button = screen.getByText('Connect Account via Pipedream');
    fireEvent.click(button);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to connect account. Please try again.');
    });
  });
}); 