'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { HiOutlineQuote } from 'react-icons/hi2';

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'CTO',
    company: 'TechFlow Solutions',
    image: '/testimonials/sarah-chen.jpg',
    quote:
      'Optiflow transformed our development workflow. The automation tools have saved us countless hours and reduced errors significantly.',
  },
  {
    name: 'Marcus Rodriguez',
    role: 'Engineering Manager',
    company: 'InnovateX',
    image: '/testimonials/marcus-rodriguez.jpg',
    quote:
      "The integration capabilities are outstanding. We've connected all our tools seamlessly, creating a truly unified development environment.",
  },
  {
    name: 'Emily Watson',
    role: 'Product Lead',
    company: 'Digital Dynamics',
    image: '/testimonials/emily-watson.jpg',
    quote:
      "The analytics dashboard gives us real-time insights into our development process. It's been a game-changer for our team's productivity.",
  },
];

function TestimonialsSection() {
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
            Trusted by Industry{' '}
            <span className="bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4] text-transparent bg-clip-text">
              Leaders
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            See how professionals across different industries are transforming
            their workflows with our solutions.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-[#3CDFFF]/30 transition-all duration-300 group hover:shadow-[0_0_30px_rgba(60,223,255,0.2)]"
            >
              <div className="text-[#3CDFFF] mb-6">
                <HiOutlineQuote className="w-6 h-6 text-[#3CDFFF]" />
              </div>
              <blockquote className="text-gray-300 leading-relaxed mb-8 group-hover:text-white transition-colors duration-300">
                "{testimonial.quote}"
              </blockquote>
              <div className="flex items-center">
                <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4 group-hover:ring-2 group-hover:ring-[#3CDFFF] transition-all duration-300">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white group-hover:text-[#3CDFFF] transition-colors duration-300">
                    {testimonial.name}
                  </h3>
                  <p className="text-[#3CDFFF] text-sm">{testimonial.role}</p>
                  <p className="text-sm text-gray-400">{testimonial.company}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TestimonialsSection;
