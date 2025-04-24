import { motion } from 'framer-motion';
import Link from 'next/link';
import { HiArrowRight, HiOutlineLightningBolt, HiOutlineShieldCheck } from 'react-icons/hi';

const benefits = [
  {
    icon: <HiOutlineLightningBolt className="w-6 h-6" />,
    text: "Get started in minutes"
  },
  {
    icon: <HiOutlineShieldCheck className="w-6 h-6" />,
    text: "No credit card required"
  }
];

export default function CTA() {
  return (
    <section className="py-24 bg-gradient-to-b from-black to-[#0A0A0A] relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute w-[500px] h-[500px] rounded-full left-1/4 -top-1/4 bg-[#3CDFFF] opacity-[0.15] blur-[120px]" />
      <div className="absolute w-[500px] h-[500px] rounded-full right-1/4 -bottom-1/4 bg-[#4AFFD4] opacity-[0.15] blur-[120px]" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Start Your <span className="bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4] text-transparent bg-clip-text">AI Transformation</span> Journey
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              Ready to transform your business with AI? Let's start with a conversation about your goals.
            </p>
            <div className="flex justify-center gap-4 mb-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center text-gray-300">
                  <span className="text-[#3CDFFF] mr-2">{benefit.icon}</span>
                  <span>{benefit.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-[#3CDFFF]/30 transition-all duration-300 text-center">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-block"
            >
              <Link
                href="/consultation"
                className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4] text-black font-medium rounded-lg transition-all duration-300 hover:shadow-[0_0_30px_rgba(60,223,255,0.3)]"
              >
                <span className="mr-2">Schedule Your Free Consultation</span>
                <HiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </motion.div>
            
            <p className="text-gray-400 text-sm mt-4">
              Join 500+ companies already transforming their operations
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 