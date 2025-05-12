import { execSync } from 'child_process';

async function main() {
  try {
    console.log('Starting database migration...');

    // Check if we're in production
    const isProduction = process.env.NODE_ENV === 'production';
    
    if (isProduction) {
      console.log('Running in production mode. Creating backup before migration...');
      
      // Create backup using the backup script
      try {
        execSync('npm run db:backup', { stdio: 'inherit' });
        console.log('Backup created successfully.');
      } catch (error) {
        console.error('Failed to create backup:', error);
        console.log('Continuing with migration anyway...');
      }
    }

    // Run Prisma migration
    console.log('Running Prisma migration...');
    execSync('npx prisma migrate deploy', { stdio: 'inherit' });
    
    // Generate Prisma client
    console.log('Generating Prisma client...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

main(); 