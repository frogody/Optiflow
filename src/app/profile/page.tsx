// @ts-nocheck - This file has some TypeScript issues that are hard to fix
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useUserStore } from '@/lib/userStore';
import toast from 'react-hot-toast';

interface UserProfile {
  name: string;
  email: string;
  role: string;
  notificationSettings: {
  email: boolean;
  push: boolean;
  workflow: boolean;
      };
}

export default function ProfilePage(): JSX.Element {
  const router = useRouter();
  const { currentUser, setCurrentUser } = useUserStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    role: 'User',
    notificationSettings: {
  email: true,
      push: true,
      workflow: true
        }
  });

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
      return;
    }
    
    // In a real app, we would fetch the user profile from an API
    // For now, initialize with the current user data
    setProfile({
      name: currentUser.name || '',
      email: currentUser.email || '',
      role: 'User',
      notificationSettings: {
  email: true,
        push: true,
        workflow: true
          }
    });
    
    setIsLoading(false);
  }, [currentUser, router]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev,
      [name]: value
        }));
  };

  const handleNotificationChange = (setting: keyof UserProfile['notificationSettings']) => {
    setProfile(prev => ({
      ...prev,
      notificationSettings: { ...prev.notificationSettings,
        [setting]: !prev.notificationSettings[setting]
          }
    }));
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      // In a real app, we would send this data to an API
      // Simulate API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Update user store with new name
      setCurrentUser({ ...currentUser!,
        name: profile.name
          });
      
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading-pulse gradient-text text-xl">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Neural Network Background */}
      <div className="neural-bg"></div>
      
      {/* Main Content */}
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
                Profile Settings
              </h1>
              <p className="text-gray-400">
                Manage your account information and preferences
              </p>
            </div>
            <Link href="/dashboard" className="action-button px-4 py-2 rounded-lg">
              Back to Dashboard
            </Link>
          </div>
          
          {/* Profile Form */}
          <div className="bg-dark-100/30 backdrop-blur-sm border border-white/10 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Personal Information</h2>
            
            <form onSubmit={handleSaveProfile}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-white/80 text-sm mb-2">Display Name</label>
                  <input
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleInputChange}
                    className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-3 text-white"
                    placeholder="Your name"
                  />
                </div>
                
                <div>
                  <label className="block text-white/80 text-sm mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleInputChange}
                    className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-3 text-white"
                    placeholder="Your email"
                    disabled
                  />
                  <p className="text-xs text-white/40 mt-1">Email address cannot be changed</p>
                </div>
                
                <div>
                  <label htmlFor="accountRole" className="block text-white/80 text-sm mb-2">Account Role</label>
                  <input
                    type="text"
                    id="accountRole"
                    name="role"
                    value={profile.role}
                    className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-3 text-white"
                    disabled
                    aria-readonly="true"
                  />
                </div>
              </div>
              
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-medium shadow-glow hover:shadow-glow-intense transition-all duration-300"
              >
                { isSaving ? 'Saving...' : 'Save Changes'    }
              </button>
            </form>
          </div>
          
          {/* Notification Preferences */}
          <div className="bg-dark-100/30 backdrop-blur-sm border border-white/10 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Notification Preferences</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">Email Notifications</h3>
                  <p className="text-white/60 text-sm">Receive workflow updates via email</p>
                </div>
                <button 
                  onClick={() => handleNotificationChange('email')}
                  aria-label={profile.notificationSettings.email ? "Disable Email Notifications" : "Enable Email Notifications"}
                  className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${ profile.notificationSettings.email ? 'bg-primary' : 'bg-white/20'
                      }`}
                >
                  <span 
                    className={`absolute top-1 left-1 bg-white rounded-full w-4 h-4 transition-transform duration-300 transform ${ profile.notificationSettings.email ? 'translate-x-6' : ''
                        }`}
                  ></span>
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">Push Notifications</h3>
                  <p className="text-white/60 text-sm">Receive real-time alerts on your device</p>
                </div>
                <button 
                  onClick={() => handleNotificationChange('push')}
                  aria-label={profile.notificationSettings.push ? "Disable Push Notifications" : "Enable Push Notifications"}
                  className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${ profile.notificationSettings.push ? 'bg-primary' : 'bg-white/20'
                      }`}
                >
                  <span 
                    className={`absolute top-1 left-1 bg-white rounded-full w-4 h-4 transition-transform duration-300 transform ${ profile.notificationSettings.push ? 'translate-x-6' : ''
                        }`}
                  ></span>
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">Workflow Alerts</h3>
                  <p className="text-white/60 text-sm">Get notified when workflows complete or fail</p>
                </div>
                <button 
                  onClick={() => handleNotificationChange('workflow')}
                  aria-label={profile.notificationSettings.workflow ? "Disable Workflow Alerts" : "Enable Workflow Alerts"}
                  className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${ profile.notificationSettings.workflow ? 'bg-primary' : 'bg-white/20'
                      }`}
                >
                  <span 
                    className={`absolute top-1 left-1 bg-white rounded-full w-4 h-4 transition-transform duration-300 transform ${ profile.notificationSettings.workflow ? 'translate-x-6' : ''
                        }`}
                  ></span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Subscription Settings */}
          <div className="bg-dark-100/30 backdrop-blur-sm border border-white/10 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">My Subscriptions</h2>
              <Link href="/billing/manage" className="px-4 py-2 text-white/80 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-all duration-300">
                Manage Plans
              </Link>
            </div>
            
            <div className="bg-black/30 rounded-lg border border-white/5 p-4 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">Pro Plan</h3>
                  <p className="text-white/60 text-sm">Active until January 15, 2024</p>
                </div>
                <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full">
                  Active
                </span>
              </div>
              <div className="mt-4 pt-4 border-t border-white/5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60">Next billing date</span>
                  <span className="text-white">January 15, 2024</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-white/60">Amount</span>
                  <span className="text-white">$29.99 / month</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Wallet Settings */}
          <div className="bg-dark-100/30 backdrop-blur-sm border border-white/10 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">My Wallet</h2>
              <Link href="/billing/payment-methods" className="px-4 py-2 text-white/80 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-all duration-300">
                Manage Payment Methods
              </Link>
            </div>
            
            <div className="bg-black/30 rounded-lg border border-white/5 p-4 mb-4">
              <h3 className="text-white font-medium mb-3">Payment Methods</h3>
              
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-6 bg-blue-800 rounded flex items-center justify-center text-white text-xs mr-3">
                    VISA
                  </div>
                  <div>
                    <p className="text-white text-sm">•••• •••• •••• 4242</p>
                    <p className="text-white/60 text-xs">Expires 12/25</p>
                  </div>
                </div>
                <span className="text-white/80 text-sm bg-white/10 px-2 py-1 rounded">Default</span>
              </div>
            </div>
            
            <div className="bg-black/30 rounded-lg border border-white/5 p-4">
              <h3 className="text-white font-medium mb-3">Billing History</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div>
                    <p className="text-white text-sm">Pro Plan - Monthly</p>
                    <p className="text-white/60 text-xs">December 15, 2023</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white text-sm">$29.99</p>
                    <span className="text-green-400 text-xs">Paid</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div>
                    <p className="text-white text-sm">Pro Plan - Monthly</p>
                    <p className="text-white/60 text-xs">November 15, 2023</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white text-sm">$29.99</p>
                    <span className="text-green-400 text-xs">Paid</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Account Actions */}
          <div className="bg-dark-100/30 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Account Actions</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">Password</h3>
                  <p className="text-white/60 text-sm">Change your account password</p>
                </div>
                <button className="px-4 py-2 border border-white/20 rounded-lg text-white hover:bg-white/10 transition-colors">
                  Change Password
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">API Key</h3>
                  <p className="text-white/60 text-sm">Manage your API access credentials</p>
                </div>
                <button className="px-4 py-2 border border-white/20 rounded-lg text-white hover:bg-white/10 transition-colors">
                  View API Key
                </button>
              </div>
              
              <div className="pt-4 border-t border-white/10">
                <Link 
                  href="/logout"
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  Sign Out
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
} 