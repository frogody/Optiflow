'use client';


// Force dynamic rendering to avoid static generation issues
export const dynamic = 'force-dynamic';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { FaLinkedin, FaTwitter } from 'react-icons/fa';
import { 
  HiOutlineChartBar, 
  HiOutlineCog, 
  HiOutlineDocumentReport,
  HiOutlineLightningBolt,
  HiOutlineServer,
  HiOutlineShieldCheck
} from 'react-icons/hi';

// All imported icons and components are used in the UI (features, team, and testimonials).

export default function FeaturesPage(): JSX.Element {
  // Features data
  const features = [
    { title: "Drag-and-Drop Workflow Builder",
      description: "Create automated workflows with our intuitive visual builder. No coding required.",
      icon: <HiOutlineCog className="w-8 h-8" />,
      color: "from-blue-500 to-cyan-400"
        },
    { title: "700+ App Integrations",
      description: "Connect with all your favorite tools and services through our extensive library of pre-built integrations.",
      icon: <HiOutlineLightningBolt className="w-8 h-8" />,
      color: "from-purple-500 to-indigo-500"
        },
    { title: "Advanced Analytics Dashboard",
      description: "Monitor workflow performance, track success rates, and identify bottlenecks with detailed analytics.",
      icon: <HiOutlineChartBar className="w-8 h-8" />,
      color: "from-green-500 to-emerald-400"
        },
    { title: "API Management",
      description: "Streamline API connections with our built-in management tools. Test, monitor, and implement APIs with ease.",
      icon: <HiOutlineServer className="w-8 h-8" />,
      color: "from-orange-500 to-amber-400"
        },
    { title: "Enterprise-Grade Security",
      description: "Rest easy with SOC 2 compliance, end-to-end encryption, and advanced authorization controls.",
      icon: <HiOutlineShieldCheck className="w-8 h-8" />,
      color: "from-red-500 to-rose-400"
        },
    { title: "Automated Reporting",
      description: "Generate comprehensive reports on your workflows and share insights with stakeholders.",
      icon: <HiOutlineDocumentReport className="w-8 h-8" />,
      color: "from-teal-500 to-cyan-400"
        }
  ];

  // Updated testimonials data with more diverse voices
  const testimonials = [
    { name: "Sarah Chen",
      role: "Head of Operations at TechFlow",
      image: "/testimonials/sarah-chen.jpg",
      quote: "Optiflow has transformed how we handle our daily operations. The automation capabilities have saved us countless hours of manual work.",
      company: "TechFlow Solutions"
        },
    { name: "Marcus Rodriguez",
      role: "Digital Marketing Director",
      image: "/testimonials/marcus-rodriguez.jpg",
      quote: "The integration possibilities are endless. We've connected all our marketing tools and the results have been incredible.",
      company: "Growth Pioneers"
        },
    { name: "Dr. Emily Watson",
      role: "Research Lead",
      image: "/testimonials/emily-watson.jpg",
      quote: "The analytical capabilities and reporting features have given us insights we never had before. It's been a game-changer.",
      company: "BioTech Innovations"
        },
    { name: "Alex Thompson",
      role: "CTO",
      image: "/testimonials/alex-thompson.jpg",
      quote: "The developer experience is outstanding. The API documentation and SDKs made integration a breeze.",
      company: "InnovateX"
        },
    { name: "Priya Sharma",
      role: "Operations Manager",
      image: "/testimonials/priya-sharma.jpg",
      quote: "The customer support team is exceptional. They've helped us optimize our workflows and achieve better results.",
      company: "Global Logistics Inc"
        },
    { name: "Michael Chen",
      role: "Product Manager",
      image: "/testimonials/michael-chen.jpg",
      quote: "The flexibility of the platform allows us to adapt quickly to changing business needs. It's been invaluable.",
      company: "TechVision"
        }
  ];

  // Updated team members with more diverse roles
  const teamMembers = [
    { name: "Gody Duinsbergen",
      role: "Founder & CEO",
      image: "/gody-duinsbergen-ai.png",
      bio: "Former ML Engineer at Google, passionate about making AI accessible to everyone.",
      linkedin: "https://linkedin.com/in/davidpark",
      twitter: "https://twitter.com/davidpark"
        },
    { name: "Maria Garcia",
      role: "Head of Product",
      image: "/team/maria-garcia.jpg",
      bio: "10+ years in product development, focused on creating intuitive user experiences.",
      linkedin: "https://linkedin.com/in/mariagarcia",
      twitter: "https://twitter.com/mariagarcia"
        },
    { name: "James Wilson",
      role: "Lead Engineer",
      image: "/team/james-wilson.jpg",
      bio: "Distributed systems expert, building reliable and scalable automation infrastructure.",
      linkedin: "https://linkedin.com/in/jameswilson",
      twitter: "https://twitter.com/jameswilson"
        },
    { name: "Aisha Patel",
      role: "Customer Success Lead",
      image: "/team/aisha-patel.jpg",
      bio: "Dedicated to helping teams achieve their automation goals and maximize ROI.",
      linkedin: "https://linkedin.com/in/aishapatel",
      twitter: "https://twitter.com/aishapatel"
        },
    { name: "Lucas Silva",
      role: "UX Designer",
      image: "/team/lucas-silva.jpg",
      bio: "Creating beautiful and functional interfaces that users love to interact with.",
      linkedin: "https://linkedin.com/in/lucassilva",
      twitter: "https://twitter.com/lucassilva"
        },
    { name: "Sophie Kim",
      role: "Data Scientist",
      image: "/team/sophie-kim.jpg",
      bio: "Leveraging data to build intelligent automation solutions that drive business value.",
      linkedin: "https://linkedin.com/in/sophiekim",
      twitter: "https://twitter.com/sophiekim"
        }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0     },
    visible: {
  opacity: 1,
      transition: {
  staggerChildren: 0.1
          }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0     },
    visible: {
  y: 0,
      opacity: 1,
      transition: { duration: 0.5     }
    }
  };

  return (
    <div className="min-h-screen text-white" style={{ background: 'linear-gradient(to bottom, #000000, #0A0A0A)'     }}>
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute w-[400px] h-[400px] rounded-full left-1/4 top-1/4 bg-[#3CDFFF] opacity-10 blur-[120px]"></div>
        <div className="absolute w-[400px] h-[400px] rounded-full right-1/4 bottom-1/3 bg-[#4AFFD4] opacity-10 blur-[120px]"></div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30     }}
            animate={{ opacity: 1, y: 0     }}
            transition={{ duration: 0.8     }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 tracking-tight">
              Powerful Features for{" "}
              <span className="bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4] text-transparent bg-clip-text">
                Seamless Automation
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Discover how our platform can transform your workflow automation with these powerful capabilities.
            </p>
          </motion.div>
        </div>
      </section>
      
      {/* Features Grid */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="feature-card p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm relative overflow-hidden group hover:border-[#3CDFFF]/50 hover:bg-white/10 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
              >
                <div className={`absolute -right-20 -top-20 w-60 h-60 rounded-full bg-gradient-to-r ${feature.color} opacity-10 blur-3xl group-hover:opacity-30 transition-all duration-500`}></div>
                
                <div className="relative z-10">
                  <div className="mb-6 text-[#3CDFFF] transform group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  
                  <h3 className="text-2xl font-semibold mb-4 group-hover:text-[#3CDFFF] transition-colors duration-300">{feature.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#3CDFFF]/5 to-black"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20     }}
            whileInView={{ opacity: 1, y: 0     }}
            transition={{ duration: 0.8     }}
            viewport={{ once: true     }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Trusted by Industry <span className="bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4] text-transparent bg-clip-text">Leaders</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              See how professionals across different industries are transforming their workflows with Optiflow.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20     }}
                whileInView={{ opacity: 1, y: 0     }}
                transition={{ duration: 0.5, delay: index * 0.1     }}
                viewport={{ once: true     }}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-[#3CDFFF]/30 transition-all duration-300 group hover:shadow-[0_0_30px_rgba(60,223,255,0.2)]"
              >
                <div className="flex items-center mb-6">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4 group-hover:ring-2 group-hover:ring-[#3CDFFF] transition-all duration-300">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white group-hover:text-[#3CDFFF] transition-colors duration-300">{testimonial.name}</h3>
                    <p className="text-[#3CDFFF]">{testimonial.role}</p>
                    <p className="text-sm text-gray-400">{testimonial.company}</p>
                  </div>
                </div>
                <blockquote className="text-gray-300 leading-relaxed group-hover:text-white transition-colors duration-300">
                  "{testimonial.quote}"
                </blockquote>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Team Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#4AFFD4]/5 to-black"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20     }}
            whileInView={{ opacity: 1, y: 0     }}
            transition={{ duration: 0.8     }}
            viewport={{ once: true     }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Meet the <span className="bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4] text-transparent bg-clip-text">Team</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We're a diverse team of engineers, designers, and automation experts passionate about transforming how teams work.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20     }}
                whileInView={{ opacity: 1, y: 0     }}
                transition={{ duration: 0.5, delay: index * 0.1     }}
                viewport={{ once: true     }}
                className="text-center group"
              >
                <div className="relative w-48 h-48 mx-auto mb-6 rounded-2xl overflow-hidden group-hover:scale-105 transition-transform duration-300">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white hover:text-[#3CDFFF] transition-colors transform hover:scale-110"
                      >
                        <FaLinkedin size={24} />
                      </a>
                      <a
                        href={member.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white hover:text-[#3CDFFF] transition-colors transform hover:scale-110"
                      >
                        <FaTwitter size={24} />
                      </a>
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-[#3CDFFF] transition-colors duration-300">{member.name}</h3>
                <p className="text-[#3CDFFF] mb-3">{member.role}</p>
                <p className="text-gray-300 text-sm mb-4 group-hover:text-white transition-colors duration-300">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Customer Stories Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#3CDFFF]/5 to-black"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20     }}
            whileInView={{ opacity: 1, y: 0     }}
            transition={{ duration: 0.8     }}
            viewport={{ once: true     }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Customer <span className="bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4] text-transparent bg-clip-text">Success Stories</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Discover how our customers are achieving remarkable results with Optiflow.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20     }}
              whileInView={{ opacity: 1, x: 0     }}
              transition={{ duration: 0.8     }}
              viewport={{ once: true     }}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-[#3CDFFF]/30 transition-all duration-300 group hover:shadow-[0_0_30px_rgba(60,223,255,0.2)]"
            >
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 rounded-full bg-[#3CDFFF]/20 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl font-bold text-[#3CDFFF]">75%</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white group-hover:text-[#3CDFFF] transition-colors duration-300">Increased Efficiency</h3>
                  <p className="text-gray-400">TechFlow Solutions</p>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed group-hover:text-white transition-colors duration-300">
                "By implementing Optiflow's automation solutions, we reduced manual work by 75% and improved our team's productivity significantly."
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20     }}
              whileInView={{ opacity: 1, x: 0     }}
              transition={{ duration: 0.8     }}
              viewport={{ once: true     }}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-[#4AFFD4]/30 transition-all duration-300 group hover:shadow-[0_0_30px_rgba(74,255,212,0.2)]"
            >
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 rounded-full bg-[#4AFFD4]/20 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl font-bold text-[#4AFFD4]">3x</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white group-hover:text-[#4AFFD4] transition-colors duration-300">Faster Deployment</h3>
                  <p className="text-gray-400">Growth Pioneers</p>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed group-hover:text-white transition-colors duration-300">
                "Our deployment process is now 3x faster thanks to Optiflow's streamlined workflows and automation capabilities."
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#3CDFFF]/5 to-[#4AFFD4]/5"></div>
        <div className="absolute w-[600px] h-[600px] rounded-full left-1/4 -top-1/2 bg-[#3CDFFF] opacity-10 blur-[120px]"></div>
        <div className="absolute w-[600px] h-[600px] rounded-full right-1/4 -bottom-1/2 bg-[#4AFFD4] opacity-10 blur-[120px]"></div>
        
        <div className="container mx-auto px-4 relative">
          <motion.div 
            initial={{ opacity: 0, y: 30     }}
            whileInView={{ opacity: 1, y: 0     }}
            transition={{ duration: 0.8     }}
            viewport={{ once: true     }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-8">
              Ready to Transform Your{" "}
              <span className="bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4] text-transparent bg-clip-text">
                Workflow?
              </span>
            </h2>
            
            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Join thousands of teams that use our platform to automate their work and boost productivity.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center space-y-6 sm:space-y-0 sm:space-x-6">
              <Link 
                href="/signup" 
                className="px-10 py-4 bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4] rounded-xl text-black text-lg font-semibold hover:opacity-90 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                Start Free Trial
              </Link>
              
              <Link 
                href="/pricing" 
                className="px-10 py-4 border-2 border-[#3CDFFF] text-[#3CDFFF] rounded-xl text-lg font-semibold hover:bg-[#3CDFFF]/10 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                View Pricing
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 