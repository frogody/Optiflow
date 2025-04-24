'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { 
  HiOutlineLightningBolt,
  HiOutlineShieldCheck,
  HiOutlineChartBar,
  HiOutlineCube,
  HiOutlineCode,
  HiOutlineAcademicCap
} from 'react-icons/hi';

export default function HomePage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);

  const products = [
    {
      title: "Optiflow",
      description: "Streamline your workflow with AI-powered automation",
      icon: <HiOutlineLightningBolt className="w-8 h-8" />,
      link: "/products/optiflow",
      gradient: "from-[#3CDFFF] to-[#4AFFD4]"
    },
    {
      title: "AI Factory",
      description: "Turn your AI dreams into reality",
      icon: <HiOutlineCube className="w-8 h-8" />,
      link: "/products/ai-factory",
      gradient: "from-[#4AFFD4] to-[#3CDFFF]"
    },
    {
      title: "AIcademy",
      description: "Master AI with expert-led training",
      icon: <HiOutlineAcademicCap className="w-8 h-8" />,
      link: "/products/aicademy",
      gradient: "from-[#3CDFFF] via-[#4AFFD4] to-[#3CDFFF]"
    }
  ];

  const features = [
    {
      title: "Enterprise Security",
      description: "Bank-grade security with advanced encryption and compliance",
      icon: <HiOutlineShieldCheck className="w-8 h-8" />
    },
    {
      title: "Analytics Dashboard",
      description: "Real-time insights and performance metrics",
      icon: <HiOutlineChartBar className="w-8 h-8" />
    },
    {
      title: "Custom Integration",
      description: "Seamlessly integrate with your existing tools",
      icon: <HiOutlineCode className="w-8 h-8" />
    }
  ];

  return (
    <div ref={containerRef} className="min-h-screen text-white relative overflow-hidden">
      {/* Enhanced Dynamic Background */}
      <motion.div 
        className="fixed inset-0 z-0"
        style={{ y }}
      >
        <div className="absolute inset-0 bg-black" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
        
        {/* Enhanced Pulsing Light Effects */}
        <div className="absolute inset-0">
          <motion.div 
            className="absolute w-[1200px] h-[1200px] rounded-full left-1/4 -top-1/2 bg-gradient-to-r from-[#3CDFFF]/30 to-[#4AFFD4]/30 blur-[180px]"
            animate={{
              opacity: [0.2, 0.4, 0.2],
              scale: [1, 1.2, 1],
              x: [-30, 30, -30],
              y: [-30, 30, -30],
              rotate: [0, 45, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute w-[1200px] h-[1200px] rounded-full right-1/4 -bottom-1/2 bg-gradient-to-r from-[#4AFFD4]/30 to-[#3CDFFF]/30 blur-[180px]"
            animate={{
              opacity: [0.2, 0.4, 0.2],
              scale: [1, 1.2, 1],
              x: [30, -30, 30],
              y: [30, -30, 30],
              rotate: [0, -45, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          />
        </div>
        
        {/* Enhanced floating orbs with gradients */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-[${Math.random() * 500 + 300}px] h-[${Math.random() * 500 + 300}px] rounded-full blur-[120px] bg-gradient-to-r ${
              i % 3 === 0 ? 'from-[#3CDFFF]/25 to-[#4AFFD4]/25' :
              i % 3 === 1 ? 'from-[#4AFFD4]/25 to-[#3CDFFF]/25' :
              'from-[#3CDFFF]/25 via-[#4AFFD4]/25 to-[#3CDFFF]/25'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.15, 0.3, 0.15],
              scale: [1, 1.3, 1],
              x: [0, Math.random() * 150 - 75, 0],
              y: [0, Math.random() * 150 - 75, 0],
              rotate: [0, Math.random() * 90 - 45, 0],
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 3,
            }}
          />
        ))}
      </motion.div>

      {/* Hero Section */}
      <section className="relative z-10">
        <div className="container mx-auto max-w-7xl px-6 pt-24 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="max-w-4xl"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="inline-block mb-8"
            >
              <span className="px-6 py-2 rounded-full bg-gradient-to-r from-[#3CDFFF]/10 to-[#4AFFD4]/10 border border-[#3CDFFF]/20 text-[#3CDFFF] text-sm font-medium backdrop-blur-sm">
                Welcome to ISYNCSO
              </span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="text-6xl md:text-7xl lg:text-8xl font-bold mb-8 tracking-tight"
            >
              Empowering Your{" "}
              <span className="bg-gradient-to-r from-[#3CDFFF] via-[#4AFFD4] to-[#3CDFFF] text-transparent bg-clip-text">
                Digital Future
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.7 }}
              className="text-xl md:text-2xl text-[#3CDFFF]/90 mb-12 max-w-3xl leading-relaxed"
            >
              Transform your business with our suite of AI-powered solutions. From workflow automation to custom AI development.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.9 }}
              className="flex flex-col sm:flex-row gap-6"
            >
              <Link 
                href="/contact"
                className="group px-8 py-4 bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4] rounded-full font-semibold text-black hover:opacity-90 transition duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-[#3CDFFF]/25 flex items-center justify-center"
              >
                <span className="flex items-center justify-center">
                  Get Started
                  <motion.span
                    className="ml-2"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </span>
              </Link>
              <Link 
                href="#products"
                className="px-8 py-4 border-2 border-[#3CDFFF]/20 text-white rounded-full font-semibold hover:bg-white/10 hover:border-[#3CDFFF]/30 transition duration-300 backdrop-blur-sm flex items-center justify-center"
              >
                Explore Products
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="relative z-10 py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Our{" "}
              <span className="bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4] text-transparent bg-clip-text">
                Products
              </span>
            </h2>
            <p className="text-xl text-[#3CDFFF]/90">
              Discover our suite of AI-powered solutions
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-[#3CDFFF]/30 transition-all duration-300"
              >
                <div className={`text-[#3CDFFF] mb-6 bg-gradient-to-r ${product.gradient} p-3 rounded-xl inline-block`}>
                  {product.icon}
                </div>
                <h3 className="text-2xl font-semibold mb-4">{product.title}</h3>
                <p className="text-[#3CDFFF]/90 mb-6">{product.description}</p>
                <Link
                  href={product.link}
                  className="inline-flex items-center text-white hover:text-[#3CDFFF] transition-colors"
                >
                  Learn more
                  <motion.span
                    className="ml-2"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-20 bg-gradient-to-b from-transparent to-black/50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Why Choose{" "}
              <span className="bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4] text-transparent bg-clip-text">
                ISYNCSO
              </span>
            </h2>
            <p className="text-xl text-[#3CDFFF]/90">
              Enterprise-grade features for your success
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-[#3CDFFF]/30 transition-all duration-300"
              >
                <div className="text-[#3CDFFF] mb-6">{feature.icon}</div>
                <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-[#3CDFFF]/90">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-8">
              Ready to{" "}
              <span className="bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4] text-transparent bg-clip-text">
                Transform
              </span>
              {" "}Your Business?
            </h2>
            <p className="text-xl text-[#3CDFFF]/90 mb-12">
              Join the future of AI-powered automation. Start your journey with ISYNCSO today.
            </p>
            <Link 
              href="/contact"
              className="inline-block px-8 py-4 bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4] rounded-full font-semibold text-black hover:opacity-90 transition duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-[#3CDFFF]/25"
            >
              Get Started Now
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 