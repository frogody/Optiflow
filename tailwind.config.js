/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './agent-examples/**/*.{js,ts,jsx,tsx,mdx}',
    './agent-server/**/*.{js,ts,jsx,tsx,mdx}',
    './voice-agent/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'dark': {
          DEFAULT: '#0A0A0F',
          '50': '#1A1A23',
          '100': '#15151C',
          '200': '#111118',
          '300': '#0D0D12',
          '400': '#0A0A0F',
        },
        'primary': {
          DEFAULT: '#3CDFFF',
          'dark': '#2B9EFF',
        },
        'secondary': {
          DEFAULT: '#4AFFD4',
          'dark': '#32DBBA',
        },
        'accent': {
          DEFAULT: '#2B3AFF',
          'dark': '#1F2BB3',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-node': 'linear-gradient(135deg, var(--tw-gradient-stops))',
        'gradient-glow': 'linear-gradient(rgba(60, 223, 255, 0.1) 0%, rgba(74, 255, 212, 0.1) 100%)',
      },
      boxShadow: {
        'neon': '0 0 20px rgba(60, 223, 255, 0.3)',
        'neon-strong': '0 0 30px rgba(60, 223, 255, 0.5)',
        'neon-secondary': '0 0 20px rgba(74, 255, 212, 0.3)',
        'glow': '0 0 15px rgba(60, 223, 255, 0.4), 0 0 5px rgba(74, 255, 212, 0.3)',
        'glow-intense': '0 0 25px rgba(60, 223, 255, 0.6), 0 0 10px rgba(74, 255, 212, 0.5)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-in-slow': 'fadeIn 1s ease-in-out',
        'slide-in': 'slideIn 0.5s ease-out',
        'slide-out': 'slideOut 0.5s ease-in',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 3s infinite',
        'float': 'float 6s ease-in-out infinite',
        'flow': 'flow 3s linear infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
      },
      keyframes: {
        flow: {
          '0%': { 'stroke-dashoffset': '100%' },
          '100%': { 'stroke-dashoffset': '-100%' },
        },
        glowPulse: {
          '0%, 100%': {
            filter: 'drop-shadow(0 0 5px rgba(60, 223, 255, 0.3))',
          },
          '50%': {
            filter: 'drop-shadow(0 0 15px rgba(60, 223, 255, 0.6))',
          },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideOut: {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(20px)', opacity: '0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
    },
  },
  plugins: [],
} 