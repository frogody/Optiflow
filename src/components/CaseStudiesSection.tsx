import { motion } from 'framer-motion';
import Link from 'next/link';
import { HiArrowRight } from 'react-icons/hi';

const caseStudies = [
  {
    industry: 'Healthcare',
    title: 'AI-Powered Patient Care',
    description:
      'Implemented automated workflow system reducing patient wait times by 45% and improving care coordination.',
    metrics: [
      { label: 'Reduced Wait Times', value: '45%' },
      { label: 'Staff Efficiency', value: '+60%' },
      { label: 'Patient Satisfaction', value: '92%' },
    ],
    link: '/case-studies/healthcare',
  },
  {
    industry: 'Finance',
    title: 'Automated Risk Assessment',
    description:
      'Developed AI-driven risk assessment system for a leading financial institution, processing applications 5x faster.',
    metrics: [
      { label: 'Faster Processing', value: '5x' },
      { label: 'Accuracy Rate', value: '99.9%' },
      { label: 'Cost Reduction', value: '35%' },
    ],
    link: '/case-studies/finance',
  },
  {
    industry: 'Manufacturing',
    title: 'Smart Factory Optimization',
    description:
      'Implemented IoT and AI solutions to optimize production line efficiency and reduce downtime.',
    metrics: [
      { label: 'Downtime Reduction', value: '75%' },
      { label: 'Production Increase', value: '40%' },
      { label: 'Energy Savings', value: '30%' },
    ],
    link: '/case-studies/manufacturing',
  },
];

export default function CaseStudiesSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-black to-[#0A0A0A] relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute w-[500px] h-[500px] rounded-full right-1/4 -top-1/4 bg-[#4AFFD4] opacity-[0.15] blur-[120px]" />
      <div className="absolute w-[500px] h-[500px] rounded-full left-1/4 -bottom-1/4 bg-[#3CDFFF] opacity-[0.15] blur-[120px]" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Success{' '}
            <span className="bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4] text-transparent bg-clip-text">
              Stories
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Real results from real clients. See how we've helped businesses
            transform their operations.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {caseStudies.map((study, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <Link href={study.link}>
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-[#3CDFFF]/30 transition-all duration-300 h-full hover:shadow-[0_0_30px_rgba(60,223,255,0.2)]">
                  <div className="mb-6">
                    <span className="text-[#3CDFFF] text-sm font-medium">
                      {study.industry}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-[#3CDFFF] transition-colors duration-300">
                    {study.title}
                  </h3>
                  <p className="text-gray-300 mb-6 group-hover:text-white transition-colors duration-300">
                    {study.description}
                  </p>

                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {study.metrics.map((metric, idx) => (
                      <div key={idx} className="text-center">
                        <div className="text-[#4AFFD4] text-xl font-bold mb-1">
                          {metric.value}
                        </div>
                        <div className="text-gray-400 text-sm">
                          {metric.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center text-[#3CDFFF] group-hover:translate-x-2 transition-transform duration-300">
                    <span className="mr-2">Learn More</span>
                    <HiArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
