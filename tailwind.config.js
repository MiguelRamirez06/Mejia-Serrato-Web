/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: '#A68A37',
        beige: '#D9CBA3',
        bronze: '#A67841',
        smoke: '#F2F2F2',
        ink: '#0D0D0D',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      transitionTimingFunction: {
        cinematic: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      boxShadow: {
        gold: '0 0 30px rgba(166,138,55,0.6)',
        card: '0 30px 80px rgba(0,0,0,0.5)',
      },
      maxWidth: {
        content: '1200px',
      },
    },
  },
  plugins: [],
}