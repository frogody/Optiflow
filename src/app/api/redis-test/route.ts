import { NextResponse } from 'next/server';
import { redis } from '@/lib/upstash';

export async function GET(request: Request) {
  try {
    // Store a test value
    await redis.set('test-key', 'Hello from Upstash Redis!');
    
    // Retrieve the value
    const value = await redis.get('test-key');
    
    // Increment a counter to test redis operations
    const counter = await redis.incr('visit-counter');
    
    return NextResponse.json({ 
      success: true, 
      message: value,
      counter: counter
    });
  } catch (error) {
    console.error('Redis test error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 