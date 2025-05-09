import { NextRequest, NextResponse } from 'next/server';
import { getUserById } from '@/lib/auth';
import Cookies from 'js-cookie';

/**
 * Middleware to validate user access to resources
 * This ensures that users can only access their own data
 */
export async function validateUserAccess(req: NextRequest, res: NextResponse) {
  try {
    // 1. Get user token from cookie
    const token = req.cookies.get('user-token')?.value;

    if (!token) {
      console.error('Access denied: No authentication token');
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }

    // 2. Get user ID from request path or parameters
    // This assumes paths like /api/users/:userId/data or query params like ?userId=123
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    const requestedUserId = pathParts.includes('users')
      ? pathParts[pathParts.indexOf('users') + 1]
      : url.searchParams.get('userId');

    if (!requestedUserId) {
      // No user ID in request, could be a general endpoint
      // Continue to next middleware or route handler
      return NextResponse.next();
    }

    // 3. Verify token belongs to the user or an admin
    const user = await getUserById(token);

    if (!user) {
      console.error('Access denied: Invalid user token');
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }

    const isRequestingOwnData = user.id === requestedUserId;
    const isAdmin = user.role === 'admin'; // Assuming role field exists

    if (!isRequestingOwnData && !isAdmin) {
      console.error(
        `Access denied: User ${user.id} attempted to access data for user ${requestedUserId}`
      );

      // Log suspicious access attempt
      console.warn('SECURITY: Cross-user data access attempt', {
        authenticatedUserId: user.id,
        attemptedAccessUserId: requestedUserId,
        endpoint: url.pathname,
        timestamp: new Date().toISOString(),
      });

      return NextResponse.json(
        { error: 'Forbidden: You can only access your own data' },
        { status: 403 }
      );
    }

    // 4. Access granted, attach user info to the request for route handlers
    // Note: In Next.js API routes, you can access this in the req object
    const requestWithUser = req.clone();
    (requestWithUser as any).user = user;

    return NextResponse.next({
      request: requestWithUser,
    });
  } catch (error) {
    console.error('Error in access control middleware:', error);
    return NextResponse.json(
      { error: 'Internal server error during access validation' },
      { status: 500 }
    );
  }
}
