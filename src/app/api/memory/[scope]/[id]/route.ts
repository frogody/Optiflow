import { NextRequest, NextResponse } from 'next/server';

import { Mem0MemoryService, MemoryScope } from '@/services/Mem0MemoryService';

const mem0 = new Mem0MemoryService();

export async function POST(req: NextRequest, { params }: { params: { scope: MemoryScope, id: string } }) {
  const { messages, metadata } = await req.json();
  const { scope, id } = params;
  const result = await mem0.add(scope, id, messages, metadata);
  return NextResponse.json(result);
}

export async function GET(req: NextRequest, { params }: { params: { scope: MemoryScope, id: string } }) {
  const { scope, id } = params;
  const { search } = Object.fromEntries(new URL(req.url).searchParams.entries());
  if (search) {
    const result = await mem0.search(scope, id, search);
    return NextResponse.json(result);
  } else {
    const result = await mem0.getAll(scope, id);
    return NextResponse.json(result);
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { scope: MemoryScope, id: string } }) {
  const { memory_id, data } = await req.json();
  const result = await mem0.update(memory_id, data);
  return NextResponse.json(result);
}

export async function DELETE(req: NextRequest, { params }: { params: { scope: MemoryScope, id: string } }) {
  const { memory_id } = Object.fromEntries(new URL(req.url).searchParams.entries());
  const { scope, id } = params;
  if (memory_id) {
    const result = await mem0.delete(memory_id);
    return NextResponse.json(result);
  } else {
    const result = await mem0.deleteAll(scope, id);
    return NextResponse.json(result);
  }
} 