import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
  try {
    // Check if pg_dump is available
    try {
      execSync('which pg_dump');
    } catch (error) {
      console.error('Error: pg_dump is not installed. Please install PostgreSQL tools.');
      process.exit(1);
    }

    // Create backups directory if it doesn't exist
    const backupsDir = path.join(process.cwd(), 'backups');
    if (!fs.existsSync(backupsDir)) {
      fs.mkdirSync(backupsDir, { recursive: true });
    }

    // Generate timestamp for backup file
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.join(backupsDir, `backup-${timestamp}.sql`);
    const compressedFile = `${backupFile}.gz`;

    // Get database connection details from environment variables
    const host = process.env['POSTGRES_HOST'];
    const user = process.env['POSTGRES_USER'];
    const database = process.env['PGDATABASE'];
    const password = process.env['PGPASSWORD'];

    if (!host || !user || !database || !password) {
      console.error('Error: Missing required environment variables for database backup');
      process.exit(1);
    }

    // Create backup using pg_dump
    console.log('Creating database backup...');
    const pgDumpCommand = `PGPASSWORD=${password} pg_dump -h ${host} -U ${user} -d ${database} -F p --no-sync > ${backupFile}`;
    execSync(pgDumpCommand, { stdio: 'inherit' });

    // Compress the backup file
    console.log('Compressing backup file...');
    execSync(`gzip ${backupFile}`);

    // Clean up old backups (keep only the 5 most recent)
    console.log('Cleaning up old backups...');
    const backupFiles = fs.readdirSync(backupsDir)
      .filter(file => file.endsWith('.sql.gz'))
      .map(file => ({
        name: file,
        time: fs.statSync(path.join(backupsDir, file)).mtime.getTime()
      }))
      .sort((a, b) => b.time - a.time);

    // Remove old backups
    backupFiles.slice(5).forEach(file => {
      fs.unlinkSync(path.join(backupsDir, file.name));
      console.log(`Removed old backup: ${file.name}`);
    });

    console.log(`Backup completed successfully: ${compressedFile}`);
  } catch (error) {
    console.error('Error creating backup:', error);
    process.exit(1);
  }
}

main(); 