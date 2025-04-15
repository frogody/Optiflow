/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
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
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
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
      },
    },
  },
  plugins: [],
} 