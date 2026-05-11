/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          green: '#00A651',
          'green-dark': '#007A3D',
          'green-light': '#00C962',
          gold: '#FFD700',
          'gold-dark': '#E5C200',
          dark: '#0A0E1A',
          surface: '#131826',
          'surface-2': '#1a2030',
          'dark-card': '#111827',
          'dark-border': '#1F2937',
          'dark-muted': '#374151',
        },
      },
      fontFamily: {
        sans: ['Space Grotesk', 'system-ui', 'sans-serif'],
        display: ['"Archivo Black"', 'sans-serif'],
        archivo: ['Archivo', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'pulse-green': 'pulseGreen 2s ease-in-out infinite',
        'slide-up': 'slideUp 0.4s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'bounce-in': 'bounceIn 0.5s cubic-bezier(0.34,1.56,0.64,1)',
        'spin-slow': 'spin 3s linear infinite',
        'confetti': 'confettiFall 1s ease-out forwards',
        'scale-in': 'scaleIn 0.3s cubic-bezier(0.34,1.56,0.64,1)',
      },
      keyframes: {
        pulseGreen: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(0,166,81,0.4)' },
          '50%': { boxShadow: '0 0 0 12px rgba(0,166,81,0)' },
        },
        slideUp: {
          from: { transform: 'translateY(20px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        bounceIn: {
          from: { transform: 'scale(0.8)', opacity: '0' },
          to: { transform: 'scale(1)', opacity: '1' },
        },
        scaleIn: {
          from: { transform: 'scale(0.9)', opacity: '0' },
          to: { transform: 'scale(1)', opacity: '1' },
        },
        confettiFall: {
          '0%': { transform: 'translateY(-20px) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(100px) rotate(720deg)', opacity: '0' },
        },
      },
      backgroundImage: {
        'field-gradient': 'linear-gradient(135deg, #0A0E1A 0%, #0d1a0d 50%, #0A0E1A 100%)',
        'gold-gradient': 'linear-gradient(135deg, #FFD700, #FFA500)',
        'green-gradient': 'linear-gradient(135deg, #00A651, #007A3D)',
        'card-gradient': 'linear-gradient(145deg, #111827, #1F2937)',
      },
    },
  },
  plugins: [],
}
