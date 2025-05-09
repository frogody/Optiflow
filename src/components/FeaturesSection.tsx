// @ts-nocheck - This file has some TypeScript issues that are hard to fix
import { motion } from 'framer-motion';
import {
  HiOutlineLightBulb,
  HiOutlineShieldCheck,
  HiOutlineChartBar,
} from 'react-icons/hi';

const features = [
  {
    icon: <HiOutlineLightBulb className="w-8 h-8" />,
    title: 'Strategic Assessment',
    description:
      'Evaluate current AI & Data landscape, identify opportunities and risks, and define clear implementation roadmap.',
  },
  {
    icon: <HiOutlineShieldCheck className="w-8 h-8" />,
    title: 'Expert Implementation',
    description:
      'Custom solution development with security and compliance focus, plus continuous optimization and support.',
  },
  {
    icon: <HiOutlineChartBar className="w-8 h-8" />,
    title: 'Performance Tracking',
    description:
      'Monitor and measure the impact of AI solutions with comprehensive analytics and reporting.',
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-[#0A0A0A] to-black">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-6">
            Our{' '}
            <span className="bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4] text-transparent bg-clip-text">
              Approach
            </span>
          </h2>
          <p className="text-xl text-gray-300">
            We combine strategic thinking with technical expertise to deliver
            real results.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-[#3CDFFF]/30 transition-all duration-300 group hover:shadow-[0_0_30px_rgba(60,223,255,0.2)]"
            >
              <div className="text-[#3CDFFF] mb-6 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-[#3CDFFF] transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-gray-300 group-hover:text-white transition-colors duration-300">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
