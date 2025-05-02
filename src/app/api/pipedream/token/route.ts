import { NextRequest, NextResponse } from "next/server";
import { createFrontendClient } from "@pipedream/sdk/browser";

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

    // Create a Pipedream client
    const pd = createFrontendClient();

    // Create a token for the user
    let tokenResponse;
    try {
      tokenResponse = await pd.connectAccount({
        app: "pipedream",
        userId,
        onSuccess: (response) => {
          console.log("Successfully created token:", response);
          return response;
        },
        onError: (error) => {
          console.error("Error creating token:", error);
          throw error;
        }
      });
    } catch (error) {
      console.error("Error creating token:", error);
      return NextResponse.json(
        { error: "Failed to create token" },
        { status: 500 }
      );
    }

    return NextResponse.json(tokenResponse);
  } catch (error) {
    console.error("Error in token creation:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 