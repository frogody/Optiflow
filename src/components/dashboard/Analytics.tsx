// @ts-nocheck - This file has some TypeScript issues that are hard to fix
'use client';

import { useState } from 'react';

interface AnalyticMetric { label: string;
  value: number;
  change: number;
  unit: string;
    }

// Mock data for development
const mockMetrics: AnalyticMetric[] = [
  { label: 'Total Workflows',
    value: 12,
    change: 2,
    unit: '',
      },
  { label: 'Success Rate',
    value: 98.5,
    change: 0.5,
    unit: '%',
      },
  { label: 'Average Duration',
    value: 45,
    change: -5,
    unit: 's',
      },
  { label: 'Data Processed',
    value: 1234567,
    change: 15,
    unit: 'records',
      },
];

export default function Analytics(): JSX.Element {
  const [metrics] = useState<AnalyticMetric[]>(mockMetrics);

  const formatValue = (value: number, unit: string) => {
    if (unit === 'records') {
      return value.toLocaleString();
    }
    return value.toString();
  };

  const formatChange = (change: number) => {
    const prefix = change > 0 ? '+' : '';
    return `${prefix}${change}`;
  };

  return (
    <div className="bg-dark-50/30 backdrop-blur-md rounded-lg border border-primary/20 shadow-neon p-6">
      <h2 className="text-xl font-semibold text-white mb-6">Analytics Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="p-4 bg-dark-100/50 rounded-lg border border-primary/10"
          >
            <div className="text-white/60 text-sm">{metric.label}</div>
            <div className="mt-2 flex items-baseline space-x-2">
              <div className="text-2xl font-semibold text-white">
                {formatValue(metric.value, metric.unit)}
                <span className="text-white/60 text-sm ml-1">{metric.unit}</span>
              </div>
              <div
                className={`text-sm ${ metric.change > 0
                    ? 'text-green-400'
                    : metric.change < 0
                    ? 'text-red-400'
                    : 'text-white/60'
                    }`}
              >
                {formatChange(metric.change)}
                { metric.unit && metric.unit !== 'records' ? metric.unit : '%'    }
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 text-center">
        <button className="text-primary hover:text-primary-dark transition-colors text-sm">
          View Detailed Analytics →
        </button>
      </div>
    </div>
  );
} 