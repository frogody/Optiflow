'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import styles from './styles.module.css';

export default function AIFactoryPage(): JSX.Element {
  const [idea, setIdea] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0     });
  
  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  
  // Handle mouse movement for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      document.documentElement.style.setProperty('--cursor-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--cursor-y', `${e.clientY}px`);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Store the idea or send to backend
    console.log('Idea submitted:', idea);
    setSubmitted(true);
    // Reset form after 3 seconds
    setTimeout(() => {
      setIdea('');
      setSubmitted(false);
    }, 3000);
  };
  
  return (
    <div 
      className={`min-h-screen relative overflow-hidden bg-gradient-to-br from-black via-gray-950 to-black ${styles['dynamicBackground']}`}
    >
      {/* Tech-inspired grid background */}
      <div className="absolute inset-0 z-0 tech-grid"></div>
      
      {/* Animated circuit paths */}
      <div className="absolute inset-0 z-0 overflow-hidden circuit-container">
        <div className="circuit circuit-1"></div>
        <div className="circuit circuit-2"></div>
        <div className="circuit circuit-3"></div>
      </div>
      
      {/* Space background with stars - pure CSS */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0">
          <div className="stars"></div>
          <div className="stars2"></div>
          <div className="stars3"></div>
          
          {/* Animated nebula effect */}
          <div className="nebula nebula-1"></div>
          <div className="nebula nebula-2"></div>
          <div className="nebula nebula-3"></div>
        </div>
      </div>
      
      {/* Digital particles */}
      <div className="digital-particles-container">
        {[...Array(30)].map((_, i) => (
          <div 
            key={i} 
            className={styles['digitalParticle']}
            style={{
              '--size': `${Math.random() * 6 + 2}px`,
              '--top': `${Math.random() * 100}%`,
              '--left': `${Math.random() * 100}%`,
              '--opacity': Math.random() * 0.7 + 0.3,
              '--speed': `${Math.random() * 15 + 5}s`,
              '--delay': `${Math.random() * 5}s`,
              '--color': Math.random() > 0.5 ? '#3CDFFF' : '#4AFFD4'
            } as React.CSSProperties}
          ></div>
        ))}
      </div>
      
      {/* Floating 3D planets */}
      <div className="absolute left-[10%] top-[15%] w-20 h-20 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 opacity-70 shadow-glow animate-float z-10 planet">
        <div className="absolute inset-2 rounded-full bg-gradient-to-tl from-blue-300 to-transparent opacity-80"></div>
        <div className="h-full w-full rounded-full tech-pattern-overlay"></div>
      </div>
      <div className="absolute right-[15%] top-[25%] w-12 h-12 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 opacity-70 shadow-glow-intense animate-float-slow z-10 planet">
        <div className="absolute inset-1 rounded-full bg-gradient-to-tl from-purple-300 to-transparent opacity-80"></div>
        <div className="h-full w-full rounded-full tech-pattern-overlay"></div>
      </div>
      <div className="absolute left-[20%] bottom-[20%] w-16 h-16 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 opacity-70 shadow-neon-secondary animate-float-medium z-10 planet">
        <div className="absolute inset-1.5 rounded-full bg-gradient-to-tl from-teal-300 to-transparent opacity-80"></div>
        <div className="h-full w-full rounded-full tech-pattern-overlay"></div>
      </div>
      
      {/* Enhanced Tech Astronaut SVG */}
      <div className="absolute right-4 bottom-4 md:right-10 md:bottom-20 w-40 h-40 md:w-80 md:h-80 z-10 animate-float-astronaut tech-astronaut">
        <div className="absolute inset-0 rounded-full bg-[#3CDFFF]/10 filter blur-xl pulse-effect"></div>
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_0_15px_rgba(60,223,255,0.5)]">
          {/* Helmet */}
          <ellipse cx="100" cy="70" rx="35" ry="35" fill="#E0E0FF" stroke="#3CDFFF" strokeWidth="2" strokeDasharray="2 1" className="animate-pulse-slow">
            <animate attributeName="stroke-opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="100" cy="70" rx="28" ry="28" fill="url(#helmet-gradient)" opacity="0.9">
            <animate attributeName="rx" values="28;29;28" dur="5s" repeatCount="indefinite" />
            <animate attributeName="ry" values="28;27;28" dur="5s" repeatCount="indefinite" />
          </ellipse>
          
          {/* Tech HUD elements inside helmet */}
          <path d="M90 65 L95 68 L90 71" stroke="#3CDFFF" strokeWidth="0.5" opacity="0.8" className="tech-element">
            <animate attributeName="opacity" values="0.5;1;0.5" dur="3s" repeatCount="indefinite" />
          </path>
          <path d="M110 65 L105 68 L110 71" stroke="#3CDFFF" strokeWidth="0.5" opacity="0.8" className="tech-element">
            <animate attributeName="opacity" values="0.5;1;0.5" dur="3s" repeatCount="indefinite" begin="1s" />
          </path>
          <circle cx="100" cy="73" r="2" stroke="#3CDFFF" strokeWidth="0.5" opacity="0.8" className="tech-element" />
          <circle cx="100" cy="73" r="4" stroke="#3CDFFF" strokeWidth="0.5" opacity="0.5" className="tech-element">
            <animate attributeName="r" values="4;5;4" dur="2s" repeatCount="indefinite" />
          </circle>
          
          {/* Visor */}
          <path d="M80 65C80 55 90 50 100 50C110 50 120 55 120 65C120 75 110 80 100 80C90 80 80 75 80 65Z" fill="url(#visor-gradient)">
            <animate attributeName="d" values="M80 65C80 55 90 50 100 50C110 50 120 55 120 65C120 75 110 80 100 80C90 80 80 75 80 65Z;M82 65C82 55 90 50 100 50C110 50 118 55 118 65C118 75 110 80 100 80C90 80 82 75 82 65Z;M80 65C80 55 90 50 100 50C110 50 120 55 120 65C120 75 110 80 100 80C90 80 80 75 80 65Z" dur="8s" repeatCount="indefinite" />
          </path>
          
          {/* Digital data across visor - scrolling text effect */}
          <text x="90" y="65" fill="#3CDFFF" fontSize="3" opacity="0.7" className="tech-text">
            <animate attributeName="y" values="65;67;65" dur="10s" repeatCount="indefinite" />
            01010111
          </text>
          <text x="95" y="72" fill="#4AFFD4" fontSize="2.5" opacity="0.5" className="tech-text">
            <animate attributeName="y" values="72;70;72" dur="8s" repeatCount="indefinite" />
            SYSTEM ACTIVE
          </text>
          
          {/* Reflection on helmet */}
          <ellipse cx="115" cy="60" rx="10" ry="8" fill="white" opacity="0.2">
            <animate attributeName="opacity" values="0.1;0.3;0.1" dur="3s" repeatCount="indefinite" />
          </ellipse>
          
          {/* Body */}
          <path d="M70 85C70 85 65 120 65 130C65 140 80 155 100 155C120 155 135 140 135 130C135 120 130 85 130 85" fill="white" stroke="#4AFFD4" strokeWidth="2" strokeDasharray="1 2" className="tech-suit">
            <animate attributeName="stroke-dashoffset" values="0;10;0" dur="10s" repeatCount="indefinite" />
          </path>
          
          {/* Tech design on suit */}
          <path d="M85 105C85 105 90 110 100 110C110 110 115 105 115 105" stroke="#3CDFFF" strokeWidth="1" opacity="0.8" className="tech-lines" />
          <path d="M85 115C85 115 90 120 100 120C110 120 115 115 115 115" stroke="#3CDFFF" strokeWidth="1" opacity="0.8" className="tech-lines" />
          <path d="M85 125C85 125 90 130 100 130C110 130 115 125 115 125" stroke="#3CDFFF" strokeWidth="1" opacity="0.8" className="tech-lines" />
          
          <circle cx="95" cy="110" r="2" fill="#3CDFFF" opacity="0.8" className="tech-dot">
            <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="105" cy="110" r="2" fill="#3CDFFF" opacity="0.8" className="tech-dot">
            <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" begin="0.6s" />
          </circle>
          <circle cx="95" cy="120" r="2" fill="#3CDFFF" opacity="0.8" className="tech-dot">
            <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" begin="1.2s" />
          </circle>
          <circle cx="105" cy="120" r="2" fill="#3CDFFF" opacity="0.8" className="tech-dot">
            <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" begin="1.8s" />
          </circle>
          
          {/* Backpack with tech display */}
          <rect x="75" y="95" width="50" height="35" rx="5" fill="#DDDDDD" stroke="#4AFFD4" strokeWidth="2" className="tech-backpack">
            <animate attributeName="stroke-dasharray" values="0 8;8 8;0 8" dur="4s" repeatCount="indefinite" />
          </rect>
          <rect x="85" y="105" width="30" height="15" rx="2" fill="#000720" stroke="#3CDFFF" strokeWidth="0.5" opacity="0.9" className="tech-screen" />
          
          {/* Screen Content */}
          <line x1="87" y1="109" x2="113" y2="109" stroke="#3CDFFF" strokeWidth="0.5" opacity="0.5" />
          <line x1="87" y1="112" x2="105" y2="112" stroke="#3CDFFF" strokeWidth="0.5" opacity="0.5" />
          <line x1="87" y1="115" x2="110" y2="115" stroke="#3CDFFF" strokeWidth="0.5" opacity="0.5" />
          <circle cx="110" cy="110" r="2" fill="#4AFFD4" opacity="0.8">
            <animate attributeName="opacity" values="0.5;1;0.5" dur="1s" repeatCount="indefinite" />
          </circle>
          
          {/* Arms */}
          <path d="M70 100C70 100 50 110 45 120C40 130 45 140 50 140C55 140 60 130 65 120" fill="white" stroke="#4AFFD4" strokeWidth="2" className="tech-limb">
            <animate attributeName="d" values="M70 100C70 100 50 110 45 120C40 130 45 140 50 140C55 140 60 130 65 120;M70 100C70 100 52 112 47 122C42 132 47 142 52 142C57 142 62 132 65 122;M70 100C70 100 50 110 45 120C40 130 45 140 50 140C55 140 60 130 65 120" dur="6s" repeatCount="indefinite" />
          </path>
          <path d="M130 100C130 100 150 110 155 120C160 130 155 140 150 140C145 140 140 130 135 120" fill="white" stroke="#4AFFD4" strokeWidth="2" className="tech-limb">
            <animate attributeName="d" values="M130 100C130 100 150 110 155 120C160 130 155 140 150 140C145 140 140 130 135 120;M130 100C130 100 148 112 153 122C158 132 153 142 148 142C143 142 138 132 135 122;M130 100C130 100 150 110 155 120C160 130 155 140 150 140C145 140 140 130 135 120" dur="6s" repeatCount="indefinite" />
          </path>
          
          {/* Legs */}
          <path d="M85 155C85 155 80 175 80 180C80 185 85 190 90 190C95 190 95 185 95 180L95 155" fill="white" stroke="#4AFFD4" strokeWidth="2" className="tech-limb" />
          <path d="M115 155C115 155 120 175 120 180C120 185 115 190 110 190C105 190 105 185 105 180L105 155" fill="white" stroke="#4AFFD4" strokeWidth="2" className="tech-limb" />
          
          {/* Highlights and tech details */}
          <circle cx="85" cy="100" r="3" fill="#3CDFFF" opacity="0.8" className="tech-light">
            <animate attributeName="opacity" values="0.6;1;0.6" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle cx="115" cy="100" r="3" fill="#3CDFFF" opacity="0.8" className="tech-light">
            <animate attributeName="opacity" values="0.6;1;0.6" dur="3s" repeatCount="indefinite" begin="1.5s" />
          </circle>
          
          {/* Gradients */}
          <defs>
            <radialGradient id="helmet-gradient" cx="100" cy="70" r="28" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#B0B0FF" />
              <stop offset="80%" stopColor="#8080FF" />
              <stop offset="100%" stopColor="#4040FF" />
            </radialGradient>
            <linearGradient id="visor-gradient" x1="100" y1="50" x2="100" y2="80" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#000720" />
              <stop offset="40%" stopColor="#001440" />
              <stop offset="100%" stopColor="#000720" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      {/* Floating particles */}
      <div className="particles-container">
        {[...Array(15)].map((_, i) => (
          <div 
            key={i} 
            className="particle" 
            style={{
              '--size': `${Math.random() * 10 + 5}px`,
              '--top': `${Math.random() * 100}%`,
              '--left': `${Math.random() * 100}%`,
              '--opacity': Math.random() * 0.5 + 0.3,
              '--duration': `${Math.random() * 20 + 10}s`,
              '--delay': `${Math.random() * 5}s`,
            } as React.CSSProperties}
          ></div>
        ))}
      </div>
      
      {/* Content Overlay */}
      <div className="relative z-20 flex flex-col items-center justify-center min-h-screen px-4 py-20 text-white text-center">
        <div className={`transition-all duration-700 ${ scrolled ? 'opacity-70 scale-90' : 'opacity-100 scale-100'    }`}>
          <h1 className="text-5xl md:text-7xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4] animate-pulse-slow cybr-text">
            AI Factory
          </h1>
          <div className="w-36 h-1 mx-auto mb-8 rounded-full tech-line">
            <div className="h-full w-full bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4] loading-bar"></div>
          </div>
          <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed text-blue-50">
            Where imagination meets artificial intelligence. Share your most creative ideas and watch them come to life.
          </p>
        </div>
        
        <div className="w-full max-w-md backdrop-blur-md bg-black/50 p-8 rounded-xl border border-[#3CDFFF]/30 tech-card animate-fadeIn hover:shadow-glow transition-all duration-300 mb-8">
          <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-12 h-12 flex items-center justify-center">
            <div className="absolute w-12 h-12 bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4] rounded-full opacity-80 animate-pulse-slow"></div>
            <div className="absolute w-10 h-10 bg-black rounded-full flex items-center justify-center z-10">
              <svg className="w-6 h-6 text-[#3CDFFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          
          <div className="tech-corners"></div>
          
          <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4] tracking-wider">
            Submit Your Idea
          </h2>
          
          {submitted ? (
            <div className="bg-gradient-to-r from-green-500/10 to-teal-500/10 border border-green-500/50 rounded-lg p-5 mb-4 success-anim">
              <div className="flex items-center">
                <div className="mr-3 flex-shrink-0 w-8 h-8 bg-gradient-to-r from-green-400 to-teal-400 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-green-300 font-medium">Your idea has been transmitted to our AI Factory!</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="idea" className="flex items-center text-sm font-medium mb-2 text-left text-blue-200">
                  <svg className="w-4 h-4 mr-2 text-[#3CDFFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  Describe your AI idea:
                </label>
                <div className="relative">
                  <textarea
                    id="idea"
                    className="w-full px-4 py-3 rounded-lg bg-black/70 border-2 border-gray-700 focus:border-[#3CDFFF] focus:ring-2 focus:ring-[#3CDFFF]/30 text-white transition-all duration-200 resize-none tech-input"
                    rows={5}
                    value={idea}
                    onChange={(e) => setIdea(e.target.value)}
                    placeholder="E.g., An AI that can generate music based on your mood..."
                    required
                  />
                  <div className="absolute bottom-2 right-2 text-xs text-blue-300">{idea.length} / 500</div>
                </div>
              </div>
              <button
                type="submit"
                className="group w-full px-6 py-3 rounded-lg font-medium text-black bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4] hover:opacity-90 transition-all duration-300 transform hover:scale-[1.02] tech-button relative overflow-hidden"
              >
                <span className="relative z-10">Submit to the Galaxy</span>
                <div className="absolute inset-0 flex items-center tech-btn-effect">
                  <div className="h-full w-0 bg-white/20 transform -skew-x-12 group-hover:animate-shine"></div>
                </div>
              </button>
            </form>
          )}
          
          <div className="mt-6 pt-4 border-t border-white/10">
            <p className="text-sm flex items-center justify-center">
              <svg className="w-4 h-4 mr-1 text-[#3CDFFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Want to see what we've already built? </span>
              <Link href="/dashboard" className="ml-1 text-[#3CDFFF] hover:text-[#4AFFD4] transition-colors duration-200 hover:underline">
                Check our dashboard
              </Link>
            </p>
          </div>
        </div>
        
        {/* Contact options */}
        <div className="w-full max-w-md backdrop-blur-md bg-black/50 p-6 rounded-xl border border-[#3CDFFF]/30 tech-card animate-fadeIn hover:shadow-glow transition-all duration-300 mb-8">
          <h3 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4] tracking-wider">
            Connect With Us
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a href="mailto:contact@isyncso.com" className="flex items-center p-3 rounded-lg border border-white/10 hover:border-[#3CDFFF]/50 bg-black/30 transition-all duration-200 group">
              <div className="mr-3 w-10 h-10 rounded-full bg-black flex items-center justify-center border border-[#3CDFFF]/30">
                <svg className="w-5 h-5 text-[#3CDFFF] group-hover:animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="text-left">
                <div className="text-sm font-medium text-gray-300">Email Us</div>
                <div className="text-xs text-[#3CDFFF]">contact@isyncso.com</div>
              </div>
            </a>
            <a href="https://twitter.com/isyncso" target="_blank" rel="noopener noreferrer" className="flex items-center p-3 rounded-lg border border-white/10 hover:border-[#3CDFFF]/50 bg-black/30 transition-all duration-200 group">
              <div className="mr-3 w-10 h-10 rounded-full bg-black flex items-center justify-center border border-[#3CDFFF]/30">
                <svg className="w-5 h-5 text-[#3CDFFF] group-hover:animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                </svg>
              </div>
              <div className="text-left">
                <div className="text-sm font-medium text-gray-300">Twitter</div>
                <div className="text-xs text-[#3CDFFF]">@isyncso</div>
              </div>
            </a>
            <a href="https://discord.gg/isyncso" target="_blank" rel="noopener noreferrer" className="flex items-center p-3 rounded-lg border border-white/10 hover:border-[#3CDFFF]/50 bg-black/30 transition-all duration-200 group">
              <div className="mr-3 w-10 h-10 rounded-full bg-black flex items-center justify-center border border-[#3CDFFF]/30">
                <svg className="w-5 h-5 text-[#3CDFFF] group-hover:animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10.5a2 2 0 11-4 0 2 2 0 014 0zm5 3.5a2 2 0 100-4 2 2 0 000 4zm-10 0a2 2 0 100-4 2 2 0 000 4zm-6-2a1 1 0 100-2 1 1 0 000 2z" />
                </svg>
              </div>
              <div className="text-left">
                <div className="text-sm font-medium text-gray-300">Discord</div>
                <div className="text-xs text-[#3CDFFF]">Join our community</div>
              </div>
            </a>
            <a href="https://github.com/isyncso" target="_blank" rel="noopener noreferrer" className="flex items-center p-3 rounded-lg border border-white/10 hover:border-[#3CDFFF]/50 bg-black/30 transition-all duration-200 group">
              <div className="mr-3 w-10 h-10 rounded-full bg-black flex items-center justify-center border border-[#3CDFFF]/30">
                <svg className="w-5 h-5 text-[#3CDFFF] group-hover:animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                </svg>
              </div>
              <div className="text-left">
                <div className="text-sm font-medium text-gray-300">GitHub</div>
                <div className="text-xs text-[#3CDFFF]">Check our projects</div>
              </div>
            </a>
          </div>
        </div>
        
        <div className="mt-16 text-sm text-gray-400">
          <p>© {new Date().getFullYear()} iSyncSO AI Factory | <Link href="/terms" className="hover:underline">Terms</Link> | <Link href="/privacy" className="hover:underline">Privacy</Link></p>
        </div>
      </div>
      
      {/* CSS for space, stars, and enhanced tech animations */}
      <style jsx>{`
        .tech-grid { background: 
            linear-gradient(90deg, rgba(60, 223, 255, 0.05) 1px, transparent 1px),
            linear-gradient(0deg, rgba(60, 223, 255, 0.05) 1px, transparent 1px);
          background-size: 20px 20px;,
  opacity: 0.4;
            }
        
        .tech-pattern-overlay { background-image: radial-gradient(rgba(60, 223, 255, 0.4) 1px, transparent 1px);
          background-size: 8px 8px;,
  animation: rotatePattern 120s linear infinite;
            }
        
        .planet { box-shadow: 0 0 30px 5px rgba(60, 223, 255, 0.3);
            }
        
        .planet::after { content: '';,
  position: absolute;,
  inset: -10px;
          border-radius: 50%;,
  background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.3), transparent 50%);
          opacity: 0.4;
            }
        
        .stars, .stars2, .stars3 { position: fixed;,
  top: 0;,
  left: 0;,
  width: 100%;,
  height: 100%;
          pointer-events: none;
            }
        
        .stars { background: transparent url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGZpbGw9IndoaXRlIiBjeD0iNTAiIGN5PSI1MCIgcj0iMSIvPjwvc3ZnPg==') repeat;
          background-size: 200px 200px;,
  animation: animateStars 50s linear infinite;
            }
        
        .stars2 { background: transparent url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGZpbGw9IndoaXRlIiBjeD0iNTAiIGN5PSI1MCIgcj0iMC41Ii8+PC9zdmc+') repeat;
          background-size: 300px 300px;,
  animation: animateStars 100s linear infinite;
            }
        
        .stars3 { background: transparent url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGZpbGw9IndoaXRlIiBjeD0iNTAiIGN5PSI1MCIgcj0iMC4yNSIvPjwvc3ZnPg==') repeat;
          background-size: 400px 400px;,
  animation: animateStars 150s linear infinite;
            }
        
        .nebula { position: absolute;
          border-radius: 50%;,
  filter: blur(60px);,
  opacity: 0.15;
            }
        
        .nebula-1 { top: 20%;,
  left: 25%;,
  width: 600px;,
  height: 600px;,
  background: radial-gradient(circle, rgba(60, 223, 255, 0.6) 0%, rgba(43, 58, 255, 0.1) 70%);
          animation: pulseNebula 20s ease-in-out infinite;,
  opacity: 0.1;
            }
        
        .nebula-2 { bottom: 10%;,
  right: 15%;,
  width: 500px;,
  height: 500px;,
  background: radial-gradient(circle, rgba(74, 255, 212, 0.6) 0%, rgba(43, 58, 255, 0.1) 70%);
          animation: pulseNebula 15s ease-in-out infinite reverse;,
  opacity: 0.1;
            }
        
        .nebula-3 { top: 50%;,
  right: 30%;,
  width: 400px;,
  height: 400px;,
  background: radial-gradient(circle, rgba(138, 43, 226, 0.6) 0%, rgba(43, 58, 255, 0.1) 70%);
          animation: pulseNebula 25s ease-in-out infinite;,
  opacity: 0.1;
            }
        
        /* Circuit board effect */
        .circuit-container { opacity: 0.5;,
  filter: blur(0.5px);
            }
        
        .circuit { position: absolute;,
  height: 2px;,
  background: linear-gradient(90deg, transparent, rgba(60, 223, 255, 0.8), transparent);
          opacity: 0.3;
            }
        
        .circuit-1 { width: 60%;,
  top: 30%;,
  left: 0;,
  animation: circuit-anim-1 10s infinite linear;
            }
        
        .circuit-2 { width: 30%;,
  top: 60%;,
  right: 0;,
  animation: circuit-anim-2 8s infinite linear;
            }
        
        .circuit-3 { width: 45%;,
  top: 80%;,
  left: 20%;,
  animation: circuit-anim-3 12s infinite linear;
            }
        
        @keyframes circuit-anim-1 {
          0% { transform: translateX(-100%);
              }
          100% { transform: translateX(100vw);
              }
        }
        
        @keyframes circuit-anim-2 {
          0% { transform: translateX(100vw);
              }
          100% { transform: translateX(-100%);
              }
        }
        
        @keyframes circuit-anim-3 {
          0% { transform: translateX(-100%);
              }
          100% { transform: translateX(100vw);
              }
        }
        
        @keyframes animateStars {
          0% { transform: translateY(0);
              }
          100% { transform: translateY(1000px);
              }
        }
        
        @keyframes pulseNebula {
          0%, 100% { transform: scale(1);,
  opacity: 0.15;
              }
          50% { transform: scale(1.1);,
  opacity: 0.2;
              }
        }
        
        .digital-particles-container { position: absolute;,
  inset: 0;
          z-index: 5;,
  overflow: hidden;
            }
        
        .digital-particle { position: absolute;,
  width: var(--size);,
  height: var(--size);,
  background: var(--color);,
  top: var(--top);,
  left: var(--left);,
  opacity: var(--opacity);
          border-radius: 1px;
          box-shadow: 0 0 5px 1px var(--color);,
  animation: digital-float var(--speed) ease-in-out infinite;
          animation-delay: var(--delay);
            }
        
        @keyframes digital-float {
          0%, 100% { transform: translateY(0) scale(1);
              }
          50% { transform: translateY(-100px) scale(0.8);
              }
        }
        
        .tech-astronaut { filter: drop-shadow(0 0 15px rgba(60, 223, 255, 0.3));
            }
        
        .tech-text { font-family: 'Courier New', monospace;
            }
        
        .tech-element { filter: drop-shadow(0 0 2px rgba(60, 223, 255, 0.8));
            }
        
        .tech-lines { stroke-dasharray: 5;,
  animation: dash 20s linear infinite;
            }
        
        .tech-dot { filter: drop-shadow(0 0 3px rgba(60, 223, 255, 0.8));
            }
        
        .tech-light { filter: drop-shadow(0 0 5px rgba(60, 223, 255, 0.8));
            }
        
        .tech-suit, .tech-limb { filter: drop-shadow(0 0 2px rgba(74, 255, 212, 0.5));
            }
        
        .tech-screen { filter: drop-shadow(0 0 3px rgba(60, 223, 255, 0.5));
            }
        
        .tech-backpack { filter: drop-shadow(0 0 4px rgba(74, 255, 212, 0.5));
            }
        
        .pulse-effect { animation: pulse-glow 4s ease-in-out infinite;
            }
        
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.1;,
  transform: scale(0.8);
              }
          50% { opacity: 0.3;,
  transform: scale(1);
              }
        }
        
        @keyframes dash {
          to { stroke-dashoffset: 100;
              }
        }
        
        @keyframes rotatePattern {
          0% { transform: rotate(0deg);     }
          100% { transform: rotate(360deg);     }
        }
        
        @keyframes float-astronaut {
          0%, 100% { transform: translateY(0) rotate(1deg);
              }
          50% { transform: translateY(-15px) rotate(-1deg);
              }
        }
        
        .animate-float-astronaut { animation: float-astronaut 8s ease-in-out infinite;
            }
        
        .animate-float-slow { animation: float 8s ease-in-out infinite;
            }
        
        .animate-float-medium { animation: float 6s ease-in-out infinite;
          animation-delay: 1s;
            }
        
        .animate-fadeIn { animation: fadeIn 0.8s ease-out;
            }
        
        .cybr-text { text-shadow: 0 0 10px rgba(60, 223, 255, 0.5);
          letter-spacing: 1px;
            }
        
        .tech-line { position: relative;,
  background: rgba(60, 223, 255, 0.3);
          overflow: hidden;
          box-shadow: 0 0 10px rgba(60, 223, 255, 0.5);
            }
        
        .loading-bar { animation: loading-bar 3s ease-in-out infinite;
            }
        
        @keyframes loading-bar {
          0%, 100% { width: 0%;
              }
          50% { width: 100%;
              }
        }
        
        .tech-card { position: relative;
          box-shadow: 0 0 20px rgba(60, 223, 255, 0.2);
          background-image: 
            linear-gradient(45deg, rgba(0, 0, 0, 0.9) 25%, rgba(10, 15, 30, 0.9) 25%),
            linear-gradient(-45deg, rgba(0, 0, 0, 0.9) 25%, rgba(10, 15, 30, 0.9) 25%),
            linear-gradient(45deg, rgba(10, 15, 30, 0.9) 75%, rgba(0, 0, 0, 0.9) 75%),
            linear-gradient(-45deg, rgba(10, 15, 30, 0.9) 75%, rgba(0, 0, 0, 0.9) 75%);
          background-size: 20px 20px;
          background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
            }
        
        .tech-corners::before,
        .tech-corners::after { content: '';,
  position: absolute;,
  width: 20px;,
  height: 20px;,
  border: 2px solid #3CDFFF;,
  opacity: 0.6;
            }
        
        .tech-corners::before { top: 0;,
  left: 0;
          border-right: none;
          border-bottom: none;
            }
        
        .tech-corners::after { bottom: 0;,
  right: 0;
          border-left: none;
          border-top: none;
            }
        
        .tech-input { box-shadow: 0 0 15px rgba(60, 223, 255, 0.1) inset;
            }
        
        .tech-input:focus { box-shadow: 0 0 15px rgba(60, 223, 255, 0.3) inset;
            }
        
        .tech-button { box-shadow: 0 0 15px rgba(60, 223, 255, 0.3);
            }
        
        .tech-button:hover { box-shadow: 0 0 20px rgba(60, 223, 255, 0.5);
            }
        
        @keyframes shine {
          0% { width: 0; left: -30%;     }
          100% { width: 30%; left: 100%;     }
        }
        
        .group-hover\\:animate-shine { animation: none;
            }
        
        .group:hover .group-hover\\:animate-shine { animation: shine 1s ease;
            }
        
        .success-anim { animation: success-pulse 2s ease-in-out;
            }
        
        @keyframes success-pulse {
          0% { transform: scale(0.95); opacity: 0;     }
          50% { transform: scale(1.05); opacity: 1;     }
          100% { transform: scale(1); opacity: 1;     }
        }
        
        @keyframes fadeIn {
          from { opacity: 0;,
  transform: translateY(20px);
              }
          to { opacity: 1;,
  transform: translateY(0);
              }
        }
        
        /* Dark cinematic vignette overlay */
        .tech-card::before { content: '';,
  position: absolute;,
  inset: 0;,
  background: radial-gradient(circle at center, transparent 30%, rgba(0, 0, 0, 0.6) 100%);
          pointer-events: none;
          z-index: 1;
            }
        
        .tech-card > * { position: relative;
          z-index: 2;
            }
        
        /* Global cinematic vignette */
        .min-h-screen::after { content: '';,
  position: fixed;,
  inset: 0;,
  background: radial-gradient(circle at center, transparent 10%, rgba(0, 0, 0, 0.8) 100%);
          pointer-events: none;
          z-index: 1;
            }
      `}</style>
    </div>
  );
} 