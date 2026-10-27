/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        motive: {
          bg: '#0A0A0C',
          surface: '#121216',
          surfaceLight: '#18181E',
          surfaceBorder: '#23232C',
          red: '#DC2626',
          redBright: '#EF4444',
          redDark: '#991B1B',
          redGlow: 'rgba(239, 68, 68, 0.25)',
          emerald: '#10B981',
          cyan: '#0EA5E9',
          amber: '#F59E0B',
          gray: {
            400: '#94A3B8',
            500: '#64748B',
            600: '#475569',
            700: '#334155',
            800: '#1E293B',
            900: '#0F172A',
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-glow': 'radial-gradient(circle at 50% 20%, rgba(220, 38, 38, 0.15) 0%, transparent 60%)',
      }
    },
  },
  plugins: [],
}
