import { createBackendClient } from "@pipedream/sdk/server";

// These secrets should be saved securely and passed to your environment
const pd = createBackendClient({
  environment: "development", // change to production if running for a test production account, or in production
  credentials: {
    clientId: "kWYR9dn6Vmk7MnLuVfoXx4jsedOcp83vBg6st3rWuiM",
    clientSecret: "ayINomSnhCcHGR6Xf1_4PElM25mqsEFsrvTHKQ7ink0",
  }
});

// The `pd` client provides methods to interact with the Connect API

// Export the client for use in other files
export default pd; 