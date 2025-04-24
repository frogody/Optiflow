import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
  try {
    console.log('Seeding database...');

    // Create test user if it doesn't exist
    const testUser = await prisma.user.upsert({
      where: { email: 'test@example.com' },
      update: {},
      create: {
        email: 'test@example.com',
        passwordHash: await bcrypt.hash('password123', 10),
        name: 'Test User',
        organizations: {
          create: {
            organization: {
              create: {
                name: 'Test Organization',
                plan: 'free'
              }
            },
            role: 'OWNER'
          }
        }
      }
    });

    console.log('Created test user:', testUser.email);

    // Add more seed data here as needed

    console.log('Database seeding completed');
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 