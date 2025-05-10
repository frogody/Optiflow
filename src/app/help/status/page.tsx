'use client';

import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import { useState } from 'react';

// Mock data for the service statuses
const serviceStatuses = [
  {
    name: 'Workflow Engine',
    status: 'operational',
    lastUpdated: '5 minutes ago',
    description: 'The core workflow execution engine'
  },
  {
    name: 'Voice Agent (Jarvis)',
    status: 'operational',
    lastUpdated: '5 minutes ago',
    description: 'Voice recognition and processing service'
  },
  {
    name: 'API Gateway',
    status: 'operational',
    lastUpdated: '5 minutes ago',
    description: 'External API services and integrations'
  },
  {
    name: 'Dashboard',
    status: 'operational',
    lastUpdated: '5 minutes ago',
    description: 'User interface and management console'
  },
  {
    name: 'Authentication',
    status: 'operational',
    lastUpdated: '5 minutes ago',
    description: 'User authentication and authorization'
  },
  {
    name: 'Database Services',
    status: 'operational',
    lastUpdated: '5 minutes ago',
    description: 'Data storage and retrieval services'
  },
  {
    name: 'Integration Platform',
    status: 'degraded',
    lastUpdated: '15 minutes ago',
    description: 'Third-party service connections and integrations',
    details: 'Some integrations may experience delayed execution times'
  },
  {
    name: 'Notification System',
    status: 'operational',
    lastUpdated: '5 minutes ago',
    description: 'Email, SMS, and in-app notifications'
  }
];

// Mock data for incident history
const incidentHistory = [
  {
    id: 'INC-20250620',
    title: 'Integration Platform Performance Degradation',
    status: 'monitoring',
    severity: 'minor',
    date: 'June 20, 2025',
    time: '14:35 UTC',
    updates: [
      {
        timestamp: 'June 20, 2025 - 14:35 UTC',
        message: 'We are investigating reports of delayed execution for certain third-party integrations.'
      },
      {
        timestamp: 'June 20, 2025 - 14:45 UTC',
        message: 'The issue has been identified as increased latency in our API gateway. Our engineers are working on a fix.'
      },
      {
        timestamp: 'June 20, 2025 - 15:10 UTC',
        message: 'A fix has been deployed. We are monitoring the situation to ensure service returns to normal.'
      }
    ]
  },
  {
    id: 'INC-20250615',
    title: 'Scheduled Maintenance - Database Optimization',
    status: 'resolved',
    severity: 'maintenance',
    date: 'June 15, 2025',
    time: '02:00 UTC',
    updates: [
      {
        timestamp: 'June 15, 2025 - 01:55 UTC',
        message: 'Scheduled maintenance is about to begin. Some services may be unavailable for up to 30 minutes.'
      },
      {
        timestamp: 'June 15, 2025 - 02:20 UTC',
        message: 'Maintenance is in progress. Database optimization is approximately 50% complete.'
      },
      {
        timestamp: 'June 15, 2025 - 02:35 UTC',
        message: 'Maintenance has been completed successfully and all services are back online.'
      }
    ]
  },
  {
    id: 'INC-20250610',
    title: 'Voice Agent Service Outage',
    status: 'resolved',
    severity: 'major',
    date: 'June 10, 2025',
    time: '18:22 UTC',
    updates: [
      {
        timestamp: 'June 10, 2025 - 18:22 UTC',
        message: 'We are investigating reports of users unable to access the Voice Agent service.'
      },
      {
        timestamp: 'June 10, 2025 - 18:35 UTC',
        message: 'The issue has been identified as a configuration error in our latest deployment. Our team is working on a fix.'
      },
      {
        timestamp: 'June 10, 2025 - 19:05 UTC',
        message: 'A fix has been deployed and the Voice Agent service is now operational. We are monitoring for any residual issues.'
      },
      {
        timestamp: 'June 10, 2025 - 20:00 UTC',
        message: 'The incident has been resolved. All Voice Agent services are functioning normally.'
      }
    ]
  }
];

export default function StatusPage() {
  const [expandedIncident, setExpandedIncident] = useState<string | null>(null);
  
  const toggleIncidentDetails = (id: string) => {
    if (expandedIncident === id) {
      setExpandedIncident(null);
    } else {
      setExpandedIncident(id);
    }
  };
  
  // Calculate overall system status
  const calculateOverallStatus = () => {
    const hasOutage = serviceStatuses.some(service => service.status === 'outage');
    const hasDegradation = serviceStatuses.some(service => service.status === 'degraded');
    
    if (hasOutage) return 'outage';
    if (hasDegradation) return 'degraded';
    return 'operational';
  };
  
  const overallStatus = calculateOverallStatus();
  
  // Status indicator component
  const StatusIndicator = ({ status }: { status: string }) => {
    switch (status) {
      case 'operational':
        return (
          <div className="flex items-center">
            <CheckCircleIcon className="h-5 w-5 text-[#10b981] mr-2" />
            <span className="text-[#10b981] font-medium">Operational</span>
          </div>
        );
      case 'degraded':
        return (
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-5 w-5 text-[#f59e0b] mr-2" />
            <span className="text-[#f59e0b] font-medium">Degraded</span>
          </div>
        );
      case 'outage':
        return (
          <div className="flex items-center">
            <XCircleIcon className="h-5 w-5 text-[#ef4444] mr-2" />
            <span className="text-[#ef4444] font-medium">Outage</span>
          </div>
        );
      case 'maintenance':
        return (
          <div className="flex items-center">
            <InformationCircleIcon className="h-5 w-5 text-[#3b82f6] mr-2" />
            <span className="text-[#3b82f6] font-medium">Maintenance</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#22D3EE] mb-6">System Status</h1>
      
      {/* Overall Status */}
      <div className={`p-6 rounded-lg mb-8 border ${
        overallStatus === 'operational' ? 'bg-[#022c22] border-[#10b981]' :
        overallStatus === 'degraded' ? 'bg-[#422006] border-[#f59e0b]' :
        'bg-[#3f0d0d] border-[#ef4444]'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#E5E7EB] mb-2">
              {overallStatus === 'operational' ? 'All Systems Operational' :
               overallStatus === 'degraded' ? 'Partial System Degradation' :
               'System Outage Detected'}
            </h2>
            <p className="text-[#9CA3AF]">
              Last checked: 5 minutes ago
            </p>
          </div>
          <StatusIndicator status={overallStatus} />
        </div>
      </div>
      
      {/* Service Statuses */}
      <div className="bg-[#18181B] rounded-lg border border-[#374151] p-6 mb-8">
        <h2 className="text-xl font-bold text-[#E5E7EB] mb-6">Service Status</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {serviceStatuses.map((service) => (
            <div 
              key={service.name} 
              className={`p-4 rounded-lg border ${
                service.status === 'operational' ? 'border-[#1e293b]' :
                service.status === 'degraded' ? 'border-[#f59e0b] bg-[#422006]/20' :
                service.status === 'outage' ? 'border-[#ef4444] bg-[#3f0d0d]/20' :
                'border-[#3b82f6] bg-[#172554]/20'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-[#E5E7EB]">{service.name}</h3>
                  <p className="text-sm text-[#9CA3AF] mt-1">{service.description}</p>
                  {service.details && (
                    <p className="text-sm text-[#f59e0b] mt-2">{service.details}</p>
                  )}
                </div>
                <StatusIndicator status={service.status} />
              </div>
              <p className="text-xs text-[#6B7280] mt-3">
                Updated {service.lastUpdated}
              </p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Incident History */}
      <div className="bg-[#18181B] rounded-lg border border-[#374151] p-6">
        <h2 className="text-xl font-bold text-[#E5E7EB] mb-6">Recent Incidents</h2>
        
        {incidentHistory.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircleIcon className="h-12 w-12 text-[#10b981] mx-auto" />
            <p className="mt-2 text-[#9CA3AF]">No incidents reported in the last 30 days</p>
          </div>
        ) : (
          <div className="space-y-4">
            {incidentHistory.map((incident) => (
              <div key={incident.id} className="bg-[#111111] rounded-lg border border-[#374151]">
                <div 
                  className="p-4 cursor-pointer hover:bg-[#1E293B] transition-colors"
                  onClick={() => toggleIncidentDetails(incident.id)}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-[#E5E7EB]">{incident.title}</h3>
                      <div className="flex items-center text-xs text-[#9CA3AF] mt-1 space-x-3">
                        <span>{incident.date} at {incident.time}</span>
                        <span>ID: {incident.id}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div>
                        <StatusIndicator status={
                          incident.status === 'resolved' ? 'operational' :
                          incident.status === 'monitoring' ? 'degraded' :
                          incident.severity === 'maintenance' ? 'maintenance' : 'outage'
                        } />
                      </div>
                    </div>
                  </div>
                </div>
                
                {expandedIncident === incident.id && (
                  <div className="border-t border-[#374151] px-4 py-3">
                    <h4 className="text-sm font-medium text-[#E5E7EB] mb-3">Incident Updates</h4>
                    <div className="space-y-3">
                      {incident.updates.map((update, index) => (
                        <div key={index} className="relative pl-5 pb-3">
                          {index !== incident.updates.length - 1 && (
                            <div className="absolute left-2 top-3 bottom-0 w-0.5 bg-[#374151]"></div>
                          )}
                          <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-[#1E293B] border border-[#374151]"></div>
                          <div>
                            <p className="text-xs text-[#9CA3AF] mb-1">{update.timestamp}</p>
                            <p className="text-sm text-[#E5E7EB]">{update.message}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Subscribe to Updates */}
      <div className="mt-8 bg-gradient-to-r from-[#134e4a] to-[#1e1b4b] rounded-lg p-6 border border-[#22D3EE]">
        <div className="md:flex items-center justify-between">
          <div className="mb-4 md:mb-0">
            <h2 className="text-lg font-bold text-white mb-1">Stay Updated</h2>
            <p className="text-[#D1D5DB]">
              Subscribe to receive real-time notifications about system status changes.
            </p>
          </div>
          <div className="flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-2 bg-[#111111] border border-[#374151] rounded-l-md text-[#E5E7EB] placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#22D3EE] focus:border-transparent"
            />
            <button className="px-4 py-2 bg-[#22D3EE] text-[#111111] font-medium rounded-r-md hover:bg-[#06B6D4] transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 