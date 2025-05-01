'use client';

import { useState } from 'react';
import { Switch } from '@headlessui/react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  HiOutlineBell,
  HiOutlineShieldCheck,
  HiOutlineLink,
  HiOutlineUserCircle,
  HiOutlineLockClosed,
  HiOutlineGlobe,
} from 'react-icons/hi';

export default function AccountSettingsPage() {
  const [emailNotifications, setEmailNotifications] = useState({
    workflow_updates: true,
    security_alerts: true,
    newsletter: false,
    marketing: false,
  });

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState('30');

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
          Account Settings
        </h1>
        <p className="mt-2 text-gray-400">
          Manage your account preferences and security settings
        </p>
      </motion.div>

      <div className="space-y-8">
        {/* Email Preferences */}
        <motion.section 
          className="relative group"
          {...fadeInUp}
        >
          <div className="absolute -inset-[1px] rounded-lg bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur group-hover:opacity-100 transition duration-500 opacity-50" />
          <div className="relative bg-gray-900/60 backdrop-blur-sm rounded-lg p-6 border border-gray-800/50">
            <div className="flex items-center mb-4">
              <HiOutlineBell className="w-6 h-6 text-blue-500 mr-3" />
              <h2 className="text-xl font-medium text-white">Email Preferences</h2>
            </div>
            <div className="space-y-6">
              {Object.entries(emailNotifications).map(([key, enabled]) => (
                <div key={key} className="flex items-center justify-between group">
                  <div>
                    <h3 className="text-sm font-medium text-gray-200 capitalize group-hover:text-white transition-colors">
                      {key.replace('_', ' ')}
                    </h3>
                    <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                      {getNotificationDescription(key)}
                    </p>
                  </div>
                  <Switch
                    checked={enabled}
                    onChange={(value) => setEmailNotifications(prev => ({ ...prev, [key]: value }))}
                    className={cn(
                      enabled ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-gray-700',
                      'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900'
                    )}
                  >
                    <span
                      className={cn(
                        enabled ? 'translate-x-5' : 'translate-x-0',
                        'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out'
                      )}
                    />
                  </Switch>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Security Settings */}
        <motion.section 
          className="relative group"
          {...fadeInUp}
          transition={{ delay: 0.1 }}
        >
          <div className="absolute -inset-[1px] rounded-lg bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-red-500/20 blur group-hover:opacity-100 transition duration-500 opacity-50" />
          <div className="relative bg-gray-900/60 backdrop-blur-sm rounded-lg p-6 border border-gray-800/50">
            <div className="flex items-center mb-6">
              <HiOutlineShieldCheck className="w-6 h-6 text-purple-500 mr-3" />
              <h2 className="text-xl font-medium text-white">Security Settings</h2>
            </div>
            
            {/* Two-Factor Authentication */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <HiOutlineLockClosed className="w-5 h-5 text-purple-400 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-200">Two-Factor Authentication</h3>
                    <p className="text-sm text-gray-400">Add an extra layer of security to your account</p>
                  </div>
                </div>
                <Switch
                  checked={twoFactorEnabled}
                  onChange={setTwoFactorEnabled}
                  className={cn(
                    twoFactorEnabled ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gray-700',
                    'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900'
                  )}
                >
                  <span
                    className={cn(
                      twoFactorEnabled ? 'translate-x-5' : 'translate-x-0',
                      'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out'
                    )}
                  />
                </Switch>
              </div>
              {twoFactorEnabled && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 p-4 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20"
                >
                  <p className="text-sm text-purple-200">
                    Two-factor authentication is enabled. Use an authenticator app to generate codes.
                  </p>
                </motion.div>
              )}
            </div>

            {/* Session Settings */}
            <div>
              <div className="flex items-center mb-3">
                <HiOutlineGlobe className="w-5 h-5 text-purple-400 mr-3" />
                <h3 className="text-sm font-medium text-gray-200">Session Timeout</h3>
              </div>
              <p className="text-sm text-gray-400 mb-3 ml-8">
                Choose how long you want to stay logged in
              </p>
              <div className="relative ml-8">
                <select
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(e.target.value)}
                  className="w-full bg-gray-800/50 border border-gray-700 text-gray-200 rounded-lg py-2 pl-3 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 appearance-none hover:border-purple-400 transition-colors"
                >
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="240">4 hours</option>
                  <option value="480">8 hours</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Connected Accounts */}
        <motion.section 
          className="relative group"
          {...fadeInUp}
          transition={{ delay: 0.2 }}
        >
          <div className="absolute -inset-[1px] rounded-lg bg-gradient-to-r from-pink-500/20 via-red-500/20 to-orange-500/20 blur group-hover:opacity-100 transition duration-500 opacity-50" />
          <div className="relative bg-gray-900/60 backdrop-blur-sm rounded-lg p-6 border border-gray-800/50">
            <div className="flex items-center mb-6">
              <HiOutlineLink className="w-6 h-6 text-pink-500 mr-3" />
              <h2 className="text-xl font-medium text-white">Connected Accounts</h2>
            </div>
            <div className="space-y-4">
              {connectedAccounts.map((account) => (
                <div key={account.name} className="flex items-center justify-between py-3 border-b border-gray-800 last:border-0 group hover:bg-gray-800/30 rounded-lg px-4 transition-colors">
                  <div className="flex items-center">
                    <account.icon className="h-6 w-6 text-gray-400 group-hover:text-gray-300 transition-colors" aria-hidden="true" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors">{account.name}</p>
                      <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">{account.status}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className={cn(
                      account.connected
                        ? 'text-red-400 hover:text-red-300 hover:bg-red-400/10'
                        : 'text-blue-400 hover:text-blue-300 hover:bg-blue-400/10',
                      'text-sm font-medium px-3 py-1 rounded-md transition-colors'
                    )}
                  >
                    {account.connected ? 'Disconnect' : 'Connect'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Save Changes Button */}
        <motion.div 
          className="flex justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <button
            type="button"
            className="px-6 py-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 font-medium transition-all duration-200 transform hover:scale-105"
          >
            Save Changes
          </button>
        </motion.div>
      </div>
    </div>
  );
}

function getNotificationDescription(key: string): string {
  const descriptions: Record<string, string> = {
    workflow_updates: 'Get notified about changes and updates to your workflows',
    security_alerts: 'Receive alerts about security-related events and suspicious activities',
    newsletter: 'Stay updated with our monthly newsletter featuring tips and best practices',
    marketing: 'Receive occasional updates about new features and promotional offers',
  };
  return descriptions[key] || '';
}

const connectedAccounts = [
  {
    name: 'Google',
    status: 'Connected',
    connected: true,
    icon: (props: any) => (
      <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
      </svg>
    ),
  },
  {
    name: 'GitHub',
    status: 'Not connected',
    connected: false,
    icon: (props: any) => (
      <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    name: 'Slack',
    status: 'Connected',
    connected: true,
    icon: (props: any) => (
      <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path fillRule="evenodd" d="M19.712 10.907c.195.551-.097 1.16-.648 1.354l-2.193.778.715 2.136c.194.551-.097 1.16-.648 1.354-.551.195-1.16-.097-1.354-.648l-.715-2.136-4.04 1.436.715 2.136c.194.551-.097 1.16-.648 1.354-.551.195-1.16-.097-1.354-.648l-.715-2.136-2.193.778c-.551.195-1.16-.097-1.354-.648-.195-.551.097-1.16.648-1.354l2.193-.778-.715-2.136c-.194-.551.097-1.16.648-1.354.551-.195 1.16.097 1.354.648l.715 2.136 4.04-1.436-.715-2.136c-.194-.551.097-1.16.648-1.354.551-.195 1.16.097 1.354.648l.715 2.136 2.193-.778c.551-.195 1.16.097 1.354.648zM9.662 14.907l4.04-1.436-1.436-4.04-4.04 1.436 1.436 4.04z" clipRule="evenodd" />
      </svg>
    ),
  },
]; 