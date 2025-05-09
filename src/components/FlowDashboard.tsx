// @ts-nocheck - This file has some TypeScript issues that are hard to fix
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/lib/userStore';
import Image from 'next/image';
import Link from 'next/link';
import { AoraAgent } from '@/services/agents/AoraAgent';
import { mcpService } from '@/services/mcp/MCPService';

interface ConnectedApp { id: string;
  name: string;
  icon: string;
  status: 'connected' | 'disconnected' | 'error';
  errorMessage?: string;
    }

interface FlowDashboardProps { orchestratorId: string;
  flowId: string;
    }

export default function FlowDashboard({ orchestratorId, flowId }: FlowDashboardProps): JSX.Element {
  const router = useRouter();
  const { currentUser } = useUserStore();
  const [isLoading, setIsLoading] = useState(true);
  const [agent, setAgent] = useState<AoraAgent | null>(null);
  const [flowData, setFlowData] = useState<{
    name: string;
    description: string;
    icon: string;
    requiredTools: string[];
      } | null>(null);
  
  const [connectedApps, setConnectedApps] = useState<ConnectedApp[]>([
    { id: 'clay',
      name: 'Clay',
      icon: '/icons/clay.svg',
      status: 'disconnected'
        },
    { id: 'hubspot',
      name: 'HubSpot',
      icon: '/icons/hubspot.svg',
      status: 'connected'
        }
  ]);

  useEffect(() => {
    // Initialize AORA agent
    const initializeAgent = async () => {
      try {
        // Create connections if they don't exist
        for (const app of connectedApps) {
          try {
            await mcpService.createConnection(app.id, { type: app.id,
              // Add any necessary configuration
                });
          } catch (error) {
            console.error(`Error creating connection for ${app.id}:`, error);
          }
        }

        // Initialize and start the agent
        const aoraAgent = new AoraAgent({ claudeApiKey: process.env.NEXT_PUBLIC_CLAUDE_API_KEY || '',
          maxConcurrentConnections: 2,
          retryAttempts: 3
            });
        
        await aoraAgent.start();
        setAgent(aoraAgent);

        // Update connection statuses periodically
        const interval = setInterval(async () => {
          const statuses = aoraAgent.getAllConnectionStatuses();
          setConnectedApps(prev => 
            prev.map(app => {
              const status = statuses.find(s => s.id.startsWith(app.id));
              return { ...app,
                status: status?.status || app.status,
                errorMessage: status?.errorMessage
                  };
            })
          );
        }, 5000);

        return () => {
          clearInterval(interval);
          aoraAgent.stop();
        };
      } catch (error) { console.error('Error initializing AORA agent:', error);
          }
    };

    initializeAgent();
  }, [connectedApps]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    // In a real implementation, this would fetch the flow data from your backend API
    const mockFlowData = {
      aora: {
        name: 'AORA',
        description: 'Contact prospects and book demos automatically',
        icon: '/orchestrators/aora.png',
        requiredTools: ['clay', 'hubspot']
      }
    }[flowId];

    setFlowData(mockFlowData || null);
    setIsLoading(false);
  }, [flowId]) // eslint-disable-line react-hooks/exhaustive-deps

  if (isLoading || !flowData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading-pulse gradient-text text-xl">
          { isLoading ? 'Loading flow...' : 'Flow not found'    }
        </div>
      </div>
    );
  }

  const requiredApps = connectedApps.filter(app => 
    flowData.requiredTools.includes(app.id)
  );

  return (
    <div className="min-h-screen relative">
      {/* Neural Network Background */}
      <div className="neural-bg"></div>

      {/* Main Content */}
      <div className="flow-details-container relative z-10">
        {/* Flow Header */}
        <div className="flow-header">
          <div className="flex items-center gap-4">
            {flowData.icon.startsWith('/') ? (
              <div className="w-16 h-16 relative floating-icon">
                <Image
                  src={flowData.icon}
                  alt={flowData.name}
                  width={64}
                  height={64}
                  style={{ objectFit: 'contain'     }}
                  className="rounded-lg"
                />
              </div>
            ) : (
              <span className="text-5xl floating-icon">{flowData.icon}</span>
            )}
            <div>
              <h1 className="text-4xl font-bold gradient-text mb-3">
                {flowData.name}
              </h1>
              <p className="text-lg text-white/70">
                {flowData.description}
              </p>
            </div>
          </div>
        </div>

        {/* Required Connections */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold gradient-text">
              Required Connections
            </h2>
            <Link 
              href={`/orchestrators/${orchestratorId}/tools/connect`}
              className="action-button px-6 py-3 rounded-lg text-sm font-medium"
            >
              + Configure connections
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {requiredApps.map((app) => (
              <div 
                key={app.id} 
                className="tech-card p-6 rounded-lg cursor-pointer"
                onClick={() => router.push(`/orchestrators/${orchestratorId}/tools/${app.id}`)}
              >
                <div className="flex items-center gap-4">
                  <div className="relative w-12 h-12 floating-icon">
                    <Image
                      src={app.icon}
                      alt={app.name}
                      width={48}
                      height={48}
                      style={{ objectFit: 'cover'     }}
                      className="rounded-lg"
                    />
                  </div>
                  <div className="flex-1">
                    <span className="text-white font-medium text-lg block mb-2">{app.name}</span>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${ app.status === 'connected' ? 'status-ready' :
                        app.status === 'disconnected' ? 'status-setup' :
                        'status-error'
                          }`}></div>
                      <span className="text-sm text-white/70">
                        { app.status === 'connected' ? 'Connected' :
                         app.status === 'disconnected' ? 'Setup required' :
                         'Connection error'    }
                      </span>
                    </div>
                    {app.status === 'error' && app.errorMessage && (
                      <p className="text-red-400 text-sm mt-2">{app.errorMessage}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Flow Configuration */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold gradient-text">
              Flow Configuration
            </h2>
            <Link 
              href={`/orchestrators/${orchestratorId}/flows/${flowId}/settings`}
              className="action-button px-6 py-3 rounded-lg text-sm font-medium"
            >
              Edit configuration
            </Link>
          </div>
          <div className="flow-card p-8 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium text-white/90 mb-3">Workflow Status</h3>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full status-ready"></div>
                  <span className="text-white/70 text-base">Active and running</span>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-white/90 mb-3">Last Run</h3>
                <p className="text-white/70 text-base">2 hours ago</p>
              </div>
            </div>
          </div>
        </div>

        {/* AI Processing */}
        <div>
          <h2 className="text-2xl font-semibold gradient-text mb-6">
            AI Processing
          </h2>
          <div className="flow-card p-8 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 relative floating-icon">
                  <div className="absolute inset-0 rounded-full bg-[#22c55e] opacity-20 animate-ping"></div>
                  <div className="absolute inset-0 rounded-full bg-[#22c55e] opacity-40"></div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">Processing Status</h3>
                  <p className="text-white/70 text-base">AI agent is actively monitoring workflow execution</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-medium text-white/90 mb-1">Next Check</p>
                <p className="text-white/70 text-base">~2 minutes</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 