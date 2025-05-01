'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

export default function Security() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(false);
  const [isSettingUpTwoFactor, setIsSettingUpTwoFactor] = useState(false);
  
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error('New password and confirmation do not match');
      return;
    }
    
    if (newPassword.length < 8) {
      toast.error('New password must be at least 8 characters long');
      return;
    }
    
    setIsChangingPassword(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast.error('Failed to change password');
      console.error(error);
    } finally {
      setIsChangingPassword(false);
    }
  };
  
  const handleTwoFactorToggle = async () => {
    setIsSettingUpTwoFactor(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1200));
      setIsTwoFactorEnabled(prev => !prev);
      toast.success(`Two-factor authentication ${!isTwoFactorEnabled ? 'enabled' : 'disabled'}`);
    } catch (error) {
      toast.error('Failed to update two-factor authentication settings');
      console.error(error);
    } finally {
      setIsSettingUpTwoFactor(false);
    }
  };
  
  return (
    <>
      {/* Password Change */}
      <div className="bg-dark-100/30 backdrop-blur-sm border border-white/10 rounded-xl p-6 mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Change Password</h2>
        
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-white/80 text-sm mb-2">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-2 text-white"
              required
            />
          </div>
          
          <div>
            <label className="block text-white/80 text-sm mb-2">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-2 text-white"
              required
            />
            <p className="text-xs text-white/40 mt-1">Must be at least 8 characters long</p>
          </div>
          
          <div>
            <label className="block text-white/80 text-sm mb-2">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-2 text-white"
              required
            />
          </div>
          
          <div className="text-right">
            <button
              type="submit"
              disabled={isChangingPassword}
              className="px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-medium transition-all duration-300 hover:opacity-90"
            >
              {isChangingPassword ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>
      
      {/* Two-Factor Authentication */}
      <div className="bg-dark-100/30 backdrop-blur-sm border border-white/10 rounded-xl p-6 mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Two-Factor Authentication (2FA)</h2>
        
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-medium">
              Status: {isTwoFactorEnabled ? 'Enabled' : 'Disabled'}
            </h3>
            <p className="text-white/60 text-sm">Add an extra layer of security to your account</p>
          </div>
          
          <button 
            onClick={handleTwoFactorToggle}
            disabled={isSettingUpTwoFactor}
            className={`w-14 h-7 rounded-full relative transition-colors duration-300 ${
              isTwoFactorEnabled ? 'bg-primary' : 'bg-white/20'
            }`}
          >
            <span 
              className={`absolute top-1 left-1 bg-white rounded-full w-5 h-5 transition-transform duration-300 transform ${
                isTwoFactorEnabled ? 'translate-x-7' : ''
              }`}
            ></span>
          </button>
        </div>
        
        {isSettingUpTwoFactor && (
          <div className="mt-4 text-center text-white/60 text-sm">
            Updating 2FA settings...
          </div>
        )}
        
        {/* Add instructions for setting up 2FA (QR code, backup codes) here */}
      </div>
    </>
  );
} 