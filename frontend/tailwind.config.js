/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'caveat': 'Caveat, cursive',
        'young-serif': 'Young Serif, serif',
      }
    }
  },
  plugins: [],
}

