import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Parse the workflow data from the request
    const { workflow } = await request.json();
    
    console.log('Received workflow from ElevenLabs callback:', workflow);
    
    // Store the workflow data in a way that the client can access it
    // Here we'll return HTML that will use postMessage to send the data to the parent window
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>ElevenLabs Callback</title>
        <script>
          window.onload = function() {
            // Send the workflow data to the parent window
            if (window.opener) {
              window.opener.postMessage({
                type: 'workflow_generated',
                workflow: ${JSON.stringify(workflow)}
              }, '${new URL(request.headers.get('referer') || request.headers.get('origin') || '*').origin}');
              
              // Close this window after a short delay
              setTimeout(function() {
                window.close();
              }, 1000);
            }
          };
        </script>
      </head>
      <body>
        <div style="display: flex; justify-content: center; align-items: center; height: 100vh; font-family: system-ui, sans-serif;">
          <div style="text-align: center;">
            <h2>Workflow Received</h2>
            <p>The workflow has been sent to Optiflow. This window will close automatically.</p>
          </div>
        </div>
      </body>
      </html>
    `;
    
    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error) {
    console.error('Error processing ElevenLabs callback:', error);
    return NextResponse.json(
      { error: 'Failed to process workflow data' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // Handle GET requests (e.g., when testing the callback URL)
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>ElevenLabs Callback Endpoint</title>
    </head>
    <body>
      <div style="display: flex; justify-content: center; align-items: center; height: 100vh; font-family: system-ui, sans-serif;">
        <div style="text-align: center;">
          <h2>ElevenLabs Callback Endpoint</h2>
          <p>This endpoint is used to receive workflow data from ElevenLabs.</p>
          <p>To use this endpoint, send a POST request with a JSON body containing a workflow property.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
} 