interface RateLimitConfig {
  maxRequests: number;  // Maximum requests per window
  windowMs: number;     // Time window in milliseconds
  retryAfterMs?: number; // Time to wait before retrying
}

interface RateLimitState {
  requests: number;
  windowStart: number;
}

interface RateLimitError extends Error {
  response?: {
    status: number;
  };
}

export class RateLimiter {
  private config: Required<RateLimitConfig>;
  private state: Map<string, RateLimitState>;

  constructor(config: RateLimitConfig) {
    this.config = {
      retryAfterMs: 1000,  // Default retry after 1 second
      ...config
    };
    this.state = new Map();
  }

  async acquire(key: string): Promise<boolean> {
    const now = Date.now();
    const state = this.state.get(key) || { requests: 0, windowStart: now };

    // Reset window if expired
    if (now - state.windowStart >= this.config.windowMs) {
      state.requests = 0;
      state.windowStart = now;
    }

    // Check if limit is reached
    if (state.requests >= this.config.maxRequests) {
      const waitTime = this.config.windowMs - (now - state.windowStart);
      if (waitTime > 0) {
        await new Promise(resolve => setTimeout(resolve, waitTime));
        return this.acquire(key);
      }
      state.requests = 0;
      state.windowStart = now;
    }

    // Increment request count
    state.requests++;
    this.state.set(key, state);
    return true;
  }

  async withRateLimit<T>(key: string, fn: () => Promise<T>): Promise<T> {
    await this.acquire(key);
    try {
      return await fn();
    } catch (error) {
      if (this.isRateLimitError(error)) {
        await new Promise(resolve => setTimeout(resolve, this.config.retryAfterMs));
        return this.withRateLimit(key, fn);
      }
      throw error;
    }
  }

  private isRateLimitError(error: unknown): error is RateLimitError {
    if (error instanceof Error) {
      const rateLimitError = error as RateLimitError;
      return (
        rateLimitError.response?.status === 429 ||
        rateLimitError.message.toLowerCase().includes('rate limit') ||
        rateLimitError.message.toLowerCase().includes('too many requests')
      );
    }
    return false;
  }

  getRemainingRequests(key: string): number {
    const now = Date.now();
    const state = this.state.get(key);
    
    if (!state || now - state.windowStart >= this.config.windowMs) {
      return this.config.maxRequests;
    }
    
    return Math.max(0, this.config.maxRequests - state.requests);
  }

  getResetTime(key: string): Date | null {
    const state = this.state.get(key);
    if (!state) return null;
    
    return new Date(state.windowStart + this.config.windowMs);
  }
} 