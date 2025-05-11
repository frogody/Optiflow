'use client';

import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { 
  HiOutlineChip,
  HiOutlineCode,
  HiOutlineCog,
  HiOutlineCube,
  HiOutlineLightBulb,
  HiOutlineSparkles
} from 'react-icons/hi';

// All imported icons and components are used in the UI (use cases, features, and hero section).

// Constellation point component with reduced animation complexity
const ConstellationPoint = ({ delay = 0, size = 1 }) => {
  return (
    <motion.div
      initial={{ opacity: 0     }}
      animate={{ opacity: [0.2, 0.4, 0.2],
          }}
      transition={{ duration: 3,
        delay,
        repeat: Infinity,
        ease: "easeInOut"
          }}
      className="absolute rounded-full"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        background: 'radial-gradient(circle at center, #1E90FF, transparent)',
        boxShadow: '0 0 8px #1E90FF',
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        willChange: 'opacity',
      }}
    />
  );
};

// Enhanced floating particle component with optimized animations
const FloatingParticle = ({ delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 0     }}
      animate={{ opacity: [0.1, 0.3, 0.1],
        y: [-20, 0, -20],
          }}
      transition={{ duration: 4,
        delay,
        repeat: Infinity,
        ease: "easeInOut"
          }}
      className="absolute"
      style={{
        width: '2px',
        height: '2px',
        background: 'radial-gradient(circle at center, #1E90FF, #00BFFF)',
        boxShadow: '0 0 8px #1E90FF',
        borderRadius: '50%',
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        willChange: 'transform, opacity',
      }}
    />
  );
};

// Optimized aurora effect component
const AuroraEffect = () => {
  return (
    <div className="absolute inset-0 overflow-hidden opacity-20">
      <motion.div
        initial={{ rotate: 0     }}
        animate={{ rotate: 360     }}
        transition={{ duration: 50,
          repeat: Infinity,
          ease: "linear"
            }}
        className="absolute w-[200%] h-[200%] -top-1/2 -left-1/2"
        style={{ background: 'conic-gradient(from 0deg at 50% 50%, transparent, #1E90FF, #00BFFF, transparent)',
          filter: 'blur(100px)',
          willChange: 'transform',
            }}
      />
    </div>
  );
};

// Floating gradient orb component
const GradientOrb = ({ delay = 0, position = "left" }) => {
  return (
    <motion.div
      initial={{ opacity: 0     }}
      animate={{ opacity: [0.05, 0.15, 0.05],
        y: [-20, 20, -20],
        x: position === "left" ? [-20, 20, -20] : [20, -20, 20],
          }}
      transition={{ duration: 20,
        delay,
        repeat: Infinity,
        ease: "easeInOut"
          }}
      className={`absolute w-[1200px] h-[1200px] rounded-full ${ position === "left" ? "left-0 -translate-x-1/2" : "right-0 translate-x-1/2"
          } top-1/2 -translate-y-1/2`}
      style={{ background: position === "left" 
          ? 'radial-gradient(circle at center, rgba(30,144,255,0.1) 0%, rgba(30,144,255,0) 70%)'
          : 'radial-gradient(circle at center, rgba(0,191,255,0.1) 0%, rgba(0,191,255,0) 70%)',
        filter: 'blur(100px)',
        willChange: 'transform, opacity',
          }}
    />
  );
};

export default function AIFactoryPage(): JSX.Element {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef,
    offset: ["start start", "end end"]
      });

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Optimized parallax effects
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']) // eslint-disable-line react-hooks/exhaustive-deps
  const parallaxY1 = useTransform(scrollYProgress, [0, 1], ['0%', '15%']) // eslint-disable-line react-hooks/exhaustive-deps
  const parallaxY2 = useTransform(scrollYProgress, [0, 1], ['0%', '-15%']) // eslint-disable-line react-hooks/exhaustive-deps

  // Generate fewer particles for better performance
  const particles = Array.from({ length: 50     }).map((_, i) => (
    <FloatingParticle key={i} delay={i * 0.1} />
  ));

  const constellationPoints = Array.from({ length: 30     }).map((_, i) => (
    <ConstellationPoint 
      key={i} 
      delay={i * 0.2} 
      size={Math.random() * 1.5 + 1}
    />
  ));

  const useCases = [
    { title: "Smart Elder Care",
      description: "AI-powered monitoring systems that enhance elderly care with predictive health alerts and automated assistance.",
      benefits: ["24/7 Health Monitoring", "Fall Detection", "Medication Reminders"],
      icon: <HiOutlineSparkles className="w-8 h-8" />
        },
    { title: "Warehouse Optimization",
      description: "Intelligent systems that streamline warehouse operations with predictive inventory and automated routing.",
      benefits: ["Inventory Prediction", "Route Optimization", "Automated Sorting"],
      icon: <HiOutlineCube className="w-8 h-8" />
        },
    { title: "Smart Retail Assistant",
      description: "AI-driven retail solutions that enhance customer experience and optimize store operations.",
      benefits: ["Customer Behavior Analysis", "Dynamic Pricing", "Stock Management"],
      icon: <HiOutlineChip className="w-8 h-8" />
        }
  ];

  const features = [
    { title: "Idea Incubation",
      description: "Transform your AI concepts into reality with our expert guidance and development framework.",
      icon: <HiOutlineLightBulb className="w-8 h-8" />
        },
    { title: "Custom Solutions",
      description: "Tailored AI solutions designed specifically for your unique business challenges and goals.",
      icon: <HiOutlineCog className="w-8 h-8" />
        },
    { title: "Rapid Prototyping",
      description: "Quick iteration and testing of AI models to ensure optimal performance and results.",
      icon: <HiOutlineCode className="w-8 h-8" />
        }
  ];

  return (
    <div ref={containerRef} className="min-h-screen text-white relative overflow-hidden">
      {/* Enhanced Dynamic Background */}
      <motion.div 
        className="fixed inset-0 z-0"
        initial={{ opacity: 0     }}
        animate={{ opacity: 1     }}
        transition={{ duration: 0.5     }}
        style={{ background: 'radial-gradient(circle at 50% 50%, #000B1E, #000000)',
          willChange: 'transform',
            }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <AuroraEffect />
        <GradientOrb position="left" />
        <GradientOrb position="right" delay={10} />
      </motion.div>

      {/* Constellation Effect with AnimatePresence */}
      <AnimatePresence>
        {isMounted && (
          <motion.div 
            initial={{ opacity: 0     }}
            animate={{ opacity: 1     }}
            exit={{ opacity: 0     }}
            transition={{ duration: 0.5     }}
            className="fixed inset-0 z-1"
          >
            {constellationPoints}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Floating Particles with AnimatePresence */}
      <AnimatePresence>
        {isMounted && (
          <motion.div 
            initial={{ opacity: 0     }}
            animate={{ opacity: 1     }}
            exit={{ opacity: 0     }}
            transition={{ duration: 0.5     }}
            className="fixed inset-0 z-1"
          >
            {particles}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section with optimized animations */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        {/* Enhanced Glow Effects */}
        <motion.div 
          animate={{ opacity: [0.05, 0.15, 0.05],
            scale: [1, 1.1, 1],
              }}
          transition={{ duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
              }}
          className="absolute w-[1400px] h-[1400px] rounded-full left-1/4 top-1/4 bg-gradient-to-r from-[#3CDFFF]/20 to-[#4AFFD4]/20 blur-[200px]"
          style={{ y: parallaxY1,
            willChange: 'transform, opacity',
              }}
        />
        <motion.div 
          animate={{ opacity: [0.05, 0.15, 0.05],
            scale: [1.1, 1, 1.1],
              }}
          transition={{ duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4
              }}
          className="absolute w-[1400px] h-[1400px] rounded-full right-1/4 bottom-1/3 bg-gradient-to-r from-[#4AFFD4]/20 to-[#3CDFFF]/20 blur-[200px]"
          style={{ y: parallaxY2,
            willChange: 'transform, opacity',
              }}
        />
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20     }}
            animate={{ opacity: 1, y: 0     }}
            transition={{ duration: 0.8     }}
            className="max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8     }}
              animate={{ opacity: 1, scale: 1     }}
              transition={{ duration: 0.7, delay: 0.3     }}
              className="inline-block mb-8"
            >
              <span className="px-6 py-2 rounded-full bg-gradient-to-r from-[#3CDFFF]/10 to-[#4AFFD4]/10 border border-[#3CDFFF]/20 text-[#3CDFFF] text-sm font-medium backdrop-blur-sm">
                Turn Dreams into Reality
              </span>
            </motion.div>
            
            <motion.h1 
              className="text-6xl md:text-7xl lg:text-8xl font-bold mb-8 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-[#3CDFFF] to-white bg-300% animate-gradient"
              initial={{ opacity: 0, y: 20     }}
              animate={{ opacity: 1, y: 0     }}
              transition={{ duration: 1, delay: 0.5     }}
            >
              Where AI Dreams{" "}
              <span className="bg-gradient-to-r from-[#3CDFFF] via-[#4AFFD4] to-[#3CDFFF] text-transparent bg-clip-text animate-gradient bg-300%">
                Come to Life
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-[#3CDFFF]/90 mb-12 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20     }}
              animate={{ opacity: 1, y: 0     }}
              transition={{ duration: 1, delay: 0.7     }}
            >
              Transform your visionary ideas into powerful AI solutions. From concept to reality, we bring innovation to life across industries.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20     }}
              animate={{ opacity: 1, y: 0     }}
              transition={{ duration: 1, delay: 0.9     }}
              className="flex flex-col sm:flex-row gap-6 justify-center"
            >
              <Link 
                href="#contact"
                className="group relative px-8 py-4 bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4] rounded-full font-semibold text-black hover:opacity-90 transition duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-[#3CDFFF]/25 flex items-center justify-center overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#3CDFFF] via-[#4AFFD4] to-[#3CDFFF] opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-300% animate-gradient"></div>
                <span className="relative flex items-center justify-center">
                  Start Building
                  <motion.span
                    className="ml-2"
                    animate={{ x: [0, 5, 0]     }}
                    transition={{ duration: 1.5, repeat: Infinity     }}
                  >
                    →
                  </motion.span>
                </span>
              </Link>
              <Link 
                href="#use-cases"
                className="group relative px-8 py-4 border-2 border-[#3CDFFF]/20 text-white rounded-full font-semibold transition duration-300 backdrop-blur-sm flex items-center justify-center overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#3CDFFF]/10 via-[#4AFFD4]/10 to-[#3CDFFF]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <span className="relative">View Use Cases</span>
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0     }}
              animate={{ opacity: 1     }}
              transition={{ duration: 1, delay: 1.2     }}
              className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              <motion.div 
                whileHover={{ scale: 1.05     }}
                className="p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10 hover:border-[#3CDFFF]/30 transition-all duration-300 group"
              >
                <div className="text-5xl font-bold bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4] text-transparent bg-clip-text mb-3 group-hover:scale-110 transition-transform duration-300">50+</div>
                <div className="text-[#3CDFFF]/90 group-hover:text-white transition-colors duration-300">AI Solutions Built</div>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05     }}
                className="p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10 hover:border-[#3CDFFF]/30 transition-all duration-300 group"
              >
                <div className="text-5xl font-bold bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4] text-transparent bg-clip-text mb-3 group-hover:scale-110 transition-transform duration-300">15+</div>
                <div className="text-[#3CDFFF]/90 group-hover:text-white transition-colors duration-300">Industries Served</div>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05     }}
                className="p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10 hover:border-[#3CDFFF]/30 transition-all duration-300 group"
              >
                <div className="text-5xl font-bold bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4] text-transparent bg-clip-text mb-3 group-hover:scale-110 transition-transform duration-300">100%</div>
                <div className="text-[#3CDFFF]/90 group-hover:text-white transition-colors duration-300">Success Rate</div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section id="use-cases" className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#000B1E]/40 to-transparent opacity-40" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-6"
              initial={{ opacity: 0, y: 20     }}
              whileInView={{ opacity: 1, y: 0     }}
              viewport={{ once: true     }}
            >
              Success Stories & Use Cases
            </motion.h2>
            <motion.p 
              className="text-lg text-gray-300"
              initial={{ opacity: 0, y: 20     }}
              whileInView={{ opacity: 1, y: 0     }}
              viewport={{ once: true     }}
              transition={{ delay: 0.2     }}
            >
              Discover how we've helped organizations across industries revolutionize their operations with AI.
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20     }}
                whileInView={{ opacity: 1, y: 0     }}
                whileHover={{ y: -5, scale: 1.02     }}
                transition={{ duration: 0.5, delay: index * 0.1     }}
                viewport={{ once: true     }}
                className="bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/10 relative overflow-hidden group hover:border-[#1E90FF]/30 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#1E90FF]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <motion.div 
                  className="text-[#1E90FF] mb-4"
                  whileHover={{ rotate: 360     }}
                  transition={{ duration: 0.5     }}
                >
                  {useCase.icon}
                </motion.div>
                <h3 className="text-xl font-semibold mb-3">{useCase.title}</h3>
                <p className="text-gray-300 mb-4">{useCase.description}</p>
                <ul className="space-y-2">
                  {useCase.benefits.map((benefit, benefitIndex) => (
                    <motion.li 
                      key={benefitIndex} 
                      className="flex items-center text-sm text-gray-300"
                      initial={{ opacity: 0, x: -20     }}
                      whileInView={{ opacity: 1, x: 0     }}
                      transition={{ delay: (index * 0.1) + (benefitIndex * 0.1)     }}
                      viewport={{ once: true     }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1E90FF] mr-2"></span>
                      {benefit}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1E90FF]/10 to-transparent opacity-40" />
          <div className="absolute inset-0 bg-gradient-radial from-[#000B1E]/60 via-black/40 to-transparent opacity-50" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-6"
              initial={{ opacity: 0, y: 20     }}
              whileInView={{ opacity: 1, y: 0     }}
              viewport={{ once: true     }}
            >
              How We Make It Happen
            </motion.h2>
            <motion.p 
              className="text-lg text-gray-400"
              initial={{ opacity: 0, y: 20     }}
              whileInView={{ opacity: 1, y: 0     }}
              viewport={{ once: true     }}
              transition={{ delay: 0.2     }}
            >
              Our proven process for turning your AI vision into reality.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20     }}
                whileInView={{ opacity: 1, y: 0     }}
                whileHover={{ scale: 1.05,
                  boxShadow: "0 0 30px rgba(30,144,255, 0.1)"
                    }}
                transition={{ duration: 0.5, delay: index * 0.1     }}
                viewport={{ once: true     }}
                className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-white/5 relative overflow-hidden group hover:border-[#1E90FF]/20 transition-all duration-300"
              >
                <motion.div
                  animate={{ opacity: [0.05, 0.1, 0.05],
                    scale: [1, 1.2, 1],
                      }}
                  transition={{ duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 1
                      }} 
                  className="absolute -right-4 -top-4 w-32 h-32 rounded-full bg-[#1E90FF] opacity-5 blur-xl"
                />
                
                <div className="relative z-10">
                  <motion.div 
                    className="text-[#1E90FF] mb-4"
                    whileHover={{ rotate: 360, scale: 1.2     }}
                    transition={{ duration: 0.5     }}
                  >
                    {feature.icon}
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-[#1E90FF]/5 to-black opacity-40" />
          <div className="absolute inset-0 bg-gradient-radial from-black via-[#000B1E]/60 to-black opacity-60" />
        </div>
        <motion.div 
          animate={{ opacity: [0.02, 0.08, 0.02],
            scale: [1, 1.2, 1],
              }}
          transition={{ duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
              }}
          className="absolute w-[800px] h-[800px] rounded-full left-1/4 -top-1/2 bg-[#1E90FF] opacity-5 blur-[200px]"
        />
        <motion.div 
          animate={{ opacity: [0.02, 0.08, 0.02],
            scale: [1.2, 1, 1.2],
              }}
          transition={{ duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2.5
              }}
          className="absolute w-[800px] h-[800px] rounded-full right-1/4 -bottom-1/2 bg-[#00BFFF] opacity-5 blur-[200px]"
        />
        
        <div className="container mx-auto px-4 relative">
          <motion.div 
            initial={{ opacity: 0, y: 30     }}
            whileInView={{ opacity: 1, y: 0     }}
            transition={{ duration: 0.8     }}
            viewport={{ once: true     }}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.h2 
              className="text-4xl md:text-5xl font-bold mb-8"
              animate={{ textShadow: [
                  "0 0 20px rgba(30,144,255, 0)",
                  "0 0 20px rgba(30,144,255, 0.2)",
                  "0 0 20px rgba(30,144,255, 0)"
                ]
                  }}
              transition={{ duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
                  }}
            >
              Ready to Build Your{" "}
              <span className="bg-gradient-to-r from-[#1E90FF] to-[#00BFFF] text-transparent bg-clip-text relative inline-block">
                AI Solution?
                <motion.span
                  className="absolute -inset-1 bg-gradient-to-r from-[#1E90FF]/5 to-[#00BFFF]/5 blur-xl"
                  animate={{ opacity: [0.1, 0.3, 0.1],
                      }}
                  transition={{ duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                      }}
                  style={{ willChange: 'opacity'     }}
                />
              </span>
            </motion.h2>
            
            <p className="text-xl text-gray-500 mb-12 max-w-3xl mx-auto leading-relaxed">
              Let's work together to bring your AI vision to life. Our team of experts is ready to help you every step of the way.
            </p>
            
            <motion.div
              whileHover={{ scale: 1.05     }}
              whileTap={{ scale: 0.95     }}
            >
              <Link 
                href="/contact" 
                className="inline-block px-10 py-4 bg-gradient-to-r from-[#1E90FF] to-[#00BFFF] rounded-xl text-white text-lg font-semibold hover:opacity-90 transition-all duration-300 transform hover:shadow-lg relative overflow-hidden group"
              >
                <span className="relative z-10">Schedule a Consultation</span>
                <motion.div 
                  className="absolute inset-0 bg-black"
                  initial={{ opacity: 0     }}
                  whileHover={{ opacity: 0.2     }}
                  transition={{ duration: 0.3     }}
                />
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: 'radial-gradient(circle at center, rgba(30,144,255,0.2), transparent)',
                    filter: 'blur(15px)',
                      }}
                />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}