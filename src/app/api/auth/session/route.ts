import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    return NextResponse.json(session);
  } catch (error) {
    return NextResponse.json({ error: "Failed to get session" }, { status: 500 });
  }
} 