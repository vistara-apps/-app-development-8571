/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: 'hsl(220 20% 98%)',
        accent: 'hsl(150 60% 50%)',
        primary: 'hsl(210 40% 60%)',
        surface: 'hsl(220 20% 100%)',
        'text-primary': 'hsl(220 20% 10%)',
        'text-secondary': 'hsl(220 15% 35%)',
        dark: {
          bg: 'hsl(220 20% 8%)',
          surface: 'hsl(220 20% 12%)',
          'surface-2': 'hsl(220 20% 16%)',
          accent: 'hsl(150 60% 50%)',
          primary: 'hsl(210 40% 60%)',
          'text-primary': 'hsl(220 20% 90%)',
          'text-secondary': 'hsl(220 15% 65%)',
        }
      },
      borderRadius: {
        'lg': '16px',
        'md': '10px',
        'sm': '6px',
      },
      spacing: {
        'sm': '8px',
        'md': '12px',
        'lg': '20px',
        'xl': '24px',
      },
      boxShadow: {
        'card': '0 8px 24px hsla(220, 15%, 10%, 0.12)',
        'card-dark': '0 8px 24px hsla(220, 15%, 0%, 0.3)',
      },
      animation: {
        'slide-in': 'slideIn 250ms cubic-bezier(0.22,1,0.36,1)',
        'fade-in': 'fadeIn 150ms cubic-bezier(0.22,1,0.36,1)',
      },
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      }
    },
  },
  plugins: [],
  darkMode: 'class',
}