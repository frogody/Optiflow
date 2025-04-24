import { motion } from 'framer-motion';
import { 
  HiOutlineLightningBolt, 
  HiOutlineShieldCheck, 
  HiOutlineChartBar,
  HiOutlineCog,
  HiOutlineCode,
  HiOutlineAcademicCap
} from 'react-icons/hi';
import Link from 'next/link';

const services = [
  {
    icon: <HiOutlineLightningBolt className="w-8 h-8" />,
    title: "AI Workflow Automation",
    description: "Streamline your operations with intelligent automation that adapts to your business needs.",
    link: "/products/optiflow"
  },
  {
    icon: <HiOutlineShieldCheck className="w-8 h-8" />,
    title: "Security & Compliance",
    description: "Enterprise-grade security with full compliance for regulated industries.",
    link: "/services/security-compliance"
  },
  {
    icon: <HiOutlineChartBar className="w-8 h-8" />,
    title: "Analytics & Insights",
    description: "Real-time analytics and actionable insights to drive informed decisions.",
    link: "/services/analytics"
  },
  {
    icon: <HiOutlineCog className="w-8 h-8" />,
    title: "Custom Integration",
    description: "Seamlessly connect with your existing tools and workflows.",
    link: "/services/custom-integration"
  },
  {
    icon: <HiOutlineCode className="w-8 h-8" />,
    title: "API Development",
    description: "Robust APIs built for scale with comprehensive documentation.",
    link: "/services/api-development"
  },
  {
    icon: <HiOutlineAcademicCap className="w-8 h-8" />,
    title: "Training & Support",
    description: "Comprehensive training and 24/7 expert support for your team.",
    link: "/products/aicademy"
  }
];

export default function ServicesSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-[#0A0A0A] to-black relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute w-[500px] h-[500px] rounded-full left-1/4 -top-1/4 bg-[#3CDFFF] opacity-[0.15] blur-[120px]" />
      <div className="absolute w-[500px] h-[500px] rounded-full right-1/4 -bottom-1/4 bg-[#4AFFD4] opacity-[0.15] blur-[120px]" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Our <span className="bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4] text-transparent bg-clip-text">Services</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Comprehensive solutions to transform your business with cutting-edge AI technology
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <Link href={service.link}>
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-[#3CDFFF]/30 transition-all duration-300 h-full hover:shadow-[0_0_30px_rgba(60,223,255,0.2)]">
                  <div className="text-[#3CDFFF] mb-6 group-hover:scale-110 transition-transform duration-300">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-[#3CDFFF] transition-colors duration-300">
                    {service.title}
                  </h3>
                  <p className="text-gray-300 group-hover:text-white transition-colors duration-300">
                    {service.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 