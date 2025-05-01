'use client';

import { useState } from 'react';
import Image from 'next/image';
import toast from 'react-hot-toast';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member' | 'viewer';
  avatarUrl: string;
  status: 'active' | 'invited';
}

export default function TeamSettings() {
  const [isInviting, setIsInviting] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'admin' | 'member' | 'viewer'>('member');
  
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'admin',
      avatarUrl: '/default-avatar.png',
      status: 'active'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'member',
      avatarUrl: '/default-avatar.png',
      status: 'active'
    },
    {
      id: '3',
      name: 'Alex Johnson',
      email: 'alex@example.com',
      role: 'viewer',
      avatarUrl: '/default-avatar.png',
      status: 'invited'
    }
  ]);
  
  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inviteEmail.trim()) {
      toast.error('Please enter an email address');
      return;
    }
    
    setIsInviting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Add new invited member
      const newMember: TeamMember = {
        id: Date.now().toString(),
        name: 'Invited User',
        email: inviteEmail,
        role: inviteRole,
        avatarUrl: '/default-avatar.png',
        status: 'invited'
      };
      
      setTeamMembers(prev => [...prev, newMember]);
      setInviteEmail('');
      
      toast.success(`Invitation sent to ${inviteEmail}`);
    } catch (error) {
      toast.error('Failed to send invitation');
      console.error(error);
    } finally {
      setIsInviting(false);
    }
  };
  
  const handleRoleChange = (memberId: string, newRole: 'admin' | 'member' | 'viewer') => {
    setTeamMembers(prev => 
      prev.map(member => 
        member.id === memberId 
          ? { ...member, role: newRole } 
          : member
      )
    );
    
    const member = teamMembers.find(m => m.id === memberId);
    if (member) {
      toast.success(`Updated ${member.name}'s role to ${newRole}`);
    }
  };
  
  const handleRemoveMember = (memberId: string) => {
    const member = teamMembers.find(m => m.id === memberId);
    
    if (member && confirm(`Are you sure you want to remove ${member.name} from the team?`)) {
      setTeamMembers(prev => prev.filter(m => m.id !== memberId));
      toast.success(`Removed ${member.name} from the team`);
    }
  };
  
  return (
    <div className="bg-dark-100/30 backdrop-blur-sm border border-white/10 rounded-xl p-6 mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-white mb-1">Team Members</h2>
          <p className="text-white/60 text-sm">Manage your team and permissions</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center">
          <span className="text-white/60 text-sm mr-2">
            {teamMembers.length} members
          </span>
        </div>
      </div>
      
      {/* Invite Form */}
      <form onSubmit={handleInvite} className="mb-8">
        <div className="bg-black/30 rounded-lg border border-white/5 p-4">
          <h3 className="text-white font-medium mb-3">Invite Team Member</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-white/80 text-sm mb-2">Email Address</label>
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-2 text-white"
                placeholder="colleague@company.com"
                required
              />
            </div>
            
            <div>
              <label className="block text-white/80 text-sm mb-2">Role</label>
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as any)}
                className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-2 text-white appearance-none bg-no-repeat bg-right pr-8"
                style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundSize: '1.5em 1.5em' }}
              >
                <option value="admin">Admin</option>
                <option value="member">Member</option>
                <option value="viewer">Viewer</option>
              </select>
            </div>
          </div>
          
          <div className="mt-4 text-right">
            <button
              type="submit"
              disabled={isInviting}
              className="px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-medium transition-all duration-300 hover:opacity-90"
            >
              {isInviting ? 'Sending...' : 'Send Invitation'}
            </button>
          </div>
        </div>
      </form>
      
      {/* Team Members List */}
      <div className="space-y-4">
        {teamMembers.map(member => (
          <div key={member.id} className="bg-black/30 rounded-lg border border-white/5 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="relative h-10 w-10 rounded-full overflow-hidden">
                  <Image 
                    src={member.avatarUrl} 
                    alt={member.name}
                    className="object-cover"
                    fill
                    sizes="40px"
                  />
                </div>
                
                <div className="ml-3">
                  <h3 className="text-white font-medium">{member.name}</h3>
                  <p className="text-white/60 text-sm">{member.email}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                {member.status === 'invited' && (
                  <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">
                    Pending
                  </span>
                )}
                
                <select
                  value={member.role}
                  onChange={(e) => handleRoleChange(member.id, e.target.value as any)}
                  className="bg-white/5 border border-white/20 rounded-lg px-3 py-1 text-white text-sm appearance-none bg-no-repeat bg-right pr-8"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.3rem center', backgroundSize: '1.5em 1.5em' }}
                >
                  <option value="admin">Admin</option>
                  <option value="member">Member</option>
                  <option value="viewer">Viewer</option>
                </select>
                
                <button
                  onClick={() => handleRemoveMember(member.id)}
                  className="text-red-400 hover:text-red-300"
                  title="Remove member"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Role Explanations */}
      <div className="mt-8 bg-black/20 rounded-lg p-4 text-sm">
        <h3 className="text-white font-medium mb-2">Role Permissions</h3>
        <ul className="space-y-2 text-white/60">
          <li className="flex items-start">
            <span className="font-semibold text-white/80 w-20">Admin:</span>
            <span>Full access to all features, billing, team management, and API keys.</span>
          </li>
          <li className="flex items-start">
            <span className="font-semibold text-white/80 w-20">Member:</span>
            <span>Can create and manage workflows, connections, and view analytics.</span>
          </li>
          <li className="flex items-start">
            <span className="font-semibold text-white/80 w-20">Viewer:</span>
            <span>Read-only access to workflows and analytics. Cannot make changes.</span>
          </li>
        </ul>
      </div>
    </div>
  );
} 