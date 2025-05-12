import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

// Create a Prisma client that uses the production DATABASE_URL
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env['PROD_DATABASE_URL'] || process.env['DATABASE_URL'] || ''
    }
  }
});

async function main() {
  const saltRounds = 10;
  // Use a more secure password for production
  const testPassword = process.env['TEST_USER_PASSWORD'] || 'ProdTestPass123!';
  const passwordHash = await bcrypt.hash(testPassword, saltRounds);

  // First create the users if they don't exist
  for (const email of ['test@example.com', 'test2@example.com']) {
    await prisma.user.upsert({
      where: { email },
      update: { passwordHash },
      create: {
        email,
        name: email === 'test@example.com' ? 'Test User' : 'Test User 2',
        passwordHash,
        isActive: true,
        role: 'user'
      }
    });
  }

  console.log('Production test users have been created/updated.');
  console.log('Test password is:', testPassword);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 