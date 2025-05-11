import { createBackendClient } from '@pipedream/sdk/server';
import { NextResponse } from 'next/server';
import '../../../../lib/pipedream/fix-env';

// Test with pre-defined credentials that we know work
// This is for debugging only - remove in production
const TEST_CONFIG = { projectId: "proj_LosDxgO", // From your error message
  clientId: "kWYR9dn6Vmk7MnLuVfoXx4jsedOcp83vBg6st3rWuiM", // From your environment
  clientSecret: process.env.PIPEDREAM_CLIENT_SECRET || "",
    };

export async function GET() {
  const results = {
    environment: {
  clientId: process.env.PIPEDREAM_CLIENT_ID ? 'Set' : 'Not Set',
      clientSecret: process.env.PIPEDREAM_CLIENT_SECRET ? 'Set' : 'Not Set',
      projectId: process.env.PIPEDREAM_PROJECT_ID ? 'Set' : 'Not Set',
      clientIdValue: process.env.PIPEDREAM_CLIENT_ID ? process.env.PIPEDREAM_CLIENT_ID.substring(0, 5) + '...' : null,
      projectIdValue: process.env.PIPEDREAM_PROJECT_ID || null,
      environment: process.env.PIPEDREAM_PROJECT_ENVIRONMENT || process.env.NODE_ENV || 'Not Set',
      hasNewline: process.env.PIPEDREAM_PROJECT_ENVIRONMENT?.includes('\n') || false,
        },
    status: 'pending',
    errors: [] as string[],
    testResults: {} as any
  };

  try {
    // Try with environment variables first
    console.log('Testing with environment variables...');
    const pd = createBackendClient({
      projectId: process.env.PIPEDREAM_PROJECT_ID!,
      environment: (process.env.PIPEDREAM_PROJECT_ENVIRONMENT?.replace(/[\n\r]/g, '') || process.env.NODE_ENV || 'development'),
      credentials: {
  clientId: process.env.PIPEDREAM_CLIENT_ID!,
        clientSecret: process.env.PIPEDREAM_CLIENT_SECRET!,
          }
    });
    
    results.status = 'client_created';
    
    // Try to create a test token
    try {
      const testUserId = `test-user-${Date.now()}`;
      console.log(`Creating token for user ID: ${testUserId}`);
      
      const tokenResponse = await pd.createConnectToken({ external_user_id: testUserId,
        user_facing_label: 'Test User'
          });
      
      results.status = 'success';
      return NextResponse.json({
        ...results,
        token: {
  exists: !!tokenResponse.token,
          expires: tokenResponse.expires_at,
          linkUrl: !!tokenResponse.connect_link_url
            }
      });
    } catch (tokenError: any) {
      // First attempt failed, try with hardcoded test config
      console.log('First attempt failed, trying with test config...');
      results.status = 'token_error_env';
      results.errors.push(tokenError.message);
      
      try {
        // Create a client with test config
        const testPd = createBackendClient({
          projectId: TEST_CONFIG.projectId,
          environment: 'development', // Force development environment
          credentials: {
  clientId: TEST_CONFIG.clientId,
            clientSecret: TEST_CONFIG.clientSecret,
              }
        });
        
        const testUserId2 = `test-user-fallback-${Date.now()}`;
        console.log(`Trying fallback with user ID: ${testUserId2}`);
        
        // Try with test config
        const testTokenResponse = await testPd.createConnectToken({ external_user_id: testUserId2,
          user_facing_label: 'Test User Fallback'
            });
        
        results.testResults = { success: true,
          hasToken: !!testTokenResponse.token,
          configWorked: true
            };
        
        // Still return the original error but note that test config worked
        return NextResponse.json({
          ...results,
          tokenError: {
  message: tokenError.message,
            status: tokenError.response?.status,
            data: tokenError.response?.data
              },
          recommendation: "The hardcoded test config worked. This suggests an issue with your Pipedream project configuration rather than your credentials."
        }, { status: 500     });
        
      } catch (testError: any) {
        results.testResults = { success: false,
          error: testError.message
            };
        
        // Both configs failed
        return NextResponse.json({
          ...results,
          tokenError: {
  message: tokenError.message,
            status: tokenError.response?.status,
            data: tokenError.response?.data
              },
          testError: {
  message: testError.message
              },
          recommendation: "Both configurations failed. This suggests an issue with Pipedream's service or your OAuth app setup."
        }, { status: 500     });
      }
    }
  } catch (error: any) {
    results.status = 'client_error';
    results.errors.push(error.message);
    
    return NextResponse.json({
      ...results,
      clientError: {
  message: error.message
          }
    }, { status: 500     });
  }
} 