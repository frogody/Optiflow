'use client';

import { useState, useEffect } from 'react';


// Force dynamic rendering to avoid static generation issues
export const dynamic = 'force-dynamic';
// Disable cache to avoid static rendering issues
export const revalidate = 0;

// Heroicons removed to prevent React version conflicts
import { useState } from 'react';

// Mock notification preferences data
const mockNotificationChannels = [
  { id: 'email', name: 'Email', icon: EnvelopeIcon, enabled: true },
  { id: 'in-app', name: 'In-App Notifications', icon: BellIcon, enabled: true },
  { id: 'voice-agent', name: 'Voice Agent (Jarvis)', icon: SpeakerWaveIcon, enabled: false },
  { id: 'sms', name: 'SMS Notifications', icon: DevicePhoneMobileIcon, enabled: false, beta: true },
  { id: 'webhook', name: 'Webhook Notifications', icon: GlobeAltIcon, enabled: false, advanced: true },
];

// Mock notification types grouped by category
const mockNotificationTypes = [
  {
    category: 'Workflow Events',
    types: [
      { id: 'workflow-success', name: 'Workflow Execution Succeeded', email: true, inApp: true, voiceAgent: false, sms: false, webhook: false },
      { id: 'workflow-failed', name: 'Workflow Execution Failed', email: true, inApp: true, voiceAgent: false, sms: false, webhook: false },
      { id: 'workflow-deactivated', name: 'Workflow Deactivated due to Errors', email: true, inApp: true, voiceAgent: false, sms: false, webhook: false },
    ]
  },
  {
    category: 'Billing & Subscription',
    types: [
      { id: 'subscription-renewal', name: 'Subscription Renewal Reminder', email: true, inApp: true, voiceAgent: false, sms: false, webhook: false },
      { id: 'payment-success', name: 'Payment Successful', email: true, inApp: true, voiceAgent: false, sms: false, webhook: false },
      { id: 'payment-failed', name: 'Payment Failed', email: true, inApp: true, voiceAgent: false, sms: false, webhook: false },
      { id: 'credits-low', name: 'Credit Balance Low', email: true, inApp: true, voiceAgent: false, sms: false, webhook: false },
      { id: 'invoice-available', name: 'Invoice Available', email: true, inApp: false, voiceAgent: false, sms: false, webhook: false },
    ]
  },
  {
    category: 'Account Security',
    types: [
      { id: 'new-login', name: 'New Login Detected', email: true, inApp: true, voiceAgent: false, sms: true, webhook: false },
      { id: 'password-changed', name: 'Password Changed', email: true, inApp: true, voiceAgent: false, sms: false, webhook: false },
      { id: 'mfa-changed', name: 'MFA Enabled/Disabled', email: true, inApp: true, voiceAgent: false, sms: false, webhook: false },
    ]
  },
  {
    category: 'Product Updates',
    types: [
      { id: 'new-features', name: 'New Features Added', email: true, inApp: true, voiceAgent: false, sms: false, webhook: false },
      { id: 'maintenance', name: 'System Maintenance', email: true, inApp: true, voiceAgent: false, sms: false, webhook: false },
      { id: 'newsletter', name: 'Optiflow Newsletter', email: false, inApp: false, voiceAgent: false, sms: false, webhook: false },
    ]
  },
  {
    category: 'Integration Events',
    types: [
      { id: 'reauth-required', name: 'Integration Requires Re-authentication', email: true, inApp: true, voiceAgent: false, sms: false, webhook: false },
      { id: 'integration-failed', name: 'Integration Connection Failed', email: true, inApp: true, voiceAgent: false, sms: false, webhook: false },
    ]
  },
  {
    category: 'Team & Organization',
    types: [
      { id: 'new-member', name: 'New Member Joined Team', email: true, inApp: true, voiceAgent: false, sms: false, webhook: false },
      { id: 'workflow-shared', name: 'Workflow Shared with You', email: true, inApp: true, voiceAgent: false, sms: false, webhook: false },
    ]
  },
];

// Simple icon component to replace Heroicons
const Icon = ({ name, className }) => {
  // Only render the full content on the client side to avoid React version conflicts
  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-64 bg-gray-300 rounded mb-4"></div>
          <div className="h-6 w-96 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`icon-placeholder ${name} ${className || ''}`}>
      <span className="sr-only">{name}</span>
    </div>
  );
};

export default function NotificationSettings() {
  // Use client-side only rendering to avoid hydration mismatches
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  // State for notification channels
  const [channels, setChannels] = useState(mockNotificationChannels);
  
  // State for notification types
  const [notificationTypes, setNotificationTypes] = useState(mockNotificationTypes);
  
  // State for phone number (for SMS notifications)
  const [phoneNumber, setPhoneNumber] = useState('');
  
  // State for webhook URL
  const [webhookUrl, setWebhookUrl] = useState('');
  
  // State for digest preferences
  const [digestPreference, setDigestPreference] = useState('immediate');
  
  // State for do not disturb settings
  const [dndEnabled, setDndEnabled] = useState(false);
  const [dndStartTime, setDndStartTime] = useState('22:00');
  const [dndEndTime, setDndEndTime] = useState('08:00');
  
  // State for showing the configuration sections for each channel
  const [showChannelConfig, setShowChannelConfig] = useState({
    sms: false,
    webhook: false,
  });
  
  // State for showing the test channel modal
  const [showTestModal, setShowTestModal] = useState(false);
  const [testChannelId, setTestChannelId] = useState<string | null>(null);
  const [isSendingTest, setIsSendingTest] = useState(false);
  
  // Handle channel toggle
  const handleChannelToggle = (channelId: string) => {
    setChannels(
      channels.map(channel => 
        channel.id === channelId 
          ? { ...channel, enabled: !channel.enabled } 
          : channel
      )
    );
    
    // Show configuration section if enabling the channel
    if (channelId === 'sms' || channelId === 'webhook') {
      const channel = channels.find(c => c.id === channelId);
      if (!channel?.enabled) {
        setShowChannelConfig({
          ...showChannelConfig,
          [channelId]: true
        });
      }
    }
  };
  
  // Handle notification type toggle
  const handleNotificationTypeToggle = (categoryIndex: number, typeIndex: number, channelKey: string) => {
    const updatedTypes = [...notificationTypes];
    const typeItem = updatedTypes[categoryIndex].types[typeIndex];
    typeItem[channelKey as keyof typeof typeItem] = !typeItem[channelKey as keyof typeof typeItem];
    setNotificationTypes(updatedTypes);
  };
  
  // Handle category toggle (enable/disable all notifications in a category for a channel)
  const handleCategoryToggle = (categoryIndex: number, channelKey: string) => {
    const updatedTypes = [...notificationTypes];
    const category = updatedTypes[categoryIndex];
    
    // Check if all notifications in this category are enabled for this channel
    const allEnabled = category.types.every(type => type[channelKey as keyof typeof type]);
    
    // Toggle all to the opposite state
    category.types.forEach(type => {
      type[channelKey as keyof typeof type] = !allEnabled;
    });
    
    setNotificationTypes(updatedTypes);
  };
  
  // Handle save preferences
  const handleSavePreferences = () => {
    // In a real implementation, this would call an API to save the notification preferences
    alert('Notification preferences saved successfully!');
  };
  
  // Handle test notification
  const handleTestNotification = (channelId: string) => {
    setTestChannelId(channelId);
    setShowTestModal(true);
  };
  
  // Send test notification
  const sendTestNotification = () => {
    setIsSendingTest(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSendingTest(false);
      setShowTestModal(false);
      alert(`Test notification sent to ${testChannelId} channel.`);
    }, 1500);
  };
  
  // Get channel enabled state
  const isChannelEnabled = (channelId: string) => {
    return channels.find(channel => channel.id === channelId)?.enabled || false;
  };
  
  // Check if a channel has any notifications enabled
  const hasEnabledNotifications = (channelKey: string) => {
    return notificationTypes.some(category => 
      category.types.some(type => type[channelKey as keyof typeof type])
    );
  };
  
  return (
    <div>
      <h1 className="text-2xl font-bold text-[#22D3EE] mb-6">Notification Settings</h1>
      
      {/* Notification Channels */}
      <div className="bg-[#111111] border border-[#374151] rounded-lg p-5 mb-8">
        <h2 className="text-lg font-medium text-[#E5E7EB] mb-4">Notification Channels</h2>
        <p className="text-[#9CA3AF] mb-6">
          Choose how you'd like to receive notifications from Optiflow.
        </p>
        
        <div className="space-y-4">
          {channels.map((channel) => (
            <div key={channel.id} className="flex flex-col">
              <div className="flex items-center justify-between p-4 bg-[#18181B] rounded-lg">
                <div className="flex items-center">
                  <div className={`p-2 rounded-md mr-3 ${
                    channel.enabled ? 'bg-[#022c22] text-[#22D3EE]' : 'bg-[#1E293B] text-[#9CA3AF]'
                  }`}>
                    <channel.icon className="h-5 w-5" />
                  </div>
                  
                  <div>
                    <div className="flex items-center">
                      <span className="font-medium text-[#E5E7EB]">{channel.name}</span>
                      {channel.beta && (
                        <span className="ml-2 px-2 py-0.5 text-xs bg-[#422006] text-[#F59E0B] rounded-full">
                          Beta
                        </span>
                      )}
                      {channel.advanced && (
                        <span className="ml-2 px-2 py-0.5 text-xs bg-[#1E293B] text-[#9CA3AF] rounded-full">
                          Advanced
                        </span>
                      )}
                    </div>
                    {hasEnabledNotifications(channel.id) && channel.enabled ? (
                      <p className="text-xs text-[#9CA3AF]">
                        {notificationTypes.reduce(
                          (count, category) => count + category.types.filter(type => type[channel.id as keyof typeof type]).length, 
                          0
                        )} notifications enabled
                      </p>
                    ) : (
                      <p className="text-xs text-[#9CA3AF]">
                        {channel.enabled ? 'No notifications enabled' : 'Channel disabled'}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center">
                  {channel.enabled && (
                    <button
                      onClick={() => handleTestNotification(channel.id)}
                      className="mr-4 text-sm text-[#9CA3AF] hover:text-[#E5E7EB] transition-colors"
                    >
                      Test
                    </button>
                  )}
                  
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={channel.enabled}
                      onChange={() => handleChannelToggle(channel.id)}
                      className="sr-only peer"
                      aria-label={`Toggle ${channel.name}`}
                      title={`Toggle ${channel.name}`}
                    />
                    <div className="w-11 h-6 bg-[#374151] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#22D3EE]"></div>
                  </label>
                </div>
              </div>
              
              {/* SMS Configuration */}
              {channel.id === 'sms' && channel.enabled && showChannelConfig.sms && (
                <div className="mt-2 p-4 bg-[#1E293B] rounded-lg border border-t-0 border-[#374151]">
                  <h3 className="text-sm font-medium text-[#E5E7EB] mb-2">SMS Configuration</h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="phoneNumber" className="block text-xs text-[#9CA3AF] mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phoneNumber"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+1 (555) 123-4567"
                        aria-label="Phone Number for SMS notifications"
                        title="Phone Number for SMS notifications"
                        className="w-full px-3 py-2 bg-[#111111] border border-[#374151] rounded-md text-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#22D3EE] focus:border-transparent"
                      />
                      <p className="mt-1 text-xs text-[#9CA3AF]">
                        We'll send a verification code to confirm your phone number.
                      </p>
                    </div>
                    
                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => setShowChannelConfig({ ...showChannelConfig, sms: false })}
                        className="px-4 py-2 bg-[#22D3EE] text-[#111111] font-medium rounded-md hover:bg-[#06B6D4] transition-colors"
                      >
                        Verify Phone Number
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Webhook Configuration */}
              {channel.id === 'webhook' && channel.enabled && showChannelConfig.webhook && (
                <div className="mt-2 p-4 bg-[#1E293B] rounded-lg border border-t-0 border-[#374151]">
                  <h3 className="text-sm font-medium text-[#E5E7EB] mb-2">Webhook Configuration</h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="webhookUrl" className="block text-xs text-[#9CA3AF] mb-1">
                        Webhook URL
                      </label>
                      <input
                        type="url"
                        id="webhookUrl"
                        value={webhookUrl}
                        onChange={(e) => setWebhookUrl(e.target.value)}
                        placeholder="https://your-server.com/webhook"
                        className="w-full px-3 py-2 bg-[#111111] border border-[#374151] rounded-md text-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#22D3EE] focus:border-transparent"
                      />
                      <p className="mt-1 text-xs text-[#9CA3AF]">
                        We'll send a JSON payload to this URL when notifications occur.
                      </p>
                    </div>
                    
                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => setShowChannelConfig({ ...showChannelConfig, webhook: false })}
                        className="px-4 py-2 bg-[#22D3EE] text-[#111111] font-medium rounded-md hover:bg-[#06B6D4] transition-colors"
                      >
                        Save Webhook URL
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Digest Options */}
      <div className="bg-[#111111] border border-[#374151] rounded-lg p-5 mb-8">
        <h2 className="text-lg font-medium text-[#E5E7EB] mb-4">Digest Options</h2>
        <p className="text-[#9CA3AF] mb-6">
          Choose how often you'd like to receive grouped notifications from Optiflow.
        </p>
        
        <div className="space-y-3">
          <div className="flex items-center">
            <input
              type="radio"
              id="digest-immediate"
              name="digest"
              value="immediate"
              checked={digestPreference === 'immediate'}
              onChange={() => setDigestPreference('immediate')}
              className="h-4 w-4 text-[#22D3EE] bg-[#111111] border-[#374151] focus:ring-[#22D3EE]"
            />
            <label htmlFor="digest-immediate" className="ml-2 block text-[#E5E7EB]">
              Immediate (send notifications as they occur)
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="radio"
              id="digest-daily"
              name="digest"
              value="daily"
              checked={digestPreference === 'daily'}
              onChange={() => setDigestPreference('daily')}
              className="h-4 w-4 text-[#22D3EE] bg-[#111111] border-[#374151] focus:ring-[#22D3EE]"
            />
            <label htmlFor="digest-daily" className="ml-2 block text-[#E5E7EB]">
              Daily Digest (one email per day with all notifications)
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="radio"
              id="digest-weekly"
              name="digest"
              value="weekly"
              checked={digestPreference === 'weekly'}
              onChange={() => setDigestPreference('weekly')}
              className="h-4 w-4 text-[#22D3EE] bg-[#111111] border-[#374151] focus:ring-[#22D3EE]"
            />
            <label htmlFor="digest-weekly" className="ml-2 block text-[#E5E7EB]">
              Weekly Digest (one email per week with all notifications)
            </label>
          </div>
        </div>
        
        <div className="mt-4 p-3 rounded bg-[#1E293B] flex items-start">
          <Icon name="information-circle-" className="h-5 w-5 text-[#9CA3AF] flex-shrink-0 mt-0.5 mr-2" />
          <p className="text-xs text-[#9CA3AF]">
            Digest options apply to email notifications only. In-app and other notifications will still be delivered immediately.
            Critical security notifications will always be sent immediately regardless of your digest preference.
          </p>
        </div>
      </div>
      
      {/* Do Not Disturb */}
      <div className="bg-[#111111] border border-[#374151] rounded-lg p-5 mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-medium text-[#E5E7EB]">Do Not Disturb</h2>
            <p className="text-[#9CA3AF] mt-1">
              Temporarily pause all notifications during specified hours.
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={dndEnabled}
              onChange={() => setDndEnabled(!dndEnabled)}
              className="sr-only peer"
              aria-label="Toggle Do Not Disturb mode"
              title="Toggle Do Not Disturb mode"
            />
            <div className="w-11 h-6 bg-[#374151] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#22D3EE]"></div>
          </label>
        </div>
        
        {dndEnabled && (
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label htmlFor="dndStartTime" className="block text-sm text-[#9CA3AF] mb-1">
                Start Time
              </label>
              <input
                type="time"
                id="dndStartTime"
                value={dndStartTime}
                onChange={(e) => setDndStartTime(e.target.value)}
                aria-label="Do Not Disturb Start Time"
                title="Do Not Disturb Start Time"
                className="w-full px-3 py-2 bg-[#111111] border border-[#374151] rounded-md text-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#22D3EE] focus:border-transparent"
              />
            </div>
            
            <div>
              <label htmlFor="dndEndTime" className="block text-sm text-[#9CA3AF] mb-1">
                End Time
              </label>
              <input
                type="time"
                id="dndEndTime"
                value={dndEndTime}
                onChange={(e) => setDndEndTime(e.target.value)}
                aria-label="Do Not Disturb End Time"
                title="Do Not Disturb End Time"
                className="w-full px-3 py-2 bg-[#111111] border border-[#374151] rounded-md text-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#22D3EE] focus:border-transparent"
              />
            </div>
          </div>
        )}
        
        {dndEnabled && (
          <div className="mt-4 p-3 rounded bg-[#1E293B] flex items-start">
            <Icon name="information-circle-" className="h-5 w-5 text-[#9CA3AF] flex-shrink-0 mt-0.5 mr-2" />
            <p className="text-xs text-[#9CA3AF]">
              Critical security notifications will still be delivered even during Do Not Disturb hours.
            </p>
          </div>
        )}
      </div>
      
      {/* Notification Type Preferences */}
      <div className="bg-[#111111] border border-[#374151] rounded-lg p-5 mb-8">
        <h2 className="text-lg font-medium text-[#E5E7EB] mb-4">Notification Types</h2>
        <p className="text-[#9CA3AF] mb-6">
          Choose which notifications you'd like to receive for each channel.
        </p>
        
        {notificationTypes.map((category, categoryIndex) => (
          <div key={category.category} className="mb-8 last:mb-0">
            <h3 className="text-[#E5E7EB] font-medium mb-3">{category.category}</h3>
            
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-[#1E293B]">
                  <tr>
                    <th className="py-3 px-4 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider w-1/3">
                      Notification
                    </th>
                    {channels.map((channel) => (
                      <th key={channel.id} className="py-3 px-2 text-center text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">
                        <div className="flex flex-col items-center">
                          <channel.icon className="h-4 w-4 mb-1" />
                          <span>{channel.name.split(' ')[0]}</span>
                          
                          {/* Category toggle */}
                          {channel.enabled && (
                            <div className="mt-1">
                              <button
                                onClick={() => handleCategoryToggle(categoryIndex, channel.id)}
                                className="text-[#22D3EE] hover:text-[#06B6D4] text-xs transition-colors"
                                title={`Toggle all ${category.category} notifications for ${channel.name}`}
                              >
                                Toggle all
                              </button>
                            </div>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#374151]">
                  {category.types.map((type, typeIndex) => (
                    <tr key={type.id} className="hover:bg-[#1E293B] transition-colors">
                      <td className="py-3 px-4 text-sm text-[#E5E7EB]">
                        {type.name}
                      </td>
                      
                      {channels.map((channel) => (
                        <td key={`${type.id}-${channel.id}`} className="py-3 px-2 text-center">
                          <div className="flex justify-center">
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={type[channel.id as keyof typeof type] as boolean}
                                onChange={() => handleNotificationTypeToggle(categoryIndex, typeIndex, channel.id)}
                                disabled={!channel.enabled}
                                className="sr-only peer"
                                aria-label={`Toggle ${type.name} notification for ${channel.name}`}
                                title={`Toggle ${type.name} notification for ${channel.name}`}
                              />
                              <div className={`w-8 h-4 ${channel.enabled ? 'bg-[#374151]' : 'bg-[#1E293B] cursor-not-allowed'} peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#22D3EE]`}></div>
                            </label>
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
      
      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSavePreferences}
          className="px-6 py-2 bg-[#22D3EE] text-[#111111] font-medium rounded-md hover:bg-[#06B6D4] transition-colors"
        >
          Save Notification Preferences
        </button>
      </div>
      
      {/* Test Notification Modal */}
      {showTestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#18181B] rounded-lg p-6 max-w-md w-full border border-[#374151]">
            <h3 className="text-xl font-bold text-[#E5E7EB] mb-4">Send Test Notification</h3>
            
            <p className="text-[#9CA3AF] mb-6">
              This will send a test notification to the {channels.find(c => c.id === testChannelId)?.name} channel. Make sure your notification settings are properly configured.
            </p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowTestModal(false)}
                className="px-4 py-2 border border-[#374151] text-[#9CA3AF] rounded-md hover:text-[#E5E7EB] hover:border-[#6B7280] transition-colors"
                disabled={isSendingTest}
              >
                Cancel
              </button>
              <button
                onClick={sendTestNotification}
                className="px-4 py-2 bg-[#22D3EE] text-[#111111] font-medium rounded-md hover:bg-[#06B6D4] transition-colors flex items-center"
                disabled={isSendingTest}
              >
                {isSendingTest && <Icon name="arrow-path-" className="h-4 w-4 mr-2 animate-spin" />}
                {isSendingTest ? 'Sending...' : 'Send Test Notification'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 