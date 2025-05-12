import { Redis } from '@upstash/redis';

// Create a client using environment variables
// This will automatically use UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN
// if available, or fall back to REDIS_URL if configured
export const redis = (() => {
  // For Upstash Redis using their SDK
  try {
    // First attempt to use the Upstash SDK with its environment variables
    const client = Redis.fromEnv();
    console.info('[Redis] Initialized Upstash Redis client from environment variables');
    return client;
  } catch (e) {
    console.error('[Redis] Error initializing Upstash Redis client:', e);
    
    // If specific REDIS_URL is available, try to use it with the SDK
    if (process.env.REDIS_URL) {
      try {
        // Extract credentials from REDIS_URL if present
        const url = new URL(process.env.REDIS_URL);
        const token = url.password;
        
        console.info('[Redis] Attempting to connect using REDIS_URL with Upstash SDK');
        return new Redis({
          url: process.env.REDIS_URL,
          token: token || undefined,
        });
      } catch (err) {
        console.error('[Redis] Failed to initialize with REDIS_URL:', err);
      }
    }
    
    // Create mock Redis client for environments where Redis isn't available
    console.warn('[Redis] Using mock Redis client as fallback');
    return createMockRedisClient();
  }
})();

// Create a mock Redis client for testing/development
function createMockRedisClient() {
  const store = new Map<string, any>();
  
  return {
    get: async (key: string) => store.get(key),
    set: async (key: string, value: any, options?: any) => {
      store.set(key, value);
      return 'OK';
    },
    del: async (key: string) => {
      if (store.has(key)) {
        store.delete(key);
        return 1;
      }
      return 0;
    },
    incr: async (key: string) => {
      const value = (store.get(key) || 0) + 1;
      store.set(key, value);
      return value;
    },
    // Add more methods as needed
  };
} 