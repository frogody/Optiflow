import { Pipedream } from '@pipedream/connect';

// Initialize Pipedream Connect client
const pipedreamClient = new Pipedream({
  clientId: process.env.NEXT_PUBLIC_PIPEDREAM_CLIENT_ID,
  clientSecret: process.env.PIPEDREAM_CLIENT_SECRET,
  projectId: process.env.NEXT_PUBLIC_PIPEDREAM_PROJECT_ID,
  environment: process.env.NEXT_PUBLIC_PIPEDREAM_ENVIRONMENT || 'development',
});

/**
 * Create a connection token for the Pipedream Connect flow
 * @param accountId - The ID of the account to associate with this connection
 * @param metadata - Additional metadata to include with the connection
 * @param returnUrl - URL to return to after the OAuth flow completes
 */
export async function createConnectionToken(
  accountId: string,
  metadata?: Record<string, any>,
  returnUrl?: string
) {
  try {
    const token = await pipedreamClient.createConnectionToken({
      accountId,
      metadata: {
        ...metadata,
        returnUrl: returnUrl || '/dashboard',
      },
    });
    
    return { success: true, token };
  } catch (error) {
    console.error('Error creating connection token:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Get information about a Pipedream Connect app
 * @param appId - The ID of the app to get information for
 */
export async function getAppInfo(appId: string) {
  try {
    const app = await pipedreamClient.getApp(appId);
    return { success: true, app };
  } catch (error) {
    console.error('Error fetching app information:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Get connections for a specific account
 * @param accountId - The ID of the account to get connections for
 */
export async function getAccountConnections(accountId: string) {
  try {
    const connections = await pipedreamClient.getConnections({
      accountId,
    });
    return { success: true, connections };
  } catch (error) {
    console.error('Error fetching connections:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Delete a connection
 * @param connectionId - The ID of the connection to delete
 */
export async function deleteConnection(connectionId: string) {
  try {
    await pipedreamClient.deleteConnection(connectionId);
    return { success: true };
  } catch (error) {
    console.error('Error deleting connection:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

export { pipedreamClient }; 