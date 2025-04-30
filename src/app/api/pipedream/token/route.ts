import { NextRequest, NextResponse } from "next/server";
import { createUserConnectToken, extractTokenData } from "../../../../../pipedream-client";

/**
 * API endpoint to create Pipedream connect tokens
 * POST /api/pipedream/token
 */
export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "Missing required parameter: userId" },
        { status: 400 }
      );
    }

    console.log(`Creating token for user: ${userId}`);

    // Create a token for the user using the direct OAuth flow approach
    let tokenResponse;
    try {
      tokenResponse = await createUserConnectToken(userId);
    } catch (tokenError: any) {
      console.error("Token creation error details:", tokenError);
      
      // Provide a more helpful error message
      let errorMessage = tokenError.message;
      if (tokenError.message.includes("Failed to get OAuth token")) {
        errorMessage = "OAuth authentication failed. Please check client ID and secret.";
      } else if (tokenError.message.includes("Failed to create connect token")) {
        errorMessage = "Failed to create Pipedream connect token. Please check project ID and user ID.";
      }
      
      return NextResponse.json(
        { 
          error: "Failed to create token",
          message: errorMessage,
          details: typeof tokenError === 'object' ? 
                   (tokenError.toString ? tokenError.toString() : JSON.stringify(tokenError)) : 
                   String(tokenError)
        },
        { status: 500 }
      );
    }
    
    console.log(`Token created successfully: ${JSON.stringify(tokenResponse)}`);

    // Return the token data directly
    return NextResponse.json(tokenResponse);
  } catch (error: any) {
    console.error("Error in token route handler:", error);
    
    return NextResponse.json(
      { 
        error: "Failed to process token request", 
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
} 