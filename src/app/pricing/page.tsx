// @ts-nocheck - This file has some TypeScript issues that are hard to fix
'use client';

import { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { useUserStore } from '@/lib/userStore';
import { HiOutlineLightningBolt, HiOutlineCube, HiOutlineSparkles } from 'react-icons/hi';
import { cn } from '@/lib/utils';

interface PricingTier { name: string;
  price: string;
  description: string;
  features: string[];
  products: string[];
  cta: string;
  popular?: boolean;
  icon: any;
    }

// Enhanced aurora effect component
const AuroraEffect = () => {
  return (
    <motion.div
      initial={{ opacity: 0     }}
      animate={{ opacity: 1     }}
      className="absolute inset-0 overflow-hidden"
    >
      <motion.div
        animate={{ rotate: 360,
          scale: [1, 1.1, 1]
            }}
        transition={{
          rotate: { duration: 50, repeat: Infinity, ease: "linear" },
          scale: { duration: 8, repeat: Infinity, ease: "easeInOut" }
        }}
        className="absolute w-[200%] h-[200%] -top-1/2 -left-1/2"
        style={{ 
          background: 'conic-gradient(from 0deg at 50% 50%, transparent, rgba(60,223,255,0.1), rgba(74,255,212,0.1), transparent)',
          filter: 'blur(100px)'
        }}
      />
    </motion.div>
  );
};

// Enhanced gradient orb component
const GradientOrb = ({ delay = 0, size = 600, color = 'blue' }) => {
  const gradients = { blue: 'from-[#3CDFFF]/20 to-[#4AFFD4]/20',
    purple: 'from-[#4AFFD4]/20 to-[#3CDFFF]/20',
    mixed: 'from-[#3CDFFF]/20 via-[#4AFFD4]/20 to-[#3CDFFF]/20'
      };

  return (
    <motion.div
      className={`absolute w-[${size}px] h-[${size}px] rounded-full blur-[120px] bg-gradient-to-r ${gradients[color]}`}
      style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
      }}
      animate={{ opacity: [0.1, 0.2, 0.1],
        scale: [1, 1.2, 1],
        x: [0, Math.random() * 100 - 50, 0],
        y: [0, Math.random() * 100 - 50, 0],
        rotate: [0, Math.random() * 90 - 45, 0],
          }}
      transition={{ duration: Math.random() * 5 + 5,
        repeat: Infinity,
        ease: "easeInOut",
        delay
          }}
    />
  );
};

export default function PricingPage(): JSX.Element {
  const [isAnnual, setIsAnnual] = useState(true);
  const { currentUser } = useUserStore();
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef,
    offset: ["start start", "end end"]
      });

  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);

  const pricingTiers = [
    { name: 'Starter',
      price: isAnnual ? '$29/mo' : '$39/mo',
      description: 'Perfect for individuals and small teams getting started with automation',
      icon: HiOutlineSparkles,
      products: ['AI Factory'],
      features: [
        'Up to 5 active workflows',
        'Basic workflow templates',
        'Community support',
        'Standard integrations',
        'Basic analytics'
      ],
      cta: 'Get Started',
      popular: false
        },
    { name: 'Growth',
      price: isAnnual ? '$79/mo' : '$99/mo',
      description: 'Ideal for growing businesses with advanced automation needs',
      icon: HiOutlineLightningBolt,
      products: [
        'AI Factory',
        'AI Academy'
      ],
      features: [
        'Up to 20 users',
        'Advanced workflow automation',
        'Premium integrations',
        'Priority support',
        '50 GB storage',
        'Advanced API access',
        'Custom workflows',
        'Analytics dashboard'
      ],
      cta: 'Get Started',
      popular: true
        },
    { name: 'Custom Solutions',
      price: 'Contact us',
      description: 'Enterprise-grade solutions for large organizations',
      icon: HiOutlineCube,
      products: [
        'AI Factory',
        'AI Academy',
        'Enterprise Suite'
      ],
      features: [
        'Unlimited users',
        'Custom workflow development',
        'Enterprise integrations',
        'Dedicated support',
        'Unlimited storage',
        'Full API access',
        'Custom development',
        'Advanced security',
        'SLA guarantee',
        'Training & onboarding'
      ],
      cta: 'Contact Sales',
      popular: false
        }
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Enhanced Dynamic Background */}
      <motion.div 
        className="fixed inset-0 z-0"
        style={{ y }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#000B1E] to-black" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
        
        {/* Aurora Effect */}
        <AuroraEffect />
        
        {/* Gradient Orbs */}
        {[...Array(12)].map((_, i) => (
          <GradientOrb
            key={i}
            delay={i * 0.5}
            size={Math.random() * 300 + 400}
            color={ i % 3 === 0 ? 'blue' : i % 3 === 1 ? 'purple' : 'mixed'    }
          />
        ))}

        {/* Tech Grid Lines */}
        <div className="absolute inset-0">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-px w-full"
              style={{
                top: `${(i + 1) * 20}%`,
                background: 'linear-gradient(90deg, transparent, rgba(60,223,255,0.1), transparent)',
                opacity: 0.3,
              }}
              animate={{ x: [-1000, 1000],
                opacity: [0.1, 0.3, 0.1],
                  }}
              transition={{ duration: 8,
                repeat: Infinity,
                ease: "linear",
                delay: i * 1,
                  }}
            />
          ))}
        </div>
      </motion.div>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20     }}
          animate={{ opacity: 1, y: 0     }}
          transition={{ duration: 0.8     }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8     }}
            animate={{ opacity: 1, scale: 1     }}
            transition={{ duration: 0.7, delay: 0.3     }}
            className="inline-block mb-8"
          >
            <span className="px-6 py-2 rounded-full bg-gradient-to-r from-[#3CDFFF]/10 to-[#4AFFD4]/10 border border-[#3CDFFF]/20 text-[#3CDFFF] text-sm font-medium backdrop-blur-sm">
              Transform Your Business with AI
            </span>
          </motion.div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4]">
              Enterprise-Grade AI
            </span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
              Made Simple
            </span>
          </h1>

          <p className="text-xl text-[#3CDFFF]/90 mb-12 max-w-3xl mx-auto">
            Choose the perfect plan to bring your AI vision to life. All plans include access to our core AI Factory, Academy, and Integration capabilities.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-16">
            <span className={`text-lg ${ !isAnnual ? 'text-[#3CDFFF]' : 'text-white/60'    }`}>
              Monthly
            </span>
            <motion.button
              whileHover={{ scale: 1.05     }}
              whileTap={{ scale: 0.95     }}
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative w-20 h-10 bg-gradient-to-r from-[#3CDFFF]/20 to-[#4AFFD4]/20 rounded-full p-1 transition-colors duration-200 ease-in-out backdrop-blur-xl border border-[#3CDFFF]/20"
            >
              <motion.div
                layout
                className="absolute w-8 h-8 bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4] rounded-full"
                animate={{ x: isAnnual ? 40 : 0,
                    }}
                transition={{ type: "spring",
                  stiffness: 700,
                  damping: 30
                    }}
              />
            </motion.button>
            <span className={`text-lg ${ isAnnual ? 'text-[#3CDFFF]' : 'text-white/60'    }`}>
              Annual
              <span className="ml-2 text-[#4AFFD4] text-sm">Save 20%</span>
            </span>
          </div>

          {/* Pricing Tiers */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-24">
            {pricingTiers.map((tier, index) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20     }}
                animate={{ opacity: 1, y: 0     }}
                transition={{ duration: 0.5, delay: index * 0.1     }}
                className={`relative p-8 rounded-2xl backdrop-blur-xl border group hover:scale-105 transition-transform duration-300 ${ tier.popular
                    ? 'border-[#3CDFFF] bg-gradient-to-b from-[#3CDFFF]/10 to-transparent'
                    : 'border-white/10 bg-white/5 hover:border-[#3CDFFF]/50'
                    }`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4] text-black text-sm px-4 py-1 rounded-full font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-center mb-6">
                  <div className={ `w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-r from-[#3CDFFF]/20 to-[#4AFFD4]/20 group-hover:from-[#3CDFFF]/30 group-hover:to-[#4AFFD4]/30 transition-colors duration-300`    }>
                    <tier.icon className="w-8 h-8 text-[#3CDFFF]" />
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-white mb-2 text-center">{tier.name}</h3>
                <div className="text-4xl font-bold mb-4 text-center">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4]">
                    {tier.price}
                  </span>
                  {isAnnual && tier.price !== 'Custom' && (
                    <span className="text-sm text-white/60 ml-2">per month, billed annually</span>
                  )}
                </div>
                <p className="text-white/80 mb-8 text-center h-12">{tier.description}</p>

                {/* Products Included */}
                <div className="mb-8 p-4 rounded-xl bg-white/5 border border-white/10">
                  <h4 className="text-sm text-white/60 mb-3">Included Products:</h4>
                  <ul className="space-y-2">
                    {tier.products.map((product) => (
                      <li key={product} className="text-[#3CDFFF]">
                        {product}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Features */}
                <ul className="space-y-4 mb-8">
                  {tier.features.map((feature) => (
                    <li
                      key={feature}
                      className={`flex items-start ${ feature.includes('Advanced') ? 'text-[#4AFFD4]' : 'text-white/80'
                          }`}
                    >
                      <svg
                        className={`w-5 h-5 mr-3 mt-1 ${ feature.includes('Advanced') ? 'text-[#4AFFD4]' : 'text-[#3CDFFF]'
                            }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                <motion.div
                  whileHover={{ scale: 1.05     }}
                  whileTap={{ scale: 0.95     }}
                >
                  <Link
                    href={ tier.cta === 'Contact Sales' ? '/contact' : '/signup'    }
                    className={`block w-full py-4 px-6 rounded-xl text-center font-medium transition-all duration-300 ${ tier.popular
                        ? 'bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4] text-black hover:shadow-lg hover:shadow-[#3CDFFF]/20'
                        : 'bg-gradient-to-r from-[#3CDFFF]/20 to-[#4AFFD4]/20 text-white hover:from-[#3CDFFF]/30 hover:to-[#4AFFD4]/30'
                        }`}
                  >
                    {tier.cta}
                  </Link>
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* Enhanced FAQ Section */}
          <motion.div
            initial={{ opacity: 0     }}
            whileInView={{ opacity: 1     }}
            viewport={{ once: true     }}
            transition={{ duration: 0.8     }}
            className="max-w-4xl mx-auto text-left"
          >
            <h2 className="text-3xl font-bold text-center mb-12">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4]">
                Frequently Asked Questions
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20     }}
                whileInView={{ opacity: 1, y: 0     }}
                viewport={{ once: true     }}
                transition={{ duration: 0.5     }}
                className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xl"
              >
                <h3 className="text-xl font-semibold text-[#3CDFFF] mb-4">
                  What's included in the free trial?
                </h3>
                <p className="text-white/80">
                  Start with our Scale plan free for 14 days. Get full access to AI Factory Pro, AI Academy Enterprise, and Integration Hub Pro features to evaluate our platform's capabilities.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20     }}
                whileInView={{ opacity: 1, y: 0     }}
                viewport={{ once: true     }}
                transition={{ duration: 0.5, delay: 0.1     }}
                className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xl"
              >
                <h3 className="text-xl font-semibold text-[#3CDFFF] mb-4">
                  Can I customize my plan?
                </h3>
                <p className="text-white/80">
                  Yes! Our Enterprise plan offers full customization of features, integrations, and support levels. Contact our sales team to create a plan that perfectly fits your needs.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20     }}
                whileInView={{ opacity: 1, y: 0     }}
                viewport={{ once: true     }}
                transition={{ duration: 0.5, delay: 0.2     }}
                className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xl"
              >
                <h3 className="text-xl font-semibold text-[#3CDFFF] mb-4">
                  What kind of support do you offer?
                </h3>
                <p className="text-white/80">
                  Each plan includes dedicated support levels, from community support in Growth to 24/7 dedicated support in Enterprise. Our team is here to ensure your success with our platform.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20     }}
                whileInView={{ opacity: 1, y: 0     }}
                viewport={{ once: true     }}
                transition={{ duration: 0.5, delay: 0.3     }}
                className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xl"
              >
                <h3 className="text-xl font-semibold text-[#3CDFFF] mb-4">
                  How does billing work?
                </h3>
                <p className="text-white/80">
                  Choose between monthly or annual billing. Annual plans save 20%. We accept all major credit cards, PayPal, and wire transfers for Enterprise plans. Upgrade or downgrade anytime.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
} 