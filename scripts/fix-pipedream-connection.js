/**
 * Pipedream Connection Troubleshooter
 * 
 * This script verifies your Pipedream environment configuration and helps fix common issues
 * that prevent connections from working properly.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const https = require('https');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Check for required environment variables
const requiredEnvVars = [
  'NEXT_PUBLIC_PIPEDREAM_CLIENT_ID',
  'PIPEDREAM_CLIENT_SECRET',
  'PIPEDREAM_PROJECT_ID',
  'PIPEDREAM_PROJECT_ENVIRONMENT'
];

// Additional recommended variables
const recommendedEnvVars = [
  'NEXT_PUBLIC_APP_URL',
  'NEXT_PUBLIC_PIPEDREAM_REDIRECT_URI'
];

// Paths to check for environment variables
const envPaths = [
  '.env',
  '.env.local',
  '.env.development',
  '.env.production'
];

console.log('🔍 Pipedream Connection Troubleshooter');
console.log('======================================\n');

// Check environment files
console.log('Checking environment files...');
const existingEnvFiles = envPaths.filter(file => fs.existsSync(file));

if (existingEnvFiles.length === 0) {
  console.log('❌ No environment files found. Creating .env.local...');
  fs.writeFileSync('.env.local', '# Pipedream Environment Variables\n\n');
  existingEnvFiles.push('.env.local');
} else {
  console.log('✅ Found environment files:', existingEnvFiles.join(', '));
}

// Function to get value from any env file
function getEnvValue(key) {
  for (const envFile of existingEnvFiles) {
    if (!fs.existsSync(envFile)) continue;
    
    const content = fs.readFileSync(envFile, 'utf8');
    const regex = new RegExp(`${key}="?([^"\n]*)"?`, 'i');
    const match = content.match(regex);
    
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  
  return null;
}

// Function to add or update a value in .env.local
function setEnvValue(key, value) {
  const envFile = '.env.local';
  let content = '';
  
  if (fs.existsSync(envFile)) {
    content = fs.readFileSync(envFile, 'utf8');
    
    // Check if key already exists
    const regex = new RegExp(`^${key}=.*$`, 'm');
    if (regex.test(content)) {
      // Update existing key
      content = content.replace(regex, `${key}="${value}"`);
    } else {
      // Add new key
      content += `\n${key}="${value}"`;
    }
  } else {
    content = `# Pipedream Environment Variables\n\n${key}="${value}"\n`;
  }
  
  fs.writeFileSync(envFile, content);
  console.log(`✅ Updated ${key} in ${envFile}`);
}

// Check for required variables
console.log('\nChecking required environment variables...');
const missingVars = [];

for (const envVar of requiredEnvVars) {
  const value = getEnvValue(envVar);
  if (!value) {
    console.log(`❌ Missing: ${envVar}`);
    missingVars.push(envVar);
  } else {
    console.log(`✅ Found: ${envVar}`);
  }
}

// Check Pipedream service availability
console.log('\nChecking Pipedream service availability...');

function checkPipedreamService() {
  return new Promise((resolve) => {
    const req = https.get('https://api.pipedream.com/v1/health', (res) => {
      if (res.statusCode === 200) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
    
    req.on('error', () => {
      resolve(false);
    });
    
    req.end();
  });
}

async function runDiagnostics() {
  const serviceAvailable = await checkPipedreamService();
  
  if (serviceAvailable) {
    console.log('✅ Pipedream service is available');
  } else {
    console.log('❌ Cannot connect to Pipedream service. Check your internet connection.');
    process.exit(1);
  }
  
  // Prompt for missing variables if needed
  if (missingVars.length > 0) {
    console.log('\n⚠️ Some required environment variables are missing.');
    console.log('Please visit https://pipedream.com/dashboard to get your API credentials.');
    
    const promptForVars = async () => {
      for (const envVar of missingVars) {
        await new Promise((resolve) => {
          rl.question(`Enter value for ${envVar}: `, (answer) => {
            if (answer.trim()) {
              setEnvValue(envVar, answer.trim());
            }
            resolve();
          });
        });
      }
    };
    
    await promptForVars();
  }
  
  // Check if NEXT_PUBLIC_APP_URL is set correctly
  const appUrl = getEnvValue('NEXT_PUBLIC_APP_URL');
  if (!appUrl) {
    console.log('\n⚠️ NEXT_PUBLIC_APP_URL is not set. This may cause callback issues.');
    const defaultUrl = 'http://localhost:3000';
    
    await new Promise((resolve) => {
      rl.question(`Enter your application URL (default: ${defaultUrl}): `, (answer) => {
        const url = answer.trim() || defaultUrl;
        setEnvValue('NEXT_PUBLIC_APP_URL', url);
        resolve();
      });
    });
  }
  
  // Ensure redirect URI is set
  const redirectUri = getEnvValue('NEXT_PUBLIC_PIPEDREAM_REDIRECT_URI');
  if (!redirectUri) {
    const newAppUrl = getEnvValue('NEXT_PUBLIC_APP_URL') || 'http://localhost:3000';
    const defaultRedirectUri = `${newAppUrl}/api/pipedream/callback`;
    
    await new Promise((resolve) => {
      rl.question(`Enter your redirect URI (default: ${defaultRedirectUri}): `, (answer) => {
        const uri = answer.trim() || defaultRedirectUri;
        setEnvValue('NEXT_PUBLIC_PIPEDREAM_REDIRECT_URI', uri);
        resolve();
      });
    });
  }
  
  // Verify configuration
  console.log('\n🔍 Verifying configuration...');
  const clientId = getEnvValue('NEXT_PUBLIC_PIPEDREAM_CLIENT_ID');
  const clientSecret = getEnvValue('PIPEDREAM_CLIENT_SECRET');
  const projectId = getEnvValue('PIPEDREAM_PROJECT_ID');
  
  if (!clientId || !clientSecret || !projectId) {
    console.log('❌ Still missing required environment variables. Please set them manually.');
  } else {
    console.log('✅ All required environment variables are set.');
    
    // Restart the development server if running locally
    console.log('\n🔄 You need to restart your development server to apply the changes.');
    await new Promise((resolve) => {
      rl.question('Do you want to restart the server now? (y/n): ', (answer) => {
        if (answer.toLowerCase() === 'y') {
          try {
            console.log('Restarting development server...');
            execSync('npm run dev', { stdio: 'inherit' });
          } catch (error) {
            console.error('Failed to restart server:', error);
          }
        }
        resolve();
      });
    });
  }
  
  rl.close();
}

runDiagnostics().catch(console.error); 