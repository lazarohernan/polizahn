/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Colores base
        'white': 'var(--color-white)',
        'black': 'var(--color-black)',
        'green-light': 'var(--color-green-light)',
        'navy': 'var(--color-navy)',
        'blue': 'var(--color-blue)',
        'blue-light': 'var(--color-blue-light)',
        'green': 'var(--color-green)',
        // Escala de grises
        gray: {
          50: 'var(--color-gray-50)',
          100: 'var(--color-gray-100)',
          200: 'var(--color-gray-200)',
          300: 'var(--color-gray-300)',
          400: 'var(--color-gray-400)',
          500: 'var(--color-gray-500)',
          600: 'var(--color-gray-600)',
          700: 'var(--color-gray-700)',
          800: 'var(--color-gray-800)',
          900: 'var(--color-gray-900)',
        },
        // Colores semánticos
        'background': 'var(--color-background)',
        'text': {
          DEFAULT: 'var(--color-text)',
          secondary: 'var(--color-text-secondary)',
          inverse: 'var(--color-text-inverse)',
        },
        'heading': 'var(--color-heading)',
        'primary': {
          DEFAULT: 'var(--color-primary)',
          hover: 'var(--color-primary-hover)',
        },
        'accent': 'var(--color-accent)',
        'link': {
          DEFAULT: 'var(--color-link)',
          hover: 'var(--color-link-hover)',
        },
        'border': {
          DEFAULT: 'var(--color-border)',
          divider: 'var(--color-divider)',
        },
        'navbar': {
          DEFAULT: 'var(--color-navbar-bg)',
          shadow: 'var(--color-navbar-shadow)',
        },
        'input': {
          bg: 'var(--input-bg)',
          border: 'var(--input-border)',
          text: 'var(--input-text)',
          placeholder: 'var(--input-placeholder)',
        },
        'container': {
          bg: 'var(--container-bg)',
          border: 'var(--container-border)',
          shadow: 'var(--container-shadow)',
        }
      },
      boxShadow: {
        'lg': '0 8px 32px 0 var(--container-shadow)',
        'navbar': '0 4px 30px var(--color-navbar-shadow)'
      },
      keyframes: {
        fade: {
          '0%, 5%': { opacity: '0' },
          '10%, 28%': { opacity: '1' },
          '33%, 100%': { opacity: '0' }
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        },
        'fade-out': {
          '0%': { opacity: '1', transform: 'scale(1)' },
          '100%': { opacity: '0', transform: 'scale(0.95)' }
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        }
      },
      animation: {
        'fade': 'fade 7.5s infinite',
        'fade-delay-1': 'fade 7.5s infinite 2.5s',
        'fade-delay-2': 'fade 7.5s infinite 5s',
        'fade-in': 'fade-in 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        'fade-out': 'fade-out 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-up': 'slide-up 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
      },
      fontSize: {
        'title-xl': '2.5rem',    // 40px
        'title-lg': '2.0rem',    // 32px
        'title-md': '1.5rem',    // 24px
        'text-lg': '1.125rem',   // 18px
        'text-md': '1rem',       // 16px
        'text-sm': '0.875rem'    // 14px
      }
    },
  },
  plugins: [],
}
