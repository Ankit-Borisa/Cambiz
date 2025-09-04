/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBlue: "#0A122A",
        lightBlue: "#9192FF",
        bg1: "#202856",
        bg2: "#03131E"
      },
      boxShadow: {
        'custom': 'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px',
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography")
  ],
}
