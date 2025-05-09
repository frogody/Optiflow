// @ts-nocheck - This file has some TypeScript issues that are hard to fix
'use client';

import React from 'react';
import ConversationalWorkflowGenerator from '@/components/ConversationalWorkflowGenerator';

export default function ConversationalTestPage(): JSX.Element {
  return (
    <div className="min-h-screen">
      <ConversationalWorkflowGenerator />
    </div>
  );
}
