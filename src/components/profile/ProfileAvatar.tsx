'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface ProfileAvatarProps {
  avatarUrl: string;
  name: string;
  onAvatarChange: (url: string) => void;
}

export default function ProfileAvatar({ avatarUrl, name, onAvatarChange }: ProfileAvatarProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // File validation
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error('Image size must be less than 5MB');
      return;
    }
    
    // Create a preview URL
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    
    // In a real app, you would upload the file to a server/cloud storage
    setIsUploading(true);
    
    try {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Normally you'd get the new URL from your backend after upload
      onAvatarChange(objectUrl);
      toast.success('Avatar updated successfully');
    } catch (error) {
      toast.error('Failed to update avatar');
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div className="flex flex-col items-center md:flex-row md:items-start gap-6 mb-8">
      <div className="relative group">
        <div className="relative h-32 w-32 rounded-full overflow-hidden border-4 border-white/10 bg-black/20">
          <Image 
            src={previewUrl || avatarUrl || '/default-avatar.svg'} 
            alt={name}
            className="object-cover"
            fill
            sizes="128px"
          />
          
          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <div className="loading-spinner w-8 h-8 border-2 border-white border-t-transparent"></div>
            </div>
          )}
        </div>
        
        <label 
          htmlFor="avatar-upload" 
          className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
          <span className="sr-only">Change avatar</span>
        </label>
        
        <input 
          type="file" 
          id="avatar-upload" 
          className="hidden" 
          accept="image/*"
          onChange={handleFileChange}
          disabled={isUploading}
        />
      </div>
      
      <div className="text-center md:text-left">
        <h2 className="text-2xl font-bold gradient-text">{name}</h2>
        <p className="text-gray-400 mt-1 mb-4">Update your profile picture</p>
        
        <div className="space-x-3">
          <button 
            onClick={() => document.getElementById('avatar-upload')?.click()}
            disabled={isUploading}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white transition-colors"
          >
            Upload New Image
          </button>
          
          {avatarUrl && (
            <button 
              onClick={() => onAvatarChange('/default-avatar.png')}
              disabled={isUploading}
              className="px-4 py-2 text-red-400 hover:text-red-300 transition-colors"
            >
              Remove
            </button>
          )}
        </div>
        
        <p className="text-xs text-white/40 mt-3">
          Recommended: Square JPG, PNG, or GIF, at least 300x300 pixels.
        </p>
      </div>
    </div>
  );
} 