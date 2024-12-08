/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#00AEEF',
        secondary: {
          light: '#86C5F4',
          dark: '#003B66',
        },
        'secondary-darker': '#1a1a1a',
        highlight: '#3DCC91',
      },
      fontFamily: {
        headline: ['Inter', 'Poppins', 'sans-serif'],
        body: ['Roboto', 'Lato', 'sans-serif'],
      },
    },
    variants: {
      extend: {
        backgroundColor: ['dark'],
      },
    },
  },
  plugins: [],
};
