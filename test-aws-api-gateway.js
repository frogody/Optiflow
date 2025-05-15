#!/usr/bin/env node

// This script tests the AWS API Gateway authentication
import { config } from 'dotenv';
import fetch from 'node-fetch';

// Load environment variables
config({ path: '.env.local' });

// Configuration
const API_KEY = process.env.NEXT_PUBLIC_AWS_API_KEY;
const API_ENDPOINT = process.env.NEXT_PUBLIC_AWS_API_ENDPOINT || 'sfd8q2ch3k.execute-api.us-east-2.amazonaws.com';

// Common endpoints to try
const TEST_PATHS = [
  '/prod/health',
  '/v1/health',
  '/v1/status',
  '/prod/status',
  '/api/health',
  '/api/status',
  '/health',
  '/status',
  '/prod/api/health',
  '/prod/api/status'
];

// Validate configuration
if (!API_KEY) {
  console.error('\x1b[31mError: NEXT_PUBLIC_AWS_API_KEY not found in environment variables\x1b[0m');
  console.log('Please run ./setup-aws-api-key.sh to configure your API key');
  process.exit(1);
}

console.log(`\x1b[36m=== AWS API Gateway Authentication Test ===\x1b[0m`);
console.log(`API Gateway: ${API_ENDPOINT}`);
console.log(`Using API Key: ${API_KEY.substring(0, 5)}...${API_KEY.substring(API_KEY.length - 4)}`);

// Function to test a specific endpoint
async function testEndpoint(path) {
  const url = `https://${API_ENDPOINT}${path}`;
  console.log(`\n\x1b[36mTesting endpoint: ${url}\x1b[0m`);
  
  // Test without API key first
  console.log('\n\x1b[33mTest without API Key:\x1b[0m');
  try {
    const response = await fetch(url);
    const status = response.status;
    
    if (status === 403) {
      console.log('\x1b[32m✓ Got expected 403 Forbidden response without API key\x1b[0m');
    } else if (status === 404) {
      console.log('\x1b[33m• Endpoint returned 404 Not Found (endpoint might not exist)\x1b[0m');
      return false; // Skip further testing since endpoint doesn't exist
    } else {
      console.log(`\x1b[31m✗ Unexpected status without API key: ${status}\x1b[0m`);
      try {
        const body = await response.text();
        console.log('Response body:', body.substring(0, 200) + (body.length > 200 ? '...' : ''));
      } catch (e) {
        console.log('Could not read response body');
      }
    }
  } catch (error) {
    console.error('\x1b[31m✗ Request failed:', error.message, '\x1b[0m');
    return false;
  }
  
  // Test with API key
  console.log('\n\x1b[33mTest with API Key:\x1b[0m');
  try {
    const response = await fetch(url, {
      headers: {
        'x-api-key': API_KEY
      }
    });
    
    const status = response.status;
    console.log(`Status code: ${status}`);
    
    if (status === 200) {
      console.log('\x1b[32m✓ Success! Authentication working correctly\x1b[0m');
      try {
        const body = await response.json();
        console.log('Response:', JSON.stringify(body, null, 2));
      } catch (e) {
        try {
          const body = await response.text();
          console.log('Response body (text):', body.substring(0, 200) + (body.length > 200 ? '...' : ''));
        } catch {
          console.log('Could not read response body');
        }
      }
      return true;
    } else if (status === 404) {
      console.log('\x1b[33m• Endpoint returned 404 Not Found (endpoint might not exist)\x1b[0m');
      return false;
    } else {
      console.log(`\x1b[31m✗ Unexpected status code with API key: ${status}\x1b[0m`);
      try {
        const body = await response.text();
        console.log('Response body:', body);
      } catch (e) {
        console.log('Could not read response body');
      }
      return false;
    }
  } catch (error) {
    console.error('\x1b[31m✗ Request failed:', error.message, '\x1b[0m');
    return false;
  }
}

// Run tests sequentially
async function runTests() {
  console.log('\n\x1b[36mTesting multiple common endpoints to find available API paths...\x1b[0m');
  
  let foundEndpoint = false;
  
  for (const path of TEST_PATHS) {
    const result = await testEndpoint(path);
    if (result) {
      console.log(`\n\x1b[32m✓ Found working endpoint: ${path}\x1b[0m`);
      foundEndpoint = true;
      break;
    }
  }
  
  if (!foundEndpoint) {
    console.log('\n\x1b[33mNo working endpoints found among the tested paths.\x1b[0m');
    console.log('This could mean:');
    console.log('1. Your API Gateway is not correctly configured');
    console.log('2. The tested paths don\'t match your actual API paths');
    console.log('3. The API key is not properly associated with your API');
    
    console.log('\n\x1b[36mNext steps:\x1b[0m');
    console.log('1. Check your AWS API Gateway configuration');
    console.log('2. Verify the correct endpoint URL and available paths');
    console.log('3. Ensure your API key is enabled and associated with a usage plan');
  }
  
  console.log('\n\x1b[36m=== Test Complete ===\x1b[0m');
}

runTests().catch(error => {
  console.error('\x1b[31mTest execution error:', error, '\x1b[0m');
}); 