'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useUserStore } from '@/lib/userStore';
import { HiOutlineUser, HiOutlineCreditCard, HiOutlineKey, HiOutlineUsers, HiOutlineShieldCheck } from 'react-icons/hi';

// Import the new components
import ProfileAvatar from '@/components/profile/ProfileAvatar';
import ApiKeys from '@/components/profile/ApiKeys';
import TeamSettings from '@/components/profile/TeamSettings';
import Billing from '@/components/profile/Billing';
import Security from '@/components/profile/Security';

interface UserProfile {
  name: string;
  email: string;
  avatarUrl: string;
  role: string;
}

type ActiveTab = 'profile' | 'billing' | 'apiKey' | 'team' | 'security';

export default function ProfilePage() {
  const router = useRouter();
  const { currentUser, setCurrentUser } = useUserStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    avatarUrl: '',
    role: 'User',
  });
  const [activeTab, setActiveTab] = useState<ActiveTab>('profile');

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
      return;
    }
    
    setProfile({
      name: currentUser.name || '',
      email: currentUser.email || '',
      avatarUrl: currentUser.image || '',
      role: 'User', // Fetch this from API if available
    });
    
    setIsLoading(false);
  }, [currentUser, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (url: string) => {
    setProfile(prev => ({ ...prev, avatarUrl: url }));
    // Optionally, update user store
    setCurrentUser({ ...currentUser!, image: url });
    // TODO: Save avatar URL to backend
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      setCurrentUser({ ...currentUser!, name: profile.name, image: profile.avatarUrl });
      // TODO: Save profile to backend
      console.log('Profile saved:', profile);
    } catch (error) { console.error(error); } 
    finally { setIsSaving(false); }
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <form onSubmit={handleSaveProfile}>
            <ProfileAvatar 
              avatarUrl={profile.avatarUrl}
              name={profile.name}
              onAvatarChange={handleAvatarChange}
            />
            
            <div className="bg-dark-100/30 backdrop-blur-sm border border-white/10 rounded-xl p-6 mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-white/80 text-sm mb-2">Display Name</label>
                  <input
                    type="text" name="name" value={profile.name} onChange={handleInputChange}
                    className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-3 text-white" placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-sm mb-2">Email Address</label>
                  <input
                    type="email" name="email" value={profile.email} onChange={handleInputChange}
                    className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-3 text-white" placeholder="Your email" disabled
                  />
                  <p className="text-xs text-white/40 mt-1">Email address cannot be changed</p>
                </div>
                <div>
                  <label className="block text-white/80 text-sm mb-2">Account Role</label>
                  <input
                    type="text" value={profile.role} disabled
                    className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-3 text-white"
                  />
                </div>
              </div>
              <button type="submit" disabled={isSaving} className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-medium shadow-glow hover:shadow-glow-intense transition-all duration-300">
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        );
      case 'billing': return <Billing />;
      case 'apiKey': return <ApiKeys />;
      case 'team': return <TeamSettings />;
      case 'security': return <Security />;
      default: return null;
    }
  };

  const tabs = [
    { id: 'profile', name: 'My Profile', icon: HiOutlineUser },
    { id: 'billing', name: 'Billing', icon: HiOutlineCreditCard },
    { id: 'apiKey', name: 'API Keys', icon: HiOutlineKey },
    { id: 'team', name: 'Team', icon: HiOutlineUsers },
    { id: 'security', name: 'Security', icon: HiOutlineShieldCheck },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading-pulse gradient-text text-xl">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="neural-bg"></div>
      <main className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          {/* Page Header */}
          <div className="flex items-center justify-between mb-10">
            <div>
              <h1 className="text-3xl font-bold gradient-text mb-2">Account Settings</h1>
              <p className="text-gray-400">Manage your profile, billing, team, and security settings</p>
            </div>
          </div>
          
          {/* Tab Navigation */}
          <div className="mb-10">
            <div className="border-b border-white/10">
              <nav className="-mb-px flex space-x-6 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as ActiveTab)}
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors duration-200 
                      ${activeTab === tab.id
                        ? 'border-primary text-primary'
                        : 'border-transparent text-white/60 hover:text-white/80 hover:border-white/30'
                      }`}
                  >
                    <tab.icon className="h-5 w-5" />
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Active Tab Content */}
          <div className="mt-8">
            {renderActiveTab()}
          </div>
          
        </motion.div>
      </main>
    </div>
  );
} 