'use client';

import React from 'react';

interface Orchestrator {
  id: string;
  name: string;
  icon: string;
  description: string;
}

const orchestrators: Orchestrator[] = [
  {
    id: 'aora',
    name: 'AORA',
    icon: '/orchestrators/aora.png',
    description: 'Finds prospects and books your demos automatically. AORA searches for potential customers, maps out decision-makers, and fills your CRM with accurate, verified insights.'
  },
  {
    id: 'nova',
    name: 'NOVA',
    icon: '/orchestrators/nova.png',
    description: 'Finds opportunities and prevents customer loss. NOVA monitors how customers use your product, spots growth opportunities, and predicts when someone might leave.'
  },
  {
    id: 'close',
    name: 'CLOSE',
    icon: '/orchestrators/close.png',
    description: 'Closes deals faster with smarter communication. CLOSE analyzes how prospects interact, spots buying signals, and gives your team real-time advice.'
  },
  {
    id: 'peak',
    name: 'PEAK',
    icon: '/orchestrators/peak.png',
    description: 'Keeps your customers happy and growing. PEAK analyzes usage patterns, predicts growth potential, and creates tailored success plans.'
  },
  {
    id: 'launch',
    name: 'LAUNCH',
    icon: '/orchestrators/launch.png',
    description: 'Gets new customers up and running quickly. LAUNCH builds customized onboarding plans, handles technical setup, and delivers training resources.'
  },
  {
    id: 'expand',
    name: 'EXPAND',
    icon: '/orchestrators/expand.png',
    description: 'Helps you expand with confidence. EXPAND analyzes market trends, studies competitors, and recognizes patterns of success.'
  }
];

interface OrchestratorsProps {
  onSelect: (orchestrator: Orchestrator) => void;
}

const Orchestrators: React.FC<OrchestratorsProps> = ({ onSelect }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {orchestrators.map((orchestrator) => (
        <div
          key={orchestrator.id}
          onClick={() => onSelect(orchestrator)}
          className="group flex items-start space-x-4 p-4 bg-dark-50/30 backdrop-blur-md rounded-lg border border-primary/20 hover:border-primary/40 cursor-pointer transition-all duration-200 hover:shadow-neon"
        >
          <div className="flex-shrink-0">
            <img
              src={orchestrator.icon}
              alt={orchestrator.name}
              className="w-12 h-12 object-contain filter brightness-110"
            />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white group-hover:text-primary transition-colors">
              {orchestrator.name}
            </h3>
            <p className="text-sm text-white/70 group-hover:text-white/90 transition-colors">
              {orchestrator.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Orchestrators; 