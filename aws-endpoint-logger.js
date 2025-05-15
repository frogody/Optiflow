/**
 * AWS API Gateway Endpoint Logger
 * 
 * This script will help debug which AWS API Gateway endpoints are being used
 * by the Optiflow voice agent application.
 * 
 * Usage:
 * 1. Add this script to your application as a module
 * 2. Run the application and interact with the voice agent
 * 3. Check the console for logged endpoints
 */

export function installEndpointLogger() {
  if (typeof window !== 'undefined') {
    console.log('🔍 Installing AWS API Gateway endpoint logger...');
    
    const originalFetch = window.fetch;
    const API_ENDPOINT = process.env.NEXT_PUBLIC_AWS_API_ENDPOINT || 'sfd8q2ch3k.execute-api.us-east-2.amazonaws.com';
    
    window.fetch = async function(input, init) {
      const url = input.toString();
      
      // Check if this is a call to the AWS API Gateway
      if (url.includes(API_ENDPOINT)) {
        console.log('🔎 AWS API Gateway call detected:');
        console.log('  URL:', url);
        
        // Extract the path from the URL
        try {
          const urlObj = new URL(url);
          console.log('  Path:', urlObj.pathname);
          console.log('  Method:', init?.method || 'GET');
          console.log('  Headers:', init?.headers || {});
          
          // Store this endpoint for future reference
          const endpoints = JSON.parse(localStorage.getItem('aws_gateway_endpoints') || '[]');
          if (!endpoints.includes(urlObj.pathname)) {
            endpoints.push(urlObj.pathname);
            localStorage.setItem('aws_gateway_endpoints', JSON.stringify(endpoints));
            console.log('  Added to saved endpoints list');
          }
        } catch (e) {
          console.error('  Error parsing URL:', e);
        }
      }
      
      // Proceed with the original fetch
      return originalFetch.apply(this, [input, init]);
    };
    
    console.log('✅ AWS API Gateway endpoint logger installed');
    console.log('Saved endpoints will be stored in localStorage.aws_gateway_endpoints');
    
    // Add a global function to print all saved endpoints
    window.printAwsEndpoints = function() {
      const endpoints = JSON.parse(localStorage.getItem('aws_gateway_endpoints') || '[]');
      console.log('📋 AWS API Gateway endpoints encountered:');
      if (endpoints.length === 0) {
        console.log('  No endpoints recorded yet');
      } else {
        endpoints.forEach((path, index) => {
          console.log(`  ${index + 1}. ${path}`);
        });
      }
      return endpoints;
    };
    
    console.log('To view all saved endpoints, run: window.printAwsEndpoints()');
  }
}

// If this script is loaded directly, automatically install the logger
if (typeof window !== 'undefined') {
  installEndpointLogger();
} 