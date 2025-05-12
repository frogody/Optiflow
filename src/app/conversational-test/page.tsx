'use client';


// Force dynamic rendering to avoid static generation issues
export const dynamic = 'force-dynamic';

import React from 'react';

import ConversationalWorkflowGenerator from '@/components/ConversationalWorkflowGenerator';

export default function ConversationalTestPage(): JSX.Element {
  return (
    <div className="min-h-screen">
      <ConversationalWorkflowGenerator />
    </div>
  );
}
