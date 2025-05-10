/* eslint-disable @typescript-eslint/no-var-requires */
/**
 * Pipedream Integration Test Script
 * 
 * This script helps test the Pipedream integration for the deployed application.
 * Run it with Node.js to verify the connection to Pipedream services.
 * 
 * Usage: node test-pipedream-integration.js [deployment-url]
 */

const http = require('http');
const https = require('https');
const readline = require('readline');
const { URL } = require('url');

// Get deployment URL from command line or use default
const deploymentUrl = process.argv[2] || 'optiflow-q3hqc6tsb-isyncso.vercel.app';
const baseUrl = `https://${deploymentUrl.replace(/^https?:\/\//, '')}`;

console.log(`\n🔍 Testing Pipedream integration for: ${baseUrl}\n`);

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function testEndpoint(url, method = 'GET') {
  return new Promise((resolve) => {
    const parsedUrl = new URL(url);
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
      path: parsedUrl.pathname + parsedUrl.search,
      method: method
    };
    
    const client = parsedUrl.protocol === 'https:' ? https : http;
    
    const req = client.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });
    
    req.on('error', (error) => {
      resolve({
        status: 0,
        error: error.message
      });
    });
    
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Testing application accessibility...');
  const mainPageResult = await testEndpoint(baseUrl);
  
  if (mainPageResult.status === 200) {
    console.log('✅ Application is accessible');
  } else if (mainPageResult.status > 0) {
    console.log(`❌ Application returned status ${mainPageResult.status}`);
  } else {
    console.log(`❌ Could not connect to application: ${mainPageResult.error}`);
    process.exit(1);
  }
  
  console.log('\n🧪 Testing Pipedream callback endpoint...');
  const callbackUrl = `${baseUrl}/api/pipedream/callback`;
  const callbackResult = await testEndpoint(callbackUrl);
  
  if (callbackResult.status !== 404) {
    console.log('✅ Callback endpoint exists (returned status ' + callbackResult.status + ')');
  } else {
    console.log('❌ Callback endpoint returned 404 Not Found');
  }
  
  console.log('\n📋 Environment Variable Check:');
  console.log('The following environment variables should be configured in your Vercel project:');
  console.log('- NEXT_PUBLIC_PIPEDREAM_CLIENT_ID');
  console.log('- PIPEDREAM_CLIENT_SECRET');
  console.log('- PIPEDREAM_PROJECT_ID');
  console.log('- PIPEDREAM_PROJECT_ENVIRONMENT');
  console.log('- NEXT_PUBLIC_APP_URL');
  console.log('- NEXT_PUBLIC_PIPEDREAM_REDIRECT_URI');
  
  rl.question('\n🔑 Do you want to perform a manual OAuth test? (yes/no): ', async (answer) => {
    if (answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y') {
      console.log('\n🧪 Manual OAuth Test Instructions:');
      console.log('1. Open a browser and navigate to your application');
      console.log(`   ${baseUrl}`);
      console.log('2. Log in to your application');
      console.log('3. Navigate to a page that initiates the Pipedream OAuth flow');
      console.log('4. Try connecting a service');
      console.log('5. Verify you are redirected to Pipedream authorization page');
      console.log('6. After authorizing, verify you are redirected back to your application');
      
      rl.question('\nDid the OAuth flow work correctly? (yes/no): ', (flowAnswer) => {
        if (flowAnswer.toLowerCase() === 'yes' || flowAnswer.toLowerCase() === 'y') {
          console.log('\n✅ Pipedream integration is working correctly!');
        } else {
          console.log('\n❌ Pipedream integration has issues. Check the following:');
          console.log('- Environment variables in Vercel');
          console.log('- Redirect URI in Pipedream OAuth app settings');
          console.log('- API routes implementation');
          console.log('- Browser console for errors');
        }
        rl.close();
      });
    } else {
      console.log('\n🔍 Skipping manual OAuth test. Complete testing using the PIPEDREAM_DEPLOYMENT_CHECKLIST.md file.');
      rl.close();
    }
  });
}

runTests(); 