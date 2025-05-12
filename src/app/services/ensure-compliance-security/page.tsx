'use client';

// Force dynamic rendering to avoid static generation issues
export const dynamic = 'force-dynamic';

// Force dynamic rendering to avoid static generation issues with React version conflicts


import dynamic from 'next/dynamic';
import { MotionWrapper } from '@/components/MotionWrapper';
import { useState, useEffect } from 'react';

import Link from 'next/link';
import { 
  HiOutlineClipboardCheck,
  HiOutlineDocumentText,
  HiOutlineLockClosed,
  HiOutlineServer,
  HiOutlineShieldCheck,
  HiOutlineUserGroup
} from 'react-icons/hi';

// Dynamic import replaced with MotionWrapper 

export default function EnsureComplianceSecurityPage() {
  // Use client-side only rendering to avoid hydration mismatches
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  const features = [
    { title: "Compliance Assessment",
      description: "Comprehensive evaluation of your systems against industry regulations and standards.",
      icon: <HiOutlineClipboardCheck className="w-8 h-8" />
    },
    { title: "Security Audit",
      description: "Thorough security assessment to identify vulnerabilities and risks.",
      icon: <HiOutlineShieldCheck className="w-8 h-8" />
    },
    { title: "Data Protection",
      description: "Implement robust data protection measures to safeguard sensitive information.",
      icon: <HiOutlineLockClosed className="w-8 h-8" />
    },
    { title: "Documentation",
      description: "Detailed documentation of compliance and security measures.",
      icon: <HiOutlineDocumentText className="w-8 h-8" />
    },
    { title: "Infrastructure Security",
      description: "Secure your IT infrastructure against potential threats.",
      icon: <HiOutlineServer className="w-8 h-8" />
    },
    { title: "Training & Awareness",
      description: "Staff training programs on security best practices and compliance requirements.",
      icon: <HiOutlineUserGroup className="w-8 h-8" />
    }
  ];

  // Only render the full content on the client side to avoid React version conflicts
  if (!isClient) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center" style={{ background: 'linear-gradient(to bottom, #000000, #0A0A0A)' }}>
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-64 bg-gray-700 rounded mb-4"></div>
          <div className="h-6 w-96 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white" style={{ background: 'linear-gradient(to bottom, #000000, #0A0A0A)' }}>
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-8 text-center">
            Compliance & <span className="text-blue-500">Security</span>
          </h1>
          
          <p className="text-xl text-center max-w-3xl mx-auto mb-16">
            Ensure your business meets industry regulations while maintaining robust security
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-gray-800/50 p-6 rounded-lg hover:bg-gray-700/50 transition-all"
              >
                <div className="text-blue-500 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-20 text-center">
            <Link
              href="/contact"
              className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
} 