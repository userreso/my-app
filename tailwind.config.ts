import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      animation: {
        'spin': 'spin 1s linear infinite',
        'ping': 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
        'lightning': 'lightning 2s infinite',
        'rain-drop': 'rainfall 1s linear infinite',
        'nuclear-explode': 'nuclearExplode 2s forwards',
        'jumpscare': 'jumpscare 0.5s ease-in-out',
      },
      keyframes: {
        spin: {
          'from': { transform: 'rotate(0deg)' },
          'to': { transform: 'rotate(360deg)' },
        },
        ping: {
          '75%, 100%': {
            transform: 'scale(4)',
            opacity: '0',
          },
        },
        lightning: {
          '0%, 100%': { opacity: '0' },
          '10%, 30%': { opacity: '0.6' },
          '5%, 25%': { opacity: '0.95' },
        },
        rainfall: {
          '0%': { transform: 'translateY(-10px)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        nuclearExplode: {
          '0%': { 
            transform: 'scale(1)',
            opacity: '1',
          },
          '50%': {
            transform: 'scale(15)',
            opacity: '0.8',
          },
          '100%': {
            transform: 'scale(20)',
            opacity: '0',
          }
        },
        jumpscare: {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '50%': { transform: 'scale(1.2)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
      },
      scale: {
        '175': '1.75',
        '200': '2',
      },
      width: {
        '120': '30rem',
      },
      height: {
        '120': '30rem',
      },
      transitionProperty: {
        'all': 'all',
      },
      transitionDuration: {
        '300': '300ms',
      },
    },
  },
  plugins: [],
}

export default config