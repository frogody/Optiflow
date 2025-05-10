'use client';

import { useState } from 'react';

interface Activity { id: string;
  type: 'workflow_created' | 'workflow_updated' | 'workflow_executed' | 'tool_connected' | 'error';
  message: string;
  timestamp: string;
  details?: string;
    }

// Mock data for development
const mockActivities: Activity[] = [
  { id: '1',
    type: 'workflow_created',
    message: 'New workflow created: Data Processing Pipeline',
    timestamp: '2024-02-20T10:30:00Z',
      },
  { id: '2',
    type: 'workflow_executed',
    message: 'Workflow executed successfully: Customer Data Sync',
    timestamp: '2024-02-20T10:15:00Z',
    details: 'Processed 1,234 records',
      },
  { id: '3',
    type: 'tool_connected',
    message: 'Connected to Clay API',
    timestamp: '2024-02-20T10:00:00Z',
      },
  { id: '4',
    type: 'error',
    message: 'Workflow execution failed: Legacy System Integration',
    timestamp: '2024-02-20T09:45:00Z',
    details: 'Connection timeout',
      },
];

export default function ActivityFeed(): JSX.Element {
  const [activities] = useState<Activity[]>(mockActivities);

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) { case 'workflow_created':
        return '✨';
      case 'workflow_updated':
        return '📝';
      case 'workflow_executed':
        return '▶️';
      case 'tool_connected':
        return '🔌';
      case 'error':
        return '⚠️';
      default:
        return '📋';
        }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="bg-dark-50/30 backdrop-blur-md rounded-lg border border-primary/20 shadow-neon p-6">
      <h2 className="text-xl font-semibold text-white mb-6">Recent Activity</h2>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="p-4 bg-dark-100/50 rounded-lg border border-primary/10"
          >
            <div className="flex items-start space-x-3">
              <div className="text-2xl">{getActivityIcon(activity.type)}</div>
              <div className="flex-1 min-w-0">
                <p className="text-white/90">{activity.message}</p>
                {activity.details && (
                  <p className="text-white/60 text-sm mt-1">{activity.details}</p>
                )}
                <p className="text-white/40 text-xs mt-2">
                  {formatTimeAgo(activity.timestamp)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 