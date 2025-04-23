import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const saltRounds = 10;
  const testPassword = 'testpassword123'; // You can change this password
  const passwordHash = await bcrypt.hash(testPassword, saltRounds);

  // Update both test users with the same password hash
  await prisma.user.updateMany({
    where: {
      OR: [
        { email: 'test@example.com' },
        { email: 'test2@example.com' }
      ]
    },
    data: {
      passwordHash
    }
  });

  console.log('Password hashes have been set for test users.');
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