"use server";

// Import our environment fix module first
import './fix-env';

import {
  type AccountsRequestResponse,
  type AppResponse,
  type BackendClient,
  type ConnectTokenCreateOpts,
  type ConnectTokenResponse,
  createBackendClient,
  type ProjectEnvironment
} from "@pipedream/sdk/server";

// Environment variables needed for Pipedream Connect
const {
  PIPEDREAM_API_HOST,
  PIPEDREAM_PROJECT_ID,
  PIPEDREAM_CLIENT_ID,
  PIPEDREAM_CLIENT_SECRET,
  PIPEDREAM_ALLOWED_ORIGINS,
  NEXT_PUBLIC_PIPEDREAM_API_KEY,
  NEXT_PUBLIC_PIPEDREAM_API_SECRET,
  NEXT_PUBLIC_PIPEDREAM_CLIENT_ID,
  NEXT_PUBLIC_PIPEDREAM_TOKEN
} = process.env;

// Environment configuration with fallbacks
const PIPEDREAM_CONFIG = { clientId: process.env.PIPEDREAM_CLIENT_ID || process.env.NEXT_PUBLIC_PIPEDREAM_CLIENT_ID,
  clientSecret: process.env.PIPEDREAM_CLIENT_SECRET,
  projectId: process.env.PIPEDREAM_PROJECT_ID,
  environment: 'production' as ProjectEnvironment,  // Force production environment
  apiHost: process.env.PIPEDREAM_API_HOST,
  allowedOrigins: ['http://localhost:3000', 'https://app.isyncso.com']
    };

// Log the current environment configuration
console.log('Pipedream environment configuration:', {
  clientId: PIPEDREAM_CONFIG.clientId ? `${PIPEDREAM_CONFIG.clientId.substring(0, 5)}...` : undefined,
  hasClientSecret: !!PIPEDREAM_CONFIG.clientSecret,
  projectId: PIPEDREAM_CONFIG.projectId,
  environment: PIPEDREAM_CONFIG.environment,
  apiHost: PIPEDREAM_CONFIG.apiHost,
  allowedOrigins: PIPEDREAM_CONFIG.allowedOrigins
});

// Validate environment configuration
Object.entries(PIPEDREAM_CONFIG).forEach(([key, value]) => {
  if (!value && key !== 'apiHost') { // apiHost is optional
    console.error(`Missing required Pipedream configuration: ${key}`);
  }
});

// Create Pipedream backend client with validated configuration
let pd: BackendClient | undefined;
try {
  pd = createBackendClient({
    projectId: PIPEDREAM_CONFIG.projectId!,
    environment: PIPEDREAM_CONFIG.environment,
    credentials: {
      clientId: PIPEDREAM_CONFIG.clientId!,
      clientSecret: PIPEDREAM_CONFIG.clientSecret!,
    },
    ...(PIPEDREAM_CONFIG.apiHost ? { apiHost: PIPEDREAM_CONFIG.apiHost } : {})
  });
  console.log('Pipedream backend client created successfully');
} catch (error) { console.error('Failed to create Pipedream backend client:', error);
  throw new Error('Failed to initialize Pipedream client');
    }

// Helper to ensure pd is defined
function ensureClient(): BackendClient {
  if (!pd) {
    throw new Error('Pipedream client not initialized');
  }
  return pd;
}

/**
 * Create a short-lived token for Pipedream Connect with retry logic
 * @param external_user_id - The ID of the user in your system
 * @param user_facing_label - Optional label to identify the user in Pipedream
 * @returns ConnectTokenResponse with token, expires_at, and connect_link_url
 */
export async function serverConnectTokenCreate({
  external_user_id,
  user_facing_label
}: { external_user_id: string;
  user_facing_label?: string;
    }): Promise<ConnectTokenResponse> {
  console.log('Starting token creation with params:', { external_user_id,
    user_facing_label,
    environment: PIPEDREAM_CONFIG.environment,
    hasClientId: !!PIPEDREAM_CONFIG.clientId,
    hasClientSecret: !!PIPEDREAM_CONFIG.clientSecret,
    hasProjectId: !!PIPEDREAM_CONFIG.projectId
      });

  if (!pd) {
    throw new Error('Pipedream client not initialized due to missing configuration');
  }

  if (!PIPEDREAM_CONFIG.clientId || !PIPEDREAM_CONFIG.clientSecret || !PIPEDREAM_CONFIG.projectId) {
    throw new Error('Missing required Pipedream credentials. Check your environment variables.');
  }

  // Create a sanitized user ID to prevent format issues
  // This replaces any special characters with a dash
  const sanitizedUserId = external_user_id.replace(/[^a-zA-Z0-9]/g, '-');
  
  // Include a timestamp to make the user ID more unique
  const uniqueUserId = `${sanitizedUserId}-${Date.now()}`;
  
  // Maximum retry attempts
  const MAX_RETRIES = 3;
  let retryCount = 0;
  let lastError: any = null;

  while (retryCount < MAX_RETRIES) {
    try {
      console.log(`Attempt ${retryCount + 1}/${MAX_RETRIES} to create token for user ${uniqueUserId}`, {
        config: {
          clientId: PIPEDREAM_CONFIG.clientId?.substring(0, 5) + '...',
          hasSecret: !!PIPEDREAM_CONFIG.clientSecret,
          projectId: PIPEDREAM_CONFIG.projectId,
          environment: PIPEDREAM_CONFIG.environment,
          allowedOrigins: PIPEDREAM_CONFIG.allowedOrigins
        }
      });
      
      const response = await pd.createConnectToken({ external_user_id: uniqueUserId,
        allowed_origins: PIPEDREAM_CONFIG.allowedOrigins
          });

      console.log('Token creation response:', { hasToken: !!response.token,
        expiresAt: response.expires_at,
        hasConnectUrl: !!response.connect_link_url,
        tokenLength: response.token?.length,
        urlLength: response.connect_link_url?.length
          });

      return response;
    } catch (error: any) {
      lastError = error;
      console.error(`Error in serverConnectTokenCreate (attempt ${retryCount + 1}/${MAX_RETRIES}):`, { message: error.message,
        stack: error.stack,
        response: error.response?.data,
        statusCode: error.response?.status,
        requestId: error.response?.headers?.['x-request-id'],
        errorType: error.name,
        fullError: JSON.stringify(error, null, 2)
          });
      
      // Specific error handling for rate limits or temporary issues
      if (error.response?.status === 429 || 
          error.message?.includes('rate limit') || 
          error.message?.includes('ran out of attempts')) {
        console.log(`Rate limit or temporary issue detected. Retrying in ${(retryCount + 1) * 1000}ms...`);
        await new Promise(resolve => setTimeout(resolve, (retryCount + 1) * 1000));
        retryCount++;
      } else {
        // For other errors, don't retry
        break;
      }
    }
  }
  
  // If we've exhausted all retries or hit a non-retryable error
  if (lastError) {
    // Check for specific error conditions
    if (lastError.response?.status === 401) {
      throw new Error('Authentication failed with Pipedream API. Check your API credentials.');
    } else if (lastError.response?.status === 403) {
      throw new Error('Permission denied by Pipedream API. Verify your project permissions.');
    } else if (lastError.response?.status === 500) {
      throw new Error('Pipedream service error. Please try again later.');
    } else if (lastError.message?.includes('ran out of attempts')) {
      throw new Error('Failed to retrieve OAuth access token after multiple attempts. Please check your Pipedream configuration.');
    }
    
    throw lastError;
  }
  
  throw new Error('Failed to create token after multiple attempts');
}

/**
 * Get information about a Pipedream Connect app
 * @param appId - The ID of the app to get information for
 */
export async function getAppInfo(appId: string): Promise<AppResponse> {
  try {
    const client = ensureClient();
    return await client.getApp(appId) as unknown as AppResponse;
  } catch (error) { console.error("Error fetching app information:", error);
    throw error;
      }
}

/**
 * Get connections for a specific user
 * @param external_user_id - The ID of the user in your system
 */
export async function getUserConnections(external_user_id: string): Promise<AccountsRequestResponse> {
  try {
    const client = ensureClient();
    return await client.getAccounts({ external_user_id });
  } catch (error) { console.error("Error fetching user connections:", error);
    throw error;
      }
}

/**
 * Get a user's connected accounts
 * @param externalId The external user ID
 * @param includeCredentials Whether to include credentials in the response
 * @returns List of connected accounts for the user
 */
export async function getUserAccounts(
  externalId: string,
  includeCredentials = false,
): Promise<AccountsRequestResponse> {
  if (!externalId) {
    throw new Error("External user ID is required");
  }

  try {
    const client = ensureClient();
    return await client.getAccounts({ external_user_id: externalId,
      include_credentials: !!includeCredentials,
        });
  } catch (error) {
    console.error(`Error fetching accounts for user ${externalId}:`, error);
    throw error;
  }
}

/**
 * Get a specific account by ID
 * @param accountId The Pipedream account ID
 * @param includeCredentials Whether to include credentials in the response
 * @returns Account details
 */
export async function getAccountById(
  accountId: string,
  includeCredentials = false,
) {
  if (!accountId) {
    throw new Error("Account ID is required");
  }

  try {
    const client = ensureClient();
    return await client.getAccountById(accountId, { include_credentials: !!includeCredentials,
        });
  } catch (error) {
    console.error(`Error fetching account ${accountId}:`, error);
    throw error;
  }
}

/**
 * Delete a connected account
 * @param accountId The Pipedream account ID to delete
 * @returns Success status
 */
export async function deleteAccount(accountId: string) {
  if (!accountId) {
    throw new Error("Account ID is required");
  }

  try {
    const client = ensureClient();
    return await client.deleteAccount(accountId);
  } catch (error) {
    console.error(`Error deleting account ${accountId}:`, error);
    throw error;
  }
}

/**
 * Execute a Pipedream workflow with the provided payload
 * 
 * @param options Object containing workflowKey and payload
 * @returns The workflow execution result
 */
export async function executeWorkflow({ 
  workflowKey, 
  payload 
}: { 
  workflowKey: string; 
  payload: Record<string, any>;
}): Promise<any> {
  if (!workflowKey) {
    throw new Error("Workflow key is required");
  }

  try {
    const client = ensureClient();
    
    // Attempt to find the workflow ID by key
    const workflowId = process.env[`PIPEDREAM_WORKFLOW_${workflowKey.toUpperCase()}`];
    
    if (!workflowId) {
      console.warn(`No workflow ID found for key: ${workflowKey}`);
      
      // For development, return a mock response
      if (process.env.NODE_ENV === 'development') {
        console.log(`[DEV] Mock execution of workflow ${workflowKey} with payload:`, payload);
        return { success: true, mockId: `mock-${Date.now()}` };
      }
      
      throw new Error(`Workflow not configured: ${workflowKey}`);
    }
    
    console.log(`Executing workflow ${workflowKey} (${workflowId}) with payload:`, 
      JSON.stringify(payload, null, 2).substring(0, 500) + (JSON.stringify(payload).length > 500 ? '...' : ''));
    
    // Execute the workflow
    const result = await client.executeWorkflow(workflowId, payload);
    
    console.log(`Workflow ${workflowKey} execution result:`, result);
    return result;
  } catch (error) {
    console.error(`Error executing workflow ${workflowKey}:`, error);
    throw error;
  }
} 