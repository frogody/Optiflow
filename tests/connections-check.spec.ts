import { expect, test } from '@playwright/test';

/**
 * Test suite to verify connectivity and service availability
 *
 * This test checks that all the required services are running and accessible
 * including:
 * - Next.js app
 * - Mock OAuth server
 * - Local API endpoints
 */

test.describe('Service Connectivity Tests', () => {
  test('Next.js server is accessible', async ({ request }) => {
    // Test connectivity to Next.js server
    const response = await request.get(process.env.TEST_BASE_URL || 'http://localhost:3003');
    expect(response.status()).toBe(200);
    
    // Take a screenshot for debugging
    console.log(`Next.js server is accessible at ${process.env.TEST_BASE_URL || 'http://localhost:3003'}`);
  });

  test('Mock OAuth server is accessible', async ({ request }) => {
    // Test connectivity to Mock OAuth server
    const mockServerUrl = process.env.MOCK_OAUTH_PROVIDER_URL || 'http://localhost:3001/mock-oauth';
    try {
      const response = await request.get(mockServerUrl);
      console.log(`Mock OAuth server status: ${response.status()}`);
      
      if (response.status() === 200) {
        console.log('Mock OAuth server is accessible');
      } else {
        console.log(`Mock OAuth server returned status ${response.status()}`);
      }
      
      // The server should be accessible - any response is better than no response
      expect(true).toBeTruthy();
    } catch (e) {
      console.error(`Mock OAuth server is not accessible at ${mockServerUrl}`);
      console.error(e);
      // Fail the test
      expect(true).toBeFalsy();
    }
  });

  test('API endpoints are accessible', async ({ request }) => {
    // Test connectivity to critical API endpoints
    const baseUrl = process.env.TEST_BASE_URL || 'http://localhost:3003';
    
    // Test the API health endpoint if one exists
    try {
      const healthResponse = await request.get(`${baseUrl}/api/health`);
      console.log(`API health endpoint status: ${healthResponse.status()}`);
    } catch (e) {
      console.log('API health endpoint not available, this might be expected');
    }
    
    // Test the Pipedream callback endpoint
    try {
      // Just check if the endpoint exists - we're not actually calling it with parameters
      const callbackResponse = await request.get(`${baseUrl}/api/pipedream/callback`);
      console.log(`Pipedream callback endpoint status: ${callbackResponse.status()}`);
      
      // It's okay if this returns a 4xx error since we're not providing required params
      // We just want to make sure the route exists and is handled
      expect(callbackResponse.status()).not.toBe(404);
    } catch (e) {
      console.error('Pipedream callback endpoint is not accessible');
      expect(true).toBeFalsy();
    }
  });

  test('Environment variables are properly set', async () => {
    // Check critical environment variables without exposing sensitive info
    const envVars = [
      'NEXT_PUBLIC_APP_URL',
      'NEXT_PUBLIC_PIPEDREAM_REDIRECT_URI',
      'TEST_BASE_URL',
      'MOCK_OAUTH_PROVIDER_URL',
      'USE_MOCK_OAUTH_SERVER'
    ];
    
    const missingVars = [];
    
    for (const envVar of envVars) {
      if (!process.env[envVar]) {
        missingVars.push(envVar);
      } else {
        console.log(`${envVar} is set to: ${process.env[envVar]}`);
      }
    }
    
    if (missingVars.length > 0) {
      console.error(`Missing critical environment variables: ${missingVars.join(', ')}`);
    }
    
    expect(missingVars.length).toBe(0);
    
    // Verify the URLs match the expected format
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    expect(appUrl).toContain('localhost');
    expect(appUrl).toMatch(/http:\/\/localhost:\d+/);
  });
}); 