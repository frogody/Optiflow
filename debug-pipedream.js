// Script to debug Pipedream Connect token creation
require('dotenv').config();
const { createBackendClient } = require('@pipedream/sdk/server');

// Log all environment variables related to Pipedream
console.log('Pipedream environment variables:');
Object.keys(process.env).filter(key => key.includes('PIPEDREAM')).forEach(key => {
  const value = process.env[key];
  console.log(`${key}: ${value ? (value.length > 5 ? `${value.substring(0, 5)}...` : value) : 'undefined'}`);
});

// Create a clean config object with proper values
const config = {
  projectId: process.env.PIPEDREAM_PROJECT_ID,
  environment: (process.env.PIPEDREAM_PROJECT_ENVIRONMENT || 'development').trim(),
  credentials: {
    clientId: process.env.PIPEDREAM_CLIENT_ID || process.env.NEXT_PUBLIC_PIPEDREAM_CLIENT_ID,
    clientSecret: process.env.PIPEDREAM_CLIENT_SECRET,
  }
};

// Log the cleaned configuration
console.log('\nCleaned Pipedream configuration:');
console.log({
  'projectId': config.projectId,
  'environment': config.environment,
  'credentials.clientId': config.credentials.clientId ? `${config.credentials.clientId.substring(0, 5)}...` : undefined,
  'credentials.clientSecret': config.credentials.clientSecret ? 'Set' : 'Not set',
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
    console.error('- Stack:', error.stack);
    
    if (error.response) {
      console.error('- Response status:', error.response.status);
      console.error('- Response data:', error.response.data);
    }
    
    // Check for common error patterns
    if (error.message.includes('authentication')) {
      console.error('DIAGNOSIS: Possible authentication issue. Check client ID and secret.');
    } else if (error.message.includes('rate limit')) {
      console.error('DIAGNOSIS: Rate limit exceeded. Wait before trying again.');
    } else if (error.message.includes('project') || error.message.includes('proj_')) {
      console.error('DIAGNOSIS: Project ID issue. Verify PIPEDREAM_PROJECT_ID is correct.');
    } else if (error.message.includes('environment')) {
      console.error('DIAGNOSIS: Environment issue. Check PIPEDREAM_PROJECT_ENVIRONMENT value.');
    }
    
    throw error;
  }
}

// Run the test
testTokenCreation()
  .then(tokenResponse => {
    console.log('\nToken test completed successfully!');
    process.exit(0);
  })
  .catch(error => {
    console.error('\nToken test failed.');
    process.exit(1);
  }); 