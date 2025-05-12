'use client';


// Force dynamic rendering to avoid static generation issues
export const dynamic = 'force-dynamic';
// Disable cache to avoid static rendering issues
export const revalidate = 0;

import './page.css';
// Heroicons removed to prevent React version conflicts
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { ThemeType, useThemeStore } from '@/lib/themeStore';
import { useUserStore } from '@/lib/userStore';

interface UserSettings {
  notifications: {
  email: boolean;
  browser: boolean;
  workflow: boolean;
  security: boolean;
      };
  apiSettings: {
  defaultRequestTimeout: number;
  rateLimit: number;
      };
  displaySettings: {
  compactMode: boolean;
  showAdvancedOptions: boolean;
      }
}

// Setting sections data
const settingSections = [
  {
    id: 'profile',
    name: 'Profile Settings',
    description: 'Manage your personal information, password, and active sessions',
    icon: UserCircleIconOutline,
    href: '/settings/profile',
    color: 'bg-[#134e4a]',
    iconColor: 'text-[#22D3EE]'
  },
  {
    id: 'organization',
    name: 'Organization Settings',
    description: 'Manage organization profile, members, and roles',
    icon: BuildingOffice2IconOutline,
    href: '/settings/organization',
    color: 'bg-[#1e1b4b]',
    iconColor: 'text-[#A855F7]'
  },
  {
    id: 'notifications',
    name: 'Notification Preferences',
    description: 'Configure how and when you receive notifications',
    icon: BellIconOutline,
    href: '/settings/notifications',
    color: 'bg-[#422006]',
    iconColor: 'text-[#F59E0B]'
  },
  {
    id: 'api-keys',
    name: 'API Keys',
    description: 'Generate and manage API keys for programmatic access',
    icon: KeyIconOutline,
    href: '/settings/api-keys',
    color: 'bg-[#0f172a]',
    iconColor: 'text-[#60A5FA]'
  },
  {
    id: 'security',
    name: 'Security Center',
    description: 'Protect your account with security features and monitoring',
    icon: ShieldCheckIconOutline,
    href: '/settings/security',
    color: 'bg-[#022c22]',
    iconColor: 'text-[#10B981]'
  },
  {
    id: 'data',
    name: 'Data & Privacy',
    description: 'Manage your data, export options, and account deletion',
    icon: DocumentTextIconOutline,
    href: '/settings/data',
    color: 'bg-[#3f0d0d]',
    iconColor: 'text-[#F87171]'
  }
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

export default function SettingsPage() {
  // Use client-side only rendering to avoid hydration mismatches
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  const router = useRouter();
  const { currentUser } = useUserStore();
  const { theme, setTheme } = useThemeStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState<UserSettings>({
    notifications: {
  email: true,
      browser: true,
      workflow: true,
      security: true
        },
    apiSettings: {
  defaultRequestTimeout: 30,
      rateLimit: 100
        },
    displaySettings: {
  compactMode: false,
      showAdvancedOptions: false
        }
  });

  // Load settings from localStorage on mount
  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
      return;
    }
    
    try {
      const savedSettings = localStorage.getItem('user-settings');
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        // Update only the displaySettings from localStorage
        setSettings(prevSettings => ({
          ...prevSettings,
          displaySettings: {
            ...prevSettings.displaySettings,
            ...parsedSettings
          }
        }));
      }
    } catch (e) { console.error('Error loading settings:', e);
        }
    
    setIsLoading(false);
  }, [currentUser, router]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTheme(e.target.value as ThemeType);
  };

  const handleNotificationToggle = (key: keyof UserSettings['notifications']) => {
    setSettings({
      ...settings,
      notifications: { ...settings.notifications,
        [key]: !settings.notifications[key]
          }
    });
  };

  const handleApiSettingChange = (e: React.ChangeEvent<HTMLInputElement>, key: keyof UserSettings['apiSettings']) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      setSettings({
        ...settings,
        apiSettings: { ...settings.apiSettings,
          [key]: value
            }
      });
    }
  };

  const handleDisplaySettingToggle = (key: keyof UserSettings['displaySettings']) => {
    // Toggle the setting
    const newSettings = {
      ...settings,
      displaySettings: { ...settings.displaySettings,
        [key]: !settings.displaySettings[key]
          }
    };
    
    // Update the state
    setSettings(newSettings);
    
    // Save to localStorage
    try {
      localStorage.setItem('user-settings', JSON.stringify(newSettings.displaySettings));
      
      // Dispatch storage event to notify other components
      window.dispatchEvent(new Event('storage'));
      
      // Show a temporary toast notification
      toast.success(`${ key === 'compactMode' ? 'Compact Mode' : 'Advanced Options'    } ${ newSettings.displaySettings[key] ? 'enabled' : 'disabled'    }`);
    } catch (e) { console.error('Error saving settings:', e);
      toast.error('Failed to save display settings');
        }
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    
    try {
      // Save all settings to localStorage
      localStorage.setItem('user-settings', JSON.stringify(settings.displaySettings));
      
      // In a real app, this would send settings to an API
      // Simulate an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Dispatch storage event to notify other components
      window.dispatchEvent(new Event('storage'));
      
      toast.success('Settings saved successfully');
    } catch (error) { console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
        } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading-pulse gradient-text text-xl">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="pb-8">
      {/* Neural Network Background */}
      <div className="neural-bg"></div>
      
      <main className="max-w-4xl mx-auto px-4 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20     }}
          animate={{ opacity: 1, y: 0     }}
          transition={{ duration: 0.5     }}
        >
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold gradient-text mb-2">
                Settings
              </h1>
              <p className="text-white/70 dark:text-white/70 light:text-gray-600">
                Manage your account, organization, security, and preferences
              </p>
            </div>
            <Link href="/dashboard" className="px-4 py-2 text-white/80 dark:text-white/80 light:text-gray-700 bg-white/5 dark:bg-white/5 light:bg-black/5 hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-black/10 rounded-lg border border-white/10 dark:border-white/10 light:border-black/10 transition-all duration-300">
              Back to Dashboard
            </Link>
          </div>
          
          {/* Settings Sections */}
          <div className="space-y-6">
            {/* General Settings */}
            <div className="bg-dark-100/30 backdrop-blur-sm rounded-xl p-6">
              <h2 className="text-xl font-semibold dark:text-white light:text-gray-800 mb-4">General Settings</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="theme-select" className="block dark:text-white/80 light:text-gray-700 text-sm mb-2">Theme</label>
                  <select
                    id="theme-select"
                    value={theme}
                    onChange={handleThemeChange}
                    className="w-full md:w-1/3 dark:bg-black/30 light:bg-white/70 rounded-lg px-4 py-3 dark:text-white light:text-gray-800"
                    aria-label="Select Theme"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="system">System Default</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* Notification Settings */}
            <div className="bg-dark-100/30 backdrop-blur-sm rounded-xl p-6">
              <h2 className="text-xl font-semibold dark:text-white light:text-gray-800 mb-4">Notification Settings</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="dark:text-white light:text-gray-800 font-medium">Email Notifications</h3>
                    <p className="dark:text-white/60 light:text-gray-500 text-sm">Receive updates via email</p>
                  </div>
                  <button 
                    onClick={() => handleNotificationToggle('email')}
                    aria-label={settings.notifications.email ? "Disable Email Notifications" : "Enable Email Notifications"}
                    className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${ settings.notifications.email ? 'bg-primary' : 'dark:bg-white/20 light:bg-gray-300'
                        }`}
                  >
                    <span 
                      className={`absolute top-1 left-1 bg-white rounded-full w-4 h-4 transition-transform duration-300 transform ${ settings.notifications.email ? 'translate-x-6' : ''
                          }`}
                    ></span>
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="dark:text-white light:text-gray-800 font-medium">Browser Notifications</h3>
                    <p className="dark:text-white/60 light:text-gray-500 text-sm">Receive in-app notifications</p>
                  </div>
                  <button 
                    onClick={() => handleNotificationToggle('browser')}
                    aria-label={settings.notifications.browser ? "Disable Browser Notifications" : "Enable Browser Notifications"}
                    className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${ settings.notifications.browser ? 'bg-primary' : 'dark:bg-white/20 light:bg-gray-300'
                        }`}
                  >
                    <span 
                      className={`absolute top-1 left-1 bg-white rounded-full w-4 h-4 transition-transform duration-300 transform ${ settings.notifications.browser ? 'translate-x-6' : ''
                          }`}
                    ></span>
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="dark:text-white light:text-gray-800 font-medium">Workflow Alerts</h3>
                    <p className="dark:text-white/60 light:text-gray-500 text-sm">Get notified about workflow status changes</p>
                  </div>
                  <button 
                    onClick={() => handleNotificationToggle('workflow')}
                    aria-label={settings.notifications.workflow ? "Disable Workflow Alerts" : "Enable Workflow Alerts"}
                    className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${ settings.notifications.workflow ? 'bg-primary' : 'dark:bg-white/20 light:bg-gray-300'
                        }`}
                  >
                    <span 
                      className={`absolute top-1 left-1 bg-white rounded-full w-4 h-4 transition-transform duration-300 transform ${ settings.notifications.workflow ? 'translate-x-6' : ''
                          }`}
                    ></span>
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="dark:text-white light:text-gray-800 font-medium">Security Alerts</h3>
                    <p className="dark:text-white/60 light:text-gray-500 text-sm">Get notified about security-related events</p>
                  </div>
                  <button 
                    onClick={() => handleNotificationToggle('security')}
                    aria-label={settings.notifications.security ? "Disable Security Alerts" : "Enable Security Alerts"}
                    className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${ settings.notifications.security ? 'bg-primary' : 'dark:bg-white/20 light:bg-gray-300'
                        }`}
                  >
                    <span 
                      className={`absolute top-1 left-1 bg-white rounded-full w-4 h-4 transition-transform duration-300 transform ${ settings.notifications.security ? 'translate-x-6' : ''
                          }`}
                    ></span>
                  </button>
                </div>
              </div>
            </div>
            
            {/* API Settings */}
            <div className="bg-dark-100/30 backdrop-blur-sm rounded-xl p-6">
              <h2 className="text-xl font-semibold dark:text-white light:text-gray-800 mb-4">API Settings</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="defaultRequestTimeout" className="block dark:text-white/80 light:text-gray-700 text-sm mb-2">Default Request Timeout (seconds)</label>
                  <input
                    id="defaultRequestTimeout"
                    type="number"
                    value={settings.apiSettings.defaultRequestTimeout}
                    onChange={(e) => handleApiSettingChange(e, 'defaultRequestTimeout')}
                    min="5"
                    max="120"
                    placeholder="e.g., 30"
                    className="w-full dark:bg-black/30 light:bg-white/70 rounded-lg px-4 py-3 dark:text-white light:text-gray-800"
                  />
                </div>
                
                <div>
                  <label htmlFor="rateLimit" className="block dark:text-white/80 light:text-gray-700 text-sm mb-2">Rate Limit (requests per minute)</label>
                  <input
                    id="rateLimit"
                    type="number"
                    value={settings.apiSettings.rateLimit}
                    onChange={(e) => handleApiSettingChange(e, 'rateLimit')}
                    min="10"
                    max="1000"
                    placeholder="e.g., 100"
                    className="w-full dark:bg-black/30 light:bg-white/70 rounded-lg px-4 py-3 dark:text-white light:text-gray-800"
                  />
                </div>
              </div>
            </div>
            
            {/* Display Settings */}
            <div className="bg-dark-100/30 backdrop-blur-sm rounded-xl p-6">
              <h2 className="text-xl font-semibold dark:text-white light:text-gray-800 mb-4">Display Settings</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="dark:text-white light:text-gray-800 font-medium">Compact Mode</h3>
                    <p className="dark:text-white/60 light:text-gray-500 text-sm">Use more condensed UI elements</p>
                  </div>
                  <button 
                    onClick={() => handleDisplaySettingToggle('compactMode')}
                    aria-label={settings.displaySettings.compactMode ? "Disable Compact Mode" : "Enable Compact Mode"}
                    className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${ settings.displaySettings.compactMode ? 'bg-primary' : 'dark:bg-white/20 light:bg-gray-300'
                        }`}
                  >
                    <span 
                      className={`absolute top-1 left-1 bg-white rounded-full w-4 h-4 transition-transform duration-300 transform ${ settings.displaySettings.compactMode ? 'translate-x-6' : ''
                          }`}
                    ></span>
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="dark:text-white light:text-gray-800 font-medium">Show Advanced Options</h3>
                    <p className="dark:text-white/60 light:text-gray-500 text-sm">Display advanced configuration options</p>
                  </div>
                  <button 
                    onClick={() => handleDisplaySettingToggle('showAdvancedOptions')}
                    aria-label={settings.displaySettings.showAdvancedOptions ? "Disable Advanced Options" : "Enable Advanced Options"}
                    className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${ settings.displaySettings.showAdvancedOptions ? 'bg-primary' : 'dark:bg-white/20 light:bg-gray-300'
                        }`}
                  >
                    <span 
                      className={`absolute top-1 left-1 bg-white rounded-full w-4 h-4 transition-transform duration-300 transform ${ settings.displaySettings.showAdvancedOptions ? 'translate-x-6' : ''
                          }`}
                    ></span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Save Button */}
          <div className="mt-8 flex justify-end">
            <button
              onClick={handleSaveSettings}
              disabled={isSaving}
              className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-medium shadow-glow hover:shadow-glow-intense transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              { isSaving ? 'Saving...' : 'Save Settings'    }
            </button>
          </div>
        </motion.div>
      </main>
    </div>
  );
} 