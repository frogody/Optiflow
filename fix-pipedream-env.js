// Script to fix Pipedream environment variables and test token creation
require('dotenv').config();
const fs = require('fs');

const { createBackendClient } = require('@pipedream/sdk/server');

// Check what's in the environment
console.log('Current environment variables:');
Object.keys(process.env).filter(key => key.includes('PIPEDREAM')).forEach(key => {
  const value = process.env[key];
  console.log(`${key}: ${value ? (value.length > 5 ? `${value.substring(0, 5)}...` : value) : 'undefined'}`);
});

// Fixed environment variables
const fixedEnv = {
  PIPEDREAM_CLIENT_ID: 'kWYR9dn6Vmk7MnLuVfoXx4jsedOcp83vBg6st3rWuiM',
  PIPEDREAM_CLIENT_SECRET: 'ayINomSnhCcHGR6Xf1_4PElM25mqsEFsrvTHKQ7ink0',
  PIPEDREAM_PROJECT_ID: 'proj_LosDxgO',
  PIPEDREAM_PROJECT_ENVIRONMENT: 'development'
};

// Apply fixed values to the current environment
Object.entries(fixedEnv).forEach(([key, value]) => {
  process.env[key] = value;
});

console.log('\nFixed environment variables:');
Object.keys(fixedEnv).forEach(key => {
  const value = process.env[key];
  console.log(`${key}: ${value ? (value.length > 5 ? `${value.substring(0, 5)}...` : value) : 'undefined'}`);
});

// Create config with fixed values
const config = {
  projectId: process.env.PIPEDREAM_PROJECT_ID,
  environment: process.env.PIPEDREAM_PROJECT_ENVIRONMENT,
  credentials: {
    clientId: process.env.PIPEDREAM_CLIENT_ID,
    clientSecret: process.env.PIPEDREAM_CLIENT_SECRET,
  }
};

console.log('\nTest configuration:');
console.log({
  'projectId': config.projectId,
  'environment': config.environment,
  'credentials.clientId': config.credentials.clientId ? `${config.credentials.clientId.substring(0, 5)}...` : undefined,
  'credentials.clientSecret': config.credentials.clientSecret ? `${config.credentials.clientSecret.substring(0, 5)}...` : 'Not set',
});

async function testTokenCreation() {
  try {
    console.log('\nCreating Pipedream backend client...');
    const pd = createBackendClient(config);
    console.log('Client created successfully');
    
    // Create a test user ID
    const testUserId = `test-user-${Date.now()}`;
    console.log(`Creating token for user: ${testUserId}`);
    
    // Try to create a token
    const response = await pd.createConnectToken({
      external_user_id: testUserId,
      user_facing_label: `Test connection for ${testUserId}`
    });
    
    console.log('Token created successfully!');
    console.log({
      hasToken: !!response.token,
      tokenLength: response.token ? response.token.length : 0,
      expiresAt: response.expires_at,
      hasConnectUrl: !!response.connect_link_url
    });
    
    return response;
  } catch (error) {
    console.error('Error creating token:');
    console.error('- Message:', error.message);
    
    if (error.response) {
      console.error('- Response status:', error.response.status);
      console.error('- Response data:', JSON.stringify(error.response.data, null, 2));
    }
    
    // Detailed error analysis
    if (error.message.includes('authentication') || error.message.includes('oauth')) {
      console.error('DIAGNOSIS: Authentication issue. Possible causes:');
      console.error('1. Client ID or Secret is incorrect');
      console.error('2. Client credentials are not properly configured in Pipedream');
      console.error('3. Project ID may not match the client credentials');
    } 
    
    throw error;
  }
}

// Run the test
testTokenCreation()
  .then(tokenResponse => {
    console.log('\nToken test completed successfully!');
    
    // Create a suggestion for the .env.local file
    const envContent = Object.entries(fixedEnv)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');
    console.log('\nSuggested .env.local content:');
    console.log(envContent);
    
    process.exit(0);
  })
  .catch(error => {
    console.error('\nToken test failed.');
    process.exit(1);
  }); 