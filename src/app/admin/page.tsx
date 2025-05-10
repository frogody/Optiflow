'use client';

import {
  ArrowDownIcon,
  ArrowUpIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/solid';
import { useState } from 'react';

export default function AdminDashboard() {
  // Dummy data for dashboard metrics
  const metrics = [
    {
      name: 'Active Users',
      value: '2,541',
      change: '+12.5%',
      positive: true,
    },
    {
      name: 'Workflow Executions',
      value: '142,983',
      change: '+28.4%',
      positive: true,
    },
    {
      name: 'Error Rate',
      value: '1.2%',
      change: '-0.4%',
      positive: true,
    },
    {
      name: 'Revenue',
      value: '$28,493',
      change: '+8.1%',
      positive: true,
    },
  ];

  // Dummy data for system status
  const systemStatus = [
    {
      name: 'API Services',
      status: 'Operational',
      positive: true,
    },
    {
      name: 'Workflow Engine',
      status: 'Operational',
      positive: true,
    },
    {
      name: 'Database Cluster',
      status: 'Degraded',
      positive: false,
    },
    {
      name: 'Authentication',
      status: 'Operational',
      positive: true,
    },
  ];

  // Dummy data for recent user activity
  const recentActivity = [
    {
      user: 'john.doe@example.com',
      action: 'Created a new workflow',
      time: '5 minutes ago',
    },
    {
      user: 'jane.smith@company.org',
      action: 'Updated billing information',
      time: '32 minutes ago',
    },
    {
      user: 'alex.wong@tech.co',
      action: 'Connected Slack integration',
      time: '1 hour ago',
    },
    {
      user: 'sarah.johnson@startup.io',
      action: 'Upgraded to Enterprise plan',
      time: '3 hours ago',
    },
    {
      user: 'michael.brown@corp.com',
      action: 'Reported an issue with email actions',
      time: '5 hours ago',
    },
  ];

  // Dummy data for alerts
  const alerts = [
    {
      severity: 'High',
      message: 'Database connection pool approaching limit',
      time: '10 minutes ago',
    },
    {
      severity: 'Medium',
      message: 'API rate limiting triggered for 3 users',
      time: '1 hour ago',
    },
    {
      severity: 'Low',
      message: 'Storage capacity at 75%',
      time: '2 hours ago',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#22D3EE]">Admin Dashboard</h1>
        <div className="text-sm text-[#9CA3AF]">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <div
            key={metric.name}
            className="bg-[#18181B] border border-[#374151] rounded-lg p-6 shadow-lg"
          >
            <div className="flex justify-between">
              <p className="text-[#9CA3AF] text-sm font-medium">{metric.name}</p>
              <div
                className={`flex items-center text-xs font-medium ${
                  metric.positive ? 'text-[#22D3EE]' : 'text-[#F87171]'
                }`}
              >
                {metric.positive ? (
                  <ArrowUpIcon className="h-3 w-3 mr-1" />
                ) : (
                  <ArrowDownIcon className="h-3 w-3 mr-1" />
                )}
                {metric.change}
              </div>
            </div>
            <p className="mt-2 text-3xl font-bold text-[#E5E7EB]">{metric.value}</p>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Status */}
        <div className="bg-[#18181B] border border-[#374151] rounded-lg shadow-lg">
          <div className="px-6 py-4 border-b border-[#374151]">
            <h2 className="text-lg font-medium text-[#E5E7EB]">System Status</h2>
          </div>
          <div className="p-6">
            <ul className="divide-y divide-[#374151]">
              {systemStatus.map((system) => (
                <li key={system.name} className="py-3 flex items-center justify-between">
                  <span className="text-[#D1D5DB]">{system.name}</span>
                  <span
                    className={`flex items-center text-sm font-medium ${
                      system.positive ? 'text-[#22D3EE]' : 'text-[#F87171]'
                    }`}
                  >
                    {system.positive ? (
                      <CheckCircleIcon className="h-4 w-4 mr-1.5" />
                    ) : (
                      <ExclamationTriangleIcon className="h-4 w-4 mr-1.5" />
                    )}
                    {system.status}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Alerts */}
        <div className="bg-[#18181B] border border-[#374151] rounded-lg shadow-lg">
          <div className="px-6 py-4 border-b border-[#374151]">
            <h2 className="text-lg font-medium text-[#E5E7EB]">Active Alerts</h2>
          </div>
          <div className="p-6">
            {alerts.length === 0 ? (
              <p className="text-center py-4 text-[#9CA3AF]">No active alerts</p>
            ) : (
              <ul className="divide-y divide-[#374151]">
                {alerts.map((alert, index) => (
                  <li key={index} className="py-3">
                    <div className="flex items-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mr-2 ${
                          alert.severity === 'High'
                            ? 'bg-[#371520] text-[#F87171]'
                            : alert.severity === 'Medium'
                            ? 'bg-[#422006] text-[#F59E0B]'
                            : 'bg-[#032541] text-[#38BDF8]'
                        }`}
                      >
                        {alert.severity}
                      </span>
                      <p className="text-[#D1D5DB]">{alert.message}</p>
                    </div>
                    <p className="mt-1 text-xs text-[#6B7280]">{alert.time}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
      
      {/* Recent User Activity */}
      <div className="bg-[#18181B] border border-[#374151] rounded-lg shadow-lg">
        <div className="px-6 py-4 border-b border-[#374151]">
          <h2 className="text-lg font-medium text-[#E5E7EB]">Recent User Activity</h2>
        </div>
        <div className="p-6">
          <ul className="divide-y divide-[#374151]">
            {recentActivity.map((activity, index) => (
              <li key={index} className="py-3">
                <div className="flex items-start">
                  <div className="flex-1">
                    <p className="text-[#D1D5DB]">
                      <span className="font-medium text-[#A855F7]">{activity.user}</span>{' '}
                      {activity.action}
                    </p>
                    <p className="mt-1 text-xs text-[#6B7280]">{activity.time}</p>
                  </div>
                  <button className="text-xs text-[#22D3EE] hover:text-[#06B6D4] transition-colors">
                    View Details
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-6 text-center">
            <button className="text-sm text-[#22D3EE] hover:text-[#06B6D4] transition-colors">
              View All Activity →
            </button>
          </div>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="bg-[#18181B] border border-[#374151] rounded-lg shadow-lg">
        <div className="px-6 py-4 border-b border-[#374151]">
          <h2 className="text-lg font-medium text-[#E5E7EB]">Quick Actions</h2>
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {['Search Users', 'View Error Logs', 'Check API Status', 'Manage Subscriptions'].map((action) => (
            <button
              key={action}
              className="px-4 py-3 bg-[#1E293B] hover:bg-[#2D3748] text-[#E5E7EB] rounded-md transition-colors text-sm font-medium"
            >
              {action}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
} 