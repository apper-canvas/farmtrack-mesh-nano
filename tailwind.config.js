/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4A7C59',
          50: '#E6F2E8',
          100: '#CCE5D1',
          500: '#4A7C59',
          600: '#3D6549',
          700: '#2F4E39'
        },
        secondary: {
          DEFAULT: '#8B7355',
          50: '#F5F2EE',
          100: '#EBE4DD',
          500: '#8B7355',
          600: '#756049',
          700: '#5F4C3D'
        },
        accent: {
          DEFAULT: '#F59E0B',
          50: '#FEF7E8',
          100: '#FDEFD1',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309'
        },
        surface: '#FFFFFF',
        background: '#F5F3EF',
        success: '#059669',
        warning: '#F59E0B',
        error: '#DC2626',
        info: '#3B82F6'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif']
      },
      fontSize: {
        'xs': '12px',
        'sm': '14px',
        'base': '16px',
        'lg': '20px',
        'xl': '25px',
        '2xl': '31px'
      },
      borderRadius: {
        'card': '12px',
        'button': '8px'
      },
      boxShadow: {
        'card': '0 2px 4px rgba(0, 0, 0, 0.08)',
        'elevated': '0 8px 16px rgba(0, 0, 0, 0.12)'
      }
    },
  },
  plugins: [],
}