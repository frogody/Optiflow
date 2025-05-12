import { createFrontendClient } from "@pipedream/sdk/browser";
import { useState } from "react";

export default function Home() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectStatus, setConnectStatus] = useState(null);
  const pd = createFrontendClient();
  
  async function connectAccount() {
    try {
      setIsConnecting(true);
      setConnectStatus("Fetching token...");
      
      // Get the token from your server API
      const externalUserId = "user-" + Date.now(); // Use unique ID for testing
      console.log("Using external user ID:", externalUserId);
      
      const response = await fetch("/api/pipedream/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: externalUserId }),
      });
      
      // Check if response is successful and log full error details
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Token creation error details:", errorData);
        throw new Error(`Server error: ${response.status} - ${errorData.message || errorData.error}`);
      }
      
      const data = await response.json();
      console.log("Token received:", data);
      setConnectStatus("Token received, connecting Slack account...");
      
      // Connect the Slack account
      pd.connectAccount({
        app: "slack", // Explicit app slug for Slack
        token: data.token,
        onSuccess: ({ id: accountId }) => {
          console.log(`Slack account successfully connected: ${accountId}`);
          setConnectStatus(`Slack account successfully connected! ID: ${accountId}`);
          setIsConnecting(false);
        },
        onError: (error) => {
          console.error("Slack connection error:", error);
          setConnectStatus(`Slack connection error: ${error.message}`);
          setIsConnecting(false);
        }
      });
    } catch (error) {
      console.error("Error connecting account:", error);
      setConnectStatus(`Error: ${error.message}`);
      setIsConnecting(false);
    }
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Pipedream Integration</h1>
      
      <button 
        onClick={connectAccount}
        disabled={isConnecting}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {isConnecting ? "Connecting..." : "Connect your account"}
      </button>
      
      {connectStatus && (
        <div className="mt-4 p-4 border rounded">
          <p className="text-sm">{connectStatus}</p>
        </div>
      )}
    </main>
  );
} 