/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#070707',
          panel: '#121212',
          red: '#e11d2f',
          soft: '#f5f5f5',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Manrope"', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(225,29,47,.2), 0 20px 60px rgba(225,29,47,.15)',
      },
    },
  },
  plugins: [],
};
