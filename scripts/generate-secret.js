#!/usr/bin/env node

/**
 * This script generates a secure random string to use as NEXTAUTH_SECRET
 * Run with: node scripts/generate-secret.js
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

function generateSecret(length = 64) {
  return crypto.randomBytes(length).toString('base64');
}

function generateEncryptionKey() {
  return crypto.randomBytes(32).toString('hex');
}

function updateEnvFile(filename, updates) {
  const envPath = path.resolve(process.cwd(), filename);
  let envContent = '';
  
  try {
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    }
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
  }

  const envLines = envContent.split('\n');
  const updatedLines = [];
  const processedKeys = new Set();

  // Update existing variables
  for (const line of envLines) {
    const match = line.match(/^([^=]+)=/);
    if (match) {
      const key = match[1].trim();
      if (updates[key]) {
        updatedLines.push(`${key}=${updates[key]}`);
        processedKeys.add(key);
      } else {
        updatedLines.push(line);
      }
    } else if (line.trim()) {
      updatedLines.push(line);
    }
  }

  // Add new variables
  for (const [key, value] of Object.entries(updates)) {
    if (!processedKeys.has(key)) {
      updatedLines.push(`${key}=${value}`);
    }
  }

  try {
    fs.writeFileSync(envPath, updatedLines.join('\n') + '\n');
    console.log(`Updated ${filename} successfully`);
  } catch (error) {
    console.error(`Error writing to ${filename}:`, error);
    process.exit(1);
  }
}

function main() {
  const nodeEnv = process.env.NODE_ENV || 'development';
  const envFile = nodeEnv === 'production' ? '.env.production' : '.env';

  console.log(`Generating secrets for ${nodeEnv} environment...`);

  const updates = {
    NEXTAUTH_SECRET: generateSecret(),
    JWT_SECRET: generateSecret(),
    ENCRYPTION_KEY: generateEncryptionKey(),
  };

  // Log the generated secrets
  console.log('\nGenerated secrets:');
  Object.entries(updates).forEach(([key, value]) => {
    console.log(`${key}=${value}`);
  });

  // Update the environment file
  updateEnvFile(envFile, updates);

  console.log('\n✅ Secrets generated and updated successfully');
  console.log('⚠️  Make sure to keep these secrets safe and never commit them to version control');
}

main(); 