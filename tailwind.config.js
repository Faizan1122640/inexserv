/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'sky-primary':   '#04A552',
        'sky-secondary': '#0f2b48',
        'sky-dark-200':  '#1e3a5f',
        'sky-dark-400':  '#0f2b48',
        'dark-200':      '#0f2b48',
        'gray-100':      '#94a3b8',
        'yellow-primary':'#f59e0b',
      },
      maxWidth: {
        '1800': '1800px',
      },
      screens: {
        'xs': '480px',
        '2xl': '1536px',
      },
      leading: {
        '14': '3.5rem',
      }
    },
  },
  plugins: [],
}
