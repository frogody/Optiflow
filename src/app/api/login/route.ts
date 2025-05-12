import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { authenticateUser, createTestUser } from '@/lib/auth';

/**
 * Direct login API endpoint for when OAuth is not configured properly
 */
export async function POST(request: NextRequest) {
  try {
    // Get credentials from request body
    const body = await request.json();
    const { email, password } = body;
    
    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }
    
    console.log(`API login attempt for: ${email}`);
    
    // Ensure test user exists (for demo login)
    if (email === 'demo@optiflow.ai') {
      if (process.env.NODE_ENV !== 'production') {
        await createTestUser();
      } else {
        return NextResponse.json(
          { success: false, error: 'Demo user login is disabled in production.' },
          { status: 403 }
        );
      }
    }
    
    // Authenticate user
    const user = await authenticateUser(email, password);
    
    // Set auth cookie - updated to use await with cookies()
    const cookieStore = await cookies();
    cookieStore.set({
      name: 'user-token',
      value: user.id,
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });
    
    // Return success with user data (excluding sensitive info)
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name || 'User',
      }
    });
  } catch (error) {
    console.error('API login error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Authentication failed'
      },
      { status: 401 }
    );
  }
} 