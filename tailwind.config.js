/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        indigo: {
          DEFAULT: '#3A3ABF',
          light: '#5B5BD6',
          dim: '#EEEEFF',
        },
        lavender: {
          DEFAULT: '#9B87F5',
          soft: '#DDD8FD',
        },
        teal: {
          DEFAULT: '#7EC8C8',
          soft: '#D0EEEE',
        },
        bg: '#F8F7FC',
        surface: '#FFFFFF',
        'surface-alt': '#F2F0FA',
        border: '#E8E4F4',
        'border-soft': '#F0EEF8',
        'text-1': '#17152E',
        'text-2': '#4E4B6A',
        'text-3': '#9390AC',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        sm: '8px',
        md: '14px',
        lg: '20px',
        xl: '28px',
      },
    },
  },
  plugins: [],
}
