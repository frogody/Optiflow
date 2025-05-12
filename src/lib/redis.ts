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

// Initialize Redis or use the mock if connection fails
let redisClient;

try {
  if (process.env.REDIS_URL) {
    redisClient = new Redis(process.env.REDIS_URL, {
      lazyConnect: true,
      retryStrategy: () => null // Disable retries when connection fails
    });
    
    // Handle connection errors gracefully
    redisClient.on('error', (err) => {
      console.warn(`Redis connection error: ${err.message}. Using mock Redis client.`);
      redisClient = new MockRedis();
    });
  } else {
    console.info('REDIS_URL not provided. Using mock Redis client.');
    redisClient = new MockRedis();
  }
} catch (error) {
  console.warn(`Failed to initialize Redis: ${error}. Using mock Redis client.`);
  redisClient = new MockRedis();
}

export const redis = redisClient; 