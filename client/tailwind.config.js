/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{svelte,js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      brightness: {
        '40': '.40',
      },
      backgroundColor: {
        'primary-green': '#245811',
        'secondary-green': '#387921',
        'primary-red': '#970000',
        'primary-white': '#FAF8ED',
        'primary-brown': '#E7DFB7'
      },
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
        'poppins-light': ['Poppins-Light', 'sans-serif'],
      },
      borderColor: {
        'primary-green': '#245811'
      },
    },
  },
  plugins: [],
}

