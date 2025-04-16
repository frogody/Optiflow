#!/usr/bin/env node

/**
 * This script checks if all required environment variables are set
 * Run with: node scripts/check-env.js
 */

const fs = require('fs');
const path = require('path');

// Required environment variables
const requiredVars = [
  'NEXT_PUBLIC_PIPEDREAM_API_KEY',
  'NEXT_PUBLIC_PIPEDREAM_API_SECRET',
  'NEXT_PUBLIC_PIPEDREAM_CLIENT_ID',
  'NEXT_PUBLIC_PIPEDREAM_TOKEN',
  'DATABASE_URL',
  'NEXTAUTH_URL',
  'NEXTAUTH_SECRET',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET'
];

// Check .env.production file
const envFile = path.join(process.cwd(), '.env.production');

if (!fs.existsSync(envFile)) {
  console.error('\n❌ .env.production file not found!');
  process.exit(1);
}

const envContent = fs.readFileSync(envFile, 'utf8');
const missingVars = [];

for (const varName of requiredVars) {
  // Check if the variable is set and not empty
  if (!envContent.includes(`${varName}=`) || envContent.includes(`${varName}=''`) || envContent.includes(`${varName}=""`)) {
    missingVars.push(varName);
  }
}

if (missingVars.length > 0) {
  console.error('\n❌ The following required environment variables are missing or empty:');
  missingVars.forEach(varName => console.error(`   - ${varName}`));
  console.error('\nPlease set these variables in your .env.production file before deploying.');
  process.exit(1);
} else {
  console.log('\n✅ All required environment variables are set!');
  console.log('🚀 Ready for deployment.');
} 