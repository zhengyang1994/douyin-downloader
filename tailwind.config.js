/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          black: '#0D0D0D',
          pink: '#FF0050',
          cyan: '#00F2EA',
          'pink-dark': '#CC0040',
          'cyan-dark': '#00C0BA',
        }
      },
      fontFamily: {
        display: ['"Noto Sans SC"', 'sans-serif'],
        body: ['"Noto Sans SC"', 'sans-serif'],
      },
      boxShadow: {
        'glow-pink': '0 0 20px rgba(255, 0, 80, 0.4), 0 0 40px rgba(255, 0, 80, 0.2)',
        'glow-cyan': '0 0 20px rgba(0, 242, 234, 0.4), 0 0 40px rgba(0, 242, 234, 0.2)',
        'glow-inner': 'inset 0 0 20px rgba(255, 0, 80, 0.1)',
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255, 0, 80, 0.4)' },
          '50%': { boxShadow: '0 0 40px rgba(255, 0, 80, 0.7)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}