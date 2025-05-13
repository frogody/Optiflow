import { PrismaClient } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient();
  try {
    const result = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `;
    console.log('Tables in database:');
    console.log(result);
  } catch (e) {
    console.error('Error listing tables:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 