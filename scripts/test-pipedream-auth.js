#!/usr/bin/env node

/**
 * Pipedream Authentication Tester
 * 
 * This script directly tests Pipedream authentication without relying on the Next.js framework.
 * It helps isolate whether the issue is with Pipedream credentials or with your application.
 * 
 * Usage: node scripts/test-pipedream-auth.js
 */

const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const { createBackendClient } = require('@pipedream/sdk/server');

// Load environment variables from .env files
if (fs.existsSync('.env.local')) {
  console.log('Loading environment from .env.local');
  dotenv.config({ path: '.env.local' });
} else if (fs.existsSync('.env')) {
  console.log('Loading environment from .env');
  dotenv.config();
}

// Color output for terminal
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Log the current environment variables (redacted for security)
console.log(`${colors.blue}=== Pipedream Configuration ===${colors.reset}`);
console.log(`Client ID: ${process.env.PIPEDREAM_CLIENT_ID ? `${process.env.PIPEDREAM_CLIENT_ID.substring(0, 5)}...` : `${colors.red}Not Set${colors.reset}`}`);
console.log(`Client Secret: ${process.env.PIPEDREAM_CLIENT_SECRET ? `${colors.green}Set${colors.reset}` : `${colors.red}Not Set${colors.reset}`}`);
console.log(`Project ID: ${process.env.PIPEDREAM_PROJECT_ID || `${colors.red}Not Set${colors.reset}`}`);
console.log(`Environment: ${process.env.PIPEDREAM_PROJECT_ENVIRONMENT || process.env.NODE_ENV || 'development'}`);

// Clean up environment variables (remove newlines, etc.)
const cleanEnvVar = (value) => {
  if (!value) return value;
  return value.replace(/\r?\n|\r/g, '').trim();
};

const config = {
  clientId: cleanEnvVar(process.env.PIPEDREAM_CLIENT_ID),
  clientSecret: cleanEnvVar(process.env.PIPEDREAM_CLIENT_SECRET),
  projectId: cleanEnvVar(process.env.PIPEDREAM_PROJECT_ID),
  environment: cleanEnvVar(process.env.PIPEDREAM_PROJECT_ENVIRONMENT) || process.env.NODE_ENV || 'development'
};

// Validate required configuration
const missingVars = [];
if (!config.clientId) missingVars.push('PIPEDREAM_CLIENT_ID');
if (!config.clientSecret) missingVars.push('PIPEDREAM_CLIENT_SECRET');
if (!config.projectId) missingVars.push('PIPEDREAM_PROJECT_ID');

if (missingVars.length > 0) {
  console.error(`${colors.red}Error: Missing required environment variables: ${missingVars.join(', ')}${colors.reset}`);
  process.exit(1);
}

// Test with the loaded configuration
async function testWithConfig() {
  console.log(`\n${colors.blue}Testing with loaded environment variables...${colors.reset}`);
  console.log(`Creating client with Project ID: ${config.projectId}, Environment: ${config.environment}`);
  
  try {
    const client = createBackendClient({
      projectId: config.projectId,
      environment: config.environment,
      credentials: {
        clientId: config.clientId,
        clientSecret: config.clientSecret,
      }
    });
    
    console.log(`${colors.green}Client created successfully${colors.reset}`);
    
    // Generate a unique test user ID
    const testUserId = `test-user-${Date.now()}`;
    console.log(`Creating token for test user ID: ${testUserId}`);
    
    try {
      const tokenResponse = await client.createConnectToken({
        external_user_id: testUserId,
        user_facing_label: 'CLI Test User'
      });
      
      console.log(`${colors.green}Success! Token created:${colors.reset}`);
      console.log(`- Token present: ${tokenResponse.token ? 'Yes' : 'No'}`);
      console.log(`- Expires at: ${new Date(tokenResponse.expires_at).toLocaleString()}`);
      console.log(`- Connect URL: ${tokenResponse.connect_link_url ? 'Available' : 'Not available'}`);
      
      return true;
    } catch (tokenError) {
      console.error(`${colors.red}Error creating token:${colors.reset}`, tokenError.message);
      if (tokenError.response?.data) {
        console.error('API Response:', tokenError.response.data);
      }
      
      // Check for specific error messages
      if (tokenError.message.includes('ran out of attempts')) {
        console.error(`${colors.yellow}This error often indicates an issue with the OAuth app configuration in Pipedream.${colors.reset}`);
        console.error(`${colors.yellow}Verify that your OAuth app is correctly set up and the redirect URI is properly configured.${colors.reset}`);
      }
      
      return false;
    }
  } catch (clientError) {
    console.error(`${colors.red}Error creating client:${colors.reset}`, clientError.message);
    return false;
  }
}

// Test with hardcoded fallback
async function testWithFallback() {
  console.log(`\n${colors.blue}Testing with fallback configuration...${colors.reset}`);
  
  const fallbackConfig = {
    projectId: "proj_LosDxgO",  // Your project ID from the screenshot
    clientId: "kWYR9dn6Vmk7MnLuVfoXx4jsedOcp83vBg6st3rWuiM",  // From your env vars
    clientSecret: config.clientSecret,  // Reuse the same secret
    environment: "development"
  };
  
  console.log(`Creating client with Project ID: ${fallbackConfig.projectId}, Environment: ${fallbackConfig.environment}`);
  
  try {
    const client = createBackendClient({
      projectId: fallbackConfig.projectId,
      environment: fallbackConfig.environment,
      credentials: {
        clientId: fallbackConfig.clientId,
        clientSecret: fallbackConfig.clientSecret,
      }
    });
    
    console.log(`${colors.green}Fallback client created successfully${colors.reset}`);
    
    // Generate a unique test user ID
    const testUserId = `fallback-user-${Date.now()}`;
    console.log(`Creating token for fallback user ID: ${testUserId}`);
    
    try {
      const tokenResponse = await client.createConnectToken({
        external_user_id: testUserId,
        user_facing_label: 'CLI Fallback Test User'
      });
      
      console.log(`${colors.green}Success with fallback! Token created:${colors.reset}`);
      console.log(`- Token present: ${tokenResponse.token ? 'Yes' : 'No'}`);
      console.log(`- Expires at: ${new Date(tokenResponse.expires_at).toLocaleString()}`);
      
      return true;
    } catch (tokenError) {
      console.error(`${colors.red}Error creating token with fallback:${colors.reset}`, tokenError.message);
      if (tokenError.response?.data) {
        console.error('API Response:', tokenError.response.data);
      }
      return false;
    }
  } catch (clientError) {
    console.error(`${colors.red}Error creating fallback client:${colors.reset}`, clientError.message);
    return false;
  }
}

// Run the tests
async function runTests() {
  console.log(`${colors.magenta}Starting Pipedream authentication tests...${colors.reset}\n`);
  
  const envTest = await testWithConfig();
  
  if (!envTest) {
    console.log(`\n${colors.yellow}Environment test failed. Trying with fallback configuration...${colors.reset}`);
    const fallbackTest = await testWithFallback();
    
    if (fallbackTest) {
      console.log(`\n${colors.green}✅ Fallback test succeeded!${colors.reset}`);
      console.log(`${colors.cyan}This suggests an issue with your environment configuration rather than Pipedream credentials.${colors.reset}`);
      console.log(`${colors.cyan}Check that your project environment and project ID match your Pipedream OAuth app.${colors.reset}`);
    } else {
      console.log(`\n${colors.red}❌ Both tests failed.${colors.reset}`);
      console.log(`${colors.yellow}This suggests an issue with Pipedream's service or your OAuth app configuration.${colors.reset}`);
      console.log(`\n${colors.cyan}Troubleshooting steps:${colors.reset}`);
      console.log(`1. Verify your Pipedream OAuth app is properly configured`);
      console.log(`2. Check that your redirect URI is correct: ${process.env.NEXT_PUBLIC_PIPEDREAM_REDIRECT_URI || 'Not Set'}`);
      console.log(`3. Make sure your Pipedream account has valid OAuth permissions`);
      console.log(`4. Check if Pipedream is having service issues`);
    }
  } else {
    console.log(`\n${colors.green}✅ Authentication test succeeded!${colors.reset}`);
    console.log(`${colors.cyan}Your Pipedream configuration appears to be working correctly.${colors.reset}`);
    console.log(`${colors.cyan}If you're still having issues in your app, the problem might be with your application's integration.${colors.reset}`);
  }
}

runTests().catch(err => {
  console.error(`${colors.red}Unexpected error:${colors.reset}`, err);
  process.exit(1);
}); 