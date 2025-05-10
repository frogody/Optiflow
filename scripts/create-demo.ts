import bcrypt from 'bcryptjs';

import { prisma } from '@/lib/prisma';

async function main() {
  const hashedPassword = await bcrypt.hash('Demo123!@#', 10);
  
  try {
    // Check if demo account exists
    const existingUser = await prisma.user.findUnique({
      where: { email: 'demo@optiflow.ai' }
    });

    if (existingUser) {
      // Update password if user exists
      const updatedUser = await prisma.user.update({
        where: { email: 'demo@optiflow.ai' },
        data: { passwordHash: hashedPassword }
      });
      console.log('Demo account password updated:', updatedUser.email);
    } else {
      // Create new demo account
      const user = await prisma.user.create({
        data: {
          email: 'demo@optiflow.ai',
          passwordHash: hashedPassword,
          name: 'Demo User',
          organizations: {
            create: {
              organization: {
                create: {
                  name: 'Demo Organization',
                  plan: 'free'
                }
              },
              role: 'OWNER'
            }
          }
        }
      });
      console.log('Demo account created:', user.email);
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 