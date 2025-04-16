"use server";

import {
  createBackendClient,
  type ConnectTokenCreateOpts,
  type ConnectTokenResponse,
  type ProjectEnvironment,
  type AccountsRequestResponse,
  type AppResponse
} from "@pipedream/sdk/server";

// Environment variables needed for Pipedream Connect
const {
  PIPEDREAM_API_HOST,
  PIPEDREAM_PROJECT_ID,
  PIPEDREAM_CLIENT_ID,
  PIPEDREAM_CLIENT_SECRET,
  PIPEDREAM_PROJECT_ENVIRONMENT,
  NEXT_PUBLIC_PIPEDREAM_API_KEY,
  NEXT_PUBLIC_PIPEDREAM_API_SECRET,
  NEXT_PUBLIC_PIPEDREAM_CLIENT_ID,
  NEXT_PUBLIC_PIPEDREAM_TOKEN
} = process.env;

// Validate required environment variables
if (!PIPEDREAM_CLIENT_ID && !NEXT_PUBLIC_PIPEDREAM_CLIENT_ID)
  throw new Error("PIPEDREAM_CLIENT_ID or NEXT_PUBLIC_PIPEDREAM_CLIENT_ID must be set in environment");
if (!PIPEDREAM_CLIENT_SECRET && !NEXT_PUBLIC_PIPEDREAM_API_SECRET)
  throw new Error("PIPEDREAM_CLIENT_SECRET or NEXT_PUBLIC_PIPEDREAM_API_SECRET must be set in environment");
if (!PIPEDREAM_PROJECT_ID)
  throw new Error("PIPEDREAM_PROJECT_ID not set in environment");
if (!PIPEDREAM_PROJECT_ENVIRONMENT || !["development", "production"].includes(PIPEDREAM_PROJECT_ENVIRONMENT))
  console.warn("PIPEDREAM_PROJECT_ENVIRONMENT not properly set, using development as default");

// Create Pipedream backend client
const pd = createBackendClient({
  projectId: PIPEDREAM_PROJECT_ID || '',
  environment: (PIPEDREAM_PROJECT_ENVIRONMENT || 'development') as ProjectEnvironment,
  credentials: {
    clientId: PIPEDREAM_CLIENT_ID || NEXT_PUBLIC_PIPEDREAM_CLIENT_ID || '',
    clientSecret: PIPEDREAM_CLIENT_SECRET || NEXT_PUBLIC_PIPEDREAM_API_SECRET || '',
  },
  apiHost: PIPEDREAM_API_HOST,
});

/**
 * Create a short-lived token for Pipedream Connect
 * @param opts Options including external_user_id
 * @returns ConnectTokenResponse with token, expires_at, and connect_link_url
 */
export async function serverConnectTokenCreate(opts: ConnectTokenCreateOpts): Promise<ConnectTokenResponse> {
  try {
    return await pd.createConnectToken(opts);
  } catch (error) {
    console.error("Error creating connect token:", error);
    throw error;
  }
}

/**
 * Get information about a specific app by name slug
 * @param nameSlug The app's name slug (e.g., 'slack', 'google_sheets')
 * @returns App information including auth type, display name, etc.
 */
export async function getAppInfo(nameSlug: string): Promise<AppResponse> {
  if (!nameSlug) {
    throw new Error("App name slug is required");
  }

  try {
    // Use the SDK's app() method to get app details
    const response = await pd.app(nameSlug);
    return response.data;
  } catch (error) {
    console.error(`Error fetching app info for ${nameSlug}:`, error);
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
  includeCredentials: boolean = false,
): Promise<AccountsRequestResponse> {
  if (!externalId) {
    throw new Error("External user ID is required");
  }

  try {
    return await pd.getAccounts({
      external_user_id: externalId,
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
  includeCredentials: boolean = false,
) {
  if (!accountId) {
    throw new Error("Account ID is required");
  }

  try {
    return await pd.getAccountById(accountId, {
      include_credentials: !!includeCredentials,
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
    return await pd.deleteAccount(accountId);
  } catch (error) {
    console.error(`Error deleting account ${accountId}:`, error);
    throw error;
  }
} 