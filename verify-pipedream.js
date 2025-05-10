/* eslint-disable @typescript-eslint/no-var-requires */
// Script to verify Pipedream Connect credentials and configuration
require('dotenv').config();
const axios = require('axios').default;

// Clean environment variables (similar to fix-env.ts)
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

// Extract and clean Pipedream credentials
const credentials = {
  clientId: cleanEnvValue(process.env.PIPEDREAM_CLIENT_ID || process.env.NEXT_PUBLIC_PIPEDREAM_CLIENT_ID),
  clientSecret: cleanEnvValue(process.env.PIPEDREAM_CLIENT_SECRET),
  projectId: cleanEnvValue(process.env.PIPEDREAM_PROJECT_ID),
  environment: cleanEnvValue(process.env.PIPEDREAM_PROJECT_ENVIRONMENT || 'development')
};

// Display credentials (partially masked)
console.log('Verifying Pipedream credentials:');
Object.entries(credentials).forEach(([key, value]) => {
  if (!value) {
    console.log(`❌ ${key}: Missing`);
  } else if (key === 'clientSecret') {
    console.log(`✓ ${key}: ${value.substring(0, 4)}...${value.substring(value.length - 4)}`);
  } else {
    console.log(`✓ ${key}: ${value}`);
  }
});

// Verify if all required credentials are present
const missingCredentials = Object.entries(credentials)
  .filter(([_, value]) => !value)
  .map(([key]) => key);

if (missingCredentials.length > 0) {
  console.error(`\n❌ Missing required credentials: ${missingCredentials.join(', ')}`);
  console.error('Please add these to your .env.local file');
  process.exit(1);
}

// Verify credentials by making a request to Pipedream's API
async function verifyCredentials() {
  try {
    console.log('\nVerifying credentials with Pipedream API...');
    
    // First get a client credentials token
    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    params.append('client_id', credentials.clientId);
    params.append('client_secret', credentials.clientSecret);
    
    console.log('Requesting OAuth token...');
    const tokenResponse = await axios.post(
      'https://api.pipedream.com/v1/oauth2/token',
      params.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    
    if (!tokenResponse.data.access_token) {
      throw new Error('No access token received from Pipedream');
    }
    
    console.log('✓ Successfully received OAuth access token');
    
    // Now try to create a connect token
    const userId = `test-user-${Date.now()}`;
    
    console.log('Creating connect token...');
    const connectTokenResponse = await axios.post(
      'https://api.pipedream.com/v1/connect/tokens',
      {
        project_id: credentials.projectId,
        environment: credentials.environment,
        external_user_id: userId,
        user_facing_label: `Test connection for ${userId}`,
      },
      {
        headers: {
          'Authorization': `Bearer ${tokenResponse.data.access_token}`,
          'Content-Type': 'application/json',
        }
      }
    );
    
    if (!connectTokenResponse.data.token) {
      throw new Error('No connect token received from Pipedream');
    }
    
    console.log('✓ Successfully created connect token');
    console.log(`✓ Connect URL: ${connectTokenResponse.data.connect_link_url}`);
    
    return {
      success: true,
      tokenData: connectTokenResponse.data
    };
  } catch (error) {
    console.error('❌ Verification failed:');
    
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error('Response data:', error.response.data);
      
      // Check for specific error types
      if (error.response.status === 401) {
        console.error('\nDIAGNOSIS: Authentication failed. Check your client ID and client secret.');
      } else if (error.response.status === 404) {
        console.error('\nDIAGNOSIS: API endpoint not found. Check that you are using the correct API URL.');
      } else if (error.response.data?.error === 'invalid_client') {
        console.error('\nDIAGNOSIS: Invalid client credentials. Your client ID or client secret is incorrect.');
      } else if (error.response.data?.error === 'invalid_request' || error.response.data?.error_description?.includes('must be a string')) {
        console.error('\nDIAGNOSIS: Invalid request format. Check that your client ID and client secret are properly formatted.');
      } else if (error.response.data?.error_description?.includes('project')) {
        console.error('\nDIAGNOSIS: Project ID issue. Make sure your project ID is correct and associated with your client credentials.');
      }
    } else {
      console.error(`Error: ${error.message}`);
    }
    
    return {
      success: false,
      error: error.message,
      details: error.response?.data
    };
  }
}

// Suggest environment variables to add to .env.local
function suggestEnvVariables() {
  const envContent = `
# Pipedream Configuration
PIPEDREAM_CLIENT_ID=${credentials.clientId}
PIPEDREAM_CLIENT_SECRET=${credentials.clientSecret}
PIPEDREAM_PROJECT_ID=${credentials.projectId}
PIPEDREAM_PROJECT_ENVIRONMENT=${credentials.environment}
NEXT_PUBLIC_PIPEDREAM_CLIENT_ID=${credentials.clientId}
NEXT_PUBLIC_PIPEDREAM_REDIRECT_URI=https://app.isyncso.com/api/pipedream/callback
  `.trim();
  
  console.log('\nSuggested environment variables for .env.local:');
  console.log(envContent);
}

// Run the verification
verifyCredentials()
  .then(result => {
    if (result.success) {
      console.log('\n✅ Pipedream credentials verified successfully!');
      suggestEnvVariables();
      process.exit(0);
    } else {
      console.error('\n❌ Pipedream credentials verification failed.');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('Unexpected error:', error);
    process.exit(1);
  }); 