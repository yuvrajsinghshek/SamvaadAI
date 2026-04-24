/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#030712",
        card: "#111827",
        primary: "#6366f1",
        secondary: "#a5b4fc",
        accent: "#4f46e5",
      },
      backgroundImage: {
        'grid-pattern': "radial-gradient(circle, rgba(99, 102, 241, 0.1) 1px, transparent 1px)",
      },
      backgroundSize: {
        'grid-size': '30px 30px',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
