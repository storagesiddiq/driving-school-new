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
          light: '#B085D6',    
          DEFAULT: '#7B1FA2', 
          dark: '#4A1164',    
        },
      },
      boxShadow: {
        'left': '4px 0 18px rgba(0, 0, 0, 0.2)',
        'down': '0 4px 18px rgba(0, 0, 0, 0.2)',
      },
    },
  },
  plugins: [],
}

