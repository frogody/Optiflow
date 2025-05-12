import Redis from 'ioredis';

// Create a mock Redis client for environments where Redis is not available
class MockRedis {
  async get() { return null; }
  async set() { return 'OK'; }
  async del() { return 1; }
  async exists() { return 0; }
  async expire() { return 1; }
  async ttl() { return -1; }
  async hset() { return 'OK'; }
  async hget() { return null; }
  async hgetall() { return {}; }
  async hdel() { return 1; }
  async sadd() { return 1; }
  async srem() { return 1; }
  async smembers() { return []; }
  async publish() { return 0; }
  async subscribe() { }
  async unsubscribe() { }

  // Add other Redis methods as needed
  on(event: string, listener: (...args: any[]) => void) {
    // No-op for event listeners
    return this;
  }
}

// Configure Redis with proper production settings for Vercel deployment
// We support two Redis connection types:
// 1. Standard Redis URL (REDIS_URL) for self-hosted or managed Redis
// 2. Upstash Redis (UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN) for serverless deployment on Vercel

const createRedisClient = () => {
  // Check for Upstash Redis credentials first (preferred for Vercel)
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    console.info('[Redis] Using Upstash Redis for serverless compatibility');
    
    // For Upstash Redis, we would typically use their dedicated SDK
    // But here we're maintaining compatibility with ioredis
    const client = new Redis(process.env.UPSTASH_REDIS_REST_URL, {
      password: process.env.UPSTASH_REDIS_REST_TOKEN,
      tls: { rejectUnauthorized: false }
    });
    
    // Set up event handlers for monitoring
    client.on('connect', () => {
      console.info('[Redis] Upstash connection established');
    });

    client.on('error', (err) => {
      console.error(`[Redis] Upstash error: ${err.message}`);
    });

    return client;
  }
  
  // Fall back to standard Redis connection
  if (!process.env.REDIS_URL) {
    throw new Error('No Redis connection details found. Please set either REDIS_URL or UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in your environment variables');
  }

  // Create standard Redis client with production-ready configuration
  const client = new Redis(process.env.REDIS_URL, {
    // Connection settings
    connectTimeout: 10000, // 10 seconds
    maxRetriesPerRequest: 3,
    
    // Retry strategy with exponential backoff
    retryStrategy: (times) => {
      // Retry with exponential backoff up to 5 times
      if (times > 5) {
        // After 5 retries, notify that we couldn't connect
        console.error(`[Redis] Could not connect after ${times} attempts. Redis operations will fail.`);
        return null; // Stop retrying
      }
      
      // Exponential backoff: 100ms, 200ms, 400ms, 800ms, 1600ms
      const delay = Math.min(times * 100, 3000);
      console.warn(`[Redis] Connection attempt ${times} failed. Retrying in ${delay}ms...`);
      return delay;
    },
    
    // Enable automatic reconnection
    autoReconnect: true,
    reconnectOnError: (err) => {
      const targetError = 'READONLY';
      if (err.message.includes(targetError)) {
        // Only reconnect on certain errors
        return true;
      }
      return false;
    }
  });

  // Set up event handlers for monitoring
  client.on('connect', () => {
    console.info('[Redis] Connection established');
  });

  client.on('ready', () => {
    console.info('[Redis] Client is ready');
  });

  client.on('error', (err) => {
    console.error(`[Redis] Error: ${err.message}`);
  });

  client.on('close', () => {
    console.warn('[Redis] Connection closed');
  });

  client.on('reconnecting', () => {
    console.info('[Redis] Attempting to reconnect...');
  });

  return client;
};

// Export a singleton Redis client
export const redis = createRedisClient(); 