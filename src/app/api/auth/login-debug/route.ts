import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { encode } from 'next-auth/jwt';

export async function POST(request: NextRequest) {
  try {
    // Get email and password from request body
    const body = await request.json();
    const { email, password } = body;
    
    console.log('[Debug Login] Attempting login for:', email);
    
    // Validate input
    if (!email || !password) {
      return NextResponse.json({ 
        success: false, 
        message: 'Email and password are required' 
      }, { status: 400 });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user || !user.passwordHash) {
      console.log('[Debug Login] User not found:', email);
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid credentials' 
      }, { status: 401 });
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      console.log('[Debug Login] Invalid password for user:', email);
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid credentials' 
      }, { status: 401 });
    }

    // Generate session token manually
    const token = await encode({
      token: {
        id: user.id,
        email: user.email,
        name: user.name || '',
        role: user.role || 'user',
        isAdmin: user.role === 'admin',
      },
      secret: process.env.NEXTAUTH_SECRET || 'your-secret-key',
    });

    // Set cookie
    const cookieName = process.env.NODE_ENV === 'production' 
      ? '__Secure-next-auth.session-token' 
      : 'next-auth.session-token';

    cookies().set({
      name: cookieName,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 30 * 24 * 60 * 60,
      sameSite: 'lax'
    });

    console.log('[Debug Login] Login successful for:', email);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        isAdmin: user.role === 'admin'
      }
    });
  } catch (error) {
    console.error('[Debug Login] Error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error',
      error: String(error)
    }, { status: 500 });
  }
} 