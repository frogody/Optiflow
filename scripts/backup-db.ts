import { exec } from 'child_process';
import { promisify } from 'util';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { createReadStream } from 'fs';
import { join } from 'path';
import { mkdir, copyFile } from 'fs/promises';
import * as dotenv from 'dotenv';
import * as fs from 'fs/promises';
import * as path from 'path';

// Load environment variables
dotenv.config();

const execAsync = promisify(exec);

async function uploadToS3(filePath: string, fileName: string) {
  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.AWS_BUCKET_NAME) {
    console.log('AWS credentials not found, skipping S3 upload');
    return;
  }

  try {
    const client = new S3Client({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    const fileStream = createReadStream(filePath);
    const uploadParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `backups/${fileName}`,
      Body: fileStream,
    };

    await client.send(new PutObjectCommand(uploadParams));
    console.log('Backup uploaded to S3 successfully');
  } catch (error) {
    console.error('Error uploading to S3:', error);
  }
}

async function backupSQLite() {
  console.log('Creating SQLite backup...');
  const timestamp = new Date().toISOString().replace(/:/g, '-');
  const backupPath = path.join(process.cwd(), 'backups', `backup_${timestamp}.db`);
  
  try {
    // Create backups directory if it doesn't exist
    await fs.mkdir(path.join(process.cwd(), 'backups'), { recursive: true });
    
    // Copy the SQLite database file
    await fs.copyFile(
      path.join(process.cwd(), 'prisma', 'dev.db'),
      backupPath
    );
    
    console.log(`SQLite backup created at: ${backupPath}`);
    return backupPath;
  } catch (error) {
    console.error('Error backing up SQLite database:', error);
    throw error;
  }
}

async function main() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  try {
    // Create backups directory if it doesn't exist
    await mkdir(join(process.cwd(), 'backups'), { recursive: true, mode: 0o755 });

    if (databaseUrl.startsWith('postgresql://')) {
      // PostgreSQL backup
      console.log('Creating PostgreSQL backup...');
      const backupPath = join(process.cwd(), 'backups', `backup_${timestamp}.sql`);
      await execAsync(`pg_dump "${databaseUrl}" > "${backupPath}"`);
      console.log('PostgreSQL backup created successfully');
      
      // Upload to S3 if credentials are available
      await uploadToS3(backupPath, `backup_${timestamp}.sql`);
    } else if (databaseUrl.startsWith('file:')) {
      // SQLite backup
      const backupPath = await backupSQLite();
      
      // Upload to S3 if credentials are available
      await uploadToS3(backupPath, `backup_${timestamp}.db`);
    } else {
      throw new Error('Unsupported database type. Only PostgreSQL and SQLite are supported.');
    }

    // Clean up local backups older than 7 days
    await execAsync('find backups -type f -mtime +7 -delete');
  } catch (error) {
    console.error('Backup failed:', error);
    process.exit(1);
  }
}

main(); 