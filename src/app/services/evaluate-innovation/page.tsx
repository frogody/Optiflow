'use client';

// Force dynamic rendering to avoid static generation issues
export const dynamic = 'force-dynamic';
// Disable cache to avoid static rendering issues
export const revalidate = 0;

// Force dynamic rendering to avoid static generation issues



import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  HiOutlineChartBar, 
  HiOutlineCode, 
  HiOutlineDocumentReport, 
  HiOutlineLightningBolt, 
  HiOutlinePuzzle, 
  HiOutlineShieldCheck 
} from 'react-icons/hi';

export default function EvaluateInnovationPage() {
  // Use client-side only rendering to avoid hydration mismatches
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Features data
  const features = [
    { title: "Comprehensive Assessment",
      description: "In-depth evaluation of your innovation initiatives to identify optimization opportunities.",
      icon: <HiOutlineChartBar className="w-8 h-8" />
    },
    { title: "Performance Analytics",
      description: "Detailed analysis of innovation performance and ROI.",
      icon: <HiOutlineShieldCheck className="w-8 h-8" />
    },
    { title: "Process Optimization",
      description: "Recommendations for improving your innovation processes.",
      icon: <HiOutlineLightningBolt className="w-8 h-8" />
    },
    { title: "Strategic Roadmap",
      description: "Development of a strategic roadmap for future innovation.",
      icon: <HiOutlineCode className="w-8 h-8" />
    },
    { title: "Implementation Support",
      description: "Assistance with implementing recommended improvements.",
      icon: <HiOutlinePuzzle className="w-8 h-8" />
    },
    { title: "Documentation",
      description: "Comprehensive documentation of findings and recommendations.",
      icon: <HiOutlineDocumentReport className="w-8 h-8" />
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
            Evaluate <span className="text-blue-500">Innovation</span>
          </h1>
          
          <p className="text-xl text-center max-w-3xl mx-auto mb-16">
            Comprehensive evaluation and optimization of your innovation initiatives
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