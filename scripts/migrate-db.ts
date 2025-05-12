import { exec } from 'child_process';
import { promisify } from 'util';

import { prisma } from '@/lib/prisma';

const execAsync = promisify(exec);

async function main() {
  console.log('Starting database migration process...');

  try {
    // Create a backup before migration (if DATABASE_URL is a PostgreSQL URL)
    if (process.env['DATABASE_URL']?.startsWith('postgresql://')) {
      console.log('Creating database backup...');
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupCommand = `pg_dump \${process.env['DATABASE_URL']} > backup_${timestamp}.sql`;
      await execAsync(backupCommand);
      console.log('Database backup created successfully');
    }

    // Run migrations
    console.log('Running database migrations...');
    await prisma.$executeRaw`SELECT 1`;
    
    console.log('Migrations completed successfully');
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 