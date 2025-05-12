import { motion } from 'framer-motion';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="flex-1 relative flex flex-col items-center justify-center pt-16 md:pt-20 pb-24 md:pb-32 overflow-hidden bg-gradient-to-b from-black to-[#0A0A0A]">
      {/* Glow Effects */}
      <div className="absolute w-[400px] h-[400px] rounded-full left-1/4 top-1/4 bg-[#3CDFFF] opacity-10 blur-[120px]"></div>
      <div className="absolute w-[400px] h-[400px] rounded-full right-1/4 bottom-1/3 bg-[#4AFFD4] opacity-10 blur-[120px]"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-4xl mx-auto px-4 relative z-10"
      >
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl md:text-6xl font-bold mb-6 text-white"
        >
          The <span className="bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4] text-transparent bg-clip-text">Automation Platform</span> For Your <span className="bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4] text-transparent bg-clip-text">Workflow</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-xl text-gray-300 mb-8"
        >
          Connect your favorite tools, automate your workflows, and boost productivity with our AI-powered orchestration platform.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/consultation"
            className="px-8 py-3 bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4] text-black font-medium rounded-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            Schedule a Consultation
          </Link>
          <Link
            href="#services"
            className="px-8 py-3 border border-[#3CDFFF] text-[#3CDFFF] font-medium rounded-lg hover:bg-[#3CDFFF]/10 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            Explore Our Solutions
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
