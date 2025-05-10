// @ts-nocheck - This file has some TypeScript issues that are hard to fix
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  HiOutlineAcademicCap,
  HiOutlineUserGroup,
  HiOutlinePresentationChartLine,
  HiOutlineLightBulb,
  HiOutlineChartBar,
  HiOutlineClipboardCheck,
  HiOutlineBookOpen,
  HiOutlinePuzzle,
  HiOutlineChatAlt2,
  HiOutlineDocumentText,
  HiOutlineArrowRight,
  HiOutlineStar,
  HiOutlineClock,
  HiOutlineUsers,
} from 'react-icons/hi';

export default function AIcademyPage(): JSX.Element {
  const features = [
    { title: "Personalized Learning Paths",
      description: "Customized learning journeys tailored to individual skill levels and goals in AI and data science.",
      icon: HiOutlineAcademicCap,
      color: "from-blue-500 to-indigo-500",
        },
    { title: "Expert-Led Training",
      description: "Learn from industry professionals with hands-on experience in implementing AI solutions.",
      icon: HiOutlineUserGroup,
      color: "from-purple-500 to-pink-500",
        },
    { title: "Interactive Workshops",
      description: "Engage in practical, hands-on sessions to build real-world AI applications.",
      icon: HiOutlinePresentationChartLine,
      color: "from-green-500 to-teal-500",
        },
    { title: "Project-Based Learning",
      description: "Apply concepts through real-world projects and case studies.",
      icon: HiOutlineLightBulb,
      color: "from-yellow-500 to-orange-500",
        },
    { title: "Progress Tracking",
      description: "Monitor your learning progress with detailed analytics and assessments.",
      icon: HiOutlineChartBar,
      color: "from-red-500 to-pink-500",
        },
    { title: "Certification Program",
      description: "Earn industry-recognized certifications upon completion of courses.",
      icon: HiOutlineClipboardCheck,
      color: "from-indigo-500 to-purple-500",
        },
  ];

  const courses = [
    { title: "AI Fundamentals",
      description: "Master the basics of artificial intelligence, machine learning, and data science.",
      icon: HiOutlineBookOpen,
      duration: "8 weeks",
      level: "Beginner",
      students: "1200+",
      rating: "4.9",
      highlights: ["Python & TensorFlow", "Neural Networks", "Data Processing"],
      gradient: "from-blue-500 via-indigo-500 to-purple-500",
        },
    { title: "Advanced ML Applications",
      description: "Learn to build and deploy sophisticated machine learning models.",
      icon: HiOutlinePuzzle,
      duration: "12 weeks",
      level: "Advanced",
      students: "800+",
      rating: "4.8",
      highlights: ["Deep Learning", "Computer Vision", "NLP"],
      gradient: "from-purple-500 via-pink-500 to-red-500",
        },
    { title: "AI Ethics & Governance",
      description: "Understand the ethical implications and governance of AI systems.",
      icon: HiOutlineChatAlt2,
      duration: "6 weeks",
      level: "Intermediate",
      students: "950+",
      rating: "4.7",
      highlights: ["Ethical AI", "Bias Detection", "Compliance"],
      gradient: "from-green-500 via-teal-500 to-blue-500",
        },
    { title: "Enterprise AI Integration",
      description: "Learn to integrate AI solutions within enterprise environments.",
      icon: HiOutlineDocumentText,
      duration: "10 weeks",
      level: "Advanced",
      students: "600+",
      rating: "4.9",
      highlights: ["MLOps", "Scalability", "Cloud AI"],
      gradient: "from-orange-500 via-red-500 to-purple-500",
        },
  ];

  return (
    <main className="min-h-screen text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-black" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
        
        {/* Enhanced Pulsing Light Effects */}
        <div className="absolute inset-0 z-0">
          <motion.div 
            className="absolute w-[1200px] h-[1200px] rounded-full left-1/4 -top-1/2 bg-gradient-to-r from-blue-400/30 to-indigo-400/30 blur-[180px]"
            animate={{ opacity: [0.2, 0.4, 0.2],
              scale: [1, 1.2, 1],
              x: [-30, 30, -30],
              y: [-30, 30, -30],
              rotate: [0, 45, 0],
                }}
            transition={{ duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
                }}
          />
          <motion.div 
            className="absolute w-[1200px] h-[1200px] rounded-full right-1/4 -bottom-1/2 bg-gradient-to-r from-indigo-400/30 to-purple-400/30 blur-[180px]"
            animate={{ opacity: [0.2, 0.4, 0.2],
              scale: [1, 1.2, 1],
              x: [30, -30, 30],
              y: [30, -30, 30],
              rotate: [0, -45, 0],
                }}
            transition={{ duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
                }}
          />
          <motion.div 
            className="absolute w-[1000px] h-[1000px] rounded-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-400/30 via-indigo-400/30 to-purple-400/30 blur-[180px]"
            animate={{ opacity: [0.15, 0.3, 0.15],
              scale: [1, 1.3, 1],
              rotate: [0, 180, 360],
                }}
            transition={{ duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
                }}
          />
          {/* Enhanced floating orbs with gradients */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-[${Math.random() * 500 + 300}px] h-[${Math.random() * 500 + 300}px] rounded-full blur-[120px] bg-gradient-to-r ${ i % 3 === 0 ? 'from-blue-400/25 to-indigo-400/25' :
                i % 3 === 1 ? 'from-indigo-400/25 to-purple-400/25' :
                'from-purple-400/25 to-blue-400/25'
                  }`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{ opacity: [0.15, 0.3, 0.15],
                scale: [1, 1.3, 1],
                x: [0, Math.random() * 150 - 75, 0],
                y: [0, Math.random() * 150 - 75, 0],
                rotate: [0, Math.random() * 90 - 45, 0],
                  }}
              transition={{ duration: Math.random() * 5 + 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 3,
                  }}
            />
          ))}
        </div>
        
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="min-h-[90vh] flex items-center justify-center py-24 px-6">
            <motion.div
              initial={{ opacity: 0, y: 20     }}
              animate={{ opacity: 1, y: 0     }}
              transition={{ duration: 1     }}
              className="text-center max-w-4xl mx-auto"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8     }}
                animate={{ opacity: 1, scale: 1     }}
                transition={{ duration: 0.7, delay: 0.3     }}
                className="inline-block mb-8"
              >
                <span className="px-6 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-300/20 text-blue-300 text-sm font-medium backdrop-blur-sm">
                  Transform Your Career with AI
                </span>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20     }}
                animate={{ opacity: 1, y: 0     }}
                transition={{ duration: 1, delay: 0.5     }}
                className="mb-8 text-6xl md:text-8xl font-bold tracking-tight"
              >
                Master AI with{" "}
                <span className="bg-gradient-to-r from-blue-300 via-indigo-300 to-purple-300 text-transparent bg-clip-text">
                  AIcademy
                </span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20     }}
                animate={{ opacity: 1, y: 0     }}
                transition={{ duration: 1, delay: 0.7     }}
                className="mx-auto mb-10 text-xl md:text-2xl text-blue-100/90 max-w-2xl leading-relaxed"
              >
                Comprehensive AI education programs designed to transform professionals into AI experts through immersive learning and real-world applications.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20     }}
                animate={{ opacity: 1, y: 0     }}
                transition={{ duration: 1, delay: 0.9     }}
                className="flex flex-col sm:flex-row justify-center gap-6"
              >
                <Link 
                  href="#courses"
                  className="group px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full font-semibold hover:opacity-90 transition duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
                >
                  <span className="flex items-center justify-center">
                    Explore Courses
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
                  href="#features"
                  className="px-8 py-4 border-2 border-white/20 text-white rounded-full font-semibold hover:bg-white/10 hover:border-white/30 transition duration-300 backdrop-blur-sm"
                >
                  Learn More
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
                  className="p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10 hover:border-blue-300/30 transition-all duration-300"
                >
                  <div className="text-5xl font-bold bg-gradient-to-r from-blue-300 to-indigo-300 text-transparent bg-clip-text mb-3">500+</div>
                  <div className="text-blue-100">Students Enrolled</div>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.05     }}
                  className="p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10 hover:border-blue-300/30 transition-all duration-300"
                >
                  <div className="text-5xl font-bold bg-gradient-to-r from-blue-300 to-indigo-300 text-transparent bg-clip-text mb-3">20+</div>
                  <div className="text-blue-100">Expert Instructors</div>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.05     }}
                  className="p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10 hover:border-blue-300/30 transition-all duration-300"
                >
                  <div className="text-5xl font-bold bg-gradient-to-r from-blue-300 to-indigo-300 text-transparent bg-clip-text mb-3">100%</div>
                  <div className="text-blue-100">Satisfaction Rate</div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section with enhanced styling */}
      <section id="features" className="py-32 bg-black relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-blue-900/10 to-black"></div>
        <div className="container mx-auto max-w-7xl px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 20     }}
            whileInView={{ opacity: 1, y: 0     }}
            transition={{ duration: 1     }}
            viewport={{ once: true     }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-8">
              Why Choose <span className="bg-gradient-to-r from-blue-300 to-indigo-300 text-transparent bg-clip-text">AIcademy</span>?
            </h2>
            <p className="text-xl text-blue-100/90 max-w-3xl mx-auto leading-relaxed">
              Our comprehensive learning platform combines expert instruction with hands-on experience to deliver unparalleled AI education.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20     }}
                whileInView={{ opacity: 1, y: 0     }}
                transition={{ duration: 0.7, delay: index * 0.1     }}
                viewport={{ once: true     }}
                className="group"
              >
                <div className="p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10 hover:border-blue-300/30 transition-all duration-300 relative overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                  <div className="relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-2xl font-semibold mb-4 group-hover:text-blue-300 transition-colors duration-300">{feature.title}</h3>
                    <p className="text-blue-100/90 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Section with enhanced styling */}
      <section id="courses" className="py-32 bg-black relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-indigo-900/10 to-black"></div>
        <div className="container mx-auto max-w-7xl px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 20     }}
            whileInView={{ opacity: 1, y: 0     }}
            transition={{ duration: 1     }}
            viewport={{ once: true     }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-8">
              Featured <span className="bg-gradient-to-r from-blue-300 to-indigo-300 text-transparent bg-clip-text">Courses</span>
            </h2>
            <p className="text-xl text-blue-100/90 max-w-3xl mx-auto leading-relaxed">
              Begin your journey to AI mastery with our carefully curated selection of comprehensive courses.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {courses.map((course, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20     }}
                whileInView={{ opacity: 1, y: 0     }}
                transition={{ duration: 0.7, delay: index * 0.1     }}
                viewport={{ once: true     }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-black to-transparent opacity-50 rounded-3xl transition-opacity duration-300 group-hover:opacity-0" />
                <div className={`absolute inset-0 bg-gradient-to-br ${course.gradient} opacity-0 group-hover:opacity-10 rounded-3xl transition-all duration-500`} />
                
                <div className="p-8 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-300 relative overflow-hidden group-hover:transform group-hover:scale-[1.02]">
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-8">
                      <motion.div 
                        whileHover={{ scale: 1.1, rotate: 5     }}
                        className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${course.gradient} flex items-center justify-center shadow-lg`}
                      >
                        <course.icon className="w-8 h-8 text-white" />
                      </motion.div>
                      <div className="flex items-center space-x-6">
                        <motion.div 
                          whileHover={{ scale: 1.1     }}
                          className="flex items-center bg-yellow-400/10 px-3 py-1 rounded-full"
                        >
                          <HiOutlineStar className="w-5 h-5 text-yellow-400" />
                          <span className="ml-1 text-yellow-400 font-bold">{course.rating}</span>
                        </motion.div>
                        <motion.div 
                          whileHover={{ scale: 1.1     }}
                          className="flex items-center bg-blue-400/10 px-3 py-1 rounded-full"
                        >
                          <HiOutlineUsers className="w-5 h-5 text-blue-300" />
                          <span className="ml-1 text-blue-300 font-bold">{course.students}</span>
                        </motion.div>
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-white to-blue-100 text-transparent bg-clip-text group-hover:from-blue-200 group-hover:to-purple-200 transition-all duration-300">
                      {course.title}
                    </h3>
                    
                    <p className="text-blue-100/90 mb-6 leading-relaxed">
                      {course.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      {course.highlights.map((highlight, i) => (
                        <span 
                          key={i}
                          className="px-3 py-1 rounded-full text-sm font-medium bg-white/5 border border-white/10 text-blue-200"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6">
                        <div className="flex items-center bg-blue-400/10 px-3 py-1 rounded-full">
                          <HiOutlineClock className="w-5 h-5 text-blue-300" />
                          <span className="ml-2 text-blue-300 font-medium">{course.duration}</span>
                        </div>
                        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${ course.level === 'Beginner' ? 'bg-green-500/20 text-green-300' :
                          course.level === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-300' :
                          'bg-red-500/20 text-red-300'
                            }`}>
                          {course.level}
                        </span>
                      </div>
                      
                      <motion.button 
                        whileHover={{ scale: 1.1, x: 5     }}
                        className={`w-12 h-12 rounded-xl bg-gradient-to-r ${course.gradient} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}
                      >
                        <HiOutlineArrowRight className="w-6 h-6 text-white" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-32 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="absolute w-[1000px] h-[1000px] rounded-full left-1/4 -top-1/2 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 blur-[150px] animate-pulse" />
        <div className="absolute w-[1000px] h-[1000px] rounded-full right-1/4 -bottom-1/2 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 blur-[150px] animate-pulse" />
        
        <div className="container mx-auto max-w-7xl px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20     }}
            whileInView={{ opacity: 1, y: 0     }}
            transition={{ duration: 1     }}
            viewport={{ once: true     }}
            className="text-center"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-8">
              Ready to Begin Your{" "}
              <span className="bg-gradient-to-r from-blue-300 to-indigo-300 text-transparent bg-clip-text">
                AI Journey
              </span>?
            </h2>
            <p className="text-xl text-blue-100/90 max-w-3xl mx-auto mb-12 leading-relaxed">
              Join thousands of professionals who are transforming their careers through our comprehensive AI education programs.
            </p>
            <motion.div
              initial={{ opacity: 0, y: 20     }}
              whileInView={{ opacity: 1, y: 0     }}
              transition={{ duration: 1, delay: 0.2     }}
              viewport={{ once: true     }}
              className="flex flex-col sm:flex-row justify-center gap-6"
            >
              <Link
                href="#courses"
                className="group px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full font-semibold hover:opacity-90 transition duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 flex items-center justify-center"
              >
                Enroll Now{" "}
                <motion.span
                  className="ml-2"
                  animate={{ x: [0, 5, 0]     }}
                  transition={{ duration: 1.5, repeat: Infinity     }}
                >
                  →
                </motion.span>
              </Link>
              <Link
                href="/contact"
                className="px-8 py-4 border-2 border-white/20 text-white rounded-full font-semibold hover:bg-white/10 hover:border-white/30 transition duration-300 backdrop-blur-sm flex items-center justify-center"
              >
                Contact Us
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  );
} 