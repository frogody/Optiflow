'use client';

// Ensure no duplicate useState imports

import { useState, useEffect } from 'react';


// Force dynamic rendering to avoid static generation issues
export const dynamic = 'force-dynamic';
// Disable cache to avoid static rendering issues
export const revalidate = 0;

// Heroicons removed to prevent React version conflicts
import { CheckBadgeIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

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

export default function CommunityForum() {
  // Use client-side only rendering to avoid hydration mismatches
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  const [searchQuery, setSearchQuery] = useState('');

  // Discussion categories
  const categories = [
    {
      name: 'General Discussion',
      href: '/help/community/general',
      icon: ChatBubbleLeftRightIcon,
      description: 'Chat about anything related to Optiflow',
      topics: 243,
      posts: 1876,
      color: 'text-[#22D3EE] bg-[#022c22]',
    },
    {
      name: 'Workflow Showcase',
      href: '/help/community/showcase',
      icon: WrenchScrewdriverIcon,
      description: 'Share and discover interesting workflows',
      topics: 128,
      posts: 895,
      color: 'text-[#22D3EE] bg-[#022c22]',
    },
    {
      name: 'Jarvis Voice Agent',
      href: '/help/community/voice-agent',
      icon: MicrophoneIcon,
      description: 'Discussions about Optiflow\'s voice assistant',
      topics: 86,
      posts: 542,
      color: 'text-[#22D3EE] bg-[#022c22]',
    },
    {
      name: 'Integrations',
      href: '/help/community/integrations',
      icon: PuzzlePieceIcon,
      description: 'Connecting Optiflow with other services',
      topics: 175,
      posts: 1243,
      color: 'text-[#22D3EE] bg-[#022c22]',
    },
    {
      name: 'Feature Requests',
      href: '/help/community/feature-requests',
      icon: RocketLaunchIcon,
      description: 'Suggest and vote on new features',
      topics: 92,
      posts: 624,
      color: 'text-[#A855F7] bg-[#3b0764]',
    },
    {
      name: 'Troubleshooting',
      href: '/help/community/troubleshooting',
      icon: QuestionMarkCircleIcon,
      description: 'Get help with issues and errors',
      topics: 215,
      posts: 1548,
      color: 'text-[#F59E0B] bg-[#422006]',
    },
  ];

  // Recent discussions
  const recentDiscussions = [
    {
      id: 1,
      title: 'Best practices for voice workflow testing?',
      category: 'Voice Agent',
      author: {
        name: 'Sarah Johnson',
        avatar: '/user-avatar.jpg',
        isStaff: false,
      },
      replies: 12,
      views: 128,
      lastActivity: '35 minutes ago',
      isHot: true,
    },
    {
      id: 2,
      title: 'How to parse complex JSON responses in workflows',
      category: 'Workflows',
      author: {
        name: 'Michael Chen',
        avatar: '/user-avatar.jpg',
        isStaff: false,
      },
      replies: 8,
      views: 94,
      lastActivity: '2 hours ago',
      isHot: false,
    },
    {
      id: 3,
      title: 'Announcement: New Slack integration features',
      category: 'Announcements',
      author: {
        name: 'Emma Rodriguez',
        avatar: '/user-avatar.jpg',
        isStaff: true,
      },
      replies: 24,
      views: 312,
      lastActivity: '3 hours ago',
      isHot: true,
    },
    {
      id: 4,
      title: 'Workflow not triggering with Google Calendar events',
      category: 'Troubleshooting',
      author: {
        name: 'David Wilson',
        avatar: '/user-avatar.jpg',
        isStaff: false,
      },
      replies: 5,
      views: 62,
      lastActivity: '5 hours ago',
      isHot: false,
    },
    {
      id: 5,
      title: 'Showcase: My customer support automation workflow',
      category: 'Showcase',
      author: {
        name: 'Lisa Anderson',
        avatar: '/user-avatar.jpg',
        isStaff: false,
      },
      replies: 18,
      views: 203,
      lastActivity: '6 hours ago',
      isHot: false,
    },
  ];

  // Top contributors
  const topContributors = [
    {
      name: 'Sophia Martinez',
      avatar: '/user-avatar.jpg',
      posts: 132,
      badges: ['Workflow Expert', 'Top Contributor'],
    },
    {
      name: 'Alex Johnson',
      avatar: '/user-avatar.jpg',
      posts: 98,
      badges: ['Voice Agent Pro', 'Beta Tester'],
    },
    {
      name: 'James Wilson',
      avatar: '/user-avatar.jpg',
      posts: 87,
      badges: ['API Expert', 'Bug Hunter'],
    },
  ];

  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, this would navigate to a search results page
    console.log(`Searching for: ${searchQuery}`);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#22D3EE] mb-4">Optiflow Community</h1>
        <p className="text-[#9CA3AF] max-w-3xl mb-6">
          Join conversations with other Optiflow users, share your workflows, ask questions, and get help from the community and Optiflow team.
        </p>
        
        {/* Search */}
        <form onSubmit={handleSearch} className="relative max-w-lg">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon name="magnifying-glass-" className="h-5 w-5 text-[#6B7280]" />
          </div>
          <input
            type="text"
            placeholder="Search discussions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-4 py-2 bg-[#111111] border border-[#374151] rounded-md text-[#E5E7EB] placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#22D3EE] focus:border-transparent"
          />
          <button
            type="submit"
            className="absolute inset-y-1 right-1 px-3 bg-[#1E293B] text-[#22D3EE] font-medium rounded-md hover:bg-[#2D3748] transition-colors"
          >
            Search
          </button>
        </form>
      </div>
      
      {/* Stats & Quick Access */}
      <div className="flex flex-col md:flex-row gap-6 mb-10">
        <div className="flex-1 bg-[#111111] border border-[#374151] rounded-lg p-6">
          <div className="flex flex-wrap gap-6">
            <div>
              <h3 className="text-sm font-medium text-[#9CA3AF] mb-1">Topics</h3>
              <p className="text-2xl font-bold text-[#E5E7EB]">1,257</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-[#9CA3AF] mb-1">Posts</h3>
              <p className="text-2xl font-bold text-[#E5E7EB]">8,432</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-[#9CA3AF] mb-1">Members</h3>
              <p className="text-2xl font-bold text-[#E5E7EB]">5,628</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-[#9CA3AF] mb-1">Online</h3>
              <p className="text-2xl font-bold text-[#22D3EE]">142</p>
            </div>
          </div>
        </div>
        
        <div className="flex-1 bg-[#111111] border border-[#374151] rounded-lg p-6">
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/help/community/new-topic"
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-[#22D3EE] text-[#111111] font-medium rounded-md hover:bg-[#06B6D4] transition-colors"
            >
              <Icon name="plus-" className="h-5 w-5" />
              <span>New Topic</span>
            </Link>
            <Link
              href="/help/community/unanswered"
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-[#1E293B] text-[#E5E7EB] font-medium rounded-md hover:bg-[#2D3748] transition-colors"
            >
              <Icon name="hand-raised-" className="h-5 w-5" />
              <span>Help Others</span>
            </Link>
            <Link
              href="/help/community/your-posts"
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-[#1E293B] text-[#E5E7EB] font-medium rounded-md hover:bg-[#2D3748] transition-colors"
            >
              <Icon name="user-circle-" className="h-5 w-5" />
              <span>Your Posts</span>
            </Link>
            <Link
              href="/help/community/guidelines"
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-[#1E293B] text-[#E5E7EB] font-medium rounded-md hover:bg-[#2D3748] transition-colors"
            >
              <Icon name="chat-bubble-left-right-" className="h-5 w-5" />
              <span>Guidelines</span>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Categories */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-[#E5E7EB]">Discussion Categories</h2>
          <Link 
            href="/help/community/categories" 
            className="text-sm text-[#22D3EE] hover:text-[#06B6D4] flex items-center"
          >
            <span>View all categories</span>
            <Icon name="chevron-right-" className="ml-1 h-4 w-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="bg-[#111111] border border-[#374151] rounded-lg p-6 hover:border-[#22D3EE] transition-colors"
            >
              <div className="flex items-start">
                <div className={`p-2 rounded-md ${category.color} mr-4`}>
                  <category.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-[#E5E7EB] hover:text-[#22D3EE] transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-[#9CA3AF] mt-1 mb-3">{category.description}</p>
                  <div className="flex space-x-4 text-xs text-[#6B7280]">
                    <span>{category.topics} topics</span>
                    <span>{category.posts} posts</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      
      {/* Recent Discussions */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-[#E5E7EB]">Recent Discussions</h2>
          <Link 
            href="/help/community/recent" 
            className="text-sm text-[#22D3EE] hover:text-[#06B6D4] flex items-center"
          >
            <span>View all recent</span>
            <Icon name="chevron-right-" className="ml-1 h-4 w-4" />
          </Link>
        </div>
        
        <div className="bg-[#111111] border border-[#374151] rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-[#374151]">
            <thead className="bg-[#1E293B]">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">
                  Topic
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider hidden md:table-cell">
                  Category
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider hidden lg:table-cell">
                  Stats
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">
                  Last Activity
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#374151]">
              {recentDiscussions.map((discussion) => (
                <tr key={discussion.id} className="hover:bg-[#1E293B] transition-colors">
                  <td className="px-6 py-4">
                    <Link 
                      href={`/help/community/topic/${discussion.id}`}
                      className="block"
                    >
                      <div className="flex items-center">
                        {discussion.isHot && (
                          <Icon name="fire-" className="h-5 w-5 text-[#F59E0B] mr-2" />
                        )}
                        <div>
                          <div className="font-medium text-[#E5E7EB] hover:text-[#22D3EE]">
                            {discussion.title}
                          </div>
                          <div className="mt-1 flex items-center text-xs text-[#9CA3AF]">
                            <div className="h-6 w-6 rounded-full bg-[#2D3748] flex items-center justify-center text-[#22D3EE] mr-2">
                              <Icon name="user-circle-" className="h-5 w-5" />
                            </div>
                            <span>
                              {discussion.author.name}
                              {discussion.author.isStaff && (
                                <span className="ml-1 inline-flex items-center">
                                  <Icon name="check-badge-" className="h-3 w-3 text-[#22D3EE] mr-1" />
                                  <span className="text-[#22D3EE]">Staff</span>
                                </span>
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#1E293B] text-[#9CA3AF]">
                      {discussion.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#9CA3AF] hidden lg:table-cell">
                    <div className="flex space-x-4">
                      <span>{discussion.replies} replies</span>
                      <span>{discussion.views} views</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#9CA3AF]">
                    {discussion.lastActivity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Top Contributors & Community Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <h2 className="text-xl font-bold text-[#E5E7EB] mb-6">Top Contributors</h2>
          <div className="bg-[#111111] border border-[#374151] rounded-lg overflow-hidden">
            <ul className="divide-y divide-[#374151]">
              {topContributors.map((contributor, index) => (
                <li key={index} className="p-4">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-[#2D3748] flex items-center justify-center text-[#22D3EE] mr-4">
                      <Icon name="user-circle-" className="h-8 w-8" />
                    </div>
                    <div>
                      <h3 className="text-[#E5E7EB] font-medium">{contributor.name}</h3>
                      <div className="flex flex-wrap mt-1 gap-2">
                        {contributor.badges.map((badge, badgeIndex) => (
                          <span 
                            key={badgeIndex}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#022c22] text-[#22D3EE]"
                          >
                            {badge}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="ml-auto text-right">
                      <div className="text-[#9CA3AF] text-sm">{contributor.posts} posts</div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="bg-[#1E293B] px-4 py-3 flex justify-center">
              <Link 
                href="/help/community/members" 
                className="text-sm text-[#22D3EE] hover:text-[#06B6D4] flex items-center"
              >
                <Icon name="user-group-" className="h-4 w-4 mr-1" />
                <span>View all members</span>
              </Link>
            </div>
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-bold text-[#E5E7EB] mb-6">Latest Activity</h2>
          <div className="bg-[#111111] border border-[#374151] rounded-lg p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-[#9CA3AF] mb-3">Active Discussions</h3>
                <div className="h-10 bg-[#1E293B] rounded-full relative overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#22D3EE] to-[#0EA5E9] w-3/4"></div>
                  <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                    128 topics with activity today
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-[#9CA3AF] mb-3">New Posts (24h)</h3>
                <div className="h-10 bg-[#1E293B] rounded-full relative overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#A855F7] to-[#D946EF] w-1/2"></div>
                  <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                    352 new posts in 24 hours
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-[#9CA3AF] mb-3">New Members (7 days)</h3>
                <div className="h-10 bg-[#1E293B] rounded-full relative overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#F97316] to-[#F59E0B] w-1/4"></div>
                  <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                    86 new members this week
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Community guidelines and code of conduct */}
      <div className="mt-10 bg-gradient-to-r from-[#134e4a] to-[#1e1b4b] rounded-lg p-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="md:max-w-2xl">
            <h2 className="text-2xl font-bold text-white mb-4">Community Guidelines</h2>
            <p className="text-[#D1D5DB] mb-6">
              Our community thrives when everyone feels welcome and respected. Please familiarize yourself with our guidelines to help maintain a positive environment for all members.
            </p>
          </div>
          <div className="mt-6 md:mt-0">
            <Link
              href="/help/community/guidelines"
              className="inline-flex items-center px-6 py-3 bg-[#22D3EE] text-[#111111] font-bold rounded-md hover:bg-[#06B6D4] transition-colors"
            >
              <span>Read Guidelines</span>
              <Icon name="chevron-right-" className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 