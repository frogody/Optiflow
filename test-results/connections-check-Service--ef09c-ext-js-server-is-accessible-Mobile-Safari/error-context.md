# Test info

- Name: Service Connectivity Tests >> Next.js server is accessible
- Location: /Users/godyduinsbergen/Optiflow/tests/connections-check.spec.ts:14:7

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 200
Received: 500
    at /Users/godyduinsbergen/Optiflow/tests/connections-check.spec.ts:17:31
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 |
   3 | /**
   4 |  * Test suite to verify connectivity and service availability
   5 |  *
   6 |  * This test checks that all the required services are running and accessible
   7 |  * including:
   8 |  * - Next.js app
   9 |  * - Mock OAuth server
   10 |  * - Local API endpoints
   11 |  */
   12 |
   13 | test.describe('Service Connectivity Tests', () => {
   14 |   test('Next.js server is accessible', async ({ request }) => {
   15 |     // Test connectivity to Next.js server
   16 |     const response = await request.get(process.env.TEST_BASE_URL || 'http://localhost:3003');
>  17 |     expect(response.status()).toBe(200);
      |                               ^ Error: expect(received).toBe(expected) // Object.is equality
   18 |     
   19 |     // Take a screenshot for debugging
   20 |     console.log(`Next.js server is accessible at ${process.env.TEST_BASE_URL || 'http://localhost:3003'}`);
   21 |   });
   22 |
   23 |   test('Mock OAuth server is accessible', async ({ request }) => {
   24 |     // Test connectivity to Mock OAuth server
   25 |     const mockServerUrl = process.env.MOCK_OAUTH_PROVIDER_URL || 'http://localhost:3001/mock-oauth';
   26 |     try {
   27 |       const response = await request.get(mockServerUrl);
   28 |       console.log(`Mock OAuth server status: ${response.status()}`);
   29 |       
   30 |       if (response.status() === 200) {
   31 |         console.log('Mock OAuth server is accessible');
   32 |       } else {
   33 |         console.log(`Mock OAuth server returned status ${response.status()}`);
   34 |       }
   35 |       
   36 |       // The server should be accessible - any response is better than no response
   37 |       expect(true).toBeTruthy();
   38 |     } catch (e) {
   39 |       console.error(`Mock OAuth server is not accessible at ${mockServerUrl}`);
   40 |       console.error(e);
   41 |       // Fail the test
   42 |       expect(true).toBeFalsy();
   43 |     }
   44 |   });
   45 |
   46 |   test('API endpoints are accessible', async ({ request }) => {
   47 |     // Test connectivity to critical API endpoints
   48 |     const baseUrl = process.env.TEST_BASE_URL || 'http://localhost:3003';
   49 |     
   50 |     // Test the API health endpoint if one exists
   51 |     try {
   52 |       const healthResponse = await request.get(`${baseUrl}/api/health`);
   53 |       console.log(`API health endpoint status: ${healthResponse.status()}`);
   54 |     } catch (e) {
   55 |       console.log('API health endpoint not available, this might be expected');
   56 |     }
   57 |     
   58 |     // Test the Pipedream callback endpoint
   59 |     try {
   60 |       // Just check if the endpoint exists - we're not actually calling it with parameters
   61 |       const callbackResponse = await request.get(`${baseUrl}/api/pipedream/callback`);
   62 |       console.log(`Pipedream callback endpoint status: ${callbackResponse.status()}`);
   63 |       
   64 |       // It's okay if this returns a 4xx error since we're not providing required params
   65 |       // We just want to make sure the route exists and is handled
   66 |       expect(callbackResponse.status()).not.toBe(404);
   67 |     } catch (e) {
   68 |       console.error('Pipedream callback endpoint is not accessible');
   69 |       expect(true).toBeFalsy();
   70 |     }
   71 |   });
   72 |
   73 |   test('Environment variables are properly set', async () => {
   74 |     // Check critical environment variables without exposing sensitive info
   75 |     const envVars = [
   76 |       'NEXT_PUBLIC_APP_URL',
   77 |       'NEXT_PUBLIC_PIPEDREAM_REDIRECT_URI',
   78 |       'TEST_BASE_URL',
   79 |       'MOCK_OAUTH_PROVIDER_URL',
   80 |       'USE_MOCK_OAUTH_SERVER'
   81 |     ];
   82 |     
   83 |     let missingVars = [];
   84 |     
   85 |     for (const envVar of envVars) {
   86 |       if (!process.env[envVar]) {
   87 |         missingVars.push(envVar);
   88 |       } else {
   89 |         console.log(`${envVar} is set to: ${process.env[envVar]}`);
   90 |       }
   91 |     }
   92 |     
   93 |     if (missingVars.length > 0) {
   94 |       console.error(`Missing critical environment variables: ${missingVars.join(', ')}`);
   95 |     }
   96 |     
   97 |     expect(missingVars.length).toBe(0);
   98 |     
   99 |     // Verify the URLs match the expected format
  100 |     const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  101 |     expect(appUrl).toContain('localhost');
  102 |     expect(appUrl).toMatch(/http:\/\/localhost:\d+/);
  103 |   });
  104 | }); 
```