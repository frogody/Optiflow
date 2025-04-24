import { motion } from 'framer-motion';
import Image from 'next/image';
import { FaLinkedin, FaTwitter, FaGithub } from 'react-icons/fa';

const teamMembers = [
  {
    name: 'Gody Duinsbergen',
    role: 'CEO & Founder',
    image: '/gody-duinsbergen-ai.png',
    bio: 'Visionary leader with 15+ years of experience in workflow optimization and business process automation.',
    social: {
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      github: 'https://github.com'
    }
  },
  {
    name: 'Maria Garcia',
    role: 'CTO',
    image: '/team/maria-garcia.jpg',
    bio: 'Tech innovator specializing in AI and machine learning applications for business optimization.',
    social: {
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      github: 'https://github.com'
    }
  },
  {
    name: 'James Wilson',
    role: 'Head of Product',
    image: '/team/james-wilson.jpg',
    bio: 'Product strategist focused on creating intuitive user experiences and scalable solutions.',
    social: {
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      github: 'https://github.com'
    }
  },
  {
    name: 'Aisha Patel',
    role: 'Lead Developer',
    image: '/team/aisha-patel.jpg',
    bio: 'Full-stack developer with expertise in modern web technologies and cloud architecture.',
    social: {
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      github: 'https://github.com'
    }
  }
];

export default function TeamSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-black to-[#0A0A0A]">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            Meet Our <span className="bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4] text-transparent bg-clip-text">Team</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            The passionate individuals behind Optiflow, dedicated to transforming your workflow experience.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden transform transition-all duration-300 hover:scale-105 border border-white/10 hover:border-[#3CDFFF]/30 hover:shadow-[0_0_30px_rgba(60,223,255,0.2)] group"
            >
              <div className="relative h-64">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
                    <a 
                      href={member.social.linkedin}
                      className="text-white hover:text-[#3CDFFF] transition-colors transform hover:scale-110"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaLinkedin size={24} />
                    </a>
                    <a 
                      href={member.social.twitter}
                      className="text-white hover:text-[#3CDFFF] transition-colors transform hover:scale-110"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaTwitter size={24} />
                    </a>
                    <a 
                      href={member.social.github}
                      className="text-white hover:text-[#3CDFFF] transition-colors transform hover:scale-110"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaGithub size={24} />
                    </a>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-1 group-hover:text-[#3CDFFF] transition-colors duration-300">
                  {member.name}
                </h3>
                <p className="text-[#3CDFFF] mb-3">{member.role}</p>
                <p className="text-gray-300 mb-4 group-hover:text-white transition-colors duration-300">
                  {member.bio}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 