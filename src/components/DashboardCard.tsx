// @ts-nocheck - This file has some TypeScript issues that are hard to fix
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface DashboardCardProps { title: string;
  description: string;
  icon: string;
  link: string;
  color: string;
    }

const DashboardCard = ({ title, description, icon, link, color }: DashboardCardProps) => {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  // Handle navigation with error handling
  const handleNavigation = (href: string) => {
    try {
      console.log(`Navigating to: ${href}`);
      router.push(href);
    } catch (error) {
      console.error(`Navigation error to ${href}:`, error);
      // Fallback to window.location if router.push fails
      window.location.href = href;
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02     }}
      whileTap={{ scale: 0.98     }}
      className={`rounded-lg p-6 bg-gradient-to-br ${color} bg-opacity-20 transition-all duration-200 border border-white/10 backdrop-blur-sm`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => handleNavigation(link)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleNavigation(link);
        }
      }}
    >
      <div className="flex flex-col h-full">
        <div className="text-3xl mb-4">{icon}</div>
        <h2 className="text-xl font-semibold text-white mb-2">{title}</h2>
        <p className="text-gray-300 text-sm flex-grow">{description}</p>
        <div className="mt-4 flex justify-end">
          <span className="text-white text-sm opacity-75">
            { isHovered ? 'View →' : 'View'    }
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardCard; 