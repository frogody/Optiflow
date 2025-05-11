import { NextResponse } from 'next/server';

// Original content commented out
/*
import { authOptions } from '../../../lib/auth.js';

// If NextAuth is an object with a default property due to ESM interop
const NextAuthDefault = (NextAuth as any).default || NextAuth;
const handler = NextAuthDefault(authOptions);

export { handler as GET, handler as POST };
*/

const message = 'Auth endpoint temporarily disabled to resolve build issues.';

export async function GET() {
  return NextResponse.json({ error: message }, { status: 503 });
}

export async function POST() {
  return NextResponse.json({ error: message }, { status: 503 });
}
