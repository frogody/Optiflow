import {
  createBackendClient,
  type BackendClient,
  type BackendClientOpts,
  type ConnectAPIResponse,
  type ConnectTokenCreateOpts,
  type ConnectTokenResponse,
} from "@pipedream/sdk/server";

// Client configuration
const clientOpts: BackendClientOpts = {
  environment: "development", // change to production if running for a test production account, or in production
  credentials: {
    clientId: process.env.NEXT_PUBLIC_PIPEDREAM_CLIENT_ID || "kWYR9dn6Vmk7MnLuVfoXx4jsedOcp83vBg6st3rWuiM",
    clientSecret: process.env.PIPEDREAM_CLIENT_SECRET || "ayINomSnhCcHGR6Xf1_4PElM25mqsEFsrvTHKQ7ink0",
  },
  projectId: "isyncso", // Hardcoded project ID value
};

// Create the backend client
const pd: BackendClient = createBackendClient(clientOpts);

/**
 * Creates a connect token for a user
 * @param externalUserId - The ID of the user in your system
 * @returns The token response with token, expiration, and connect link URL
 */
export async function createUserConnectToken(externalUserId: string): Promise<ConnectTokenResponse> {
  try {
    console.log("Creating token using OAuth flow with parameters:", {
      clientId: clientOpts.credentials.clientId,
      projectId: clientOpts.projectId,
      environment: clientOpts.environment,
      externalUserId
    });

    // First, get an OAuth token through proper OAuth flow
    const oauthResponse = await fetch("https://api.pipedream.com/v1/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        grant_type: "client_credentials",
        client_id: clientOpts.credentials.clientId,
        client_secret: clientOpts.credentials.clientSecret
      })
    });

    if (!oauthResponse.ok) {
      const error = await oauthResponse.json();
      console.error("OAuth token error:", error);
      throw new Error(`Failed to get OAuth token: ${error.error || oauthResponse.statusText}`);
    }

    const { access_token } = await oauthResponse.json();
    console.log("Successfully obtained OAuth access token");

    // Now use that token to create a connect token
    const connectResponse = await fetch(`https://api.pipedream.com/v1/connect/${clientOpts.projectId}/tokens`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${access_token}`,
        "X-PD-Environment": clientOpts.environment
      },
      body: JSON.stringify({
        external_user_id: externalUserId,
        allowed_origins: [
          process.env.NEXT_PUBLIC_APP_URL || "https://app.isyncso.com",
          "http://localhost:3000",
        ]
      })
    });

    if (!connectResponse.ok) {
      const error = await connectResponse.json();
      console.error("Connect token error:", error);
      throw new Error(`Failed to create connect token: ${error.error || connectResponse.statusText}`);
    }

    const tokenData = await connectResponse.json();
    console.log("Successfully created connect token:", tokenData);
    
    return tokenData;
  } catch (error) {
    console.error("Error in createUserConnectToken:", error);
    throw error;
  }
}

/**
 * Helper function to extract token data
 */
export function extractTokenData(response: ConnectTokenResponse): {
  token: string;
  expires_at: string;
  connect_link_url: string;
} {
  const {
    token,            // The token you'll pass to the frontend
    expires_at,       // The token's expiration date
    connect_link_url, // The URL to redirect the user to for the Connect Link flow
  } = response;

  return {
    token,
    expires_at,
    connect_link_url,
  };
}

export default pd; 