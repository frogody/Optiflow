// Script to verify Pipedream Connect setup using the SDK directly
require('dotenv').config();
const { createBackendClient } = require('@pipedream/sdk/server');

// Clean environment variable values
const cleanEnvValue = (value) => {
  if (!value) return value;
  return value
    .replace(/\\n/g, '')
    .replace(/\n/g, '')
    .replace(/\\r/g, '')
    .replace(/\r/g, '')
    .replace(/^"(.*)"$/, '$1')
    .replace(/^'(.*)'$/, '$1')
    .replace(/.*="(.*)"\s*$/, '$1')
    .trim();
};

// Function to update environment variables
function fixEnvironmentVariables() {
  // Clean existing variables
  if (process.env.PIPEDREAM_CLIENT_ID) {
    process.env.PIPEDREAM_CLIENT_ID = cleanEnvValue(process.env.PIPEDREAM_CLIENT_ID);
  }
  
  if (process.env.NEXT_PUBLIC_PIPEDREAM_CLIENT_ID) {
    process.env.NEXT_PUBLIC_PIPEDREAM_CLIENT_ID = cleanEnvValue(process.env.NEXT_PUBLIC_PIPEDREAM_CLIENT_ID);
  }
  
  if (process.env.PIPEDREAM_CLIENT_SECRET) {
    process.env.PIPEDREAM_CLIENT_SECRET = cleanEnvValue(process.env.PIPEDREAM_CLIENT_SECRET);
  }
  
  if (process.env.PIPEDREAM_PROJECT_ID) {
    process.env.PIPEDREAM_PROJECT_ID = cleanEnvValue(process.env.PIPEDREAM_PROJECT_ID);
  }
  
  if (process.env.PIPEDREAM_PROJECT_ENVIRONMENT) {
    process.env.PIPEDREAM_PROJECT_ENVIRONMENT = cleanEnvValue(process.env.PIPEDREAM_PROJECT_ENVIRONMENT);
  }
  
  // Make sure client ID is properly set
  if (process.env.NEXT_PUBLIC_PIPEDREAM_CLIENT_ID && !process.env.PIPEDREAM_CLIENT_ID) {
    process.env.PIPEDREAM_CLIENT_ID = process.env.NEXT_PUBLIC_PIPEDREAM_CLIENT_ID;
  }
  
  // Fix client ID if it has the strange @pipedream_client_id format
  if (process.env.PIPEDREAM_CLIENT_ID && process.env.PIPEDREAM_CLIENT_ID.startsWith('@pipedream')) {
    // Override with the known good value
    process.env.PIPEDREAM_CLIENT_ID = 'kWYR9dn6Vmk7MnLuVfoXx4jsedOcp83vBg6st3rWuiM';
    console.log('Fixed incorrectly formatted PIPEDREAM_CLIENT_ID');
  }
  
  // Set default environment if missing
  if (!process.env.PIPEDREAM_PROJECT_ENVIRONMENT) {
    process.env.PIPEDREAM_PROJECT_ENVIRONMENT = 'development';
  }
  
  // Print current environment state (masking secrets)
  console.log('Current environment state:');
  [
    'PIPEDREAM_CLIENT_ID',
    'PIPEDREAM_CLIENT_SECRET',
    'PIPEDREAM_PROJECT_ID',
    'PIPEDREAM_PROJECT_ENVIRONMENT'
  ].forEach(key => {
    const value = process.env[key];
    if (!value) {
      console.log(`  ${key}: Missing`);
    } else if (key === 'PIPEDREAM_CLIENT_SECRET') {
      console.log(`  ${key}: ${value.substring(0, 3)}...${value.substring(value.length - 3)}`);
    } else {
      console.log(`  ${key}: ${value}`);
    }
  });
  
  return {
    clientId: process.env.PIPEDREAM_CLIENT_ID,
    clientSecret: process.env.PIPEDREAM_CLIENT_SECRET,
    projectId: process.env.PIPEDREAM_PROJECT_ID,
    environment: process.env.PIPEDREAM_PROJECT_ENVIRONMENT
  };
}

// Function to test token creation
async function testTokenCreation() {
  // First fix environment variables
  const config = fixEnvironmentVariables();
  
  // Check for missing required variables
  const missingVars = [];
  if (!config.clientId) missingVars.push('PIPEDREAM_CLIENT_ID');
  if (!config.clientSecret) missingVars.push('PIPEDREAM_CLIENT_SECRET');
  if (!config.projectId) missingVars.push('PIPEDREAM_PROJECT_ID');
  
  if (missingVars.length > 0) {
    console.error(`❌ Missing required variables: ${missingVars.join(', ')}`);
    process.exit(1);
  }
  
  console.log('\nCreating Pipedream backend client...');
  
  try {
    // Create the backend client with the fixed config
    const pd = createBackendClient({
      projectId: config.projectId,
      environment: config.environment,
      credentials: {
        clientId: config.clientId,
        clientSecret: config.clientSecret
      }
    });
    
    console.log('✓ Client created successfully');
    
    // Create a test user with timestamp to ensure uniqueness
    const testUserId = `test-user-${Date.now()}`;
    console.log(`Creating token for user: ${testUserId}`);
    
    // Try to create a token
    const response = await pd.createConnectToken({
      external_user_id: testUserId,
      user_facing_label: `Test connection for ${testUserId}`
    });
    
    console.log('✓ Token created successfully!');
    console.log({
      hasToken: !!response.token,
      tokenLength: response.token ? response.token.length : 0,
      expiresAt: response.expires_at,
      hasConnectUrl: !!response.connect_link_url
    });
    
    // Output the suggested .env.local configuration
    outputSuggestedConfig(config);
    
    return response;
  } catch (error) {
    console.error('❌ Token creation failed:');
    console.error(`Error message: ${error.message}`);
    
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
    
    // Provide diagnosis based on error message
    if (error.message.includes('oauth')) {
      console.error('\nDIAGNOSIS: OAuth authentication failed. Your client credentials are likely incorrect.');
      console.error('SOLUTION: Verify that your PIPEDREAM_CLIENT_ID and PIPEDREAM_CLIENT_SECRET are correct.');
    } else if (error.message.includes('project')) {
      console.error('\nDIAGNOSIS: Project-related error. Your project ID may be incorrect or not associated with your credentials.');
      console.error('SOLUTION: Check your PIPEDREAM_PROJECT_ID and verify it in your Pipedream dashboard.');
    }
    
    return null;
  }
}

// Output suggested configuration
function outputSuggestedConfig(config) {
  const envContent = `
# Pipedream Configuration
PIPEDREAM_CLIENT_ID=${config.clientId}
PIPEDREAM_CLIENT_SECRET=${config.clientSecret}
PIPEDREAM_PROJECT_ID=${config.projectId}
PIPEDREAM_PROJECT_ENVIRONMENT=${config.environment}
NEXT_PUBLIC_PIPEDREAM_CLIENT_ID=${config.clientId}
NEXT_PUBLIC_PIPEDREAM_REDIRECT_URI=https://app.isyncso.com/api/pipedream/callback
`.trim();

  console.log('\nSuggested .env.local configuration:');
  console.log(envContent);
  
  console.log('\nIMPORTANT: Make sure you have also updated fix-env.ts to properly clean environment variables.');
}

// Run the test
testTokenCreation()
  .then(result => {
    if (result) {
      console.log('\n✅ Pipedream authentication successful!');
      console.log('Connection URL:', result.connect_link_url);
    } else {
      console.error('\n❌ Pipedream authentication failed. See error details above.');
    }
  })
  .catch(error => {
    console.error('Unexpected error:', error);
  }); 