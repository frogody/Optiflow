import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

async function main() {
  const prisma = new PrismaClient();
  try {
    // Create admin user with bcrypt hashed password
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@isyncso.com',
        name: 'Admin User',
        passwordHash: hashedPassword,
        role: 'admin',
        organizations: {
          create: {
            organization: {
              create: {
                name: 'Admin Organization',
                plan: 'enterprise',
              }
            },
            role: 'OWNER',
          }
        }
      },
    });
    
    console.log('Admin user created successfully:', adminUser);
  } catch (e) {
    console.error('Error creating admin user:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 