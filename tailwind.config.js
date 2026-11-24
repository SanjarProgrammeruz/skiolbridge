/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#101216',
        surface: '#191D24',
        'surface-2': '#222833',
        'surface-3': '#2A3140',
        accent: '#A99BEF',
        'accent-2': '#9CCDBB',
        'text-primary': '#F2F1F7',
        'text-secondary': '#A0A4B1',
        'text-muted': '#636775',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
