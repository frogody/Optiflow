#!/usr/bin/env node

/**
 * This script checks if all required environment variables are set
 * Run with: node scripts/check-env.js
 */

const fs = require('fs');
const path = require('path');

const requiredEnvVars = [
  'NODE_ENV',
  'NEXTAUTH_URL',
  'NEXTAUTH_SECRET',
  'DATABASE_URL',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'ENCRYPTION_KEY',
  'JWT_SECRET',
];

const optionalEnvVars = [
  'NEXT_PUBLIC_PIPEDREAM_CLIENT_ID',
  'PIPEDREAM_CLIENT_SECRET',
  'NEXT_PUBLIC_PIPEDREAM_PROJECT_ID',
  'NEXT_PUBLIC_PIPEDREAM_TOKEN',
  'MCP_SERVICE_URL',
  'ANALYTICS_SERVICE_URL',
  'OPENAI_API_KEY',
  'AWS_ACCESS_KEY_ID',
  'AWS_SECRET_ACCESS_KEY',
  'AWS_BUCKET_NAME',
  'AWS_REGION',
];

function loadEnvFile(filename) {
  try {
    const envPath = path.resolve(process.cwd(), filename);
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const envVars = {};
      
      envContent.split('\n').forEach(line => {
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) {
          const [, key, value] = match;
          envVars[key.trim()] = value.trim();
        }
      });
      
      return envVars;
    }
  } catch (error) {
    console.error(`Error loading ${filename}:`, error);
  }
  return {};
}

function checkEnvVars() {
  const nodeEnv = process.env.NODE_ENV || 'development';
  const envFile = nodeEnv === 'production' ? '.env.production' : '.env';
  const envVars = {
    ...loadEnvFile('.env'),
    ...loadEnvFile(envFile),
    ...process.env
  };

  console.log(`Checking environment variables for ${nodeEnv} environment...`);

  const missingRequired = [];
  const missingOptional = [];

  // Check required variables
  requiredEnvVars.forEach(varName => {
    if (!envVars[varName]) {
      missingRequired.push(varName);
    }
  });

  // Check optional variables
  optionalEnvVars.forEach(varName => {
    if (!envVars[varName]) {
      missingOptional.push(varName);
    }
  });

  // Report results
  if (missingRequired.length > 0) {
    console.error('\n❌ Missing required environment variables:');
    missingRequired.forEach(varName => {
      console.error(`   - ${varName}`);
    });
    process.exit(1);
  }

  if (missingOptional.length > 0) {
    console.warn('\n⚠️  Missing optional environment variables:');
    missingOptional.forEach(varName => {
      console.warn(`   - ${varName}`);
    });
  }

  // Validate URL format
  const urlVars = ['NEXTAUTH_URL', 'MCP_SERVICE_URL', 'ANALYTICS_SERVICE_URL'];
  urlVars.forEach(varName => {
    if (envVars[varName]) {
      try {
        new URL(envVars[varName]);
      } catch (error) {
        console.error(`\n❌ Invalid URL format for ${varName}: ${envVars[varName]}`);
        process.exit(1);
      }
    }
  });

  // Validate secrets length
  const secretVars = ['NEXTAUTH_SECRET', 'JWT_SECRET', 'ENCRYPTION_KEY'];
  secretVars.forEach(varName => {
    if (envVars[varName] && envVars[varName].length < 32) {
      console.warn(`\n⚠️  Warning: ${varName} should be at least 32 characters long`);
    }
  });

  console.log('\n✅ Environment validation completed successfully');
}

checkEnvVars(); 