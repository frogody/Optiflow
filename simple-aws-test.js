#!/usr/bin/env node

/**
 * Simple AWS API Gateway Authentication Test
 * 
 * This script performs a direct test of the specified AWS API Gateway endpoint
 * with your API key to verify that authentication is working properly.
 */

import { config } from 'dotenv';
import fetch from 'node-fetch';

// Load environment variables
config({ path: '.env.local' });

// Configuration - edit these values directly as needed
const API_KEY = process.env.NEXT_PUBLIC_AWS_API_KEY || 'YOUR_API_KEY';
const API_ENDPOINT = process.env.NEXT_PUBLIC_AWS_API_ENDPOINT || 'sfd8q2ch3k.execute-api.us-east-2.amazonaws.com';

// Commonly used LiveKit-related endpoints to test
const ENDPOINTS_TO_TRY = [
  '/prod/agent/dispatch',  // For agent dispatch
  '/prod/agent/token',     // For token generation
  '/prod/agent/force-join', // For forcing agent to join
  '/prod/health',          // Health check
  '/agent/dispatch',       // Without 'prod' prefix
  '/agent/token',
  '/agent/force-join',
  '/health',
  '/v1/agent/dispatch',    // With v1 prefix
  '/v1/agent/token',
  '/v1/agent/force-join',
  '/v1/health',
  '/api/agent/dispatch',   // With api prefix
  '/api/agent/token',
  '/api/agent/force-join',
  '/api/health'
];

console.log('======= Simple AWS API Gateway Test =======');
console.log(`API Endpoint: ${API_ENDPOINT}`);
console.log(`API Key: ${API_KEY.substring(0, 5)}...${API_KEY.substring(API_KEY.length - 4)}`);
console.log('===========================================');

// Run the test with API key against multiple endpoints
async function runTests() {
  let foundValidEndpoint = false;
  
  for (const path of ENDPOINTS_TO_TRY) {
    const url = `https://${API_ENDPOINT}${path}`;
    console.log(`\nTesting endpoint: ${url}`);
    
    try {
      // For dispatch and force-join endpoints, use POST with minimal body
      const isPostEndpoint = path.includes('dispatch') || path.includes('force-join');
      const method = isPostEndpoint ? 'POST' : 'GET';
      const body = isPostEndpoint ? JSON.stringify({ 
        roomName: `test-room-${Date.now()}`,
        userId: `test-user-${Date.now()}`
      }) : undefined;
      
      console.log(`Sending ${method} request with API key...`);
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY
        },
        body
      });
      
      console.log(`Response status: ${response.status} ${response.statusText}`);
      
      if (response.status === 200) {
        console.log('✅ SUCCESS: API key authentication worked for this endpoint!');
        foundValidEndpoint = true;
        try {
          const data = await response.json();
          console.log('Response data:', JSON.stringify(data, null, 2).substring(0, 200) + '...');
        } catch (e) {
          try {
            const text = await response.text();
            console.log('Response (text):', text.substring(0, 200) + (text.length > 200 ? '...' : ''));
          } catch {
            console.log('Could not read response body');
          }
        }
      } else if (response.status === 403) {
        console.log('❌ AUTH ERROR: Got 403 Forbidden - API key was rejected');
        try {
          const error = await response.text();
          console.log('Error details:', error);
        } catch (e) {
          console.log('Could not read error details');
        }
      } else if (response.status === 404) {
        console.log('❓ NOT FOUND: This endpoint does not exist (404)');
      } else {
        console.log(`❓ UNEXPECTED: Got status code ${response.status}`);
        try {
          const error = await response.text();
          console.log('Response details:', error);
        } catch (e) {
          console.log('Could not read response details');
        }
      }
    } catch (error) {
      console.error(`❌ REQUEST FAILED:`, error.message);
    }
  }
  
  console.log('\n===========================================');
  if (foundValidEndpoint) {
    console.log('✅ SUCCESS: Found at least one working endpoint!');
    console.log('You can update your code to use the successful endpoint(s).');
  } else {
    console.log('❌ NO WORKING ENDPOINTS: None of the tested endpoints worked.');
    console.log('Suggestions:');
    console.log('1. Check if the API Gateway ID is correct: ' + API_ENDPOINT);
    console.log('2. Verify your API key is valid and associated with the API Gateway');
    console.log('3. Check AWS Console to find the correct endpoints for your API Gateway');
    console.log('4. Try manually identifying the endpoints by running the application and');
    console.log('   looking at the network requests in the browser developer tools');
  }
  console.log('===========================================');
}

runTests(); 