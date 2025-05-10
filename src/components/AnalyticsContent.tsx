'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { usePipedream } from '@/hooks/usePipedream';
import { useUserStore } from '@/lib/userStore';

// Mock data for analytics display
const analyticsData = {
  apiCalls: [
    { date: 'Mon', value: 230     },
    { date: 'Tue', value: 380     },
    { date: 'Wed', value: 450     },
    { date: 'Thu', value: 520     },
    { date: 'Fri', value: 410     },
    { date: 'Sat', value: 280     },
    { date: 'Sun', value: 220     }
  ],
  workflows: [
    { name: 'Lead Generation', runs: 128, successRate: 92, avgDuration: '3m 24s'     },
    { name: 'Customer Onboarding', runs: 87, successRate: 98, avgDuration: '2m 12s'     },
    { name: 'Data Enrichment', runs: 245, successRate: 85, avgDuration: '4m 37s'     },
    { name: 'Email Campaign', runs: 56, successRate: 94, avgDuration: '1m 48s'     }
  ],
  integrationUsage: [
    { name: 'Clay', usage: 34     },
    { name: 'HubSpot', usage: 28     },
    { name: 'Gmail', usage: 22     },
    { name: 'n8n', usage: 16     }
  ]
};

export default function AnalyticsContent(): JSX.Element {
  const router = useRouter();
  const { currentUser } = useUserStore();
  const [isLoading, setIsLoading] = useState(true);
  const { connectionStatus } = usePipedream({ appName: 'pipedream'     });
  
  // Chart dimensions
  const chartWidth = 600;
  const chartHeight = 200;
  const barWidth = chartWidth / analyticsData.apiCalls.length - 10;
  
  // Find max value for scaling
  const maxValue = Math.max(...analyticsData.apiCalls.map(d => d.value));

  useEffect(() => {    
    // Simulate loading data
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading-pulse gradient-text text-xl">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Neural Network Background */}
      <div className="neural-bg"></div>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20     }}
          animate={{ opacity: 1, y: 0     }}
          transition={{ duration: 0.5     }}
        >
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold gradient-text mb-2">
                Workflow Analytics
              </h1>
              <p className="text-gray-400">
                Track your workflow performance and API usage
              </p>
            </div>
            <Link href="/dashboard" className="action-button px-4 py-2 rounded-lg">
              Back to Dashboard
            </Link>
          </div>
          
          {/* Connection Status */}
          <div className="bg-dark-100/30 backdrop-blur-sm border border-white/10 rounded-lg p-4 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white mb-1">API Connection Status</h2>
                <p className="text-gray-400">
                  { connectionStatus.status === 'connected' 
                    ? 'Your API connection is active and metrics are being collected' 
                    : 'Connect to the Pipedream API to enable analytics collection'    }
                </p>
              </div>
              <div className="flex items-center">
                <span className={`inline-block w-3 h-3 rounded-full mr-2 ${ connectionStatus.status === 'connected' ? 'bg-green-500' : 'bg-yellow-500'
                    }`}></span>
                <span className="text-gray-300">{ connectionStatus.status === 'connected' ? 'Connected' : 'Not Connected'    }</span>
              </div>
            </div>
          </div>
          
          {/* API Usage Chart */}
          <div className="bg-dark-100/30 backdrop-blur-sm border border-white/10 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">API Usage - Last 7 Days</h2>
            
            <div className="overflow-x-auto">
              <div className="min-w-[600px]">
                <svg width={chartWidth} height={chartHeight} className="mx-auto">
                  {/* Y-axis */}
                  <line x1="40" y1="10" x2="40" y2="170" stroke="rgba(255,255,255,0.2)" />
                  
                  {/* X-axis */}
                  <line x1="40" y1="170" x2={chartWidth - 10} y2="170" stroke="rgba(255,255,255,0.2)" />
                  
                  {/* Bars */}
                  {analyticsData.apiCalls.map((day, i) => (
                    <g key={day.date}>
                      {/* Bar */}
                      <rect
                        x={50 + i * (barWidth + 10)}
                        y={170 - (day.value / maxValue) * 150}
                        width={barWidth}
                        height={(day.value / maxValue) * 150}
                        rx="4"
                        fill="url(#barGradient)"
                        className="opacity-80 hover:opacity-100 transition-opacity"
                      />
                      
                      {/* Day label */}
                      <text
                        x={50 + i * (barWidth + 10) + barWidth / 2}
                        y="190"
                        fontSize="12"
                        fill="white"
                        textAnchor="middle"
                      >
                        {day.date}
                      </text>
                      
                      {/* Value */}
                      <text
                        x={50 + i * (barWidth + 10) + barWidth / 2}
                        y={165 - (day.value / maxValue) * 150}
                        fontSize="10"
                        fill="white"
                        textAnchor="middle"
                      >
                        {day.value}
                      </text>
                    </g>
                  ))}
                  
                  {/* Gradient definition */}
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3CDFFF" />
                      <stop offset="100%" stopColor="#4AFFD4" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="p-4 bg-black/20 rounded-lg">
                <h3 className="text-lg font-medium text-white mb-1">Total API Calls</h3>
                <div className="text-3xl font-semibold gradient-text">2,490</div>
                <p className="text-white/60 text-sm">This week</p>
              </div>
              
              <div className="p-4 bg-black/20 rounded-lg">
                <h3 className="text-lg font-medium text-white mb-1">Avg. Response Time</h3>
                <div className="text-3xl font-semibold gradient-text">312ms</div>
                <p className="text-white/60 text-sm">Last 1000 requests</p>
              </div>
            </div>
          </div>
          
          {/* Workflow Performance */}
          <div className="bg-dark-100/30 backdrop-blur-sm border border-white/10 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Workflow Performance</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-white/80 font-medium">Workflow</th>
                    <th className="text-center py-3 px-4 text-white/80 font-medium">Runs</th>
                    <th className="text-center py-3 px-4 text-white/80 font-medium">Success Rate</th>
                    <th className="text-center py-3 px-4 text-white/80 font-medium">Avg. Duration</th>
                    <th className="text-right py-3 px-4 text-white/80 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {analyticsData.workflows.map((workflow) => (
                    <tr key={workflow.name} className="border-b border-white/5 hover:bg-white/5">
                      <td className="py-3 px-4 text-white font-medium">{workflow.name}</td>
                      <td className="py-3 px-4 text-white/70 text-center">{workflow.runs}</td>
                      <td className="py-3 px-4 text-center">
                        <div className="inline-flex items-center">
                          <span 
                            className={`inline-block w-2 h-2 rounded-full mr-2 ${ workflow.successRate >= 95 ? 'bg-green-500' : 
                              workflow.successRate >= 85 ? 'bg-yellow-500' : 
                              'bg-red-500'
                                }`}
                          ></span>
                          <span 
                            className={ workflow.successRate >= 95 ? 'text-green-400' : 
                              workflow.successRate >= 85 ? 'text-yellow-400' : 
                              'text-red-400'
                                }
                          >
                            {workflow.successRate}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-white/70 text-center">{workflow.avgDuration}</td>
                      <td className="py-3 px-4 text-right">
                        <span className="inline-block px-2 py-1 bg-green-500/10 text-green-400 text-xs rounded-md">
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Integration Usage */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-dark-100/30 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Integration Usage</h2>
              
              <div className="space-y-4">
                {analyticsData.integrationUsage.map((integration) => (
                  <div key={integration.name} className="flex items-center justify-between">
                    <span className="text-white">{integration.name}</span>
                    <div className="w-48 flex items-center">
                      <div className="w-full bg-white/10 h-2 rounded-full mr-3">
                        <div 
                          className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full"
                          style={{ width: `${(integration.usage / 40) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-white/70 text-sm">{integration.usage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-dark-100/30 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Resource Usage</h2>
              
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white">API Quota</span>
                    <span className="text-white/70">2,490 / 10,000</span>
                  </div>
                  <div className="w-full bg-white/10 h-3 rounded-full">
                    <div 
                      className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full"
                      style={{ width: '24.9%'     }}
                    ></div>
                  </div>
                  <div className="flex justify-end mt-1">
                    <span className="text-white/60 text-xs">24.9% used</span>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white">Storage</span>
                    <span className="text-white/70">1.2GB / 5GB</span>
                  </div>
                  <div className="w-full bg-white/10 h-3 rounded-full">
                    <div 
                      className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full"
                      style={{ width: '24%'     }}
                    ></div>
                  </div>
                  <div className="flex justify-end mt-1">
                    <span className="text-white/60 text-xs">24% used</span>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white">Compute Time</span>
                    <span className="text-white/70">14h / 100h</span>
                  </div>
                  <div className="w-full bg-white/10 h-3 rounded-full">
                    <div 
                      className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full"
                      style={{ width: '14%'     }}
                    ></div>
                  </div>
                  <div className="flex justify-end mt-1">
                    <span className="text-white/60 text-xs">14% used</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/workflows" className="action-button p-4 rounded-lg text-left block">
              <span className="block text-lg font-semibold mb-1">Manage Workflows</span>
              <span className="text-sm text-gray-400">Monitor and optimize your workflows</span>
            </Link>
            
            <Link href="/connections" className="action-button p-4 rounded-lg text-left block">
              <span className="block text-lg font-semibold mb-1">Manage Connections</span>
              <span className="text-sm text-gray-400">Configure your API connections</span>
            </Link>
            
            <Link href="/dashboard" className="action-button p-4 rounded-lg text-left block">
              <span className="block text-lg font-semibold mb-1">Return to Dashboard</span>
              <span className="text-sm text-gray-400">Go back to main dashboard view</span>
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
} 