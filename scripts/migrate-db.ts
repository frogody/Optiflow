import { PrismaClient } from '@prisma/client';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function main() {
  console.log('Starting database migration process...');

  try {
    // Create a backup before migration (if DATABASE_URL is a PostgreSQL URL)
    if (process.env.DATABASE_URL?.startsWith('postgresql://')) {
      console.log('Creating database backup...');
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupCommand = `pg_dump \${DATABASE_URL} > backup_\${timestamp}.sql`;
      await execAsync(backupCommand);
      console.log('Database backup created successfully');
    }

    // Run migrations
    console.log('Running migrations...');
    await execAsync('npx prisma migrate deploy');
    console.log('Migrations completed successfully');

    // Verify database connection and schema
    console.log('Verifying database connection...');
    const prisma = new PrismaClient();
    await prisma.$connect();
    
    // Test query to verify schema
    await prisma.user.findFirst();
    console.log('Database connection and schema verified');

    await prisma.$disconnect();
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

main(); 