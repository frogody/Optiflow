import { NextRequest, NextResponse } from 'next/server';

import { Mem0MemoryService, MemoryScope } from '@/services/Mem0MemoryService';

const mem0 = new Mem0MemoryService();

function extractParams(req: NextRequest): { scope: MemoryScope, id: string } {
  const segments = req.nextUrl.pathname.split('/');
  const id = segments[segments.length - 1];
  const scope = segments[segments.length - 2] as MemoryScope;
  return { scope, id };
}

export async function POST(req: NextRequest) {
  const { messages, metadata } = await req.json();
  const { scope, id } = extractParams(req);
  const result = await mem0.add(scope, id, messages, metadata);
  return NextResponse.json(result);
}

export async function GET(req: NextRequest) {
  const { scope, id } = extractParams(req);
  const search = req.nextUrl.searchParams.get('search');
  if (search) {
    const result = await mem0.search(scope, id, search);
    return NextResponse.json(result);
  } else {
    const result = await mem0.getAll(scope, id);
    return NextResponse.json(result);
  }
}

export async function PATCH(req: NextRequest) {
  const { memory_id, data } = await req.json();
  const result = await mem0.update(memory_id, data);
  return NextResponse.json(result);
}

export async function DELETE(req: NextRequest) {
  const { scope, id } = extractParams(req);
  const memory_id = req.nextUrl.searchParams.get('memory_id');
  if (memory_id) {
    const result = await mem0.delete(memory_id);
    return NextResponse.json(result);
  } else {
    const result = await mem0.deleteAll(scope, id);
    return NextResponse.json(result);
  }
} 