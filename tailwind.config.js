/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pokeRed: '#B3260A',
        pokeBg: '#F4F1EA',
        pokeCard: '#FBF3DF',      
        pokeCardHover: '#FCE9B2', 
        pokeBorder: '#3B2A1A',    
        badgeBg: '#EADFC6',       
      },
    },
  },
  plugins: [],
}