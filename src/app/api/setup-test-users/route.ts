import { NextResponse } from 'next/server';
import { hash } from 'bcrypt';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    // Verify admin token
    const authHeader = request.headers.get('authorization');
    if (!authHeader || authHeader !== `Bearer ${process.env.ADMIN_SETUP_TOKEN}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const saltRounds = 10;
    const testPassword = process.env.TEST_USER_PASSWORD || 'ProdTestPass123!';
    const passwordHash = await hash(testPassword, saltRounds);

    // Create or update test users
    const users = await Promise.all([
      prisma.user.upsert({
        where: { email: 'test@example.com' },
        update: { passwordHash },
        create: {
          email: 'test@example.com',
          name: 'Test User',
          passwordHash,
          isActive: true,
          role: 'user'
        }
      }),
      prisma.user.upsert({
        where: { email: 'test2@example.com' },
        update: { passwordHash },
        create: {
          email: 'test2@example.com',
          name: 'Test User 2',
          passwordHash,
          isActive: true,
          role: 'user'
        }
      })
    ]);

    return NextResponse.json({
      message: 'Test users created successfully',
      users: users.map(u => ({ id: u.id, email: u.email, name: u.name }))
    });
  } catch (error) {
    console.error('Error setting up test users:', error);
    return NextResponse.json(
      { error: 'Failed to set up test users' },
      { status: 500 }
    );
  }
} 