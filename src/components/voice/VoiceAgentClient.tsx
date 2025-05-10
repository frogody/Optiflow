/** @jsxImportSource react */
'use client';

import React from 'react';
import type { FC } from 'react';
import VoiceAgentInterface from './VoiceAgentInterface';

interface VoiceAgentClientProps {
  className?: string;
}

const VoiceAgentClient: FC<VoiceAgentClientProps> = ({ className }) => {
  return (
    <div className={className}>
      <VoiceAgentInterface />
    </div>
  );
};

export default VoiceAgentClient; 